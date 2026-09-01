/**
 * Les quatre chapitres de la scène d'accueil, révélés au fil du scroll.
 * Chaque valeur est localisée : `{ fr, en }`.
 */
export const chapters = [
  {
    kicker: { fr: '01 / Qui', en: '01 / Who' },
    title: { fr: 'Développeur full-stack', en: 'Full-stack developer' },
    bubble: {
      fr: "Je m'appelle Théotime Pagies. Je conçois et je construis des produits web, du composant isolé jusqu'à la mise en production.",
      en: 'My name is Théotime Pagies. I design and build web products, from a single component through to production.',
    },
  },
  {
    kicker: { fr: '02 / Où', en: '02 / Where' },
    title: { fr: 'Alternance chez Ailoop', en: 'Apprenticeship at Ailoop' },
    bubble: {
      fr: "Je travaille sur des outils digitaux sur mesure pour l'analyse de cycle de vie et les déclarations environnementales : ACV, FDES, EPD, DPP.",
      en: 'I build custom digital tools for life-cycle assessment and environmental declarations: LCA, EPD, DPP.',
    },
  },
  {
    kicker: { fr: '03 / Comment', en: '03 / How' },
    title: { fr: 'Front et back ensemble', en: 'Front and back together' },
    bubble: {
      fr: "React, Vue, NestJS, Node. Je pose le problème avant d'écrire la première ligne, puis j'itère avec les personnes qui utilisent l'outil.",
      en: 'React, Vue, NestJS, Node. I frame the problem before writing the first line, then iterate with the people using the tool.',
    },
  },
  {
    kicker: { fr: '04 / Ensuite', en: '04 / Next' },
    title: { fr: 'Disponible', en: 'Available' },
    bubble: {
      fr: 'Je cherche un CDI ou des missions freelance. Continuez à faire défiler pour voir mes réalisations.',
      en: 'I am looking for a full-time role or freelance work. Keep scrolling to see my work.',
    },
  },
];

/** La bande de chiffres-clés sous la scène. */
export const marquee = [
  {
    label: { fr: 'Actuellement', en: 'Currently' },
    value: { fr: 'Alternance chez Ailoop', en: 'Apprenticeship at Ailoop' },
  },
  {
    label: { fr: 'Formation', en: 'Studying' },
    value: {
      fr: 'MBA Manager de projet web digital',
      en: 'MBA digital project management',
    },
  },
  {
    label: { fr: 'Stack', en: 'Stack' },
    value: { fr: 'React · Vue · NestJS · Node', en: 'React · Vue · NestJS · Node' },
  },
  {
    label: { fr: 'Recherche', en: 'Looking for' },
    value: { fr: 'CDI & freelance', en: 'Full-time & freelance' },
  },
];
