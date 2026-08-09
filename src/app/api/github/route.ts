import { NextRequest, NextResponse } from "next/server";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
  // Limpiar cache viejo si crece mucho
  if (cache.size > 100) {
    const now = Date.now();
    for (const [k, v] of cache) {
      if (now - v.timestamp > CACHE_TTL) cache.delete(k);
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user");
  const type = searchParams.get("type");
  const repo = searchParams.get("repo");
  const file = searchParams.get("file");

  const token = process.env.GITHUB_TOKEN;

  // List user repos.
  // Degrades gracefully: any upstream failure (rate limit, 401/403, network)
  // returns an empty list with a 200 so the public site shows a neutral
  // "No public repos" state instead of a red error. The reason is surfaced in
  // the `X-GitHub-Notice` header for debugging.
  if (user && type === "repos") {
    const url = `https://api.github.com/users/${user}/repos?sort=updated&per_page=6&type=owner`;
    const cached = getCached(url);
    if (cached !== null) {
      return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });
    }

    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        const remaining = res.headers.get("X-RateLimit-Remaining");
        const notice =
          res.status === 403 && (remaining === "0" || !remaining)
            ? "GitHub rate limit reached — set GITHUB_TOKEN to raise it."
            : `GitHub API returned ${res.status}.`;
        return NextResponse.json([], {
          headers: { "X-Cache": "MISS", "X-GitHub-Notice": notice },
        });
      }

      const data = await res.json();
      const repos = Array.isArray(data) ? data : [];
      setCache(url, repos);
      return NextResponse.json(repos, { headers: { "X-Cache": "MISS" } });
    } catch (err) {
      console.error("GitHub repos error:", err);
      return NextResponse.json([], {
        headers: { "X-Cache": "MISS", "X-GitHub-Notice": "GitHub unreachable." },
      });
    }
  }

  // Get README (rendered as HTML). Consumed inside an ErrorBoundary on the
  // project page, so surfacing a non-200 here is acceptable.
  if (repo && file === "readme") {
    const url = `https://api.github.com/repos/${repo}/readme`;
    const cached = getCached(url);
    if (cached !== null && typeof cached === "string") {
      return new NextResponse(cached, {
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Cache": "HIT" },
      });
    }

    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3.html",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.status === 403) {
        const remaining = res.headers.get("X-RateLimit-Remaining");
        if (remaining === "0" || !remaining) {
          return NextResponse.json(
            {
              error:
                "Rate limit de GitHub alcanzado. Configura GITHUB_TOKEN para aumentar el límite.",
            },
            { status: 429, headers: { "X-Cache": "MISS" } }
          );
        }
      }

      if (res.status === 404) {
        return NextResponse.json({ error: "README not found" }, { status: 404 });
      }
      if (!res.ok) {
        return NextResponse.json(
          { error: `GitHub API: ${res.status}` },
          { status: 502 }
        );
      }

      const html = await res.text();
      setCache(url, html);
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Cache": "MISS" },
      });
    } catch (err) {
      console.error("GitHub README error:", err);
      return NextResponse.json({ error: "GitHub unreachable" }, { status: 502 });
    }
  }

  return NextResponse.json(
    { error: "Missing params: user+type=repos or repo+file=readme" },
    { status: 400 }
  );
}
