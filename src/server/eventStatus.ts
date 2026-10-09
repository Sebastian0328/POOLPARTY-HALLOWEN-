import "server-only";
import { connection } from "next/server";
import { EVENT_SLUG, getSupabase } from "./supabase";

/** Única información pública de la lista. Nunca incluye cupos, conteos ni asistentes. */
export type PublicListState =
  | { status: "open"; privacyPolicyVersion: string }
  | { status: "upcoming" | "closed" | "unavailable" };

export async function getPublicListState(): Promise<PublicListState> {
  await connection(); // lectura en cada solicitud, nunca durante el build
  const supabase = getSupabase();
  if (!supabase) return { status: "unavailable" };

  try {
    const { data, error } = await supabase
      .from("party_events")
      .select("registration_open, free_cover_deadline, privacy_policy_version")
      .eq("slug", EVENT_SLUG)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("[event-status] supabase error", error.code);
      return { status: "unavailable" };
    }
    if (new Date(data.free_cover_deadline).getTime() <= Date.now()) {
      return { status: "closed" };
    }
    if (data.registration_open && data.privacy_policy_version) {
      return { status: "open", privacyPolicyVersion: data.privacy_policy_version };
    }
    return { status: "upcoming" };
  } catch {
    console.error("[event-status] supabase request failed");
    return { status: "unavailable" };
  }
}
