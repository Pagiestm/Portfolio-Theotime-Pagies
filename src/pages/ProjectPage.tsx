import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/common/Reveal';
import MetaGrid from '../components/common/MetaGrid';
import ActionLink from '../components/common/ActionLink';
import StackBadges from '../features/work/components/StackBadges';
import ProjectGallery from '../features/work/components/ProjectGallery';
import NotFoundPage from './NotFoundPage';
import { getProjectById, projects } from '../features/work/data/projects';
import { useTranslation } from '../i18n/useTranslation';
import { paths } from '../routes/paths';

const ProjectPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const project = getProjectById(slug);

  if (!project) return <NotFoundPage />;

  const index = projects.findIndex((p) => p.id === project.id);
  const next = projects[(index + 1) % projects.length];

  // Pas d'« envergure » ici non plus : la page projet ne hiérarchise pas les
  // réalisations, comme l'index.
  const meta = [
    { label: t.metaRole, value: project.kicker },
    { label: t.metaPeriod, value: project.period || project.year || '—' },
    { label: t.metaStack, value: project.stack.join(', ') || '—' },
  ];

  return (
    <section className="mx-auto max-w-shell px-6 pb-[86px] pt-9">
      <Link
        to={paths.work}
        className="mb-8 inline-block py-2 text-[12.5px] font-bold uppercase tracking-[.1em] text-muted hover:text-ink"
      >
        ← {t.backToWork}
      </Link>

      <div className="mb-4 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
        {project.kicker}
      </div>
      <h1 className="m-0 mb-6 max-w-[20ch] text-[clamp(36px,6vw,74px)] font-black leading-none tracking-[-.035em]">
        {project.title}
      </h1>
      <p className="m-0 mb-11 max-w-[62ch] text-[19px] text-muted">{project.summary}</p>

      {/* object-contain : ce sont des captures d'écran, les recadrer les rend illisibles. */}
      <div
        className="mb-[2px] flex items-center justify-center border-2 border-line bg-surface-2"
        style={{ height: 'clamp(230px,40vh,440px)' }}
      >
        <img
          src={project.cover}
          alt={project.title}
          className="block h-full w-full object-contain"
        />
      </div>

      <MetaGrid items={meta} tone="boxed" className="mb-[52px]" />

      <div
        className="grid gap-[52px]"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          perspective: '1600px',
        }}
      >
        <Reveal variant="left">
          <h2 className="m-0 mb-5 border-b-2 border-line pb-[14px] text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
            {t.aboutProject}
          </h2>
          {/* Contenu rédigé par l'auteur du portfolio, stocké en HTML dans les JSON projets. */}
          <div className="project-prose" dangerouslySetInnerHTML={{ __html: project.content }} />
        </Reveal>

        <Reveal variant="right">
          <h2 className="m-0 mb-5 border-b-2 border-line pb-[14px] text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
            {t.stack}
          </h2>
          <StackBadges iconKeys={project.iconKeys} stack={project.stack} />

          {project.links.length > 0 && (
            <>
              <h2 className="m-0 mb-5 mt-11 border-b-2 border-line pb-[14px] text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
                {t.links}
              </h2>
              <div className="flex flex-wrap gap-[2px]">
                {project.links.map((link) => (
                  <ActionLink
                    key={link.labelKey}
                    href={link.href}
                    variant="outline"
                    className="text-[12px]"
                  >
                    {t[link.labelKey]}
                  </ActionLink>
                ))}
              </div>
            </>
          )}
        </Reveal>
      </div>

      {project.images.length > 0 && (
        <div className="mt-[60px]">
          <h2 className="m-0 mb-5 border-b-2 border-line pb-[14px] text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
            {t.gallery}
          </h2>
          <ProjectGallery images={project.images} title={project.title} />
        </div>
      )}

      <div className="mt-[60px] flex flex-wrap items-center justify-between gap-[14px] border-t-2 border-line pt-[34px]">
        <div className="text-[14.5px] text-muted">{t.nextProject}</div>
        <Link
          to={paths.project(next.id)}
          className="border-b-2 border-accent pb-1 text-[clamp(20px,2.8vw,30px)] font-extrabold tracking-[-.02em] text-ink hover:text-accent-2"
        >
          {next.title} →
        </Link>
      </div>
    </section>
  );
};

export default ProjectPage;
