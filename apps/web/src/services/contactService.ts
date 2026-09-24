export type ContactErrorCode = 'rateLimited' | 'invalid' | 'config' | 'network' | 'unavailable';

export class ContactError extends Error {
  readonly code: ContactErrorCode;

  constructor(code: ContactErrorCode) {
    super(code);
    this.code = code;
  }
}

const ENDPOINT = '/api/contact';

const CODES: Record<string, ContactErrorCode> = {
  rate_limited: 'rateLimited',
  invalid: 'invalid',
  config: 'config',
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website: string;
};

export const sendContactMessage = async (payload: ContactPayload) => {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ContactError('network');
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new ContactError(CODES[body?.error ?? ''] ?? 'unavailable');
  }
};
