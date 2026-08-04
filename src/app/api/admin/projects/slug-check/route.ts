import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { isSlugUnique } from "@/lib/data-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim() ?? "";
  const excludeId = searchParams.get("excludeId")?.trim() || undefined;
  if (!slug) {
    return NextResponse.json({ error: "Falta slug" }, { status: 400 });
  }
  const unique = await isSlugUnique(slug, excludeId);
  return NextResponse.json({ unique, exists: !unique });
}
