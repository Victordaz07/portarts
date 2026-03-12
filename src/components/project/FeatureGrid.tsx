import type { Project } from "@/lib/types";

interface FeatureGridProps {
  features: Project["features"];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  if (!features?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {features.map((feature, i) => (
        <div
          key={i}
          className="p-4 bg-surface border border-border rounded-card transition-all hover:border-border-hover"
        >
          <h4 className="text-sm font-medium text-text-primary mb-1">
            {feature.title}
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed font-light">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
