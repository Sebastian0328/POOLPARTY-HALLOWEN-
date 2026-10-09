export const PENDING_ANSWER = "Próximamente anunciaremos esta información.";

export interface FaqItem {
  question: string;
  /** null = aún no confirmado; se muestra PENDING_ANSWER */
  answer: string | null;
}

/** Edita aquí las respuestas. No agregues condiciones sin confirmar. */
export const faq: readonly FaqItem[] = [
  {
    question: "¿Qué es el Free Cover?",
    answer:
      "Es una lista gratuita con cupos limitados para el Halloween Pool Party del 31 de octubre de 2026.",
  },
  {
    question: "¿Registrarme garantiza la entrada?",
    answer:
      "El registro está sujeto a disponibilidad y a las condiciones de ingreso que se publicarán.",
  },
  {
    question: "¿Hasta cuándo puedo utilizar mi Free Cover?",
    answer: null,
  },
  {
    question: "¿Puedo registrar a varias personas?",
    answer: null,
  },
  {
    question: "¿Necesito presentar un documento de identidad?",
    answer: null,
  },
  {
    question: "¿Qué pasa cuando se agotan los cupos?",
    answer:
      "Cuando la lista se agote, el registro se cerrará y lo indicaremos en esta misma página.",
  },
];
