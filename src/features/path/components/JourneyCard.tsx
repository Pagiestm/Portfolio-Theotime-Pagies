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
      <span className="h-[46px] w-[2px] bg-line" />
      <div
        data-card-body
        className="w-full border-2 border-line bg-[rgba(25,34,49,.86)] px-[26px] pb-[30px] pt-7 backdrop-blur-[10px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span
          className={`mb-[22px] inline-block px-[11px] py-[6px] text-[11.5px] font-extrabold uppercase tracking-[.2em] ${
            isExperience
              ? 'bg-accent text-ink'
              : 'border border-accent-2 text-accent-2'
          }`}
        >
          {kindLabel}
        </span>
        <div className="mb-[18px] text-[clamp(23px,2.6vw,33px)] font-black leading-none tracking-[-.035em]">
          {localize(entry.period)}
        </div>
        <div className="mb-[10px] text-[11.5px] uppercase tracking-[.16em] text-muted">
          {entry.org}
        </div>
        <h3 className="m-0 mb-4 text-[clamp(18px,2vw,24px)] font-extrabold tracking-[-.025em]">
          {localize(entry.role)}
        </h3>
        <p className="m-0 text-[15.5px] text-muted">{localize(entry.detail)}</p>
      </div>
    </div>
  );
});

JourneyCard.displayName = 'JourneyCard';

export default JourneyCard;
