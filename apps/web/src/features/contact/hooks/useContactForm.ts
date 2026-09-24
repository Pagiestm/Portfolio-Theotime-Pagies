import { useCallback, useEffect, useRef, useState } from 'react';
import { ContactError, sendContactMessage } from '../../../services/contactService';
import { useTranslation } from '../../../i18n/useTranslation';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 2500;

export const useContactForm = () => {
  const { t, lang } = useTranslation();
  const formRef = useRef(null);
  const openedAt = useRef(0);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const fieldsOf = () =>
    (formRef.current as HTMLFormElement).elements as HTMLFormControlsCollection &
      Record<string, HTMLInputElement>;

  const validate = useCallback(() => {
    const fields = fieldsOf();
    const next: Record<string, string> = {};

    if (!fields.user_name.value.trim()) next.user_name = t.fErrName;

    const email = fields.user_email.value.trim();
    if (!email) next.user_email = t.fErrMailRequired;
    else if (!EMAIL_PATTERN.test(email)) next.user_email = t.fErrMailFormat;

    if (!fields.message.value.trim()) next.message = t.fErrMsg;

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [t]);

  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validate()) return;

      const fields = fieldsOf();
      const tooFast = Date.now() - openedAt.current < MIN_FILL_MS;

      setStatus('sending');
      setErrors({});
      try {
        await sendContactMessage({
          name: fields.user_name.value.trim(),
          email: fields.user_email.value.trim(),
          message: fields.message.value.trim(),
          trap: tooFast ? 'delai' : fields.cf_ref.value,
          lang,
        });
        formRef.current.reset();
        openedAt.current = Date.now();
        setStatus('sent');
      } catch (error) {
        setStatus('error');
        const code = error instanceof ContactError ? error.code : 'unavailable';
        setErrors({ form: t.contactErrors[code] });
      }
    },
    [lang, t, validate]
  );

  return { formRef, errors, status, submit };
};
