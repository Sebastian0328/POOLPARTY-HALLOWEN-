import { notFound } from "next/navigation";
import { RegistrationStatus, type StatusKind } from "@/components/registration/RegistrationStatus";
import { RegistrationSuccess } from "@/components/registration/RegistrationSuccess";

const kinds: StatusKind[] = [
  "upcoming",
  "duplicate",
  "soldout",
  "closed",
  "policy_changed",
  "unavailable",
  "error",
];

/**
 * Solo desarrollo: revisión visual de los estados del registro.
 * No registra nada ni se sirve en producción.
 */
export default function EstadosPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-5 py-16">
      <h1 className="font-display text-5xl">Estados (solo diseño)</h1>
      {kinds.map((k) => (
        <RegistrationStatus key={k} kind={k} />
      ))}
      <RegistrationSuccess demo name="Nombre Ejemplo" confirmationCode="HP-XXXXXXXXXXXXXXXX" />
    </main>
  );
}
