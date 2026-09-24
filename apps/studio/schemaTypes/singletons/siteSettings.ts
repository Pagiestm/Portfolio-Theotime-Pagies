import { defineField, defineType } from 'sanity';

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
    defineField({
      name: 'cv',
      title: 'CV (PDF)',
      description:
        'Proposé au téléchargement dans le pied de page. Remplacer le fichier suffit, le lien ne change pas.',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
  ],
  preview: { prepare: () => ({ title: 'Réglages du site' }) },
});
