import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB safety cap

/**
 * Uploads an image to Vercel Blob (replaces Firebase Storage). Admin-only.
 * Expects multipart/form-data with `file` and optional `projectId`.
 * Returns the public Blob URL.
 */
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob no está configurado. Añade el Blob store en Vercel (o define BLOB_READ_WRITE_TOKEN en local).",
      },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulario inválido" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Archivo demasiado grande (máx 8 MB)" }, { status: 413 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 415 });
  }

  const projectId = (form.get("projectId") as string | null)?.trim() || "misc";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "image";
  const pathname = `projects/${projectId}/${Date.now()}-${safeName}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "No se pudo subir la imagen" }, { status: 500 });
  }
}
