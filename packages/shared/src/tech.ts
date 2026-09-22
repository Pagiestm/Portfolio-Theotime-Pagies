export const TECHNOLOGIES = [
  { key: 'FaReact', label: 'React' },
  { key: 'FaVuejs', label: 'Vue.js' },
  { key: 'SiNextdotjs', label: 'Next.js' },
  { key: 'FaAngular', label: 'Angular' },
  { key: 'SiTailwindcss', label: 'Tailwind CSS' },
  { key: 'DiSass', label: 'Sass' },
  { key: 'SiJavascript', label: 'JavaScript' },
  { key: 'SiTypescript', label: 'TypeScript' },

  { key: 'SiNestjs', label: 'NestJS' },
  { key: 'FaNodeJs', label: 'Node.js' },
  { key: 'SiExpress', label: 'Express' },
  { key: 'FaSymfony', label: 'Symfony' },
  { key: 'SiPrisma', label: 'Prisma' },
  { key: 'SiPostgresql', label: 'PostgreSQL' },
  { key: 'DiMysql', label: 'MySQL' },
  { key: 'SiMongodb', label: 'MongoDB' },
  { key: 'SiAppwrite', label: 'Appwrite' },

  { key: 'SiFlutter', label: 'Flutter' },
  { key: 'SiDart', label: 'Dart' },
  { key: 'SiTauri', label: 'Tauri' },
  { key: 'FaRust', label: 'Rust' },
  { key: 'Pwa', label: 'PWA' },

  { key: 'FaGithub', label: 'Git / GitHub' },
  { key: 'SiVite', label: 'Vite' },
  { key: 'SiPlaywright', label: 'Playwright' },
  { key: 'SiEslint', label: 'ESLint' },
  { key: 'FaFigma', label: 'Figma' },
  { key: 'Tdd', label: 'TDD' },
  { key: 'Cicd', label: 'CI/CD' },
  { key: 'Merise', label: 'Merise' },
  { key: 'ProjectManagement', label: 'Project management' },
  { key: 'Scrum', label: 'Scrum' },

  { key: 'SiDocker', label: 'Docker' },
  { key: 'SiTerraform', label: 'Terraform' },
  { key: 'SiAmazonwebservices', label: 'AWS' },
  { key: 'SiFirebase', label: 'Firebase' },
  { key: 'SiRedis', label: 'Redis' },
  { key: 'SiStripe', label: 'Stripe' },
  { key: 'SiSocketdotio', label: 'Socket.IO' },
  { key: 'SiPlaycanvas', label: 'PlayCanvas' },
  { key: 'SiSqlite', label: 'SQLite' },
  { key: 'SiTelegram', label: 'Telegram' },
  { key: 'SiNginx', label: 'Nginx' },
  { key: 'SiPuppeteer', label: 'Puppeteer' },
  { key: 'Ollama', label: 'Ollama' },
  { key: 'Airtable', label: 'Airtable' },
  { key: 'Zapier', label: 'Zapier' },
] as const;

export type Technology = (typeof TECHNOLOGIES)[number];
export type TechKey = Technology['key'];

export const TECH_KEYS = TECHNOLOGIES.map((tech) => tech.key) as readonly TechKey[];

export const techLabelOf = (key: string): string =>
  TECHNOLOGIES.find((tech) => tech.key === key)?.label ?? key;
