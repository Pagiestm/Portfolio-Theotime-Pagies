/**
 * Instantané du contenu éditorial tel qu'il vivait dans le code au moment de
 * la migration. Une fois la migration jouée, la source de vérité est Sanity :
 * ce fichier ne sert plus qu'à réamorcer un dataset vide.
 */

const L = (fr, en) => ({ fr, en });

export const siteSettings = {
  name: 'Théotime Pagies',
  role: L('Développeur web full-stack', 'Full-stack web developer'),
  email: 'pagiestm@gmail.com',
  github: 'https://github.com/Pagiestm',
  linkedin: 'https://www.linkedin.com/in/th%C3%A9otime-pagies-7352bb221/',
  siteUrl: 'https://portfolio-theotime-pagies.vercel.app/',
};

export const homePage = {
  chapters: [
    {
      kicker: L('01 / Qui', '01 / Who'),
      title: L('Développeur full-stack', 'Full-stack developer'),
      bubble: L(
        "Je m'appelle Théotime Pagies. Je conçois et je construis des produits web, du composant isolé jusqu'à la mise en production.",
        'My name is Théotime Pagies. I design and build web products, from a single component through to production.'
      ),
    },
    {
      kicker: L('02 / Où', '02 / Where'),
      title: L('Alternance chez Ailoop', 'Apprenticeship at Ailoop'),
      bubble: L(
        "Je travaille sur des outils digitaux sur mesure pour l'analyse de cycle de vie et les déclarations environnementales : ACV, FDES, EPD, DPP.",
        'I build custom digital tools for life-cycle assessment and environmental declarations: LCA, EPD, DPP.'
      ),
    },
    {
      kicker: L('03 / Comment', '03 / How'),
      title: L('Front et back ensemble', 'Front and back together'),
      bubble: L(
        "React, Vue, NestJS, Node. Je pose le problème avant d'écrire la première ligne, puis j'itère avec les personnes qui utilisent l'outil.",
        'React, Vue, NestJS, Node. I frame the problem before writing the first line, then iterate with the people using the tool.'
      ),
    },
    {
      kicker: L('04 / Ensuite', '04 / Next'),
      title: L('Disponible', 'Available'),
      bubble: L(
        'Je cherche un CDI ou des missions freelance. Continuez à faire défiler pour voir mes réalisations.',
        'I am looking for a full-time role or freelance work. Keep scrolling to see my work.'
      ),
    },
  ],
  marquee: [
    {
      label: L('Actuellement', 'Currently'),
      value: L('Alternance chez Ailoop', 'Apprenticeship at Ailoop'),
    },
    {
      label: L('Formation', 'Studying'),
      value: L('MBA Manager de projet web digital', 'MBA digital project management'),
    },
    {
      label: L('Stack', 'Stack'),
      value: L('React · Vue · NestJS · Node', 'React · Vue · NestJS · Node'),
    },
    {
      label: L('Recherche', 'Looking for'),
      value: L('CDI & freelance', 'Full-time & freelance'),
    },
  ],
  selectionKicker: L('Sélection', 'Selection'),
  indexTitle: L('Index des réalisations', 'Work index'),
  closingTitle: L(
    'Disponible pour un CDI ou une mission freelance.',
    'Available for a full-time role or freelance work.'
  ),
  closingCta: L('Écrivez-moi', 'Write to me'),
};

export const workPage = {
  header: {
    kicker: L('Réalisations', 'Work'),
    title: L("Ce que j'ai livré", 'What I have shipped'),
    body: L(
      'Chaque projet est décrit avec son contexte, mon rôle exact et les décisions techniques qui ont compté. Cliquez pour le détail.',
      'Every project comes with its context, my exact role and the technical decisions that mattered. Click through for the detail.'
    ),
  },
};

export const pathPage = {
  header: {
    kicker: L('Parcours & formations', 'Path & education'),
    title: L("D'où je viens", 'Where I come from'),
    body: L(
      'Formation, alternances et missions sur une seule ligne de temps, d’aujourd’hui vers mes débuts.',
      'Education, apprenticeships and missions on a single timeline, from today back to where I started.'
    ),
  },
  corridorHint: L(
    'Le parcours se déroule à l’horizontale — faites défiler',
    'The path runs horizontally — keep scrolling'
  ),
};

export const skillsPage = {
  header: {
    kicker: L('Compétences', 'Skills'),
    title: L('Ma boîte à outils', 'My toolbox'),
    body: L(
      "Les technologies que j'utilise au quotidien, et celles que je sais lire et reprendre.",
      'The technologies I work with daily, and the ones I can read and pick up.'
    ),
  },
};

