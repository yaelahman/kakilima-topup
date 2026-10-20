import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Daftar Akun",
  description: `Daftar akun ${SITE_NAME} untuk top up game lebih mudah dan akses promo eksklusif.`,
  openGraph: {
    title: `Daftar | ${SITE_NAME}`,
    url: `${SITE_URL}/auth/register`,
    siteName: SITE_NAME,
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_URL}/auth/register`,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
