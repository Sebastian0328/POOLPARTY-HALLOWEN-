import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  /** Una entrada por línea del título */
  lines: readonly string[];
  /** Índice (desde 0) de la línea que va en rojo */
  accentLine?: number;
  as?: "h1" | "h2";
  size?: "lg" | "xl";
  className?: string;
}

const sizes = {
  lg: "text-[clamp(2.6rem,8.5vw,6rem)]",
  xl: "text-[clamp(3.25rem,12vw,9rem)]",
};

export function SectionHeading({
  eyebrow,
  lines,
  accentLine,
  as: Tag = "h2",
  size = "lg",
  className = "",
}: SectionHeadingProps) {
  return (
    <Reveal className={className}>
      {eyebrow && (
        <p className="eyebrow mb-5 flex items-center gap-3 text-blood">
          <span aria-hidden className="h-px w-10 bg-blood" />
          {eyebrow}
        </p>
      )}
      <Tag className={`font-display ${sizes[size]}`}>
        {lines.map((line, i) => (
          <span key={line} className={`block ${i === accentLine ? "text-blood" : ""}`}>
            {line}
          </span>
        ))}
      </Tag>
    </Reveal>
  );
}
