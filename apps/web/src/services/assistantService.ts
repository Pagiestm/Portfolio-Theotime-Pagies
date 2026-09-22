export type AssistantSource = { title: string; path: string };
export type AssistantAnswer = { answer: string; sources: AssistantSource[] };

export type AssistantErrorCode = 'rateLimited' | 'quota' | 'invalid' | 'network' | 'unavailable';

export class AssistantError extends Error {
  readonly code: AssistantErrorCode;

  constructor(code: AssistantErrorCode) {
    super(code);
    this.code = code;
  }
}

const ENDPOINT = '/api/ask';

const CODES: Record<string, AssistantErrorCode> = {
  rate_limited: 'rateLimited',
  quota_exhausted: 'quota',
  invalid: 'invalid',
};

export const askAssistant = async (question: string, lang: string): Promise<AssistantAnswer> => {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question, lang }),
    });
  } catch {
    throw new AssistantError('network');
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new AssistantError(CODES[body?.error ?? ''] ?? 'unavailable');
  }
  return res.json();
};
