import { paths } from './paths';

export const FALLBACK_SITE_URL = 'https://portfolio-theotime-pagies.vercel.app';

export const OWNER = 'Théotime Pagies';

export type RouteMeta = {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
};

export const ROUTE_META: Record<string, RouteMeta> = {
  [paths.home]: {
    title: `Portfolio ${OWNER}`,
    description:
      'Portfolio de Théotime Pagies, développeur web full-stack à Lille. Réalisations, parcours, compétences et contact.',
  },
  [paths.work]: {
    title: `Réalisations - ${OWNER}`,
    description:
      'Les projets menés par Théotime Pagies : applications web, API, outils internes. Contexte, stack et rôle tenu sur chacun.',
  },
  [paths.path]: {
    title: `Parcours - ${OWNER}`,
    description:
      'Le parcours professionnel et la formation de Théotime Pagies, développeur web full-stack.',
  },
  [paths.skills]: {
    title: `Compétences - ${OWNER}`,
    description:
      'Les technologies maîtrisées par Théotime Pagies : front-end, back-end, outillage et mise en production.',
  },
  [paths.about]: {
    title: `À propos - ${OWNER}`,
    description: 'Qui est Théotime Pagies, développeur web full-stack à Lille.',
  },
  [paths.contact]: {
    title: `Contact - ${OWNER}`,
    description: 'Écrire à Théotime Pagies pour un poste, une mission ou un échange.',
  },
  [paths.legal]: {
    title: `Mentions légales - ${OWNER}`,
    description: 'Informations légales du site de Théotime Pagies.',
  },
};

export const trimDescription = (text: string | undefined, max = 165) => {
  const clean = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
};
