import {getChatGPTUser} from './chatgpt-auth';
import {serverCall} from '@/lib/server-client';
import MailClient from './mail-client';
import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export default async function Home(){let initial=null,error='';try{const user=await getChatGPTUser();if(user)initial=await serverCall(user);}catch(e){error=e instanceof Error?e.message:'Service indisponible.';}return <MailClient initial={initial} initialError={error} warlikeAuth={env.WARLIKE_AUTH_ENABLED==='true'}/>;}
