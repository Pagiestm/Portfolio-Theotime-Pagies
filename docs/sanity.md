# Sanity : faire évoluer le back-office

L'usage quotidien du Studio est dans [apps/studio/README.md](../apps/studio/README.md).
Ce guide explique comment **ajouter ou changer ce qui est modifiable**.

## Comment ça marche

```
Studio (apps/studio)  ──écrit──▶  Dataset Sanity  ◀──lit──  Site (apps/web)
formulaire généré                 base de données           requêtes GROQ
depuis les schémas                hébergée                  dans les loaders
```

Le Studio est un formulaire généré depuis des fichiers TypeScript. Le site ne
reçoit jamais un document brut : chaque page demande exactement les champs
qu'elle affiche. D'où la règle qui explique la plupart des surprises :

> **Ajouter un champ dans le Studio ne change rien sur le site** tant que la
> requête ne le demande pas et qu'un composant ne l'affiche pas.

Une modification est un brouillon jusqu'au clic sur **Publish** ; le site ne lit
que le contenu publié, avec quelques secondes de délai (CDN).

## Ajouter un champ : cinq étapes

Lancer `npm run dev` depuis la racine : Studio sur `:3333`, site sur `:5173`,
les deux se rechargent seuls.

| #   | Étape                                  | Fichier                                                                                                    |
| --- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Déclarer le champ (`defineField`)      | `apps/studio/schemaTypes/documents/*.ts` ou `singletons/*.ts` ; nouveau type : `objects/*.ts` + `index.ts` |
| 2   | Le remplir dans le Studio et publier   |                                                                                                            |
| 3   | Le demander dans la requête GROQ       | `apps/web/src/services/sanity/queries.ts`                                                                  |
| 4   | Déclarer sa forme, celle de la requête | `apps/web/src/services/sanity/types.ts`                                                                    |
| 5   | L'afficher                             | `apps/web/src/pages/*.tsx`, `features/*/components/`                                                       |

Tester une requête avant de la coller : onglet **Vision** du Studio. Puis
`npm run lint && npm run typecheck && npm run format:check && npm run build`,
et vérifier dans le navigateur.

**Exemple à suivre** : le champ `resources` (liens et documents libres d'une
réalisation) traverse exactement ces cinq étapes. Lire dans l'ordre
`schemaTypes/objects/resources.ts`, `documents/project.ts`, `queries.ts`
(`resources[]`), `types.ts` (`ProjectResource`), `pages/ProjectPage.tsx`.

Texte bilingue : `localeString` (court), `localeText` (paragraphe),
`localeBlock` (riche). Côté site, `localize(valeur)` retombe sur le français si
l'anglais est vide. Images : `imageUrl(source, largeur)`.

## Qui redéployer

| Ce qui a changé | À faire                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| Du contenu      | rien, le site le lit au prochain chargement                                 |
| Un schéma       | `npm run deploy:studio`, sinon le Studio en ligne garde l'ancien formulaire |
| Du code du site | commit et push sur `master`, Vercel déploie                                 |

## Changer un champ existant

**Un champ ne change jamais de type** : les données existantes resteraient
dans l'ancien format et le Studio les afficherait en erreur. On ajoute un
nouveau champ, on déplace le contenu par script, on retire l'ancien.
les scripts `apps/studio/scripts/migrate-*.mjs` sont les modèles : rejouable, avec
`--dry-run`, exécuté par `npx sanity exec … --with-user-token` sans jeton à
créer.

Un champ `required` ajouté après coup bloque la republication des documents
qui ne l'ont pas.

## Contraintes

- Un identifiant de document ne contient **jamais de point** : Sanity rend
  privé tout document dans un chemin, il serait invisible du site.
- Le dataset est **public en lecture**. Rien de confidentiel, et aucun jeton
  d'écriture côté web.
- Variables du site : `SANITY_PROJECT_ID` et `SANITY_DATASET`, sans `VITE_`,
  exposées nommément par `envPrefix` dans `vite.config.ts`. Jamais un préfixe
  `SANITY_` générique.
- Nouvelle origine (domaine, port) : sanity.io/manage › API › CORS, sans
  identifiants.
- Sanity est la seule source du contenu : sauvegarde par `npx sanity dataset export`
  depuis `apps/studio`.
- Vercel : Root Directory `apps/web`, « Include source files outside of the
  Root Directory » activé.
