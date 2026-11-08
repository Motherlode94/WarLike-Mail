# WarLike Mail sur Cloudflare

Cette branche prépare Mail pour une exécution Cloudflare indépendante : le projet Pages existant transmet les requêtes au Worker `warlike-mail-runtime` par la liaison de service `WARLIKE_APP`. Le Worker utilise `https://warlike-server.pages.dev` et la connexion WarLike.

Construire avec `node node_modules/vite/bin/vite.js build --config vite.cloudflare.config.ts`, puis contrôler avec `node node_modules/wrangler/bin/wrangler.js deploy --dry-run --config dist/server/wrangler.json`. Avant de déployer le relais Pages, déployer et vérifier Server, déployer le Worker Mail, configurer la liaison de service et effectuer des essais d'accès et d'échange entre deux membres. Un build réussi ne vérifie pas les sessions ou la livraison des messages.

Le runtime Mail et sa liaison privée vers WarLike Server sont préparés. Une publication réussie doit encore être complétée par des tests réels entre deux comptes. La messagerie reste interne : aucun transport e-mail Internet n'est configuré.
