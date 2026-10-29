export type DraftValue={id:string;recipientId:string;subject:string;body:string;kind:'direct'|'team';revision:number};
export type DraftWriter=(value:DraftValue)=>Promise<number>;
const fingerprint=(value:DraftValue)=>JSON.stringify([value.id,value.recipientId,value.subject,value.body,value.kind]);
// Serializes saves and advances the revision only after the server acknowledges it.
export class DraftSession {
 private revision:number; private saved:string; private queue:Promise<unknown>=Promise.resolve(); private closed=false;
 constructor(initial:DraftValue,privateWriter:DraftWriter){this.revision=initial.revision;this.saved=initial.revision>0?fingerprint(initial):'';this.writer=privateWriter;}
 private writer:DraftWriter;
 dirty(value:DraftValue){return fingerprint(value)!==this.saved&&(!!value.subject||!!value.body||!!value.recipientId);}
 save(value:DraftValue){
  const snapshot={...value};
  const run=this.queue.catch(()=>{}).then(async()=>{
   if(this.closed)throw Error('Ce brouillon est fermé.');
   if(!this.dirty(snapshot))return this.revision;
   const revision=await this.writer({...snapshot,revision:this.revision});
   this.revision=revision;this.saved=fingerprint(snapshot);return revision;
  });this.queue=run;return run;
 }
 close(){this.closed=true;}
}
