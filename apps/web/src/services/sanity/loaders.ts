import { sanityFetch } from './client';
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

export const rootLoader = async () => ({
  settings: await sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY),
});

export const homeLoader = async () => {
  const [home, projects] = await Promise.all([
    sanityFetch<HomeContent>(HOME_QUERY),
    sanityFetch<Project[]>(PROJECTS_QUERY),
  ]);
  return { home, projects };
};

export const workLoader = async () => {
  const [page, projects] = await Promise.all([
    sanityFetch<{ header: PageHeader }>(WORK_PAGE_QUERY),
    sanityFetch<Project[]>(PROJECTS_QUERY),
  ]);
  return { header: page?.header, projects };
};

export const projectLoader = async ({ params }: { params: { slug?: string } }) => {
  const [project, siblings] = await Promise.all([
    sanityFetch<Project | null>(PROJECT_QUERY, { slug: params.slug }),
    sanityFetch<Array<{ id: string; title: string }>>(PROJECT_SLUGS_QUERY),
  ]);

  if (!project) {
    throw new Response('Réalisation introuvable', { status: 404 });
  }
  return { project, siblings };
};

export const pathLoader = async () => {
  const [page, journey] = await Promise.all([
    sanityFetch<PathContent>(PATH_PAGE_QUERY),
    sanityFetch<JourneyEntry[]>(JOURNEY_QUERY),
  ]);
  return { page, journey };
};

export const skillsLoader = async () => {
  const [page, groups] = await Promise.all([
    sanityFetch<{ header: PageHeader }>(SKILLS_PAGE_QUERY),
    sanityFetch<SkillGroup[]>(SKILL_GROUPS_QUERY),
  ]);
  return { header: page?.header, groups };
};

export const aboutLoader = async () => ({
  about: await sanityFetch<AboutContent>(ABOUT_QUERY),
});

export const contactLoader = async () => {
  const page = await sanityFetch<{ header: PageHeader }>(CONTACT_PAGE_QUERY);
  return { header: page?.header };
};
