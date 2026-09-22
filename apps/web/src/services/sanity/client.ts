import { createClient } from '@sanity/client';
import { env } from '../../config/env';

export const sanityClient = createClient({
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
  apiVersion: '2024-10-01',
  useCdn: true,
  perspective: 'published',
});

export const isSanityConfigured = Boolean(env.sanity.projectId);
