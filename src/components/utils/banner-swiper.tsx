'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { getImageUrl } from '@/lib/helper';

interface BannerSwiperProps {
    images: any[];
    height?: string;
    className?: string;
    autoplayDelay?: number;
    showPagination?: boolean;
    showNavigation?: boolean;
    overlayOpacity?: number;
    children?: React.ReactNode;
}

export function BannerSwiper({
    images = [],
    height = 'h-96',
    className = '',
    autoplayDelay = 5000,
    showPagination = true,
    showNavigation = true,
    overlayOpacity = 0.25,
    children,
}: BannerSwiperProps) {
    const swiperRef = useRef<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (swiperRef.current?.swiper) {
            swiperRef.current.swiper.update();
        }
    }, [images]);

    if (!images?.length) {
        return (
            <div
                className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 ${height} ${className}`}
            >
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <span className="text-sm">No banners</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`banner-swiper-wrap relative w-full overflow-hidden rounded-2xl shadow-xl ${height} ${className}`}
        >
            <Swiper
                ref={swiperRef}
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                    delay: autoplayDelay,
                    disableOnInteraction: false,
                }}
                loop={true}
                speed={600}
                onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
                pagination={false}
                navigation={false}
                className="relative z-10 h-full w-full"
            >
                {images.map((item: any, index: number) => (
                    <SwiperSlide key={index}>
                        <div className="relative h-full w-full">
                            <div
                                className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out"
                                style={{
                                    backgroundImage: `url(${getImageUrl(item.image, 'banners')})`,
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Gradient overlay (bottom stronger for depth) */}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                style={{ opacity: overlayOpacity }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Content overlay */}
            {children && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    {children}
                </div>
            )}

            {/* Navigation arrows */}
            {showNavigation && images.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Previous slide"
                        className="banner-swiper-prev absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25 hover:scale-110 md:left-4 md:h-12 md:w-12"
                        onClick={() => swiperRef.current?.swiper?.slidePrev()}
                    >
                        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Next slide"
                        className="banner-swiper-next absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25 hover:scale-110 md:right-4 md:h-12 md:w-12"
                        onClick={() => swiperRef.current?.swiper?.slideNext()}
                    >
                        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Pagination */}
            {showPagination && images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 md:bottom-5 md:gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            aria-label={`Go to slide ${index + 1}`}
                            onClick={() => swiperRef.current?.swiper?.slideToLoop(index)}
                            className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${index === activeIndex
                                ? 'h-2 w-6 bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)] md:h-2.5 md:w-8'
                                : 'h-2 w-2 bg-white/60 hover:bg-white/80 md:h-2.5 md:w-2.5'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
