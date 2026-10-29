import {getChatGPTUser} from '@/app/chatgpt-auth';
import {serverCall,MAILBOX_COOKIE} from '@/lib/server-client';
import {assertOrigin} from '@/lib/policy';
import {readJsonObject,errorResponse} from '@/lib/security';
export const dynamic='force-dynamic';
const reply=(data:unknown,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store',...headers}});
export async function GET(){const user=await getChatGPTUser();if(!user)return reply({error:'Connexion requise.'},401);try{return reply(await serverCall(user));}catch(e){return errorResponse(e);}}
export async function POST(request:Request){
 try{assertOrigin(request.headers.get('origin'),request.url,'https://warlike-mail.vikktor7.chatgpt.site');if(request.headers.get('sec-fetch-site')==='cross-site')return reply({error:'Origine refusée.'},403);}catch{return reply({error:'Origine refusée.'},403);}
 const user=await getChatGPTUser();if(!user)return reply({error:'Connexion requise.'},401);
 try{
  const payload=await readJsonObject(request,40000),data=await serverCall(user,'POST',JSON.stringify(payload));
  const headers:Record<string,string>={};
  if(Object.hasOwn(data,'mailboxSession')){
   const token=data.mailboxSession;delete data.mailboxSession;
   headers['Set-Cookie']=`${MAILBOX_COOKIE}=${token||''}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${token?28800:0}`;
  }
  return reply(data,200,headers);
 }catch(e){return errorResponse(e);}
}
