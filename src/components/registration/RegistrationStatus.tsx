import { AlertTriangle, Clock, Lock, UserCheck, WifiOff } from "lucide-react";

export type StatusKind =
  | "upcoming"
  | "duplicate"
  | "soldout"
  | "policy_changed"
  | "closed"
  | "unavailable"
  | "error";

const content: Record<
  StatusKind,
  { title: string; text: string; icon: typeof Clock; tone: "neutral" | "warn" }
> = {
  upcoming: {
    title: "Registro aún no disponible",
    text: "Estamos activando la lista Free Cover. Vuelve a esta página en breve.",
    icon: Clock,
    tone: "neutral",
  },
  duplicate: {
    title: "Este número ya está registrado",
    text: "Este número de WhatsApp ya tiene un registro para el evento. Por seguridad no mostramos los datos de registros anteriores.",
    icon: UserCheck,
    tone: "neutral",
  },
  soldout: {
    title: "Lista agotada",
    text: "Los cupos Free Cover se agotaron. Gracias por tu interés.",
    icon: Lock,
    tone: "warn",
  },
  policy_changed: {
    title: "Actualizamos la política de datos",
    text: "Recarga la página para ver y aceptar la versión vigente de la política de tratamiento de datos.",
    icon: AlertTriangle,
    tone: "warn",
  },
  closed: {
    title: "Lista cerrada",
    text: "El registro Free Cover ya no está disponible.",
    icon: Lock,
    tone: "warn",
  },
  unavailable: {
    title: "Servicio temporalmente no disponible",
    text: "No pudimos procesar tu registro en este momento. No se guardó ningún dato. Inténtalo de nuevo en unos minutos.",
    icon: WifiOff,
    tone: "warn",
  },
  error: {
    title: "No pudimos completar el registro",
    text: "Ocurrió un problema inesperado. Revisa tus datos e inténtalo de nuevo.",
    icon: AlertTriangle,
    tone: "warn",
  },
};

interface RegistrationStatusProps {
  kind: StatusKind;
  /** Mensaje opcional del backend; reemplaza el texto por defecto */
  message?: string;
}

export function RegistrationStatus({ kind, message }: RegistrationStatusProps) {
  const c = content[kind];
  const Icon = c.icon;
  const urgent = kind === "unavailable" || kind === "error";

  return (
    <div
      role={urgent ? "alert" : "status"}
      className={`flex gap-4 border-l-2 p-4 sm:p-5 ${
        c.tone === "warn" ? "border-blood bg-blood/10" : "border-white/40 bg-white/5"
      }`}
    >
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-blood" />
      <div>
        <p className="font-display text-xl">{c.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-white/75">{message ?? c.text}</p>
      </div>
    </div>
  );
}
