import { useTranslation } from '../../../i18n/useTranslation';
import type { ProjectFiltersState } from '../hooks/useProjectFilters';

/**
 * La barre au-dessus des résultats quand un filtre est actif : le nombre de
 * projets trouvés, chaque filtre appliqué en puce retirable d'un clic, et
 * « Réinitialiser » pour tout effacer. Le visiteur voit ce qu'il a demandé
 * sans avoir à relire le panneau.
 */
const AppliedFilters = ({ filters }: { filters: ProjectFiltersState }) => {
  const { t } = useTranslation();
  const count = filters.filtered.length;
  const query = filters.query.trim();

  const chips = [
    ...filters.categories.map((value) => ({
      key: `category-${value}`,
      label: t.category[value],
      remove: () => filters.toggleCategory(value),
    })),
    ...filters.kinds.map((value) => ({
      key: `kind-${value}`,
      label: t.kind[value],
      remove: () => filters.toggleKind(value),
    })),
    ...(filters.team
      ? [{ key: 'team', label: t.team[filters.team], remove: () => filters.setTeam(null) }]
      : []),
    ...filters.tech.map((value) => ({
      key: `tech-${value}`,
      label: value,
      remove: () => filters.toggleTech(value),
    })),
    ...(query ? [{ key: 'query', label: `“${query}”`, remove: () => filters.setQuery('') }] : []),
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 border-b-2 border-line pb-4">
      <span aria-live="polite" className="mr-2 text-[13.5px] font-bold text-ink">
        {count} {count === 1 ? t.projectOne : t.projectMany}
      </span>

      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          aria-label={`${t.removeFilter} : ${chip.label}`}
          className="flex cursor-pointer items-center gap-2 border-2 border-accent bg-accent/10 px-3 py-[6px] text-[11.5px] font-bold uppercase tracking-[.06em] text-ink transition-colors hover:border-accent-2 hover:text-accent-2"
        >
          {chip.label}
          <span aria-hidden className="text-[14px] leading-none">
            ×
          </span>
        </button>
      ))}

      <button
        type="button"
        onClick={filters.reset}
        className="ml-1 cursor-pointer text-[11px] font-bold uppercase tracking-[.1em] text-muted underline underline-offset-4 transition-colors hover:text-ink"
      >
        {t.reset}
      </button>
    </div>
  );
};

export default AppliedFilters;
