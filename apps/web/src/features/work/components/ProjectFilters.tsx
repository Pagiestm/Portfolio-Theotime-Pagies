import { ElementType, useMemo, useState } from 'react';
import { TECH } from '../../../constants/tech';
import { useTranslation } from '../../../i18n/useTranslation';

interface ProjectFiltersProps {
  query: string;
  onQueryChange: (v: string) => void;
  selectedTech: string[];
  onToggleTech: (t: string) => void;
  onReset: () => void;
  isFiltering: boolean;
  /** Technologies proposees, du plus utilise au moins utilise. */
  availableTech: string[];
}

/** Nombre de technos affichées par défaut, avant « Voir tout ». */
const PRIMARY_COUNT = 8;

const labelToIcon: Record<string, ElementType> = Object.fromEntries(
  Object.values(TECH).map(({ label, Icon }) => [label, Icon])
);

const ProjectFilters = ({
  query,
  onQueryChange,
  selectedTech,
  onToggleTech,
  onReset,
  isFiltering,
  availableTech,
}: ProjectFiltersProps) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const activeCount = selectedTech.length;
  const hasMore = availableTech.length > PRIMARY_COUNT;

  // On garde toujours les technos sélectionnées visibles, même hors du top.
  const visibleTech = useMemo(() => {
    if (showAll) return availableTech;
    const primary = availableTech.slice(0, PRIMARY_COUNT);
    const selectedOutside = selectedTech.filter((tech) => !primary.includes(tech));
    return [...primary, ...selectedOutside];
  }, [availableTech, showAll, selectedTech]);

  return (
    <div className="mb-9">
      {/* Barre de recherche */}
      <label htmlFor="project-search" className="sr-only">
        {t.searchLabel}
      </label>
      <input
        id="project-search"
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="mb-5 w-full border-2 border-line bg-surface-2 px-4 py-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
      />

      {/* En-tête du panneau filtre */}
      <div className="mb-3 flex items-center justify-between gap-3 border-t-2 border-line pt-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[.18em] text-muted">
            {t.stack}
          </span>
          {activeCount > 0 && (
            <span className="flex h-[18px] min-w-[18px] items-center justify-center bg-accent px-[5px] text-[10px] font-extrabold text-ink">
              {activeCount}
            </span>
          )}
        </div>

        {isFiltering && (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer text-[11px] font-bold uppercase tracking-[.1em] text-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            {t.reset}
          </button>
        )}
      </div>

      {/* Grille des technos principales (top usage) + technos actives éventuelles */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visibleTech.map((tech) => {
          const active = selectedTech.includes(tech);
          const Icon = labelToIcon[tech];
          return (
            <button
              key={tech}
              type="button"
              onClick={() => onToggleTech(tech)}
              aria-pressed={active}
              className={`flex cursor-pointer items-center gap-2 border-2 px-3 py-[9px] text-[11.5px] font-bold transition-all duration-150 ${
                active
                  ? 'border-accent bg-accent/10 text-ink'
                  : 'border-line text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {Icon && <Icon size={13} className="flex-none" />}
              <span className="truncate">{tech}</span>
              {active && <span className="ml-auto h-[6px] w-[6px] flex-none bg-accent" />}
            </button>
          );
        })}
      </div>

      {/* Bascule voir tout / voir moins */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 cursor-pointer text-[11px] font-bold uppercase tracking-[.1em] text-accent-2 transition-colors hover:text-ink"
        >
          {showAll ? t.filterShowLess : `${t.filterShowAll} (${availableTech.length})`}
        </button>
      )}
    </div>
  );
};

export default ProjectFilters;
