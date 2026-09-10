/**
 * Registre des technologies et méthodes, source unique pour le site et le Studio.
 *
 * - Le Studio en fait la liste déroulante du champ « Icône » d'une technologie.
 * - Le site y associe un logo (`apps/web/src/constants/tech.ts`) et vérifie à la
 *   compilation qu'aucune clé n'est oubliée.
 *
 * Ajouter une technologie = ajouter une ligne ici. Le Studio la propose aussitôt ;
 * le site refuse de compiler tant qu'un logo ne lui est pas associé, ce qui évite
 * qu'une clé choisie dans le back-office s'affiche sans icône.
 *
 * Les clés reprennent le nom de l'icône `react-icons` quand il en existe une, ce
 * qui rend le registre lisible sans aller voir le site. Les autres (`Pwa`, `Tdd`…)
 * n'ont pas de logo officiel et portent un nom métier.
 */
export const TECHNOLOGIES = [
  // — Front-end
  { key: 'FaReact', label: 'React' },
  { key: 'FaVuejs', label: 'Vue.js' },
  { key: 'SiNextdotjs', label: 'Next.js' },
  { key: 'FaAngular', label: 'Angular' },
  { key: 'SiTailwindcss', label: 'Tailwind CSS' },
  { key: 'DiSass', label: 'Sass' },
  { key: 'SiJavascript', label: 'JavaScript' },

  // — Back-end & données
  { key: 'SiNestjs', label: 'NestJS' },
  { key: 'FaNodeJs', label: 'Node.js' },
  { key: 'SiExpress', label: 'Express' },
  { key: 'FaSymfony', label: 'Symfony' },
  { key: 'SiPrisma', label: 'Prisma' },
  { key: 'SiPostgresql', label: 'PostgreSQL' },
  { key: 'DiMysql', label: 'MySQL' },
  { key: 'SiMongodb', label: 'MongoDB' },
  { key: 'SiAppwrite', label: 'Appwrite' },

  // — Mobile & desktop
  { key: 'SiFlutter', label: 'Flutter' },
  { key: 'SiDart', label: 'Dart' },
  { key: 'SiTauri', label: 'Tauri' },
  { key: 'FaRust', label: 'Rust' },
  { key: 'Pwa', label: 'PWA' },

  // — Outillage & méthodes
  { key: 'FaGithub', label: 'Git / GitHub' },
  { key: 'SiVite', label: 'Vite' },
  { key: 'SiPlaywright', label: 'Playwright' },
  { key: 'SiEslint', label: 'ESLint' },
  { key: 'FaFigma', label: 'Figma' },
  { key: 'Tdd', label: 'TDD' },
  { key: 'Cicd', label: 'CI/CD' },
  { key: 'Merise', label: 'Merise' },
  { key: 'ProjectManagement', label: 'Project management' },

  // — No-code
  { key: 'Airtable', label: 'Airtable' },
  { key: 'Zapier', label: 'Zapier' },
] as const;

export type Technology = (typeof TECHNOLOGIES)[number];
export type TechKey = Technology['key'];

export const TECH_KEYS = TECHNOLOGIES.map((tech) => tech.key) as readonly TechKey[];

/** Libellé d'une clé, ou la clé elle-même si elle est inconnue du registre. */
export const techLabelOf = (key: string): string =>
  TECHNOLOGIES.find((tech) => tech.key === key)?.label ?? key;
