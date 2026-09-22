import { defineField, defineType } from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  title: 'Texte court bilingue',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'string',
      validation: (rule) => rule.required().error('Le français est obligatoire.'),
    }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Paragraphe bilingue',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().error('Le français est obligatoire.'),
    }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
  ],
});

export const localeBlock = defineType({
  name: 'localeBlock',
  title: 'Contenu riche bilingue',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
