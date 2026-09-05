import PageHeader from '../components/common/PageHeader';
import JourneyCorridor from '../features/path/components/JourneyCorridor';
import { useTranslation } from '../i18n/useTranslation';

const PathPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="relative mx-auto max-w-shell px-6 pt-[74px]">
        <PageHeader
          kicker={t.pathKicker}
          title={t.pathTitle}
          body={t.pathBody}
          note={t.corridorHint}
        />
      </section>
      <JourneyCorridor />
    </>
  );
};

export default PathPage;
