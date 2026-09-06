import { Link, useLoaderData } from 'react-router-dom';
import HeroStage from '../features/home/components/HeroStage';
import MarqueeBand from '../features/home/components/MarqueeBand';
import ClosingBanner from '../features/home/components/ClosingBanner';
import ProjectRow from '../features/work/components/ProjectRow';
import { useTranslation } from '../i18n/useTranslation';
import { paths } from '../routes/paths';
import type { HomeContent, Project } from '../lib/sanity/types';

const FEATURED_COUNT = 4;

const HomePage = () => {
  const { t, localize } = useTranslation();
  const { home, projects } = useLoaderData() as { home: HomeContent; projects: Project[] };

  return (
    <>
      <HeroStage chapters={home?.chapters ?? []} />
      <MarqueeBand items={home?.marquee ?? []} />

      <section className="mx-auto max-w-shell px-6 pt-[84px]">
        <div className="mb-[14px] flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-[14px] text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
              01 — {localize(home?.selectionKicker) ?? t.selection}
            </div>
            <h2 className="m-0 text-[clamp(26px,3.6vw,46px)] font-black tracking-[-.03em]">
              {localize(home?.indexTitle) ?? t.indexTitle}
            </h2>
          </div>
          <Link
            to={paths.work}
            className="border-b-2 border-accent py-[6px] text-[13.5px] font-bold uppercase tracking-[.05em] text-ink hover:text-accent-2"
          >
            {t.seeAll} →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-6 pb-[84px] pt-[34px]">
        <div className="border-t-2 border-line">
          {projects.slice(0, FEATURED_COUNT).map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>

      <ClosingBanner title={home?.closingTitle} cta={home?.closingCta} />
    </>
  );
};

export default HomePage;
