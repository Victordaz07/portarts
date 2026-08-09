import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { deleteProject, getProjectById, updateProject } from "@/lib/data-server";
import type { Project } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const project = await getProjectById(id);
  return NextResponse.json({ project });
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  let body: Partial<Project>;
  try {
    body = (await request.json()) as Partial<Project>;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  await updateProject(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
