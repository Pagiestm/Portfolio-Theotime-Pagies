/**
 * Migration unique : verse le contenu qui vivait dans le code vers Sanity.
 *
 * Le script est idempotent — chaque document porte un identifiant déterministe
 * et `createOrReplace` est utilisé partout. Le rejouer écrase le contenu par
 * l'instantané du code : à ne relancer qu'en connaissance de cause, une fois
 * que le Studio est devenu la source de vérité.
 *
 * Usage :
 *   cd studio
 *   SANITY_STUDIO_PROJECT_ID=xxx SANITY_WRITE_TOKEN=sk... node scripts/migrate.mjs
 *   node scripts/migrate.mjs --dry-run    (n'écrit rien, affiche le plan)
 */

import { createClient } from '@sanity/client';
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { htmlToPortableText } from './html-to-portable-text.mjs';
import * as seed from './seed.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const REPO = resolve(HERE, '../..');
const DRY_RUN = process.argv.includes('--dry-run');

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) exit('SANITY_STUDIO_PROJECT_ID manquant.');
if (!token && !DRY_RUN)
  exit(
    'SANITY_WRITE_TOKEN manquant. Créez-en un dans sanity.io/manage > API > Tokens (rôle Editor).'
  );

function exit(message) {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-10-01',
  useCdn: false,
});

/* ------------------------------------------------------------------ outils */

const log = (icon, message) => console.log(`  ${icon} ${message}`);

/** Identifiant stable : rejouer la migration met à jour au lieu de dupliquer. */
const idFor = (type, key) => `${type}.${key}`;

const ref = (id) => ({ _type: 'reference', _ref: id });

const keyed = (items) => items.map((item, index) => ({ ...item, _key: `${index}` }));

/** Mois français → numéro, pour déduire une date de fin des périodes textuelles. */
const MONTHS = {
  janvier: 1,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  décembre: 12,
};

/**
 * « MyGPT - avril à mai 2025 » → « 2025-05-01 ».
 * Ce décodage ne sert qu'ici : une fois dans Sanity, la date est un vrai champ
 * et l'ordre ne dépend plus d'une chaîne de caractères.
 */
const endDateFrom = (title) => {
  const years = title.match(/\b(19|20)\d{2}\b/g);
  const year = years ? Number(years[years.length - 1]) : new Date().getFullYear();
  const lower = title.toLowerCase();
  const month = Object.entries(MONTHS).reduce(
    (best, [name, index]) => {
      const at = lower.lastIndexOf(name);
      return at > best.at ? { at, index } : best;
    },
    { at: -1, index: 12 }
  ).index;
  return `${year}-${String(month).padStart(2, '0')}-01`;
};

const slugify = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* --------------------------------------------------------------- médias */

const assetCache = new Map();

/**
 * Envoie un fichier du dépôt vers Sanity et renvoie sa référence.
 * Sanity déduplique par empreinte du contenu : deux appels sur le même fichier
 * ne créent qu'un seul asset.
 */
