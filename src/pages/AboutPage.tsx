import Reveal from '../components/common/Reveal';
import MetaGrid from '../components/common/MetaGrid';
import portrait from '../assets/Theotime.png';
import { aboutParagraphs, facts } from '../features/about/data/about';
import { useTranslation } from '../i18n/useTranslation';
import { site } from '../config/site';

const AboutPage = () => {
  const { t, localize } = useTranslation();

  return (
    <section className="relative mx-auto max-w-shell overflow-hidden px-6 pb-[86px] pt-[68px]">
      <div
        className="relative grid items-start gap-[52px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', perspective: '1600px' }}
      >
        <Reveal variant="left">
          <div className="mb-4 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
            {t.aboutKicker}
          </div>
          <h1 className="m-0 mb-[30px] text-[clamp(34px,5vw,62px)] font-black leading-[1.02] tracking-[-.035em]">
            {t.aboutTitle}
          </h1>

          <div className="flex max-w-[56ch] flex-col gap-5 text-[17.5px] text-muted">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index} className="m-0">
                {localize(paragraph)}
              </p>
            ))}
          </div>

          <MetaGrid
            className="mt-[42px]"
            minWidth={150}
            items={facts.map((fact) => ({
              label: localize(fact.label),
              value: localize(fact.value),
            }))}
          />
        </Reveal>

        <Reveal variant="right" className="sticky top-[104px]">
          <div className="border-2 border-line overflow-hidden">
            <img
              src={portrait}
              alt={t.portraitAlt}
              className="block w-full h-auto"
            />
          </div>
          <div className="mt-[14px] text-[12px] uppercase tracking-[.14em] text-muted">
            {site.name} — {site.year}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutPage;
