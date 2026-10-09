import { Suspense } from "react";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getPublicListState } from "@/server/eventStatus";

/** Lee el estado público de la lista en el servidor, en cada solicitud. */
async function LiveForm() {
  const state = await getPublicListState();
  return (
    <RegistrationForm
      listStatus={state.status === "open" ? "open" : state.status === "closed" ? "closed" : "upcoming"}
      privacyPolicyVersion={state.status === "open" ? state.privacyPolicyVersion : undefined}
    />
  );
}

export function RegistrationSection() {
  return (
    <section
      id="registro"
      className="relative isolate overflow-hidden border-t border-line bg-ink py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 -z-10 size-[34rem] rounded-full bg-blood-dark/25 blur-[140px]"
      />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Free Cover"
              lines={["Your name.", "On the list."]}
              accentLine={1}
              size="xl"
            />
            <Reveal delay={0.1}>
              <div className="mt-8 border-l-2 border-blood pl-5">
                <p className="font-display text-2xl sm:text-3xl">
                  Solicita tu lugar en la lista FREE COVER.
                </p>
                <p className="mt-3 text-white/70">
                  Completa el registro y prepárate para el 31 de octubre.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7">
          <Suspense
            fallback={
              <div
                aria-busy
                className="min-h-[34rem] animate-pulse border border-line bg-surface p-9"
              >
                <p className="eyebrow text-mute">Cargando registro…</p>
              </div>
            }
          >
            <LiveForm />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
}
