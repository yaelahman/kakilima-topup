"use client";

import {
    faBolt,
    faShieldHalved,
    faMoneyBillWave,
    faMoneyBillTransfer,
    faUsers,
    faGamepad,
    faThumbsUp,
    faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SITE_NAME } from "@/lib/site-config";
import { SectionTitleWithIcon } from "./section-title-icon";
import { getHomepageStats } from "@/services/homepage.service";

const CountUp = ({
    end,
    duration = 2,
}: {
    end: number;
    duration?: number;
}) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
                (timestamp - startTimestamp) / (duration * 1000),
                1
            );
            setCount(Math.floor(progress * end));
            if (progress < 1) window.requestAnimationFrame(step);
        };
        if (isInView) {
            setCount(0);
            window.requestAnimationFrame(step);
        }
    }, [end, duration, isInView]);

    return <span ref={ref}>{count.toLocaleString("id-ID")}</span>;
};

const features = [
    {
        icon: faBolt,
        title: "Proses Cepat",
        description:
            "Transaksi instan dan pengiriman diamond/voucher otomatis ke akun Anda dalam hitungan detik.",
    },
    {
        icon: faShieldHalved,
        title: "100% Aman",
        description:
            "Transaksi dijamin aman dengan sistem pembayaran yang terpercaya dan customer service 24/7.",
    },
    {
        icon: faMoneyBillWave,
        title: "Harga Bersaing",
        description:
            "Dapatkan harga terbaik untuk setiap pembelian diamond dan voucher game favorit Anda.",
    },
];

const STAT_META = [
    {
        key: "total_transactions" as const,
        icon: faMoneyBillTransfer,
        suffix: "+",
        label: "Total Transaksi",
        gradient: "from-slate-800 via-slate-900 to-cyan-900",
    },
    {
        key: "active_users" as const,
        icon: faUsers,
        suffix: "+",
        label: "Pengguna Aktif",
        gradient: "from-amber-500 via-orange-500 to-amber-700",
    },
    {
        key: "games_available" as const,
        icon: faGamepad,
        suffix: "+",
        label: "Game Tersedia",
        gradient: "from-emerald-500 via-teal-500 to-emerald-700",
    },
    {
        key: "satisfaction_rate" as const,
        icon: faThumbsUp,
        suffix: "%",
        label: "Tingkat Kepuasan",
        gradient: "from-rose-500 via-pink-500 to-rose-700",
    },
];

export function WhyUs() {
    const { data } = useQuery({
        queryKey: ["homepage", "stats"],
        queryFn: () => getHomepageStats(),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    const stats = useMemo(() => {
        const api = data?.stats;
        return STAT_META.map((meta) => ({
            ...meta,
            value: Math.max(0, Number(api?.[meta.key]) || 0),
        }));
    }, [data]);

    return (
        <>
            <div className="relative overflow-hidden h-1 mb-10">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent, var(--primary), transparent, var(--primary), transparent)",
                        backgroundSize: "200% 100%",
                    }}
                />
            </div>

            <section className="relative mb-10 md:mb-14">
                <div className="relative">
                    <motion.span
                        className="inline-block text-sm md:text-base font-semibold tracking-wide text-primary uppercase"
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        <SectionTitleWithIcon icon={faStar}>Mengapa {SITE_NAME}?</SectionTitleWithIcon>
                    </motion.span>
                    <motion.h2
                        className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-slate-900 mt-2 mb-8 md:mb-10 text-start"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                    >
                        Keunggulan Kami
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 shadow-lg hover:shadow-brand hover:border-primary/25 transition-all duration-300 overflow-hidden"
                        >
                            <motion.div
                                className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 mb-6 text-primary border border-primary/10"
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.5,
                                    ease: "easeInOut",
                                    delay: i * 0.2,
                                }}
                            >
                                <FontAwesomeIcon icon={item.icon} className="w-8 h-8" />
                            </motion.div>
                            <h3 className="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                {item.description}
                            </p>
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="relative mb-12 md:mb-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.92 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-20px" }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            className="relative group"
                        >
                            <motion.div
                                className={`relative bg-gradient-to-br ${stat.gradient} p-6 md:p-7 rounded-2xl shadow-xl text-center overflow-hidden`}
                                animate={{ scale: [1, 1.015, 1] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: "easeInOut",
                                    delay: i * 0.25,
                                }}
                            >
                                <motion.div
                                    className="absolute inset-0 opacity-20"
                                    style={{
                                        background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)`,
                                        backgroundSize: "200% 200%",
                                    }}
                                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 4,
                                        ease: "linear",
                                        delay: i * 0.5,
                                    }}
                                />
                                <motion.div
                                    className="relative z-10 flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-white/25 backdrop-blur-sm rounded-xl"
                                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 4,
                                        ease: "easeInOut",
                                        delay: i * 0.2,
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={stat.icon}
                                        className="w-6 h-6 text-white"
                                    />
                                </motion.div>
                                <span className="relative z-10 block text-2xl md:text-3xl lg:text-4xl font-bold text-white tabular-nums">
                                    <CountUp end={stat.value} />
                                    {stat.suffix}
                                </span>
                                <p className="relative z-10 text-white/95 mt-2 font-medium text-sm">
                                    {stat.label}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </>
    );
}
