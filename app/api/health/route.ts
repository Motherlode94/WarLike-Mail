import {env} from 'cloudflare:workers';

export const dynamic='force-dynamic';

export async function GET() {
  const configured=Boolean(env.WARLIKE_SERVER_URL && env.WARLIKE_SERVER_GATE && env.WARLIKE_BRIDGE_KEY);
  let targetValid=false;
  try{
    const target=new URL(String(env.WARLIKE_SERVER_URL||''));
    targetValid=target.origin==='https://warlike-server.vikktor7.chatgpt.site';
  }catch{
    targetValid=false;
  }
  const signingKeyValid=typeof env.WARLIKE_BRIDGE_KEY==='string' && env.WARLIKE_BRIDGE_KEY.length>=32;
  const ready=configured&&targetValid&&signingKeyValid;
  return Response.json({
    service:'warlike-mail',
    ready,
    configuration:{
      serverConfigured:Boolean(env.WARLIKE_SERVER_URL),
      targetValid,
      serviceGateConfigured:Boolean(env.WARLIKE_SERVER_GATE),
      signingKeyValid
    },
    upstreamVerified:false,
    mailTransport:'internal-only'
  },{status:ready?200:503,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
