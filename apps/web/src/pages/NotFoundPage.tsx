import { Link, useLocation } from 'react-router-dom';
import ActionLink from '../components/common/ActionLink';
import Reveal from '../components/common/Reveal';
import { useTranslation } from '../i18n/useTranslation';
import { paths } from '../routes/paths';

const NotFoundPage = () => {
  const { t, lang } = useTranslation();
  const { pathname } = useLocation();

  const destinations = [
    { to: paths.work, label: lang === 'fr' ? 'Réalisations' : 'Work', body: t.notFoundLinks.work },
    { to: paths.path, label: lang === 'fr' ? 'Parcours' : 'Path', body: t.notFoundLinks.path },
    {
      to: paths.skills,
      label: lang === 'fr' ? 'Compétences' : 'Skills',
      body: t.notFoundLinks.skills,
    },
    { to: paths.about, label: lang === 'fr' ? 'À propos' : 'About', body: t.notFoundLinks.about },
    {
      to: paths.contact,
      label: lang === 'fr' ? 'Contact' : 'Contact',
      body: t.notFoundLinks.contact,
    },
  ];

  return (
    <section className="mx-auto max-w-shell px-6 pb-[86px] pt-[68px]">
      <div className="mb-4 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">404</div>
      <h1 className="m-0 mb-6 text-[clamp(36px,5.6vw,70px)] font-black leading-none tracking-[-.035em]">
        {t.notFoundTitle}
      </h1>
      <p className="m-0 mb-8 max-w-[52ch] text-[18px] text-muted">{t.notFoundBody}</p>

      <div className="mb-12 inline-flex max-w-full flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 border-accent pl-4">
        <span className="text-[11px] font-bold uppercase tracking-[.16em] text-muted">
          {t.notFoundPathLabel}
        </span>
        <code className="break-all font-sans text-[15px] font-semibold text-ink">{pathname}</code>
      </div>

      <h2 className="m-0 mb-5 border-b-2 border-line pb-3 text-[12px] font-bold uppercase tracking-[.16em] text-accent-2">
        {t.notFoundLinksTitle}
      </h2>

      <nav className="mb-12 grid grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((item, index) => (
          <Reveal key={item.to} variant="up" delay={index * 40}>
            <Link
              to={item.to}
              className="group flex h-full flex-col gap-2 border-2 border-line bg-surface p-5 transition-colors hover:border-accent"
            >
              <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-.01em] text-ink transition-colors group-hover:text-accent-2">
                {item.label}
                <span aria-hidden="true" className="text-accent">
                  →
                </span>
              </span>
              <span className="text-[14px] leading-[1.5] text-muted">{item.body}</span>
            </Link>
          </Reveal>
        ))}
      </nav>

      <ActionLink to={paths.home}>{t.backHome}</ActionLink>
    </section>
  );
};

export default NotFoundPage;
