import type { Project, Technology } from '../services/sanity/types';

export type TechnologyUsage = Technology & { count: number };

export const topTechnologies = (projects: Project[], limit: number): TechnologyUsage[] => {
  const usage = new Map<string, TechnologyUsage>();

  projects.forEach((project) =>
    (project.stack ?? []).forEach((tech) => {
      if (!tech?.label) return;
      const current = usage.get(tech.label);
      if (current) current.count += 1;
      else usage.set(tech.label, { ...tech, count: 1 });
    })
  );

  return [...usage.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'fr'))
    .slice(0, limit);
};
