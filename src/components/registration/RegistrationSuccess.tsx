interface RegistrationSuccessProps {
  name: string;
  confirmationCode: string;
  /** Solo para la vista de diseño /dev/estados */
  demo?: boolean;
}

/**
 * Pantalla de confirmación. Solo debe renderizarse con datos
 * devueltos por una respuesta "confirmed" real del backend.
 */
export function RegistrationSuccess({ name, confirmationCode, demo }: RegistrationSuccessProps) {
  return (
    <div role="status" className="relative overflow-hidden border border-blood/60 bg-raised p-6 sm:p-9">
      {demo && (
        <p className="eyebrow absolute right-0 top-0 bg-white px-3 py-1 text-ink">
          Vista de diseño
        </p>
      )}
      <p className="eyebrow text-blood">Registro confirmado</p>
      <h3 className="font-display mt-3 text-[clamp(2.4rem,8vw,3.75rem)]">
        Estás en la lista,
        <br />
        <span className="break-words text-blood">{name}.</span>
      </h3>

      <div className="mt-8 border border-line bg-ink p-5">
        <p className="eyebrow text-mute">Código de confirmación</p>
        <p className="font-display mt-2 break-all text-2xl tracking-[0.08em] sm:text-3xl">
          {confirmationCode}
        </p>
      </div>

      <p className="mt-6 border-l-2 border-blood pl-4 leading-relaxed text-white/85">
        Guarda esta confirmación. Tu free cover es válido para ingresar hasta las 10:00 p. m. del
        31 de octubre de 2026.
      </p>
    </div>
  );
}
