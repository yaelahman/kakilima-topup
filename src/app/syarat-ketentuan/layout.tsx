import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: `Syarat dan ketentuan penggunaan layanan ${SITE_NAME}.`,
  openGraph: {
    title: `Syarat & Ketentuan | ${SITE_NAME}`,
    description: `S&K ${SITE_NAME}.`,
    url: `${SITE_URL}/syarat-ketentuan`,
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/syarat-ketentuan`,
  },
  robots: { index: true, follow: true },
};

export default function SyaratKetentuanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
