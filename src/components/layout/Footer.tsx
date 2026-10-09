import { event } from "@/config/event";

function LegalItem({ label, href }: { label: string; href: string | null }) {
  if (!href) {
    return (
      <li className="text-white/40">
        {label} <span className="text-[0.65rem] uppercase tracking-widest">· Próximamente</span>
      </li>
    );
  }
  return (
    <li>
      <a href={href} className="transition-colors hover:text-blood">
        {label}
      </a>
    </li>
  );
}

export function Footer() {
  const { legalLinks, socials, organizers } = event;

  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <p className="eyebrow text-mute">Presentado por</p>
        <p className="font-display mt-3 text-[clamp(1.6rem,4.5vw,3rem)] leading-tight">
          {organizers.map((o, i) => (
            <span key={o}>
              {i > 0 && <span className="mx-3 text-blood">·</span>}
              {o}
            </span>
          ))}
        </p>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 text-sm text-mute sm:grid-cols-3">
          <div>
            <p className="eyebrow mb-3 text-white">Evento</p>
            <p>{event.name}</p>
            <p>{event.dateLabelLong}</p>
            <p>{event.country}</p>
          </div>

          <div>
            <p className="eyebrow mb-3 text-white">Legal</p>
            <ul className="space-y-2">
              <LegalItem label="Política de privacidad" href={legalLinks.privacy} />
              <LegalItem label="Tratamiento de datos" href={legalLinks.dataTreatment} />
              <LegalItem label="Información del evento" href={legalLinks.eventInfo} />
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3 text-white">Síguenos</p>
            {socials.length > 0 ? (
              <ul className="space-y-2">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-blood"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/40">Redes oficiales próximamente.</p>
            )}
          </div>
        </div>

        <p className="mt-12 text-xs text-white/40">
          © 2026 {event.name}. Evento para mayores de 18 años.
        </p>
      </div>
    </footer>
  );
}
