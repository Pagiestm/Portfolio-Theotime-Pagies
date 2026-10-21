# API du portfolio

Deux routes, chacune limitée en débit :

- `POST /api/ask`, l'assistant du site : reçoit une question et une langue, et
  répond à partir du contenu Sanity, avec les pages citées en sources.
- `POST /api/contact`, le formulaire de contact : valide le message et l'envoie
  par l'API REST d'EmailJS, côté serveur, pour qu'aucune clé n'atteigne le
  navigateur. Cinq envois par heure et par adresse IP, vingt questions pour l'assistant.

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
contrôleur → service → modèle. Un contrôleur ne lit jamais Sanity, Gemini ni EmailJS ;
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

| Variable            | Rôle                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`    | clé des modèles Google, jamais exposée au navigateur                              |
| `LLM_MODELS`        | **obligatoire**, liste ordonnée `fournisseur:modèle`                              |
| `LLM_API_KEY`       | optionnel, clé d'un fournisseur au format OpenAI                                  |
| `LLM_BASE_URL`      | optionnel, défaut `https://openrouter.ai/api/v1`                                  |
| `SANITY_PROJECT_ID` | dataset public lu sur le CDN, sans jeton                                          |
| `SANITY_DATASET`    | optionnel, défaut `production`                                                    |
| `EMAILJS_*`         | `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY`, `PRIVATE_KEY` du formulaire de contact |

En local elles vivent dans `apps/web/.env` ; sur Vercel dans les variables du
projet.

## Choix du modèle et bascule

`LLM_MODELS` énumère les modèles à interroger, du préféré au dernier recours.
Aucun modèle n'est écrit dans le code : en changer, en ajouter un ou modifier
leur ordre ne demande qu'une variable d'environnement, sans déploiement. En
contrepartie la variable est obligatoire - sans elle l'API répond 500 plutôt
que d'appeler un modèle que personne n'a choisi.

```
LLM_MODELS=google:gemini-flash-lite-latest,google:gemini-flash-latest
```

Les alias `-latest` désignent la dernière version d'une famille : Google les
fait pointer vers chaque nouvelle sortie, avec deux semaines de préavis par
e-mail pour un changement cassant. La liste n'a donc pas à suivre les versions,
et aucun modèle retiré ne la rend caduque. Pro en est absent : le palier sans
frais ne l'offre pas, il répondrait toujours 429.

L'ordre suit le quota journalier plutôt que la puissance. Au palier sans frais,
un `flash-lite` accepte 500 requêtes par jour quand un `flash` s'arrête à 20 :
en tête, il porte l'essentiel du trafic. Un alias consomme le quota du modèle
vers lequel il pointe ; pour plus de capacité, des versions explicites
(`google:gemini-3.6-flash`…) s'ajoutent en fin de liste, chacune avec son
propre quota. Ces plafonds se lisent dans
[AI Studio](https://aistudio.google.com/rate-limit), modèle par modèle.

Le premier qui répond gagne. Un modèle qui renvoie 429 est noté comme épuisé et
sauté le temps indiqué par le fournisseur, une minute ou une heure selon la
limite atteinte ; un modèle introuvable (404, retiré par exemple) est sauté une
heure ; une panne passagère fait passer au suivant ; une erreur de notre côté
(requête invalide, clé refusée) arrête tout de suite, parce
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
