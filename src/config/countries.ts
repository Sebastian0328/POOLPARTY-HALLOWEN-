export interface DialCode {
  code: string;
  label: string;
}

/** Prefijos internacionales disponibles en el formulario de WhatsApp. */
export const DIAL_CODES: readonly DialCode[] = [
  { code: "+57", label: "Colombia +57" },
  { code: "+1", label: "EE. UU. / Canadá +1" },
  { code: "+34", label: "España +34" },
  { code: "+52", label: "México +52" },
  { code: "+54", label: "Argentina +54" },
  { code: "+56", label: "Chile +56" },
  { code: "+51", label: "Perú +51" },
  { code: "+593", label: "Ecuador +593" },
  { code: "+58", label: "Venezuela +58" },
  { code: "+507", label: "Panamá +507" },
];

export const DEFAULT_DIAL_CODE = "+57";
