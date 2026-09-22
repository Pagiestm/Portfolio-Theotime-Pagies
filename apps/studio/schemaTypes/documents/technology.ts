import { defineField, defineType } from 'sanity';
import { TECHNOLOGIES } from '@portfolio/shared';

export const technology = defineType({
  name: 'technology',
  title: 'Technologie',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Nom',
      description: 'Le nom affiché, par exemple « Vue.js ». Identique dans les deux langues.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'iconKey',
      title: 'Icône',
      description:
        'Le logo affiché à côté du nom. La liste est partagée avec le site : pour ajouter un logo, ajouter une entrée dans packages/shared.',
      type: 'string',
      options: {
        list: TECHNOLOGIES.map((tech) => ({ title: tech.label, value: tech.key })),
      },
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'iconKey' },
  },
});
