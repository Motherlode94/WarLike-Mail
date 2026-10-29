import {getChatGPTUser} from '@/app/chatgpt-auth';
import {serverCall} from '@/lib/server-client';
import {assertOrigin} from '@/lib/policy';
export const dynamic='force-dynamic';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){const user=await getChatGPTUser();if(!user)return reply({error:'Connexion requise.'},401);try{return reply(await serverCall(user));}catch(e){return reply({error:(e as Error).message},503);}}
export async function POST(request:Request){try{assertOrigin(request.headers.get('origin'),request.url,'https://warlike-mail.vikktor7.chatgpt.site');}catch{return reply({error:'Origine refusée.'},403);}const user=await getChatGPTUser();if(!user)return reply({error:'Connexion requise.'},401);const body=await request.text();if(body.length>40000)return reply({error:'Message trop volumineux.'},413);try{JSON.parse(body);return reply(await serverCall(user,'POST',body));}catch(e){return reply({error:(e as Error).message},400);}}
