import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Pertanyaan yang sering diajukan tentang ${SITE_NAME}.`,
  openGraph: {
    title: `FAQ | ${SITE_NAME}`,
    description: `FAQ ${SITE_NAME}.`,
    url: `${SITE_URL}/faq`,
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  robots: { index: true, follow: true },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
