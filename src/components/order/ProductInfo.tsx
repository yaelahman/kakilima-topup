"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faShieldAlt,
    faCreditCard,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { BackgroundSwiper } from "../utils/background-swiper";
import { getImageUrl } from "@/lib/helper";
import { getBanners } from "@/services/homepage.service";

interface ProductInfoProps {
    variant?: "desktop" | "mobile";
    product: any;
}

function productImageUrl(product: any) {
    const img = product?.image;
    return img ? getImageUrl(img) : "/images/logo.png";
}

function productBannerImages(product: any, homepageBannerUrl?: string | null): string[] {
    const banner = product?.banner;
    if (banner) {
        return [getImageUrl(banner, "product")];
    }
    if (homepageBannerUrl) {
        return [homepageBannerUrl];
    }
    return ["/images/moskov.png"];
}

const TrustBadges = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5 shrink-0" />
            {compact ? "24/7" : "Layanan Pelanggan 24/7"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <FontAwesomeIcon icon={faShieldAlt} className="h-3.5 w-3.5 shrink-0" />
            Jaminan Layanan
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <FontAwesomeIcon icon={faCreditCard} className="h-3.5 w-3.5 shrink-0" />
            Pembayaran Aman
        </span>
    </div>
);

export const ProductInfo = ({ variant = "desktop", product }: ProductInfoProps) => {
    const needsHomepageBanner = !product?.banner;
    const { data: bannersData } = useQuery({
        queryKey: ["homepage", "banners"],
        queryFn: () => getBanners(),
        enabled: needsHomepageBanner && variant === "desktop",
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    const firstHomepageBanner = bannersData?.banners?.[0]?.image
        ? getImageUrl(bannersData.banners[0].image, "banners")
        : null;
    const bannerImages = productBannerImages(product, firstHomepageBanner);

    if (variant === "desktop") {
        return (
            <div className="hidden md:block h-[300px]">
                <BackgroundSwiper images={bannerImages} className="h-full">
                    <div className="container relative mx-auto h-full max-w-[1320px] px-4">
                        <div className="absolute left-4 right-4 -bottom-14 flex min-h-[100px] items-center gap-4 rounded-2xl border border-primary/10 bg-white/95 p-4 shadow-brand md:gap-6 md:p-5 backdrop-blur-sm">
                            <div className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-primary-soft/40 ring-1 ring-primary/10 md:h-28 md:w-28">
                                <Image
                                    src={productImageUrl(product)}
                                    alt={product.name || "Product"}
                                    width={112}
                                    height={112}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="min-w-0 flex-1 md:ml-2">
                                <TrustBadges />
                                <h1 className="mt-2 font-display text-lg font-bold text-slate-900 md:text-xl">
                                    {product.name}
                                </h1>
                                <p
                                    className="mt-1 text-sm leading-snug text-gray-600 line-clamp-2 md:line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        </div>
                    </div>
                </BackgroundSwiper>
            </div>
        );
    }

    // Mobile variant
    return (
        <div className="col-span-1 block md:hidden">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-950 px-4 py-4 text-white">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                        <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300">Produk</p>
                        <span className="font-display text-lg font-semibold">Informasi Produk</span>
                    </div>
                </div>
                <div className="space-y-4 p-4">
                    <TrustBadges compact />
                    <div className="flex gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/80">
                        <div className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                            <Image
                                src={productImageUrl(product)}
                                alt={product.name}
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-display font-bold text-slate-900">{product.name}</h3>
                            <p
                                className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-gray-600"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
