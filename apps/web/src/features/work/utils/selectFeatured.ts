import type { Project } from '../../../services/sanity/types';

export const selectFeatured = (projects: Project[], { max = 6, fallback = 3 } = {}) => {
  const featured = projects.filter((project) => project.featured);
  return (featured.length > 0 ? featured : projects).slice(0, featured.length > 0 ? max : fallback);
};
