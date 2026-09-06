import type { PortableTextBlock } from '@portabletext/react';

/** Une valeur bilingue telle que stockée dans Sanity. */
export type Locale<T = string> = { fr: T; en?: T | null };

export type SanityImage = {
  asset?: { _ref?: string; _id?: string; url?: string };
  alt?: string;
};

export type Technology = {
  label: string;
  iconKey?: string | null;
};

export type ProjectLinks = {
  site?: string | null;
  github?: string | null;
  api?: string | null;
  figma?: string | null;
  pdfUrl?: string | null;
};

export type Project = {
  id: string;
  title: string;
  kicker: Locale;
  period: Locale;
  endDate: string;
  summary: Locale;
  content?: Locale<PortableTextBlock[]> | null;
  cover?: SanityImage | null;
  gallery?: SanityImage[] | null;
  stack: Technology[];
  links: ProjectLinks;
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
