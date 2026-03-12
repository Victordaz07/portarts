import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="font-display text-3xl text-text-primary mb-4">
        Project not found
      </h1>
      <p className="text-text-secondary mb-8">
        The project you&apos;re looking for doesn&apos;t exist or isn&apos;t published.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-full font-medium hover:shadow-[0_6px_24px_rgba(232,197,71,0.3)] transition-all"
      >
        ← Back to home
      </Link>
    </div>
  );
}
