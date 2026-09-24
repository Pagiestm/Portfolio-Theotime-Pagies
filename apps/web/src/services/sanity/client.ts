import { env } from '../../config/env';

const API_VERSION = '2024-10-01';

export const sanityConfig = {
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
};

export const sanityFetch = async <T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> => {
  const url = new URL(
    `https://${sanityConfig.projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${sanityConfig.dataset}`
  );
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Sanity a répondu ${response.status}`);
  return (await response.json()).result as T;
};
