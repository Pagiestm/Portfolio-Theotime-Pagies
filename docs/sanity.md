# Sanity

Le contenu éditorial vit dans Sanity. Ce document détaille le projet, ses
contraintes et le déploiement.

- Projet `svhdk2l2`, dataset `production`, **public en lecture**. N'y rien déposer
  de confidentiel.
- Les identifiants de documents ne contiennent **jamais de point** : un point en
  fait un chemin, et Sanity rend privé tout document dans un chemin (mécanisme de
  `drafts.*`). Le document serait écrit, lisible avec un jeton, invisible du site.
- Variables côté site : `SANITY_PROJECT_ID` et `SANITY_DATASET`, sans préfixe
  `VITE_`, exposées nommément via `envPrefix` dans `vite.config.ts`. Jamais un
  préfixe `SANITY_` générique : un `SANITY_WRITE_TOKEN` finirait dans le bundle.
- Origines CORS autorisées sans identifiants : `localhost:5173`, `localhost:4173`,
  le domaine Vercel et ses previews. Une nouvelle origine s'ajoute dans
  sanity.io/manage.
- La migration (`npm run migrate`) écrase le contenu éditorial par l'instantané de
  `apps/studio/scripts/seed.mjs` et ne recrée plus les réalisations. Ne la relancer
  que sur un dataset vide. Sauvegarde réelle : `npx sanity dataset export`.
- Déploiement Vercel : Root Directory `apps/web`, « Include source files outside of
  the Root Directory » activé.
