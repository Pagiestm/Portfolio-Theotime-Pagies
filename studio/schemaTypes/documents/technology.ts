import { defineField, defineType } from 'sanity';

/**
 * Une technologie ou une méthode, référencée par les projets et par les
 * groupes de compétences.
 *
 * `iconKey` pointe vers le registre d'icônes du front (`src/constants/tech.ts`).
 * Une clé inconnue ne casse rien : le front affiche alors le libellé seul.
 */
export const technology = defineType({
  name: 'technology',
  title: 'Technologie',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Nom',
      description: 'Le nom affiché, par exemple « Vue.js ». Identique dans les deux langues.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'iconKey',
      title: 'Icône',
      description:
        'Le logo affiché à côté du nom. Si la clé est absente du front, seul le nom apparaît.',
      type: 'string',
      options: {
        list: [
          { title: 'React', value: 'FaReact' },
          { title: 'Vue.js', value: 'FaVuejs' },
          { title: 'Next.js', value: 'SiNextdotjs' },
          { title: 'Angular', value: 'FaAngular' },
          { title: 'Tailwind CSS', value: 'SiTailwindcss' },
          { title: 'Sass', value: 'DiSass' },
          { title: 'JavaScript', value: 'SiJavascript' },
          { title: 'NestJS', value: 'SiNestjs' },
          { title: 'Node.js', value: 'FaNodeJs' },
          { title: 'Express', value: 'SiExpress' },
          { title: 'Symfony', value: 'FaSymfony' },
          { title: 'Prisma', value: 'SiPrisma' },
          { title: 'PostgreSQL', value: 'SiPostgresql' },
          { title: 'MySQL', value: 'DiMysql' },
          { title: 'MongoDB', value: 'SiMongodb' },
          { title: 'Appwrite', value: 'SiAppwrite' },
          { title: 'Flutter', value: 'SiFlutter' },
          { title: 'Dart', value: 'SiDart' },
          { title: 'Tauri', value: 'SiTauri' },
          { title: 'Rust', value: 'FaRust' },
          { title: 'PWA', value: 'Pwa' },
          { title: 'Git / GitHub', value: 'FaGithub' },
          { title: 'Vite', value: 'SiVite' },
          { title: 'Playwright', value: 'SiPlaywright' },
          { title: 'ESLint', value: 'SiEslint' },
          { title: 'Figma', value: 'FaFigma' },
          { title: 'TDD', value: 'Tdd' },
          { title: 'CI/CD', value: 'Cicd' },
          { title: 'Merise', value: 'Merise' },
          { title: 'Gestion de projet', value: 'ProjectManagement' },
          { title: 'Airtable', value: 'Airtable' },
          { title: 'Zapier', value: 'Zapier' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'iconKey' },
  },
});
