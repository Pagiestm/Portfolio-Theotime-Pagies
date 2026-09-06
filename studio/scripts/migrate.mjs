/**
 * Migration unique : verse le contenu qui vivait dans le code vers Sanity.
 *
 * Le script est idempotent — chaque document porte un identifiant déterministe
 * et `createOrReplace` est utilisé partout. Le rejouer écrase le contenu par
 * l'instantané du code : à ne relancer qu'en connaissance de cause, une fois
 * que le Studio est devenu la source de vérité.
 *
 * Lancement :
 *   npm run migrate:dry     simulation, n'écrit rien
 *   npm run migrate         écrit, authentifié par la session `sanity login`
 *
 * Le client est fourni par l'appelant (`migrate-cli.mjs`, exécuté via
 * `sanity exec`), ce qui évite de créer et de faire circuler un jeton.
 */

import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { htmlToPortableText } from './html-to-portable-text.mjs';
import * as seed from './seed.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const REPO = resolve(HERE, '../..');

/* ------------------------------------------------------------------ outils */

const log = (icon, message) => console.log(`  ${icon} ${message}`);

/**
 * Identifiant stable : rejouer la migration met à jour au lieu de dupliquer.
 *
 * Le séparateur est un tiret, surtout pas un point : un point fait de l'ID un
 * chemin, et Sanity rend privés tous les documents situés dans un chemin — le
 * mécanisme qui protège `drafts.*`. Le site les lit sans jeton, ils doivent
 * donc rester à la racine.
 */
const idFor = (type, key) => `${type}-${key}`;

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
 * et l'ordre de l'index ne dépend plus d'une chaîne de caractères.
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

/* ---------------------------------------------------------------- médias */

/**
 * Envoie un fichier du dépôt vers Sanity et renvoie sa référence.
 * Sanity déduplique par empreinte du contenu : deux appels sur le même fichier
 * ne créent qu'un seul asset.
 */
const makeUploader = (client, dryRun) => {
  const cache = new Map();

  return async (kind, relativePath) => {
    const cacheKey = `${kind}:${relativePath}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const clean = relativePath.replace(/^\//, '');
    const path = [join(REPO, clean), join(REPO, 'public', clean)].find(existsSync) ?? null;

    if (!path) {
      log('!', `fichier introuvable, ignoré : ${relativePath}`);
      return null;
    }

    if (dryRun) {
      const stub = { _dryRun: relativePath };
      cache.set(cacheKey, stub);
      return stub;
    }

    const asset = await client.assets.upload(kind, createReadStream(path), {
      filename: basename(path),
    });
    const reference = {
      _type: kind === 'image' ? 'image' : 'file',
      asset: { _type: 'reference', _ref: asset._id },
    };
    cache.set(cacheKey, reference);
    return reference;
  };
};

/* --------------------------------------------------------------- documents */

const buildTechnologies = (push) => {
  for (const [iconKey, label] of Object.entries(seed.technologies)) {
    push({ _id: idFor('technology', iconKey), _type: 'technology', label, iconKey });
  }
  log('*', `${Object.keys(seed.technologies).length} technologies`);
};

/**
 * Les réalisations ont été migrées une fois, puis leurs JSON ont été retirés
 * du dépôt : Sanity en est désormais la seule source. Cette étape ne fait donc
 * plus rien, sauf si les fichiers sont remis en place pour réamorcer un
 * dataset vide.
 */
const buildProjects = async (push, upload) => {
  const sources = [
    'src/features/work/data/large-projects.json',
    'src/features/work/data/small-projects.json',
  ].map((file) => join(REPO, file));

  if (!sources.every(existsSync)) {
    log('=', 'réalisations ignorées — elles vivent dans Sanity, plus dans le dépôt');
    return;
  }

  const raw = sources.flatMap((path) => JSON.parse(readFileSync(path, 'utf8')));

  // Retrouve une clé d'icône depuis un libellé : SmartLille liste des noms
  // (« Airtable », « Zapier ») au lieu de logos, sa stack serait sinon perdue.
  const byLabel = Object.fromEntries(
    Object.entries(seed.technologies).map(([key, label]) => [label.toLowerCase(), key])
  );

  for (const item of raw) {
    const slug = slugify(item.modalTitle);
    const period = item.title.split(' - ').slice(1).join(' - ').trim();

    const cover = await upload('image', item.cardImage);
    const gallery = [];
    for (const src of item.images ?? []) {
      const uploaded = await upload('image', src);
      if (uploaded) gallery.push(uploaded);
    }

    const iconKeys = (item.logos ?? []).map((logo) => logo.icon);
    const fallbackKeys = (item.stack ?? [])
      .map((label) => byLabel[String(label).toLowerCase()])
      .filter(Boolean);
    const stackKeys = iconKeys.length ? iconKeys : fallbackKeys;

    const pdf = item.pdf ? await upload('file', item.pdf) : null;

    push({
      _id: idFor('project', slug),
      _type: 'project',
      title: item.modalTitle,
      slug: { _type: 'slug', current: slug },
      kicker: { fr: item.badge, en: item.badge },
      period: { fr: period, en: period },
      endDate: endDateFrom(item.title),
      summary: { fr: item.description, en: null },
      content: { fr: htmlToPortableText(item.modalContent), en: [] },
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
    log('*', `projet ${item.modalTitle} (${gallery.length} aperçus)`);
  }
};

const buildJourney = (push) => {
  for (const { key, ...fields } of seed.journey) {
    push({ _id: idFor('journey', key), _type: 'journeyEntry', ...fields });
  }
  log('*', `${seed.journey.length} étapes de parcours`);
};

const buildSkillGroups = (push) => {
  for (const { key, items, ...fields } of seed.skillGroups) {
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
  log('*', `${seed.skillGroups.length} groupes de compétences`);
};

const buildSingletons = async (push, upload) => {
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

  push({
    _id: 'aboutPage',
    _type: 'aboutPage',
    header: seed.aboutPage.header,
    paragraphs: keyed(seed.aboutPage.paragraphs.map((p) => ({ _type: 'paragraph', ...p }))),
    facts: keyed(seed.aboutPage.facts.map((f) => ({ _type: 'fact', ...f }))),
  });

  log('*', '7 pages');
};

/* -------------------------------------------------------------------- run */

export async function runMigration(client, { dryRun = false } = {}) {
  const { projectId, dataset } = client.config();
  console.log(`\n  Migration vers ${projectId}/${dataset}${dryRun ? '  (simulation)' : ''}\n`);

  const documents = [];
  const push = (doc) => documents.push(doc);
  const upload = makeUploader(client, dryRun);

  buildTechnologies(push);
  await buildProjects(push, upload);
  buildJourney(push);
  buildSkillGroups(push);
  await buildSingletons(push, upload);

  console.log(`\n  ${documents.length} documents prêts.`);

  if (dryRun) {
    const byType = documents.reduce((acc, doc) => {
      acc[doc._type] = (acc[doc._type] ?? 0) + 1;
      return acc;
    }, {});
    console.log('  Répartition :', JSON.stringify(byType));
    console.log('\n  Simulation — rien n’a été écrit.\n');
    return documents;
  }

  // Une seule transaction : soit tout le contenu arrive, soit rien, et le
  // dataset ne reste jamais à moitié peuplé.
  const tx = documents.reduce((acc, doc) => acc.createOrReplace(doc), client.transaction());
  await tx.commit({ visibility: 'async' });

  console.log('\n  Migration terminée.\n');
  return documents;
}
