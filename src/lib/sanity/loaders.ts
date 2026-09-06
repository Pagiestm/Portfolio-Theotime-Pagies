import { sanityClient } from './client';
import {
  ABOUT_QUERY,
  CONTACT_PAGE_QUERY,
  HOME_QUERY,
  JOURNEY_QUERY,
  PATH_PAGE_QUERY,
  PROJECTS_QUERY,
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
  SKILLS_PAGE_QUERY,
  SKILL_GROUPS_QUERY,
  WORK_PAGE_QUERY,
} from './queries';
import type {
  AboutContent,
  HomeContent,
  JourneyEntry,
  PageHeader,
  PathContent,
  Project,
  SiteSettings,
  SkillGroup,
} from './types';

/**
 * Chargeurs de route (React Router).
 *
 * Chaque page déclare ses propres besoins : le contenu arrive avant le rendu,
 * il n'y a donc ni état de chargement ni scintillement à gérer dans les
 * composants. Une requête qui échoue remonte à `ErrorPage` via le routeur.
 */

/** Chargé une fois pour toute l'application : en-tête, pied de page, contact. */
export const rootLoader = async () => ({
  settings: await sanityClient.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
});

export const homeLoader = async () => {
  const [home, projects] = await Promise.all([
    sanityClient.fetch<HomeContent>(HOME_QUERY),
    sanityClient.fetch<Project[]>(PROJECTS_QUERY),
  ]);
  return { home, projects };
};

export const workLoader = async () => {
  const [page, projects] = await Promise.all([
    sanityClient.fetch<{ header: PageHeader }>(WORK_PAGE_QUERY),
    sanityClient.fetch<Project[]>(PROJECTS_QUERY),
  ]);
  return { header: page?.header, projects };
};

export const projectLoader = async ({ params }: { params: { slug?: string } }) => {
  const [project, siblings] = await Promise.all([
    sanityClient.fetch<Project | null>(PROJECT_QUERY, { slug: params.slug }),
    sanityClient.fetch<Array<{ id: string; title: string }>>(PROJECT_SLUGS_QUERY),
  ]);

  // Une adresse inconnue doit produire une 404, pas une page vide.
  if (!project) {
    throw new Response('Réalisation introuvable', { status: 404 });
  }
  return { project, siblings };
};

export const pathLoader = async () => {
  const [page, journey] = await Promise.all([
    sanityClient.fetch<PathContent>(PATH_PAGE_QUERY),
    sanityClient.fetch<JourneyEntry[]>(JOURNEY_QUERY),
  ]);
  return { page, journey };
};

export const skillsLoader = async () => {
  const [page, groups] = await Promise.all([
    sanityClient.fetch<{ header: PageHeader }>(SKILLS_PAGE_QUERY),
    sanityClient.fetch<SkillGroup[]>(SKILL_GROUPS_QUERY),
  ]);
  return { header: page?.header, groups };
};

export const aboutLoader = async () => ({
  about: await sanityClient.fetch<AboutContent>(ABOUT_QUERY),
});

export const contactLoader = async () => {
  const page = await sanityClient.fetch<{ header: PageHeader }>(CONTACT_PAGE_QUERY);
  return { header: page?.header };
};
