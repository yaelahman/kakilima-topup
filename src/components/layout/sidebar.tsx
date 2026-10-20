"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from "@fortawesome/free-solid-svg-icons";
import { CustomLink } from "@/components/utils/custom-link";
import { SITE_NAME } from "@/lib/site-config";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const navigationItems = [
        { icon: faHome, label: 'Beranda', href: '/' },
        { icon: faGamepad, label: 'Daftar Harga', href: '/price-list' },
        { icon: faTicketAlt, label: 'Voucher', href: '/voucher' },
        { icon: faShippingFast, label: 'Lacak Pesanan', href: '/track' },
        { icon: faHeadset, label: 'Hubungi Kami', href: '/contact' },
        { icon: faInfoCircle, label: 'Tentang Kami', href: '/about' },
    ];

    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:translate-x-0"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">W</span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-800">{SITE_NAME}</h1>
                            </div>
                            <button
                                onClick={onClose}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        {/* User Section */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">Selamat Datang</p>
                                    <p className="text-sm text-gray-500">Silakan masuk untuk melanjutkan</p>
                                </div>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FontAwesomeIcon icon={faCog} className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>

                            {/* User Menu */}
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 space-y-2"
                                    >
                                        <CustomLink
                                            href="/login"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Masuk
                                        </CustomLink>
                                        <CustomLink
                                            href="/register"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Daftar
                                        </CustomLink>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-6">
                            <ul className="space-y-2">
                                {navigationItems.map((item, index) => (
                                    <motion.li
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <CustomLink
                                            href={item.href}
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 group"
                                            onClick={onClose}
                                        >
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="h-5 w-5 group-hover:scale-110 transition-transform"
                                            />
                                            <span className="font-medium">{item.label}</span>
                                        </CustomLink>
                                    </motion.li>
                                ))}
                            </ul>
                        </nav>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    © {new Date().getFullYear()} {SITE_NAME}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Platform top-up game terpercaya
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
} 