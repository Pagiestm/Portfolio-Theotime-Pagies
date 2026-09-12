import { Link } from 'react-router-dom';
import Reveal from '../../../components/common/Reveal';
import { useTranslation } from '../../../i18n/useTranslation';
import { imageUrl } from '../../../services/sanity/image';
import { paths } from '../../../routes/paths';
import type { Project } from '../../../services/sanity/types';

const STACK_PREVIEW = 4;

const ProjectCard = ({ project, index = 0 }: { project: Project; index?: number }) => {
  const { t, localize } = useTranslation();
  const cover = imageUrl(project.cover ?? undefined, 900);
  const stack = project.stack ?? [];
  const hidden = stack.length - STACK_PREVIEW;

  return (
    <Reveal variant={index % 2 === 0 ? 'left' : 'right'}>
      <Link
        to={paths.project(project.id)}
        className="group flex h-full flex-col border-2 border-line bg-surface text-ink transition-colors duration-200 hover:border-accent hover:text-ink"
      >
        {/* object-contain : ce sont des captures d'écran, les recadrer les rend illisibles. */}
        <div className="flex h-[220px] items-center justify-center border-b-2 border-line bg-surface-2 p-4">
          {cover && (
            <img
              src={cover}
              alt={project.title}
              loading="lazy"
              className="block h-full w-full object-contain"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[.16em]">
            <span className="text-accent-2">{t.category[project.category]}</span>
            {(project.kinds ?? []).map((kind) => (
              <span key={kind} className="text-muted">
                {t.kind[kind]}
              </span>
            ))}
          </div>
          <h3 className="m-0 mb-3 text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.05] tracking-[-.025em]">
            {project.title}
          </h3>
          <p className="m-0 line-clamp-3 text-[15px] text-muted">{localize(project.summary)}</p>

          <div className="mt-auto flex flex-wrap items-center gap-[6px] pt-5">
            {stack.slice(0, STACK_PREVIEW).map((tech) => (
              <span
                key={tech.label}
                className="border border-line px-[9px] py-[5px] text-[11px] font-semibold uppercase tracking-[.08em] text-muted"
              >
                {tech.label}
              </span>
            ))}
            {hidden > 0 && (
              <span className="px-1 text-[11px] font-semibold text-muted">+{hidden}</span>
            )}
            <span className="ml-auto text-[20px] text-accent transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
};

export default ProjectCard;
