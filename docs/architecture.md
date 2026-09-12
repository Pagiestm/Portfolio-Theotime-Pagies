# Architecture

Structure du monorepo, puis architecture interne du site (`apps/web`), qui suit
une architecture **feature-based**, d'après « React Architecture: A Complete
Guide for Scalable Front-End Applications » (Rohit Kuwar). `CLAUDE.md` n'en
garde que les règles qui gouvernent chaque session.

## Structure du dépôt

```
turbo.json         orchestration     graphe des tâches, cache, variables d'env
apps/web/          le site           React 19, Vite, Tailwind, React Router
apps/studio/       le back-office    Sanity Studio, React 19, toolchain propre
packages/shared/   partagé           type Locale, registre TECHNOLOGIES
```

- `apps/web` n'importe jamais `apps/studio`, ni l'inverse.
- `packages/shared` n'a aucune dépendance à React, Sanity ou au DOM. Toute valeur
  dupliquée entre web et studio y remonte.
- Registre des technologies : la liste des clés est dans `shared`, le Studio en fait
  son menu déroulant, le site y associe les logos dans `constants/tech.ts`, et `tsc`
  refuse une clé sans logo. Ajouter une techno = une ligne dans `shared` + un logo
  dans le site.
- Le site et le Studio sont tous deux en React 19, mais chacun le déclare dans son
  workspace : rien n'oblige les deux versions à rester identiques, et npm est libre
  d'en hisser une et d'en imbriquer une autre. `resolve.dedupe` dans
  `apps/web/vite.config.ts` garantit une seule copie de React dans le bundle du
  site. Ne pas le retirer.
- `react-icons` est épinglé à `5.3.0`, sans accent circonflexe : les versions
  suivantes ont retiré `SiPlaywright`, utilisé par `constants/tech.ts`.
- `overrides.typescript` à la racine force toute la ligne 5.9. La chaîne Sanity
  déclare des `peerDependencies` très larges (`typescript >=5`, `^5 || ^6 || ^7`) :
  sans cette contrainte npm hisse un TypeScript majeur plus récent à la racine, et
  `@typescript-eslint` 7 s'y casse - le lint échoue avant d'avoir lu une ligne de
  code.
- `prepare` tolère l'absence de husky (`husky || echo …`). Un build distant qui
  n'installe pas les devDependencies ferait autrement échouer `npm install` en
  entier sur un outil qui ne sert qu'en local.

Passer des arguments à travers un script racine ne marche pas (`npm run preview
-- --port` perd `--port`) : appeler l'outil directement, ou lancer la commande
depuis `apps/web` ou `apps/studio`.

## Architecture du site (`apps/web/src`)

Flux en une ligne, chaque flèche à sens unique :

```
UI (pages, components) → Hooks → Services → API (Sanity, EmailJS) → État (loaders React Router)
```

Un composant ne parle jamais à une API, un service ne rend jamais de JSX, un hook
ne contient pas de requête GROQ.

# Où va quoi

| Ce que j'ajoute                        | Dossier                          | Exemple                                    |
| -------------------------------------- | -------------------------------- | ------------------------------------------ |
| Un écran routé                         | `pages/`                         | `pages/WorkPage.tsx`                       |
| Un composant propre à un domaine       | `features/<domaine>/components/` | `features/work/components/ProjectRow.tsx`  |
| Un hook propre à un domaine            | `features/<domaine>/hooks/`      | `features/work/hooks/useProjectFilters.ts` |
| Un composant générique sans métier     | `components/common/`             | `components/common/Reveal.tsx`             |
| Un hook utilisé par plusieurs features | `hooks/`                         | `hooks/useScrollProgress.ts`               |
| Un appel API ou SDK externe            | `services/`                      | `services/emailService.ts`                 |
| Une requête GROQ                       | `services/sanity/queries.ts`     |                                            |
| Un chargeur de route                   | `services/sanity/loaders.ts`     |                                            |
| Un type venant de l'API                | `services/sanity/types.ts`       | `Project`, réexporte `Locale`              |
| La coquille commune                    | `layouts/`                       | `layouts/MainLayout.tsx`                   |
| Une URL                                | `routes/paths.ts`                | source unique, aucune URL en dur ailleurs  |
| Une variable d'environnement           | `config/env.ts`                  | seul fichier qui lit `import.meta.env`     |
| Une constante partagée entre features  | `constants/`                     | `constants/tech.ts`                        |
| Un utilitaire pur sans React           | `utils/`                         | `utils/slugify.ts`                         |
| Un libellé d'interface                 | `i18n/fr.ts` et `i18n/en.ts`     | « Envoyer », « Voir plus »                 |
| Un token de design                     | `styles/tokens.css`              | exposé à Tailwind                          |
| Une valeur partagée avec le Studio     | `packages/shared/src/`           | `TECHNOLOGIES`, `Locale`                   |

