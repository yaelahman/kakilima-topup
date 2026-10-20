"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faCalendar, faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CustomLink } from "@/components/utils/custom-link";
import { SectionTitleWithIcon } from "./section-title-icon";
import { getBlogList } from "@/services/blog.service";

const PREVIEW_COUNT = 3;

export function BlogPreview() {
    const { data: posts = [] } = useQuery({
        queryKey: ["blog", "list"],
        queryFn: () => getBlogList(),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    const latest = posts.slice(0, PREVIEW_COUNT);

    if (latest.length === 0) {
        return null;
    }

    return (
        <section className="mb-10 md:mb-14">
            <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="relative pl-4">
                    <span className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        <SectionTitleWithIcon icon={faNewspaper}>Blog</SectionTitleWithIcon>
                    </span>
                    <h2 className="font-display text-xl md:text-3xl font-bold text-slate-900 mt-1">
                        Artikel terbaru
                    </h2>
                    <p className="mt-1.5 max-w-lg text-sm text-slate-500">
                        Tips top-up, panduan game, dan update seputar voucher digital.
                    </p>
                </div>
                <CustomLink
                    href="/blog"
                    className="inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
                >
                    Lihat semua
                    <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
                </CustomLink>
            </div>

            <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
                {latest.map((post, index) => (
                    <motion.li
                        key={post.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.35, delay: index * 0.06 }}
                    >
                        <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-primary/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-brand">
                            <CustomLink href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-primary-soft">
                                <Image
                                    src={post.image || "/images/logo.png"}
                                    alt={post.image_alt || post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    unoptimized={!!post.image?.startsWith("http")}
                                />
                            </CustomLink>
                            <div className="flex flex-1 flex-col p-4 md:p-5">
                                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                    <span className="inline-flex items-center gap-1">
                                        <FontAwesomeIcon icon={faUser} className="h-3 w-3 text-primary/70" />
                                        {post.author}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <FontAwesomeIcon icon={faCalendar} className="h-3 w-3 text-primary/70" />
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString("id-ID", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "—"}
                                    </span>
                                </div>
                                <h3 className="font-display text-base font-bold text-slate-900 line-clamp-2 md:text-lg">
                                    <CustomLink href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                                        {post.title}
                                    </CustomLink>
                                </h3>
                                <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
                                <CustomLink
                                    href={`/blog/${post.slug}`}
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all"
                                >
                                    Baca selengkapnya
                                    <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                                </CustomLink>
                            </div>
                        </article>
                    </motion.li>
                ))}
            </ul>
        </section>
    );
}
