import ActionLink from '../../../components/common/ActionLink';
import { useTranslation } from '../../../i18n/useTranslation';
import { paths } from '../../../routes/paths';

/** La bannière de clôture : la seule surface pleine du design. */
const ClosingBanner = () => {
  const { t } = useTranslation();

  return (
    <section className="border-t-2 border-accent bg-surface">
      <div
        className="mx-auto grid max-w-shell items-end gap-[30px] px-6 py-[74px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        <h2 className="m-0 max-w-[22ch] text-[clamp(26px,4vw,50px)] font-black leading-[1.04] tracking-[-.03em] text-ink">
          {t.closeTitle}
        </h2>
        <ActionLink to={paths.contact} className="justify-self-start">
          {t.closeCta}
        </ActionLink>
      </div>
    </section>
  );
};

export default ClosingBanner;
