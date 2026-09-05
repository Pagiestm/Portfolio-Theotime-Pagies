import { LANGUAGES } from '../../i18n/context';
import { useTranslation } from '../../i18n/useTranslation';

const LangSwitch = ({ size = 'sm' }) => {
  const { lang, setLang } = useTranslation();
  const padding = size === 'sm' ? 'px-[10px] py-[6px] text-[12px]' : 'px-[14px] py-[10px] text-[13px]';

  return (
    <span className="flex border-2 border-line">
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`cursor-pointer border-0 bg-transparent font-bold tracking-[.08em] transition-colors ${padding} ${
            lang === code ? 'text-ink' : 'text-muted hover:text-ink'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </span>
  );
};

export default LangSwitch;
