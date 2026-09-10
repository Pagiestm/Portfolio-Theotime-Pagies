import { defineField, defineType } from 'sanity';

/**
 * L'en-tête éditorial commun aux pages : le kicker en petites capitales,
 * le grand titre, et le chapô sous le titre.
 */
export const pageHeader = defineType({
  name: 'pageHeader',
  title: 'En-tête de page',
  type: 'object',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Surtitre',
      description: 'Le petit texte en capitales au-dessus du titre.',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Chapô',
      description: 'Le paragraphe d’introduction. Laissez vide pour ne rien afficher.',
      type: 'localeText',
    }),
  ],
});
