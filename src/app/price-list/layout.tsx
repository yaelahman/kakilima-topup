import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Daftar Harga Top Up Game",
  description:
    "Lihat daftar harga top up game terbaru: Mobile Legends, Free Fire, PUBG, dan game populer lainnya. Harga murah, proses instan, 24 jam.",
  keywords: [
    "daftar harga top up game",
    "harga diamond",
    "harga voucher game",
    "price list game",
    SITE_NAME,
  ].join(", "),
  openGraph: {
    title: `Daftar Harga Top Up Game | ${SITE_NAME}`,
    description: "Lihat daftar harga top up game terbaru. Harga murah, proses instan, 24 jam.",
    url: `${SITE_URL}/price-list`,
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/price-list`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PriceListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
