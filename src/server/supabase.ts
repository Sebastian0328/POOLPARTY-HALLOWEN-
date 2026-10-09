import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Slug del evento en party_events (ver halloween_free_cover.sql). */
export const EVENT_SLUG = "halloween-pool-party-2026";

let client: SupabaseClient | null = null;

/**
 * Cliente con la clave secreta. Solo existe en el servidor (import "server-only"):
 * esta clave nunca debe llegar al navegador ni usar el prefijo NEXT_PUBLIC_.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Sin caché en ninguna consulta; corta si Supabase no responde.
      fetch: (input, init) =>
        fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(8_000) }),
    },
  });
  return client;
}
