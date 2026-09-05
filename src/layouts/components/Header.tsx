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

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    if (wide) setMenuOpen(false);
  }, [wide]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navItems = NAV_ITEMS.map(([to, fr, en]) => ({ to, label: lang === 'fr' ? fr : en }));

  return (
    <>
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
                      {isActive && (
                        <span className="absolute inset-x-3 bottom-[2px] h-[2px] bg-accent" />
                      )}
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
              className="flex cursor-pointer flex-col items-center gap-[5px] border-2 border-line bg-transparent px-[13px] py-3 transition-colors hover:border-accent"
            >
              <span
                className={`block h-[2px] w-5 bg-ink origin-center transition-transform duration-300 ${
                  menuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-ink transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-ink origin-center transition-transform duration-300 ${
                  menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </button>
          )}
        </div>
      </header>

      {/* Backdrop */}
      <div
        role="presentation"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/60 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Side Drawer */}
      <div
        aria-modal={menuOpen}
        aria-hidden={!menuOpen}
        className={`fixed right-0 top-0 z-[80] flex h-full w-[min(320px,85vw)] flex-col border-l-2 border-line bg-[rgba(1,0,1,.98)] transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-header flex-shrink-0 items-center justify-between border-b-2 border-line px-6">
          <span className="text-[11px] font-bold uppercase tracking-[.15em] text-muted">
            Navigation
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
            className="flex cursor-pointer flex-col items-center gap-[5px] border-2 border-line bg-transparent px-[13px] py-3 transition-colors hover:border-accent"
          >
            <span className="block h-[2px] w-5 bg-ink origin-center translate-y-[7px] rotate-45" />
            <span className="block h-[2px] w-5 bg-ink opacity-0" />
            <span className="block h-[2px] w-5 bg-ink origin-center -translate-y-[7px] -rotate-45" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-6 pt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === paths.home}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `border-b border-line-soft py-5 text-[15px] font-bold uppercase tracking-[.05em] transition-colors ${
                  isActive ? 'text-accent' : 'text-ink hover:text-accent'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-shrink-0 border-t-2 border-line px-6 py-6">
          <div className="flex flex-col gap-4">
            <LangSwitch size="md" />
            <Link
              to={paths.contact}
              onClick={() => setMenuOpen(false)}
              className="border-2 border-accent bg-accent px-[18px] py-[14px] text-center text-[13px] font-bold uppercase tracking-[.04em] text-ink transition-colors hover:bg-transparent hover:text-accent"
            >
              {t.cta}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
