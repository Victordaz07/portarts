import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { createProject, getAllProjects } from "@/lib/data-server";
import type { Project } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const projects = await getAllProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  let body: Omit<Project, "id" | "createdAt" | "updatedAt">;
  try {
    body = (await request.json()) as Omit<Project, "id" | "createdAt" | "updatedAt">;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!body?.slug) {
    return NextResponse.json({ error: "Falta slug" }, { status: 400 });
  }
  const id = await createProject(body);
  revalidatePath("/");
  return NextResponse.json({ id }, { status: 201 });
}
