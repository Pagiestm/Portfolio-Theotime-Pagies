import { useLoaderData } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import JourneyCorridor from '../features/path/components/JourneyCorridor';
import { useTranslation } from '../i18n/useTranslation';
import type { JourneyEntry, PathContent } from '../lib/sanity/types';

const PathPage = () => {
  const { localize } = useTranslation();
  const { page, journey } = useLoaderData() as { page: PathContent; journey: JourneyEntry[] };

  return (
    <>
      <section className="relative mx-auto max-w-shell px-6 pt-[74px]">
        <PageHeader
          kicker={localize(page?.header?.kicker)}
          title={localize(page?.header?.title)}
          body={localize(page?.header?.body)}
          note={localize(page?.corridorHint)}
        />
      </section>
      <JourneyCorridor entries={journey} />
    </>
  );
};

export default PathPage;
