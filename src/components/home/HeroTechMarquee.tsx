"use client";

import { useReducedMotion } from "framer-motion";

interface HeroTechMarqueeProps {
  items: string[];
  /** Label shown above the ticker (e.g. portfolio hero). */
  sectionLabel?: string;
}

/** Clases de píldora del ticker — inline para evitar ReferenceError por scope/caché en dev. */
function techPillClassName(): string {
  return "inline-flex shrink-0 items-center text-sm text-text-secondary px-3 py-1.5 rounded-full bg-white border border-border shadow-sm";
}

/**
 * Carrusel horizontal en loop infinito (estilo ticker / anuncio).
 * Si el usuario pide menos movimiento, se muestran píldoras estáticas.
 */
export function HeroTechMarquee({
  items,
  sectionLabel = "Frontend Stack",
}: HeroTechMarqueeProps) {
  const list = items.length > 0 ? items : [];
  const reduceMotion = useReducedMotion();
  const pill = techPillClassName();

  if (reduceMotion) {
    return (
      <div className="w-full min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">
          {sectionLabel}
        </p>
        <ul
          className="flex w-full flex-wrap gap-2"
          role="list"
          aria-label="Technologies and tools"
        >
          {list.map((item) => (
            <li key={item}>
              <span className={pill}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const loop = [...list, ...list];

  return (
    <div className="w-full min-w-0">
      <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">
        {sectionLabel}
      </p>
      <div className="w-full overflow-hidden rounded-md">
        <div
          className="flex w-max gap-4"
          style={{ animation: "marquee 24s linear infinite" }}
        >
          {loop.map((item, i) => (
            <span key={`${item}-${i}`} className={pill}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <span className="sr-only">{list.join(", ")}</span>
    </div>
  );
}
