# Portfolio Théotime Pagies

Monorepo npm workspaces orchestré par Turborepo. `apps/web` (React 19, Vite,
Tailwind, React Router) lit son contenu dans Sanity ; `apps/studio` l'édite ;
`packages/shared` porte ce que les deux consomment, sans React, Sanity ni DOM.
Les deux applications ne s'importent jamais l'une l'autre.

Détail : [architecture](docs/architecture.md) · [Sanity](docs/sanity.md) ·
[versions](docs/versions.md).

## Règles de travail

- **Ne jamais commiter ni pousser sans demande explicite**, à chaque fois, même
  si un commit précédent a été demandé.
- Avant de proposer un changement, les quatre commandes passent depuis la racine :
  `npm run lint && npm run typecheck && npm run format:check && npm run build`.
- Vérifier le rendu dans le navigateur dès que l'affichage change, pas juste le build.
- Commits Conventional Commits, en français, corps expliquant le _pourquoi_.
  Le type décide de la version publiée : voir [docs/versions.md](docs/versions.md).
- `master` déploie en production à chaque push : travailler sur `feat/…` ou `fix/…`.
- Commentaires et documentation en français, le _pourquoi_ plutôt que le _quoi_.

## Commandes

| Commande                | Effet                              |
| ----------------------- | ---------------------------------- |
| `npm install`           | installe les trois workspaces      |
| `npm run dev`           | site sur :5173 et Studio sur :3333 |
| `npm run build`         | site + Studio, en cache Turborepo  |
| `npm run deploy:studio` | publie le Studio sur sanity.studio |

`dev`, `build`, `lint` et `typecheck` passent par Turborepo (graphe, parallélisme,
cache ; cibler avec `--filter=@portfolio/web`). Toute variable qui change un bundle
doit être déclarée dans `turbo.json` : sinon le cache resservira un site construit
avec d'autres valeurs, sans erreur.

## Contraintes à ne pas défaire

- `resolve.dedupe` dans `apps/web/vite.config.ts` : garantit une seule copie de
  React dans le bundle du site.
- `overrides.typescript` (racine) tient la ligne 5.9 : les peers très larges de
  Sanity font sinon hisser un TypeScript plus récent, sur lequel ESLint casse.
- `react-icons` est épinglé à `5.3.0` : les versions suivantes ont retiré
  `SiPlaywright`, utilisé par `constants/tech.ts`.
- `conventional-changelog-conventionalcommits` est tenu en majeure 9 : la 10
  exige un writer que `release-notes-generator` ne fournit pas encore.
- Un identifiant de document Sanity ne contient **jamais de point**.
- Toute couleur vient de `styles/tokens.css`. **Aucun arrondi.** Toute animation
  vérifie `usePrefersReducedMotion()`.
