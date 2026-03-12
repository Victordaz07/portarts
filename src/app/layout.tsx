import type { Metadata } from "next";
import { Instrument_Serif, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientBlobs } from "@/components/layout/AmbientBlobs";
import { AuthProvider } from "@/context/AuthContext";
import { getPortfolioConfig } from "@/lib/firestore";

export const dynamic = "force-dynamic";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

const outfit = Outfit({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
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
  const config = await getPortfolioConfig();

  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body antialiased">
        <AmbientBlobs />
        <AuthProvider>
          <Navbar />
          <div className="relative z-10 max-w-[1240px] mx-auto px-4 md:px-12">
            <main className="pt-20">{children}</main>
            <Footer name={config?.name ?? "Victor"} />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
