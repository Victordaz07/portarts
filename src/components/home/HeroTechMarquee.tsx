"use client";

import { useReducedMotion } from "framer-motion";
import { renderTechIcon } from "@/components/home/tech-stack-visual";
import { MARQUEE_DURATION_FRONTEND_SEC } from "@/lib/tech-stack";

/** Píldoras del stack dev — solo texto (marquee). */
function devPillClassName(): string {
  return "inline-flex shrink-0 items-center text-sm text-text-secondary px-3 py-1.5 rounded-full bg-white border border-border shadow-sm";
}

/** Píldora AI: icono a la izquierda, nombre a la derecha. */
function AiToolPill({ name }: { name: string }) {
  return (
    <div
      className="group inline-flex max-w-full items-center gap-2.5 rounded-full border border-border/40 bg-white py-1.5 pl-1.5 pr-4 shadow-sm transition-all duration-200 hover:border-slate-300/80 hover:shadow-md"
      title={name}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 ring-1 ring-[rgba(0,0,0,0.04)] [&_img]:max-h-[1.05rem] [&_img]:w-auto [&_i]:text-[1.05rem]">
        {renderTechIcon(name)}
      </span>
      <span className="truncate text-[13px] font-medium tracking-tight text-text-secondary">
        {name}
      </span>
    </div>
  );
}

function MarqueeTextTrack({
  items,
  durationSec,
}: {
  items: string[];
  durationSec: number;
}) {
  const list = items.length > 0 ? items : [];
  const pill = devPillClassName();
  const loop = [...list, ...list];

  return (
    <div className="w-full overflow-hidden rounded-md">
      <div
        className="flex w-max gap-4"
        style={{
          animation: `marquee ${durationSec}s linear infinite`,
        }}
      >
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className={pill}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

interface HeroDevStackMarqueeProps {
  frontendItems: string[];
}

/** Carril superior: solo marquee del stack dev (texto). */
export function HeroDevStackMarquee({ frontendItems }: HeroDevStackMarqueeProps) {
  const fe = frontendItems.length > 0 ? frontendItems : [];
  const reduceMotion = useReducedMotion();
  const pill = devPillClassName();

  if (reduceMotion) {
    return (
      <ul
        className="flex min-w-0 flex-1 flex-wrap justify-center gap-2 sm:justify-start"
        role="list"
        aria-label="Frontend stack"
      >
        {fe.map((item) => (
          <li key={item}>
            <span className={pill}>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="w-full min-w-0">
      <MarqueeTextTrack
        items={fe}
        durationSec={MARQUEE_DURATION_FRONTEND_SEC}
      />
      <span className="sr-only">Frontend stack: {fe.join(", ")}.</span>
    </div>
  );
}

interface AiWorkflowPillsProps {
  items: string[];
  className?: string;
}

/** Fila de píldoras AI (icono + nombre); pensado para colocar bajo el intro. */
export function AiWorkflowPills({ items, className = "" }: AiWorkflowPillsProps) {
  const ai = items.length > 0 ? items : [];
  if (ai.length === 0) return null;

  return (
    <div className={className} data-analytics-section="ai-workflow">
      <div
        className="flex flex-wrap gap-2.5 sm:gap-3"
        role="list"
        aria-label="AI workflow tools"
      >
        {ai.map((item) => (
          <AiToolPill key={item} name={item} />
        ))}
      </div>
      <span className="sr-only">{ai.join(", ")}</span>
    </div>
  );
}
