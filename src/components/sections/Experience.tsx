import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const concepts = [
  { n: "3", title: "Ambientes musicales", text: "Cada uno con su propio ritmo." },
  { n: "31", title: "Halloween Pool Party", text: "Octubre de 2026." },
  { n: "1", title: "Noche de música y fiesta", text: "Que no se repite." },
];

export function Experience() {
  return (
    <section id="evento" className="relative border-y border-line bg-ink py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow="La experiencia"
            lines={["No es otra fiesta", "de Halloween."]}
            accentLine={1}
          />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/75">
              Este 31 de octubre, la música se divide en tres ambientes para que vivas la
              noche a tu manera.
            </p>
          </Reveal>
        </div>

        <ul className="lg:col-span-5 lg:pt-6">
          {concepts.map((c, i) => (
            <li key={c.title}>
              <Reveal delay={i * 0.08}>
                <div className="group flex items-baseline gap-6 border-t border-line py-7 transition-colors duration-300 hover:border-blood">
                  <span className="font-display w-20 text-6xl text-blood sm:text-7xl">{c.n}</span>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl">{c.title}</p>
                    <p className="mt-1 text-sm text-mute">{c.text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
          <li aria-hidden className="border-t border-line" />
        </ul>
      </div>
    </section>
  );
}
