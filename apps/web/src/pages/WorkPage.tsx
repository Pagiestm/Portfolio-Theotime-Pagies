import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import AppliedFilters from '../features/work/components/AppliedFilters';
import FilterPanel from '../features/work/components/FilterPanel';
import ProjectList from '../features/work/components/ProjectList';
import { useProjectFilters } from '../features/work/hooks/useProjectFilters';
import { useTranslation } from '../i18n/useTranslation';
import type { PageHeader as PageHeaderContent, Project } from '../services/sanity/types';

const WorkPage = () => {
  const { t, localize } = useTranslation();
  const { header, projects } = useLoaderData() as {
    header?: PageHeaderContent;
    projects: Project[];
  };
  const filters = useProjectFilters(projects);
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <section className="relative mx-auto max-w-shell px-6 pb-[84px] pt-[68px]">
      <PageHeader
        kicker={localize(header?.kicker)}
        title={localize(header?.title)}
        body={localize(header?.body)}
      />

      <div className="mt-11 grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
        <aside>
          <button
            type="button"
            onClick={() => setPanelOpen((open) => !open)}
            aria-expanded={panelOpen}
            aria-controls="work-filters"
            className="flex w-full cursor-pointer items-center justify-between border-2 border-line px-4 py-3 text-[12px] font-bold uppercase tracking-[.1em] text-ink transition-colors hover:border-accent lg:hidden"
          >
            <span>
              {t.filters}
              {filters.activeCount > 0 && (
                <span className="ml-2 inline-flex h-[18px] min-w-[18px] items-center justify-center bg-accent px-[5px] text-[10px] font-extrabold text-ink">
                  {filters.activeCount}
                </span>
              )}
            </span>
            <span aria-hidden className="text-[16px] leading-none">
              {panelOpen ? '−' : '+'}
            </span>
          </button>

          <div
            id="work-filters"
            className={`${panelOpen ? 'mt-4 block' : 'hidden'} lg:sticky lg:top-24 lg:mt-0 lg:block`}
          >
            <FilterPanel filters={filters} />
          </div>
        </aside>

        <div className="min-w-0">
          {filters.isFiltering && <AppliedFilters filters={filters} />}

          {filters.filtered.length === 0 ? (
            <p className="border-t-2 border-line pt-8 text-[16px] text-muted">{t.noResult}</p>
          ) : (
            <ProjectList projects={filters.filtered} />
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkPage;
