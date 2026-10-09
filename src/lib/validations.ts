import { z } from "zod";
import { DIAL_CODES } from "@/config/countries";

const dialCodes = DIAL_CODES.map((d) => d.code);

export const registrationFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Escribe tu nombre completo.")
      .min(5, "Escribe tu nombre y apellido.")
      .max(100, "El nombre es demasiado largo.")
      .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, {
        message: "Incluye tu nombre y apellido.",
      }),
    whatsappPrefix: z
      .string()
      .refine((v) => dialCodes.includes(v), "Elige un prefijo válido."),
    whatsappNumber: z
      .string()
      .trim()
      .min(1, "Escribe tu número de WhatsApp.")
      .regex(/^[\d\s-]+$/, "Usa solo números."),
    email: z
      .string()
      .trim()
      .max(120, "El correo es demasiado largo.")
      .refine((v) => v === "" || z.email().safeParse(v).success, {
        message: "Revisa el formato de tu correo.",
      }),
    favoriteEnvironment: z.enum(["", "techno", "regueton_old_school", "dancehall_rancha"]),
    isAdult: z.boolean().refine((v) => v === true, {
      message: "Debes confirmar que eres mayor de 18 años.",
    }),
    privacyConsent: z.boolean().refine((v) => v === true, {
      message: "Debes autorizar el tratamiento de tus datos para inscribirte.",
    }),
    marketingConsent: z.boolean(),
    /** Honeypot: debe permanecer vacío. */
    website: z.string().max(0).optional(),
  })
  .superRefine((val, ctx) => {
    const digits = val.whatsappNumber.replace(/\D/g, "");
    if (!digits) return;
    const fail = (message: string) =>
      ctx.addIssue({ code: "custom", path: ["whatsappNumber"], message });

    if (val.whatsappPrefix === "+57") {
      if (!/^3\d{9}$/.test(digits)) {
        fail("Un celular colombiano tiene 10 dígitos y empieza por 3.");
      }
      return;
    }
    const total = val.whatsappPrefix.replace("+", "").length + digits.length;
    if (digits.length < 6 || total > 15) {
      fail("Revisa tu número; no parece válido.");
    }
  });

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

/** Validación del lado servidor para POST /api/registrations (no confiar en el cliente). */
export const registrationInputSchema = z.strictObject({
  fullName: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .refine((v) => v.split(/\s+/).length >= 2),
  /** Se normaliza antes de validar: se quitan espacios, guiones y paréntesis. */
  whatsapp: z
    .string()
    .max(40)
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^\+[1-9]\d{7,14}$/)),
  email: z.email().max(254).optional(),
  favoriteEnvironment: z.enum(["techno", "regueton_old_school", "dancehall_rancha"]).optional(),
  isAdult: z.literal(true),
  privacyConsent: z.literal(true),
  privacyPolicyVersion: z.string().trim().min(1).max(64),
  marketingConsent: z.boolean().default(false),
  website: z.string().max(0).optional(),
});
