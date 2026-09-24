import type { ProjectCategory, ProjectKind, TeamMode } from '@portfolio/shared';

export default {
  role: 'Développeur web full-stack',
  cta: 'Me contacter',
  scrollHint: 'Faites défiler',
  corridorHint: 'Le parcours se déroule à l’horizontale - faites défiler',
  prev: 'Étape précédente',
  next: 'Étape suivante',
  menu: 'Menu',
  downloadCv: 'Télécharger le CV',
  skipToContent: 'Aller au contenu',
  legalTitle: 'Mentions légales',
  legal: {
    intro:
      'Informations légales relatives à ce site, conformément à la loi pour la confiance dans l’économie numérique.',
    sections: [
      {
        heading: 'Éditeur',
        body: 'Ce site est édité à titre personnel par {name}, personne physique, joignable à l’adresse {email}. Directeur de la publication : {name}.',
      },
      {
        heading: 'Hébergement',
        body: 'Vercel Inc., 440 N. Barranca Ave #4133, Covina, CA 91723, États-Unis - vercel.com.',
      },
      {
        heading: 'Propriété intellectuelle',
        body: 'Les textes, visuels et captures présentés appartiennent à leur auteur ou aux organisations concernées par les projets décrits. Le code source du site est public et consultable sur GitHub.',
      },
      {
        heading: 'Données personnelles',
        body: 'Le formulaire de contact transmet le nom, l’adresse e-mail et le message renseignés, dans le seul but de permettre une réponse. Aucune donnée n’est conservée dans une base, revendue, ni utilisée à des fins publicitaires. Il est protégé des envois automatisés par un champ masqué, sans service tiers ni cookie.',
      },
      {
        heading: 'Vos droits',
        body: 'Vous pouvez demander l’accès, la rectification ou l’effacement des informations que vous avez transmises en écrivant à {email}.',
      },
      {
        heading: 'Cookies',
        body: 'Ce site ne dépose aucun cookie de mesure d’audience ni de publicité. La langue choisie est conservée dans le stockage local du navigateur et ne quitte jamais votre appareil.',
      },
    ],
  },

  selection: 'Sélection',
  indexTitle: 'Index des réalisations',
  seeAll: 'Tout voir',
  seeOtherProjects: 'Voir les autres réalisations',
  otherProjectsCount: 'autres réalisations à découvrir',
  stackTitle: 'Avec quoi je travaille',
  stackHint: 'projets',
  seeSkills: 'Voir toutes les compétences',
  journeyTitle: 'Parcours en bref',
  seePath: 'Voir tout le parcours',
  closeTitle: 'Disponible pour un CDI ou une mission freelance.',
  closeCta: 'Écrivez-moi',

  workKicker: 'Réalisations',
  workTitle: "Ce que j'ai livré",
  workBody:
    'Chaque projet est décrit avec son contexte, mon rôle exact et les décisions techniques qui ont compté. Cliquez pour le détail.',
  searchLabel: 'Rechercher',
  searchPlaceholder: 'Titre ou technologie…',
  noResult: 'Aucun projet ne correspond à cette recherche.',
  reset: 'Réinitialiser',
  filterShowAll: 'Voir tout',
  filterShowLess: 'Voir moins',
  allFilter: 'Tout',
  allProjects: 'Toutes mes réalisations',
  showMore: 'Voir plus',

  backToWork: 'Toutes les réalisations',
  aboutProject: 'Le projet',
  gallery: 'Aperçus',
  stack: 'Technologies',
  links: 'Liens',
  nextProject: 'Projet suivant',
  metaCategory: 'Cadre',
  metaKind: 'Type',
  metaTeam: 'Réalisation',
  metaPeriod: 'Période',
  metaStack: 'Stack',

  pathKicker: 'Parcours & formations',
  pathTitle: "D'où je viens",
  pathBody:
    'Formation, alternances et missions sur une seule ligne de temps, d’aujourd’hui vers mes débuts.',
  experience: 'Expérience',
  education: 'Formation',

  skillsKicker: 'Compétences',
  skillsTitle: 'Ma boîte à outils',
  skillsBody:
    "Les technologies que j'utilise au quotidien, et celles que je sais lire et reprendre.",

  aboutKicker: 'Qui je suis',
  aboutTitle: 'Développeur full-stack, sensible au produit',
  portraitAlt: 'Portrait de Théotime Pagies',

  contactKicker: 'Contact',
  contactTitle: 'Parlons de votre projet',
  contactBody:
    'Une question, une mission, une opportunité : écrivez-moi, je réponds sous 48 heures.',
  fName: 'Nom',
  fMail: 'Email',
  fMsg: 'Message',
  fSend: 'Envoyer le message',
  fSending: 'Envoi en cours…',
  fSent: 'Message envoyé. Merci, je reviens vers vous rapidement.',
  fErrName: 'Le nom est requis.',
  fErrMailRequired: "L'email est requis.",
  fErrMailFormat: "Le format de l'email est incorrect.",
  fErrMsg: 'Le message est requis.',
  fErrSend: "L'envoi a échoué. Réessayez ou écrivez-moi directement.",
  contactErrors: {
    rateLimited: 'Plusieurs messages envoyés coup sur coup : réessayez dans une heure.',
    invalid: 'Un champ est vide ou trop long : vérifiez avant de renvoyer.',
    config: "L'envoi n'est pas configuré. Écrivez directement à l'adresse indiquée ci-contre.",
    network: 'La connexion a échoué. Vérifiez votre réseau, puis réessayez.',
    unavailable: "L'envoi est momentanément indisponible. Réessayez dans un instant.",
  },
  fErrConfig: "Le formulaire n'est pas configuré. Écrivez-moi directement par email.",

  errorKicker: 'Erreur',
  errorTitle: 'Quelque chose a mal tourné',
  errorBody:
    "La page n'a pas pu se charger. C'est peut-être passager : réessayez, ou revenez à l'accueil.",
  errorRetry: 'Réessayer',

  notFoundTitle: 'Page introuvable',
  notFoundBody: "Cette adresse ne mène nulle part. Revenez à l'accueil.",
  backHome: "Retour à l'accueil",

  allOption: 'Tous',
  removeFilter: 'Retirer le filtre',
  projectOne: 'projet',
  projectMany: 'projets',
  filters: 'Filtres',
  filterCategory: 'Cadre',
  filterKind: 'Type',
  filterTeam: 'Réalisation',
  category: {
    school: 'Projet scolaire',
    personal: 'Projet perso',
    professional: 'Projet professionnel',
  } satisfies Record<ProjectCategory, string>,
  kind: {
    web: 'Web',
    mobile: 'Mobile',
    desktop: 'Desktop',
    api: 'API',
    nocode: 'No-code',
  } satisfies Record<ProjectKind, string>,
  team: {
    solo: 'En solo',
    team: 'En équipe',
  } satisfies Record<TeamMode, string>,

  assistantOpen: 'Une question ?',
  assistantKicker: 'Assistant IA de Théotime',
  assistantTitle: 'Posez-moi une question',
  assistantIntro:
    'Je réponds à partir du contenu de ce site : réalisations, parcours, compétences...',
  assistantSuggestions: [
    'Quelles technologies maîtrise-t-il ?',
    'Quel est son parcours ?',
    'Quelles sont ses réalisations récentes ?',
  ],
  assistantPlaceholder: 'Votre question…',
  assistantSend: 'Envoyer',
  assistantClose: 'Fermer',
  assistantThinking: 'Je cherche dans les fiches',

  assistantErrors: {
    rateLimited: "Beaucoup de questions d'un coup : réessayez dans une heure.",
    quota:
      "L'assistant a épuisé ses questions pour aujourd'hui. Revenez demain, ou passez par la page contact.",
    invalid: 'Question vide ou trop longue : reformulez-la en une phrase.',
    network: 'La connexion a échoué. Vérifiez votre réseau, puis réessayez.',
    unavailable: "L'assistant est momentanément indisponible. Réessayez dans un instant.",
  },
  assistantSources: 'Sources',
  assistantDisclaimer: 'Réponses générées à partir du contenu du site.',
  assistantNew: 'Nouvelle conversation',
};
