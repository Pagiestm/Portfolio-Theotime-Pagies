import { TECH } from '../../../constants/tech';
import type { Technology } from '../../../lib/sanity/types';

/**
 * Les technologies d'un projet, icône + libellé, encadrées à la Modernist.
 *
 * L'icône vient du registre local via `iconKey` ; une clé inconnue — une
 * technologie ajoutée dans le Studio sans logo correspondant — affiche
 * simplement le libellé, sans casser la mise en page.
 */
const StackBadges = ({ stack }: { stack?: Technology[] | null }) => {
  if (!stack?.length) return null;

  return (
    <div className="flex flex-wrap gap-[2px]">
      {stack.map((tech) => {
        const Icon = tech.iconKey ? TECH[tech.iconKey as keyof typeof TECH]?.Icon : undefined;
        return (
          <span
            key={tech.label}
            className="flex items-center gap-[10px] border border-line px-3 py-[10px] text-[12px] font-semibold uppercase tracking-[.08em] text-muted"
          >
            {Icon && <Icon className="text-[18px] text-accent-2" aria-hidden="true" />}
            {tech.label}
          </span>
        );
      })}
    </div>
  );
};

export default StackBadges;
