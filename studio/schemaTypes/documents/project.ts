import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Une réalisation du portfolio.
 *
 * Le tri de l'index se fait sur `endDate`, une vraie date, et non plus en
 * devinant le dernier mois cité dans un titre du genre « avril à mai 2025 ».
 * `period` reste affiché tel quel, mais ne pilote plus l'ordre.
 */
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
      name: 'kicker',
      title: 'Type de projet',
      description: 'Par exemple « Projet scolaire » ou « Projet perso ».',
      type: 'localeString',
      group: 'content',
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
      name: 'links',
      title: 'Liens',
      type: 'object',
      group: 'links',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'site', title: 'Site en ligne', type: 'url' }),
        defineField({ name: 'github', title: 'Code source (GitHub)', type: 'url' }),
        defineField({ name: 'api', title: 'Documentation API', type: 'url' }),
        defineField({ name: 'figma', title: 'Maquette (Figma)', type: 'url' }),
        defineField({
          name: 'pdf',
          title: 'Dossier de projet (PDF)',
          type: 'file',
          options: { accept: '.pdf' },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Plus récent d’abord',
      name: 'endDateDesc',
      by: [{ field: 'endDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'period.fr', media: 'cover' },
  },
});
