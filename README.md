# WarLike Mail

> Site : https://warlike-mail.vikktor7.chatgpt.site/
> Source publiée : `779b84cfd52dce6b9eef8aabbb4030518de49840`.
> Secrets et données privées exclus.

Client web et bureau de la messagerie interne WarLike, inspiré des conversations Gmail et du poste de travail Outlook : dossiers, recherche, favoris, archivage, réponses, brouillons serveur, contacts et fenêtre de rédaction séparée.

## Deux applications, un registre

WarLike Mail est le client. WarLike Server conserve les comptes, les conversations, les inscriptions à Studio et Engine et les décisions des responsables dans D1. Les appels du client sont authentifiés par le partage privé Sites et une identité signée côté serveur. Les clés sont configurées dans les secrets de déploiement ; aucune clé n’est fournie au navigateur ou au client Windows.

Variables de déploiement : WARLIKE_SERVER_URL, WARLIKE_SERVER_GATE et WARLIKE_BRIDGE_KEY. L’identité provient de Sign in with ChatGPT ; une boîte activée exige ensuite son mot de passe aléatoire personnel. Chaque membre reçoit un identifiant WarLike conservé dans le registre commun.

Le propriétaire nomme un référent par son e-mail dans Paramètres. Le même compte doit aussi être autorisé dans le partage privé du site. Le référent peut valider les inscriptions et répondre ; il ne peut pas attribuer le rôle de référent ni remplacer le propriétaire.

`/apercu` est un espace interactif explicitement fictif. En production, il exige aussi une connexion et une adhésion WarLike autorisée. Les données de démonstration ne sont pas envoyées au serveur et sont réinitialisées au rechargement. En développement local seulement, il est disponible pour les vérifications d’interface.

## Client lourd

Le dossier `desktop/` contient le client Electron 45.1.0 : fenêtres natives, menus Fichier/Édition/Affichage, rédaction séparée, session persistante isolée, Node désactivé dans les vues distantes, contextIsolation et sandbox. Les sources se téléchargent dans Paramètres. Une version Windows x64 portable a été produite séparément ; archive ZIP, exécutable PE x64 et présence du paquet applicatif vérifiés. Son lancement et la connexion sous Windows n’ont pas été testés dans cet environnement Linux.

L’application Web est aussi installable avec Chrome/Edge via le manifeste et le service worker. Hors connexion, elle affiche une page dédiée et ne met pas le contenu des boîtes en cache.

## Périmètre

Messagerie interne : pas de réception d’e-mails Internet, ni de connexion à des boîtes Gmail, Outlook, IMAP ou SMTP. Un domaine et un fournisseur mail doivent être reliés pour cela. Studio et Engine conservent leurs liens publics ; les autorisations du registre ne bloquent pas encore ces liens.

## Vérification

TypeScript, build Sites, politique de rôles et d’origines. Le serveur est testé séparément avec des comptes fictifs de développement : refus anonyme, décision réservée aux responsables, inscription aux deux sites avec un identifiant commun, réponse persistée, confidentialité des conversations et des brouillons, délégation réservée au propriétaire. Les données de test restent dans la base locale et ne sont pas déployées.

## Sécurité et boîtes nominatives

Consulter [SECURITY.md](SECURITY.md) pour les protections, les limites et les tests. Dans WarLike Mail → Paramètres → Adresse et accès à la boîte, le responsable choisit un membre, son prénom et son nom puis génère ses identifiants. Le mot de passe aléatoire s’affiche une seule fois. Les adresses `prenom.nom@warlike.maill.dev` fonctionnent comme identifiants internes ; aucun DNS ni SMTP/IMAP Internet n’est configuré.

Audit : `python3 security/audit.py --root .`. Validateur natif : `c++ -std=c++20 -O2 native/path_guard.cpp -o /tmp/warlike-path-guard` puis `/tmp/warlike-path-guard --self-test`. Tests Python : `python3 -m unittest discover -s security -p 'test_*.py'`.

## Conversations privées et contrôle des accès

Les messages privés sont accessibles uniquement aux participants, même si un autre compte possède un rôle propriétaire ou référent. Les conversations de la boîte d’équipe restent partagées avec les responsables et sont présentées comme telles lors de la rédaction. Cette confidentialité est appliquée par les permissions du serveur ; les messages ne sont pas chiffrés de bout en bout et restent lisibles par un opérateur ayant accès à la base.

Lecture, favoris, archivage et corbeille sont propres à chaque membre. Déplacer une conversation dans sa corbeille ne la retire pas à son correspondant ; elle peut être restaurée. L’envoi privé utilise un identifiant stable pour éviter une livraison en double lors d’une nouvelle tentative.

Les brouillons sont enregistrés automatiquement après une pause de saisie. Chaque sauvegarde exige la révision attendue : une autre fenêtre ne peut pas écraser silencieusement un texte plus récent. Un brouillon envoyé ou supprimé conserve un marqueur de suppression afin de refuser les sauvegardes tardives.

Les pages applicatives et les API du Server refusent les visiteurs non connectés et les comptes non validés, refusés ou suspendus. L’accueil et le formulaire d’inscription permettent de consulter ou déposer sa demande ; les espaces de gestion exigent le rôle approprié. Le partage natif Sites reste une première barrière distincte. Les redirections d’accès et réponses privées interdisent le cache. Les liens publics Studio/Engine restent hors de cette protection.
