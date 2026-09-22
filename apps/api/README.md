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

| Variable            | Rôle                                                 |
| ------------------- | ---------------------------------------------------- |
| `GEMINI_API_KEY`    | clé des modèles Google, jamais exposée au navigateur |
| `LLM_MODELS`        | **obligatoire**, liste ordonnée `fournisseur:modèle` |
| `LLM_API_KEY`       | optionnel, clé d'un fournisseur au format OpenAI     |
| `LLM_BASE_URL`      | optionnel, défaut `https://openrouter.ai/api/v1`     |
| `SANITY_PROJECT_ID` | dataset public lu sur le CDN, sans jeton             |
| `SANITY_DATASET`    | optionnel, défaut `production`                       |

En local elles vivent dans `apps/web/.env` ; sur Vercel dans les variables du
projet.

## Choix du modèle et bascule

`LLM_MODELS` énumère les modèles à interroger, du préféré au dernier recours.
Aucun modèle n'est écrit dans le code : en changer, en ajouter un ou modifier
leur ordre ne demande qu'une variable d'environnement, sans déploiement. En
contrepartie la variable est obligatoire - sans elle l'API répond 500 plutôt
que d'appeler un modèle que personne n'a choisi.

```
LLM_MODELS=google:gemini-3.5-flash-lite,google:gemini-3.1-flash-lite,google:gemini-3.8-flash,google:gemini-3.7-flash,google:gemini-3.6-flash,google:gemini-3.5-flash,google:gemini-2.5-flash,google:gemini-2.5-flash-lite,google:gemini-3-flash-preview
```

L'ordre suit le quota journalier plutôt que la puissance. Au palier sans frais,
un `flash-lite` accepte 500 requêtes par jour quand un `flash` s'arrête à 20 :
mis en tête, les deux premiers portent l'essentiel du trafic, les autres ne
servent que lorsqu'ils sont épuisés. Ces plafonds se lisent dans
[AI Studio](https://aistudio.google.com/rate-limit), modèle par modèle.

Le premier qui répond gagne. Un modèle qui renvoie 429 est noté comme épuisé et
sauté pendant dix minutes ; une panne passagère fait passer au suivant ; une
erreur de notre côté (requête invalide, clé refusée) arrête tout de suite, parce
qu'elle se répéterait à l'identique ailleurs. Si tous sont épuisés, le dernier
recours consiste à les retenter quand même plutôt que de ne rien répondre.

Chez Google les quotas par requête sont comptés modèle par modèle : passer de
`flash` à `flash-lite` rouvre un quota. Le plafond en jetons par minute, lui,
est partagé - la bascule n'y peut rien, et le détail du 429 est journalisé pour
savoir laquelle des deux limites est atteinte.

`openai` désigne un format d'API, pas une société : OpenRouter, Groq ou Mistral
le parlent. Ajouter l'un d'eux ne demande qu'une entrée dans `LLM_MODELS`, une
clé dans `LLM_API_KEY` et son hôte dans `LLM_BASE_URL` - aucun code. Les trois
vont ensemble : un modèle `openai:` sans hôte est ignoré, pour ne pas appeler
un fournisseur au hasard en croyant en viser un autre.

L'état des quotas vit en mémoire, donc le temps d'une instance serverless : il
évite de regaspiller une requête à chaque appel, il ne tient pas de comptabilité.

## Commandes

```bash
npm test -w @portfolio/api        # tests
npm run typecheck -w @portfolio/api
npm run build -w @portfolio/api   # dist/ pour Vercel
```
