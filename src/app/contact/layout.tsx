import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description:
    `Hubungi tim support ${SITE_NAME} untuk bantuan top up game, pembayaran, atau pertanyaan lainnya. Layanan 24 jam.`,
  openGraph: {
    title: `Hubungi Kami | ${SITE_NAME}`,
    description: `Kontak dan bantuan pelanggan ${SITE_NAME}. Siap membantu 24 jam.`,
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
