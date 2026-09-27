import { FiMoon, FiSun } from 'react-icons/fi';
import { useTranslation } from '../../i18n/useTranslation';
import { useTheme } from '../../theme/useTheme';

const ThemeSwitch = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => {
  const { t } = useTranslation();
  const { resolved, toggle } = useTheme();
  const padding = size === 'sm' ? 'px-[10px]' : 'px-[14px]';
  const iconSize = size === 'sm' ? 14 : 16;
  const next = resolved === 'light' ? 'dark' : 'light';
  const Icon = resolved === 'light' ? FiSun : FiMoon;
  const label = `${t.theme.label} : ${t.theme[next]}`;

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={label}
      title={label}
      className={`flex cursor-pointer items-center border-2 border-line bg-transparent text-muted transition-colors hover:border-accent hover:text-ink ${padding}`}
    >
      <Icon size={iconSize} aria-hidden="true" />
    </button>
  );
};

export default ThemeSwitch;
