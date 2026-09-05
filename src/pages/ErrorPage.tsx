import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import ActionLink from '../components/common/ActionLink';
import NotFoundPage from './NotFoundPage';
import { useTranslation } from '../i18n/useTranslation';
import { paths } from '../routes/paths';

/**
 * Frontière d'erreur des routes. Une vraie 404 garde la page dédiée ; tout le
 * reste (chunk `lazy()` qui échoue après un déploiement, erreur de rendu) est
 * annoncé comme tel plutôt que déguisé en « page introuvable ».
 */
const ErrorPage = () => {
  const error = useRouteError();
  const { t } = useTranslation();

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  return (
    <section className="mx-auto max-w-shell px-6 pb-[86px] pt-[68px]">
      <div className="mb-4 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
        {isRouteErrorResponse(error) ? error.status : t.errorKicker}
      </div>
      <h1 className="m-0 mb-6 text-[clamp(36px,5.6vw,70px)] font-black leading-none tracking-[-.035em]">
        {t.errorTitle}
      </h1>
      <p className="m-0 mb-10 max-w-[52ch] text-[18px] text-muted">{t.errorBody}</p>

      <div className="flex flex-wrap gap-[2px]">
        <ActionLink onClick={() => window.location.reload()}>{t.errorRetry}</ActionLink>
        <ActionLink to={paths.home} variant="outline">
          {t.backHome}
        </ActionLink>
      </div>
    </section>
  );
};

export default ErrorPage;
