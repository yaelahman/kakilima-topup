"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faGamepad,
    faTicketAlt,
    faHeadset,
    faInfoCircle,
    faShippingFast,
    faUser,
    faCog,
    faTimes,
    faTachometerAlt,
    faSignInAlt,
    faUserPlus,
    faSignOutAlt,
    faWallet,
    faNewspaper,
    faCode,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { CustomLink } from "@/components/utils/custom-link";
import { useSession, signOut } from "next-auth/react";
import { useAuthClient } from "@/lib/use-auth-client";
import { getProfile } from "@/services/account.service";
import { SITE_LOGO_HORIZONTAL_PATH, SITE_NAME } from "@/lib/site-config";
import { roleLabel } from "@/lib/role";

function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { data: session, status } = useSession();
    const api = useAuthClient();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const isAuthenticated = status === "authenticated" && !!session?.user;

    const { data: profile } = useQuery({
        queryKey: ["account", "profile"],
        queryFn: () => getProfile(api),
        enabled: isAuthenticated,
    });

    const navigationItems = [
        { icon: faHome, label: 'Beranda', href: '/' },
        { icon: faGamepad, label: 'Daftar Harga', href: '/price-list' },
        { icon: faNewspaper, label: 'Blog', href: '/blog' },
        { icon: faTicketAlt, label: 'Voucher', href: '/voucher' },
        { icon: faShippingFast, label: 'Lacak Pesanan', href: '/track' },
        { icon: faHeadset, label: 'Hubungi Kami', href: '/contact' },
        { icon: faInfoCircle, label: 'Tentang Kami', href: '/about' },
        { icon: faCode, label: 'API Docs', href: '/docs/api' },
    ];

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: '-105%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-105%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="fixed left-0 top-0 z-50 flex h-full w-[min(100%,22rem)] flex-col overflow-hidden bg-slate-950 text-white shadow-2xl"
                    >
                        <div className="relative overflow-hidden px-5 pb-6 pt-5">
                            <div
                                className="absolute inset-0 opacity-90"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 80% 70% at 20% 0%, rgba(var(--primary-rgb),0.55), transparent 60%), linear-gradient(160deg, #042F2E 0%, #0E7490 100%)",
                                }}
                            />
                            <div className="relative flex items-start justify-between gap-3">
                                <CustomLink href="/" onClick={onClose} className="flex items-center min-w-0">
                                    <Image
                                        src={SITE_LOGO_HORIZONTAL_PATH}
                                        alt={SITE_NAME}
                                        width={220}
                                        height={97}
                                        className="h-10 w-auto max-w-[180px] object-contain object-left"
                                        priority
                                    />
                                </CustomLink>
                                <button
                                    onClick={onClose}
                                    className="rounded-xl bg-white/10 p-2.5 hover:bg-white/20 transition-colors"
                                    aria-label="Tutup menu"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                                        <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold">
                                            {isAuthenticated ? (session?.user?.name ?? session?.user?.email ?? "Profil") : "Tamu"}
                                        </p>
                                        <p className="truncate text-xs text-sky-100/80">
                                            {isAuthenticated ? roleLabel(profile?.role ?? "") : "Masuk untuk fitur penuh"}
                                        </p>
                                        {isAuthenticated && (
                                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-sky-200">
                                                <FontAwesomeIcon icon={faWallet} className="h-3.5 w-3.5" />
                                                Rp {formatRupiah(profile?.balance ?? 0)}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="rounded-xl bg-white/10 p-2 hover:bg-white/20"
                                        aria-expanded={isUserMenuOpen}
                                    >
                                        <FontAwesomeIcon icon={faCog} className="h-4 w-4" />
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-3 space-y-1 overflow-hidden"
                                        >
                                            {isAuthenticated ? (
                                                <>
                                                    <CustomLink href="/dashboard" onClick={onClose} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                                                        <FontAwesomeIcon icon={faTachometerAlt} className="h-4 w-4" /> Dashboard
                                                    </CustomLink>
                                                    <CustomLink href="/account/balance" onClick={onClose} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                                                        <FontAwesomeIcon icon={faWallet} className="h-4 w-4" /> Isi Saldo
                                                    </CustomLink>
                                                    <CustomLink href="/account/settings" onClick={onClose} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                                                        <FontAwesomeIcon icon={faCog} className="h-4 w-4" /> Pengaturan
                                                    </CustomLink>
                                                    <CustomLink href="/account/api" onClick={onClose} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                                                        <FontAwesomeIcon icon={faCode} className="h-4 w-4" /> API Access
                                                    </CustomLink>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setIsUserMenuOpen(false); onClose(); signOut({ callbackUrl: "/" }); }}
                                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 hover:bg-red-500/20"
                                                    >
                                                        <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" /> Keluar
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <CustomLink href="/auth/login" onClick={onClose} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                                                        <FontAwesomeIcon icon={faSignInAlt} className="h-4 w-4" /> Masuk
                                                    </CustomLink>
                                                    <CustomLink href="/auth/register" onClick={onClose} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                                                        <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4" /> Daftar
                                                    </CustomLink>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-4 py-4">
                            <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Navigasi</p>
                            <ul className="space-y-1.5">
                                {navigationItems.map((item, index) => (
                                    <motion.li
                                        key={item.href}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.04 * index, type: "spring", stiffness: 380, damping: 28 }}
                                    >
                                        <CustomLink
                                            href={item.href}
                                            onClick={onClose}
                                            className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-slate-200 transition-all hover:border-primary/30 hover:bg-primary/15 hover:text-white"
                                        >
                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-sky-300 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                                            </span>
                                            <span className="font-medium">{item.label}</span>
                                            <span className="ml-auto font-mono text-[10px] text-slate-500 group-hover:text-sky-300">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        </CustomLink>
                                    </motion.li>
                                ))}
                            </ul>
                        </nav>

                        <div className="border-t border-white/10 px-5 py-4 text-center">
                            <p className="text-xs text-slate-400">© {new Date().getFullYear()} {SITE_NAME}</p>
                            <p className="mt-1 text-[11px] text-slate-500">Top-up game · cepat & aman</p>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
