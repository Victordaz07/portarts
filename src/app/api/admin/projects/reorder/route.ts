import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { reorderProjects } from "@/lib/data-server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  let body: { orderedIds?: unknown };
  try {
    body = (await request.json()) as { orderedIds?: unknown };
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const orderedIds = Array.isArray(body.orderedIds)
    ? body.orderedIds.filter((x): x is string => typeof x === "string")
    : [];
  await reorderProjects(orderedIds);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
