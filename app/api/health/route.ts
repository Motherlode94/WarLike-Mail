import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
const ALLOWED=new Set(['https://warlike-server.vikktor7.chatgpt.site','https://warlike-server.pages.dev']);
export async function GET(){
  const source=String(env.WARLIKE_SERVER_URL||'');
  let origin='',targetValid=false;
  try{const url=new URL(source);origin=url.origin;targetValid=ALLOWED.has(origin)}catch{}
  const privateServer=origin==='https://warlike-server.vikktor7.chatgpt.site';
  const serverConfigured=!!source,serviceGateConfigured=!!env.WARLIKE_SERVER_GATE;
  const signingKeyValid=typeof env.WARLIKE_BRIDGE_KEY==='string'&&env.WARLIKE_BRIDGE_KEY.length>=32;
  const configured=serverConfigured&&targetValid&&signingKeyValid&&(!privateServer||serviceGateConfigured);
  let upstreamReady=false,upstreamReachable=false;
  if(configured){
    try{
      const response=await fetch(origin+'/api/health',{headers:{...(privateServer?{'OAI-Sites-Authorization':'Bearer '+env.WARLIKE_SERVER_GATE}:{})},redirect:'error',signal:AbortSignal.timeout(3500)});
      upstreamReachable=true;
      if(response.ok&&response.headers.get('content-type')?.includes('application/json')){
        const payload=await response.json() as {service?:string;ready?:boolean};
        upstreamReady=payload.service==='warlike-server'&&payload.ready===true;
      }
    }catch{}
  }
  const ready=configured&&upstreamReady;
  return Response.json({service:'warlike-mail',ready,configuration:{serverConfigured,targetValid,serviceGateConfigured:privateServer?serviceGateConfigured:null,signingKeyValid},upstreamVerified:upstreamReady,upstreamReachable,signedMailboxExchangeVerified:false,mailTransport:'internal-only'}, {status:ready?200:503,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
