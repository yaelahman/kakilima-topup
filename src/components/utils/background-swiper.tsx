'use client';

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface BackgroundSwiperProps {
    images: string[];
    children: React.ReactNode;
    className?: string;
    autoplayDelay?: number;
    showPagination?: boolean;
    overlayOpacity?: number;
}

export function BackgroundSwiper({
    images,
    children,
    className = '',
    autoplayDelay = 5000,
    showPagination = false,
    overlayOpacity = 0.3,
}: BackgroundSwiperProps) {
    const swiperRef = useRef<any>(null);

    useEffect(() => {
        // Ensure Swiper is properly initialized
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.update();
        }
    }, [images]);

    return (
        <div className={`relative w-full h-full ${className}`}>
            {/* Background Swiper */}
            <div className="absolute inset-0 z-0">
                <Swiper
                    ref={swiperRef}
                    modules={[Autoplay, EffectFade, Pagination]}
                    effect="fade"
                    autoplay={{
                        delay: autoplayDelay,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    pagination={
                        showPagination
                            ? {
                                clickable: true,
                                el: '.swiper-pagination',
                            }
                            : false
                    }
                    className="w-full h-full"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="w-full h-full bg-cover bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: `url(${image})`,
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: overlayOpacity }}
                />

                {/* Pagination dots */}
                {showPagination && (
                    <div className="swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10" />
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
} 