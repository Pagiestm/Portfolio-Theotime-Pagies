/** Table des routes — seule source de vérité pour les URL et le menu. */
export const paths = {
  home: '/',
  work: '/realisations',
  project: (slug) => `/realisations/${slug}`,
  projectPattern: '/realisations/:slug',
  path: '/parcours',
  skills: '/competences',
  about: '/a-propos',
  contact: '/contact',
};

/** Entrées du menu principal : [chemin, libellé FR, libellé EN]. */
export const NAV_ITEMS = [
  [paths.home, 'Accueil', 'Home'],
  [paths.work, 'Réalisations', 'Work'],
  [paths.path, 'Parcours', 'Path'],
  [paths.skills, 'Compétences', 'Skills'],
  [paths.about, 'À propos', 'About'],
];
