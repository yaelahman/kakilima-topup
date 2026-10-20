"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faPhone,
    faClock,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { SITE_LOGO_HORIZONTAL_PATH, SITE_NAME } from "@/lib/site-config";
import { CustomLink } from "@/components/utils/custom-link";
import { getContactInfo } from "@/services/contact.service";

const LAYANAN = [
    { label: "Top Up Game", href: "/" },
    { label: "Voucher Digital", href: "/price-list" },
    { label: "Lacak Pesanan", href: "/track" },
    { label: "Bantuan", href: "/contact" },
] as const;

const INFORMASI = [
    { label: "Blog", href: "/blog" },
    { label: "Cara Pembayaran", href: "/cara-pembayaran" },
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
    { label: "FAQ", href: "/faq" },
] as const;

export function Footer() {
    const { data: contact } = useQuery({
        queryKey: ["contact-info"],
        queryFn: getContactInfo,
        staleTime: 5 * 60 * 1000,
    });

    const email = contact?.email ?? "support@wxstoreid.com";
    const whatsappDisplay = contact?.whatsapp ?? null;
    const whatsappLink = contact?.whatsapp_link ?? "/contact";
    const hours = contact?.operational_hours ?? "Senin - Minggu, 24 Jam Non-Stop";

    return (
        <footer className="relative mt-8">
            {/* Soft white → mint blend from page content */}
            <div
                className="pointer-events-none absolute inset-x-0 -top-16 h-16"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 100%)",
                }}
                aria-hidden
            />

            <div
                className="relative overflow-hidden text-white"
                style={{
                    background:
                        "linear-gradient(165deg, #0F766E 0%, #0E7490 42%, #0891B2 100%)",
                }}
            >
                {/* Quiet atmosphere — no stars / ornaments */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 50% at 0% 0%, rgba(255,255,255,0.18), transparent 50%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(8,145,178,0.35), transparent 55%)",
                    }}
                    aria-hidden
                />

                <div className="relative z-10 mx-auto max-w-[1320px] px-4 py-12 md:px-6 md:py-14">
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                        {/* Brand */}
                        <div className="lg:col-span-4 space-y-4">
                            <CustomLink href="/" className="inline-block">
                                <Image
                                    src={SITE_LOGO_HORIZONTAL_PATH}
                                    alt={SITE_NAME}
                                    width={240}
                                    height={106}
                                    className="h-12 w-auto max-w-[210px] object-contain object-left brightness-0 invert"
                                />
                            </CustomLink>
                            <p className="max-w-sm text-sm leading-relaxed text-white/85">
                                Platform top-up game dan voucher digital terpercaya di Indonesia.
                                Proses cepat, aman, dan siap 24 jam.
                            </p>
                        </div>

                        {/* Layanan */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">
                                Layanan
                            </h3>
                            <ul className="space-y-2.5">
                                {LAYANAN.map(({ label, href }) => (
                                    <li key={label}>
                                        <CustomLink
                                            href={href}
                                            className="text-sm text-white/80 transition-colors hover:text-white"
                                        >
                                            {label}
                                        </CustomLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Informasi */}
                        <div className="lg:col-span-3 space-y-4">
                            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">
                                Informasi
                            </h3>
                            <ul className="space-y-2.5">
                                {INFORMASI.map(({ label, href }) => (
                                    <li key={label}>
                                        <CustomLink
                                            href={href}
                                            className="text-sm text-white/80 transition-colors hover:text-white"
                                        >
                                            {label}
                                        </CustomLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="lg:col-span-3 space-y-4">
                            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">
                                Hubungi Kami
                            </h3>
                            <ul className="space-y-3 text-sm text-white/85">
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                        <FontAwesomeIcon icon={faEnvelope} className="h-3.5 w-3.5" />
                                    </span>
                                    <a
                                        href={`mailto:${email}`}
                                        className="pt-1.5 transition-colors hover:text-white"
                                    >
                                        {email}
                                    </a>
                                </li>
                                {whatsappDisplay && (
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                            <FontAwesomeIcon icon={faPhone} className="h-3.5 w-3.5" />
                                        </span>
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pt-1.5 transition-colors hover:text-white"
                                        >
                                            {whatsappDisplay}
                                        </a>
                                    </li>
                                )}
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                        <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
                                    </span>
                                    <span className="pt-1.5 leading-relaxed">{hours}</span>
                                </li>
                            </ul>
                            <CustomLink
                                href="/contact"
                                className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-cyan-50"
                            >
                                Kirim pesan
                            </CustomLink>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-center sm:flex-row sm:text-left">
                        <p className="text-sm text-white/70">
                            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
                        </p>
                        <p className="inline-flex items-center gap-1.5 text-sm text-white/65">
                            Made with
                            <FontAwesomeIcon icon={faHeart} className="h-3 w-3 text-rose-300" />
                            in Indonesia
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
