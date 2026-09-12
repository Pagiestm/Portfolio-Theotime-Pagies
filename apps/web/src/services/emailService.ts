import emailjs from '@emailjs/browser';
import { env, isEmailConfigured } from '../config/env';

export const sendContactEmail = async (form: HTMLFormElement) => {
  if (!isEmailConfigured) {
    throw new Error('EMAIL_NOT_CONFIGURED');
  }

  await emailjs.sendForm(env.emailjs.serviceId, env.emailjs.templateId, form, env.emailjs.userId);
};
