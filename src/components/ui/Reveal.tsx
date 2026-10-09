"use client";

import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** true = anima al montar (hero); false = al entrar en pantalla */
  immediate?: boolean;
}

export function Reveal({ children, delay = 0, className, immediate }: RevealProps) {
  const transition = { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const };
  const from = { opacity: 0, y: 28 };
  const to = { opacity: 1, y: 0 };

  if (immediate) {
    return (
      <motion.div className={className} initial={from} animate={to} transition={transition}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={from}
      whileInView={to}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