export const contactPage = {
  header: {
    kicker: L('Contact', 'Contact'),
    title: L('Parlons de votre projet', 'Let us talk about your project'),
    body: L(
      'Une question, une mission, une opportunité : écrivez-moi, je réponds sous 48 heures.',
      'A question, a mission, an opportunity: write to me and I answer within 48 hours.'
    ),
  },
};

export const aboutPage = {
  header: {
    kicker: L('Qui je suis', 'Who I am'),
    title: L(
      'Développeur full-stack, sensible au produit',
      'Full-stack developer with a product instinct'
    ),
  },
  paragraphs: [
    L(
      "Je suis Théotime Pagies, développeur web full-stack. Je suis actuellement en alternance chez Ailoop, où je travaille sur des outils digitaux sur mesure pour l'analyse de cycle de vie et les déclarations environnementales, tout en poursuivant un MBA Développeur Full Stack « Manager de projet web digital ».",
      'I am Théotime Pagies, a full-stack web developer. I am currently on an apprenticeship at Ailoop, building custom digital tools for life-cycle assessment and environmental declarations, while completing an MBA in full-stack development and digital project management.'
    ),
    L(
      "Mon parcours a démarré par un BTS SIO option SLAM au lycée Dampierre à Valenciennes, ponctué de deux stages à la CAF du Nord. Je l'ai poursuivi par un Bachelor Développeur Web — TP Concepteur Développeur d'Applications, puis une alternance chez Yoozly de juillet 2023 à août 2024.",
      'My path started with a BTS SIO (SLAM track) at Lycée Dampierre in Valenciennes, punctuated by two internships at CAF du Nord. It continued with a Web Developer Bachelor — Application Designer & Developer, then an apprenticeship at Yoozly from July 2023 to August 2024.'
    ),
    L(
      "C'est là que j'ai pris l'habitude de travailler front et back ensemble plutôt que de me spécialiser d'un seul côté. Mon travail commence rarement par du code : je pose d'abord le problème, je regarde les contraintes réelles, puis je construis la plus petite chose qui répond au besoin.",
      'That is where I got into the habit of working front and back together rather than specialising on one side. My work rarely starts with code: I frame the problem first, look at the real constraints, then build the smallest thing that answers the need.'
    ),
    L(
      "En dehors du clavier, je suis passionné par l'innovation digitale et la gestion de projet, et je passe du temps sur des expérimentations front-end et du temps réel dans le navigateur.",
      'Away from the keyboard I am driven by digital innovation and project management, and I spend time on front-end experiments and real-time work in the browser.'
    ),
  ],
  facts: [
    { label: L('Basé à', 'Based in'), value: L('Lille, France', 'Lille, France') },
    {
      label: L('Actuellement', 'Currently'),
      value: L('Alternance chez Ailoop', 'Apprenticeship at Ailoop'),
    },
    {
      label: L('Recherche', 'Looking for'),
      value: L('CDI & missions freelance', 'Full-time & freelance'),
    },
    { label: L('Langues', 'Languages'), value: L('Français, Anglais', 'French, English') },
  ],
};

export const journey = [
  {
    key: 'ailoop',
    kind: 'exp',
    startDate: '2025-01-01',
    org: 'Ailoop',
    period: L('2025 — aujourd’hui', '2025 — present'),
    role: L('Développeur full-stack en alternance', 'Full-stack developer, apprenticeship'),
    detail: L(
      "Outils digitaux sur mesure pour l'ACV, les FDES, les EPD et le DPP. Développement front-end et back-end, du cadrage à la mise en production.",
      'Custom digital tools for LCA, EPD and DPP. Front-end and back-end development, from scoping to production.'
    ),
  },
  {
    key: 'mba',
    kind: 'edu',
    startDate: '2024-09-01',
    org: 'MyDigitalSchool Lille',
    period: L('En cours', 'In progress'),
    role: L(
      'MBA Développeur Full Stack — Manager de projet web digital (niveau 7, BAC+5)',
      'MBA Full Stack Developer — Digital web project manager (level 7, BAC+5)'
    ),
    detail: L(
      'Développement front-end et back-end, architecture applicative, cadrage produit et pilotage de projet.',
      'Front-end and back-end development, application architecture, product scoping and project management.'
    ),
  },
  {
    key: 'yoozly',
    kind: 'exp',
    startDate: '2023-07-01',
    org: 'Yoozly',
    period: L('Juillet 2023 — Août 2024', 'July 2023 — August 2024'),
    role: L('Développeur web en alternance', 'Web developer, apprenticeship'),
    detail: L(
      'Première expérience longue en entreprise : développement web et participation à la gestion de projets digitaux.',
      'First long-form experience in a company: web development and involvement in digital project management.'
    ),
  },
  {
    key: 'bachelor',
    kind: 'edu',
    startDate: '2023-09-01',
    org: 'MyDigitalSchool Lille',
    period: L('2023 — 2024', '2023 — 2024'),
    role: L(
      "Bachelor Développeur Web — TP Concepteur Développeur d'Applications (niveau 6, BAC+3/4)",
      'Web Developer Bachelor — Application Designer & Developer (level 6, BAC+3/4)'
    ),
    detail: L(
      'Conception applicative, bases de données (Merise), développement front-end et back-end, travail en équipe projet.',
      'Application design, databases (Merise), front-end and back-end development, team project work.'
    ),
  },
  {
    key: 'bts',
    kind: 'edu',
    startDate: '2021-09-01',
    org: 'Lycée Dampierre, Valenciennes',
    period: L('Avant 2023', 'Before 2023'),
    role: L(
      'BTS SIO option SLAM — Solutions Logicielles et Applications Métiers',
      'BTS SIO, SLAM track — Software Solutions & Business Applications'
    ),
    detail: L(
      'Deux stages à la CAF du Nord. Premiers développements applicatifs et bases de données.',
      'Two internships at CAF du Nord. First application development and database work.'
    ),
  },
];

