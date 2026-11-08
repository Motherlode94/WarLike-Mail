import {env} from 'cloudflare:workers';
import {readJsonObject,errorResponse,HttpError} from '@/lib/security';
import {callWarLike,extractSession,WARLIKE_COOKIE} from '@/lib/warlike-session-client';
import {cookies} from 'next/headers';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 try{
  const url=new URL(request.url);
  if(env.WARLIKE_AUTH_ENABLED!=='true')throw new HttpError(404,'Service indisponible.');
  if(url.protocol!=='https:'||request.headers.get('origin')!==url.origin||request.headers.get('sec-fetch-site')==='cross-site')throw new HttpError(403,'Origine refusée.');
  const data=await readJsonObject(request,2048),config={server:env.WARLIKE_SERVER_URL,gate:env.WARLIKE_SERVER_GATE,service:env.WARLIKE_SERVER,clientIp:request.headers.get('cf-connecting-ip')||undefined};
  if(data.action==='login'){
   const res=await callWarLike(config,'/api/warlike-auth/login',{method:'POST',body:JSON.stringify({login:data.login,password:data.password})});
   if(!res.ok)throw new HttpError(res.status,res.status===429?'Trop de tentatives. Réessaie plus tard.':'Identifiant ou mot de passe incorrect.');
   const token=extractSession(res);
   const result=await res.json() as {mustChange?:boolean};
   return Response.json({ok:true,mustChange:result.mustChange===true},{headers:{'Cache-Control':'private, no-store','Set-Cookie':`${WARLIKE_COOKIE}=${token}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Lax`}});
  }
  if(data.action==='password'){
   const token=(await cookies()).get(WARLIKE_COOKIE)?.value;if(!token)throw new HttpError(401,'Connexion requise.');
   const res=await callWarLike(config,'/api/warlike-auth/password',{method:'POST',token,body:JSON.stringify({currentPassword:data.currentPassword,newLogin:data.newLogin,newPassword:data.newPassword})});
   const result=await res.json() as {error?:string};if(!res.ok)throw new HttpError(res.status,result.error||'Modification impossible.');
   return Response.json({ok:true},{headers:{'Cache-Control':'private, no-store','Set-Cookie':`${WARLIKE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`}});
  }
  if(data.action==='logout'){
   const token=(await cookies()).get(WARLIKE_COOKIE)?.value;
   if(token)await callWarLike(config,'/api/warlike-auth/logout',{method:'POST',token});
   return Response.json({ok:true},{headers:{'Cache-Control':'private, no-store','Set-Cookie':`${WARLIKE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`}});
  }
  throw new HttpError(400,'Action inconnue.');
 }catch(e){return errorResponse(e);}
}
