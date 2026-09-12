import { ReactNode } from 'react';
import { useLoaderData } from 'react-router-dom';
import ActionLink from '../components/common/ActionLink';
import HeroStage from '../features/home/components/HeroStage';
import JourneyPreview from '../features/home/components/JourneyPreview';
import MarqueeBand from '../features/home/components/MarqueeBand';
import TechBand from '../features/home/components/TechBand';
import ClosingBanner from '../features/home/components/ClosingBanner';
import ProjectCard from '../features/work/components/ProjectCard';
import { selectFeatured } from '../features/work/utils/selectFeatured';
import { useTranslation } from '../i18n/useTranslation';
import { paths } from '../routes/paths';
import { topTechnologies } from '../utils/topTechnologies';
import type { HomeContent, JourneyEntry, Project } from '../services/sanity/types';

const TECH_COUNT = 10;

/**
 * En-tête commun des sections de l'accueil : numéro, surtitre, grand titre.
 * Le numéro suit l'ordre réel d'affichage, une section masquée ne laisse pas
 * de trou dans la numérotation.
 */
const SectionHeader = ({
  number,
  kicker,
  title,
}: {
  number: number;
  kicker: string;
  title: string;
}) => (
  <div className="mb-[34px]">
    <div className="mb-[14px] text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
      {String(number).padStart(2, '0')} - {kicker}
    </div>
    <h2 className="m-0 text-[clamp(26px,3.6vw,46px)] font-black tracking-[-.03em]">{title}</h2>
  </div>
);

const HomePage = () => {
  const { t, localize } = useTranslation();
  const { home, projects, journey } = useLoaderData() as {
    home: HomeContent;
    projects: Project[];
    journey: JourneyEntry[];
  };

  const selection = selectFeatured(projects);
  const tech = topTechnologies(projects, TECH_COUNT);
  const others = projects.length - selection.length;

  const sections: Array<{ kicker: string; title: string; body: ReactNode }> = [
    {
      kicker: localize(home?.selectionKicker) || t.selection,
      title: localize(home?.indexTitle) || t.indexTitle,
      body: (
        <>
          <div
            className="grid gap-[2px]"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
          >
            {selection.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
            <span className="text-[14.5px] text-muted">
              {others > 0 ? `${others} ${t.otherProjectsCount}` : ''}
            </span>
            <ActionLink to={paths.work} variant="outline">
              {t.seeOtherProjects}
            </ActionLink>
          </div>
        </>
      ),
    },
    ...(home?.showStack !== false && tech.length > 0
      ? [
          {
            kicker: t.stack,
            title: localize(home?.stackTitle) || t.stackTitle,
            body: <TechBand items={tech} />,
          },
        ]
      : []),
    ...(home?.showJourney !== false && journey.length > 0
      ? [
          {
            kicker: t.pathKicker,
            title: localize(home?.journeyTitle) || t.journeyTitle,
            body: <JourneyPreview entries={journey} />,
          },
        ]
      : []),
  ];

  return (
    <>
      <HeroStage chapters={home?.chapters ?? []} />
      <MarqueeBand items={home?.marquee ?? []} />

      {sections.map((section, index) => (
        <section
          key={section.kicker}
          className={`mx-auto max-w-shell px-6 pt-[84px] ${
            index === sections.length - 1 ? 'pb-[84px]' : ''
          }`}
        >
          <SectionHeader number={index + 1} kicker={section.kicker} title={section.title} />
          {section.body}
        </section>
      ))}

      <ClosingBanner title={home?.closingTitle} cta={home?.closingCta} />
    </>
  );
};

export default HomePage;
