"use client";

interface TechMarqueeProps {
  items: string[];
}

export function TechMarquee({ items }: TechMarqueeProps) {
  if (items.length === 0) return null;

  const duplicated = [...items, ...items];

  return (
    <div className="py-10 overflow-hidden bg-[#f9fafb] border-y border-border">
      <div
        className="flex gap-4 w-max"
        style={{ animation: "marquee 34s linear infinite" }}
      >
        {duplicated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="text-sm text-text-secondary px-3 py-1.5 shrink-0 rounded-full bg-white border border-border"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
