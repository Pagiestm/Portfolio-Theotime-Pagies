# Back-office Sanity

Le contenu du portfolio (réalisations, textes des pages, parcours, compétences,
à propos) vit dans Sanity. Le site le lit au chargement de chaque page ; il n'y
a plus rien à modifier dans le code pour changer un texte ou ajouter un projet.

- **Projet** `svhdk2l2`, dataset `production` (public en lecture)
- **Studio en local** : `npm run dev` → http://localhost:3333
- **Studio en ligne** : `npm run deploy`

## Au quotidien

```bash
cd studio
npm run dev      # back-office en local
npm run deploy   # publie la version en ligne
```

Rien à faire côté site : il lit le contenu publié à chaque chargement de page.
Un déploiement du site n'est nécessaire que si le **code** change.

## Ce qui est modifiable

| Dans le Studio                                              | Effet sur le site                                                    |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| **Pages › Accueil**                                         | chapitres de la scène, bande de repères, bannière de clôture         |
| **Pages › Réalisations / Parcours / Compétences / Contact** | surtitre, titre et chapô de la page                                  |
| **Pages › À propos**                                        | biographie, faits, portrait                                          |
| **Pages › Réglages du site**                                | nom, intitulé de poste, email, GitHub, LinkedIn                      |
| **Réalisations**                                            | un document par projet : textes, images, technologies, liens         |
| **Parcours**                                                | les étapes de la frise horizontale                                   |
| **Groupes de compétences**                                  | les quatre colonnes de la page Compétences                           |
| **Technologies**                                            | le référentiel partagé, référencé par les projets et les compétences |

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

Le site a besoin de deux variables, en local dans `.env` à la racine et dans les
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

## Réamorcer un dataset vide

```bash
npm run migrate:dry   # simulation, n'écrit rien
npm run migrate       # écrit
```

La migration s'authentifie via `sanity exec --with-user-token`, donc avec votre
session `sanity login` : **aucun jeton d'écriture à créer**.

Trois limites à connaître avant de la relancer :

- **Elle écrase le contenu éditorial** par l'instantané figé dans
  `scripts/seed.mjs`. Chaque document a un identifiant déterministe et se fait
  remplacer : tout ce qui a été écrit dans le Studio depuis est perdu.
- **Elle ne recrée plus les réalisations.** Leurs JSON ont été retirés du dépôt
  une fois la migration faite, Sanity en est la seule source. L'étape est
  ignorée avec un message, elle ne plante pas.
- **Elle vide le portrait** de la page À propos, dont le fichier local a lui
  aussi été supprimé.

Pour une vraie sauvegarde du contenu, `npx sanity dataset export` plutôt que ce
script.

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
