/**
 * Grille de cellules `label / valeur` - le motif « modular grid » du design system,
 * réutilisé par la bande d'accueil, les faits de la page À propos et la méta d'un projet.
 *
 * @param {Array<{label: string, value: React.ReactNode}>} items
 * @param {'boxed'|'bare'} tone  `boxed` = encadré 2px, `bare` = simple filet haut.
 */
const MetaGrid = ({ items, tone = 'bare', minWidth = 180, className = '' }) => (
  <div
    className={[
      'grid',
      tone === 'boxed' ? 'border-2 border-t-0 border-line' : 'border-t-2 border-line',
      className,
    ].join(' ')}
    style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))` }}
  >
    {items.map((item) => (
      <div
        key={item.label}
        className={
          tone === 'boxed'
            ? 'border-l border-line-soft px-5 py-[22px]'
            : 'border-b border-line-soft py-5 pr-5'
        }
      >
        <div className="mb-2 text-[11px] uppercase tracking-[.16em] text-muted">{item.label}</div>
        <div className="text-[15.5px] font-bold">{item.value}</div>
      </div>
    ))}
  </div>
);

export default MetaGrid;
