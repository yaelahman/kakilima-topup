import type { Metadata } from "next";
import { getProduct } from "@/services/order.service";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

type Props = {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    try {
        const data = await getProduct(slug);
        const product = data.product;
        
        if (!product) {
            return {
                title: `Product Not Found - ${SITE_NAME}`,
                description: "The requested product could not be found.",
                robots: {
                    index: false,
                    follow: false,
                }
            };
        }

        // Clean HTML tags from description
        const cleanDescription = (description: string) => {
            return description?.replace(/<[^>]*>/g, '').trim() || '';
        };

        product.description = cleanDescription(product.description);

        const productName = product.name || product.title || "Game Product";
        const baseUrl = SITE_URL.replace(/\/$/, "");
        const productDescription = product.description || `Top up ${productName} dengan harga terbaik dan proses cepat di ${SITE_NAME}. Layanan 24 jam, aman dan terpercaya.`;
        const productPrice = product.price || product.cost || "";
        const productImage = product.image || product.thumbnail || "/images/logo.png";
        const productUrl = `${baseUrl}/order/${slug}`;
        const imageUrl = productImage.startsWith("http") ? productImage : `${baseUrl}${productImage}`;

        return {
            title: `${productName} - Top Up Game Murah | ${SITE_NAME}`,
            description: productDescription,
            keywords: [
                productName,
                "top up game",
                "voucher game",
                "diamond game",
                "kredit game",
                SITE_NAME,
                "game indonesia"
            ].join(", "),
            authors: [{ name: SITE_NAME }],
            openGraph: {
                title: `${productName} - Top Up Game Murah | ${SITE_NAME}`,
                description: productDescription,
                type: "website",
                locale: "id_ID",
                url: productUrl,
                siteName: SITE_NAME,
                images: [
                    {
                        url: imageUrl,
                        alt: `${productName} - ${SITE_NAME}`,
                        width: 1200,
                        height: 630,
                    }
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${productName} - Top Up Game Murah | ${SITE_NAME}`,
                description: productDescription,
                images: [imageUrl],
            },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
            alternates: {
                canonical: productUrl,
            },
            other: {
                "product:price:amount": productPrice.toString(),
                "product:price:currency": "IDR",
                "product:availability": "in stock",
                "product:condition": "new",
            }
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: `Product - ${SITE_NAME}`,
            description: `Top up game dengan harga terbaik dan proses cepat di ${SITE_NAME}.`,
        };
    }
}

export default async function OrderLayout({
    params,
    children,
}: Readonly<Props>) {
    const { slug } = await params;

    return (
        <div className="-mt-8">
            {children}
        </div>
    );
}
