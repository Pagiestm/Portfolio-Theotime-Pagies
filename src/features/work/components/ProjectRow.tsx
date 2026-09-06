import { Link } from 'react-router-dom';
import Reveal from '../../../components/common/Reveal';
import { useTranslation } from '../../../i18n/useTranslation';
import { paths } from '../../../routes/paths';
import type { Project } from '../../../lib/sanity/types';

/**
 * Une ligne de l'index des réalisations : titre pleine largeur, résumé,
 * pile technique à droite. Toute la ligne est cliquable.
 */
const ProjectRow = ({ project, index }: { project: Project; index: number }) => {
  const { localize } = useTranslation();

  return (
    <Reveal variant="tilt">
      <Link
        to={paths.project(project.id)}
        className="group grid w-full items-center gap-[22px] border-b-2 border-line px-2 py-7 text-left text-ink transition-all duration-200 hover:bg-surface hover:pl-5 hover:text-ink"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}
      >
        <div className="min-w-0">
          <div className="mb-[10px] flex items-center gap-[10px]">
            <span className="text-[11px] uppercase tracking-[.16em] text-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[11px] uppercase tracking-[.16em] text-accent-2">
              {localize(project.kicker)}
            </span>
          </div>
          <h3 className="m-0 text-[clamp(22px,2.8vw,32px)] font-extrabold tracking-[-.025em]">
            {project.title}
          </h3>
          {project.period && (
            <div className="mt-2 text-[11px] uppercase tracking-[.16em] text-muted">
              {localize(project.period)}
            </div>
          )}
        </div>

        <p className="m-0 line-clamp-4 text-[15px] text-muted">{localize(project.summary)}</p>

        <div className="flex flex-wrap items-center justify-end gap-[6px]">
          {(project.stack ?? []).map((tech) => (
            <span
              key={tech.label}
              className="border border-line px-[9px] py-[5px] text-[11px] font-semibold uppercase tracking-[.08em] text-muted"
            >
              {tech.label}
            </span>
          ))}
          <span className="ml-3 text-[20px] text-accent transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </Reveal>
  );
};

export default ProjectRow;
