import { ArrowRight } from "lucide-react";

type Variant = "solid" | "ghost";

interface PrimaryButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
}

const base =
  "group inline-flex items-center justify-center gap-3 font-semibold uppercase tracking-[0.14em] transition-all duration-300 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  solid:
    "bg-blood text-white hover:bg-white hover:text-ink shadow-[0_0_0_0_rgb(227_38_54/0.5)] hover:shadow-[0_0_40px_-8px_rgb(227_38_54/0.7)]",
  ghost: "border border-white/30 text-white hover:border-blood hover:text-blood",
};

const sizes = {
  md: "min-h-12 px-6 text-xs",
  lg: "min-h-16 px-8 text-sm sm:text-base",
};

export function PrimaryButton({
  children,
  href = "#registro",
  variant = "solid",
  size = "lg",
  arrow = false,
  className = "",
}: PrimaryButtonProps) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-5 transition-transform duration-300 group-hover:translate-x-1.5"
        />
      )}
    </a>
  );
}
