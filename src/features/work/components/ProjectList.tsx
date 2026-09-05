import ProjectRow from './ProjectRow';
import ActionLink from '../../../components/common/ActionLink';
import { usePagination } from '../hooks/usePagination';
import { useTranslation } from '../../../i18n/useTranslation';

/**
 * La liste unique des réalisations, du plus récent au plus ancien,
 * dévoilée par paliers via « Voir plus ».
 */
const ProjectList = ({ projects, step = 6 }) => {
  const { t } = useTranslation();
  const { items, hasMore, showMore } = usePagination(projects, step);

  if (projects.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="m-0 text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
          {t.allProjects}
        </h2>
        <span className="text-[11px] uppercase tracking-[.16em] text-muted">
          {items.length} / {projects.length}
        </span>
      </div>

      <div className="border-t-2 border-line">
        {items.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-7">
          <ActionLink variant="outline" onClick={showMore}>
            {t.showMore}
          </ActionLink>
        </div>
      )}
    </section>
  );
};

export default ProjectList;
