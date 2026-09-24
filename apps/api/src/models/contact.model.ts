import { ValidationError } from './errors.model.ts';

export type ContactRequest = {
  name: string;
  email: string;
  message: string;
  automated: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 120, email: 180, message: 5000 };

const text = (value: unknown, field: string, max: number) => {
  if (typeof value !== 'string' || !value.trim()) throw new ValidationError(`${field} requis`);
  const clean = value.trim();
  if (clean.length > max) throw new ValidationError(`${field} trop long`);
  return clean;
};

export const parseContactRequest = (body: unknown): ContactRequest => {
  if (!body || typeof body !== 'object') throw new ValidationError('corps JSON attendu');
  const { name, email, message, website } = body as Record<string, unknown>;

  const address = text(email, 'email', LIMITS.email);
  if (!EMAIL_PATTERN.test(address)) throw new ValidationError('email invalide');

  return {
    name: text(name, 'nom', LIMITS.name),
    email: address,
    message: text(message, 'message', LIMITS.message),
    automated: typeof website === 'string' && website.trim().length > 0,
  };
};
