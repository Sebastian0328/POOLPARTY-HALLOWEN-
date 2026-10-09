"use client";

import { MotionConfig } from "motion/react";

/** Respeta prefers-reduced-motion en todas las animaciones. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
