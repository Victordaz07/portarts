"use client";

import { useState, useRef } from "react";

async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Compression failed")),
        "image/webp",
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

interface ImageUploaderProps {
  projectId: string;
  onUpload: (url: string, caption: string) => void;
  disabled?: boolean;
  /** Distinct id when several uploaders share one form (label htmlFor + input id) */
  inputId?: string;
}

export function ImageUploader({
  projectId,
  onUpload,
  disabled = false,
  inputId = "gallery-upload",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    setUploading(true);
    setError(null);
    try {
      // Compress large images in the browser (keeps original name/ext otherwise).
      let blob: Blob = file;
      let filename = file.name;
      if (file.size > 500 * 1024) {
        blob = await compressImage(file, 1200, 0.8);
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        filename = `${baseName}.webp`;
      }

      const form = new FormData();
      form.append("file", blob, filename);
      form.append("projectId", projectId);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Error ${res.status} al subir la imagen`);
      }
      const { url } = (await res.json()) as { url: string };
      onUpload(url, caption);
      setCaption("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error ? (
        <p className="text-xs text-rose bg-rose/10 border border-rose/30 rounded-lg px-3 py-2 leading-snug">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2 flex-wrap">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={disabled || uploading}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className={`px-4 py-2 rounded-lg border border-border text-sm cursor-pointer transition-colors ${
            disabled || uploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-accent hover:bg-accent-dim"
          }`}
        >
          {uploading ? "Uploading…" : "+ Upload image"}
        </label>
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text-primary w-40"
        />
      </div>
    </div>
  );
}
