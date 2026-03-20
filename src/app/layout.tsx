import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";
import { getPortfolioConfig } from "@/lib/firestore-server";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPortfolioConfig();
  return {
    title: config?.title ?? "PortArts — Interactive Portfolio",
    description: config?.metaDescription ?? "Personal portfolio with live app previews",
    openGraph: {
      images: config?.ogImage ? [config.ogImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-body antialiased bg-bg text-text-primary">
        <AuthProvider>
          <Suspense fallback={<div className="min-h-screen bg-bg" aria-hidden />}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
