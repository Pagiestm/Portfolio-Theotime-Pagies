import { forwardRef, Ref } from 'react';
import { useTranslation } from '../../../i18n/useTranslation';

const CARD_WIDTH = 'clamp(280px,30vw,384px)';

interface JourneyEntry {
  kind: string;
  period: { fr: string; en: string };
  org: string;
  role: { fr: string; en: string };
  detail: { fr: string; en: string };
}

const JourneyCard = forwardRef(({ entry }: { entry: JourneyEntry }, ref: Ref<HTMLDivElement>) => {
  const { t, localize } = useTranslation();
  const isExperience = entry.kind === 'exp';
  const kindLabel = isExperience ? t.experience : t.education;

  return (
    <div ref={ref} className="flex flex-none flex-col items-center" style={{ width: CARD_WIDTH }}>
      <span
        data-card-node
        className="h-[15px] w-[15px] border-2 border-line bg-bg transition-all duration-[400ms]"
      />
      <span className="h-[34px] w-[2px] bg-line" />
      <div
        data-card-body
        className="w-full border-2 border-line bg-[rgba(25,34,49,.86)] px-[24px] pb-[22px] pt-[22px] backdrop-blur-[10px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Gros titre : la période */}
        <div className="mb-[10px] text-[clamp(22px,2.5vw,31px)] font-black leading-none tracking-[-.035em]">
          {localize(entry.period)}
        </div>
        {/* Petit label expérience / formation, sous le titre */}
        <span
          className={`mb-[18px] inline-block px-[10px] py-[5px] text-[11px] font-extrabold uppercase tracking-[.2em] ${
            isExperience ? 'bg-accent text-ink' : 'border border-accent-2 text-accent-2'
          }`}
        >
          {kindLabel}
        </span>
        <div className="mb-[8px] text-[11.5px] uppercase tracking-[.16em] text-muted">
          {entry.org}
        </div>
        <h3 className="m-0 mb-3 text-[clamp(17px,1.9vw,22px)] font-extrabold tracking-[-.025em]">
          {localize(entry.role)}
        </h3>
        <p className="m-0 text-[15px] text-muted">{localize(entry.detail)}</p>
      </div>
    </div>
  );
});

JourneyCard.displayName = 'JourneyCard';

export default JourneyCard;
