import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import {
  ROUTE_META,
  FALLBACK_SITE_URL,
  LOCATION,
  OWNER,
  trimDescription,
} from './src/routes/meta.ts';

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const setMetaTag = (html: string, key: string, value: string) =>
  html.replace(/<meta\b[^>]*>/g, (tag) => {
    const id = tag.match(/(?:name|property)="([^"]+)"/);
    if (!id || id[1] !== key) return tag;
    return tag.replace(/content="[^"]*"/, `content="${escapeHtml(value)}"`);
  });

type Meta = {
  title: string;
  description: string;
  url: string;
  image: string;
  type: string;
  jsonLd?: object;
};

const injectJsonLd = (html: string, data: object) =>
  html.replace(
    '</head>',
    `  <script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>\n  </head>`
  );

const applyMeta = (html: string, meta: Meta) => {
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  out = setMetaTag(out, 'description', meta.description);
  out = setMetaTag(out, 'og:title', meta.title);
  out = setMetaTag(out, 'og:description', meta.description);
  out = setMetaTag(out, 'og:url', meta.url);
  out = setMetaTag(out, 'og:image', meta.image);
  out = setMetaTag(out, 'og:type', meta.type);
  out = out.replace(
    /(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*(")/,
    `$1${escapeHtml(meta.url)}$2`
  );
  return meta.jsonLd ? injectJsonLd(out, meta.jsonLd) : out;
};

export const prerender = (): Plugin => ({
  name: 'prerender-meta',
  apply: 'build',
  async closeBundle() {
    const projectId = process.env.SANITY_PROJECT_ID;

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

    const settings: {
      siteUrl?: string;
      name?: string;
      role?: { fr?: string };
      github?: string;
      linkedin?: string;
    } | null = await query('*[_type=="siteSettings"][0]{siteUrl, name, role, github, linkedin}');
    const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    const site = (
      settings?.siteUrl ||
      (vercelUrl ? `https://${vercelUrl}` : '') ||
      FALLBACK_SITE_URL
    ).replace(/\/$/, '');
    const defaultImage = `${site}/og.png`;
    const owner = settings?.name ?? OWNER;
    const person = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: owner,
      jobTitle: settings?.role?.fr,
      url: site,
      image: defaultImage,
      sameAs: [settings?.github, settings?.linkedin].filter(Boolean),
      address: {
        '@type': 'PostalAddress',
        addressLocality: LOCATION.city,
        addressRegion: LOCATION.region,
        addressCountry: LOCATION.country,
      },
      workLocation: { '@type': 'Place', name: LOCATION.city },
    };

    const urls: Array<{ loc: string; priority: string; lastmod?: string }> = [];

    for (const [route, meta] of Object.entries(ROUTE_META)) {
      await write(
        route,
        applyMeta(shell, {
          ...meta,
          url: `${site}${route}`,
          image: defaultImage,
          type: 'website',
          jsonLd: route === '/' ? person : undefined,
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
          title: `${project.title} - ${owner}`,
          description: trimDescription(project.summary),
          url: `${site}${route}`,

          image: project.cover
            ? `${project.cover}?w=1200&h=630&fit=crop&auto=format`
            : defaultImage,
          type: 'article',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: trimDescription(project.summary),
            url: `${site}${route}`,
            image: project.cover ?? defaultImage,
            dateModified: project._updatedAt?.slice(0, 10),
            author: { '@type': 'Person', name: owner, url: site },
          },
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
