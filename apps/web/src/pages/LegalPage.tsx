import { useTranslation } from '../i18n/useTranslation';
import { useSettings } from '../hooks/useSettings';

const LegalPage = () => {
  const { t } = useTranslation();
  const settings = useSettings();

  const fill = (text: string) =>
    text.replace(/\{name\}/g, settings.name ?? '').replace(/\{email\}/g, settings.email ?? '');

  return (
    <section className="mx-auto max-w-shell px-6 pb-[86px] pt-9">
      <h1 className="m-0 mb-6 max-w-[20ch] text-[clamp(34px,5vw,62px)] font-black leading-none tracking-[-.035em]">
        {t.legalTitle}
      </h1>
      <p className="m-0 mb-12 max-w-[62ch] text-[17px] text-muted">{t.legal.intro}</p>

      <div className="grid gap-[2px] border-2 border-line">
        {t.legal.sections.map((section) => (
          <div key={section.heading} className="bg-surface p-6">
            <h2 className="m-0 mb-3 text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
              {section.heading}
            </h2>
            <p className="m-0 max-w-[80ch] text-[15.5px] leading-relaxed text-muted">
              {fill(section.body)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LegalPage;
