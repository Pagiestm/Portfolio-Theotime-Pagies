/**
 * Déplace les anciens liens fixes d'une réalisation (`links.site`, `.github`,
 * `.api`, `.figma`, `.pdf`) vers la liste libre `resources`, puis retire
 * l'ancien champ.
 *
 * Rejouable : un projet déjà migré (`resources` défini) est ignoré. Ne touche
 * que les documents publiés : publier ou abandonner les brouillons avant.
 *
 *   npx sanity exec scripts/migrate-links.mjs --with-user-token -- --dry-run
 *   npx sanity exec scripts/migrate-links.mjs --with-user-token
 */

import { randomUUID } from 'node:crypto';
import { getCliClient } from 'sanity/cli';

const dryRun = process.argv.includes('--dry-run');
const client = getCliClient({ apiVersion: '2024-10-01' });
const key = () => randomUUID().slice(0, 12);

/** Intitulés repris du code du site, tels qu'ils étaient affichés. */
const LABELS = {
  pdf: { fr: 'Dossier de projet', en: 'Project report' },
  api: { fr: 'Documentation API', en: 'API documentation' },
  figma: { fr: 'Maquette', en: 'Design file' },
  github: { fr: 'Code source', en: 'Source code' },
  site: { fr: 'Consulter le site', en: 'Visit the site' },
};

const projects = await client.fetch(
  `*[_type == "project" && defined(links) && !defined(resources)] | order(endDate desc) { _id, title, links }`
);

if (projects.length === 0) {
  console.log('Rien à migrer.');
  process.exit(0);
}

const tx = client.transaction();

for (const project of projects) {
  const resources = Object.entries(LABELS).flatMap(([field, label]) => {
    const value = project.links?.[field];
    if (!value) return [];
    return field === 'pdf'
      ? [{ _key: key(), _type: 'documentFile', label, file: value }]
      : [{ _key: key(), _type: 'externalLink', label, url: value }];
  });

  console.log(`${project.title}`);
  for (const r of resources) console.log(`   - ${r.label.fr} → ${r.url ?? r.file?.asset?._ref}`);

  tx.patch(project._id, (patch) => patch.set({ resources }).unset(['links']));
}

if (dryRun) {
  console.log(`\n(simulation) ${projects.length} réalisation(s) seraient migrées.`);
} else {
  await tx.commit();
  console.log(`\n${projects.length} réalisation(s) migrée(s).`);
}
