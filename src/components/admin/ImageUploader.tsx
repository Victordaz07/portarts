"use client";

import { useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

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
}

export function ImageUploader({
  projectId,
  onUpload,
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    setUploading(true);
    try {
      let blob: Blob = file;
      if (file.size > 500 * 1024) {
        blob = await compressImage(file, 1200, 0.8);
      }
      const ext = file.size > 500 * 1024 ? "webp" : file.name.split(".").pop() ?? "webp";
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const path = `projects/${projectId}/${Date.now()}-${baseName}.${ext}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      onUpload(url, caption);
      setCaption("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={disabled || uploading}
        className="hidden"
        id="gallery-upload"
      />
      <label
        htmlFor="gallery-upload"
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
  );
}
