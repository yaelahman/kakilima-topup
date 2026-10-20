"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getLatestTransactions } from "@/services/order.service";
import { formatRupiah, timeAgo } from "@/lib/helper";

const DEBOUNCE_MS = 400;

const statusClass: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    danger: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-100 text-gray-800',
};

export default function Track() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const searchParam = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

    const { data, isFetching, error } = useQuery({
        queryKey: ['track', 'latest-transactions', searchParam ?? ''],
        queryFn: () => getLatestTransactions(searchParam ? { q: searchParam } : undefined),
    });

    const transactions = data?.transactions ?? [];

    return (
        <div className="space-y-6">
            <section className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Lacak Pesanan</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Pantau status pesanan Anda dengan mudah
                </p>
            </section>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Cari pesanan berdasarkan nomor Invoice (min. 2 karakter)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300"
                    disabled={isFetching}
                />
                <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                />
            </div>

            {isFetching && (
                <div className="flex justify-center py-8">
                    <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-primary animate-spin" />
                </div>
            )}

            {error && (
                <p className="text-center text-red-600 py-4">Gagal memuat data pesanan. Silakan coba lagi.</p>
            )}

            {!isFetching && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            {searchParam && transactions.length === 0
                                                ? "Tidak ada pesanan dengan invoice yang cocok."
                                                : "Tidak ada pesanan ditemukan."}
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">{order.invoice}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{order.product}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatRupiah(order.amount)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass[order.status_color] ?? statusClass.secondary}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.created_at ? timeAgo(order.created_at) : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
