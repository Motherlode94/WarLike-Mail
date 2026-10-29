declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    WARLIKE_OWNER_EMAIL?: string;
    WARLIKE_SERVER_URL?: string;
    WARLIKE_BRIDGE_KEY?: string;
    WARLIKE_SERVER_GATE?: string;
    BUCKET?: R2Bucket;
  }
}
