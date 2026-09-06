import { useLoaderData } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import ProjectFilters from '../features/work/components/ProjectFilters';
import ProjectList from '../features/work/components/ProjectList';
import { useProjectFilters } from '../features/work/hooks/useProjectFilters';
import { useTranslation } from '../i18n/useTranslation';
import type { PageHeader as PageHeaderContent, Project } from '../lib/sanity/types';

const WorkPage = () => {
  const { t, localize } = useTranslation();
  const { header, projects } = useLoaderData() as {
    header?: PageHeaderContent;
    projects: Project[];
  };
  const { query, setQuery, selectedTech, toggleTech, reset, filtered, availableTech, isFiltering } =
    useProjectFilters(projects);

  return (
    <section className="relative mx-auto max-w-shell overflow-hidden px-6 pb-[84px] pt-[68px]">
      <PageHeader
        kicker={localize(header?.kicker)}
        title={localize(header?.title)}
        body={localize(header?.body)}
      />

      <div className="mt-11">
        <ProjectFilters
          query={query}
          onQueryChange={setQuery}
          selectedTech={selectedTech}
          onToggleTech={toggleTech}
          onReset={reset}
          isFiltering={isFiltering}
          availableTech={availableTech}
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
