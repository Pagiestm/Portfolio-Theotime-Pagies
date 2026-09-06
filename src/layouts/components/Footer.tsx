import { useTranslation } from '../../i18n/useTranslation';
import { useSettings } from '../../lib/sanity/useContent';

const Footer = () => {
  const { localize } = useTranslation();
  const settings = useSettings();

  const links = [
    settings.github && { label: 'GitHub', href: settings.github },
    settings.linkedin && { label: 'LinkedIn', href: settings.linkedin },
    settings.siteUrl && { label: 'Vercel', href: settings.siteUrl },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <footer className="relative z-[1] border-t-2 border-line bg-[rgba(1,0,1,.6)]">
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-[18px] px-6 py-8 text-[13px] text-muted">
        <span>
          © {new Date().getFullYear()} {settings.name} — {localize(settings.role)}
        </span>
        <span className="flex flex-wrap gap-[22px]">
          {links.map((link) => (
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
