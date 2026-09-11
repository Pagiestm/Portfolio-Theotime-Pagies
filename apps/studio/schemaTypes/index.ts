import { localeBlock, localeString, localeText } from './objects/locale';
import { pageHeader } from './objects/pageHeader';
import { documentFile, externalLink } from './objects/resources';
import { journeyEntry } from './documents/journeyEntry';
import { project } from './documents/project';
import { skillGroup } from './documents/skillGroup';
import { technology } from './documents/technology';
import { homePage } from './singletons/homePage';
import { siteSettings } from './singletons/siteSettings';
import { aboutPage, contactPage, pathPage, skillsPage, workPage } from './singletons/simplePages';

/** Les documents qui n'existent qu'en un seul exemplaire. */
export const SINGLETON_TYPES: readonly string[] = [
  'siteSettings',
  'homePage',
  'workPage',
  'pathPage',
  'skillsPage',
  'aboutPage',
  'contactPage',
];

export const schemaTypes = [
  // Objets réutilisables
  localeString,
  localeText,
  localeBlock,
  pageHeader,
  externalLink,
  documentFile,
  // Collections
  project,
  journeyEntry,
  skillGroup,
  technology,
  // Documents uniques
  siteSettings,
  homePage,
  workPage,
  pathPage,
  skillsPage,
  aboutPage,
  contactPage,
];
