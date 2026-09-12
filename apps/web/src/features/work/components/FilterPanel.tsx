import { ElementType, ReactNode, useMemo, useState } from 'react';
import { TECH } from '../../../constants/tech';
import { useTranslation } from '../../../i18n/useTranslation';
import type { FilterOption, ProjectFiltersState } from '../hooks/useProjectFilters';

const PRIMARY_TECH_COUNT = 8;

const labelToIcon: Record<string, ElementType> = Object.fromEntries(
  Object.values(TECH).map(({ label, Icon }) => [label, Icon])
);

/**
 * Une facette : un titre et une colonne d'options.
 * Une facette à option unique ne filtre rien : elle n'est pas rendue.
 */
const Facet = ({
  id,
  title,
  optionCount,
  children,
}: {
  id: string;
  title: string;
  optionCount: number;
  children: ReactNode;
}) => {
  if (optionCount < 2) return null;
  return (
    <section aria-labelledby={id} className="border-t-2 border-line pt-4">
      <h3 id={id} className="m-0 mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-muted">
        {title}
      </h3>
      <div className="flex flex-col">{children}</div>
    </section>
  );
};

interface OptionProps {
  type: 'checkbox' | 'radio';
  name?: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
  Icon?: ElementType;
}

/**
 * Une ligne d'option : vraie case ou vrai bouton radio pour le clavier et les
 * lecteurs d'écran, masqués au profit d'un carré dessiné à la règle du design.
 * Case pour les choix cumulables, radio pour les choix exclusifs.
 */
const Option = ({ type, name, label, count, checked, onChange, Icon }: OptionProps) => (
  <label className="-mx-2 flex cursor-pointer items-center gap-3 px-2 py-[7px] transition-colors hover:bg-surface">
    <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
    <span
      aria-hidden
      className={`flex h-[16px] w-[16px] flex-none items-center justify-center border-2 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-2 ${
        checked ? 'border-accent bg-accent' : 'border-line'
      }`}
    >
      {checked && <span className="h-[6px] w-[6px] bg-surface-2" />}
    </span>
    {Icon && <Icon size={13} className="flex-none text-muted" />}
    <span className={`flex-1 truncate text-[13.5px] ${checked ? 'text-ink' : 'text-muted'}`}>
      {label}
    </span>
    {count !== undefined && <span className="text-[11px] tabular-nums text-muted">{count}</span>}
  </label>
);

const FilterPanel = ({ filters }: { filters: ProjectFiltersState }) => {
  const { t } = useTranslation();
  const [showAllTech, setShowAllTech] = useState(false);
  const { available } = filters;
  const hasMoreTech = available.tech.length > PRIMARY_TECH_COUNT;

  // Les technos cochées restent visibles même si elles sortent du top.
  const visibleTech = useMemo<FilterOption<string>[]>(() => {
    if (showAllTech) return available.tech;
    const primary = available.tech.slice(0, PRIMARY_TECH_COUNT);
    const selectedOutside = available.tech.filter(
      (option) => filters.tech.includes(option.value) && !primary.includes(option)
    );
    return [...primary, ...selectedOutside];
  }, [available.tech, showAllTech, filters.tech]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="project-search" className="sr-only">
          {t.searchLabel}
        </label>
        <input
          id="project-search"
          type="search"
          value={filters.query}
          onChange={(e) => filters.setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full border-2 border-line bg-surface-2 px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
      </div>

      <Facet id="facet-category" title={t.filterCategory} optionCount={available.categories.length}>
        {available.categories.map(({ value, count }) => (
          <Option
            key={value}
            type="checkbox"
            label={t.category[value]}
            count={count}
            checked={filters.categories.includes(value)}
            onChange={() => filters.toggleCategory(value)}
          />
        ))}
      </Facet>

      <Facet id="facet-kind" title={t.filterKind} optionCount={available.kinds.length}>
        {available.kinds.map(({ value, count }) => (
          <Option
            key={value}
            type="checkbox"
            label={t.kind[value]}
            count={count}
            checked={filters.kinds.includes(value)}
            onChange={() => filters.toggleKind(value)}
          />
        ))}
      </Facet>

      <Facet id="facet-team" title={t.filterTeam} optionCount={available.teams.length}>
        <Option
          type="radio"
          name="team"
          label={t.allOption}
          count={filters.total}
          checked={filters.team === null}
          onChange={() => filters.setTeam(null)}
        />
        {available.teams.map(({ value, count }) => (
          <Option
            key={value}
            type="radio"
            name="team"
            label={t.team[value]}
            count={count}
            checked={filters.team === value}
            onChange={() => filters.setTeam(value)}
          />
        ))}
      </Facet>

      <Facet id="facet-tech" title={t.stack} optionCount={available.tech.length}>
        {visibleTech.map(({ value, count }) => (
          <Option
            key={value}
            type="checkbox"
            label={value}
            count={count}
            Icon={labelToIcon[value]}
            checked={filters.tech.includes(value)}
            onChange={() => filters.toggleTech(value)}
          />
        ))}
        {hasMoreTech && (
          <button
            type="button"
            onClick={() => setShowAllTech((s) => !s)}
            className="mt-2 cursor-pointer self-start text-[11px] font-bold uppercase tracking-[.1em] text-accent-2 transition-colors hover:text-ink"
          >
            {showAllTech ? t.filterShowLess : `${t.filterShowAll} (${available.tech.length})`}
          </button>
        )}
      </Facet>
    </div>
  );
};

export default FilterPanel;
