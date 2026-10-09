import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Regístrate",
    text: "Completa tus datos para solicitar tu lugar en la lista.",
  },
  {
    n: "02",
    title: "Recibe tu confirmación",
    text: "Cuando tu registro sea confirmado, recibirás los datos de tu acceso.",
  },
  {
    n: "03",
    title: "Presenta tu acceso",
    text: "El día del evento presenta tu confirmación siguiendo las condiciones de ingreso.",
  },
];

export function FreeCoverSteps() {
  return (
    <section id="free-cover" className="border-t border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Cómo funciona el Free Cover"
          lines={["Tu entrada a la noche", "comienza aquí."]}
          accentLine={1}
        />

        <ol className="mt-14 grid gap-px bg-line md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.n} className="bg-surface">
              <Reveal delay={i * 0.1} className="group h-full">
                <div className="relative h-full overflow-hidden p-7 pb-10 transition-colors duration-300 hover:bg-raised sm:p-9">
                  <span
                    aria-hidden
                    className="font-display block text-[7rem] leading-none text-transparent [-webkit-text-stroke:1px_#E32636] transition-all duration-300 group-hover:text-blood/15"
                  >
                    {s.n}
                  </span>
                  <h3 className="font-display mt-4 text-3xl sm:text-4xl">{s.title}</h3>
                  <p className="mt-3 text-mute">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
          <h3 className="eyebrow text-blood md:col-span-3">Condiciones del Free Cover</h3>
          <ul className="space-y-3 text-sm leading-relaxed text-white/75 md:col-span-9">
            <li>Lista gratuita con cupos limitados.</li>
            <li>El registro está sujeto a disponibilidad y no garantiza la entrada.</li>
            <li>Solo para mayores de 18 años.</li>
            <li>Un registro por número de WhatsApp.</li>
            <li>Free Cover válido para ingresar hasta las 10:00 p. m. del 31 de octubre de 2026.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
