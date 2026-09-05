import ReCAPTCHA from 'react-google-recaptcha';
import { useContactForm } from '../hooks/useContactForm';
import { useTranslation } from '../../../i18n/useTranslation';
import { env } from '../../../config/env';

const FIELD_CLASS =
  'border-2 border-line bg-bg px-4 py-[14px] text-ink outline-none transition-colors focus:border-accent';
const LABEL_CLASS = 'text-[11px] uppercase tracking-[.16em] text-muted';

const Field = ({ id, label, error, children }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className={LABEL_CLASS}>
      {label}
    </label>
    {children}
    {error && <p className="m-0 text-[13px] text-accent-2">{error}</p>}
  </div>
);

const ContactForm = () => {
  const { t } = useTranslation();
  const {
    formRef,
    captchaRef,
    errors,
    status,
    submit,
    onCaptchaChange,
    onCaptchaExpired,
    showCaptcha,
  } = useContactForm();

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-5 border-2 border-line bg-surface px-7 pb-9 pt-8"
    >
      <Field id="cf-name" label={t.fName} error={errors.user_name}>
        <input id="cf-name" name="user_name" type="text" className={FIELD_CLASS} />
      </Field>

      <Field id="cf-mail" label={t.fMail} error={errors.user_email}>
        <input id="cf-mail" name="user_email" type="email" className={FIELD_CLASS} />
      </Field>

      <Field id="cf-msg" label={t.fMsg} error={errors.message}>
        <textarea id="cf-msg" name="message" rows={6} className={`${FIELD_CLASS} resize-y`} />
      </Field>

      {showCaptcha && (
        <div>
          <ReCAPTCHA
            ref={captchaRef}
            sitekey={env.recaptcha.siteKey}
            theme="dark"
            onChange={onCaptchaChange}
            onExpired={onCaptchaExpired}
          />
          {errors.captcha && <p className="m-0 mt-2 text-[13px] text-accent-2">{errors.captcha}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="cursor-pointer border-2 border-accent bg-accent px-6 py-4 text-left text-[13.5px] font-bold uppercase tracking-[.05em] text-ink transition-all duration-200 hover:bg-transparent hover:text-accent disabled:cursor-wait disabled:opacity-45"
      >
        {status === 'sending' ? t.fSending : t.fSend}
      </button>

      {status === 'sent' && (
        <div
          role="status"
          className="border-2 border-accent-2 px-4 py-[14px] text-[14.5px] text-accent-2"
        >
          {t.fSent}
        </div>
      )}

      {errors.form && (
        <div
          role="alert"
          className="border-2 border-accent px-4 py-[14px] text-[14.5px] text-accent"
        >
          {errors.form}
        </div>
      )}
    </form>
  );
};

export default ContactForm;
