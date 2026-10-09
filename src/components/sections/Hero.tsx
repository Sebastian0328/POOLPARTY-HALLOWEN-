import Image from "next/image";
import { event, hero } from "@/config/event";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden pt-24 sm:pt-28 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-20"
    >
      {/* Resplandor de fondo */}
      <div
        aria-hidden
        className="absolute -right-40 top-0 -z-10 size-[42rem] rounded-full bg-blood-dark/30 blur-[140px]"
      />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-12">
        <div className="flex flex-col justify-center lg:col-span-7">
          <Reveal immediate>
            <p className="eyebrow mb-5 flex items-center gap-3 text-blood">
              <span aria-hidden className="h-px w-8 bg-blood sm:w-10" />
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal immediate delay={0.1}>
            <h1 className="font-display text-[clamp(3.25rem,14vw,8.75rem)]">
              <span className="block">This night</span>
              <span className="block">is different.</span>
            </h1>
          </Reveal>

          <Reveal immediate delay={0.2}>
            <p className="font-display mt-4 text-[clamp(1.6rem,5.5vw,3.25rem)] text-blood">
              Halloween
              <br />
              Pool Party
            </p>
          </Reveal>

          <Reveal immediate delay={0.3}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              {event.tagline}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Ambientes musicales">
              {event.environments.map((e) => (
                <li
                  key={e.id}
                  className="border border-white/25 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/80"
                >
                  {e.name}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal immediate delay={0.4} className="mt-8">
            <PrimaryButton arrow className="w-full sm:w-auto">
              Consigue tu Free Cover
            </PrimaryButton>
            <p className="mt-3 text-sm text-mute">Lista gratuita con cupos limitados.</p>
          </Reveal>
        </div>

        <Reveal immediate delay={0.25} className="lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
            {/* Marco rojo desplazado */}
            <div
              aria-hidden
              className="absolute -bottom-3 -left-3 size-full border border-blood sm:-bottom-4 sm:-left-4"
            />
            <div className="relative size-full overflow-hidden bg-surface">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 90vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/30"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6">
                <p className="font-display text-[clamp(3.5rem,9vw,5.5rem)] leading-none">
                  31<span className="text-blood"> / </span>OCT
                </p>
                <p className="eyebrow pb-2 text-right text-white/70">
                  2026
                  <br />
                  {event.country}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
