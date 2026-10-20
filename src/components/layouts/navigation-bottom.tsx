"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faShippingFast,
    faSearch,
    faEnvelope,
    faUserCircle,
    faSignInAlt,
    faTachometerAlt,
    faCog,
    faSignOutAlt,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { CustomLink } from "@/components/utils/custom-link";
import { getHomepageProducts } from "@/services/homepage.service";
import { getImageUrl } from "@/lib/helper";
import { AnimatePresence, motion } from "framer-motion";

const MAX_SEARCH_RESULTS = 8;

function isActive(pathname: string, href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
}

function NavItem({
    active,
    label,
    icon,
    href,
    onClick,
}: {
    active?: boolean;
    label: string;
    icon: typeof faHome;
    href?: string;
    onClick?: () => void;
}) {
    const className = `relative flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors active:scale-95 touch-manipulation ${
        active ? "text-primary" : "text-slate-500"
    }`;

    const content = (
        <>
            <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                    active ? "bg-primary/12 text-primary" : "bg-transparent"
                }`}
            >
                <FontAwesomeIcon icon={icon} className="h-4 w-4" />
            </span>
            <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-slate-500"}`}>
                {label}
            </span>
            {active && (
                <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />
            )}
        </>
    );

    if (href) {
        return (
            <CustomLink href={href} className={className}>
                {content}
            </CustomLink>
        );
    }

    return (
        <button type="button" onClick={onClick} className={className}>
            {content}
        </button>
    );
}

