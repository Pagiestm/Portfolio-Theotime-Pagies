export const env = {
  sanity: {
    projectId: import.meta.env.SANITY_PROJECT_ID,
    dataset: import.meta.env.SANITY_DATASET ?? 'production',
  },
};
