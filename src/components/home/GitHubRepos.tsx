"use client";

import { useEffect, useState } from "react";
import { Star, GitFork } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
};

interface GitHubReposProps {
  username: string;
}

export function GitHubRepos({ username }: GitHubReposProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setError("GitHub not configured.");
      return;
    }

    fetch(`/api/github?user=${username}&type=repos`)
      .then((res) => {
        if (!res.ok) throw new Error("Error loading repos");
        return res.json();
      })
      .then((data: Repo[]) => {
        setRepos(data);
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
            className="p-5 bg-bg-card border border-border rounded-card animate-pulse h-32"
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
          className="block p-5 bg-bg-card border border-border rounded-card transition-all duration-350 hover:border-border-hover hover:-translate-y-0.5 hover:bg-bg-hover no-underline text-inherit"
        >
          <h4 className="font-mono text-sm text-accent mb-2 font-medium">
            📦 {repo.name}
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">
            {repo.description || "No description"}
          </p>
          <div className="flex gap-4 text-xs text-text-muted">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: LANG_COLORS[repo.language] ?? "#888",
                  }}
                />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {repo.forks_count}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
