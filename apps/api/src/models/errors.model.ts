/** Erreur portant le statut HTTP à renvoyer et un code stable pour le client. */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message?: string) {
    super(message ?? code);
    this.status = status;
    this.code = code;
  }
}

export class ValidationError extends HttpError {
  constructor(message: string) {
    super(400, 'invalid', message);
  }
}

export class RateLimitError extends HttpError {
  constructor() {
    super(429, 'rate_limited');
  }
}

export class UpstreamError extends HttpError {
  constructor(message: string) {
    super(502, 'upstream', message);
  }
}

export class ConfigError extends HttpError {
  constructor(variable: string) {
    super(500, 'config', `${variable} manquant`);
  }
}
