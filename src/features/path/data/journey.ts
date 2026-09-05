/**
 * Parcours, du plus récent au plus ancien.
 * `kind` : 'exp' (expérience) ou 'edu' (formation) - pilote le style du badge.
 *
 * ⚠️ Les périodes sont reprises de l'ancienne section « À propos » et de la maquette.
 * Vérifiez `period` sur les deux dernières entrées si les dates exactes diffèrent.
 */
export const journey = [
  {
    kind: 'exp',
    period: { fr: '2025 — aujourd’hui', en: '2025 — present' },
    org: 'Ailoop',
    role: {
      fr: 'Développeur full-stack en alternance',
      en: 'Full-stack developer, apprenticeship',
    },
    detail: {
      fr: "Outils digitaux sur mesure pour l'ACV, les FDES, les EPD et le DPP. Développement front-end et back-end, du cadrage à la mise en production.",
      en: 'Custom digital tools for LCA, EPD and DPP. Front-end and back-end development, from scoping to production.',
    },
  },
  {
    kind: 'edu',
    period: { fr: 'En cours', en: 'In progress' },
    org: 'MyDigitalSchool Lille',
    role: {
      fr: 'MBA Développeur Full Stack — Manager de projet web digital (niveau 7, BAC+5)',
      en: 'MBA Full Stack Developer — Digital web project manager (level 7, BAC+5)',
    },
    detail: {
      fr: 'Développement front-end et back-end, architecture applicative, cadrage produit et pilotage de projet.',
      en: 'Front-end and back-end development, application architecture, product scoping and project management.',
    },
  },
  {
    kind: 'exp',
    period: { fr: 'Juillet 2023 — Août 2024', en: 'July 2023 — August 2024' },
    org: 'Yoozly',
    role: { fr: 'Développeur web en alternance', en: 'Web developer, apprenticeship' },
    detail: {
      fr: 'Première expérience longue en entreprise : développement web et participation à la gestion de projets digitaux.',
      en: 'First long-form experience in a company: web development and involvement in digital project management.',
    },
  },
  {
    kind: 'edu',
    period: { fr: '2023 — 2024', en: '2023 — 2024' },
    org: 'MyDigitalSchool Lille',
    role: {
      fr: "Bachelor Développeur Web — TP Concepteur Développeur d'Applications (niveau 6, BAC+3/4)",
      en: 'Web Developer Bachelor — Application Designer & Developer (level 6, BAC+3/4)',
    },
    detail: {
      fr: 'Conception applicative, bases de données (Merise), développement front-end et back-end, travail en équipe projet.',
      en: 'Application design, databases (Merise), front-end and back-end development, team project work.',
    },
  },
  {
    kind: 'edu',
    period: { fr: 'Avant 2023', en: 'Before 2023' },
    org: 'Lycée Dampierre, Valenciennes',
    role: {
      fr: 'BTS SIO option SLAM — Solutions Logicielles et Applications Métiers',
      en: 'BTS SIO, SLAM track — Software Solutions & Business Applications',
    },
    detail: {
      fr: 'Deux stages à la CAF du Nord. Premiers développements applicatifs et bases de données.',
      en: 'Two internships at CAF du Nord. First application development and database work.',
    },
  },
];
