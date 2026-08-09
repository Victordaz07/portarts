"use client";

export function Footer({ name = "Victor Ruiz" }: { name?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 py-7 px-4 md:px-6 bg-bg-raised border-t border-border flex justify-between items-center text-text-secondary text-sm rounded-t-xl">
      <span>
        © {year} <span className="text-text-primary font-medium">{name}</span>
      </span>
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
