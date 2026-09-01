import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import LangSwitch from './LangSwitch';
import { useIsWide } from '../../hooks/useMediaQuery';
import { useTranslation } from '../../i18n/useTranslation';
import { NAV_ITEMS, paths } from '../../routes/paths';
import { site } from '../../config/site';

const Header = () => {
  const { lang, t } = useTranslation();
  const wide = useIsWide();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Le menu mobile se referme à chaque navigation et dès qu'on repasse en large.
  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    if (wide) setMenuOpen(false);
  }, [wide]);

  const navItems = NAV_ITEMS.map(([to, fr, en]) => ({ to, label: lang === 'fr' ? fr : en }));

  return (
    <header className="sticky top-0 z-[60] border-b-2 border-line bg-[rgba(1,0,1,.84)] backdrop-blur-[14px]">
      <div className="mx-auto flex h-header max-w-shell items-center justify-between gap-5 px-6">
        <Link
          to={paths.home}
          className="flex flex-none items-center gap-[10px] whitespace-nowrap text-ink hover:text-ink"
        >
          <span className="text-[18px] font-black tracking-[-.02em]">{site.name}</span>
        </Link>

        {wide ? (
          <nav className="flex items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === paths.home}
                className={({ isActive }) =>
                  `relative whitespace-nowrap px-3 py-[10px] text-[13px] font-semibold uppercase tracking-[.04em] transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive && <span className="absolute inset-x-3 bottom-[2px] h-[2px] bg-accent" />}
                  </>
                )}
              </NavLink>
            ))}
            <span className="mx-[14px]">
              <LangSwitch />
            </span>
            <Link
              to={paths.contact}
              className="whitespace-nowrap border-2 border-accent bg-accent px-[18px] py-[11px] text-[13px] font-bold uppercase tracking-[.04em] text-ink transition-colors hover:bg-transparent hover:text-accent"
            >
              {t.cta}
            </Link>
          </nav>
        ) : (
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={t.menu}
            aria-expanded={menuOpen}
            className="flex cursor-pointer flex-col gap-[5px] border-2 border-line bg-transparent px-[13px] py-3 transition-colors hover:border-accent"
          >
            <span className="block h-[2px] w-5 bg-ink" />
            <span className="block h-[2px] w-5 bg-ink" />
            <span className="block h-[2px] w-5 bg-ink" />
          </button>
        )}
      </div>

      {menuOpen && !wide && (
        <div className="border-t-2 border-line bg-[rgba(1,0,1,.98)]">
          <div className="mx-auto flex max-w-shell flex-col px-6 pb-6 pt-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === paths.home}
                // Fermeture explicite : taper l'entrée de la route courante ne
                // change pas `pathname`, l'effet ci-dessus ne se déclencherait pas.
                onClick={() => setMenuOpen(false)}
                className="border-b border-line-soft py-4 text-left text-[15px] font-bold uppercase tracking-[.05em] text-ink"
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-[22px] flex items-center gap-3">
              <LangSwitch size="md" />
              <Link
                to={paths.contact}
                onClick={() => setMenuOpen(false)}
                className="flex-1 border-2 border-accent bg-accent px-[18px] py-[14px] text-left text-[13px] font-bold uppercase tracking-[.04em] text-ink"
              >
                {t.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
