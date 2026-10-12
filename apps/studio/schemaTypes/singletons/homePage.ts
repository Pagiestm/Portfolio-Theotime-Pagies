import { defineArrayMember, defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Page d’accueil',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Accueil - titre',
      description: 'Le grand titre affiché par-dessus la scène, en haut de la page.',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroText',
      title: 'Accueil - texte',
      description: 'Deux ou trois phrases sous le titre.',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'marquee',
      title: 'Bande de repères',
      description: 'Les quatre cases sous le titre d’accueil.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fact',
          fields: [
            defineField({
              name: 'label',
              title: 'Intitulé',
              type: 'localeString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Valeur',
              type: 'localeString',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'value.fr', subtitle: 'label.fr' } },
        }),
      ],
    }),
    defineField({
      name: 'selectionKicker',
      title: 'Sélection - surtitre',
      description: 'Le petit texte au-dessus des cartes de projets, par exemple « Sélection ».',
      type: 'localeString',
    }),
    defineField({
      name: 'indexTitle',
      title: 'Sélection - titre',
      description:
        'Le grand titre au-dessus des cartes. Les projets affichés sont ceux cochés « À la une » dans Réalisations.',
      type: 'localeString',
    }),
    defineField({
      name: 'showStack',
      title: 'Afficher la section « Technologies »',
      description:
        'La bande des technologies les plus utilisées dans vos réalisations. Calculée automatiquement.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'stackTitle',
      title: 'Technologies - titre',
      description: 'Laissez vide pour le titre par défaut.',
      type: 'localeString',
      hidden: ({ document }) => document?.showStack === false,
    }),
    defineField({
      name: 'closingTitle',
      title: 'Bannière de clôture - titre',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'closingCta',
      title: 'Bannière de clôture - bouton',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: 'Page d’accueil' }) },
});
