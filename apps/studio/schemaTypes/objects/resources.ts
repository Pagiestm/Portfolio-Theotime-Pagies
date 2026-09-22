import { defineField, defineType } from 'sanity';

export const externalLink = defineType({
  name: 'externalLink',
  title: 'Lien',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Intitulé',
      description: 'Le texte du bouton, par exemple « Code source » ou « Vidéo de démo ».',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Adresse',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
    }),
  ],
  preview: { select: { title: 'label.fr', subtitle: 'url' } },
});

export const documentFile = defineType({
  name: 'documentFile',
  title: 'Document',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Intitulé',
      description:
        'Le texte du bouton, par exemple « Dossier de projet » ou « Cahier des charges ».',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'Fichier',

      type: 'file',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'label.fr', subtitle: 'file.asset.originalFilename' } },
});
