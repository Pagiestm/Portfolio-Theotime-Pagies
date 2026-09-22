import { paths } from './paths';

/**
 * Le titre et la description de chaque route.
 *
 * Deux lecteurs s'en servent, et c'est la raison de ce fichier séparé de
 * `index.tsx` : le hook `useRouteMeta`, qui met l'en-tête à jour à la
 * navigation, et le pré-rendu de `vite.config.ts`, qui écrit un fichier HTML par
 * route au build. Ce second lecteur tourne dans Node et ne peut pas importer la
 * table de routes, qui tire React et toutes les pages derrière elle.
 *
 * Sans ce pré-rendu, les aperçus de liens resteraient génériques : Google
 * exécute le JavaScript, les robots de LinkedIn, Slack et WhatsApp non.
 *
 * Les textes sont en français seulement : c'est la langue déclarée par
 * `og:locale`, et un robot ne choisit pas de langue.
 */
/**
 * Dernier recours seulement.
 *
 * Au build, l'adresse vient de `siteUrl` dans les réglages Sanity, puis de
 * l'URL de production que Vercel expose ; dans le navigateur, elle vient de
 * `window.location.origin`, toujours juste. Cette constante ne sert que si le
 * Studio ne déclare rien et que le build tourne hors de Vercel.
 */
export const FALLBACK_SITE_URL = 'https://portfolio-theotime-pagies.vercel.app';

export const OWNER = 'Théotime Pagies';

export type RouteMeta = {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
};

/** Aussi la liste des routes que le build pré-rend. */
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

/** Les moteurs tronquent au-delà : autant couper sur un mot. */
export const trimDescription = (text: string | undefined, max = 165) => {
  const clean = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
};
