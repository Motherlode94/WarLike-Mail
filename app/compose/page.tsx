import {getChatGPTUser} from '../chatgpt-auth';
import {serverCall} from '@/lib/server-client';
import MailClient from '../mail-client';
export const dynamic='force-dynamic';
export default async function Compose(){let initial=null,error='';try{const user=await getChatGPTUser();if(user)initial=await serverCall(user);}catch(e){error=(e as Error).message}return <MailClient initial={initial} initialError={error} composeOnly/>;}
