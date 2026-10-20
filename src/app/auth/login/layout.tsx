import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Masuk",
  description: `Masuk ke akun ${SITE_NAME} untuk melihat riwayat transaksi dan kelola pesanan.`,
  openGraph: {
    title: `Masuk | ${SITE_NAME}`,
    url: `${SITE_URL}/auth/login`,
    siteName: SITE_NAME,
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_URL}/auth/login`,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
