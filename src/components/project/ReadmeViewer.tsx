"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ReadmeViewerProps {
  repo: string;
}

export function ReadmeViewer({ repo }: ReadmeViewerProps) {
  const [html, setHtml] = useState<string | null>(null);
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
      .then((content) => {
        setHtml(content);
        setFailed(false);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [repo]);

  useEffect(() => {
    if (!html) return;
    const container = document.getElementById("readme-container");
    if (!container) return;

    container.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("http")) {
        img.src = `https://raw.githubusercontent.com/${repo}/main/${src.replace(/^\//, "")}`;
      }
    });
  }, [html, repo]);

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

  if (failed || !html) return null;

  return (
    <>
      <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
        📄 README
      </h2>
      <div className="bg-bg-raised border border-border rounded-card p-6 max-h-[500px] overflow-y-auto">
        <div
          id="readme-container"
          className="readme-content prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  );
}
