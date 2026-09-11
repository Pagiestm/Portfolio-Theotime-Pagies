/**
 * Listes fermées qui qualifient une réalisation.
 *
 * Partagées entre le Studio (qui en fait des boutons radio et des cases à
 * cocher) et le site (qui en fait des filtres et des libellés traduits). Une
 * valeur ajoutée ici sans libellé côté site est refusée par `tsc` : les deux
 * ne peuvent pas diverger.
 */

/** Le cadre dans lequel le projet a été mené. */
export const PROJECT_CATEGORIES = ['school', 'personal', 'professional'] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** Ce qui a été livré. Un projet peut en cumuler plusieurs (un site et son API). */
export const PROJECT_KINDS = ['web', 'mobile', 'desktop', 'api', 'nocode'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

/** Seul ou en équipe. */
export const TEAM_MODES = ['solo', 'team'] as const;
export type TeamMode = (typeof TEAM_MODES)[number];
