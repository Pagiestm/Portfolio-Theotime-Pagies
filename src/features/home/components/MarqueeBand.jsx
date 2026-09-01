import Reveal from '../../../components/common/Reveal';
import { marquee } from '../data/chapters';
import { useTranslation } from '../../../i18n/useTranslation';

/** La bande de repères sous la scène d'accueil. */
const MarqueeBand = () => {
  const { localize } = useTranslation();

  return (
    <section className="border-b-2 border-line">
      <div
        className="mx-auto grid max-w-shell px-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
      >
        {marquee.map((item, index) => (
          <Reveal
            key={index}
            variant="up"
            delay={index * 60}
            className="border-l border-line-soft px-[22px] pb-[34px] pt-[30px]"
          >
            <div className="mb-2 text-[11px] uppercase tracking-[.16em] text-muted">
              {localize(item.label)}
            </div>
            <div className="text-[18px] font-extrabold tracking-[-.02em]">
              {localize(item.value)}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBand;
