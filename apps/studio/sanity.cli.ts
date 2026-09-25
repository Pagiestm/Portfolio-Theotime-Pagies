import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  studioHost: 'theotimepagies',
  deployment: { autoUpdates: true, appId: 'uy383x5p830fq4mt1wqkd32a' },
});
