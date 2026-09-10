import { createClient } from '@sanity/client';
import { env } from '../../config/env';

/**
 * Client de lecture du contenu.
 *
 * `useCdn` pointe sur apicdn.sanity.io, un cache en périphérie : les lectures
 * sont rapides et ne consomment pas le quota d'API du plan gratuit. En
 * contrepartie le contenu peut avoir quelques secondes de retard après une
 * publication, ce qui est sans conséquence pour un portfolio.
 *
 * Aucun jeton ici : le dataset est public en lecture. L'écriture passe
 * exclusivement par le Studio, authentifié séparément.
 */
export const sanityClient = createClient({
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
  apiVersion: '2024-10-01',
  useCdn: true,
  perspective: 'published',
});

export const isSanityConfigured = Boolean(env.sanity.projectId);
