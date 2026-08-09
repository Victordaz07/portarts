import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { getPortfolioConfig, updatePortfolioConfig } from "@/lib/data-server";
import type { PortfolioConfig } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const config = await getPortfolioConfig();
  return NextResponse.json({ config });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  let body: Partial<PortfolioConfig>;
  try {
    body = (await request.json()) as Partial<PortfolioConfig>;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  await updatePortfolioConfig(body);
  return NextResponse.json({ ok: true });
}
