# API du portfolio

L'assistant du site : `POST /api/ask` reçoit une question et une langue, et
répond à partir du contenu Sanity, avec les pages citées en sources.

## Structure

```
src/
├── config/        lecture et validation des variables d'environnement
├── controllers/   un fichier par ressource : valide l'entrée, appelle le service, répond
├── services/      la logique : contenu Sanity, sélection du contexte, appel du modèle
├── models/        types des requêtes, réponses, contenu ; classes d'erreur HTTP
├── middlewares/   limitation de débit, traduction des erreurs en JSON
├── routes/        le câblage des URL vers les contrôleurs
└── index.ts       assemble l'application Hono, exporte `app` et `handler`
tests/             tests Node natifs, sans réseau : les appels sortants sont simulés
```

Une requête traverse les couches dans un seul sens : route → middleware →
contrôleur → service → modèle. Un contrôleur ne lit jamais Sanity ni Gemini ;
un service ne connaît pas HTTP.

## Où elle tourne

- **En production**, comme fonction Vercel du site : `apps/web/api/[[...route]].ts`
  ne fait qu'exporter `handler`, un listener Node `(req, res)` : le runtime Node de Vercel
  appelle l'exportation par défaut avec cette signature, pas avec une `Request` Web.
  Vercel compile `dist/`, produit par `npm run build`. `maxDuration` est porté à
  30 s dans `apps/web/vercel.json` : un appel au modèle prend 3 à 7 s, plus le démarrage.
- **En développement**, le serveur Vite du site charge `src/index.ts` et lui
  passe toute requête `/api/*` : `npm run dev` à la racine suffit.

## Variables

| Variable            | Rôle                                        |
| ------------------- | ------------------------------------------- |
| `GEMINI_API_KEY`    | clé du modèle, jamais exposée au navigateur |
| `GEMINI_MODEL`      | optionnel, défaut `gemini-3.6-flash`        |
| `SANITY_PROJECT_ID` | dataset public lu sur le CDN, sans jeton    |
| `SANITY_DATASET`    | optionnel, défaut `production`              |

En local elles vivent dans `apps/web/.env` ; sur Vercel dans les variables du
projet.

## Commandes

```bash
npm test -w @portfolio/api        # tests
npm run typecheck -w @portfolio/api
npm run build -w @portfolio/api   # dist/ pour Vercel
```
