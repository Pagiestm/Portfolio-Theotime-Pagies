/**
 * Point d'entrée de la migration, exécuté par `sanity exec`.
 *
 * `getCliClient` renvoie un client déjà authentifié par la session
 * `sanity login` : aucun jeton d'écriture à créer, à stocker ni à transmettre.
 *
 *   npm run migrate:dry   simulation
 *   npm run migrate       écriture
 */

import { getCliClient } from 'sanity/cli';
import { runMigration } from './migrate.mjs';

const dryRun = process.argv.includes('--dry-run');

const client = getCliClient({ apiVersion: '2024-10-01' });

runMigration(client, { dryRun }).catch((error) => {
  console.error('\n  Échec de la migration :', error.message);
  if (error.response?.body) {
    console.error('   ', JSON.stringify(error.response.body).slice(0, 400));
  }
  process.exitCode = 1;
});
