import type { EventSettings } from "@/types/registration";


/**
 * Configuración editable del evento.
 * Todo lo que sea `null` se muestra como "pendiente" y no se inventa.
 */
export const event: EventSettings = {
  name: "Halloween Pool Party",
  tagline: "Tres ambientes. Diferentes ritmos. Una noche que no se repite.",
  dateISO: "2026-10-31",
  dateLabel: "31 OCT",
  dateLabelLong: "31 de octubre de 2026",
  timeZone: "America/Bogota",
  country: "Colombia",
  organizers: ["Mordida", "Novo Ice", "Factory Productions"],

  environments: [
    {
      id: "techno",
      number: "01",
      name: "Techno",
      headline: "TECHNO",
      description:
        "Para quienes viven la noche siguiendo el pulso de la electrónica.",
      // Reemplazar por el flyer oficial (mismo nombre o actualizar la ruta).
      image: {
        src: "/images/environments/techno.svg",
        alt: "Flyer oficial del ambiente Techno",
      },
    },
    {
      id: "regueton_old_school",
      number: "02",
      name: "Reguetón Old School",
      headline: "OLD SCHOOL",
      description:
        "Los clásicos que conoces de memoria y que todavía hacen bailar.",
      image: {
        src: "/images/environments/old-school.svg",
        alt: "Flyer oficial del ambiente Reguetón Old School",
      },
    },
    {
      id: "dancehall_rancha",
      number: "03",
      name: "Dancehall y Rancha",
      headline: "DANCEHALL Y RANCHA",
      description:
        "Una mezcla de ritmos para cambiar de ambiente sin salir de la fiesta.",
      image: {
        src: "/images/environments/dancehall-rancha.svg",
        alt: "Flyer oficial del ambiente Dancehall y Rancha",
      },
    },
  ],

  // Agrega aquí las redes oficiales: { label: "Instagram", href: "https://..." }
  socials: [],

  // Rutas o URLs de los documentos legales. null = "Próximamente".
  legalLinks: {
    privacy: null,
    dataTreatment: null,
    eventInfo: null,
  },


  accessDeadline: null,
  capacity: null,
};

export const hero = {
  eyebrow: "31 OCTUBRE 2026 · HALLOWEEN NIGHT",
  image: {
    src: "/images/hero/flyer.svg",
    alt: "Flyer oficial de Halloween Pool Party, 31 de octubre",
  },
} as const;
