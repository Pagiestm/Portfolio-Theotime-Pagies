import type { Env } from '../config/env.ts';
import type { Corpus } from '../models/content.model.ts';
import { UpstreamError } from '../models/errors.model.ts';

const CORPUS_QUERY = `{
  "settings": *[_id=="siteSettings"][0]{ name, role, email, github, linkedin },
  "about": *[_id=="aboutPage"][0]{ "paragraphs": paragraphs[]{ fr, en }, facts[]{ label{ fr, en }, value{ fr, en } } },
  "journey": *[_type=="journeyEntry"] | order(startDate desc) { kind, org, period{ fr, en }, role{ fr, en }, detail{ fr, en } },
  "skills": *[_type=="skillGroup"] | order(order asc) { title{ fr, en }, "items": items[]{ "label": coalesce(label.fr, tech->label) } },
  "projects": *[_type=="project" && defined(slug.current)] | order(endDate desc) {
    title, "slug": slug.current, category, kinds, team, endDate,
    period{ fr, en }, summary{ fr, en },
    "contentFr": pt::text(content.fr), "contentEn": pt::text(content.en),
    "stack": stack[]->label,
    "resources": resources[]{ "label": label.fr, url, "fileUrl": file.asset->url }
  }
}`;

const TTL_MS = 10 * 60 * 1000;

let cache: { at: number; corpus: Corpus } | null = null;

/**
 * Le contenu éditorial, lu sur le CDN public de Sanity et gardé dix minutes.
 * Pas de jeton : le dataset est public en lecture. Le cache vit le temps de
 * l'instance serverless, ce qui suffit à absorber une rafale de questions.
 */
export const loadCorpus = async (env: Env): Promise<Corpus> => {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.corpus;
  const url = `https://${env.sanityProjectId}.apicdn.sanity.io/v2024-10-01/data/query/${env.sanityDataset}?query=${encodeURIComponent(CORPUS_QUERY)}`;
  const res = await fetch(url);
  if (!res.ok) throw new UpstreamError(`Sanity ${res.status}`);
  const { result } = (await res.json()) as { result: Corpus };
  cache = { at: Date.now(), corpus: result };
  return result;
};

export const resetCorpusCache = () => {
  cache = null;
};
