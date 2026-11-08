import {test} from 'node:test';
import assert from 'node:assert/strict';
import proxy from '../pages-public/_worker.js';
test('le proxy transmet la requête et refuse de fonctionner sans liaison',async()=>{
 const req=new Request('https://warlike-mail.pages.dev/api/warlike-auth',{method:'POST',headers:{origin:'https://warlike-mail.pages.dev'}});
 assert.equal((await proxy.fetch(req,{})).status,503);
 let received;const res=await proxy.fetch(req,{WARLIKE_APP:{fetch:async r=>{received=r;return new Response('ok')}}});
 assert.equal(await res.text(),'ok');assert.equal(received.url,req.url);assert.equal(received.headers.get('origin'),req.headers.get('origin'));
});
