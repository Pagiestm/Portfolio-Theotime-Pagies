/**
 * Compétences réelles, déduites de la stack des projets du portfolio.
 *
 * Volontairement sans niveau ni jauge : afficher « bases » ou « intermédiaire »
 * ne peut que jouer contre soi en lecture rapide par un recruteur. Chaque entrée
 * porte simplement son logo, référencé par sa clé dans `src/constants/tech.js`.
 *
 * `label` n'est renseigné que pour surcharger le nom du registre (méthodes
 * traduisibles) ; sinon le libellé du registre est utilisé tel quel.
 */
export const skillGroups = [
  {
    title: { fr: 'Front-end', en: 'Front-end' },
    items: [
      { tech: 'FaReact' },
      { tech: 'FaVuejs' },
      { tech: 'SiNextdotjs' },
      { tech: 'FaAngular' },
      { tech: 'SiTailwindcss' },
      { tech: 'DiSass' },
      { tech: 'SiJavascript' },
    ],
  },
  {
    title: { fr: 'Back-end & données', en: 'Back-end & data' },
    items: [
      { tech: 'SiNestjs' },
      { tech: 'FaNodeJs' },
      { tech: 'SiExpress' },
      { tech: 'FaSymfony' },
      { tech: 'SiPrisma' },
      { tech: 'SiPostgresql' },
      { tech: 'DiMysql' },
      { tech: 'SiMongodb' },
    ],
  },
  {
    title: { fr: 'Mobile & desktop', en: 'Mobile & desktop' },
    items: [
      { tech: 'SiFlutter' },
      { tech: 'SiDart' },
      { tech: 'SiTauri' },
      { tech: 'FaRust' },
      { tech: 'SiAppwrite' },
      { tech: 'Pwa', label: { fr: 'PWA (hors-ligne, install)', en: 'PWA (offline, install)' } },
    ],
  },
  {
    title: { fr: 'Outillage & méthodes', en: 'Tooling & method' },
    items: [
      { tech: 'FaGithub' },
      { tech: 'SiVite' },
      { tech: 'SiPlaywright' },
      { tech: 'SiEslint' },
      { tech: 'FaFigma' },
      { tech: 'Tdd', label: { fr: 'TDD & tests E2E', en: 'TDD & E2E testing' } },
      { tech: 'Cicd', label: { fr: 'CI/CD (GitHub Actions)', en: 'CI/CD (GitHub Actions)' } },
      { tech: 'Merise', label: { fr: 'Merise (MCD, MLD, MPD)', en: 'Merise (data modelling)' } },
      {
        tech: 'ProjectManagement',
        label: { fr: 'Gestion de projet', en: 'Project management' },
      },
    ],
  },
];
