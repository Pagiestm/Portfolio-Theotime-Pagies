import type { IconType } from 'react-icons';
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
import { TECHNOLOGIES, type TechKey } from '@portfolio/shared';

/**
 * Le logo de chaque technologie du registre partagé.
 *
 * Le type `Record<TechKey, IconType>` est le garde-fou : ajouter une clé dans
 * `@portfolio/shared` sans lui donner un logo ici fait échouer `tsc`. Le Studio
 * ne peut donc pas proposer une icône que le site ne saurait pas dessiner.
 *
 * Les entrées sans logo officiel (TDD, CI/CD, Merise…) reçoivent une icône
 * thématique, pour que les listes restent homogènes.
 */
const ICONS: Record<TechKey, IconType> = {
  FaReact,
  FaVuejs,
  SiNextdotjs,
  FaAngular,
  SiTailwindcss,
  DiSass,
  SiJavascript,
  SiNestjs,
  FaNodeJs,
  SiExpress,
  FaSymfony,
  SiPrisma,
  SiPostgresql,
  DiMysql,
  SiMongodb,
  SiAppwrite,
  SiFlutter,
  SiDart,
  SiTauri,
  FaRust,
  Pwa: FaMobileAlt,
  FaGithub,
  SiVite,
  SiPlaywright,
  SiEslint,
  FaFigma,
  Tdd: FaVial,
  Cicd: FaCodeBranch,
  Merise: FaDatabase,
  ProjectManagement: FaTasks,
  Airtable: SiAirtable,
  Zapier: SiZapier,
};

/**
 * Registre complet côté site : libellé (du paquet partagé) + logo (d'ici).
 * Vit dans `constants/` et non dans une feature : `work` et `skills` le
 * consomment tous deux, il ne peut appartenir à aucune des deux.
 */
export const TECH = Object.fromEntries(
  TECHNOLOGIES.map((tech) => [tech.key, { label: tech.label, Icon: ICONS[tech.key] }])
) as Record<TechKey, { label: string; Icon: IconType }>;

/** Logo d'une clé venue de Sanity, ou `undefined` si elle est inconnue du site. */
export const techIcon = (key: string | null | undefined): IconType | undefined =>
  key && key in TECH ? TECH[key as TechKey].Icon : undefined;

export const techLabel = (key: string): string => (key in TECH ? TECH[key as TechKey].label : key);
