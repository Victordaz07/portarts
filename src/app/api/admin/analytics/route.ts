import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { getAnalyticsDailyRange } from "@/lib/data-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const daysRaw = Number(searchParams.get("days") ?? "30");
  const days = Number.isFinite(daysRaw)
    ? Math.min(Math.max(1, Math.trunc(daysRaw)), 365)
    : 30;
  const rows = await getAnalyticsDailyRange(days);
  return NextResponse.json({ days: rows });
}
