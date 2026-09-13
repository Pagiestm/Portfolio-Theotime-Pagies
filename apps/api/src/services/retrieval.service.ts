import type { Lang } from '../models/ask.model.ts';
import type { Corpus, Localized, Project } from '../models/content.model.ts';

const FULL_PROJECTS = 4;
const FALLBACK_PROJECTS = 3;

const CATEGORY: Record<string, string> = {
  school: 'projet scolaire',
  personal: 'projet personnel',
  professional: 'projet professionnel',
};
const KIND: Record<string, string> = {
  web: 'web',
  mobile: 'mobile',
  desktop: 'desktop',
  api: 'API',
  nocode: 'no-code',
};
const TEAM: Record<string, string> = { solo: 'seul', team: 'en équipe' };

export const pick = (value: Localized | null | undefined, lang: Lang): string =>
  (lang === 'en' && value?.en?.trim()) || value?.fr || value?.en || '';

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

export const tokenize = (text: string): string[] => [
  ...new Set(
    normalize(text)
      .split(/[^a-z0-9+#.]+/)
      .filter((t) => t.length >= 3)
  ),
];

const contentOf = (project: Project, lang: Lang) =>
  (lang === 'en' ? project.contentEn : project.contentFr) ?? project.contentFr ?? '';

/**
 * Score de proximité entre une question et une réalisation : le titre et la
 * stack pèsent plus que le résumé, lui-même plus que le texte long, pour que
 * « NestJS » ramène d'abord les projets qui l'affichent dans leur stack.
 */
export const scoreProject = (project: Project, terms: string[], lang: Lang): number => {
  const title = normalize(project.title);
  const stack = normalize((project.stack ?? []).join(' '));
  const summary = normalize(pick(project.summary, lang));
  const content = normalize(contentOf(project, lang));
  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 4;
    if (stack.includes(term)) score += 3;
    if (summary.includes(term)) score += 2;
    if (content.includes(term)) score += 1;
  }
  return score;
};

/** Les réalisations à envoyer en entier : les plus proches, sinon les plus récentes. */
export const selectProjects = (projects: Project[], question: string, lang: Lang): Project[] => {
  const terms = tokenize(question);
  const ranked = projects
    .map((p) => ({ p, s: scoreProject(p, terms, lang) }))
    .sort((a, b) => b.s - a.s || (b.p.endDate ?? '').localeCompare(a.p.endDate ?? ''));
  const hits = ranked
    .filter((r) => r.s > 0)
    .slice(0, FULL_PROJECTS)
    .map((r) => r.p);
  return hits.length ? hits : projects.slice(0, FALLBACK_PROJECTS);
};

const projectLine = (project: Project, lang: Lang) => {
  const meta = [
    CATEGORY[project.category] ?? project.category,
    (project.kinds ?? []).map((k) => KIND[k] ?? k).join(', '),
    project.team ? (TEAM[project.team] ?? project.team) : '',
    pick(project.period, lang),
  ]
    .filter(Boolean)
    .join(' · ');
  return `- ${project.title} (/realisations/${project.slug}) - ${meta} - stack : ${(project.stack ?? []).join(', ')}\n  ${pick(project.summary, lang)}`;
};

const projectFull = (project: Project, lang: Lang) => {
  const links = (project.resources ?? [])
    .map((r) => (r.url || r.fileUrl ? `${r.label ?? 'lien'} : ${r.url ?? r.fileUrl}` : null))
    .filter(Boolean)
    .join(' ; ');
  return `${projectLine(project, lang)}\n  Détail : ${contentOf(project, lang)}${links ? `\n  Liens : ${links}` : ''}`;
};

/**
 * Le contexte remis au modèle : identité, à propos, parcours, compétences,
 * puis les réalisations proches en entier et les autres en une ligne. Les
 * chemins entre parenthèses sont ceux que le modèle doit citer.
 */
export const buildContext = (corpus: Corpus, question: string, lang: Lang): string => {
  const projects = corpus.projects ?? [];
  const full = selectProjects(projects, question, lang);
  const fullSlugs = new Set(full.map((p) => p.slug));
  const s = corpus.settings ?? {};

  return [
    `## Identité\n${s.name ?? 'Théotime Pagies'} - ${pick(s.role, lang)}. Contact : page /contact${s.email ? `, ${s.email}` : ''}. GitHub : ${s.github ?? ''}. LinkedIn : ${s.linkedin ?? ''}.`,
    `## À propos (/a-propos)\n${(corpus.about?.paragraphs ?? []).map((p) => pick(p, lang)).join('\n')}\n${(corpus.about?.facts ?? []).map((f) => `${pick(f.label, lang)} : ${pick(f.value, lang)}`).join(' · ')}`,
    `## Parcours (/parcours)\n${(corpus.journey ?? []).map((j) => `- ${pick(j.period, lang)} - ${j.org} - ${pick(j.role, lang)}${j.detail ? ` - ${pick(j.detail, lang)}` : ''}`).join('\n')}`,
    `## Compétences (/competences)\n${(corpus.skills ?? [])
      .map(
        (g) =>
          `- ${pick(g.title, lang)} : ${(g.items ?? [])
            .map((i) => i.label)
            .filter(Boolean)
            .join(', ')}`
      )
      .join('\n')}`,
    `## Réalisations détaillées (les plus liées à la question)\n${full.map((p) => projectFull(p, lang)).join('\n\n')}`,
    `## Autres réalisations (/realisations)\n${projects
      .filter((p) => !fullSlugs.has(p.slug))
      .map((p) => projectLine(p, lang))
      .join('\n')}`,
  ].join('\n\n');
};
