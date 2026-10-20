"use client";
import { BannerSwiper } from "@/components/utils/banner-swiper";
import { GameCategories } from "@/components/home/game-categories";
import { ProductSection } from "@/components/home/product-section";
import { WhyUs } from "@/components/home/why-us";
import { FlashSale } from "@/components/home/flash-sale";
import { Welcome } from "@/components/home/welcome";
import { NotificationPopup } from "@/components/home/notification-popup";
import { HowToTopUp } from "@/components/home/how-to-topup";
import { BlogPreview } from "@/components/home/blog-preview";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/services/homepage.service";
import { SITE_DEFAULT_TITLE } from "@/lib/site-config";

function HomepageBanner() {
  const { data } = useQuery({
    queryKey: ["homepage", "banners"],
    queryFn: () => getBanners(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const banners = data?.banners ?? [];

  return (
    <div className="mb-6 md:mb-8">
      <BannerSwiper
        images={banners}
        height="h-35 md:h-76"
        autoplayDelay={4000}
        showPagination={true}
        overlayOpacity={0.3}
      >
      </BannerSwiper>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <NotificationPopup />
      <Welcome />
      <h1 className="sr-only">
        {SITE_DEFAULT_TITLE}. Layanan 24 jam, aman, terpercaya.
      </h1>
      <HomepageBanner />
      <FlashSale />
      <GameCategories />
      <ProductSection />
      <HowToTopUp />
      <WhyUs />
      <BlogPreview />
    </>
  );
}
