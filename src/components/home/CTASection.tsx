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

export function CTASection({ socialLinks }: CTASectionProps) {
  const whatsappUrl = "https://wa.me/16508983153";
  const links = [
    { url: socialLinks?.github, label: "GitHub" },
    { url: socialLinks?.linkedin, label: "LinkedIn" },
    { url: socialLinks?.twitter, label: "Twitter" },
    { url: socialLinks?.website, label: "Website" },
  ].filter((l) => l.url);

  return (
    <section className="py-20 px-6 md:px-10 text-center bg-black rounded-2xl">
      <h2 className="text-3xl md:text-5xl mb-4 font-bold text-white">
        Ready to
        <br />
        <em className="text-accent not-italic">build</em> together?
      </h2>
      <p className="text-[#a3a3a3] max-w-[460px] mx-auto mb-8 leading-relaxed">
        Always open to collaborate on ambitious projects.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity"
        >
          Start conversation
        </Link>
        {links.map(({ url, label }) => (
          <Link
            key={label}
            href={url!}
            target="_blank"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white text-white font-medium hover:bg-white hover:text-black transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
