"use client";

import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faShippingFast, faGamepad, faHeadset, faInfoCircle, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { CustomLink } from "@/components/utils/custom-link";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { href: "/", label: "Beranda", icon: faHome },
    { href: "/track", label: "Lacak Pesanan", icon: faShippingFast },
    { href: "/price-list", label: "Daftar Harga", icon: faGamepad },
    { href: "/blog", label: "Blog", icon: faNewspaper },
    { href: "/contact", label: "Hubungi Kami", icon: faHeadset },
    { href: "/about", label: "Tentang Kami", icon: faInfoCircle },
] as const;

function isNavActive(pathname: string, href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
}

export function Navigation() {
    const pathname = usePathname();

    return (
        <nav
            className="relative z-10 hidden md:block border-b border-slate-200/70 bg-gradient-to-r from-primary-soft/80 via-white to-primary-soft/50"
            aria-label="Main navigation"
        >
            <div className="container mx-auto max-w-[1320px] px-4 md:px-6">
                <ul className="flex items-center justify-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
                    {NAV_ITEMS.map(({ href, label, icon }) => {
                        const active = isNavActive(pathname ?? "", href);
                        return (
                            <li key={href} className="relative shrink-0">
                                <CustomLink
                                    href={href}
                                    className={`relative z-10 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-colors ${
                                        active
                                            ? "font-semibold text-white"
                                            : "text-slate-600 hover:text-primary"
                                    }`}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="nav-active-pill"
                                            className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary-dark to-primary shadow-brand"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5 opacity-90" />
                                    <span>{label}</span>
                                </CustomLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
