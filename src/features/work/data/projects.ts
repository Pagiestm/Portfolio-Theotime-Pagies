import largeProjects from './large-projects.json';
import smallProjects from './small-projects.json';
import { techLabel } from '../../../constants/tech';
import { slugify } from '../../../utils/slugify';

/**
 * Adaptateur entre les fichiers JSON du portfolio et le modèle attendu par
 * les vues (maquette Portfolio.dc.html). Toute la normalisation vit ici :
 * les composants ne connaissent jamais la forme brute du JSON.
 */

const MONTHS = {
  janvier: 1,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  décembre: 12,
};

/** « MyGPT - avril à mai 2025 » → « avril à mai 2025 » */
const extractPeriod = (title) => {
  const parts = title.split(' - ');
  return parts.length > 1 ? parts.slice(1).join(' - ').trim() : '';
};

/** Dernière année à 4 chiffres présente dans le titre, sinon chaîne vide. */
const extractYear = (title) => {
  const years = title.match(/\b(19|20)\d{2}\b/g);
  return years ? years[years.length - 1] : '';
};

/**
 * Clé de tri = date de fin du projet, en `AAAAMM`.
 * « avril à mai 2025 » → 202505 : on retient le dernier mois cité et l'année.
 */
const endDateKey = (period) => {
  const year = Number(extractYear(period)) || 0;
  const lower = period.toLowerCase();

  const lastMonth = Object.entries(MONTHS).reduce(
    (best, [name, index]) => {
      const at = lower.lastIndexOf(name);
      return at > best.at ? { at, index } : best;
    },
    { at: -1, index: 0 }
  );

  return year * 100 + lastMonth.index;
};

const LINK_FIELDS = [
  ['pdf', 'linkPdf'],
  ['api', 'linkApi'],
  ['figma', 'linkFigma'],
  ['githubLink', 'linkGithub'],
  ['siteLink', 'linkSite'],
];

const normalize = (raw) => {
  const iconKeys = (raw.logos ?? []).map((logo) => logo.icon);
  const stack = iconKeys.length ? iconKeys.map(techLabel) : (raw.stack ?? []);
  const period = extractPeriod(raw.title);

  return {
    id: slugify(raw.modalTitle),
    title: raw.modalTitle,
    kicker: raw.badge,
    period,
    year: extractYear(raw.title),
    sortKey: endDateKey(period),
    size: raw.size,
    summary: raw.description,
    content: raw.modalContent,
    cover: raw.cardImage,
    images: raw.images ?? [],
    iconKeys,
    stack,
    links: LINK_FIELDS.filter(([field]) => raw[field]).map(([field, labelKey]) => ({
      href: raw[field],
      labelKey,
    })),
  };
};

/**
 * Tous les projets en une seule liste, du plus récent au plus ancien.
 * La distinction gros / petit projet existe toujours dans les JSON mais n'est
 * plus exposée : sur un portfolio, hiérarchiser ses propres réalisations
 * dessert celles qui se retrouvent du mauvais côté.
 */
export const projects = [...largeProjects, ...smallProjects]
  .map(normalize)
  .sort((a, b) => b.sortKey - a.sortKey);

export const getProjectById = (id) => projects.find((project) => project.id === id);

/** Nombre de projets où chaque techno apparaît. */
const techFrequency = projects.reduce(
  (acc, project) => {
    project.stack.forEach((tech) => {
      acc[tech] = (acc[tech] ?? 0) + 1;
    });
    return acc;
  },
  {} as Record<string, number>
);

/**
 * Technologies présentes dans au moins un projet, des plus utilisées aux
 * moins utilisées. L'ordre de fréquence permet de n'exposer d'emblée que les
 * filtres les plus pertinents.
 */
export const availableTech = Array.from(new Set(projects.flatMap((project) => project.stack))).sort(
  (a, b) => techFrequency[b] - techFrequency[a] || a.localeCompare(b, 'fr')
);
