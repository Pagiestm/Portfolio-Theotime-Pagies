import { useCallback, useMemo, useState } from 'react';
import { projects } from '../data/projects';

/**
 * Recherche plein texte + filtre multi-technologies sur les projets.
 * Reprend la logique qui vivait dans SectionPortfolio.jsx, isolée du rendu.
 */
export const useProjectFilters = () => {
  const [query, setQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);

  const toggleTech = useCallback((tech) => {
    setSelectedTech((current) =>
      current.includes(tech) ? current.filter((item) => item !== tech) : [...current, tech]
    );
  }, []);

  const reset = useCallback(() => {
    setQuery('');
    setSelectedTech([]);
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesTech =
        selectedTech.length === 0 || selectedTech.some((tech) => project.stack.includes(tech));

      const matchesQuery =
        needle === '' ||
        project.title.toLowerCase().includes(needle) ||
        project.summary.toLowerCase().includes(needle) ||
        project.stack.some((tech) => tech.toLowerCase().includes(needle));

      return matchesTech && matchesQuery;
    });
  }, [query, selectedTech]);

  return {
    query,
    setQuery,
    selectedTech,
    toggleTech,
    reset,
    filtered,
    isFiltering: query.trim() !== '' || selectedTech.length > 0,
  };
};
