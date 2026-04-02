"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export function AnimatedStat({
  value,
  suffix = "",
  label,
  duration = 1200,
}: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px",
  });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | undefined;
    let animFrame = 0;

    const animate = (timestamp: number) => {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="flex flex-col min-w-0">
      <span className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">
        {count}
        {suffix}
      </span>
      <span className="text-sm text-text-secondary mt-0.5 leading-tight">
        {label}
      </span>
    </div>
  );
}