const uploadAsset = async (kind, relativePath) => {
  const cacheKey = `${kind}:${relativePath}`;
  if (assetCache.has(cacheKey)) return assetCache.get(cacheKey);

  const absolute = join(REPO, relativePath.replace(/^\//, ''));
  const fromPublic = join(REPO, 'public', relativePath.replace(/^\//, ''));
  const path = existsSync(absolute) ? absolute : existsSync(fromPublic) ? fromPublic : null;

  if (!path) {
    log('⚠', `fichier introuvable, ignoré : ${relativePath}`);
    return null;
  }

  if (DRY_RUN) {
    assetCache.set(cacheKey, { _dryRun: relativePath });
    return { _dryRun: relativePath };
  }

  const asset = await client.assets.upload(kind, createReadStream(path), {
    filename: basename(path),
  });
  const reference = {
    _type: kind === 'image' ? 'image' : 'file',
    asset: { _type: 'reference', _ref: asset._id },
  };
  assetCache.set(cacheKey, reference);
  return reference;
};

/* ------------------------------------------------------------- documents */

const documents = [];
const push = (doc) => documents.push(doc);

async function buildTechnologies() {
  for (const [iconKey, label] of Object.entries(seed.technologies)) {
    push({ _id: idFor('technology', iconKey), _type: 'technology', label, iconKey });
  }
  log('•', `${Object.keys(seed.technologies).length} technologies`);
}

async function buildProjects() {
  const large = JSON.parse(
    readFileSync(join(REPO, 'src/features/work/data/large-projects.json'), 'utf8')
  );
  const small = JSON.parse(
    readFileSync(join(REPO, 'src/features/work/data/small-projects.json'), 'utf8')
  );
  const raw = [...large, ...small];

  for (const item of raw) {
    const slug = slugify(item.modalTitle);
    const period = item.title.split(' - ').slice(1).join(' - ').trim();

    const cover = await uploadAsset('image', item.cardImage);
    const gallery = [];
    for (const src of item.images ?? []) {
      const uploaded = await uploadAsset('image', src);
      if (uploaded) gallery.push(uploaded);
    }

    const iconKeys = (item.logos ?? []).map((logo) => logo.icon);
    // SmartLille n'a pas de logos mais une liste de noms : on retrouve la clé
    // d'icône par le libellé pour ne pas perdre sa stack.
    const byLabel = Object.fromEntries(
      Object.entries(seed.technologies).map(([key, label]) => [label.toLowerCase(), key])
    );
    const fallbackKeys = (item.stack ?? [])
      .map((label) => byLabel[String(label).toLowerCase()])
      .filter(Boolean);
    const stackKeys = iconKeys.length ? iconKeys : fallbackKeys;

    const pdf = item.pdf ? await uploadAsset('file', item.pdf) : null;
    const blocks = htmlToPortableText(item.modalContent);

    push({
      _id: idFor('project', slug),
      _type: 'project',
      title: item.modalTitle,
      slug: { _type: 'slug', current: slug },
      kicker: { fr: item.badge, en: item.badge },
      period: { fr: period, en: period },
      endDate: endDateFrom(item.title),
      summary: { fr: item.description, en: null },
      content: { fr: blocks, en: [] },
      cover,
      gallery: keyed(gallery),
      stack: stackKeys.map((key, index) => ({
        ...ref(idFor('technology', key)),
        _key: `${index}`,
      })),
      links: {
        site: item.siteLink ?? null,
        github: item.githubLink ?? null,
        api: item.api ?? null,
        figma: item.figma ?? null,
        ...(pdf ? { pdf } : {}),
      },
    });
    log('•', `projet ${item.modalTitle} (${gallery.length} aperçus)`);
  }
}

async function buildJourney() {
  for (const entry of seed.journey) {
    const { key, ...fields } = entry;
    push({ _id: idFor('journey', key), _type: 'journeyEntry', ...fields });
  }
  log('•', `${seed.journey.length} étapes de parcours`);
}

async function buildSkillGroups() {
  for (const group of seed.skillGroups) {
    const { key, items, ...fields } = group;
    push({
      _id: idFor('skillGroup', key),
      _type: 'skillGroup',
      ...fields,
      items: keyed(
        items.map((item) => ({
          _type: 'skill',
          tech: ref(idFor('technology', item.tech)),
          ...(item.label ? { label: item.label } : {}),
        }))
      ),
    });
  }
  log('•', `${seed.skillGroups.length} groupes de compétences`);
}

async function buildSingletons() {
  push({ _id: 'siteSettings', _type: 'siteSettings', ...seed.siteSettings });

  push({
    _id: 'homePage',
    _type: 'homePage',
    ...seed.homePage,
    chapters: keyed(seed.homePage.chapters.map((c) => ({ _type: 'chapter', ...c }))),
    marquee: keyed(seed.homePage.marquee.map((m) => ({ _type: 'fact', ...m }))),
  });

  push({ _id: 'workPage', _type: 'workPage', ...seed.workPage });
  push({ _id: 'pathPage', _type: 'pathPage', ...seed.pathPage });
  push({ _id: 'skillsPage', _type: 'skillsPage', ...seed.skillsPage });
  push({ _id: 'contactPage', _type: 'contactPage', ...seed.contactPage });

  const portrait = await uploadAsset('image', seed.aboutPage.portraitFile);
  push({
    _id: 'aboutPage',
    _type: 'aboutPage',
    header: seed.aboutPage.header,
    portrait,
    paragraphs: keyed(seed.aboutPage.paragraphs.map((p) => ({ _type: 'paragraph', ...p }))),
    facts: keyed(seed.aboutPage.facts.map((f) => ({ _type: 'fact', ...f }))),
  });

  log('•', '7 pages');
}

/* ------------------------------------------------------------------ main */

async function main() {
  console.log(`\n  Migration vers ${projectId}/${dataset}${DRY_RUN ? '  (simulation)' : ''}\n`);

  await buildTechnologies();
  await buildProjects();
  await buildJourney();
  await buildSkillGroups();
  await buildSingletons();

  console.log(`\n  ${documents.length} documents prêts.`);

  if (DRY_RUN) {
    const byType = documents.reduce((acc, doc) => {
      acc[doc._type] = (acc[doc._type] ?? 0) + 1;
      return acc;
    }, {});
    console.log('  Répartition :', JSON.stringify(byType, null, 0));
    console.log('\n  Simulation — rien n’a été écrit.\n');
    return;
  }

  // Une seule transaction : soit tout le contenu arrive, soit rien, et le
  // dataset ne reste jamais à moitié peuplé.
  const tx = documents.reduce((acc, doc) => acc.createOrReplace(doc), client.transaction());
  await tx.commit({ visibility: 'async' });

  console.log(`\n  ✓ Migration terminée.\n`);
}

main().catch((error) => {
  console.error('\n  ✗ Échec :', error.message);
  if (error.response?.body) console.error('   ', JSON.stringify(error.response.body).slice(0, 400));
  process.exit(1);
});
