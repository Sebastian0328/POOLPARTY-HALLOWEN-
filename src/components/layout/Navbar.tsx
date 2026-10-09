"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { event } from "@/config/event";

const links = [
  { href: "#ambientes", label: "Ambientes" },
  { href: "#free-cover", label: "Condiciones" },
];

const ctaClass =
  "inline-flex min-h-10 items-center whitespace-nowrap bg-blood px-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-white hover:text-ink sm:px-5 sm:text-xs";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-ink/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <a
          href="#inicio"
          className="font-display text-lg leading-none tracking-wide sm:text-xl"
          onClick={() => setOpen(false)}
        >
          HALLOWEEN <span className="text-blood">POOL PARTY</span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="eyebrow text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a href="#registro" className={ctaClass}>
            Entrar a la lista
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a href="#registro" className={ctaClass} onClick={() => setOpen(false)}>
            Entrar a la lista
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center border border-line"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="menu-movil" className="border-t border-line bg-ink px-5 pb-6 pt-2 md:hidden">
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-line">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display flex min-h-14 items-center justify-between text-3xl"
                >
                  {l.label}
                  <span aria-hidden className="text-blood">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-5 text-mute">
            {event.dateLabelLong} · {event.country}
          </p>
        </div>
      )}
    </header>
  );
}
