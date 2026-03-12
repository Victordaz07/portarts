import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface CTASectionProps {
  email?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export function CTASection({ email, socialLinks }: CTASectionProps) {
  const links = [
    { url: socialLinks?.github, label: "GitHub" },
    { url: socialLinks?.linkedin, label: "LinkedIn" },
    { url: socialLinks?.twitter, label: "Twitter" },
    { url: socialLinks?.website, label: "Website" },
  ].filter((l) => l.url);

  return (
    <section className="py-24 text-center">
      <h2 className="font-display text-3xl md:text-5xl mb-4">
        Ready to
        <br />
        <em className="text-accent not-italic">build</em> together?
      </h2>
      <p className="text-text-secondary max-w-[400px] mx-auto mb-8 leading-relaxed">
        Always open to collaborate on ambitious projects.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        {email ? (
          <a href={`mailto:${email}`}>
            <Button variant="primary" size="lg">
              Start conversation
            </Button>
          </a>
        ) : (
          <Button variant="primary" size="lg" disabled>
            Start conversation
          </Button>
        )}
        {links.map(({ url, label }) => (
          <Link key={label} href={url!} target="_blank">
            <Button variant="secondary" size="lg">
              {label}
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
