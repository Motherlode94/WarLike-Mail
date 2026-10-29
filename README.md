# WarLike Mail

> Site : https://warlike-mail.vikktor7.chatgpt.site/
> Sources de la version publiée : `6a1e327b3b241610315e22747ad2e7ac2ff0884f`.
> Les identifiants de connexion, secrets et bases de données ne sont pas inclus.

Client web et bureau de la messagerie interne WarLike, inspiré des conversations Gmail et du poste de travail Outlook : dossiers, recherche, favoris, archivage, réponses, brouillons serveur, contacts et fenêtre de rédaction séparée.

## Deux applications, un registre

WarLike Mail est le client. WarLike Server conserve les comptes, les conversations, les inscriptions à Studio et Engine et les décisions des responsables dans D1. Les appels du client sont authentifiés par le partage privé Sites et une identité signée côté serveur. Les clés sont configurées dans les secrets de déploiement ; aucune clé n’est fournie au navigateur ou au client Windows.

Variables de déploiement : WARLIKE_SERVER_URL, WARLIKE_SERVER_GATE et WARLIKE_BRIDGE_KEY. L’identité provient de Sign in with ChatGPT, sans créer de nouveau mot de passe local. Chaque membre reçoit un identifiant WarLike conservé dans le registre commun.

Le propriétaire nomme un référent par son e-mail dans Paramètres. Le même compte doit aussi être autorisé dans le partage privé du site. Le référent peut valider les inscriptions et répondre ; il ne peut pas attribuer le rôle de référent ni remplacer le propriétaire.

`/apercu` est un espace interactif explicitement fictif. Les données ne sont pas envoyées au serveur et sont réinitialisées au rechargement.

## Client lourd

Le dossier `desktop/` contient le client Electron 45.1.0 : fenêtres natives, menus Fichier/Édition/Affichage, rédaction séparée, session persistante isolée, Node désactivé dans les vues distantes, contextIsolation et sandbox. Les sources se téléchargent dans Paramètres. Une version Windows x64 portable a été produite séparément ; archive ZIP, exécutable PE x64 et présence du paquet applicatif vérifiés. Son lancement et la connexion sous Windows n’ont pas été testés dans cet environnement Linux.

L’application Web est aussi installable avec Chrome/Edge via le manifeste et le service worker. Hors connexion, elle affiche une page dédiée et ne met pas le contenu des boîtes en cache.

## Périmètre

Messagerie interne : pas de réception d’e-mails Internet, ni de connexion à des boîtes Gmail, Outlook, IMAP ou SMTP. Un domaine et un fournisseur mail doivent être reliés pour cela. Studio et Engine conservent leurs liens publics ; les autorisations du registre ne bloquent pas encore ces liens.

## Vérification

TypeScript, build Sites, politique de rôles et d’origines. Le serveur est testé séparément avec des comptes fictifs de développement : refus anonyme, décision réservée aux responsables, inscription aux deux sites avec un identifiant commun, réponse persistée, confidentialité des conversations et des brouillons, délégation réservée au propriétaire. Les données de test restent dans la base locale et ne sont pas déployées.
