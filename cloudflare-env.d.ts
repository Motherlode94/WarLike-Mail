declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    WARLIKE_OWNER_EMAIL?: string;
    WARLIKE_SERVER_URL?: string;
    WARLIKE_SERVER?: {fetch(request:Request):Promise<Response>};
    WARLIKE_BRIDGE_KEY?: string;
    WARLIKE_SERVER_GATE?: string;
    WARLIKE_AUTH_ENABLED?: string;
    BUCKET?: R2Bucket;
  }
}
