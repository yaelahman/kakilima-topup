import type { Metadata } from "next";

type Props = {
    params: Promise<{ invoice: string }>;
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Detail Invoice",
    description: "Lihat detail dan status pembayaran pesanan top up game Anda.",
    robots: {
        index: false,
        follow: true,
    },
};

export default async function InvoiceLayout({
    params,
    children,
}: Readonly<Props>) {
    const { invoice } = await params;

    return (
        <div className="-mt-8">
            {children}
        </div>
    );
}
