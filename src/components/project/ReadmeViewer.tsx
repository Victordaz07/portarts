"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ReadmeViewerProps {
  repo: string;
}

export function ReadmeViewer({ repo }: ReadmeViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [format, setFormat] = useState<"html" | "markdown">("html");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!repo) {
      setLoading(false);
      return;
    }

    fetch(`/api/github?repo=${encodeURIComponent(repo)}&file=readme`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.text();
      })
      .then(async (html) => {
        // Some repos/pages can return an effectively empty HTML payload.
        if (!html || html.trim().length < 40) {
          const raw = await fetch(
            `https://raw.githubusercontent.com/${repo}/main/README.md`
          );
          if (!raw.ok) throw new Error("raw readme not found");
          const markdown = await raw.text();
          setContent(markdown);
          setFormat("markdown");
        } else {
          setContent(html);
          setFormat("html");
        }
        setFailed(false);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [repo]);

  useEffect(() => {
    if (!content || format !== "html") return;
    const container = document.getElementById("readme-container");
    if (!container) return;

    container.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("http")) {
        img.src = `https://raw.githubusercontent.com/${repo}/main/${src.replace(/^\//, "")}`;
      }
    });
  }, [content, format, repo]);

  if (loading) {
    return (
      <>
        <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
          📄 README
        </h2>
        <div className="bg-bg-raised border border-border rounded-card p-6 flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (failed || !content) {
    return (
      <>
        <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
          📄 README
        </h2>
        <div className="bg-bg-raised border border-border rounded-card p-6">
          <p className="text-text-secondary text-sm mb-3">
            No se pudo cargar el README en línea para este repositorio.
          </p>
          <a
            href={`https://github.com/${repo}#readme`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium no-underline"
          >
            Ver README en GitHub
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
        📄 README
      </h2>
      <div className="bg-bg-raised border border-border rounded-card p-6 max-h-[500px] overflow-y-auto">
        {format === "html" ? (
          <div
            id="readme-container"
            className="readme-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="readme-content prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
}
