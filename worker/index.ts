import { secureResponse, errorResponse } from "../lib/security";
import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

const worker = {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    const url = new URL(request.url);
    // Public Pages deployments cannot trust client-supplied oai-authenticated-* headers.
    // Authenticated mailbox operations remain available through the private Sites origin.
    if (!import.meta.env.DEV && env.WARLIKE_AUTH_ENABLED!=='true' && url.hostname.endsWith('.pages.dev') &&
        (url.pathname.startsWith('/api/mail') || url.pathname.startsWith('/api/') && url.pathname !== '/api/health')) {
      return secureResponse(Response.json({error:'Ouvre la messagerie depuis le site privé WarLike Mail pour te connecter.'},{status:401}),request,false);
    }
    if (!import.meta.env.DEV && url.hostname.endsWith('.pages.dev') &&
        request.headers.has('oai-authenticated-user-id')) {
      return secureResponse(Response.json({error:'En-têtes d’identité non autorisés sur le domaine public.'},{status:401}),request,false);
    }
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    try { return secureResponse(await runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx)), request, import.meta.env.DEV); }
    catch (error) { return secureResponse(errorResponse(error), request, import.meta.env.DEV); }
  },
};

export default worker;
