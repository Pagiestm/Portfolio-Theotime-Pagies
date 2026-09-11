import type { Project } from '../../../services/sanity/types';

/**
 * La sélection de l'accueil : les projets cochés « À la une » dans le Studio,
 * dans l'ordre chronologique, plafonnés à `max`.
 *
 * Si rien n'est coché, on retombe sur les `fallback` plus récents : l'accueil
 * ne montre jamais une section vide à cause d'un oubli dans le back-office.
 */
export const selectFeatured = (projects: Project[], { max = 6, fallback = 3 } = {}) => {
  const featured = projects.filter((project) => project.featured);
  return (featured.length > 0 ? featured : projects).slice(0, featured.length > 0 ? max : fallback);
};
