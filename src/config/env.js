/**
 * Point d'accès unique aux variables d'environnement Vite.
 * Aucun `import.meta.env` ailleurs dans le code applicatif.
 */
export const env = {
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    userId: import.meta.env.VITE_EMAILJS_USER_ID,
  },
  recaptcha: {
    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  },
};

export const isEmailConfigured = Boolean(
  env.emailjs.serviceId && env.emailjs.templateId && env.emailjs.userId
);

export const isRecaptchaConfigured = Boolean(env.recaptcha.siteKey);
