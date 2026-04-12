import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      /** Buckets con nombre `*.firebasestorage.app` (Firebase 2024+) pueden servir por este host. */
      { protocol: "https", hostname: "*.firebasestorage.app" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      /** Capturas en previews de Vercel u otros despliegues. */
      { protocol: "https", hostname: "*.vercel.app" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
