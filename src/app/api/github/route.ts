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

  try {
    // List user repos
    if (user && type === "repos") {
      const url = `https://api.github.com/users/${user}/repos?sort=updated&per_page=6&type=owner`;
      const cacheKey = url;
      const cached = getCached(cacheKey);
      if (cached !== null) {
        return NextResponse.json(cached, {
          headers: { "X-Cache": "HIT" },
        });
      }

      const res = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.status === 403) {
        const remaining = res.headers.get("X-RateLimit-Remaining");
        if (remaining === "0" || !remaining) {
          return NextResponse.json(
            {
              error:
                "Rate limit de GitHub alcanzado. Configura GITHUB_TOKEN en .env.local para aumentar el límite.",
            },
            { status: 429, headers: { "X-Cache": "MISS" } }
          );
        }
      }

      if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
      const data = await res.json();
      setCache(cacheKey, data);
      return NextResponse.json(data, {
        headers: { "X-Cache": "MISS" },
      });
    }

    // Get README
    if (repo && file === "readme") {
      const url = `https://api.github.com/repos/${repo}/readme`;
      const cacheKey = url;
      const cached = getCached(cacheKey);
      if (cached !== null && typeof cached === "string") {
        return new NextResponse(cached, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Cache": "HIT",
          },
        });
      }

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
                "Rate limit de GitHub alcanzado. Configura GITHUB_TOKEN en .env.local para aumentar el límite.",
            },
            { status: 429, headers: { "X-Cache": "MISS" } }
          );
        }
      }

      if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
      const html = await res.text();
      setCache(cacheKey, html);
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Cache": "MISS",
        },
      });
    }

    return NextResponse.json(
      { error: "Missing params: user+type=repos or repo+file=readme" },
      { status: 400 }
    );
  } catch (err) {
    console.error("GitHub API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "GitHub API error" },
      { status: 500 }
    );
  }
}
