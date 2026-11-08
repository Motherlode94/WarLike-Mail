import {test} from 'node:test';
import assert from 'node:assert/strict';
import {callWarLike,extractSession} from '../lib/warlike-session-client.ts';
test('la passerelle accepte seulement le serveur WarLike et relaie la session',async()=>{
 const token='A'.repeat(43);let seen:any;
 const fetcher=async(url:any,options:any)=>{seen={url,options};return new Response('{}',{headers:{'Set-Cookie':`__Host-warlike_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`}})};
 await assert.rejects(callWarLike({server:'https://evil.example'},'/api/mail',{},fetcher as any),{status:503});
 await assert.rejects(callWarLike({server:'https://warlike-server.pages.dev'},'/api/vault',{},fetcher as any),{status:400});
 const res=await callWarLike({server:'https://warlike-server.pages.dev'},'/api/mail',{token},fetcher as any);
 assert.equal(seen.url,'https://warlike-server.pages.dev/api/mail');assert.equal(seen.options.headers.Cookie,`__Host-warlike_session=${token}`);assert.equal(extractSession(res),token);
 assert.throws(()=>extractSession(new Response('{}',{headers:{'Set-Cookie':`__Host-warlike_session=${token}; Path=/`}})),{status:502});
});
test('la liaison interne transmet les informations de session et refuse les redirections automatiques',async()=>{
 const token='B'.repeat(43);let received:Request|undefined;
 const service={fetch:async(request:Request)=>{received=request;return new Response('{}',{status:200})}};
 await callWarLike({server:'https://warlike-server.pages.dev',service,clientIp:'192.0.2.1'},'/api/mail',{token});
 assert.equal(received?.url,'https://warlike-server.pages.dev/api/mail');
 assert.equal(received?.redirect,'manual');
 assert.equal(received?.headers.get('cookie'),`__Host-warlike_session=${token}`);
 assert.equal(received?.headers.get('cf-connecting-ip'),'192.0.2.1');
});
