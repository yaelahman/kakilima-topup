"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGamepad,
    faCreditCard,
    faBolt,
    faListOl,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { CustomLink } from "@/components/utils/custom-link";
import { SectionTitleWithIcon } from "./section-title-icon";

const STEPS = [
    {
        step: "01",
        icon: faGamepad,
        title: "Pilih game & nominal",
        description: "Cari produk favorit Anda, lalu pilih paket diamond atau voucher yang diinginkan.",
    },
    {
        step: "02",
        icon: faCreditCard,
        title: "Isi data & bayar",
        description: "Masukkan ID/akun jika diminta, pilih metode pembayaran, lalu selesaikan transaksi.",
    },
    {
        step: "03",
        icon: faBolt,
        title: "Item langsung masuk",
        description: "Setelah pembayaran berhasil, item diproses otomatis ke akun Anda dalam hitungan detik.",
    },
] as const;

export function HowToTopUp() {
    return (
        <section className="mb-10 md:mb-14">
            <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="relative pl-4">
                    <span className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        <SectionTitleWithIcon icon={faListOl}>Panduan</SectionTitleWithIcon>
                    </span>
                    <h2 className="font-display text-xl md:text-3xl font-bold text-slate-900 mt-1">
                        Cara top-up dalam 3 langkah
                    </h2>
                    <p className="mt-1.5 max-w-lg text-sm text-slate-500">
                        Proses sederhana — tanpa ribet, cocok untuk pemula.
                    </p>
                </div>
                <CustomLink
                    href="/price-list"
                    className="inline-flex items-center gap-2 self-start rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-brand hover:bg-primary-dark transition-colors"
                >
                    Mulai top-up
                    <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
                </CustomLink>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {STEPS.map((item, index) => (
                    <motion.div
                        key={item.step}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="relative overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white p-6 shadow-sm"
                    >
                        <span className="font-mono text-4xl font-bold text-primary/15 absolute right-4 top-3 select-none">
                            {item.step}
                        </span>
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-brand">
                            <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                        </div>
                        <h3 className="relative mt-4 font-display text-lg font-bold text-slate-900">
                            {item.title}
                        </h3>
                        <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                            {item.description}
                        </p>
                        {index < STEPS.length - 1 && (
                            <span
                                className="pointer-events-none absolute -right-2 top-1/2 hidden h-0.5 w-4 -translate-y-1/2 bg-primary/25 md:block"
                                aria-hidden
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
