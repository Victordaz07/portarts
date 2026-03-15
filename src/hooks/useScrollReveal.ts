"use client";

import { useEffect } from "react";

export function useScrollReveal(selector = ".reveal") {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (elements.length === 0) return;

    // Start hidden only when JS is running; if observer fails we still unhide later.
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
            const el = entry.target;
            setTimeout(() => el.classList.add("visible"), i * 70);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    // Fallback: avoid invisible sections if intersection callbacks never fire.
    const fallbackTimer = window.setTimeout(() => {
      elements.forEach((el) => el.classList.add("visible"));
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [selector]);
}
