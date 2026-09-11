import { defineArrayMember, defineField, defineType } from 'sanity';
import {
  PROJECT_CATEGORIES,
  PROJECT_KINDS,
  TEAM_MODES,
  type ProjectCategory,
  type ProjectKind,
  type TeamMode,
} from '@portfolio/shared';

/**
 * Une réalisation du portfolio.
 *
 * Le tri de l'index se fait sur `endDate`, une vraie date, et non plus en
 * devinant le dernier mois cité dans un titre du genre « avril à mai 2025 ».
 * `period` reste affiché tel quel, mais ne pilote plus l'ordre.
 *
 * Le cadre, le type de livrable et le mode de réalisation sont des listes
 * fermées : ce sont les filtres de la page Réalisations, et un filtre ne
 * supporte pas les variantes d'orthographe. Les libellés affichés sur le site
 * vivent dans son `i18n/`, traduits ; ici seuls les intitulés du formulaire.
 */

const CATEGORY_TITLES: Record<ProjectCategory, string> = {
  school: 'Projet scolaire',
  personal: 'Projet perso',
  professional: 'Projet professionnel',
};

const KIND_TITLES: Record<ProjectKind, string> = {
  web: 'Application ou site web',
  mobile: 'Application mobile',
  desktop: 'Application de bureau',
  api: 'API',
  nocode: 'No-code',
};

const TEAM_TITLES: Record<TeamMode, string> = {
  solo: 'En solo',
  team: 'En équipe',
};

const asOptions = <T extends string>(values: readonly T[], titles: Record<T, string>) =>
  values.map((value) => ({ value, title: titles[value] }));

export const project = defineType({
  name: 'project',
  title: 'Réalisation',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'media', title: 'Médias' },
    { name: 'links', title: 'Liens' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      description: 'Renseigne l’URL /realisations/… . Cliquez sur « Generate » après le titre.',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'À la une',
      description:
        'Les projets à la une composent la sélection de la page d’accueil, complétée par les plus récents. Trois ou quatre suffisent.',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'category',
      title: 'Cadre',
      type: 'string',
      group: 'content',
      options: {
        list: asOptions(PROJECT_CATEGORIES, CATEGORY_TITLES),
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kinds',
      title: 'Type de livrable',
      description: 'Plusieurs choix possibles, par exemple un site et son API.',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: asOptions(PROJECT_KINDS, KIND_TITLES), layout: 'grid' },
      validation: (rule) => rule.min(1).error('Choisissez au moins un type.'),
    }),
    defineField({
      name: 'team',
      title: 'Réalisation',
      type: 'string',
      group: 'content',
      options: {
        list: asOptions(TEAM_MODES, TEAM_TITLES),
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Période affichée',
      description: 'Le texte montré sous le titre, par exemple « avril à mai 2025 ».',
      type: 'localeString',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Date de fin',
      description:
        'Sert uniquement à classer les réalisations, de la plus récente à la plus ancienne. Non affichée.',
      type: 'date',
      group: 'content',
      options: { dateFormat: 'YYYY-MM' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Résumé',
      description: 'Le paragraphe visible dans la liste des réalisations.',
      type: 'localeText',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Le projet',
      description: 'Le texte détaillé de la page projet.',
      type: 'localeBlock',
      group: 'content',
    }),
    defineField({
      name: 'stack',
      title: 'Technologies',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'technology' }] })],
      validation: (rule) => rule.unique(),
    }),

    defineField({
      name: 'cover',
      title: 'Image principale',
      description: 'Affichée en haut de la page projet.',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Aperçus',
      description: 'Les captures affichées en bas de la page projet.',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      options: { layout: 'grid' },
    }),

    defineField({
      name: 'resources',
      title: 'Liens et documents',
      description:
        'Ce que le visiteur peut ouvrir depuis la page projet, dans l’ordre d’affichage. Glissez une entrée pour la déplacer.',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({ type: 'externalLink' }),
        defineArrayMember({ type: 'documentFile' }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Plus récent d’abord',
      name: 'endDateDesc',
      by: [{ field: 'endDate', direction: 'desc' }],
    },
    {
      title: 'À la une d’abord',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'endDate', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'period.fr', media: 'cover', featured: 'featured' },
    prepare: ({ title, subtitle, media, featured }) => ({
      title: featured ? `★ ${title}` : title,
      subtitle,
      media,
    }),
  },
});
