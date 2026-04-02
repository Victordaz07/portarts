import Image from "next/image";
import { cn } from "@/lib/cn";

export interface MobileMockupProps {
  src: string;
  alt: string;
  className?: string;
}

export function MobileMockup({ src, alt, className }: MobileMockupProps) {
  return (
    <div
      className={cn(
        "relative mx-auto",
        "w-[220px] md:w-[260px]",
        className,
      )}
    >
      <div
        className={cn(
          "relative rounded-[2.5rem]",
          "border-[6px] border-black/10",
          "bg-black/5",
          "overflow-hidden",
          "shadow-sm",
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-1/2",
            "-translate-x-1/2",
            "w-24 h-5",
            "bg-black/10",
            "rounded-b-xl",
            "z-10",
          )}
        />
        <div className="relative w-full aspect-9/19.5 overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 220px, 260px"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
