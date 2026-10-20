"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CustomLink } from "../utils/custom-link";
import { getImageUrl } from "@/lib/helper";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getHomepageCategories, getHomepageProducts } from "@/services/homepage.service";
import { SectionTitleWithIcon } from "./section-title-icon";

export function ProductSection() {
    const { data: productsData, isFetching: isFetchingProducts } = useQuery({
        queryKey: ["homepage", "products"],
        queryFn: () => getHomepageProducts(),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });

    const { data: categoriesData, isFetching: isFetchingCategories } = useQuery({
        queryKey: ["homepage", "categories"],
        queryFn: () => getHomepageCategories(),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });

    const products = productsData?.products ?? [];
    const categories = categoriesData?.categories ?? null;
    const isFetching = isFetchingProducts || isFetchingCategories;
    const [selectedCategory, setSelectedCategory] = useState<number | string>(0);
    const filteredProducts = useMemo(() => {
        if (!products?.length) return [];
        if (selectedCategory === 0) return products;
        const categoryId = Number(selectedCategory);
        return products.filter((product: any) => {
            const productCategoryId = product.id_category ?? product.category_id;
            return productCategoryId != null && Number(productCategoryId) === categoryId;
        });
    }, [selectedCategory, products]);

    return (
        <section className="mb-12 md:mb-16">
            <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="relative pl-4 md:pl-5">
                    <span className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-gradient-to-b from-primary to-sky-400" />
                    <span className="text-xs md:text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                        <SectionTitleWithIcon icon={faBoxOpen}>Katalog</SectionTitleWithIcon>
                    </span>
                    <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mt-1">
                        Pilih game favorit
                    </h2>
                    <p className="mt-1.5 max-w-md text-sm text-slate-500">
                        Top-up instan dengan harga transparan — tanpa layout dashboard.
                    </p>
                </div>
                <div className="flex gap-2 overflow-x-auto p-1 scrollbar-none">
                    <motion.button
                        onClick={() => setSelectedCategory(0)}
                        className={`shrink-0 cursor-pointer rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
                            selectedCategory === 0
                                ? "bg-slate-900 text-white shadow-lg"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-primary/40"
                        }`}
                        whileTap={{ scale: 0.97 }}
                    >
                        Semua
                    </motion.button>
                    {categories?.map((category: any) => (
                        <motion.button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`shrink-0 cursor-pointer rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
                                selectedCategory === category.id
                                    ? "bg-slate-900 text-white shadow-lg"
                                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-primary/40"
                            }`}
                            whileTap={{ scale: 0.97 }}
                        >
                            {category.name}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {isFetching ? (
                    <Loader />
                ) : (
                    <>
                        {filteredProducts.map((item: any, index: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20, rotate: -0.6 }}
                                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.24) }}
                                className="h-full"
                            >
                                <CustomLink href={`/order/${item.slug}`} className="group block h-full">
                                    <article className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:ring-primary/35 hover:shadow-brand">
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <Image
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                width={280}
                                                height={350}
                                                sizes="(max-width: 768px) 50vw, 20vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                                            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[10px] font-bold text-primary shadow-sm">
                                                #{String(index + 1).padStart(2, "0")}
                                            </span>
                                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                                                <h3 className="font-display text-sm md:text-base font-bold text-white line-clamp-2 drop-shadow">
                                                    {item.name}
                                                </h3>
                                                <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-200 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                                    Top-up sekarang
                                                    <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </CustomLink>
                            </motion.div>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full rounded-[1.5rem] border border-dashed border-primary/25 bg-primary-soft/40 py-16 text-center">
                                <h3 className="font-display text-lg font-semibold text-slate-700">Produk tidak ditemukan</h3>
                                <p className="mt-1 text-sm text-slate-500">Coba ubah kategori</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

const Loader = () => (
    <>
        {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="animate-pulse overflow-hidden rounded-[1.35rem] bg-white ring-1 ring-slate-100">
                <div className="aspect-[4/5] bg-slate-200" />
            </div>
        ))}
    </>
);
