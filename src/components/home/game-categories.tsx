"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faFire } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CustomLink } from "../utils/custom-link";
import { SectionTitleWithIcon } from "./section-title-icon";
import { getHomepageTrending } from "@/services/homepage.service";
import { getImageUrl } from "@/lib/helper";

export function GameCategories() {
    const { data } = useQuery({
        queryKey: ["homepage", "trending"],
        queryFn: () => getHomepageTrending(),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    const trending = data?.trending ?? [];

    if (trending.length === 0) {
        return null;
    }

    return (
        <section className="mb-10 md:mb-14">
            <div className="mb-5 flex items-end justify-between gap-4">
                <div className="relative pl-4">
                    <span className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-sky-400" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        <SectionTitleWithIcon icon={faGamepad}>Trending</SectionTitleWithIcon>
                    </span>
                    <h2 className="font-display text-xl md:text-3xl font-bold text-slate-900 mt-1">
                        Sedang ramai
                    </h2>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <FontAwesomeIcon icon={faFire} className="h-3 w-3" />
                    Top minggu ini
                </span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                {trending.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 260, damping: 24, delay: index * 0.08 }}
                    >
                        <CustomLink href={`/order/${item.slug}`} className="group block">
                            <div className="relative flex items-center gap-4 overflow-hidden rounded-3xl bg-slate-950 p-4 text-white shadow-brand transition-transform duration-300 group-hover:-translate-y-1">
                                <div
                                    className="absolute inset-0 opacity-80"
                                    style={{
                                        background:
                                            "radial-gradient(circle at 90% 10%, rgba(var(--primary-rgb),0.55), transparent 45%), linear-gradient(135deg, #042F2E, #0E7490)",
                                    }}
                                />
                                <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/20">
                                    <Image
                                        src={item.image ? getImageUrl(item.image) : "/images/logo.png"}
                                        alt={item.name}
                                        width={64}
                                        height={64}
                                        className="h-full w-full object-cover"
                                        unoptimized={!!item.image}
                                    />
                                </div>
                                <div className="relative min-w-0 flex-1">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">
                                        Rank {String(index + 1).padStart(2, "0")}
                                    </p>
                                    <p className="truncate font-display text-base font-bold">{item.name}</p>
                                    <p className="truncate text-xs text-slate-300">{item.category || "Game Online"}</p>
                                </div>
                                <span className="relative hidden rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-sky-100 sm:inline">
                                    Top-up
                                </span>
                            </div>
                        </CustomLink>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
