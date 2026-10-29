import {test} from 'node:test';import assert from 'node:assert/strict';
import {DraftSession,type DraftValue} from '../lib/draft-session.ts';
const base:DraftValue={id:'draft-one',recipientId:'WL-TWO',subject:'Objet',body:'Première version',kind:'direct',revision:0};
test('queued autosaves preserve text order and use the latest acknowledged revision',async()=>{
 let startedResolve:()=>void=()=>{};const started=new Promise<void>(resolve=>{startedResolve=resolve});const calls:DraftValue[]=[];let release:()=>void=()=>{};const first=new Promise<void>(resolve=>{release=resolve});
 const session=new DraftSession(base,async draft=>{calls.push(draft);startedResolve();if(calls.length===1)await first;return draft.revision+1});
 const a=session.save(base),b=session.save({...base,body:'Seconde version'});await started;assert.equal(calls.length,1);release();assert.deepEqual(await Promise.all([a,b]),[1,2]);assert.deepEqual(calls.map(x=>[x.body,x.revision]),[['Première version',0],['Seconde version',1]]);assert.equal(session.dirty({...base,body:'Seconde version'}),false);
});
test('failed saves retain dirty content and never advance the acknowledged revision',async()=>{
 const calls:number[]=[];let fail=true;const session=new DraftSession(base,async value=>{calls.push(value.revision);if(fail)throw Error('network');return value.revision+1});
 await assert.rejects(()=>session.save(base));assert.equal(session.dirty(base),true);fail=false;await session.save(base);assert.deepEqual(calls,[0,0]);assert.equal(session.dirty(base),false);
});
test('unchanged content is not written again; a closed draft cannot be resurrected',async()=>{
 let calls=0;const session=new DraftSession({...base,revision:3},async()=>{calls++;return 4});await session.save(base);assert.equal(calls,0);session.close();await assert.rejects(()=>session.save({...base,body:'late'}));assert.equal(calls,0);
});
