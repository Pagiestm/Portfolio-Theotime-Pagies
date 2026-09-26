import { forwardRef, Ref } from 'react';
import { useTranslation } from '../../../i18n/useTranslation';
import type { JourneyEntry } from '../../../services/sanity/types';

const CARD_WIDTH = 'clamp(280px,30vw,384px)';
const STEM = 'var(--corridor-stem)';
const CARD_PAD_Y = 'var(--corridor-card-pad)';

const JourneyCard = forwardRef(({ entry }: { entry: JourneyEntry }, ref: Ref<HTMLDivElement>) => {
  const { t, localize } = useTranslation();
  const isExperience = entry.kind === 'exp';
  const kindLabel = isExperience ? t.experience : t.education;

  return (
    <div ref={ref} className="flex flex-none flex-col items-center" style={{ width: CARD_WIDTH }}>
      <span
        data-card-node
        className="h-[15px] w-[15px] border-2 border-line bg-bg transition-all duration-400"
      />
      <span className="w-[2px] bg-line" style={{ height: STEM }} />
      <div
        data-card-body
        className="w-full border-2 border-line bg-surface/85 px-[24px] backdrop-blur-[10px]"
        style={{
          transformStyle: 'preserve-3d',
          paddingTop: CARD_PAD_Y,
          paddingBottom: CARD_PAD_Y,
        }}
      >
        <div
          className="text-[clamp(22px,2.5vw,31px)] font-black leading-none tracking-[-.035em]"
          style={{ marginBottom: 'var(--corridor-gap-sm)' }}
        >
          {localize(entry.period)}
        </div>
        <span
          className={`inline-block px-[10px] py-[5px] text-[11px] font-extrabold uppercase tracking-[.2em] ${
            isExperience ? 'bg-accent text-on-accent' : 'border border-accent-2 text-accent-2'
          }`}
          style={{ marginBottom: 'var(--corridor-gap-lg)' }}
        >
          {kindLabel}
        </span>
        <div
          className="text-[11.5px] uppercase tracking-[.16em] text-muted"
          style={{ marginBottom: 'var(--corridor-gap-sm)' }}
        >
          {entry.org}
        </div>
        <h3
          className="m-0 text-[clamp(17px,1.9vw,22px)] font-extrabold tracking-[-.025em]"
          style={{ marginBottom: 'var(--corridor-gap-md)' }}
        >
          {localize(entry.role)}
        </h3>
        <p className="m-0 text-[length:var(--corridor-detail)] leading-[1.55] text-muted">
          {localize(entry.detail)}
        </p>
      </div>
    </div>
  );
});

JourneyCard.displayName = 'JourneyCard';

export default JourneyCard;
