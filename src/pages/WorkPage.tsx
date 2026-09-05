import PageHeader from '../components/common/PageHeader';
import ProjectFilters from '../features/work/components/ProjectFilters';
import ProjectList from '../features/work/components/ProjectList';
import { useProjectFilters } from '../features/work/hooks/useProjectFilters';
import { useTranslation } from '../i18n/useTranslation';

const WorkPage = () => {
  const { t } = useTranslation();
  const { query, setQuery, selectedTech, toggleTech, reset, filtered, isFiltering } =
    useProjectFilters();

  return (
    <section className="relative mx-auto max-w-shell overflow-hidden px-6 pb-[84px] pt-[68px]">
      <PageHeader kicker={t.workKicker} title={t.workTitle} body={t.workBody} />

      <div className="mt-11">
        <ProjectFilters
          query={query}
          onQueryChange={setQuery}
          selectedTech={selectedTech}
          onToggleTech={toggleTech}
          onReset={reset}
          isFiltering={isFiltering}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="border-t-2 border-line pt-8 text-[16px] text-muted">{t.noResult}</p>
      ) : (
        <ProjectList projects={filtered} />
      )}
    </section>
  );
};

export default WorkPage;
