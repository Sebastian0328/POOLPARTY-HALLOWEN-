/**
 * Tipos del contrato de registro FREE COVER.
 * Contrato HTTP completo: docs/API_CONTRACT.md
 */

export type EnvironmentId = "techno" | "regueton_old_school" | "dancehall_rancha";

/** Estado público de la lista, calculado en el servidor a partir de party_events. */
export type ListStatus = "upcoming" | "open" | "closed";

/** Payload de POST /api/registrations (contrato: halloween_free_cover.sql + docs/API_CONTRACT.md) */
export interface RegistrationInput {
  fullName: string;
  /** Formato E.164, ej. +573001234567 */
  whatsapp: string;
  email?: string;
  favoriteEnvironment?: EnvironmentId;
  /** Debe ser true */
  isAdult: true;
  /** Autorización de tratamiento de datos para la inscripción. Debe ser true */
  privacyConsent: true;
  /** Versión de la política que vio y aceptó la persona (la publicada por el servidor) */
  privacyPolicyVersion: string;
  /** Opcional: publicidad sobre futuros eventos */
  marketingConsent: boolean;
  /** Honeypot anti-bots. Un humano lo deja vacío. */
  website?: string;
}

export type RegistrationStatus =
  | "confirmed"
  | "duplicate"
  | "sold_out"
  | "closed"
  | "policy_changed"
  | "invalid"
  | "unavailable";

/** Respuesta normalizada que consume la UI. */
export type RegistrationResponse =
  | { status: "confirmed"; name: string; confirmationCode: string }
  | { status: "duplicate" | "sold_out" | "closed" | "policy_changed" | "invalid" }
  /** Backend no configurado, caído o con respuesta inesperada. No se guardó nada. */
  | { status: "unavailable"; message?: string };

export interface EventSettings {
  name: string;
  tagline: string;
  /** ISO local, sin hora definida todavía */
  dateISO: string;
  dateLabel: string;
  dateLabelLong: string;
  timeZone: string;
  country: string;
  organizers: readonly string[];
  environments: readonly EventEnvironment[];
  socials: readonly SocialLink[];
  legalLinks: LegalLinks;
  /** null = pendiente de definir */
  accessDeadline: string | null;
  /** null = pendiente de definir. Nunca se muestra públicamente. */
  capacity: number | null;
}

export interface EventEnvironment {
  id: EnvironmentId;
  number: string;
  /** Nombre completo para formularios y etiquetas */
  name: string;
  /** Título gigante de la tarjeta */
  headline: string;
  description: string;
  image: { src: string; alt: string };
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface LegalLinks {
  privacy: string | null;
  dataTreatment: string | null;
  eventInfo: string | null;
}
