import { Link, useLoaderData } from 'react-router-dom';
import Reveal from '../components/common/Reveal';
import MetaGrid from '../components/common/MetaGrid';
import ActionLink from '../components/common/ActionLink';
import StackBadges from '../features/work/components/StackBadges';
import ProjectGallery from '../features/work/components/ProjectGallery';
import ProjectContent from '../features/work/components/ProjectContent';
import { useTranslation } from '../i18n/useTranslation';
import { imageUrl } from '../lib/sanity/image';
import { paths } from '../routes/paths';
import type { Project } from '../lib/sanity/types';

/** Liens externes du projet, dans l'ordre d'affichage. */
const LINKS = [
  ['pdf', 'linkPdf'],
  ['api', 'linkApi'],
  ['figma', 'linkFigma'],
  ['github', 'linkGithub'],
  ['site', 'linkSite'],
] as const;

const ProjectPage = () => {
  const { t, localize } = useTranslation();
  const { project, siblings } = useLoaderData() as {
    project: Project;
    siblings: Array<{ id: string; title: string }>;
  };

  const index = siblings.findIndex((p) => p.id === project.id);
  const next = siblings[(index + 1) % siblings.length] ?? project;

  // Pas d'« envergure » ici : la page projet ne hiérarchise pas les
  // réalisations, comme l'index.
  const meta = [
    { label: t.metaRole, value: localize(project.kicker) },
    { label: t.metaPeriod, value: localize(project.period) || '—' },
    {
      label: t.metaStack,
      value: (project.stack ?? []).map((tech) => tech.label).join(', ') || '—',
    },
  ];

  const links = LINKS.map(([field, labelKey]) => {
    const href = field === 'pdf' ? project.links?.pdfUrl : project.links?.[field];
    return href ? { href, labelKey } : null;
  }).filter(Boolean) as Array<{ href: string; labelKey: string }>;

  const cover = imageUrl(project.cover ?? undefined, 1600);
  const content = localize(project.content);

  return (
    <section className="mx-auto max-w-shell px-6 pb-[86px] pt-9">
      <Link
        to={paths.work}
        className="mb-8 inline-block py-2 text-[12.5px] font-bold uppercase tracking-[.1em] text-muted hover:text-ink"
      >
        ← {t.backToWork}
      </Link>

      <div className="mb-4 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
        {localize(project.kicker)}
      </div>
      <h1 className="m-0 mb-6 max-w-[20ch] text-[clamp(36px,6vw,74px)] font-black leading-none tracking-[-.035em]">
        {project.title}
      </h1>
      <p className="m-0 mb-11 max-w-[62ch] text-[19px] text-muted">{localize(project.summary)}</p>

      {/* object-contain : ce sont des captures d'écran, les recadrer les rend illisibles. */}
      {cover && (
        <div
          className="mb-[2px] flex items-center justify-center border-2 border-line bg-surface-2"
          style={{ height: 'clamp(230px,40vh,440px)' }}
        >
          <img src={cover} alt={project.title} className="block h-full w-full object-contain" />
        </div>
      )}

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
          <ProjectContent blocks={content} />
        </Reveal>

        <Reveal variant="right">
          <h2 className="m-0 mb-5 border-b-2 border-line pb-[14px] text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
            {t.stack}
          </h2>
          <StackBadges stack={project.stack} />

          {links.length > 0 && (
            <>
              <h2 className="m-0 mb-5 mt-11 border-b-2 border-line pb-[14px] text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
                {t.links}
              </h2>
              <div className="flex flex-wrap gap-[2px]">
                {links.map((link) => (
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

      {(project.gallery?.length ?? 0) > 0 && (
        <div className="mt-[60px]">
          <h2 className="m-0 mb-5 border-b-2 border-line pb-[14px] text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
            {t.gallery}
          </h2>
          <ProjectGallery images={project.gallery} title={project.title} />
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
