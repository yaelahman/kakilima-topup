import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: `Kebijakan privasi dan pengelolaan data pengguna ${SITE_NAME}.`,
  openGraph: {
    title: `Kebijakan Privasi | ${SITE_NAME}`,
    description: `Privasi ${SITE_NAME}.`,
    url: `${SITE_URL}/kebijakan-privasi`,
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}/kebijakan-privasi`,
  },
  robots: { index: true, follow: true },
};

export default function KebijakanPrivasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
