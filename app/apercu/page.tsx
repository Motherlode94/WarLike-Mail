import MailClient from '../mail-client';
import {demoState} from '@/lib/demo';
import {getChatGPTUser} from '../chatgpt-auth';
import {serverCall} from '@/lib/server-client';
export const dynamic='force-dynamic';
export default async function Preview(){
 if(!import.meta.env.DEV){const user=await getChatGPTUser();if(!user)return <main className="login-page"><h1>Aperçu privé</h1><p>Connecte-toi avec un compte WarLike validé.</p><a href="/signin-with-chatgpt?return_to=%2Fapercu" target="_top">Connexion</a></main>;try{await serverCall(user)}catch{return <main className="login-page"><h1>Validation requise</h1><p>Ton inscription doit être validée avant d’ouvrir cet espace.</p><a href="https://warlike-server.vikktor7.chatgpt.site/inscription" target="_top">Mon inscription WarLike</a></main>}}
 return <MailClient initial={demoState()} demo/>;
}
