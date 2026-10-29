const fold=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
export function visibleConversations(data:any,folder:string,chip:string,query:string){
 const search=fold(query.trim()),bodies=new Map<string,string>();
 if(search)for(const m of data?.messages||[])bodies.set(m.conversation_id,(bodies.get(m.conversation_id)||'')+' '+m.body);
 return (data?.conversations||[]).filter((t:any)=>{
  if(folder==='trash'?t.folder!=='trash':t.folder==='trash')return false;
  if(folder==='inbox'&&t.folder!=='inbox'||folder==='archive'&&t.folder!=='archive'||folder==='starred'&&!t.starred)return false;
  if(folder==='sent'&&!t.has_sent&&!(data.messages||[]).some((m:any)=>m.conversation_id===t.id&&m.author_id===data.user?.id))return false;
  const application=(data.applications||[]).find((a:any)=>a.id===t.application_id);
  if(chip==='unread'&&(t.is_read??(['owner','referent'].includes(data.user?.role)?t.manager_read:t.member_read)))return false;
  if(chip==='applications'&&!application)return false;
  if(chip==='studio'||chip==='engine'){try{if(!JSON.parse(application?.targets||'[]').includes(chip))return false}catch{return false}}
  return !search||fold([t.subject,t.member_name,t.member_email,t.preview,bodies.get(t.id)].join(' ')).includes(search);
 });
}
