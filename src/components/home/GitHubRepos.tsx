"use client";

import { useEffect, useState } from "react";
import { Star, GitFork } from "lucide-react";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
};

const REPO_DESCRIPTIONS: Record<string, string> = {
  lineuponline: "Multilingual gospel study platform with structured lessons, interactive modules, and offline-ready access.",
  portarts: "Full-stack portfolio and case-study platform built with Next.js, PostgreSQL, authentication, and an admin workspace.",
  "shomercare-demo": "Offline-first scheduling and operations tool with shift coordination, WhatsApp workflows, and QR sync.",
  Bautizapp: "Offline-first tool for creating multilingual baptism programs, invitations, and downloadable PDFs.",
  Callings: "Assignment and calling-management workspace designed for clearer coordination and follow-up.",
  "mapa.biblico": "Interactive biblical map and study experience for exploring places, events, and scriptural context.",
};

interface GitHubReposProps {
  username: string;
}

export function GitHubRepos({ username }: GitHubReposProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(() => Boolean(username));
  const [error, setError] = useState<string | null>(() =>
    username ? null : "GitHub not configured.",
  );

  useEffect(() => {
    if (!username) {
      return;
    }

    fetch(`/api/github?user=${username}&type=repos`)
      .then((res) => {
        if (!res.ok) throw new Error("Error loading repos");
        return res.json();
      })
      .then((data: unknown) => {
        setRepos(Array.isArray(data) ? (data as Repo[]) : []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 bg-white/[0.03] border border-border rounded-lg animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center py-12 text-rose">
        {error}
      </p>
    );
  }

  if (repos.length === 0) {
    return (
      <p className="text-center py-12 text-text-muted">
        No public repos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => (
        <a
          key={repo.name}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-5 bg-white/[0.03] border border-border rounded-lg transition-all duration-300 hover:border-border-hover hover:bg-white/[0.05] hover:-translate-y-0.5 no-underline text-inherit"
        >
          <h4 className="text-base text-text-primary mb-2 font-bold transition-colors hover:text-accent">
            {repo.name}
          </h4>
          <p className="text-sm leading-relaxed mb-3 line-clamp-2 text-text-secondary">
            {repo.description || REPO_DESCRIPTIONS[repo.name] || "Selected public repository by Victor Ruiz."}
          </p>
          <div className="flex gap-4 text-xs text-text-secondary">
            {repo.language && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
                  repo.language === "JavaScript"
                    ? "bg-[#333333] text-[#f7df1e]"
                    : repo.language === "TypeScript"
                      ? "bg-cyan text-white"
                      : "bg-white/8 text-text-secondary"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: LANG_COLORS[repo.language] ?? "#888",
                  }}
                />
                {repo.language}
              </span>
            )}
            {repo.stargazers_count > 0 ? (
              <span className="flex items-center gap-1" aria-label={`${repo.stargazers_count} stars`}>
                <Star className="w-3.5 h-3.5" aria-hidden />
                {repo.stargazers_count}
              </span>
            ) : null}
            {repo.forks_count > 0 ? (
              <span className="flex items-center gap-1" aria-label={`${repo.forks_count} forks`}>
                <GitFork className="w-3.5 h-3.5" aria-hidden />
                {repo.forks_count}
              </span>
            ) : null}
          </div>
        </a>
      ))}
    </div>
  );
}
