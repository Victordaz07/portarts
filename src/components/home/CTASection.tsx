import Link from "next/link";

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
  const whatsappUrl = "https://wa.me/16508983153";
  const links = [
    { url: email ? `mailto:${email}` : undefined, label: "Email" },
    { url: socialLinks?.github, label: "GitHub" },
    { url: socialLinks?.linkedin, label: "LinkedIn" },
    { url: socialLinks?.twitter, label: "Twitter" },
    { url: socialLinks?.website, label: "Website" },
  ].filter((l) => l.url);

  return (
    <section className="py-20 px-6 md:px-10 text-center bg-bg-raised border border-border rounded-2xl">
      <h2 className="text-3xl md:text-5xl mb-4 font-bold text-text-primary">
        Ready to
        <br />
        <em className="text-accent not-italic">build</em> together?
      </h2>
      <p className="text-text-secondary max-w-[460px] mx-auto mb-8 leading-relaxed">
        Always open to collaborate on ambitious projects.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-accent text-[#080a0c] font-semibold hover:brightness-110 transition-all"
          style={{ color: "#080a0c" }}
        >
          Start conversation
        </Link>
        {links.map(({ url, label }) => (
          <Link
            key={label}
            href={url!}
            target={url!.startsWith("mailto:") ? undefined : "_blank"}
            rel={url!.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border text-text-primary font-medium hover:border-accent hover:text-accent transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
