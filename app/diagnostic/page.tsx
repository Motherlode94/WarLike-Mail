import {env} from 'cloudflare:workers';
import Link from 'next/link';

export const dynamic='force-dynamic';
export const metadata={title:'Diagnostic des services — WarLike Mail'};

export default function DiagnosticPage(){
 const fields=[
  {label:'Adresse du serveur',ok:Boolean(env.WARLIKE_SERVER_URL),description:'Adresse du service central WarLike'},
  {label:'Accès entre services',ok:Boolean(env.WARLIKE_SERVER_GATE),description:'Autorisation privée nécessaire pour appeler le serveur'},
  {label:'Signature des requêtes',ok:typeof env.WARLIKE_BRIDGE_KEY==='string'&&env.WARLIKE_BRIDGE_KEY.length>=32,description:'Signature HMAC des identités envoyées au serveur'}
 ];
 let destination=false;
 try{destination=new URL(String(env.WARLIKE_SERVER_URL||'')).origin==='https://warlike-server.vikktor7.chatgpt.site'}catch{}
 const ready=fields.every(f=>f.ok)&&destination;
 return <main style={{minHeight:'100vh',padding:'clamp(20px,5vw,70px)',background:'#0b1020',color:'#f2f5ff',fontFamily:'system-ui,sans-serif'}}>
  <div style={{maxWidth:790,margin:'auto'}}>
   <Link href="/" style={{color:'#aaa5ff'}}>← Retour à WarLike Mail</Link>
   <p style={{color:'#aaa5ff',marginTop:34,fontWeight:700}}>WARLIKE / DIAGNOSTIC</p>
   <h1 style={{fontSize:'clamp(30px,5vw,49px)'}}>État de la connexion Mail / Server</h1>
   <p style={{color:'#b8c4df',lineHeight:1.7}}>Cette page contrôle la configuration du serveur qui héberge WarLike Mail. Elle n'affiche jamais les clés, les mots de passe ou les identités privées.</p>
   <section style={{border:'1px solid #343e57',borderRadius:18,padding:24,background:'#141d32',marginTop:26}}>
    <h2 style={{fontSize:22,color:ready?'#b3e8c9':'#f1c59a'}}>{ready?'Configuration présente':'Configuration incomplète'}</h2>
    <p style={{color:'#b8c4df'}}>Le statut ne garantit pas une connexion effective : une session authentifiée doit encore être testée entre les deux applications.</p>
    {fields.map(f=><div key={f.label} style={{display:'flex',justifyContent:'space-between',gap:20,borderTop:'1px solid #343e57',padding:'16px 0'}}>
     <div><strong>{f.label}</strong><p style={{color:'#b8c4df',margin:'5px 0'}}>{f.description}</p></div>
     <strong style={{color:f.ok?'#b3e8c9':'#f1a6a6'}}>{f.ok?'Configuré':'Manquant'}</strong>
    </div>)}
    <div style={{borderTop:'1px solid #343e57',paddingTop:16}}>Origine du serveur : <strong style={{color:destination?'#b3e8c9':'#f1a6a6'}}>{destination?'Reconnue':'Non reconnue / absente'}</strong></div>
   </section>
   <p style={{color:'#b8c4df',marginTop:24}}>Si la configuration est incomplète, les variables doivent être renseignées dans l'environnement d'hébergement. Un déploiement GitHub réussi ne suffit pas. La messagerie reste interne, sans SMTP/IMAP Internet.</p>
  </div>
 </main>
}
