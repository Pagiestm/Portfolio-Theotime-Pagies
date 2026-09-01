import emailjs from '@emailjs/browser';
import { env, isEmailConfigured } from '../config/env';

/**
 * Couche d'accès au service d'envoi d'email.
 * Les composants ne connaissent ni EmailJS ni les identifiants.
 *
 * @param {HTMLFormElement} form le formulaire à sérialiser.
 * @returns {Promise<void>} rejette si l'envoi échoue ou si la config est absente.
 */
export const sendContactEmail = async (form) => {
  if (!isEmailConfigured) {
    throw new Error('EMAIL_NOT_CONFIGURED');
  }

  await emailjs.sendForm(
    env.emailjs.serviceId,
    env.emailjs.templateId,
    form,
    env.emailjs.userId
  );
};
