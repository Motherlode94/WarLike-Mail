import {HttpError} from './security.ts';
export const WARLIKE_COOKIE='__Host-warlike_session';
const VALID_TOKEN=/^[A-Za-z0-9_-]{43}$/;
export type Connection={server?:string;gate?:string};
export function serverOrigin(config:Connection):string {
 let url:URL;try{url=new URL(config.server||'');}catch{throw new HttpError(503,'Serveur WarLike non configuré.');}
 if(!['https://warlike-server.vikktor7.chatgpt.site','https://warlike-server.pages.dev'].includes(url.origin))throw new HttpError(503,'Serveur WarLike non reconnu.');
 if(url.origin==='https://warlike-server.vikktor7.chatgpt.site'&&!config.gate)throw new HttpError(503,'Passerelle privée non configurée.');
 return url.origin;
}
export async function callWarLike(config:Connection,path:string,options:{method?:'GET'|'POST';token?:string;body?:string}={},request:typeof fetch=fetch):Promise<Response> {
 if(!['/api/warlike-auth/login','/api/warlike-auth/logout','/api/warlike-auth/session','/api/mail'].includes(path))throw new HttpError(400,'Route interdite.');
 if(options.token&&!VALID_TOKEN.test(options.token))throw new HttpError(401,'Session invalide.');
 const origin=serverOrigin(config),privateSite=origin==='https://warlike-server.vikktor7.chatgpt.site';
 const headers:Record<string,string>={'Origin':origin};
 if(options.token)headers.Cookie=`${WARLIKE_COOKIE}=${options.token}`;
 if(options.body)headers['Content-Type']='application/json';
 if(privateSite)headers['OAI-Sites-Authorization']='Bearer '+config.gate;
 try{return await request(origin+path,{method:options.method||'GET',headers,body:options.body,redirect:'error',signal:AbortSignal.timeout(20000)});}catch{throw new HttpError(503,'Serveur WarLike inaccessible.');}
}
export function extractSession(response:Response):string {
 const cookie=response.headers.get('set-cookie')||'';
 const match=/^__Host-warlike_session=([A-Za-z0-9_-]{43});/.exec(cookie);
 if(!match||!/;\s*HttpOnly(?:;|$)/i.test(cookie)||!/;\s*Secure(?:;|$)/i.test(cookie))throw new HttpError(502,'Session serveur invalide.');
 return match[1];
}
