import { useCallback, useMemo, useState } from 'react';
import { PROJECT_CATEGORIES, PROJECT_KINDS, TEAM_MODES } from '@portfolio/shared';
import type { ProjectCategory, ProjectKind, TeamMode } from '@portfolio/shared';
import type { Project } from '../../../services/sanity/types';

export type FilterOption<T extends string> = { value: T; count: number };

const toggleIn = <T>(list: T[], item: T) =>
  list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];

const labelsOf = (project: Project) => (project.stack ?? []).map((tech) => tech?.label ?? '');

/**
 * Les valeurs présentes dans au moins un projet, dans l'ordre du registre
 * partagé, avec leur effectif. Une valeur que personne ne porte n'est pas
 * proposée : une case qui ne filtre rien n'est que du bruit.
 */
const optionsOf = <T extends string>(
  order: readonly T[],
  valuesOf: (project: Project) => T[],
  projects: Project[]
): FilterOption<T>[] => {
  const counts = new Map<T, number>();
  projects.forEach((project) =>
    valuesOf(project).forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  );
  return order
    .filter((value) => counts.has(value))
    .map((value) => ({ value, count: counts.get(value)! }));
};

const techOptionsOf = (projects: Project[]): FilterOption<string>[] => {
  const frequency = new Map<string, number>();
  projects.forEach((project) =>
    labelsOf(project).forEach((label) => {
      if (label) frequency.set(label, (frequency.get(label) ?? 0) + 1);
    })
  );
  return [...frequency.entries()]
    .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b, 'fr'))
    .map(([value, count]) => ({ value, count }));
};

/**
 * Recherche plein texte et filtres combinés de la page Réalisations.
 *
 * Entre familles, les filtres se cumulent (ET) : « scolaire » et « mobile »
 * donne les projets scolaires mobiles. Dans une même famille, ils s'ajoutent
 * (OU) : « web » et « API » donne les projets qui sont l'un ou l'autre.
 *
 * Les projets sont passés en argument plutôt qu'importés : ils viennent du
 * chargeur de route, et le hook reste testable sans réseau.
 */
export const useProjectFilters = (projects: Project[] = []) => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [kinds, setKinds] = useState<ProjectKind[]>([]);
  // Solo ou équipe s'excluent : un seul choix, `null` pour « tous ».
  const [team, setTeam] = useState<TeamMode | null>(null);
  const [tech, setTech] = useState<string[]>([]);

  const toggleCategory = useCallback(
    (value: ProjectCategory) => setCategories((current) => toggleIn(current, value)),
    []
  );
  const toggleKind = useCallback(
    (value: ProjectKind) => setKinds((current) => toggleIn(current, value)),
    []
  );
  const toggleTech = useCallback(
    (value: string) => setTech((current) => toggleIn(current, value)),
    []
  );

  const reset = useCallback(() => {
    setQuery('');
    setCategories([]);
    setKinds([]);
    setTeam(null);
    setTech([]);
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter((project) => {
      const labels = labelsOf(project);

      const matchesCategory = categories.length === 0 || categories.includes(project.category);
      const matchesKind =
        kinds.length === 0 || (project.kinds ?? []).some((kind) => kinds.includes(kind));
      const matchesTeam = team === null || project.team === team;
      const matchesTech = tech.length === 0 || tech.some((label) => labels.includes(label));

      const matchesQuery =
        needle === '' ||
        project.title.toLowerCase().includes(needle) ||
        (project.summary?.fr ?? '').toLowerCase().includes(needle) ||
        (project.summary?.en ?? '').toLowerCase().includes(needle) ||
        labels.some((label) => label.toLowerCase().includes(needle));

      return matchesCategory && matchesKind && matchesTeam && matchesTech && matchesQuery;
    });
  }, [projects, query, categories, kinds, team, tech]);

  const available = useMemo(
    () => ({
      categories: optionsOf(PROJECT_CATEGORIES, (project) => [project.category], projects),
      kinds: optionsOf(PROJECT_KINDS, (project) => project.kinds ?? [], projects),
      teams: optionsOf(TEAM_MODES, (project) => (project.team ? [project.team] : []), projects),
      tech: techOptionsOf(projects),
    }),
    [projects]
  );

  const activeCount = categories.length + kinds.length + (team ? 1 : 0) + tech.length;

  return {
    query,
    setQuery,
    categories,
    toggleCategory,
    kinds,
    toggleKind,
    team,
    setTeam,
    tech,
    toggleTech,
    reset,
    filtered,
    total: projects.length,
    available,
    activeCount,
    isFiltering: query.trim() !== '' || activeCount > 0,
  };
};

export type ProjectFiltersState = ReturnType<typeof useProjectFilters>;
