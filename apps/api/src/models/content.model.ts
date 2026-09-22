export type Localized = { fr?: string | null; en?: string | null };

export type Project = {
  title: string;
  slug: string;
  category: string;
  kinds?: string[] | null;
  team?: string | null;
  endDate?: string | null;
  period?: Localized | null;
  summary?: Localized | null;
  contentFr?: string | null;
  contentEn?: string | null;
  stack?: string[] | null;
  resources?: Array<{ label?: string | null; url?: string | null; fileUrl?: string | null }> | null;
};

export type JourneyEntry = {
  kind: string;
  org: string;
  period?: Localized;
  role?: Localized;
  detail?: Localized;
};

export type SkillGroup = {
  title?: Localized;
  items?: Array<{ label?: string | null }> | null;
};

export type Corpus = {
  settings?: {
    name?: string;
    role?: Localized;
    email?: string;
    github?: string;
    linkedin?: string;
  } | null;
  about?: {
    paragraphs?: Localized[] | null;
    facts?: Array<{ label: Localized; value: Localized }> | null;
  } | null;
  journey?: JourneyEntry[] | null;
  skills?: SkillGroup[] | null;
  projects?: Project[] | null;
};
