export const PROJECT_CATEGORIES = ['school', 'personal', 'professional'] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_KINDS = ['web', 'mobile', 'desktop', 'api', 'nocode'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

export const TEAM_MODES = ['solo', 'team'] as const;
export type TeamMode = (typeof TEAM_MODES)[number];
