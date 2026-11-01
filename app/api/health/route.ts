import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export async function GET() {
  const ready=Boolean(env.WARLIKE_SERVER_URL && env.WARLIKE_SERVER_GATE && env.WARLIKE_BRIDGE_KEY);
  return Response.json({service:'warlike-mail',ready,mailTransport:'internal-only'}, {status:ready?200:503,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
