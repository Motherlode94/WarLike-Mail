import vinext from 'vinext';
import {defineConfig} from 'vite';
import {cloudflare} from '@cloudflare/vite-plugin';

export default defineConfig({plugins:[vinext(),cloudflare({viteEnvironment:{name:'rsc',childEnvironments:['ssr']},config:{
 name:'warlike-mail-runtime',main:'./worker/index.ts',compatibility_date:'2026-05-15',compatibility_flags:['nodejs_compat'],
 vars:{WARLIKE_AUTH_ENABLED:'true',WARLIKE_SERVER_URL:'https://warlike-server.pages.dev'},
 assets:{binding:'ASSETS'},
}})]});
