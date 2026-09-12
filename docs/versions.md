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
| Un texte éditorial                                         | rien à commiter | —         |
| Des fichiers déplacés, un hook extrait, sans effet visible | `refactor(…)`   | aucune    |
| Une dépendance montée, l'outillage, la CI                  | `chore` / `ci`  | aucune    |
| Le README, un commentaire, cette documentation             | `docs`          | aucune    |
| Les URL publiques, qui casse les liens existants           | `feat(web)!`    | majeure   |

Le contenu éditorial vit dans Sanity : le modifier ne produit aucun commit et
ne change aucune version — c'est visible en ligne dans la seconde.

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

Renovate (app GitHub, config dans `renovate.json`) tient les dépendances à jour :

| Quoi                              | Quand                   | Fusion                             |
| --------------------------------- | ----------------------- | ---------------------------------- |
| Correctifs et mineures, en une PR | le lundi matin          | seule, si la CI est verte          |
| Faille connue (OSV ou GitHub)     | dès qu'elle est publiée | seule, si la CI est verte          |
| Majeure, une PR par paquet        | le lundi matin          | à la main, après lecture des notes |
| Lockfile entier (transitives)     | le 1er du mois          | seule, si la CI est verte          |
| Actions GitHub des workflows      | le 1er du mois          | seule, si la CI est verte          |

Une version doit avoir **trois jours** d'existence avant d'être proposée : un
paquet compromis est presque toujours retiré du registre dans ce délai. Les
failles font exception et arrivent tout de suite.

Les épingles de `CLAUDE.md` (`react-icons`, la ligne TypeScript 5.9, le preset
de changelog en majeure 9) sont exclues : aucune PR ne les concernera. Retirer
une épingle, c'est retirer sa règle dans `renovate.json` en même temps.

Les commits sont des `chore(deps)` : aucune release, le changelog les ignore.
L'issue « Dependency Dashboard » du dépôt liste tout ce qui est en attente ou
bloqué ; cocher une case y force une PR hors calendrier.
