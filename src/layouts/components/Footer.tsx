import { useTranslation } from '../../i18n/useTranslation';
import { site } from '../../config/site';

const LINKS = [
  { label: 'GitHub', href: site.github },
  { label: 'LinkedIn', href: site.linkedin },
  { label: 'Vercel', href: site.url },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative z-[1] border-t-2 border-line bg-[rgba(1,0,1,.6)]">
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-[18px] px-6 py-8 text-[13px] text-muted">
        <span>
          © {site.year} {site.name} — {t.role}
        </span>
        <span className="flex flex-wrap gap-[22px]">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
