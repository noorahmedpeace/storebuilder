"use client";

import { useEffect } from "react";

export function MotionHydrator() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".motion-reveal");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return null;
}
