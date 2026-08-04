import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // GitHub (repo READMEs, avatars)
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Vercel Blob (project/cover/gallery uploads)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // OAuth provider avatars (Google) + Vercel preview screenshots
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "*.vercel.app" },
    ],
  },
};

export default nextConfig;
