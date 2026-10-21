# <img src="apps/web/public/favicon.svg" alt="Logo" width="36" height="36" align="absmiddle" /> Portfolio - Théotime Pagies

Développeur web full-stack à Valenciennes. Le site est en ligne sur
[theotimepagies.com](https://theotimepagies.com/), son contenu est administré
dans un back-office Sanity, et un assistant répond aux visiteurs à partir de ce
contenu.

## Structure

Monorepo **npm workspaces**, orchestré par **Turborepo**, une application par
dossier :

```
portfolio/
├── turbo.json      graphe des tâches, cache de build, variables d'environnement
├── apps/
│   ├── web/        le site - Vite, React 19, Tailwind, React Router
│   ├── studio/     le back-office - Sanity Studio, React 19
│   └── api/        l'API - Hono : assistant et formulaire de contact
├── packages/
│   └── shared/     ce que tous consomment : type Locale, registre des technologies
├── docs/           architecture, Sanity, commits et versions
├── .github/        CI (lint · types · tests · format · build) et release automatique
└── .claude/        permissions pour Claude Code
```

Le site dépend de `packages/shared`, de l'API Sanity et de `apps/api`, qu'il
déploie en fonction Vercel (`apps/web/api/[[...route]].ts`). Le Studio ne
dépend que de `packages/shared`. Hors ce cas, les applications ne s'importent
jamais entre elles.

L'architecture interne du site (feature-based, flux UI → hooks → services →
API) est décrite dans [docs/architecture.md](docs/architecture.md), celle de
l'API dans [apps/api/README.md](apps/api/README.md).

## Démarrer

```bash
npm install          # installe les quatre workspaces d'un coup
npm run dev          # site sur :5173 et Studio sur :3333, en parallèle
```

Ou séparément : `npm run dev:web`, `npm run dev:studio`.

`dev`, `build`, `typecheck` et `test` passent par Turborepo, qui lance en
parallèle ce qui est indépendant et met en cache le résultat de chaque tâche :
relancer `npm run build` sans rien avoir modifié ne reconstruit rien. Vercel
réutilise ce cache d'un déploiement à l'autre. Pour ne viser qu'une
application : `npx turbo run build --filter=@portfolio/web`.

Variables d'environnement, dans `apps/web/.env` (jamais commité) :

```
SANITY_PROJECT_ID=svhdk2l2
SANITY_DATASET=production
EMAILJS_SERVICE_ID=…
EMAILJS_TEMPLATE_ID=…
EMAILJS_PUBLIC_KEY=…
EMAILJS_PRIVATE_KEY=…
GEMINI_API_KEY=…
LLM_MODELS=…
```

Seules les deux variables Sanity atteignent le navigateur ; les autres ne sont
lues que par l'API, côté serveur. Le modèle commenté est dans
`apps/web/.env.example`, le rôle de chaque variable de l'API dans
[apps/api/README.md](apps/api/README.md).

et dans `apps/studio/.env` : `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`
(modèle dans `apps/studio/.env.example`).

## Qualité

```bash
npm run lint         # ESLint sur tout le dépôt
npm run typecheck    # tsc sur le site, le Studio et l'API
npm test             # tests de l'API
npm run format:check # Prettier sur tout le dépôt
npm run build        # construit l'API, le site et le Studio
```

`typecheck`, `test` et `build` passent par Turborepo et sont donc mis en cache.

Les cinq tournent en CI sur chaque PR, et avant chaque release. En local,
Husky formate et lint les fichiers modifiés à chaque commit, et vérifie que le
message suit les [Conventional Commits](https://www.conventionalcommits.org/)
(`feat(cms): …`, `fix(web): …`). C'est de ces messages que semantic-release
déduit la version et rédige le `CHANGELOG.md` à chaque fusion dans `master`,
seule branche durable : les `feat/…` et `fix/…` en partent et y reviennent par
PR ([docs/versions.md](docs/versions.md)) :

| Commit                                     | Version        |
| ------------------------------------------ | -------------- |
| `fix(…)`, `perf(…)`                        | correctif      |
| `feat(…)`                                  | mineure        |
| `feat(…)!`, ou un pied `BREAKING CHANGE:`  | majeure        |
| `refactor`, `chore`, `docs`, `style`, `ci` | aucune release |

Vérifier avant de fusionner, sans rien publier :
`GITHUB_TOKEN=… npx semantic-release --dry-run --no-ci`.

## Déployer

**Le site** est déployé par Vercel à chaque push sur `master`, sur
[theotimepagies.com](https://theotimepagies.com/) ; chaque PR obtient un aperçu.
Dans les réglages du projet Vercel, le _Root Directory_ doit valoir `apps/web`,
avec « Include source files outside of the Root Directory » activé ; Vercel
détecte les workspaces et installe depuis la racine du dépôt. Les variables ci-dessus
doivent être définies pour l'environnement _Production_.

**Le Studio** est hébergé par Sanity :

```bash
npm run deploy:studio
```

**Le contenu** ne se déploie pas : le site le lit à chaque chargement de page.
Modifier un texte dans le Studio est visible immédiatement, sans build.

Le détail du back-office (ce qui est modifiable, la migration initiale, les
limites du plan gratuit) est dans [`apps/studio/README.md`](apps/studio/README.md).
