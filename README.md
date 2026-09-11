# Portfolio — Théotime Pagies

Développeur web full-stack à Lille. Le site est en ligne sur
[portfolio-theotime-pagies.vercel.app](https://portfolio-theotime-pagies.vercel.app/),
son contenu est administré dans un back-office Sanity.

## Structure

Monorepo **npm workspaces**, orchestré par **Turborepo**, une application par
dossier :

```
portfolio/
├── turbo.json      graphe des tâches, cache de build, variables d'environnement
├── apps/
│   ├── web/        le site — Vite, React 19, Tailwind, React Router
│   └── studio/     le back-office — Sanity Studio, React 19
├── packages/
│   └── shared/     ce que les deux consomment : type Locale, registre des technologies
├── .github/        CI (lint · types · format · build) et release automatique
└── .claude/        skills et permissions pour Claude Code
```

Le site ne dépend que de `packages/shared` et de l'API Sanity. Le Studio ne
dépend que de `packages/shared`. Les deux ne s'importent jamais l'un l'autre.

L'architecture interne du site (feature-based, flux UI → hooks → services →
API) est décrite dans `CLAUDE.md`, lu par Claude Code à chaque session.

## Démarrer

```bash
npm install          # installe les trois workspaces d'un coup
npm run dev          # site sur :5173 et Studio sur :3333, en parallèle
```

Ou séparément : `npm run dev:web`, `npm run dev:studio`.

`dev`, `build`, `lint` et `typecheck` passent par Turborepo, qui lance en
parallèle ce qui est indépendant et met en cache le résultat de chaque tâche :
relancer `npm run build` sans rien avoir modifié ne reconstruit rien. Vercel
réutilise ce cache d'un déploiement à l'autre. Pour ne viser qu'une
application : `npx turbo run build --filter=@portfolio/web`.

Variables d'environnement, dans `apps/web/.env` (jamais commité) :

```
SANITY_PROJECT_ID=svhdk2l2
SANITY_DATASET=production
VITE_EMAILJS_SERVICE_ID=…
VITE_EMAILJS_TEMPLATE_ID=…
VITE_EMAILJS_USER_ID=…
VITE_RECAPTCHA_SITE_KEY=…
```

et dans `apps/studio/.env` : `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`
(modèle dans `apps/studio/.env.example`).

## Qualité

```bash
npm run lint         # ESLint sur le site
npm run typecheck    # tsc sur le site et le Studio
npm run format:check # Prettier sur tout le dépôt
npm run build        # construit le site et le Studio
```

Les trois premières, sauf `format:check`, passent par Turborepo et sont donc
mises en cache.

Les quatre tournent en CI sur chaque PR, et avant chaque release. En local,
Husky formate et lint les fichiers modifiés à chaque commit, et vérifie que le
message suit les [Conventional Commits](https://www.conventionalcommits.org/)
(`feat(cms): …`, `fix(web): …`). C'est de ces messages que semantic-release
déduit la version et rédige le `CHANGELOG.md` à chaque fusion dans `master` :

| Commit                                     | Version        |
| ------------------------------------------ | -------------- |
| `fix(…)`, `perf(…)`                        | correctif      |
| `feat(…)`                                  | mineure        |
| `feat(…)!`, ou un pied `BREAKING CHANGE:`  | majeure        |
| `refactor`, `chore`, `docs`, `style`, `ci` | aucune release |

Vérifier avant de fusionner, sans rien publier :
`GITHUB_TOKEN=… npx semantic-release --dry-run --no-ci`.

## Déployer

**Le site** est déployé par Vercel à chaque push sur `master`. Dans les réglages
du projet Vercel, le _Root Directory_ doit valoir `apps/web` ; Vercel détecte les
workspaces et installe depuis la racine du dépôt. Les variables ci-dessus
doivent être définies pour l'environnement _Production_.

**Le Studio** est hébergé par Sanity :

```bash
npm run deploy:studio
```

**Le contenu** ne se déploie pas : le site le lit à chaque chargement de page.
Modifier un texte dans le Studio est visible immédiatement, sans build.

Le détail du back-office (ce qui est modifiable, la migration initiale, les
limites du plan gratuit) est dans [`apps/studio/README.md`](apps/studio/README.md).
