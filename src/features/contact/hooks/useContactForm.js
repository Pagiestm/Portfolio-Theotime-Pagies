import { useCallback, useRef, useState } from 'react';
import { sendContactEmail } from '../../../services/emailService';
import { isRecaptchaConfigured } from '../../../config/env';
import { useTranslation } from '../../../i18n/useTranslation';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validation, CAPTCHA et envoi du formulaire de contact.
 * Toute la logique est ici : `ContactForm` ne fait que du rendu.
 */
export const useContactForm = () => {
  const { t } = useTranslation();
  const formRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [captchaVerified, setCaptchaVerified] = useState(!isRecaptchaConfigured);

  const validate = useCallback(() => {
    const fields = formRef.current.elements;
    const next = {};

    if (!fields.user_name.value.trim()) next.user_name = t.fErrName;

    const email = fields.user_email.value.trim();
    if (!email) next.user_email = t.fErrMailRequired;
    else if (!EMAIL_PATTERN.test(email)) next.user_email = t.fErrMailFormat;

    if (!fields.message.value.trim()) next.message = t.fErrMsg;
    if (!captchaVerified) next.captcha = t.fErrCaptcha;

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [captchaVerified, t]);

  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validate()) return;

      setStatus('sending');
      try {
        await sendContactEmail(formRef.current);
        formRef.current.reset();
        setCaptchaVerified(!isRecaptchaConfigured);
        setStatus('sent');
      } catch (error) {
        setStatus('error');
        setErrors({
          form: error.message === 'EMAIL_NOT_CONFIGURED' ? t.fErrConfig : t.fErrSend,
        });
      }
    },
    [t, validate]
  );

  return {
    formRef,
    errors,
    status,
    submit,
    onCaptchaChange: (value) => setCaptchaVerified(Boolean(value)),
    showCaptcha: isRecaptchaConfigured,
  };
};
