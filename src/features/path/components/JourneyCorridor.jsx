import JourneyCard from './JourneyCard';
import ActionLink from '../../../components/common/ActionLink';
import { journey } from '../data/journey';
import { useHorizontalStage } from '../hooks/useHorizontalStage';
import { useTranslation } from '../../../i18n/useTranslation';
import { paths } from '../../../routes/paths';

const HEADER_HEIGHT = 68;
const TRACK_PAD_TOP = 'clamp(120px,20vh,190px)';
const CARD_WIDTH = 'clamp(280px,30vw,384px)';

const StepButton = ({ label, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="pointer-events-auto h-11 w-11 cursor-pointer border-2 border-line bg-transparent text-[15px] text-ink transition-colors hover:border-accent hover:text-accent-2"
  >
    {children}
  </button>
);

/** Le parcours déroulé à l'horizontale, piloté par le scroll vertical. */
const JourneyCorridor = () => {
  const { t, localize } = useTranslation();
  const { stageRef, frameRef, trackRef, railFillRef, barRef, registerCard, activeIndex, step } =
    useHorizontalStage({ stickyOffset: HEADER_HEIGHT });

  const total = journey.length + 1; // + la carte de clôture
  const active = journey[activeIndex];

  return (
    <section ref={stageRef} className="relative" style={{ height: '400vh' }}>
      <div
        ref={frameRef}
        className="sticky overflow-hidden"
        style={{
          top: HEADER_HEIGHT,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          minHeight: 520,
          perspective: '1250px',
          perspectiveOrigin: '50% 44%',
        }}
      >
        <div
          className="pointer-events-none absolute left-6 z-[5]"
          style={{ top: 'clamp(20px,4vh,34px)' }}
        >
          <div className="text-[clamp(30px,5vw,64px)] font-black leading-[.95] tracking-[-.04em] text-ink">
            {active ? localize(active.period) : '—'}
          </div>
          <div className="mt-2 text-[11px] font-extrabold uppercase tracking-[.22em] text-accent-2">
            {active ? (active.kind === 'exp' ? t.experience : t.education) : t.cta}
          </div>
        </div>

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
            style={{ top: `calc(${TRACK_PAD_TOP} + 6.5px)`, boxShadow: '0 0 16px var(--color-accent)' }}
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
            <span className="h-[46px] w-[2px] bg-line" />
            <div
              data-card-body
              className="w-full border-2 border-accent px-7 pb-[34px] pt-8"
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-shell px-6 pb-[22px]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[.18em] text-muted">{t.scrollHint}</span>
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
    </section>
  );
};

export default JourneyCorridor;
