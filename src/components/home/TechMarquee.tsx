"use client";

interface TechMarqueeProps {
  items: string[];
}

export function TechMarquee({ items }: TechMarqueeProps) {
  if (items.length === 0) return null;

  const duplicated = [...items, ...items];

  return (
    <div className="py-12 overflow-hidden">
      <div
        className="flex gap-8 w-max"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        {duplicated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-mono text-sm text-text-muted px-4 shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
