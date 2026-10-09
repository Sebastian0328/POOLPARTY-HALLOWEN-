import { NextResponse } from "next/server";
import { registerFreeCover } from "@/server/registrations";
import { isRateLimited } from "@/server/rateLimit";
import { registrationInputSchema } from "@/lib/validations";

const MAX_BODY_BYTES = 10_000;

const json = (body: Record<string, unknown>, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Contrato: docs/API_CONTRACT.md */
export async function POST(req: Request) {
  // Solo desde nuestro propio sitio (los navegadores siempre envían Origin en POST).
  const origin = req.headers.get("origin");
  try {
    if (!origin || new URL(origin).host !== req.headers.get("host")) {
      return json({ status: "invalid" }, 403);
    }
  } catch {
    return json({ status: "invalid" }, 403);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return json({ status: "unavailable", message: "Demasiados intentos. Espera unos minutos." }, 429);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ status: "invalid" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ status: "invalid" }, 400);
  }

  const parsed = registrationInputSchema.safeParse(body);
  // Honeypot lleno = bot. Error, nunca una confirmación falsa.
  if (!parsed.success || parsed.data.website) return json({ status: "invalid" }, 400);

  const result = await registerFreeCover({
    ...parsed.data,
    isAdult: true,
    privacyConsent: true,
  });

  switch (result.status) {
    case "confirmed":
      return json(
        {
          status: "confirmed",
          name: result.name,
          confirmationCode: result.confirmationCode,
          freeCoverDeadline: result.freeCoverDeadline,
        },
        201,
      );
    case "duplicate":
    case "sold_out":
    case "closed":
    case "policy_changed":
      return json({ status: result.status }, 409);
    case "invalid":
      return json({ status: "invalid" }, 400);
    default:
      return json({ status: "unavailable" }, 503);
  }
}
