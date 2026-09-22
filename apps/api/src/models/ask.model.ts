import { ValidationError } from './errors.model.ts';

export type Lang = 'fr' | 'en';

export type AskRequest = {
  question: string;
  lang: Lang;
};

export type AskSource = {
  title: string;
  path: string;
};

export type AskResponse = {
  answer: string;
  sources: AskSource[];
};

export const MAX_QUESTION_LENGTH = 300;

export const parseAskRequest = (body: unknown): AskRequest => {
  const raw = body as { question?: unknown; lang?: unknown } | null;
  const question = typeof raw?.question === 'string' ? raw.question.trim() : '';
  if (!question) throw new ValidationError('question requise');
  if (question.length > MAX_QUESTION_LENGTH) {
    throw new ValidationError(`question limitée à ${MAX_QUESTION_LENGTH} caractères`);
  }
  return { question, lang: raw?.lang === 'en' ? 'en' : 'fr' };
};
