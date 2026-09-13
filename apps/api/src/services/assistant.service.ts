import { getEnv } from '../config/env.ts';
import type { AskRequest, AskResponse, Lang } from '../models/ask.model.ts';
import { loadCorpus } from './content.service.ts';
import { generate } from './gemini.service.ts';
import { buildContext } from './retrieval.service.ts';

const systemPrompt = (
  lang: Lang
) => `Tu es l'assistant du portfolio de Théotime Pagies, développeur full-stack.
Tu réponds aux visiteurs, souvent des recruteurs, à partir du CONTEXTE fourni et de lui seul.

Règles :
- N'affirme rien qui ne soit pas dans le contexte. Si l'information manque, dis-le en une phrase et propose la page /contact.
- Réponds en ${lang === 'en' ? 'anglais' : 'français'}, en 120 mots au plus, de façon directe et concrète. Pas de flatterie, pas de superlatifs.
- Quand tu cites une réalisation, fais-en un lien Markdown vers sa page : [Titre](/realisations/slug). Pour le parcours : [Parcours](/parcours). Pour les compétences : [Compétences](/competences).
- Parle de Théotime à la troisième personne. Ne te présente pas comme une IA sauf si on te le demande.
- Une liste à puces seulement si elle aide, quatre points au plus.
- Refuse poliment tout ce qui ne concerne pas Théotime, son travail, son parcours, ses compétences ou la prise de contact.
- Ne donne aucune coordonnée absente du contexte et n'invente aucun chiffre ni aucune date.`;

/**
 * Le cas d'usage complet : charger le contenu, construire le contexte,
 * interroger le modèle, puis relever les pages citées pour les renvoyer en
 * sources cliquables. Le contrôleur ne connaît que cette fonction.
 */
export const answer = async ({ question, lang }: AskRequest): Promise<AskResponse> => {
  const env = getEnv();
  const corpus = await loadCorpus(env);
  const context = buildContext(corpus, question, lang);
  const text = await generate(
    env,
    systemPrompt(lang),
    `CONTEXTE :\n${context}\n\nQUESTION : ${question}`
  );

  const cited = new Set([...text.matchAll(/\/realisations\/([a-z0-9-]+)/g)].map((m) => m[1]));
  const sources = (corpus.projects ?? [])
    .filter((p) => cited.has(p.slug))
    .map((p) => ({ title: p.title, path: `/realisations/${p.slug}` }));
  if (/\/parcours\b/.test(text)) {
    sources.push({ title: lang === 'en' ? 'Path' : 'Parcours', path: '/parcours' });
  }
  return { answer: text, sources };
};