Si un fichier ne rentre dans aucune case, le dire plutôt que de forcer.

# Nommage

Composants `PascalCase`, un par fichier, le fichier porte le nom de l'export.
Hooks `useCamelCase`, fichier du même nom. Fonctions et services `camelCase`.
Types `PascalCase` sans préfixe `I`. Constantes figées `SCREAMING_SNAKE_CASE`.
Requêtes GROQ `NOM_QUERY`. Dossiers de features : un mot, au singulier.

# Composants

Trois sortes, à ne pas mélanger dans un même fichier :

1. **Présentation** : props en entrée, JSX en sortie, ni données ni routeur.
   `features/*/components` et `components/common`.
2. **Conteneur** : lit les données (`useLoaderData`, hooks) et délègue le rendu.
   Ce sont les `pages/`.
3. **Générique** : réutilisable partout, ignore le métier. `components/common`.

Un composant qui dépasse ~150 lignes cache un hook ou un sous-composant.

# État

| Donnée                                  | Où                              |
| --------------------------------------- | ------------------------------- |
| Saisie, bascule d'UI, valeur temporaire | `useState` local                |
| Contenu Sanity d'une page               | `loader` de la route            |
| Réglages du site (nom, liens)           | `loader` racine + `useSettings` |
| Langue courante                         | `I18nProvider`, seul Context    |

Pas de Redux ni Zustand. Une donnée API à partager hors loaders appellerait un
cache de requêtes (TanStack Query), jamais un store.

# Couche service

- Aucun composant n'appelle une API : il consomme un loader ou un hook.
- Les requêtes GROQ projettent exactement les champs utilisés par les vues.
- Une ressource absente lève `new Response(…, { status: 404 })` dans le loader ;
  toute autre erreur remonte à `ErrorPage` via le routeur.
- `import.meta.env` n'apparaît que dans `config/env.ts`.
- Le site lit Sanity sans jeton (dataset public, `useCdn: true`). Aucun jeton
  d'écriture ne doit exister côté web, ni dans le code ni dans une variable exposée.

# Hooks

Un hook fait une chose et porte son nom. La logique sort du composant dès qu'elle
dépasse quelques lignes. Un hook reste dans sa feature tant qu'une seule l'utilise.
Une boucle `requestAnimationFrame` passe par un `IntersectionObserver`, s'arrête
hors écran, et respecte `prefers-reduced-motion`. Tout ce qu'un effet crée, son
nettoyage le détruit : observateurs, écouteurs, contexte WebGL via
`forceContextLoss()` avant `dispose()`.

# Routage

`routes/paths.ts` est la seule source des URL. Toute page hors accueil est en
`lazy()`. Chaque route déclare son `loader`. Le layout racine porte `errorElement`.
Les identifiants d'URL sont des slugs, jamais des index.

# Isolation des features

Une feature n'importe jamais une autre feature. Ce qui doit être partagé remonte :
composant vers `components/common`, hook vers `hooks/`, constante vers
`constants/`, type vers `services/sanity/types.ts`.

# Design system Modernist

Toute couleur vient de `styles/tokens.css` via les classes Tailwind (`bg-surface`,
`text-muted`, `border-line`) ; aucun hex dans un composant. **Aucun arrondi.**
Filets 2 px pour les séparations majeures, 1 px pour les mineures. Libellés de
boutons alignés à gauche. Captures d'écran en `object-contain`, jamais recadrées.
Toute animation vérifie `usePrefersReducedMotion()`.

# Bilingue

Le contenu éditorial est un objet `{ fr, en }` résolu par `localize()`, qui retombe
sur `fr` si `en` est absent **ou vide**. Un composant ne teste jamais `lang`, il
appelle `localize()`. Les micro-libellés d'interface restent dans `i18n/`, pas dans
Sanity : un champ vide dans un CMS casse une interface, pas un texte.

# Performance

Code-splitting par route ; three.js dans son propre chunk. Images via le CDN Sanity
avec une largeur explicite (`imageUrl(src, 720)`), jamais l'original. `React.memo`
et `useMemo` sur mesure, pas par réflexe.

## Checklist avant de créer ou déplacer un fichier

1. Quelle case du tableau « Où va quoi » ? Aucune : le signaler.
2. Le fichier porte-t-il le nom de son export ?
3. Importe-t-il une autre feature ? Remonter le partagé.
4. Appelle-t-il une API, lit-il `import.meta.env`, teste-t-il `lang` ? Service,
   `config/env.ts`, `localize()`.
5. Une couleur ou un arrondi en dur ? Retour aux tokens.
6. Une boucle d'animation ? Garde de visibilité et `prefers-reduced-motion`.
7. Lint, typecheck, format, build passent. Rendu vérifié si l'affichage change.
