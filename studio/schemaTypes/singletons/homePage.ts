import { defineArrayMember, defineField, defineType } from 'sanity';

/** L'accueil : les chapitres de la scène, la bande de repères, la bannière de clôture. */
export const homePage = defineType({
  name: 'homePage',
  title: 'Page d’accueil',
  type: 'document',
  fields: [
    defineField({
      name: 'chapters',
      title: 'Chapitres de la scène',
      description:
        'Les blocs de texte qui se succèdent quand on fait défiler l’accueil. Trois à cinq fonctionnent bien.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'kicker',
              title: 'Surtitre',
              description: 'Par exemple « 01 / Qui ».',
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
              name: 'bubble',
              title: 'Texte',
              description: 'Court : il s’affiche lettre à lettre.',
              type: 'localeText',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'title.fr', subtitle: 'kicker.fr' } },
        }),
      ],
      validation: (rule) => rule.min(1).error('Au moins un chapitre est nécessaire.'),
    }),
    defineField({
      name: 'marquee',
      title: 'Bande de repères',
      description: 'Les quatre cases sous la scène d’accueil.',
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
      title: 'Surtitre de la sélection',
      description: 'Le petit texte au-dessus de l’index des réalisations.',
      type: 'localeString',
    }),
    defineField({
      name: 'indexTitle',
      title: 'Titre de l’index',
      type: 'localeString',
    }),
    defineField({
      name: 'closingTitle',
      title: 'Bannière de clôture — titre',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'closingCta',
      title: 'Bannière de clôture — bouton',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: 'Page d’accueil' }) },
});
