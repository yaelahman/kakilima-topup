import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

const title = "Blog";
const description =
  `Artikel dan tips seputar top up game, voucher game, dan panduan bermain. Baca tips hemat dan aman dari ${SITE_NAME}.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${SITE_NAME}`,
    description,
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
