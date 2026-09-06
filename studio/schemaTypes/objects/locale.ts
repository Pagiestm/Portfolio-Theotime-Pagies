import { defineField, defineType } from 'sanity';

/**
 * Champs bilingues FR/EN.
 *
 * Un simple objet `{ fr, en }` plutôt que le plugin d'internationalisation :
 * c'est exactement la forme que `localize()` attend déjà côté front, donc
 * aucun composant n'a besoin de changer. Le français est requis, l'anglais
 * est facultatif — une valeur EN vide retombe sur le FR à l'affichage.
 */

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

/** Blocs de contenu riche (Portable Text), une version par langue. */
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
