import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Les pages dont le contenu éditorial se réduit à un en-tête.
 * Une définition par page pour qu'elles apparaissent séparément dans le Studio.
 */
const headerOnlyPage = (name: string, title: string) =>
  defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({
        name: 'header',
        title: 'En-tête',
        type: 'pageHeader',
        validation: (rule) => rule.required(),
      }),
    ],
    preview: { prepare: () => ({ title }) },
  });

export const workPage = headerOnlyPage('workPage', 'Page Réalisations');
export const skillsPage = headerOnlyPage('skillsPage', 'Page Compétences');
export const contactPage = headerOnlyPage('contactPage', 'Page Contact');

/** Le parcours ajoute l'indication « le parcours se déroule à l'horizontale ». */
export const pathPage = defineType({
  name: 'pathPage',
  title: 'Page Parcours',
  type: 'document',
  fields: [
    defineField({
      name: 'header',
      title: 'En-tête',
      type: 'pageHeader',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'corridorHint',
      title: 'Indication de défilement',
      description: 'La ligne en capitales sous le chapô.',
      type: 'localeString',
    }),
  ],
  preview: { prepare: () => ({ title: 'Page Parcours' }) },
});

/** La page À propos : en-tête, biographie, faits et portrait. */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Page À propos',
  type: 'document',
  fields: [
    defineField({
      name: 'header',
      title: 'En-tête',
      type: 'pageHeader',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'paragraphs',
      title: 'Biographie',
      description: 'Un bloc par paragraphe.',
      type: 'array',
      of: [defineArrayMember({ type: 'localeText', name: 'paragraph' })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'facts',
      title: 'Faits',
      description: 'Les cases en bas de la biographie.',
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
  ],
  preview: { prepare: () => ({ title: 'Page À propos' }) },
});
