import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    `${SITE_NAME} adalah platform top-up game dan voucher digital terpercaya di Indonesia. Kenali visi, misi, dan layanan kami.`,
  openGraph: {
    title: `Tentang ${SITE_NAME} - Top Up Game Terpercaya`,
    description: "Platform top-up game terpercaya No.1 di Indonesia. Layanan 24 jam, aman, dan legal.",
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
