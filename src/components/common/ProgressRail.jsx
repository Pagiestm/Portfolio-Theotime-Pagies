
/**
 * Le rail de progression du bas de scène : indice « 01 / 04 » + barre accent.
 * Partagé par la scène d'accueil et le couloir du parcours.
 */
const ProgressRail = ({ hint, index, total, progress, children }) => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-shell px-6 pb-[22px]">
    <div className="mb-3 flex items-center justify-between gap-4">
      <span className="text-[11px] uppercase tracking-[.18em] text-muted">{hint}</span>
      <span className="flex items-center gap-[14px]">
        <span className="text-[11px] uppercase tracking-[.18em] text-muted">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        {children}
      </span>
    </div>
    <div className="relative h-[2px] bg-line">
      <span
        className="absolute inset-y-0 left-0 bg-accent"
        style={{ width: `${(progress * 100).toFixed(1)}%`, boxShadow: '0 0 14px var(--color-accent)' }}
      />
    </div>
  </div>
);

export default ProgressRail;