export const skillGroups = [
  {
    key: 'front',
    order: 0,
    title: L('Front-end', 'Front-end'),
    items: [
      { tech: 'FaReact' },
      { tech: 'FaVuejs' },
      { tech: 'SiNextdotjs' },
      { tech: 'FaAngular' },
      { tech: 'SiTailwindcss' },
      { tech: 'DiSass' },
      { tech: 'SiJavascript' },
    ],
  },
  {
    key: 'back',
    order: 1,
    title: L('Back-end & données', 'Back-end & data'),
    items: [
      { tech: 'SiNestjs' },
      { tech: 'FaNodeJs' },
      { tech: 'SiExpress' },
      { tech: 'FaSymfony' },
      { tech: 'SiPrisma' },
      { tech: 'SiPostgresql' },
      { tech: 'DiMysql' },
      { tech: 'SiMongodb' },
    ],
  },
  {
    key: 'mobile',
    order: 2,
    title: L('Mobile & desktop', 'Mobile & desktop'),
    items: [
      { tech: 'SiFlutter' },
      { tech: 'SiDart' },
      { tech: 'SiTauri' },
      { tech: 'FaRust' },
      { tech: 'SiAppwrite' },
      { tech: 'Pwa', label: L('PWA (hors-ligne, install)', 'PWA (offline, install)') },
    ],
  },
  {
    key: 'tooling',
    order: 3,
    title: L('Outillage & méthodes', 'Tooling & method'),
    items: [
      { tech: 'FaGithub' },
      { tech: 'SiVite' },
      { tech: 'SiPlaywright' },
      { tech: 'SiEslint' },
      { tech: 'FaFigma' },
      { tech: 'Tdd', label: L('TDD & tests E2E', 'TDD & E2E testing') },
      { tech: 'Cicd', label: L('CI/CD (GitHub Actions)', 'CI/CD (GitHub Actions)') },
      { tech: 'Merise', label: L('Merise (MCD, MLD, MPD)', 'Merise (data modelling)') },
      { tech: 'ProjectManagement', label: L('Gestion de projet', 'Project management') },
    ],
  },
];

/** Libellés des technologies, repris du registre d'icônes du front. */
export const technologies = {
  FaReact: 'React',
  FaVuejs: 'Vue.js',
  SiNextdotjs: 'Next.js',
  FaAngular: 'Angular',
  SiTailwindcss: 'Tailwind CSS',
  DiSass: 'Sass',
  SiJavascript: 'JavaScript',
  SiNestjs: 'NestJS',
  FaNodeJs: 'Node.js',
  SiExpress: 'Express',
  FaSymfony: 'Symfony',
  SiPrisma: 'Prisma',
  SiPostgresql: 'PostgreSQL',
  DiMysql: 'MySQL',
  SiMongodb: 'MongoDB',
  SiAppwrite: 'Appwrite',
  SiFlutter: 'Flutter',
  SiDart: 'Dart',
  SiTauri: 'Tauri',
  FaRust: 'Rust',
  Pwa: 'PWA',
  FaGithub: 'Git / GitHub',
  SiVite: 'Vite',
  SiPlaywright: 'Playwright',
  SiEslint: 'ESLint',
  FaFigma: 'Figma',
  Tdd: 'TDD',
  Cicd: 'CI/CD',
  Merise: 'Merise',
  ProjectManagement: 'Project management',
  Airtable: 'Airtable',
  Zapier: 'Zapier',
  Softr: 'Softr',
};
