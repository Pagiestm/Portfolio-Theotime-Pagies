import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, SINGLETON_TYPES } from './schemaTypes';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

// Pas d'exception ici : une config qui refuse de se charger empêcherait aussi
// `sanity init` et `sanity login` de tourner. On se contente d'avertir, et
// Sanity signalera l'identifiant manquant avec son propre message.
if (!projectId) {
  console.warn('SANITY_STUDIO_PROJECT_ID manquant — renseignez studio/.env (voir .env.example).');
}

export default defineConfig({
  name: 'portfolio',
  title: 'Portfolio Théotime Pagies',
  projectId: projectId ?? 'missing-project-id',
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Retire les documents uniques du bouton « Create » : ils existent déjà,
    // en créer un second dupliquerait le contenu sans que rien ne le signale.
    templates: (prev) => prev.filter(({ schemaType }) => !SINGLETON_TYPES.includes(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType)
        ? prev.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : prev,
  },
});
