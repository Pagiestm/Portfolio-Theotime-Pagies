import type { MiddlewareHandler } from 'hono';
import { RateLimitError } from '../models/errors.model.ts';

type Options = { max: number; windowMs: number };

export const rateLimit = ({ max, windowMs }: Options): MiddlewareHandler => {
  const buckets = new Map<string, { count: number; reset: number }>();
  return async (c, next) => {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const now = Date.now();
    const bucket = buckets.get(ip);
    if (!bucket || bucket.reset < now) {
      buckets.set(ip, { count: 1, reset: now + windowMs });
    } else {
      bucket.count += 1;
      if (bucket.count > max) throw new RateLimitError();
    }
    await next();
  };
};
