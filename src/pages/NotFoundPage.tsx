import ActionLink from '../components/common/ActionLink';
import { useTranslation } from '../i18n/useTranslation';
import { paths } from '../routes/paths';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-shell px-6 pb-[86px] pt-[68px]">
      <div className="mb-4 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">404</div>
      <h1 className="m-0 mb-6 text-[clamp(36px,5.6vw,70px)] font-black leading-none tracking-[-.035em]">
        {t.notFoundTitle}
      </h1>
      <p className="m-0 mb-10 max-w-[46ch] text-[18px] text-muted">{t.notFoundBody}</p>
      <ActionLink to={paths.home}>{t.backHome}</ActionLink>
    </section>
  );
};

export default NotFoundPage;
