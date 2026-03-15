"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

interface DemoCredentialsProps {
  url: string;
  email: string;
  password: string;
  disclaimer?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="p-1.5 rounded-md bg-bg-hover border border-border text-text-muted hover:text-accent hover:border-accent transition-all"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function DemoCredentials({
  url,
  email,
  password,
  disclaimer = "Demo account — data resets periodically",
}: DemoCredentialsProps) {
  return (
    <div className="mt-6 p-5 bg-surface border border-border rounded-card">
      <h4 className="font-display text-base text-text-primary mb-3 flex items-center gap-2">
        <span>🔗</span> Try it yourself
      </h4>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted font-mono w-16 shrink-0">URL</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-accent hover:underline flex items-center gap-1"
          >
            {url.replace("https://", "")}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted font-mono w-16 shrink-0">Email</span>
          <code className="text-sm font-mono text-text-primary flex-1">{email}</code>
          <CopyButton text={email} />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted font-mono w-16 shrink-0">Password</span>
          <code className="text-sm font-mono text-text-primary flex-1">{password}</code>
          <CopyButton text={password} />
        </div>
      </div>

      <p className="text-xs text-text-muted mt-3 italic">{disclaimer}</p>
    </div>
  );
}
