import { getCliClient } from 'sanity/cli';

const dryRun = process.argv.includes('--dry-run');
const client = getCliClient({ apiVersion: '2024-10-01' });

const categoryOf = (kicker = '') => {
  const text = kicker.toLowerCase();
  if (/professionnel|\bpro\b/.test(text)) return 'professional';
  if (/perso/.test(text)) return 'personal';
  return 'school';
};

const KIND_BY_STACK = {
  mobile: ['Flutter', 'Dart', 'React Native', 'Swift', 'Kotlin'],
  desktop: ['Tauri', 'Electron', 'Rust'],
  nocode: ['Airtable', 'Zapier', 'Softr', 'Bubble', 'Webflow'],
  api: ['NestJS', 'Express', 'FastAPI', 'Spring'],
};

const kindsOf = (stack = []) => {
  const has = (labels) => stack.some((tech) => labels.includes(tech));
  const kinds = Object.entries(KIND_BY_STACK)
    .filter(([, labels]) => has(labels))
    .map(([kind]) => kind);

  const nonWeb = kinds.some((kind) => ['mobile', 'desktop', 'nocode'].includes(kind));
  if (!nonWeb) kinds.unshift('web');
  return kinds;
};

const teamOf = (text = '') =>
  /groupe de \d|équipe|binôme|trinôme|\bnous\b/i.test(text) ? 'team' : 'solo';

const projects = await client.fetch(`
  *[_type == "project" && defined(kicker) && !defined(category)] | order(endDate desc) {
    _id, title,
    "kicker": kicker.fr,
    "stack": stack[]->label,
    "text": summary.fr + " " + pt::text(content.fr)
  }
`);

if (projects.length === 0) {
  console.log('Rien à migrer.');
  process.exit(0);
}

const tx = client.transaction();

for (const project of projects) {
  const patch = {
    category: categoryOf(project.kicker),
    kinds: kindsOf(project.stack),
    team: teamOf(project.text),
  };
  console.log(
    `${project.title.padEnd(44)} ${patch.category.padEnd(12)} ${patch.kinds.join('+').padEnd(12)} ${patch.team}`
  );
  tx.patch(project._id, (p) => p.set(patch).unset(['kicker']));
}

if (dryRun) {
  console.log(`\n(simulation) ${projects.length} réalisation(s) seraient migrées.`);
} else {
  await tx.commit();
  console.log(
    `\n${projects.length} réalisation(s) migrée(s). Relisez « Type de livrable » et « Réalisation » dans le Studio.`
  );
}
