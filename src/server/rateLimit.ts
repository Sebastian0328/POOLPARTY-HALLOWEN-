import "server-only";

const WINDOW_MS = 10 * 60_000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

/**
 * Límite por IP en memoria. En Vercel cada instancia tiene su propio contador, así que es
 * una barrera básica: complementar con Vercel Firewall (Rate Limiting), ver docs/DEPLOY.md.
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
  }
  return recent.length > MAX_REQUESTS;
}
