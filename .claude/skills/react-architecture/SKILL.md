---
name: react-architecture
description: Architecture feature-based et conventions React de ce portfolio, d'après « React Architecture — A Complete Guide for Scalable Front-End Applications » (Rohit Kuwar). Flux UI → Hooks → Services → API, où placer chaque fichier, nommage, règles de state, isolation des features, design system Modernist, i18n { fr, en }. À charger avant de créer, déplacer ou renommer un fichier dans src/, d'ajouter un composant, un hook, une requête Sanity, une route ou un appel externe, de refactoriser, ou pour relire un diff contre ces règles.
---

# Architecture React du portfolio

Modèle : **Feature-Based Architecture** avec couches transverses. Le code est
découpé par domaine métier (`features/`), et tout ce qui traverse les domaines
vit dans une couche dédiée. Les chemins ci-dessous sont relatifs à la racine
de l'application web (le dossier qui contient `src/`).

## Le flux, en une ligne

```
UI (pages, components) → Hooks → Services → API (Sanity, EmailJS) → État (loaders React Router)
```

Chaque flèche ne va que dans un sens. Un composant ne parle jamais à une API,
un service ne rend jamais de JSX, un hook ne contient pas de requête GROQ.

## Où va quoi

| Ce que j'ajoute                             | Dossier                          | Exemple dans le projet                         |
| ------------------------------------------- | -------------------------------- | ---------------------------------------------- |
| Un écran routé                              | `pages/`                         | `pages/WorkPage.tsx`                           |
| Un composant propre à un domaine            | `features/<domaine>/components/` | `features/work/components/ProjectRow.tsx`      |
| Un hook propre à un domaine                 | `features/<domaine>/hooks/`      | `features/work/hooks/useProjectFilters.ts`     |
| Un composant générique sans logique métier  | `components/common/`             | `components/common/Reveal.tsx`                 |
| Un hook réutilisable par plusieurs features | `hooks/`                         | `hooks/useScrollProgress.ts`                   |
| Un appel à une API ou un SDK externe        | `services/`                      | `services/emailService.ts`, `services/sanity/` |
| Une requête GROQ                            | `services/sanity/queries.ts`     | —                                              |
| Un chargeur de route                        | `services/sanity/loaders.ts`     | —                                              |
| Un type de donnée venant de l'API           | `services/sanity/types.ts`       | `Project`, `Locale`                            |
| La coquille commune (header, footer)        | `layouts/`                       | `layouts/MainLayout.tsx`                       |
| Une route ou un chemin d'URL                | `routes/`                        | `routes/paths.ts` (source unique des URL)      |
| Une variable d'environnement                | `config/env.ts`                  | seul fichier autorisé à lire `import.meta.env` |
| Une constante partagée (registre, table)    | `constants/`                     | `constants/tech.ts`                            |
| Un utilitaire pur, sans React               | `utils/`                         | `utils/slugify.ts`                             |
| Un libellé d'interface                      | `i18n/fr.ts` et `i18n/en.ts`     | « Envoyer », « Voir plus »                     |
| Un token de design                          | `styles/tokens.css`              | couleurs, exposées à Tailwind                  |

Si un fichier ne rentre dans aucune case, la case manque : le dire plutôt que
de forcer.

## Nommage

- Composants : `PascalCase`, un composant par fichier, **le fichier porte le nom
  de l'export par défaut** (`ProjectRow.tsx` exporte `ProjectRow`).
- Hooks : `useCamelCase`, fichier du même nom (`useProjectFilters.ts`).
- Fonctions, variables, services : `camelCase`.
- Types et interfaces : `PascalCase`, sans préfixe `I`.
- Constantes figées : `SCREAMING_SNAKE_CASE` (`FEATURED_COUNT`, `TECH`).
- Dossiers de features : `kebab-case` ou un mot, au singulier (`work`, `path`).
- Requêtes GROQ : `NOM_QUERY` en majuscules.

## Trois sortes de composants

1. **Présentation** — reçoit des props, rend du JSX, aucun accès aux données ni
   au routeur. La plupart des `features/*/components` et tout `components/common`.
2. **Conteneur** — lit les données (`useLoaderData`, hooks), choisit quoi
   afficher, délègue le rendu. Ce sont les `pages/`.
3. **Générique** — bouton, grille, révélation au scroll : réutilisable partout,
   ignore le métier. Vit dans `components/common`.

Un composant qui fait les trois à la fois est à découper.

## Où vit l'état

| Nature de la donnée                                   | Où                                   | Pourquoi                                              |
| ----------------------------------------------------- | ------------------------------------ | ----------------------------------------------------- |
| Saisie de formulaire, bascule d'UI, valeur temporaire | `useState` local                     | ne concerne qu'un composant                           |
| Contenu venant de Sanity                              | `loader` de la route                 | prêt avant le rendu, pas d'état de chargement à gérer |
| Réglages du site (nom, liens)                         | `loader` racine + hook `useSettings` | chargé une fois, lu partout                           |
| Langue courante                                       | `I18nProvider` (Context)             | seule donnée réellement globale                       |

