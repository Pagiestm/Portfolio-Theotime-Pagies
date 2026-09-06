import { useLoaderData } from 'react-router-dom';
import Reveal from '../components/common/Reveal';
import MetaGrid from '../components/common/MetaGrid';
import { useTranslation } from '../i18n/useTranslation';
import { imageUrl } from '../lib/sanity/image';
import { useSettings } from '../lib/sanity/useContent';
import type { AboutContent } from '../lib/sanity/types';

const AboutPage = () => {
  const { t, localize } = useTranslation();
  const { about } = useLoaderData() as { about: AboutContent };
  const settings = useSettings();

  // Le portrait vit dans le Studio. Tant qu'aucune image n'y est déposée, le
  // cadre est simplement omis plutôt que de montrer un rectangle vide.
  const portrait = imageUrl(about?.portrait ?? undefined, 900);

  return (
    <section className="relative mx-auto max-w-shell overflow-hidden px-6 pb-[86px] pt-[68px]">
      <div
        className="relative grid items-start gap-[52px]"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          perspective: '1600px',
        }}
      >
        <Reveal variant="left">
          <div className="mb-4 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
            {localize(about?.header?.kicker)}
          </div>
          <h1 className="m-0 mb-[30px] text-[clamp(34px,5vw,62px)] font-black leading-[1.02] tracking-[-.035em]">
            {localize(about?.header?.title)}
          </h1>

          <div className="flex max-w-[56ch] flex-col gap-5 text-[17.5px] text-muted">
            {(about?.paragraphs ?? []).map((paragraph, index) => (
              <p key={index} className="m-0">
                {localize(paragraph)}
              </p>
            ))}
          </div>

          <MetaGrid
            className="mt-[42px]"
            minWidth={150}
            items={(about?.facts ?? []).map((fact) => ({
              label: localize(fact.label),
              value: localize(fact.value),
            }))}
          />
        </Reveal>

        <Reveal variant="right" className="sticky top-[104px]">
          {portrait && (
            <div className="overflow-hidden border-2 border-line">
              <img src={portrait} alt={t.portraitAlt} className="block h-auto w-full" />
            </div>
          )}
          <div className="mt-[14px] text-[12px] uppercase tracking-[.14em] text-muted">
            {settings.name} — {new Date().getFullYear()}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutPage;
