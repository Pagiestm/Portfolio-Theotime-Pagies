/**
 * Constantes d'identité du site : liens, coordonnées, réglages de la scène 3D.
 */
export const site = {
  name: 'Théotime Pagies',
  email: 'pagiestm@gmail.com',
  github: 'https://github.com/Pagiestm',
  linkedin: 'https://www.linkedin.com/in/th%C3%A9otime-pagies-7352bb221/',
  url: 'https://portfolio-theotime-pagies.vercel.app/',
  year: new Date().getFullYear(),
};

export const channels = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'GitHub', value: 'github.com/Pagiestm', href: site.github },
  { label: 'LinkedIn', value: 'linkedin.com/in/théotime-pagies', href: site.linkedin },
  { label: 'Portfolio', value: 'portfolio-theotime-pagies.vercel.app', href: site.url },
];

/** Paramètres de la scène three.js du fond (cf. features/scene). */
export const scene = {
  density: 700,
  backgroundDensity: 380,
  cardTilt: true,
};
