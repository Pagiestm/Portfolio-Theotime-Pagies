import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Recommandation',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Fonction',
      description: 'Le poste et l’entreprise, par exemple « Lead développeur chez Ailoop ».',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'relation',
      title: 'Lien avec moi',
      description:
        'Affiché sous le nom, par exemple « Responsable direct » ou « Camarade de promotion ».',
      type: 'localeString',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description:
        'Sert uniquement à classer les recommandations, de la plus récente à la plus ancienne.',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Texte',
      description:
        'Les mots de la personne. Un extrait est préférable à la recommandation entière.',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Position',
      description: 'Les plus petits nombres passent en premier. À égalité, la plus récente gagne.',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'project',
      title: 'Réalisation concernée',
      description:
        'Facultatif. Rempli, la recommandation s’affiche sur la page de cette réalisation plutôt que sur « À propos ».',
      type: 'reference',
      to: [{ type: 'project' }],
    }),
  ],
  orderings: [
    {
      title: 'Plus récente d’abord',
      name: 'dateDesc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'date', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: { title: 'author', subtitle: 'role' },
  },
});
