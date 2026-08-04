import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { recordAnalyticsSession } from "@/lib/data-server";

export const runtime = "nodejs";

const MAX_DURATION_MS = 30 * 60 * 1000;

function sanitizeKey(key: string, max = 64): string {
  const s = key.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, max);
  return s.length > 0 ? s : "unknown";
}

/** Clave estable para pathCounts (sin caracteres problemáticos en mapas). */
function pathToKey(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p === "/") return "home";
  return p.slice(1).replace(/\//g, "__").slice(0, 120);
}

function parseAllowedHosts(): Set<string> {
  const hosts = new Set<string>();
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    try {
      hosts.add(new URL(site).hostname);
    } catch {
      /* ignore */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    try {
      hosts.add(new URL(`https://${vercel}`).hostname);
    } catch {
      hosts.add(vercel.replace(/^https?:\/\//, "").split("/")[0] ?? vercel);
    }
  }
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG_LOCAL === "true") {
    hosts.add("localhost");
    hosts.add("127.0.0.1");
  }
  return hosts;
}

/** Hostname de la petición (dominio por el que llegó el usuario al despliegue). */
function getRequestHostname(request: Request): string | null {
  const xf = request.headers.get("x-forwarded-host");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first.split(":")[0]?.toLowerCase() ?? null;
  }
  const host = request.headers.get("host");
  if (!host) return null;
  return host.split(":")[0]?.toLowerCase() ?? null;
}

function isAllowedOrigin(
  origin: string | null,
  referer: string | null,
  requestHostname: string | null,
): boolean {
  const hosts = parseAllowedHosts();
  const tryParse = (u: string | null) => {
    if (!u) return null;
    try {
      return new URL(u);
    } catch {
      return null;
    }
  };
  const o = tryParse(origin) ?? (referer ? tryParse(referer) : null);
  if (!o) return false;
  if (
    process.env.NODE_ENV === "development" &&
    (o.hostname === "localhost" || o.hostname === "127.0.0.1")
  ) {
    return true;
  }
  // Mismo despliegue: el usuario visita por el mismo host que declara Origin (p. ej. dominio custom sin NEXT_PUBLIC_SITE_URL).
  if (requestHostname && o.hostname.toLowerCase() === requestHostname) {
    return true;
  }
  if (hosts.size === 0) {
    return (
      o.hostname === "localhost" ||
      o.hostname === "127.0.0.1" ||
      o.hostname.endsWith(".vercel.app")
    );
  }
  return hosts.has(o.hostname);
}

interface SessionBody {
  path?: string;
  durationMs?: number;
  maxScrollPct?: number;
  lastSection?: string;
  projectSlug?: string | null;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if (!isAllowedOrigin(origin, referer, getRequestHostname(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: SessionBody;
  try {
    body = (await request.json()) as SessionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 500) : "";
  const durationMs =
    typeof body.durationMs === "number"
      ? Math.min(Math.max(0, body.durationMs), MAX_DURATION_MS)
      : 0;
  const maxScrollPct =
    typeof body.maxScrollPct === "number"
      ? Math.min(100, Math.max(0, body.maxScrollPct))
      : 0;
  const lastSection = sanitizeKey(
    typeof body.lastSection === "string" ? body.lastSection : "unknown",
  );
  const projectSlugRaw =
    typeof body.projectSlug === "string" && body.projectSlug.length > 0
      ? body.projectSlug
      : null;
  const projectSlug = projectSlugRaw ? sanitizeKey(projectSlugRaw, 80) : null;

  if (!isDbConfigured()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await recordAnalyticsSession({
      pathKey: pathToKey(path || "/"),
      lastSection,
      durationMs,
      maxScrollPct,
      projectSlug,
    });
  } catch (e) {
    console.error("[analytics/session]", e);
    return NextResponse.json({ error: "Write failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
