import { useTranslation } from '../../../i18n/useTranslation';
import type { Locale } from '../../../services/sanity/types';

const ProjectVisualNote = ({ note, className = '' }: { note: Locale; className?: string }) => {
  const { t, localize } = useTranslation();

  return (
    <div
      className={`border-2 border-line bg-surface-2 px-7 py-9 ${className}`}
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, var(--color-line-soft) 0 1px, transparent 1px 12px)',
      }}
    >
      <div className="mb-3 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
        {t.noVisual}
      </div>
      <p className="m-0 max-w-[68ch] text-[16px] leading-[1.6] text-muted">{localize(note)}</p>
    </div>
  );
};

export default ProjectVisualNote;
