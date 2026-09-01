import { TECH } from '../../../constants/tech';

/** Les technologies d'un projet, icône + libellé, encadrées à la Modernist. */
const StackBadges = ({ iconKeys, stack }) => {
  if (iconKeys.length === 0) {
    return (
      <div className="flex flex-wrap gap-[2px]">
        {stack.map((label) => (
          <span
            key={label}
            className="border border-line px-3 py-[10px] text-[12px] font-semibold uppercase tracking-[.08em] text-muted"
          >
            {label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-[2px]">
      {iconKeys.map((key) => {
        const entry = TECH[key];
        if (!entry) return null;
        const { label, Icon } = entry;
        return (
          <span
            key={key}
            className="flex items-center gap-[10px] border border-line px-3 py-[10px] text-[12px] font-semibold uppercase tracking-[.08em] text-muted"
          >
            <Icon className="text-[18px] text-accent-2" aria-hidden="true" />
            {label}
          </span>
        );
      })}
    </div>
  );
};

export default StackBadges;
