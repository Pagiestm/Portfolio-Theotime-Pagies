import { paths } from './paths.ts';

export const FALLBACK_SITE_URL = 'https://theotimepagies.com';

export const OWNER = 'Théotime Pagies';

export const LOCATION = {
  city: 'Valenciennes',
  region: 'Hauts-de-France',
  country: 'FR',
};

export type RouteMeta = {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
};

export const ROUTE_META: Record<string, RouteMeta> = {
  [paths.home]: {
    title: `${OWNER} - Développeur full-stack, IA et automatisation`,
    description:
      'Développeur web full-stack à Valenciennes. Je conçois des applications et des API, et j’y intègre de l’IA pour automatiser ce qui peut l’être.',
  },
  [paths.work]: {
    title: `Réalisations - ${OWNER}`,
    description:
      'Les projets de Théotime Pagies, développeur full-stack : applications web, API, outils internes, automatisations et intégrations d’IA.',
  },
  [paths.path]: {
    title: `Parcours - ${OWNER}`,
    description:
      'Le parcours professionnel et la formation de Théotime Pagies, développeur web full-stack à Valenciennes.',
  },
  [paths.skills]: {
    title: `Compétences - ${OWNER}`,
    description:
      'Les technologies maîtrisées par Théotime Pagies : front-end, back-end, outillage, mise en production et intégration d’IA.',
  },
  [paths.about]: {
    title: `À propos - ${OWNER}`,
    description:
      'Qui est Théotime Pagies, développeur web full-stack à Valenciennes, spécialisé en automatisation et en intégration d’IA.',
  },
  [paths.contact]: {
    title: `Contact - ${OWNER}`,
    description:
      'Écrire à Théotime Pagies, développeur full-stack à Valenciennes, pour un poste, une mission ou un échange.',
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