export function NavigationBottom() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLLIElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { data } = useQuery({
        queryKey: ["homepage", "products"],
        queryFn: () => getHomepageProducts(),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
    const products = data?.products ?? [];

    const searchResults = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q || !products.length) return [];
        return products
            .filter((p: { name?: string; slug?: string }) => {
                const name = (p.name || "").toLowerCase();
                const slug = (p.slug || "").toLowerCase();
                return name.includes(q) || slug.includes(q);
            })
            .slice(0, MAX_SEARCH_RESULTS);
    }, [searchQuery, products]);

    useEffect(() => {
        if (searchOpen) {
            searchInputRef.current?.focus();
        } else {
            setSearchQuery("");
        }
    }, [searchOpen]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const closeSearch = () => setSearchOpen(false);
    const handleLogout = () => {
        setProfileOpen(false);
        signOut({ callbackUrl: "/" });
    };

    const isLoggedIn = status === "authenticated" && !!session?.user;

    return (
        <>
            <nav
                className="fixed inset-x-0 bottom-0 z-50 md:hidden border-t border-primary/10 bg-white/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgba(8,145,178,0.25)]"
                aria-label="Mobile bottom navigation"
            >
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(var(--primary-rgb),0.55), transparent)",
                    }}
                />
                <ul className="mx-auto flex max-w-lg items-end min-h-[60px] px-1">
                    <li className="flex flex-1 self-stretch">
                        <NavItem
                            href="/"
                            label="Home"
                            icon={faHome}
                            active={isActive(pathname ?? "", "/")}
                        />
                    </li>
                    <li className="flex flex-1 self-stretch">
                        <NavItem
                            href="/track"
                            label="Lacak"
                            icon={faShippingFast}
                            active={isActive(pathname ?? "", "/track")}
                        />
                    </li>
                    <li className="flex flex-1 items-center justify-center self-stretch pb-1">
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            className="group relative flex -mt-3 flex-col items-center justify-center gap-1 active:scale-95 touch-manipulation"
                            aria-label="Buka pencarian"
                        >
                            <span
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-brand ring-4 ring-primary/15 transition-transform group-hover:scale-105 ${
                                    searchOpen ? "ring-primary/40 scale-105" : ""
                                }`}
                            >
                                <FontAwesomeIcon icon={faSearch} className="h-5 w-5" style={{ width: "1.15rem", height: "1.15rem" }} />
                            </span>
                            <span className="text-[10px] font-bold text-primary">Cari</span>
                        </button>
                    </li>
                    <li className="flex flex-1 self-stretch">
                        <NavItem
                            href="/contact"
                            label="Kontak"
                            icon={faEnvelope}
                            active={isActive(pathname ?? "", "/contact")}
                        />
                    </li>
                    <li className="relative flex flex-1" ref={profileRef}>
                        {status !== "loading" && (
                            isLoggedIn ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className={`relative flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors active:scale-95 touch-manipulation ${
                                            profileOpen ? "text-primary" : "text-slate-500"
                                        }`}
                                        aria-expanded={profileOpen}
                                        aria-haspopup="true"
                                    >
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                                                profileOpen ? "bg-primary/12 text-primary" : ""
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={faUserCircle} className="h-4 w-4" />
                                        </span>
                                        <span className="text-[10px] font-semibold">Profil</span>
                                        {profileOpen && (
                                            <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 6 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute bottom-full left-1/2 z-[60] mb-2 w-44 -translate-x-1/2 rounded-2xl border border-primary/15 bg-white py-1.5 shadow-brand-lg"
                                            >
                                                <CustomLink
                                                    href="/dashboard"
                                                    className="mx-1 flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm text-slate-700 hover:bg-primary/5"
                                                    onClick={() => setProfileOpen(false)}
                                                >
                                                    <FontAwesomeIcon icon={faTachometerAlt} className="h-4 w-4 text-primary" />
                                                    Dashboard
                                                </CustomLink>
                                                <CustomLink
                                                    href="/account/settings"
                                                    className="mx-1 flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm text-slate-700 hover:bg-primary/5"
                                                    onClick={() => setProfileOpen(false)}
                                                >
                                                    <FontAwesomeIcon icon={faCog} className="h-4 w-4 text-primary" />
                                                    Pengaturan
                                                </CustomLink>
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="mx-1 flex w-[calc(100%-0.5rem)] items-center gap-2.5 rounded-xl px-3.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                                                    Keluar
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <NavItem href="/auth/login" label="Login" icon={faSignInAlt} />
                            )
                        )}
                    </li>
                </ul>
            </nav>

            <AnimatePresence>
                {searchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-[2px] md:hidden"
                            onClick={closeSearch}
                            aria-hidden
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[61] md:hidden flex max-h-[88vh] flex-col rounded-t-[1.5rem] border-t border-primary/15 bg-white shadow-[0_-12px_40px_-12px_rgba(8,145,178,0.25)] pb-[env(safe-area-inset-bottom)]"
                        >
                            <div className="flex justify-center pt-3 pb-1">
                                <span className="h-1 w-10 rounded-full bg-slate-200" aria-hidden />
                            </div>
                            <div className="flex items-center gap-3 px-4 pt-2 pb-4">
                                <div className="relative flex-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/70">
                                        <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
                                    </span>
                                    <input
                                        ref={searchInputRef}
                                        type="search"
                                        placeholder="Cari produk game..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={closeSearch}
                                    className="rounded-xl p-2.5 text-slate-500 hover:bg-primary/5 hover:text-primary transition-colors"
                                    aria-label="Tutup"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
                                {searchQuery.trim() ? (
                                    searchResults.length > 0 ? (
                                        <ul className="space-y-1">
                                            {searchResults.map((product: { id: number; slug: string; name: string; image?: string }) => (
                                                <li key={product.id}>
                                                    <CustomLink
                                                        href={`/order/${product.slug}`}
                                                        onClick={closeSearch}
                                                        className="flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-colors hover:border-primary/10 hover:bg-primary/5 active:bg-primary/10"
                                                    >
                                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-primary-soft">
                                                            <Image
                                                                src={product.image ? getImageUrl(product.image, "product") : "/images/logo.png"}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                                sizes="48px"
                                                            />
                                                        </div>
                                                        <span className="truncate text-sm font-medium text-slate-900">
                                                            {product.name}
                                                        </span>
                                                    </CustomLink>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="py-10 text-center text-sm text-slate-500">
                                            Tidak ada produk ditemukan.
                                        </p>
                                    )
                                ) : (
                                    <div className="py-10 text-center">
                                        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <FontAwesomeIcon icon={faSearch} className="h-7 w-7" />
                                        </div>
                                        <p className="text-sm text-slate-500">Ketik nama produk untuk mencari</p>
                                        <p className="mt-1 text-xs text-slate-400">Mobile Legends, Free Fire, dan lainnya</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
