import { defineField, defineType } from 'sanity';

/** Une étape du parcours : expérience ou formation. */
export const journeyEntry = defineType({
  name: 'journeyEntry',
  title: 'Étape de parcours',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Nature',
      type: 'string',
      initialValue: 'exp',
      options: {
        list: [
          { title: 'Expérience', value: 'exp' },
          { title: 'Formation', value: 'edu' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'org',
      title: 'Organisation',
      description: 'L’entreprise ou l’école. Identique dans les deux langues.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Période affichée',
      description: 'Par exemple « 2025 — aujourd’hui » ou « Juillet 2023 — Août 2024 ».',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Date de début',
      description: 'Sert uniquement à ordonner la frise, de la plus récente à la plus ancienne.',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Intitulé',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Détail',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Plus récent d’abord',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'role.fr', subtitle: 'org', kind: 'kind', period: 'period.fr' },
    prepare: ({ title, subtitle, kind, period }) => ({
      title,
      subtitle: `${kind === 'exp' ? 'Expérience' : 'Formation'} · ${subtitle} · ${period ?? ''}`,
    }),
  },
});
