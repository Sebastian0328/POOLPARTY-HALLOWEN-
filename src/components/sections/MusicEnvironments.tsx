import Image from "next/image";
import { event } from "@/config/event";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { EventEnvironment } from "@/types/registration";

// Distribución editorial en desktop: una tarjeta alta + dos apiladas.
const layout = [
  "lg:col-span-7 lg:row-span-2 min-h-[30rem] lg:min-h-[44rem]",
  "lg:col-span-5 min-h-[24rem] lg:min-h-0",
  "lg:col-span-5 min-h-[24rem] lg:min-h-0",
];

function EnvironmentCard({ env, className }: { env: EventEnvironment; className: string }) {
  const big = env.id === "techno" || env.id === "regueton_old_school";
  return (
    <article
      className={`group relative isolate flex flex-col justify-between overflow-hidden bg-surface p-6 sm:p-8 ${className}`}
    >
      <Image
        src={env.image.src}
        alt={env.image.alt}
        fill
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="-z-20 object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/30 transition-opacity duration-500 group-hover:opacity-90"
      />
      {/* Acento rojo de identificación */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 origin-top scale-y-50 bg-blood transition-transform duration-500 group-hover:scale-y-100"
      />

      <div className="flex items-center justify-between">
        <p className="eyebrow text-white/80">
          Ambiente <span className="text-blood">{env.number}</span> / 03
        </p>
      </div>

      <div>
        <h3
          className={`font-display break-words ${
            big
              ? "text-[clamp(3.5rem,13vw,8rem)] lg:text-[clamp(4rem,8vw,8rem)]"
              : "text-[clamp(2.6rem,10vw,4.5rem)]"
          }`}
        >
          {env.headline}
        </h3>
        <p className="eyebrow mt-3 text-blood">{env.name}</p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80 sm:text-base">
          {env.description}
        </p>
      </div>
    </article>
  );
}

export function MusicEnvironments() {
  return (
    <section id="ambientes" className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Los 3 ambientes" lines={["Elige tu", "ritmo."]} accentLine={1} />
          <Reveal>
            <p className="max-w-sm text-mute">
              Tres espacios, tres sonidos. Muévete entre ellos durante toda la noche.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-3 lg:grid-cols-12 lg:gap-4">
          {event.environments.map((env, i) => (
            <Reveal key={env.id} delay={i * 0.08} className={`flex ${layout[i]}`}>
              <EnvironmentCard env={env} className="flex-1" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
