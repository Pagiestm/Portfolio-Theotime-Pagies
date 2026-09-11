import { defineField, defineType } from 'sanity';

/**
 * Les « ressources » d'une réalisation : ce que le visiteur peut ouvrir depuis
 * la page projet.
 *
 * Avant, les liens étaient quatre champs aux intitulés fixes (site, GitHub,
 * API, Figma) plus un PDF. Chaque nouveau type de lien aurait demandé du code.
 * Ici, l'éditeur choisit l'intitulé, l'ordre, et le type de fichier : le site
 * se contente d'afficher la liste telle qu'elle est saisie.
 */

/** Un lien externe dont l'éditeur choisit l'intitulé. */
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

/** Un fichier à consulter : PDF, présentation, archive, peu importe le format. */
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
      // Volontairement sans `accept` : tout format est admis.
      type: 'file',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'label.fr', subtitle: 'file.asset.originalFilename' } },
});
