import { defineField, defineType } from 'sanity';

/** Identité du site : ce qui apparaît dans l'en-tête, le pied de page et la page contact. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom affiché',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Intitulé de poste',
      description: 'Affiché dans le pied de page, à côté du nom.',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email de contact',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({ name: 'github', title: 'GitHub', type: 'url' }),
    defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
    defineField({ name: 'siteUrl', title: 'Adresse du site', type: 'url' }),
  ],
  preview: { prepare: () => ({ title: 'Réglages du site' }) },
});
