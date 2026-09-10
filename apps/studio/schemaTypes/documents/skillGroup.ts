import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Un groupe de compétences (Front-end, Back-end…).
 *
 * Volontairement sans niveau ni jauge : afficher « bases » ou « intermédiaire »
 * ne peut que jouer contre soi en lecture rapide.
 */
export const skillGroup = defineType({
  name: 'skillGroup',
  title: 'Groupe de compétences',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du groupe',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      description: 'Le plus petit nombre apparaît en premier.',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: 'items',
      title: 'Compétences',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'skill',
          fields: [
            defineField({
              name: 'tech',
              title: 'Technologie',
              type: 'reference',
              to: [{ type: 'technology' }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Libellé personnalisé',
              description:
                'Facultatif. Remplace le nom de la technologie, par exemple « PWA (hors-ligne, install) ».',
              type: 'localeString',
            }),
          ],
          preview: {
            select: { title: 'label.fr', fallback: 'tech.label' },
            prepare: ({ title, fallback }) => ({ title: title || fallback }),
          },
        }),
      ],
    }),
  ],
  orderings: [
    { title: 'Ordre d’affichage', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title.fr', order: 'order' },
    prepare: ({ title, order }) => ({ title, subtitle: `Position ${order}` }),
  },
});
