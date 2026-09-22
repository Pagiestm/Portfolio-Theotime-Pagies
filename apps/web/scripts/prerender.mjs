/**
 * Écrit un vrai fichier HTML par route, avec ses propres métadonnées.
 *
 * Le site est une application monopage : sans cette étape, les huit pages et les
 * onze projets partagent le titre et l'image du `index.html` d'origine. Google
 * exécute le JavaScript et s'en remet, mais les robots de LinkedIn, Slack,
 * WhatsApp et Twitter ne l'exécutent pas : un lien partagé s'affiche sans titre
 * propre et sans vignette. On ne pré-rend donc pas le contenu — inutile ici —
 * seulement l'en-tête, ce que ces robots viennent chercher.
 *
 * Vercel sert le système de fichiers avant d'appliquer les réécritures de
 * `vercel.json` : ces fichiers priment donc sur la règle qui renvoie tout vers
 * `index.html`, sans la modifier.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const FALLBACK_URL = 'https://portfolio-theotime-pagies.vercel.app';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? 'production';

/**
 * Ces libellés ne peuvent pas venir des fichiers i18n : ils sont écrits en
 * TypeScript et importent le paquet partagé, que ce script Node ne résout pas.
 * Les dupliquer ici reste préférable à une étape de compilation supplémentaire,
 * d'autant qu'ils ne changent qu'avec l'arborescence du site.
 */
const PAGES = [
  ['/', null, null],
  [
    '/realisations',
    'Réalisations',
    'Les projets menés par Théotime Pagies : applications web, API, outils internes. Contexte, stack et rôle tenu sur chacun.',
  ],
  [
    '/parcours',
    'Parcours',
    'Le parcours professionnel et la formation de Théotime Pagies, développeur web full-stack.',
  ],
  [
    '/competences',
    'Compétences',
    'Les technologies maîtrisées par Théotime Pagies : front-end, back-end, outillage et mise en production.',
  ],
  ['/a-propos', 'À propos', 'Qui est Théotime Pagies, développeur web full-stack à Lille.'],
  ['/contact', 'Contact', 'Écrire à Théotime Pagies pour un poste, une mission ou un échange.'],
  ['/mentions-legales', 'Mentions légales', 'Informations légales du site de Théotime Pagies.'],
];

const escape = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Les descriptions trop longues sont tronquées par les moteurs : autant le faire proprement. */
const trim = (text, max = 165) => {
  const clean = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
};

const query = async (groq) => {
  const url = `https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${encodeURIComponent(groq)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Sanity a répondu ${response.status}`);
  return (await response.json()).result;
};

/**
 * On réécrit balise par balise plutôt que par motif figé : Prettier éclate les
 * balises longues sur plusieurs lignes, et une expression attendant
 * `property="…" content="…"` côte à côte laissait passer les descriptions.
 */
const setMeta = (html, key, value) =>
  html.replace(/<meta\b[^>]*>/g, (tag) => {
    const id = tag.match(/(?:name|property)="([^"]+)"/);
    if (!id || id[1] !== key) return tag;
    return tag.replace(/content="[^"]*"/, `content="${escape(value)}"`);
  });

const replaceMeta = (html, { title, description, url, image, type }) => {
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
  out = setMeta(out, 'description', description);
  out = setMeta(out, 'og:title', title);
  out = setMeta(out, 'og:description', description);
  out = setMeta(out, 'og:url', url);
  out = setMeta(out, 'og:image', image);
  out = setMeta(out, 'og:type', type);
  out = out.replace(/(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*(")/, `$1${escape(url)}$2`);
  return out;
};

const writeRoute = async (route, html) => {
  const target = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, 'utf8');
};

const main = async () => {
  if (!projectId) {
    // Un aperçu local sans identifiants ne doit pas faire échouer le build.
    console.warn('[prerender] SANITY_PROJECT_ID absent : étape ignorée.');
    return;
  }

  const shell = await readFile(join(DIST, 'index.html'), 'utf8');

  const [settings, projects] = await Promise.all([
    query('*[_type=="siteSettings"][0]{name, siteUrl}'),
    query(
      '*[_type=="project" && defined(slug.current)]{"slug":slug.current, title, "summary":summary.fr, "cover":cover.asset->url, _updatedAt}'
    ),
  ]);

  const site = (settings?.siteUrl ?? FALLBACK_URL).replace(/\/$/, '');
  const baseTitle = shell.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Portfolio';
  const baseDescription =
    shell.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0]?.match(/content="([^"]*)"/)?.[1] ?? '';
  const defaultImage = `${site}/og.png`;
  const owner = settings?.name ?? 'Théotime Pagies';

  const written = [];

  for (const [route, label, description] of PAGES) {
    const html = replaceMeta(shell, {
      title: label ? `${label} — ${owner}` : baseTitle,
      description: description ?? baseDescription,
      url: `${site}${route}`,
      image: defaultImage,
      type: 'website',
    });
    await writeRoute(route, html);
    written.push({ loc: `${site}${route}`, priority: route === '/' ? '1.0' : '0.8' });
  }

  for (const project of projects ?? []) {
    const route = `/realisations/${project.slug}`;
    const html = replaceMeta(shell, {
      title: `${project.title} — ${owner}`,
      description: trim(project.summary) || baseDescription,
      url: `${site}${route}`,
      // Le CDN de Sanity recadre à la demande : pas d'image à générer par projet.
      image: project.cover ? `${project.cover}?w=1200&h=630&fit=crop&auto=format` : defaultImage,
      type: 'article',
    });
    await writeRoute(route, html);
    written.push({
      loc: `${site}${route}`,
      priority: '0.7',
      lastmod: project._updatedAt?.slice(0, 10),
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${written
  .map(
    (entry) =>
      `  <url><loc>${escape(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}<priority>${entry.priority}</priority></url>`
  )
  .join('\n')}
</urlset>
`;
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

  // Le fichier de `public/` sert de garde-fou si ce script est sauté ; on le
  // réécrit ici pour que l'URL du sitemap suive un éventuel changement de domaine.
  await writeFile(
    join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`,
    'utf8'
  );

  console.log(
    `[prerender] ${written.length} routes écrites (dont ${projects?.length ?? 0} projets) + sitemap.xml`
  );
};

await main();
