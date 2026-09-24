import { getEnv } from '../config/env.ts';
import type { ContactRequest } from '../models/contact.model.ts';
import { ConfigError, UpstreamError } from '../models/errors.model.ts';

const ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

const LANGUAGES = { fr: 'Français', en: 'English' };

const receivedAt = () =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(new Date());

const countWords = (message: string) => message.trim().split(/\s+/).filter(Boolean).length;

export const send = async (request: ContactRequest) => {
  const { emailjs } = getEnv();

  for (const [key, value] of Object.entries(emailjs)) {
    if (!value)
      throw new ConfigError(`EMAILJS_${key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}`);
  }

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        service_id: emailjs.serviceId,
        template_id: emailjs.templateId,
        user_id: emailjs.publicKey,
        accessToken: emailjs.privateKey,
        template_params: {
          user_name: request.name,
          user_email: request.email,
          reply_to: request.email,
          message: request.message,
          received_at: receivedAt(),
          site_language: LANGUAGES[request.lang],
          message_words: String(countWords(request.message)),
        },
      }),
    });
  } catch {
    throw new UpstreamError('EmailJS injoignable');
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new UpstreamError(`EmailJS a répondu ${response.status} ${detail}`.trim());
  }
};
