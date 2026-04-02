import Image from "next/image";
import type { ReactNode } from "react";
import {
  Bot,
  Flame,
  Sparkles,
  SquareTerminal,
  Wind,
  FileCode2,
} from "lucide-react";

/** Normaliza etiquetas desde Firestore o fallback. */
function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Icono / logo por herramienta: Font Awesome (kit en layout),
 * Next/Image para Next.js, Lucide para el resto donde no hay marca FA.
 */
export function renderTechIcon(name: string): ReactNode {
  const n = norm(name);

  if (n === "react" || n === "react.js") {
    return (
      <i
        className="fa-brands fa-react text-[1.65rem] leading-none"
        style={{ color: "#61DAFB" }}
        aria-hidden
      />
    );
  }

  if (n === "next.js" || n === "nextjs" || n === "next") {
    return (
      <Image
        src="/next.svg"
        alt=""
        width={90}
        height={24}
        className="h-5 w-auto max-w-22 opacity-[0.92]"
      />
    );
  }

  if (n === "typescript" || n === "ts") {
    return (
      <FileCode2
        className="h-7 w-7 text-[#3178C6]"
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }

  if (n.includes("tailwind")) {
    return (
      <Wind
        className="h-7 w-7 text-cyan-500"
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }

  if (n.includes("firebase")) {
    return (
      <Flame
        className="h-7 w-7 text-amber-500"
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }

  if (n === "figma") {
    return (
      <i
        className="fa-brands fa-figma text-[1.5rem] leading-none"
        style={{ color: "#F24E1E" }}
        aria-hidden
      />
    );
  }

  if (n.includes("framer")) {
    return (
      <i
        className="fa-brands fa-framer text-[1.45rem] leading-none text-text-primary"
        aria-hidden
      />
    );
  }

  if (n === "cursor") {
    return (
      <SquareTerminal
        className="h-7 w-7 text-slate-700"
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }

  if (n.includes("claude")) {
    return (
      <Sparkles
        className="h-7 w-7 text-orange-500"
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }

  if (n.includes("gpt") || n.includes("chatgpt")) {
    return (
      <Bot
        className="h-7 w-7 text-emerald-600"
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }

  if (n.includes("gemini")) {
    return (
      <i
        className="fa-brands fa-google text-[1.45rem] leading-none text-[#4285F4]"
        aria-hidden
      />
    );
  }

  return (
    <i
      className="fa-solid fa-layer-group text-[1.35rem] text-text-muted"
      aria-hidden
    />
  );
}
