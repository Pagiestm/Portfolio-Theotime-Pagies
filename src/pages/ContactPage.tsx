import ChannelList from '../features/contact/components/ChannelList';
import ContactForm from '../features/contact/components/ContactForm';
import { useTranslation } from '../i18n/useTranslation';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-shell px-6 pb-[86px] pt-[68px]">
      <div
        className="grid items-start gap-[52px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
      >
        <div>
          <div className="mb-4 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
            {t.contactKicker}
          </div>
          <h1 className="m-0 mb-[26px] max-w-[14ch] text-[clamp(36px,5.2vw,66px)] font-black leading-none tracking-[-.035em]">
            {t.contactTitle}
          </h1>
          <p className="m-0 mb-10 max-w-[46ch] text-[18px] text-muted">{t.contactBody}</p>
          <ChannelList />
        </div>

        <ContactForm />
      </div>
    </section>
  );
};

export default ContactPage;
