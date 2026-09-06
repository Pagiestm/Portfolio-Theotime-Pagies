import {
  FaAngular,
  FaCodeBranch,
  FaDatabase,
  FaFigma,
  FaGithub,
  FaMobileAlt,
  FaNodeJs,
  FaReact,
  FaRust,
  FaSymfony,
  FaTasks,
  FaVial,
  FaVuejs,
} from 'react-icons/fa';
import {
  SiAirtable,
  SiAppwrite,
  SiDart,
  SiEslint,
  SiExpress,
  SiFlutter,
  SiJavascript,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiPlaywright,
  SiPostgresql,
  SiPrisma,
  SiTailwindcss,
  SiTauri,
  SiVite,
  SiZapier,
} from 'react-icons/si';
import { DiMysql, DiSass } from 'react-icons/di';

/**
 * Référentiel partagé des technologies et outils.
 *
 * Les clés des technologies correspondent à `logos[].icon` dans les JSON projets
 * (feature `work`) ; les entrées d'outillage et de méthode ne servent qu'à la
 * feature `skills`, qui les référence par la même clé.
 *
 * `label` est toujours une chaîne : ce sont des noms de produits, identiques dans
 * toutes les langues. Une entrée qui demande une traduction (une méthode, pas un
 * produit) porte son libellé localisé dans la donnée qui la consomme.
 *
 * Vit dans `src/constants` plutôt que dans une feature : deux features le
 * consomment, et un import de feature à feature romprait leur isolation.
 */
export const TECH = {
  // — Front-end
  FaReact: { label: 'React', Icon: FaReact },
  FaVuejs: { label: 'Vue.js', Icon: FaVuejs },
  SiNextdotjs: { label: 'Next.js', Icon: SiNextdotjs },
  FaAngular: { label: 'Angular', Icon: FaAngular },
  SiTailwindcss: { label: 'Tailwind CSS', Icon: SiTailwindcss },
  DiSass: { label: 'Sass', Icon: DiSass },
  SiJavascript: { label: 'JavaScript', Icon: SiJavascript },

  // — Back-end & données
  SiNestjs: { label: 'NestJS', Icon: SiNestjs },
  FaNodeJs: { label: 'Node.js', Icon: FaNodeJs },
  SiExpress: { label: 'Express', Icon: SiExpress },
  FaSymfony: { label: 'Symfony', Icon: FaSymfony },
  SiPrisma: { label: 'Prisma', Icon: SiPrisma },
  SiPostgresql: { label: 'PostgreSQL', Icon: SiPostgresql },
  DiMysql: { label: 'MySQL', Icon: DiMysql },
  SiMongodb: { label: 'MongoDB', Icon: SiMongodb },
  SiAppwrite: { label: 'Appwrite', Icon: SiAppwrite },

  // — Mobile & desktop
  SiFlutter: { label: 'Flutter', Icon: SiFlutter },
  SiDart: { label: 'Dart', Icon: SiDart },
  SiTauri: { label: 'Tauri', Icon: SiTauri },
  FaRust: { label: 'Rust', Icon: FaRust },
  Pwa: { label: 'PWA', Icon: FaMobileAlt },

  // — Outillage & méthodes (libellé surchargé côté données quand il se traduit)
  FaGithub: { label: 'Git / GitHub', Icon: FaGithub },
  SiVite: { label: 'Vite', Icon: SiVite },
  SiPlaywright: { label: 'Playwright', Icon: SiPlaywright },
  SiEslint: { label: 'ESLint', Icon: SiEslint },
  FaFigma: { label: 'Figma', Icon: FaFigma },
  Tdd: { label: 'TDD', Icon: FaVial },
  Cicd: { label: 'CI/CD', Icon: FaCodeBranch },
  Merise: { label: 'Merise', Icon: FaDatabase },
  ProjectManagement: { label: 'Project management', Icon: FaTasks },

  // — No-code
  Airtable: { label: 'Airtable', Icon: SiAirtable },
  Zapier: { label: 'Zapier', Icon: SiZapier },
};

export const techLabel = (key) => TECH[key]?.label ?? key;
export const techIcon = (key) => TECH[key]?.Icon ?? null;
