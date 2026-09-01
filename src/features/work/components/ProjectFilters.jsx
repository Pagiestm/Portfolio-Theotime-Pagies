import { availableTech } from '../data/projects';
import { useTranslation } from '../../../i18n/useTranslation';

/**
 * Recherche + filtre multi-technologies, dans le langage plat du design system :
 * bordures 2px, aucun arrondi, carré accent pour marquer un filtre actif.
 */
const ProjectFilters = ({ query, onQueryChange, selectedTech, onToggleTech, onReset, isFiltering }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-9">
      <label htmlFor="project-search" className="sr-only">
        {t.searchLabel}
      </label>
      <input
        id="project-search"
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="mb-6 w-full border-2 border-line bg-surface-2 px-4 py-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
      />

      <div className="flex flex-wrap gap-2">
        {availableTech.map((tech) => {
          const active = selectedTech.includes(tech);
          return (
            <button
              key={tech}
              type="button"
              onClick={() => onToggleTech(tech)}
              aria-pressed={active}
              className={`cursor-pointer border-2 px-[15px] py-[9px] text-[12px] font-bold uppercase tracking-[.08em] transition-all duration-150 ${
                active ? 'border-accent text-ink' : 'border-line text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {active && <span className="mr-2 inline-block h-[7px] w-[7px] bg-accent align-middle" />}
              <span>{tech}</span>
            </button>
          );
        })}

        {isFiltering && (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer border-2 border-transparent px-[15px] py-[9px] text-[12px] font-bold uppercase tracking-[.08em] text-accent-2 underline underline-offset-4 hover:text-ink"
          >
            {t.reset}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectFilters;
