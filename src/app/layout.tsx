import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/utils/providers";
import { Navigation } from "@/components/layouts/navigation";
import { NavigationBottom } from "@/components/layouts/navigation-bottom";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { homePageMetadata } from "./meta";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = homePageMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0891B2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakarta.variable} ${sora.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <JsonLd />
        <Providers>
          <div className="sticky top-0 z-[100] shadow-[0_10px_28px_-14px_rgba(8,145,178,0.35)]">
            <Header />
            <Navigation />
          </div>
          <NavigationBottom />
          <main className="container mx-auto max-w-[1320px] py-6 md:py-8 px-4 md:px-6 pb-24 md:pb-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
