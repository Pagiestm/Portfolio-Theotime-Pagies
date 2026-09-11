# Back-office Sanity

Le contenu du portfolio (réalisations, textes des pages, parcours, compétences,
à propos) vit dans Sanity. Le site le lit au chargement de chaque page ; il n'y
a plus rien à modifier dans le code pour changer un texte ou ajouter un projet.

- **Projet** `svhdk2l2`, dataset `production` (public en lecture)
- **Studio en local** : `npm run dev` → http://localhost:3333
- **Studio en ligne** : `npm run deploy`

Pour **faire évoluer** ce qui est modifiable (ajouter un champ, un type de lien,
un document), le guide est dans [docs/sanity.md](../../docs/sanity.md).

## Au quotidien

```bash
cd apps/studio
npm run dev      # back-office en local
npm run deploy   # publie la version en ligne
```

Rien à faire côté site : il lit le contenu publié à chaque chargement de page.
Un déploiement du site n'est nécessaire que si le **code** change.

## Ce qui est modifiable

| Dans le Studio                                              | Effet sur le site                                                                   |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Pages › Accueil**                                         | chapitres de la scène, bande de repères, bannière de clôture                        |
| **Pages › Réalisations / Parcours / Compétences / Contact** | surtitre, titre et chapô de la page                                                 |
| **Pages › À propos**                                        | biographie, faits, portrait                                                         |
| **Pages › Réglages du site**                                | nom, intitulé de poste, email, GitHub, LinkedIn                                     |
| **Réalisations**                                            | un document par projet : textes, images, technologies, liens, cadre, type, à la une |
| **Parcours**                                                | les étapes de la frise horizontale                                                  |
| **Groupes de compétences**                                  | les quatre colonnes de la page Compétences                                          |
| **Technologies**                                            | le référentiel partagé, référencé par les projets et les compétences                |

Ce qui **reste dans le code** : les micro-libellés d'interface (« Envoyer »,
« Voir plus », messages d'erreur du formulaire), dans `src/i18n/`. Les exposer
dans un CMS ferait courir le risque qu'un champ vide casse l'interface.

## Bilingue

Chaque champ éditorial a une version française (obligatoire) et une version
anglaise (facultative). Un champ anglais laissé vide retombe automatiquement sur
le français à l'affichage — traduire peut donc se faire progressivement.

## Icônes des technologies

`iconKey` pointe vers le registre `src/constants/tech.ts` du site. Ajouter une
technologie dont la clé n'y figure pas fonctionne : seul le libellé s'affiche,
sans logo. Pour ajouter un logo, il faut une ligne dans ce registre.

## Configuration du site

Le site a besoin de deux variables, en local dans `apps/web/.env` et dans les
variables d'environnement Vercel :

```
SANITY_PROJECT_ID=svhdk2l2
SANITY_DATASET=production
```

Elles n'ont pas le préfixe `VITE_`, que Vite exige normalement pour exposer une
variable au navigateur. Elles sont donc déclarées **nommément** dans `envPrefix`
(`vite.config.ts`) — nommément, et non via un préfixe `SANITY_`, pour qu'un
éventuel `SANITY_WRITE_TOKEN` ne se retrouve jamais embarqué dans le bundle.

### Origines autorisées (CORS)

Le navigateur ne peut lire l'API que depuis une origine déclarée. Sont
autorisées, sans identifiants : `localhost:5173`, `localhost:4173`, le domaine
Vercel de production et le motif de ses déploiements de prévisualisation. Pour
en ajouter une : sanity.io/manage › API › CORS origins.

## Sauvegarde

Sanity est la seule source du contenu : les JSON et images d'origine ont été
retirés du dépôt après la migration initiale. Pour une sauvegarde :

```bash
cd apps/studio
npx sanity dataset export production sauvegarde.tar.gz
```

Pour faire évoluer un champ existant, `scripts/migrate-links.mjs` sert de
modèle : rejouable, avec `--dry-run`, authentifié par votre session
`sanity login`.

## À savoir sur le plan gratuit

20 sièges, 250 000 requêtes API par mois, 100 Go de bande passante, 100 Go
d'assets, hébergement du Studio inclus. Les datasets y sont **publics en
lecture** : le contenu est lisible par qui connaît l'identifiant du projet. Sans
conséquence ici puisqu'il s'agit déjà du contenu public du site, mais n'y
déposez rien de confidentiel. L'écriture reste protégée par votre compte.

## Identifiants de documents

Un identifiant ne doit **jamais** contenir de point. Un point en fait un chemin,
et Sanity rend privés tous les documents situés dans un chemin — c'est le
mécanisme qui protège `drafts.*`. Un document ainsi nommé serait écrit, lisible
avec un jeton, et totalement invisible pour le site, qui lit sans.
