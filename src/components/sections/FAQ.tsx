"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { faq, PENDING_ANSWER } from "@/config/faq";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faq" className="border-t border-line bg-ink py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Preguntas frecuentes" lines={["Antes de", "entrar."]} accentLine={1} />
        </div>

        <div className="lg:col-span-7">
          {faq.map((item, i) => {
            const open = openIndex === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            return (
              <div key={item.question} className="border-b border-line first:border-t">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex min-h-[4.5rem] w-full items-center justify-between gap-6 py-4 text-left transition-colors hover:text-blood"
                  >
                    <span className="font-display text-xl sm:text-2xl">{item.question}</span>
                    <Plus
                      aria-hidden
                      className={`size-6 shrink-0 text-blood transition-transform duration-300 ${
                        open ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p
                        className={`pb-6 pr-10 leading-relaxed ${
                          item.answer ? "text-white/75" : "text-mute italic"
                        }`}
                      >
                        {item.answer ?? PENDING_ANSWER}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
