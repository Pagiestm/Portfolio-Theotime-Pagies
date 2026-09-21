# Commits et versions

Le type d'un commit décide de la version publiée par semantic-release au merge
dans `master`. Ce document détaille la correspondance et les pièges.

Le numéro de version ne sert ici ni à un consommateur ni à une compatibilité :
rien n'est publié sur npm, et Vercel redéploie le site en continu. Ce qu'on en
tire, c'est le `CHANGELOG.md` rédigé automatiquement et des points de retour
identifiables. Choisir le type de commit sur ce qui change réellement, sans
chercher à faire coller une sémantique de bibliothèque.

| Ce que je change                                           | Commit          | Version   |
| ---------------------------------------------------------- | --------------- | --------- |
| Un affichage cassé, un lien mort, un comportement faux     | `fix(web)`      | correctif |
| Un chargement allégé, une image ou un chunk optimisés      | `perf(web)`     | correctif |
| Une page, une section, une fonctionnalité visible en plus  | `feat(web)`     | mineure   |
| Un champ ou un type de document dans le Studio             | `feat(cms)`     | mineure   |
| Un texte éditorial                                         | rien à commiter | -         |
| Des fichiers déplacés, un hook extrait, sans effet visible | `refactor(…)`   | aucune    |
| Une dépendance de production montée                        | `fix(deps)`     | correctif |
| Une dépendance de développement, l'outillage, la CI        | `chore` / `ci`  | aucune    |
| Le README, un commentaire, cette documentation             | `docs`          | aucune    |
| Les URL publiques, qui casse les liens existants           | `feat(web)!`    | majeure   |

Le contenu éditorial vit dans Sanity : le modifier ne produit aucun commit et
ne change aucune version - c'est visible en ligne dans la seconde.

La version majeure n'a presque aucun sens sur ce dépôt. Ne l'employer que pour
une refonte qui invalide des adresses partagées à l'extérieur.

En fusion _squash_, c'est le titre du squash qui est analysé, pas les commits
qu'il contient : y recopier le type le plus fort de la branche, sans quoi un
`feat` ou un `fix` disparaît et rien n'est publié.

`conventional-changelog-conventionalcommits` est tenu en majeure **9**. La 10
exige `conventional-changelog-writer` 9, alors que
`@semantic-release/release-notes-generator`, déjà à sa dernière version,
dépend de la 8 : la release échoue alors à l'étape `generateNotes`, après avoir
calculé la version mais avant d'écrire quoi que ce soit. Ne remonter le preset
que si le générateur de notes accepte un jour le writer 9.

## Mises à jour de dépendances

Renovate (app GitHub, config dans `renovate.json`) tient les dépendances à jour.
La configuration s'appuie sur les presets officiels plutôt que sur des règles
écrites à la main : `config:recommended`, `group:allNonMajor`,
`:automergeMinor`, `:maintainLockFilesWeekly`, `:prConcurrentLimitNone`.

| Quoi                              | Quand                        | Fusion                             |
| --------------------------------- | ---------------------------- | ---------------------------------- |
| Correctifs et mineures, en une PR | dès qu'une version a 3 jours | seule, si la CI est verte          |
| Paquets en 0.x                    | idem                         | à la main, une mineure y casse     |
| Majeure, une PR par paquet        | idem                         | à la main, après lecture des notes |
| Faille connue (OSV ou GitHub)     | dès qu'elle est publiée      | seule, si la CI est verte          |
| Lockfile entier (transitives)     | chaque semaine               | seule, si la CI est verte          |

Aucune limite de PR : toutes sortent au fil de l'eau. Le plafond précédent, cinq
PR simultanées, pouvait être saturé par des majeures en attente d'arbitrage, et
retenir indéfiniment des mises à jour saines derrière elles.

Une version doit avoir **trois jours** d'existence avant d'être proposée : un
paquet compromis est presque toujours retiré du registre dans ce délai. Les
failles font exception et arrivent tout de suite.

La maintenance hebdomadaire du lockfile est le seul mécanisme qui atteint les
dépendances **transitives** — celles qu'aucun `package.json` ne déclare, et où
se logent la plupart des alertes de `npm audit`.

## Épingles et surcharges

Chacune tient une incompatibilité constatée. Les retirer demande de traiter la
cause, pas seulement la ligne.

| Contrainte                                                | Pourquoi                                                                                                                                                 |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-icons` figé en 5.3.0                               | les versions suivantes ont retiré `SiPlaywright`, utilisé par `constants/tech.ts`                                                                        |
| `overrides.typescript` en 5.9                             | la chaîne Sanity déclare des peers très larges ; sans cette borne npm hisse un TypeScript majeur plus récent, sur lequel `@typescript-eslint` s'effondre |
| `conventional-changelog-conventionalcommits` en majeure 9 | la 10 exige un writer que `release-notes-generator` ne fournit pas                                                                                       |
| `overrides.eslint-plugin-react`                           | le plugin plafonne sa compatibilité à ESLint 9.7 alors qu'il fonctionne avec la 10 ; la surcharge tombera quand il déclarera la 10                       |

Les paquets épinglés sont exclus des mises à jour : aucune PR ne les concernera.
Retirer une épingle, c'est retirer sa règle dans `renovate.json` en même temps.

## ESLint

La configuration est à plat (`apps/web/eslint.config.js`), sur ESLint 10. Deux
règles apparues avec `eslint-plugin-react-hooks` 7 y sont désactivées —
`set-state-in-effect` et `refs` — le temps de traiter les sept occurrences
qu'elles signalent, dans `Reveal`, `Header`, `useMediaQuery`, `usePagination` et
`AssistantWidget`. Ce sont de vrais anti-patterns : les corriger demande
`useSyncExternalStore` pour les media queries et une clé de remontage pour la
pagination. Les réactiver sans ce travail fera échouer le lint.

Les commits sont des `chore(deps)` : aucune release, le changelog les ignore.
L'issue « Dependency Dashboard » du dépôt liste tout ce qui est en attente ou
bloqué ; cocher une case y force une PR hors calendrier.
