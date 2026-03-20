"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  /** Anchor for in-page links (e.g. from sidebar hints) */
  id?: string;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  id,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div id={id} className="border border-border rounded-card overflow-hidden scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-bg-card hover:bg-bg-hover transition-colors text-left"
      >
        <span className="font-medium text-text-primary">{title}</span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-muted" />
        )}
      </button>
      {open && <div className="p-4 border-t border-border">{children}</div>}
    </div>
  );
}
