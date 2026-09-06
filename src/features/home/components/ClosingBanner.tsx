import ActionLink from '../../../components/common/ActionLink';
import { useTranslation } from '../../../i18n/useTranslation';
import { paths } from '../../../routes/paths';
import type { Locale } from '../../../lib/sanity/types';

/** La bannière de clôture : la seule surface pleine du design. */
const ClosingBanner = ({ title, cta }: { title?: Locale; cta?: Locale }) => {
  const { t, localize } = useTranslation();

  return (
    <section className="border-t-2 border-accent bg-surface">
      <div
        className="mx-auto grid max-w-shell items-end gap-[30px] px-6 py-[74px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        <h2 className="m-0 max-w-[22ch] text-[clamp(26px,4vw,50px)] font-black leading-[1.04] tracking-[-.03em] text-ink">
          {localize(title) ?? t.closeTitle}
        </h2>
        <ActionLink to={paths.contact} className="justify-self-start">
          {localize(cta) ?? t.closeCta}
        </ActionLink>
      </div>
    </section>
  );
};

export default ClosingBanner;
