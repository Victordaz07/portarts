import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

const SITE_URL = "https://portarts.vercel.app";

const DEFAULT_TITLE = "Victor Ruiz — Frontend Developer";
const DEFAULT_DESCRIPTION =
  "Frontend Developer building real products for real problems. React, Next.js, TypeScript, Tailwind CSS.";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPortfolioConfig();
  const titleDefault = config?.title?.trim() || DEFAULT_TITLE;
  const description = config?.metaDescription?.trim() || DEFAULT_DESCRIPTION;
  const ogImages = config?.ogImage?.trim()
    ? [
        {
          url: config.ogImage.trim(),
          width: 1200,
          height: 630,
          alt: titleDefault,
        },
      ]
    : [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Victor Ruiz — Frontend Developer",
        },
      ];

  return {
    title: {
      default: titleDefault,
      template: "%s | Victor Ruiz",
    },
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      url: SITE_URL,
      title: titleDefault,
      description,
      siteName: "Victor Ruiz Portfolio",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description:
        "Frontend Developer building real products for real problems.",
      images: ogImages.map((img) => img.url),
      creator: "@victordaz07",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Victor Ruiz",
  url: SITE_URL,
  jobTitle: "Frontend Developer",
  description:
    "Frontend Developer building real products for real problems.",
  sameAs: ["https://github.com/Victordaz07"],
};

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
        <Script
          src="https://kit.fontawesome.com/e566ecdb3d.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
        <AuthProvider>
          <Suspense fallback={<div className="min-h-screen bg-bg" aria-hidden />}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
