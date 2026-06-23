interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Minimal in-memory token-bucket rate limiter for local development. Production deployment
 * should use Cloudflare's native rate-limiting rules or a Workers KV/D1-backed limiter keyed
 * by IP + route (see docs/SECURITY_AND_PRIVACY.md and docs/DEPLOYMENT.md) - this in-memory
 * map does not survive across Worker isolates or server restarts.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) {
    return false;
  }
  bucket.count += 1;
  return true;
}
