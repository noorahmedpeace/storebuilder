"use client";

import { ReactLenis } from "lenis/react";

/**
 * Buttery smooth scrolling site-wide (the single biggest "premium feel" upgrade).
 * Lenis runs its own rAF loop; content stays SSR'd above it.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 }}
    >
      {children}
    </ReactLenis>
  );
}
