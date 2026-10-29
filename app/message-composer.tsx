'use client';
import {useEffect,useRef,useState} from 'react';
import {Send,X,ArrowUpRight,CloudCheck,LoaderCircle,ShieldCheck} from 'lucide-react';
import {DraftSession,type DraftValue} from '@/lib/draft-session';
type Props={value:DraftValue;members:any[];manager:boolean;standalone:boolean;post:(data:any,quiet?:boolean)=>Promise<any>;change:(value:DraftValue|null)=>void;sent:()=>void;demo:boolean};
export default function MessageComposer({value,members,manager,standalone,post,change,sent,demo}:Props){
 const [status,setStatus]=useState(value.revision?'Enregistré':'Nouveau brouillon'),[error,setError]=useState(''),[working,setWorking]=useState(false);
 const postRef=useRef(post),latest=useRef(value),form=useRef<HTMLFormElement>(null),workingRef=useRef(false);
 postRef.current=post;latest.current=value;
 const session=useRef<DraftSession|null>(null);
 if(!session.current)session.current=new DraftSession(value,async draft=>{const next=await postRef.current({action:'draft',...draft},true),saved=next.savedDraft;if(!saved||saved.id!==draft.id)throw Error('Le brouillon n’a pas été confirmé.');return saved.revision||1;});
 const controller=session.current;
 async function save(snapshot=latest.current){if(!controller.dirty(snapshot))return;setStatus('Enregistrement…');try{await controller.save(snapshot);setStatus('Enregistré');setError('')}catch(e){setStatus('Non enregistré');setError((e as Error).message);throw e;}}
 useEffect(()=>{
  if(workingRef.current||!controller.dirty(value))return;
  const timer=setTimeout(()=>{void save({...value}).catch(()=>{})},1200);return()=>clearTimeout(timer);
 },[value.recipientId,value.subject,value.body,value.kind]);
 useEffect(()=>{const protect=(e:BeforeUnloadEvent)=>{if(controller.dirty(latest.current)){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',protect);return()=>{window.removeEventListener('beforeunload',protect)}},[]);
 async function operation(run:()=>Promise<void>){if(workingRef.current)return;workingRef.current=true;setWorking(true);try{await run()}catch(e){setError((e as Error).message)}finally{workingRef.current=false;setWorking(false)}}
 async function send(e:React.FormEvent){e.preventDefault();await operation(async()=>{await save();await postRef.current({action:'send',...latest.current,clientKey:value.id,draftId:value.id});controller.close();change(null);sent()})}
 async function close(){await operation(async()=>{await save();controller.close();change(null)})}
 async function popout(){await operation(async()=>{await save();if(demo){setError('La fenêtre séparée est disponible dans la boîte connectée.');return}window.open('/compose?draft='+encodeURIComponent(value.id),'warlike-compose-'+value.id,'popup,width=800,height=760,noopener');controller.close();change(null)})}
 const recipients=members.filter(m=>value.kind==='team'||m.mailbox_address);
 return <div className={'compose-veil '+(standalone?'compose-only':'')}><form ref={form} className="compose" onSubmit={e=>void send(e)} onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();form.current?.requestSubmit()}if(e.key==='Escape'){e.preventDefault();void close()}}} role="dialog" aria-label="Rédiger un message" aria-modal="true"><header><strong>Nouveau message</strong><div><button type="button" aria-label="Ouvrir la rédaction dans une fenêtre séparée" disabled={working} onClick={()=>void popout()}><ArrowUpRight size={17}/></button><button type="button" aria-label="Fermer et conserver le brouillon" disabled={working} onClick={()=>void close()}><X size={18}/></button></div></header>
 <div className="compose-privacy"><ShieldCheck size={15}/>{manager?<label>Type<select aria-label="Confidentialité du message" value={value.kind} onChange={e=>change({...value,kind:e.target.value as DraftValue['kind'],recipientId:''})} disabled={working}><option value="direct">Message privé</option><option value="team">Boîte de l’équipe</option></select></label>:<strong>Message privé entre participants</strong>}<span>{value.kind==='direct'?'Seuls les participants peuvent le lire.':'Les responsables partagent cette conversation.'}</span></div>
 <label className="compose-recipient">À<select aria-label="Destinataire" value={value.recipientId} onChange={e=>change({...value,recipientId:e.target.value})} required disabled={working}><option value="">Choisir une adresse WarLike</option>{recipients.map(m=><option key={m.id} value={m.id}>{m.name} · {m.mailbox_address||m.email}</option>)}</select></label>
 {!recipients.length&&<p className="composer-error">Aucune boîte activée dans l’annuaire. Le responsable peut créer les identifiants dans Paramètres.</p>}
 <input aria-label="Objet du message" placeholder="Objet" maxLength={180} value={value.subject} onChange={e=>change({...value,subject:e.target.value})} required disabled={working}/>
 <textarea aria-label="Corps du message" placeholder="Écris ton message…" maxLength={12000} value={value.body} onChange={e=>change({...value,body:e.target.value})} required disabled={working}/>
 {error&&<div className="composer-error" role="alert"><p>{error}</p><button type="button" onClick={()=>{controller.close();change({...latest.current,id:typeof crypto.randomUUID==='function'?crypto.randomUUID():'draft-'+Date.now()+'-'+Math.random().toString(36).slice(2),revision:0});}}>Conserver dans un nouveau brouillon</button></div>}
 <footer><button className="primary" type="submit" disabled={working||!value.recipientId}><Send size={16}/>{working?'Traitement…':'Envoyer'}</button><button type="button" className="subtle" disabled={working} onClick={()=>void operation(async()=>{await save()})}>Enregistrer</button><small className="autosave-state" role="status">{status==='Enregistrement…'?<LoaderCircle size={13}/>:<CloudCheck size={13}/>} {status}</small><span className="compose-shortcut">Ctrl ↵</span></footer></form></div>;
}
