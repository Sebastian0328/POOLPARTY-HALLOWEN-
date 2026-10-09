import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-blood-dark via-[#3a060c] to-ink py-28 sm:py-40">
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-6 -top-10 -z-10 select-none text-[22rem] leading-none text-white/[0.04] sm:text-[34rem]"
      >
        31
      </span>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(4rem,17vw,13rem)]">
            <span className="block">31 Oct.</span>
            <span className="block text-outline">Don&apos;t miss it.</span>
          </h2>
          <p className="eyebrow mt-6 text-white/80">Halloween Pool Party</p>
          <div className="mt-10">
            <PrimaryButton
              arrow
              className="w-full bg-white !text-ink hover:!bg-blood hover:!text-white sm:w-auto"
            >
              Entrar a la lista Free Cover
            </PrimaryButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
