import { useCallback, useMemo, useState } from 'react';
import type { Project } from '../../../lib/sanity/types';

/**
 * Recherche plein texte + filtre multi-technologies.
 *
 * Les projets sont passés en argument plutôt qu'importés : ils viennent
 * désormais du chargeur de route, et le hook reste testable sans réseau.
 */
export const useProjectFilters = (projects: Project[] = []) => {
  const [query, setQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const toggleTech = useCallback((tech: string) => {
    setSelectedTech((current) =>
      current.includes(tech) ? current.filter((item) => item !== tech) : [...current, tech]
    );
  }, []);

  const reset = useCallback(() => {
    setQuery('');
    setSelectedTech([]);
  }, []);

  const labelsOf = (project: Project) => (project.stack ?? []).map((tech) => tech?.label ?? '');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter((project) => {
      const labels = labelsOf(project);

      const matchesTech =
        selectedTech.length === 0 || selectedTech.some((tech) => labels.includes(tech));

      const matchesQuery =
        needle === '' ||
        project.title.toLowerCase().includes(needle) ||
        (project.summary?.fr ?? '').toLowerCase().includes(needle) ||
        (project.summary?.en ?? '').toLowerCase().includes(needle) ||
        labels.some((label) => label.toLowerCase().includes(needle));

      return matchesTech && matchesQuery;
    });
  }, [projects, query, selectedTech]);

  /**
   * Technologies présentes dans au moins un projet, des plus utilisées aux
   * moins utilisées : les filtres les plus pertinents arrivent en premier.
   */
  const availableTech = useMemo(() => {
    const frequency = new Map<string, number>();
    projects.forEach((project) =>
      labelsOf(project).forEach((label) => {
        if (label) frequency.set(label, (frequency.get(label) ?? 0) + 1);
      })
    );
    return [...frequency.keys()].sort(
      (a, b) => frequency.get(b)! - frequency.get(a)! || a.localeCompare(b, 'fr')
    );
  }, [projects]);

  return {
    query,
    setQuery,
    selectedTech,
    toggleTech,
    reset,
    filtered,
    availableTech,
    isFiltering: query.trim() !== '' || selectedTech.length > 0,
  };
};
