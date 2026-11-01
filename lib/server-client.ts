import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {signIdentity,type ForwardedUser} from './bridge';
import {HttpError} from './security';
export const MAILBOX_COOKIE='__Host-warlike-mailbox';
export async function serverCall(user:ForwardedUser,method='GET',body?:string){
 const server=env.WARLIKE_SERVER_URL,secret=env.WARLIKE_BRIDGE_KEY,gate=env.WARLIKE_SERVER_GATE;
 if(!server||!secret||!gate)throw new HttpError(503,'Connexion au serveur WarLike non configurée.');
 let url:URL;
 try{url=new URL('/api/mail',server)}catch{throw new HttpError(503,'Adresse serveur invalide.')}
 if(url.origin!=='https://warlike-server.vikktor7.chatgpt.site')throw new HttpError(503,'Serveur WarLike non reconnu.');
 const token=(await cookies()).get(MAILBOX_COOKIE)?.value||'';
 const auth=await signIdentity(user,secret,{method,path:url.pathname,body,mailboxToken:token});
 let response:Response;
 try{response=await fetch(url,{method,headers:{...auth,'Content-Type':'application/json','Origin':url.origin,'OAI-Sites-Authorization':'Bearer '+gate,...(token?{'x-warlike-mailbox-session':token}:{})},body,redirect:'error',signal:AbortSignal.timeout(20000)});}catch{throw new HttpError(503,'Serveur WarLike inaccessible ou délai dépassé.')}
 if(!response.headers.get('content-type')?.includes('application/json'))throw new HttpError(503,'Le serveur WarLike est indisponible.');
 let data:any;
 try{data=await response.json()}catch{throw new HttpError(502,'Réponse du serveur invalide.')}
 if(!response.ok)throw new HttpError(response.status,response.status>=500?'Le serveur est momentanément indisponible.':data.error||'Le serveur a refusé la demande.',Number(response.headers.get('retry-after'))||undefined);
 return data;
}
