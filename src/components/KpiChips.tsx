export interface KpiChip {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface KpiChipsProps {
  kpis: KpiChip[];
  className?: string;
}

export function KpiChips({ kpis, className }: KpiChipsProps) {
  if (!kpis || kpis.length === 0) return null;

  const rootClass = ["flex items-center gap-3 flex-wrap", className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      {kpis.map((kpi, index) => (
        <div
          key={`${kpi.label}-${kpi.value}-${index}`}
          className="flex flex-col items-start px-3 py-2 rounded-lg bg-surface border border-border/60 min-w-[72px]"
        >
          <span className="text-lg font-semibold leading-none tracking-tight text-text-primary">
            {kpi.prefix ?? ""}
            {kpi.value}
            {kpi.suffix ?? ""}
          </span>
          <span className="text-[11px] text-text-secondary mt-1 leading-tight">
            {kpi.label}
          </span>
        </div>
      ))}
    </div>
  );
}
