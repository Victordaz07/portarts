"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function shouldTrack(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.pathname.startsWith("/admin")) return false;
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG_LOCAL !== "true") {
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return false;
  }
  return true;
}

function getOrCreateSessionId(): string {
  try {
    const k = "portarts_analytics_sid";
    let id = sessionStorage.getItem(k);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(k, id);
    }
    return id;
  } catch {
    return `fallback-${Date.now()}`;
  }
}

export function PortfolioSessionTracker() {
  const pathname = usePathname();
  const startRef = useRef<number>(0);
  const maxScrollRef = useRef(0);
  const lastSectionRef = useRef("unknown");
  const ratiosRef = useRef<Record<string, number>>({});
  const sentRef = useRef(false);

  useEffect(() => {
    if (!shouldTrack()) return;
    sentRef.current = false;
    startRef.current =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    maxScrollRef.current = 0;
    lastSectionRef.current = "unknown";
    ratiosRef.current = {};

    const pathForSession =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : pathname;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const h = doc.scrollHeight - window.innerHeight;
      const pct = h <= 0 ? 100 : Math.min(100, Math.round((scrollTop / h) * 100));
      if (pct > maxScrollRef.current) maxScrollRef.current = pct;
    };

    let scrollT: ReturnType<typeof setTimeout> | undefined;
    const throttledScroll = () => {
      if (scrollT) return;
      scrollT = setTimeout(() => {
        scrollT = undefined;
        onScroll();
      }, 150);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    const els = document.querySelectorAll<HTMLElement>("[data-analytics-section]");
    const observers: IntersectionObserver[] = [];

    if (els.length > 0 && typeof IntersectionObserver !== "undefined") {
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const id = e.target.getAttribute("data-analytics-section") ?? "unknown";
            const prev = ratiosRef.current[id] ?? 0;
            if (e.intersectionRatio > prev) {
              ratiosRef.current[id] = e.intersectionRatio;
            }
            if (e.isIntersecting && e.intersectionRatio >= 0.35) {
              lastSectionRef.current = id;
            }
          }
          let best = "unknown";
          let bestR = 0;
          for (const [k, v] of Object.entries(ratiosRef.current)) {
            if (v > bestR) {
              bestR = v;
              best = k;
            }
          }
          if (bestR > 0.2) lastSectionRef.current = best;
        },
        { threshold: [0, 0.15, 0.35, 0.55, 0.75, 1] },
      );
      els.forEach((el) => obs.observe(el));
      observers.push(obs);
    }

    const send = () => {
      if (sentRef.current) return;
      sentRef.current = true;
      onScroll();
      const end =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const durationMs = Math.round(end - startRef.current);
      const projectMatch = pathForSession.match(/^\/project\/([^/?#]+)/);
      const projectSlug = projectMatch?.[1] ?? null;

      const payload = JSON.stringify({
        path: pathForSession,
        durationMs,
        maxScrollPct: maxScrollRef.current,
        lastSection: lastSectionRef.current,
        projectSlug,
        sessionId: getOrCreateSessionId(),
      });

      void fetch("/api/analytics/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
        credentials: "same-origin",
      }).catch(() => {});
    };

    const onVis = () => {
      if (document.visibilityState === "hidden") send();
    };

    const onPageHide = () => send();

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      observers.forEach((o) => o.disconnect());
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onPageHide);
      if (scrollT) clearTimeout(scrollT);
      if (!sentRef.current) send();
    };
  }, [pathname]);

  return null;
}
