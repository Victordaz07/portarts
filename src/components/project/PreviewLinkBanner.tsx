import { ExternalLink } from "lucide-react";

interface PreviewLinkBannerProps {
  url: string;
  label: string;
  className?: string;
}

/**
 * Replaces an iframe when a URL blocks embedding (X-Frame-Options / CSP).
 * Self-contained “small banner” — not a second hero image.
 */
export function PreviewLinkBanner({
  url,
  label,
  className = "",
}: PreviewLinkBannerProps) {
  let host = url;
  try {
    host = new URL(url).hostname;
  } catch {
    /* keep raw */
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-bg-hover hover:border-accent/25 ${className}`}
      data-analytics-section="preview-link-banner"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg border border-border text-text-secondary group-hover:text-accent"
        aria-hidden
      >
        <ExternalLink className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-medium text-text-primary">{label}</span>
        <span className="block text-sm text-text-muted truncate">{host}</span>
        <span className="mt-1 block text-xs leading-snug text-text-muted">
          Las vistas incrustadas suelen fallar con PWAs o Firebase (cookies en terceros). Se abre en
          una pestaña nueva.
        </span>
      </span>
      <span className="shrink-0 text-sm font-medium text-accent group-hover:underline">
        Abrir →
      </span>
    </a>
  );
}
