"use client";

export function Footer({ name = "Victor" }: { name?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-7 border-t border-border flex justify-between items-center text-text-muted text-sm">
      <span>© {year} {name}</span>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="text-text-secondary hover:text-accent transition-colors cursor-pointer"
      >
        ↑ Back to top
      </button>
    </footer>
  );
}
