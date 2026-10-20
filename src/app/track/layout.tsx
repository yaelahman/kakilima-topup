import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cek Status Pesanan",
  description:
    `Cek status dan lacak pesanan top up game Anda dengan nomor invoice. Proses transparan dan real-time di ${SITE_NAME}.`,
  keywords: ["cek pesanan", "lacak transaksi", "status order", "invoice game", SITE_NAME].join(", "),
  openGraph: {
    title: `Cek Status Pesanan | ${SITE_NAME}`,
    description: "Lacak status pesanan top up game dengan nomor invoice.",
    url: `${SITE_URL}/track`,
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/track`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
