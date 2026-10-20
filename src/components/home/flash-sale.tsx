"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { CustomLink } from "../utils/custom-link";
import { formatRupiah } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { getHomepagePromos } from "@/services/homepage.service";

function getDiscountedPrice(price: number, discountRate: number, discountType: number): number {
    if (discountType === 0) return Math.max(0, price - discountRate);
    return Math.max(0, price - (price * discountRate) / 100);
}

function getDiscountBadge(discountRate: number, discountType: number): string {
    if (discountType === 0) return `-${formatRupiah(discountRate)}`;
    return `-${discountRate}%`;
}

export function FlashSale() {
    const { data } = useQuery({
        queryKey: ["homepage", "promos"],
        queryFn: () => getHomepagePromos(),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });

    const promos = data?.promos ?? [];
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const expiredAt = promos[0]?.expired_at ?? null;

    useEffect(() => {
        if (!expiredAt) return;
        const endDate = new Date(expiredAt);
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(expiredAt).slice(0, 10))) {
            endDate.setHours(23, 59, 59, 999);
        }
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = endDate.getTime() - now.getTime();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };
        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();
        return () => clearInterval(timer);
    }, [expiredAt]);

    if (!promos?.length) return null;

    return (
        <section className="mb-8">
            <div className="bg-gradient-to-br from-primary-dark via-primary to-sky-500 rounded-[1.5rem] p-6 md:p-8 relative overflow-hidden shadow-brand-lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-white">
                            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Flash Sale</h2>
                            <p className="text-white/90">Dapatkan diskon spesial hari ini</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-white" />
                            <div className="flex gap-2">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 min-w-[60px] text-center">
                                    <span className="text-2xl font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                                    <p className="text-xs text-white/90">Hari</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 min-w-[60px] text-center">
                                    <span className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <p className="text-xs text-white/90">Jam</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 min-w-[60px] text-center">
                                    <span className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <p className="text-xs text-white/90">Menit</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 min-w-[60px] text-center">
                                    <span className="text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <p className="text-xs text-white/90">Detik</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={16}
                            navigation
                            breakpoints={{
                                320: { slidesPerView: 2 },
                                640: { slidesPerView: 3 },
                                768: { slidesPerView: 4 },
                                1024: { slidesPerView: 5 },
                            }}
                            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            className="flash-sale-swiper"
                        >
                            {promos.map((promo: any) => {
                                const product = promo.product ?? promo.Product;
                                const productType = promo.product_type ?? promo.ProductType;
                                if (!product?.slug || !productType) return null;
                                const price = Number(productType.price) || 0;
                                const discountRate = Number(promo.discount_rate) || 0;
                                const discountType = Number(promo.discount_type) ?? 1;
                                const finalPrice = getDiscountedPrice(price, discountRate, discountType);
                                const badge = getDiscountBadge(discountRate, discountType);
                                const href = `/order/${product.slug}?promo=${encodeURIComponent(promo.code || '')}&price_id=${productType.id}`;
                                const imgSrc = product.image;
                                return (
                                    <SwiperSlide key={promo.id}>
                                        <CustomLink href={href} className="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                                            <div className="relative">
                                                <Image
                                                    src={imgSrc}
                                                    alt={product.name || 'Flash Sale'}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-40 object-cover"
                                                    unoptimized={imgSrc.startsWith('http')}
                                                />
                                                <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                                    {badge}
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 line-through">{formatRupiah(price)}</span>
                                                    <span className="text-sm font-bold text-primary">{formatRupiah(finalPrice)}</span>
                                                </div>
                                            </div>
                                        </CustomLink>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </motion.div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>
        </section>
    );
}
