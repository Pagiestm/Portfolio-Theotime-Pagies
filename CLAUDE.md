# Portfolio Théotime Pagies

Monorepo npm workspaces orchestré par Turborepo. `apps/web` (React 19, Vite,
Tailwind, React Router) lit son contenu dans Sanity ; `apps/studio` l'édite ;
`apps/api` (Hono, routes → contrôleurs → services → modèles) répond aux visiteurs,
déployée en fonction Vercel par le site ; `packages/shared` porte ce que tous
consomment, sans React, Sanity ni DOM. Les applications ne s'importent jamais
entre elles, sauf le site qui expose l'API via `apps/web/api/[[...route]].ts`.

Détail : [architecture](docs/architecture.md) · [Sanity](docs/sanity.md) · [versions](docs/versions.md).

## Règles de travail

- **Ne jamais commiter ni pousser sans demande explicite**, à chaque fois, même
  si un commit précédent a été demandé.
- Avant de proposer un changement, tout passe depuis la racine : `lint`,
  `typecheck`, `test`, `format:check`, `build`.
- Vérifier le rendu dans le navigateur dès que l'affichage change.
- Commits Conventional Commits en français, corps expliquant le _pourquoi_ ; le type fixe la version ([docs/versions.md](docs/versions.md)).
- Les `feat/…` et `fix/…` vont dans `develop` ; `master` publie en production.
- **Aucun commentaire dans le code** : le _pourquoi_ va au message de commit.
  Documentation en français, trait d'union simple et jamais de tiret cadratin.

## Commandes

| Commande                | Effet                              |
| ----------------------- | ---------------------------------- |
| `npm install`           | installe les quatre workspaces     |
| `npm test`              | tests de l'API                     |
| `npm run dev`           | site sur :5173 et Studio sur :3333 |
| `npm run build`         | site + Studio, en cache Turborepo  |
| `npm run deploy:studio` | publie le Studio sur sanity.studio |

`dev`, `build` et `typecheck` passent par Turborepo (`--filter=@portfolio/web`
pour cibler) ; `lint` couvre le dépôt entier depuis `eslint.config.mjs`. Toute
variable qui change un bundle doit figurer dans `turbo.json`, sinon le cache
resservira un site bâti avec d'autres valeurs.

## Contraintes à ne pas défaire

- `resolve.dedupe` dans `apps/web/vite.config.ts` : garantit une seule copie de
  React dans le bundle du site.
- Les paquets épinglés et les `overrides` de la racine tiennent chacun une
  incompatibilité réelle, détaillée dans [docs/versions.md](docs/versions.md) :
  en relever un sans lire ce qui l'a motivé casse le lint ou la release.
- Aucune clé de modèle (`GEMINI_API_KEY`, `LLM_API_KEY`) n'entre dans `envPrefix` :
  seule `apps/api` les lit, côté serveur. `envPrefix` finit dans le bundle.
- Un identifiant de document Sanity ne contient **jamais de point**.
- Toute couleur vient de `styles/tokens.css`. **Aucun arrondi.** Toute animation
  vérifie `usePrefersReducedMotion()`.
