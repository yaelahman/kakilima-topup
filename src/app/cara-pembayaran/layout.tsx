import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cara Pembayaran",
  description: `Panduan metode pembayaran dan langkah pembayaran di ${SITE_NAME}.`,
  openGraph: {
    title: `Cara Pembayaran | ${SITE_NAME}`,
    description: `Panduan pembayaran ${SITE_NAME}.`,
    url: `${SITE_URL}/cara-pembayaran`,
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/cara-pembayaran`,
  },
  robots: { index: true, follow: true },
};

export default function CaraPembayaranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