Pas de Redux ni de Zustand : rien ici ne le justifie. Si une donnée API doit
être partagée entre pages sans passer par les loaders, la réponse est un cache
de requêtes (TanStack Query), pas un store.

## La couche service

- **Aucun composant n'appelle une API.** Il consomme un loader ou un hook.
- Les requêtes GROQ projettent exactement les champs utilisés par les vues : le
  document brut n'atteint jamais un composant.
- Les erreurs d'API remontent au routeur (`ErrorPage`) ; une ressource absente
  lève `new Response(..., { status: 404 })` depuis le loader.
- `import.meta.env` n'apparaît que dans `config/env.ts`. Partout ailleurs :
  `env.sanity.projectId`.
- Le client Sanity lit sans jeton (`useCdn: true`, dataset public). Aucun jeton
  d'écriture ne doit exister côté web, ni dans le code ni dans une variable
  exposée au bundle.

## Hooks

- Un hook fait **une chose** et porte le nom de cette chose.
- La logique sort des composants dès qu'elle dépasse quelques lignes : un
  composant de 300 lignes est un hook qui n'a pas encore été écrit.
- Un hook propre à une feature reste dans la feature ; il remonte dans `hooks/`
  seulement quand une deuxième feature en a besoin.
- Les effets écrivant dans le DOM à chaque frame (`requestAnimationFrame`)
  passent par un `IntersectionObserver` et s'arrêtent hors écran ; ils
  respectent `prefers-reduced-motion`.

## Routage

- `routes/paths.ts` est la **seule** source des URL. Aucune chaîne `/realisations`
  ailleurs.
- Toute page hors accueil est chargée en `lazy()`.
- Chaque route déclare son `loader`. Le layout racine porte `errorElement`.
- Les identifiants d'URL sont des slugs stables, jamais des index.

## Isolation des features

**Une feature n'importe jamais une autre feature.** Ce qui doit être partagé
remonte : composant → `components/common`, hook → `hooks/`, constante →
`constants/`, type → `services/sanity/types.ts`. Le registre d'icônes
`constants/tech.ts` est l'exemple : consommé par `work` et `skills`, il ne peut
appartenir à aucune des deux.

## Design system Modernist

- Toute couleur vient de `styles/tokens.css` via les classes Tailwind exposées
  (`bg-surface`, `text-muted`, `border-line`). Aucun hex dans un composant.
- **Aucun arrondi**, nulle part. Filets de 2 px pour les séparations majeures,
  1 px pour les mineures.
- Libellés de boutons alignés à gauche, jamais centrés.
- Les captures d'écran s'affichent en `object-contain`, jamais recadrées.
- Toute animation vérifie `usePrefersReducedMotion()` ; le défilement fluide
  est conditionné au même réglage.

## Bilingue

- Le contenu éditorial est un objet `{ fr, en }` résolu par `localize()`, qui
  retombe sur le français si l'anglais est absent **ou vide**.
- Les micro-libellés d'interface restent dans `i18n/fr.ts` et `i18n/en.ts`, pas
  dans Sanity : un champ vide dans un CMS casse une interface, pas un texte.
- Un composant ne teste jamais `lang === 'fr'` : il appelle `localize()`.

## Performance

- Code-splitting par route ; les grosses dépendances (three.js) dans leur propre
  chunk chargé à la demande.
- Images servies par le CDN Sanity avec une largeur explicite (`imageUrl(src, 720)`),
  jamais l'original.
- `React.memo` / `useMemo` seulement sur une mesure, pas par réflexe.
- Tout ce qui est créé dans un effet est détruit dans son nettoyage
  (observateurs, écouteurs, contexte WebGL via `forceContextLoss()`).

## Qualité

Avant de proposer un changement, ces quatre commandes passent :

```
npm run lint && npm run typecheck && npm run format:check && npm run build
```

Commits au format Conventional Commits (`feat(cms): …`), en français, corps
expliquant le pourquoi. Husky les vérifie.

## Écarts connus, à résorber à la prochaine restructuration

- `lib/sanity/` devrait s'appeler `services/sanity/` : c'est la couche service,
  l'article et le reste du projet la nomment ainsi.
- `lib/sanity/useContent.ts` est un hook : sa place est `hooks/useSettings.ts`.

Tant que ces écarts existent, ne pas les aggraver : rien de nouveau dans `lib/`.

## Checklist avant de créer ou déplacer un fichier

1. Quelle case du tableau « Où va quoi » ? Si aucune, le signaler.
2. Le nom du fichier est-il celui de son export ?
3. Le fichier importe-t-il une autre feature ? Si oui, remonter le partagé.
4. Un composant y appelle-t-il une API, lit-il `import.meta.env`, teste-t-il
   `lang` ? Si oui, c'est un service, `config/env.ts` ou `localize()`.
5. Une valeur de couleur ou un arrondi en dur ? Retour aux tokens.
6. Une boucle d'animation ? Garde de visibilité + `prefers-reduced-motion`.
7. `lint`, `typecheck`, `format:check`, `build` passent.
