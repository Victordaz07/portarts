"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ReadmeViewerProps {
  repo: string;
}

export function ReadmeViewer({ repo }: ReadmeViewerProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repo) {
      setLoading(false);
      return;
    }

    fetch(`/api/github?repo=${encodeURIComponent(repo)}&file=readme`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load README");
        return res.text();
      })
      .then((content) => {
        setHtml(content);
        setError(null);
      })
      .catch((err) => setError(err.message))
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
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-text-muted py-8">
        Could not load README for &quot;{repo}&quot;.
      </p>
    );
  }

  if (!html) return null;

  return (
    <div
      id="readme-container"
      className="readme-content prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
