# Back-office Sanity

Le contenu du portfolio (réalisations, textes des pages, parcours, compétences,
à propos) vit dans Sanity. Le site le lit au chargement de chaque page ; il n'y
a plus rien à modifier dans le code pour changer un texte ou ajouter un projet.

## Première mise en route

Une seule fois, pour créer le projet Sanity et y verser le contenu existant.

```bash
# 1. S'authentifier (ouvre le navigateur)
npx sanity login

# 2. Créer le projet — répondre : nouveau projet, dataset "production"
cd studio
npx sanity init --env

# 3. Reporter l'identifiant dans le .env du site, à la racine du dépôt :
#    VITE_SANITY_PROJECT_ID=<le projectId>
#    VITE_SANITY_DATASET=production

# 4. Créer un jeton d'écriture sur sanity.io/manage
#    > API > Tokens > Add token, rôle « Editor »
#    puis l'ajouter à studio/.env :  SANITY_WRITE_TOKEN=sk...

# 5. Vérifier ce qui va être écrit, sans rien écrire
npm run migrate -- --dry-run

# 6. Verser le contenu (11 réalisations, 73 images, 3 PDF, 7 pages)
npm run migrate
```

## Au quotidien

```bash
cd studio
npm run dev      # back-office en local sur http://localhost:3333
npm run deploy   # publie sur https://<nom>.sanity.studio (hébergement gratuit)
```

## Ce qui est modifiable

| Dans le Studio                                              | Effet sur le site                                                    |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| **Pages › Accueil**                                         | chapitres de la scène, bande de repères, bannière de clôture         |
| **Pages › Réalisations / Parcours / Compétences / Contact** | surtitre, titre et chapô de la page                                  |
| **Pages › À propos**                                        | biographie, faits, portrait                                          |
| **Pages › Réglages du site**                                | nom, intitulé de poste, email, GitHub, LinkedIn                      |
| **Réalisations**                                            | un document par projet : textes, images, technologies, liens         |
| **Parcours**                                                | les étapes de la frise horizontale                                   |
| **Groupes de compétences**                                  | les quatre colonnes de la page Compétences                           |
| **Technologies**                                            | le référentiel partagé, référencé par les projets et les compétences |

Ce qui **reste dans le code** : les micro-libellés d'interface (« Envoyer »,
« Voir plus », messages d'erreur du formulaire), dans `src/i18n/`. Les exposer
dans un CMS ferait courir le risque qu'un champ vide casse l'interface.

## Bilingue

Chaque champ éditorial a une version française (obligatoire) et une version
anglaise (facultative). Un champ anglais laissé vide retombe automatiquement
sur le français à l'affichage — traduire peut donc se faire progressivement.

## Icônes des technologies

`iconKey` pointe vers le registre `src/constants/tech.ts` du site. Ajouter une
technologie dont la clé n'y figure pas fonctionne : seul le libellé s'affiche,
sans logo. Pour ajouter un logo, il faut une ligne dans ce registre.

## À savoir sur le plan gratuit

20 sièges, 250 000 requêtes API par mois, 100 Go de bande passante, 100 Go
d'assets, hébergement du Studio inclus. Les datasets y sont **publics en
lecture** : le contenu est lisible par qui connaît l'identifiant du projet.
Sans conséquence ici puisqu'il s'agit déjà du contenu public du site, mais
n'y déposez rien de confidentiel. L'écriture reste protégée par votre compte.

## Rejouer la migration

`npm run migrate` est idempotent — chaque document a un identifiant
déterministe et se fait remplacer. **Le rejouer écrase le contenu du Studio par
l'instantané figé dans `scripts/seed.mjs`** : à ne relancer que sur un dataset
vide, ou en sachant ce qu'on perd.
