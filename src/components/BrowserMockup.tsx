import Image from "next/image";
import { cn } from "@/lib/cn";

export interface BrowserMockupProps {
  src: string;
  alt: string;
  className?: string;
}

export function BrowserMockup({ src, alt, className }: BrowserMockupProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        "border border-border",
        "bg-surface/40",
        "shadow-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5",
          "px-4 py-3",
          "bg-surface/60",
          "border-b border-border/50",
        )}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        <div
          className={cn(
            "flex-1 mx-3",
            "h-5 rounded-md",
            "bg-bg/90",
            "border border-border/50",
            "flex items-center justify-center",
          )}
        >
          <span className="text-[10px] text-text-muted/70 tracking-tight">
            portarts.vercel.app
          </span>
        </div>
      </div>
      <div className="relative w-full aspect-video">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
