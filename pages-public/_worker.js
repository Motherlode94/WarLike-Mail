// WARLIKE_APP must be bound to the mail runtime before this is deployed.
export default {async fetch(request,env){
 if(!env.WARLIKE_APP)return new Response('WarLike Mail est en cours de configuration.',{status:503,headers:{'Cache-Control':'no-store'}});
 return env.WARLIKE_APP.fetch(request);
}};
