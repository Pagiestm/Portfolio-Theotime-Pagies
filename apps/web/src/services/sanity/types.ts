import type { PortableTextBlock } from '@portabletext/react';
import type { Locale, ProjectCategory, ProjectKind, TeamMode } from '@portfolio/shared';

export type { Locale };

export type SanityImage = {
  /** Identifiant de l'entrée quand l'image est dans un tableau (galerie). */
  _key?: string;
  asset?: { _ref?: string; _id?: string; url?: string };
  alt?: string;
};

export type Technology = {
  label: string;
  iconKey?: string | null;
};

export type ProjectResource = {
  _key: string;
  _type: 'externalLink' | 'documentFile';
  label: Locale;
  url?: string | null;
  fileUrl?: string | null;
};

export type Project = {
  id: string;
  title: string;
  featured?: boolean | null;
  category: ProjectCategory;
  kinds?: ProjectKind[] | null;
  team?: TeamMode | null;
  period: Locale;
  endDate: string;
  summary: Locale;
  content?: Locale<PortableTextBlock[]> | null;
  cover?: SanityImage | null;
  gallery?: SanityImage[] | null;
  stack: Technology[];
  resources?: ProjectResource[] | null;
};

export type JourneyEntry = {
  kind: 'exp' | 'edu';
  org: string;
  period: Locale;
  role: Locale;
  detail: Locale;
};

export type SkillGroup = {
  title: Locale;
  items: Array<{ tech: Technology | null; label?: Locale | null }>;
};

export type PageHeader = {
  kicker: Locale;
  title: Locale;
  body?: Locale | null;
};

export type SiteSettings = {
  name: string;
  role: Locale;
  email: string;
  github?: string | null;
  linkedin?: string | null;
  siteUrl?: string | null;
};

export type HomeContent = {
  chapters: Array<{ kicker: Locale; title: Locale; bubble: Locale }>;
  marquee: Array<{ label: Locale; value: Locale }>;
  selectionKicker?: Locale | null;
  indexTitle?: Locale | null;
  /** Sections optionnelles ; `undefined` vaut affiché, un document ancien ne les cache pas. */
  showStack?: boolean | null;
  stackTitle?: Locale | null;
  showJourney?: boolean | null;
  journeyTitle?: Locale | null;
  closingTitle: Locale;
  closingCta: Locale;
};

export type AboutContent = {
  header: PageHeader;
  portrait?: SanityImage | null;
  paragraphs: Locale[];
  facts: Array<{ label: Locale; value: Locale }>;
};

export type PathContent = {
  header: PageHeader;
  corridorHint?: Locale | null;
};
