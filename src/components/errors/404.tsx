"use client"
import { motion } from "framer-motion";
import { CustomLink } from "@/components/utils/custom-link";

export default function Page404() {
    return (
        <div className="py-20 flex items-center justify-center">
            <div className="text-center space-y-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold text-gray-800">Halaman Tidak Ditemukan</h2>
                    <p className="text-gray-600 mt-2">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <CustomLink
                        href="/"
                        className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Kembali ke Beranda
                    </CustomLink>
                </motion.div>
            </div>
        </div>
    );
}
