import "server-only";
import type { RegistrationInput } from "@/types/registration";
import { getSupabase } from "./supabase";

export type RegisterResult =
  | { status: "confirmed"; name: string; confirmationCode: string; freeCoverDeadline?: string }
  | { status: "duplicate" | "sold_out" | "closed" | "policy_changed" | "invalid" }
  | { status: "unavailable" };

/**
 * Registra mediante la RPC atómica register_party_free_cover (halloween_free_cover.sql).
 * Unicidad por WhatsApp y cupo los garantiza la base de datos (bloqueo del evento).
 * No se registran datos personales en logs: solo códigos de error.
 */
export async function registerFreeCover(input: RegistrationInput): Promise<RegisterResult> {
  const supabase = getSupabase();
  if (!supabase) return { status: "unavailable" };

  try {
    const { data, error } = await supabase.rpc("register_party_free_cover", {
      p_full_name: input.fullName,
      p_whatsapp: input.whatsapp,
      p_adult_declaration: input.isAdult,
      p_privacy_consent: input.privacyConsent,
      p_privacy_policy_version: input.privacyPolicyVersion,
      p_email: input.email ?? null,
      p_favorite_environment: input.favoriteEnvironment ?? null,
      p_marketing_consent: input.marketingConsent,
    });
    if (error) {
      console.error("[registrations] rpc error", error.code);
      return { status: "unavailable" };
    }
    if (typeof data !== "object" || data === null) return { status: "unavailable" };
    const r = data as Record<string, unknown>;

    switch (r.status) {
      case "confirmed":
        if (typeof r.confirmationCode === "string" && typeof r.name === "string") {
          return {
            status: "confirmed",
            name: r.name,
            confirmationCode: r.confirmationCode,
            freeCoverDeadline:
              typeof r.freeCoverDeadline === "string" ? r.freeCoverDeadline : undefined,
          };
        }
        return { status: "unavailable" };
      case "duplicate":
      case "sold_out":
      case "closed":
      case "policy_changed":
      case "invalid":
        return { status: r.status };
      default:
        return { status: "unavailable" };
    }
  } catch {
    console.error("[registrations] rpc request failed");
    return { status: "unavailable" };
  }
}
