import type {
  EnvironmentId,
  RegistrationInput,
  RegistrationResponse,
} from "@/types/registration";
import type { RegistrationFormValues } from "@/lib/validations";

export const REGISTRATIONS_ENDPOINT = "/api/registrations";
const REQUEST_TIMEOUT_MS = 15_000;

/** Convierte los valores del formulario al payload del contrato. */
export function buildRegistrationInput(
  values: RegistrationFormValues,
  privacyPolicyVersion: string,
): RegistrationInput {
  const digits = values.whatsappNumber.replace(/\D/g, "");
  return {
    fullName: values.fullName.trim().replace(/\s+/g, " "),
    whatsapp: `${values.whatsappPrefix}${digits}`,
    email: values.email.trim() || undefined,
    favoriteEnvironment: values.favoriteEnvironment
      ? (values.favoriteEnvironment as EnvironmentId)
      : undefined,
    isAdult: true,
    privacyConsent: true,
    privacyPolicyVersion,
    marketingConsent: values.marketingConsent,
    website: values.website || undefined,
  };
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/**
 * Envía el registro al backend.
 * - "confirmed" solo si la API respondió 201 con status "confirmed", nombre y código.
 * - Fallo de red, timeout o respuesta inesperada => "unavailable". Nunca se simula éxito.
 * - Ningún dato personal se guarda ni se registra en el cliente.
 */
export async function submitRegistration(
  input: RegistrationInput,
): Promise<RegistrationResponse> {
  let res: Response;
  try {
    res = await fetch(REGISTRATIONS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return { status: "unavailable" };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { status: "unavailable" };
  }
  if (!isRecord(body)) return { status: "unavailable" };

  switch (body.status) {
    case "confirmed":
      if (
        res.status === 201 &&
        typeof body.name === "string" &&
        typeof body.confirmationCode === "string"
      ) {
        return { status: "confirmed", name: body.name, confirmationCode: body.confirmationCode };
      }
      return { status: "unavailable" };
    case "duplicate":
    case "sold_out":
    case "closed":
    case "policy_changed":
    case "invalid":
      return { status: body.status };
    default:
      return {
        status: "unavailable",
        message: typeof body.message === "string" ? body.message : undefined,
      };
  }
}
