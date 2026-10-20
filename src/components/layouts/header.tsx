"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faSignInAlt, faUserCircle, faChevronDown, faTachometerAlt, faCog, faWallet, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Sidebar } from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { CustomLink } from "../utils/custom-link";
import { useQuery } from "@tanstack/react-query";
import { getHomepageProducts } from "@/services/homepage.service";
import { getImageUrl } from "@/lib/helper";
import { useSession, signOut } from "next-auth/react";
import { SITE_LOGO_HORIZONTAL_PATH, SITE_NAME } from "@/lib/site-config";

const MAX_SEARCH_RESULTS = 8

export function Header() {
    const { data: session, status } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownBox, setDropdownBox] = useState<{ top: number; left: number; width: number } | null>(null);
    const [portalReady, setPortalReady] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchAnchorRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const { data } = useQuery({
        queryKey: ["homepage", "products"],
        queryFn: () => getHomepageProducts(),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });
    const products = data?.products ?? [];

    const searchResults = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q || !products.length) return [];
        return products
            .filter((p: any) => {
                const name = (p.name || "").toLowerCase();
                const slug = (p.slug || "").toLowerCase();
                return name.includes(q) || slug.includes(q);
            })
            .slice(0, MAX_SEARCH_RESULTS);
    }, [searchQuery, products]);

    const updateDropdownPosition = useCallback(() => {
        const el = searchAnchorRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setDropdownBox({
            top: rect.bottom + 8,
            left: rect.left,
            width: rect.width,
        });
    }, []);

    useEffect(() => {
        setPortalReady(true);
    }, []);

    useEffect(() => {
        if (!showResults) {
            setDropdownBox(null);
            return;
        }
        updateDropdownPosition();
        const onReposition = () => updateDropdownPosition();
        window.addEventListener("resize", onReposition);
        window.addEventListener("scroll", onReposition, true);
        return () => {
            window.removeEventListener("resize", onReposition);
            window.removeEventListener("scroll", onReposition, true);
        };
    }, [showResults, updateDropdownPosition]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowResults(true);
    };
    const closeResults = () => setShowResults(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const inSearch = searchRef.current?.contains(target);
            const inDropdown = dropdownRef.current?.contains(target);
            if (!inSearch && !inDropdown) {
                setShowResults(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setShowUserMenu(false);
        signOut({ callbackUrl: "/" });
    };

    const searchDropdown =
        portalReady &&
        showResults &&
        dropdownBox &&
        createPortal(
            <div
                ref={dropdownRef}
                style={{
                    position: "fixed",
                    top: dropdownBox.top,
                    left: dropdownBox.left,
                    width: dropdownBox.width,
                    zIndex: 9999,
                }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            >
                <div className="max-h-80 overflow-y-auto bg-white p-2">
                    {searchQuery.trim() ? (
                        searchResults.length > 0 ? (
                            <ul className="space-y-0.5">
                                {searchResults.map((product: any) => (
                                    <li key={product.id}>
                                        <CustomLink
                                            href={`/order/${product.slug}`}
                                            onClick={closeResults}
                                            className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-primary/5 transition-colors"
                                        >
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-primary-soft">
                                                <Image
                                                    src={product.image ? getImageUrl(product.image, "product") : "/images/logo.png"}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                    sizes="40px"
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-slate-900 truncate">{product.name}</span>
                                        </CustomLink>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="py-4 text-center text-sm text-slate-500">Tidak ada produk ditemukan.</p>
                        )
                    ) : (
                        <p className="py-3 text-center text-sm text-slate-500">Mulai mengetik untuk mencari…</p>
                    )}
                </div>
            </div>,
            document.body
        );

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            {searchDropdown}
            <header className="relative z-30 bg-white/90 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                    <div
                        className="absolute inset-y-0 left-0 w-1.5"
                        style={{
                            background: "linear-gradient(180deg, var(--primary) 0%, #22D3EE 100%)",
                        }}
                    />
                    <div
                        className="absolute -right-16 -top-20 h-40 w-40 rounded-full opacity-40 blur-3xl"
                        style={{ background: "rgba(var(--primary-rgb), 0.35)" }}
                    />
                </div>
                <nav className="relative container mx-auto max-w-[1320px]">
                    <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-3.5">
                        <div className="flex items-center gap-2.5 min-w-0 shrink-0">
                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm hover:bg-primary transition-colors active:scale-95"
                                aria-label="Menu"
                                onClick={toggleSidebar}
                            >
                                <FontAwesomeIcon icon={faBars} className="h-4 w-4" />
                            </button>
                            <CustomLink href="/" className="flex items-center min-w-0 group" aria-label={`${SITE_NAME} Beranda`}>
                                <Image
                                    src={SITE_LOGO_HORIZONTAL_PATH}
                                    alt={SITE_NAME}
                                    width={220}
                                    height={97}
                                    className="h-9 w-auto max-w-[148px] sm:h-10 sm:max-w-[180px] md:h-11 md:max-w-[200px] object-contain object-left transition-opacity group-hover:opacity-90"
                                    priority
                                />
                            </CustomLink>
                        </div>

                        <div className="hidden md:flex flex-1 justify-center px-3 lg:px-6 min-w-0" ref={searchRef}>
                            <div className="relative w-full max-w-xl group" ref={searchAnchorRef}>
                                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-11 items-center justify-center text-slate-400 group-focus-within:text-primary transition-colors">
                                    <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    role="searchbox"
                                    placeholder="Cari game atau produk…"
                                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 py-0 pl-11 pr-4 text-sm leading-none text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/15"
                                    autoComplete="off"
                                    spellCheck="false"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    onFocus={() => setShowResults(true)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center shrink-0" ref={userMenuRef}>
                            {status !== "loading" && (
                                status === "authenticated" && session?.user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex min-w-[120px] items-center gap-2 rounded-2xl border border-primary/20 bg-primary-soft/60 px-3 py-2 text-slate-800 hover:border-primary/40 md:min-w-[140px]"
                                            aria-expanded={showUserMenu}
                                            aria-haspopup="true"
                                        >
                                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white">
                                                <FontAwesomeIcon icon={faUserCircle} className="h-4 w-4" />
                                            </span>
                                            <span className="max-w-[80px] truncate text-xs font-semibold md:max-w-[100px] md:text-sm">
                                                {session.user.name ?? session.user.email ?? "Profil"}
                                            </span>
                                            <FontAwesomeIcon icon={faChevronDown} className={`h-3 w-3 shrink-0 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {showUserMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -8 }}
                                                    className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-primary/15 bg-white py-1 shadow-brand-lg"
                                                >
                                                    <CustomLink href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary/5" onClick={() => setShowUserMenu(false)}>
                                                        <FontAwesomeIcon icon={faTachometerAlt} className="h-4 w-4 text-primary" />
                                                        Dashboard
                                                    </CustomLink>
                                                    <CustomLink href="/account/balance" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary/5" onClick={() => setShowUserMenu(false)}>
                                                        <FontAwesomeIcon icon={faWallet} className="h-4 w-4 text-primary" />
                                                        Isi Saldo
                                                    </CustomLink>
                                                    <CustomLink href="/account/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary/5" onClick={() => setShowUserMenu(false)}>
                                                        <FontAwesomeIcon icon={faCog} className="h-4 w-4 text-primary" />
                                                        Pengaturan
                                                    </CustomLink>
                                                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                                                        <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                                                        Keluar
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 rounded-2xl border border-primary/15 bg-primary-soft/50 p-1">
                                        <CustomLink href="/auth/login" className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-brand hover:bg-primary-dark transition-colors md:text-sm">
                                            <FontAwesomeIcon icon={faSignInAlt} className="h-3.5 w-3.5" />
                                            Masuk
                                        </CustomLink>
                                        <CustomLink href="/auth/register" className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-primary md:text-sm">
                                            Daftar
                                        </CustomLink>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}
