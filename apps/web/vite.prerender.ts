import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { ROUTE_META, FALLBACK_SITE_URL, OWNER, trimDescription } from './src/routes/meta';

/**
 * Écrit un fichier HTML par route après le build, chacun avec ses métadonnées.
 *
 * Le site est une application monopage : sans cette étape, les huit pages et les
 * onze projets partagent le titre et l'image de `index.html`. Le hook
 * `usePageMeta` corrige la navigation dans le navigateur, mais pas les aperçus
 * de liens : Google exécute le JavaScript, les robots de LinkedIn, Slack et
 * WhatsApp ne l'exécutent pas et lisent le HTML tel qu'il est servi.
 *
 * Vercel sert le système de fichiers avant d'appliquer les réécritures de
 * `vercel.json` : ces fichiers priment donc sur la règle qui renvoie tout vers
 * `index.html`, sans qu'il faille la modifier.
 *
 * Le titre et la description viennent de `src/config/pageMeta.ts`, que React lit
 * aussi : une seule source, jamais deux listes à tenir d'accord.
 */
const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * On réécrit balise par balise plutôt que par motif figé : Prettier éclate les
 * balises longues sur plusieurs lignes, et une expression attendant
 * `property="…" content="…"` côte à côte laisse passer les descriptions.
 */
const setMetaTag = (html: string, key: string, value: string) =>
  html.replace(/<meta\b[^>]*>/g, (tag) => {
    const id = tag.match(/(?:name|property)="([^"]+)"/);
    if (!id || id[1] !== key) return tag;
    return tag.replace(/content="[^"]*"/, `content="${escapeHtml(value)}"`);
  });

type Meta = { title: string; description: string; url: string; image: string; type: string };

const applyMeta = (html: string, meta: Meta) => {
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  out = setMetaTag(out, 'description', meta.description);
  out = setMetaTag(out, 'og:title', meta.title);
  out = setMetaTag(out, 'og:description', meta.description);
  out = setMetaTag(out, 'og:url', meta.url);
  out = setMetaTag(out, 'og:image', meta.image);
  out = setMetaTag(out, 'og:type', meta.type);
  return out.replace(
    /(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*(")/,
    `$1${escapeHtml(meta.url)}$2`
  );
};

export const prerender = (): Plugin => ({
  name: 'prerender-meta',
  apply: 'build',
  async closeBundle() {
    const projectId = process.env.SANITY_PROJECT_ID;
    // Un build local sans identifiants ne doit pas échouer pour autant.
    if (!projectId) {
      this.warn('SANITY_PROJECT_ID absent : pré-rendu ignoré.');
      return;
    }
    const dataset = process.env.SANITY_DATASET ?? 'production';
    const dist = fileURLToPath(new URL('./dist', import.meta.url));
    const shell = await readFile(join(dist, 'index.html'), 'utf8');

    const query = async (groq: string) => {
      const url = `https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${encodeURIComponent(groq)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Sanity a répondu ${response.status}`);
      return (await response.json()).result;
    };

    const write = async (route: string, html: string) => {
      const target = route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html');
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, html, 'utf8');
    };

    /**
     * L'adresse absolue ne doit jamais être écrite en dur : elle change avec le
     * domaine. Le Studio fait autorité, Vercel prend le relais sur un aperçu ou
     * si rien n'est saisi, et la constante ne sert qu'aux builds hors Vercel.
     */
    const settings: { siteUrl?: string } | null = await query(
      '*[_type=="siteSettings"][0]{siteUrl}'
    );
    const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    const site = (
      settings?.siteUrl ||
      (vercelUrl ? `https://${vercelUrl}` : '') ||
      FALLBACK_SITE_URL
    ).replace(/\/$/, '');
    const defaultImage = `${site}/og.png`;

    const urls: Array<{ loc: string; priority: string; lastmod?: string }> = [];

    for (const [route, meta] of Object.entries(ROUTE_META)) {
      await write(
        route,
        applyMeta(shell, {
          ...meta,
          url: `${site}${route}`,
          image: defaultImage,
          type: 'website',
        })
      );
      urls.push({ loc: `${site}${route}`, priority: route === '/' ? '1.0' : '0.8' });
    }

    const projects: Array<{
      slug: string;
      title: string;
      summary?: string;
      cover?: string;
      _updatedAt?: string;
    }> = await query(
      '*[_type=="project" && defined(slug.current)]{"slug":slug.current, title, "summary":summary.fr, "cover":cover.asset->url, _updatedAt}'
    );

    for (const project of projects ?? []) {
      const route = `/realisations/${project.slug}`;
      await write(
        route,
        applyMeta(shell, {
          title: `${project.title} - ${OWNER}`,
          description: trimDescription(project.summary),
          url: `${site}${route}`,
          // Le CDN de Sanity recadre à la demande : aucune image à générer.
          image: project.cover
            ? `${project.cover}?w=1200&h=630&fit=crop&auto=format`
            : defaultImage,
          type: 'article',
        })
      );
      urls.push({
        loc: `${site}${route}`,
        priority: '0.7',
        lastmod: project._updatedAt?.slice(0, 10),
      });
    }

    await writeFile(
      join(dist, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
        .map(
          (entry) =>
            `  <url><loc>${escapeHtml(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}<priority>${entry.priority}</priority></url>`
        )
        .join('\n')}\n</urlset>\n`,
      'utf8'
    );

    // `public/robots.txt` sert de garde-fou ; on le réécrit pour que l'URL du
    // sitemap suive un éventuel changement de domaine.
    await writeFile(
      join(dist, 'robots.txt'),
      `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`,
      'utf8'
    );

    this.info(
      `${urls.length} routes pré-rendues sur ${site} (dont ${projects?.length ?? 0} projets)`
    );
  },
});
