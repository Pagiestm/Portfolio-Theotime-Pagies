import { Link } from 'react-router-dom';
import Reveal from '../../../components/common/Reveal';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import { useTranslation } from '../../../i18n/useTranslation';
import { paths } from '../../../routes/paths';
import { thumbSrcSet, thumbUrl } from '../../../services/sanity/image';
import type { Project } from '../../../services/sanity/types';
import ProjectCover from './ProjectCover';

const ProjectRow = ({ project, index }: { project: Project; index: number }) => {
  const { t, localize } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const cover = project.cover ?? undefined;

  return (
    <Reveal variant="tilt">
      <Link
        to={paths.project(project.id)}
        className="group flex w-full flex-col gap-[22px] border-b-2 border-line px-2 py-7 text-left text-ink transition-all duration-200 hover:bg-surface hover:pl-5 hover:text-ink sm:flex-row sm:items-start"
      >
        <ProjectCover
          src={thumbUrl(cover)}
          srcSet={thumbSrcSet(cover)}
          sizes="(max-width: 640px) 100vw, 210px"
          title={project.title}
          alt={cover?.alt}
          fit="cover"
          imageClassName={
            reduced ? '' : 'transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]'
          }
          className="h-[150px] w-full flex-none border-2 border-line transition-colors duration-200 group-hover:border-accent sm:h-[128px] sm:w-[205px]"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-[10px] flex flex-wrap items-center gap-x-[10px] gap-y-1 text-[11px] uppercase tracking-[.16em]">
            <span className="text-muted">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-accent-2">{t.category[project.category]}</span>
            {(project.kinds ?? []).map((kind) => (
              <span key={kind} className="text-muted">
                · {t.kind[kind]}
              </span>
            ))}
          </div>

          <h3 className="m-0 text-[clamp(22px,2.8vw,32px)] font-extrabold tracking-[-.025em]">
            {project.title}
          </h3>

          {project.period && (
            <div className="mt-2 text-[11px] uppercase tracking-[.16em] text-muted">
              {localize(project.period)}
            </div>
          )}

          <p className="m-0 mt-3 line-clamp-3 max-w-[78ch] text-[15px] text-muted">
            {localize(project.summary)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-[5px]">
            {(project.stack ?? []).map((tech) => (
              <span
                key={tech.label}
                className="border border-line px-[7px] py-[3px] text-[10px] font-semibold uppercase tracking-[.07em] text-muted"
              >
                {tech.label}
              </span>
            ))}
            <span className="ml-auto pl-3 text-[20px] text-accent transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
};

export default ProjectRow;
