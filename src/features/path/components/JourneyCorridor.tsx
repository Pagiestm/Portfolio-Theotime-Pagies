import { ReactNode } from 'react';
import JourneyCard from './JourneyCard';
import ActionLink from '../../../components/common/ActionLink';
import { journey } from '../data/journey';
import { useHorizontalStage } from '../hooks/useHorizontalStage';
import { useTranslation } from '../../../i18n/useTranslation';
import { paths } from '../../../routes/paths';

const HEADER_HEIGHT = 68;
const TRACK_PAD_TOP = 'clamp(52px,9vh,120px)';
const CARD_WIDTH = 'clamp(280px,30vw,384px)';

const StepButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="pointer-events-auto h-11 w-11 cursor-pointer border-2 border-line bg-transparent text-[15px] text-ink transition-colors hover:border-accent hover:text-accent-2"
  >
    {children}
  </button>
);

/* ─── Le couloir horizontal, piloté par le scroll — même effet sur tous les écrans ─── */
const JourneyCorridor = () => {
  const { t } = useTranslation();
  const { stageRef, frameRef, trackRef, railFillRef, barRef, registerCard, activeIndex, step } =
    useHorizontalStage({ stickyOffset: HEADER_HEIGHT });

  const total = journey.length + 1;

  return (
    <section ref={stageRef} className="relative" style={{ height: '400vh' }}>
      <div
        ref={frameRef}
        className="sticky flex flex-col overflow-hidden"
        style={{
          top: HEADER_HEIGHT,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          // Le minimum ne doit jamais dépasser le viewport : sinon, sur un écran
          // court (mobile paysage), la barre passerait sous le pli et deviendrait
          // inaccessible à cause de overflow-hidden.
          minHeight: `min(520px, calc(100vh - ${HEADER_HEIGHT}px))`,
        }}
      >
        {/* Région du couloir — les cartes vivent ici, au-dessus de la barre */}
        <div
          className="relative flex-1"
          style={{ perspective: '1250px', perspectiveOrigin: '50% 44%' }}
        >
          <div
            ref={trackRef}
            className="absolute inset-y-0 left-0 flex items-start will-change-transform"
            style={{
              gap: 'clamp(26px,3.4vw,54px)',
              padding: `${TRACK_PAD_TOP} max(20px, calc(50% - clamp(140px,15vw,192px))) 0`,
              transformStyle: 'preserve-3d',
            }}
          >
            <span
              className="absolute inset-x-0 h-[2px] bg-line"
              style={{ top: `calc(${TRACK_PAD_TOP} + 6.5px)` }}
            />
            <span
              ref={railFillRef}
              className="absolute left-0 h-[2px] w-0 bg-accent"
              style={{
                top: `calc(${TRACK_PAD_TOP} + 6.5px)`,
                boxShadow: '0 0 16px var(--color-accent)',
              }}
            />

            {journey.map((entry, index) => (
              <JourneyCard key={`${entry.org}-${index}`} ref={registerCard(index)} entry={entry} />
            ))}

            <div
              ref={registerCard(journey.length)}
              className="flex flex-none flex-col items-center"
              style={{ width: CARD_WIDTH }}
            >
              <span
                data-card-node
                className="h-[15px] w-[15px] border-2 border-line bg-bg transition-all duration-[400ms]"
              />
              <span className="h-[34px] w-[2px] bg-line" />
              <div
                data-card-body
                className="w-full border-2 border-accent px-7 pb-[28px] pt-7"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <h3 className="m-0 mb-6 text-[clamp(21px,2.4vw,30px)] font-black leading-[1.06] tracking-[-.03em]">
                  {t.closeTitle}
                </h3>
                <ActionLink to={paths.contact} className="px-6 py-[14px] text-[13px]">
                  {t.closeCta}
                </ActionLink>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de progression — bande opaque placée SOUS les cartes */}
        <div className="relative z-[9] shrink-0 border-t-2 border-line bg-bg">
          <div className="mx-auto max-w-shell px-6 py-[18px]">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[.18em] text-muted">
                {t.scrollHint}
              </span>
              <span className="flex items-center gap-[14px]">
                <span className="text-[11px] uppercase tracking-[.18em] text-muted">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <StepButton label={t.prev} onClick={() => step(-1)}>
                  ←
                </StepButton>
                <StepButton label={t.next} onClick={() => step(1)}>
                  →
                </StepButton>
              </span>
            </div>
            <div className="relative h-[2px] bg-line">
              <span
                ref={barRef}
                className="absolute inset-y-0 left-0 w-0 bg-accent"
                style={{ boxShadow: '0 0 14px var(--color-accent)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyCorridor;
