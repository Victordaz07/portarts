interface ResumeButtonProps {
  variant?: "default" | "ghost";
  className?: string;
}

export function ResumeButton({
  variant = "default",
  className = "",
}: ResumeButtonProps) {
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL ?? "";

  const base =
    "inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors duration-150";
  const variantClass =
    variant === "ghost"
      ? "border-transparent hover:bg-surface"
      : "border-border hover:bg-surface";

  if (!resumeUrl.trim()) {
    return (
      <span
        role="button"
        aria-disabled="true"
        title="Resume URL not configured — set NEXT_PUBLIC_RESUME_URL to enable download"
        className={`${base} ${variantClass} ${className} opacity-50 cursor-not-allowed pointer-events-none`.trim()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download Resume
      </span>
    );
  }

  return (
    <a
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      download
      className={`${base} ${variantClass} ${className}`.trim()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download Resume
    </a>
  );
}
