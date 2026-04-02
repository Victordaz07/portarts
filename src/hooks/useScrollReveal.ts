"use client";

import { useEffect } from "react";

/**
 * Aplica reveal-pending después de la hidratación. El efecto del layout padre no debe
 * mutar nodos .reveal en el mismo tick que el commit inicial: los bloques dentro de
 * <Suspense> pueden hidratarse después y provocar mismatch de className.
 */
export function useScrollReveal(selector = ".reveal") {
  useEffect(() => {
    let cancelled = false;
    let innerCleanup: (() => void) | undefined;

    /** 1 ms: evita el mismo turno que la hidratación de hijos en Suspense. */
    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;

      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      );
      if (elements.length === 0) return;

      elements.forEach((el) => {
        el.classList.add("reveal-pending");
        el.classList.remove("visible");
      });

      if (typeof IntersectionObserver === "undefined") {
        elements.forEach((el) => el.classList.add("visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              setTimeout(() => el.classList.add("visible"), i * 70);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
      );

      elements.forEach((el) => observer.observe(el));

      const fallbackTimer = window.setTimeout(() => {
        elements.forEach((el) => el.classList.add("visible"));
      }, 1200);

      innerCleanup = () => {
        observer.disconnect();
        window.clearTimeout(fallbackTimer);
      };
    }, 1);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      innerCleanup?.();
    };
  }, [selector]);
}
