import type { Project } from '../../../services/sanity/types';

export const projectTitle = (project: Pick<Project, 'title' | 'titleEn'>, lang: string): string =>
  lang === 'en' && project.titleEn ? project.titleEn : project.title;
