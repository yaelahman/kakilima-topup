"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_NAME } from '@/lib/site-config';

export function Welcome() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setIsOpen(true);
            localStorage.setItem('hasSeenWelcome', 'true');
        }
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 12 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative bg-white rounded-3xl p-7 max-w-md w-full shadow-brand-lg overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div
                            className="absolute inset-x-0 top-0 h-28 pointer-events-none"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(var(--primary-rgb),0.18) 0%, rgba(34,211,238,0.12) 50%, transparent 100%)",
                            }}
                        />
                        <div className="relative text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white font-display text-xl font-bold shadow-brand">
                                {SITE_NAME.slice(0, 1).toUpperCase()}
                            </div>
                            <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">Selamat Datang</h2>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Terima kasih telah mengunjungi {SITE_NAME}. Nikmati top-up game yang cepat, aman, dan nyaman.
                            </p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-4 rounded-xl hover:opacity-95 transition-opacity shadow-brand"
                            >
                                Mulai Sekarang
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
