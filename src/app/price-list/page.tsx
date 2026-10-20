"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faShoppingCart, faSpinner, faSearch } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Image from "next/image";
import { CustomLink } from "@/components/utils/custom-link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPriceList } from "@/services/homepage.service";
import { formatRupiah, getImageUrl } from "@/lib/helper";

function productImageUrl(product: any): string {
    if (!product?.image) return "/images/logo.png";
    return getImageUrl(product.image, "product");
}

export default function PriceList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProductId, setSelectedProductId] = useState<number | string | null>(null);

    const { data, isFetching, error } = useQuery({
        queryKey: ["price-list"],
        queryFn: () => getPriceList(),
    });

    const products = data?.products ?? [];
    const searchLower = searchTerm.trim().toLowerCase();
    const filteredProducts = searchLower
        ? products.filter((p: any) => {
            const nameMatch = p.name && p.name.toLowerCase().includes(searchLower);
            const desc = p.description ? String(p.description).replace(/<[^>]*>/g, "").toLowerCase() : "";
            const descMatch = desc && desc.includes(searchLower);
            return nameMatch || descMatch;
        })
        : products;

    const selectedProduct = selectedProductId
        ? products.find((p: any) => p.id === selectedProductId || String(p.id) === String(selectedProductId))
        : null;

    return (
        <div className="space-y-6">
            <section className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Daftar Harga</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Temukan berbagai pilihan nominal top up game online dengan harga terbaik dan proses instant
                </p>
            </section>

            <section className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Cari produk</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari game atau produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        disabled={isFetching}
                    />
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                    />
                </div>
            </section>

            {isFetching && (
                <div className="flex justify-center py-8">
                    <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-primary animate-spin" />
                </div>
            )}

            {error && (
                <p className="text-center text-red-600 py-4">Gagal memuat daftar harga. Silakan coba lagi.</p>
            )}

            {!isFetching && !error && products.length > 0 && (
                <section className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-12 gap-2">
                    {filteredProducts.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500 py-4 text-sm">Tidak ada produk yang cocok dengan pencarian.</p>
                    ) : (
                        filteredProducts.map((product: any) => (
                            <motion.button
                                key={product.id}
                                type="button"
                                onClick={() => setSelectedProductId(product.id)}
                                className={`text-left rounded-lg border overflow-hidden shadow hover:shadow-md transition-all duration-200 flex flex-col ${selectedProductId === product.id || selectedProductId === String(product.id) ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200 bg-white hover:border-primary/40"}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="w-full h-14 sm:h-16 relative bg-gray-100">
                                    <Image
                                        src={productImageUrl(product)}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, (max-width: 1024px) 16vw, 12vw"
                                        unoptimized={productImageUrl(product).startsWith("http")}
                                    />
                                </div>
                                <div className="p-1.5 flex-1 min-h-0">
                                    <h3 className="font-medium text-gray-800 text-xs line-clamp-2 leading-tight">{product.name}</h3>
                                </div>
                            </motion.button>
                        ))
                    )}
                </section>
            )}

            {!isFetching && selectedProduct && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                                src={productImageUrl(selectedProduct)}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover"
                                unoptimized={productImageUrl(selectedProduct).startsWith("http")}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faGamepad} className="h-5 w-5 text-primary" />
                                <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                            </div>
                            {selectedProduct.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-3 px-4 text-left">Nominal</th>
                                    <th className="py-3 px-4 text-left">Harga</th>
                                    <th className="py-3 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(selectedProduct.product_type || []).map((price: any) => (
                                    <tr key={price.id} className="border-b last:border-0">
                                        <td className="py-3 px-4">{price.name}</td>
                                        <td className="py-3 px-4">{formatRupiah(price.price)}</td>
                                        <td className="py-3 px-4">
                                            <CustomLink href={`/order/${selectedProduct.slug}?price_id=${price.id}`}>
                                                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4" />
                                                    <span>Beli</span>
                                                </button>
                                            </CustomLink>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.section>
            )}

            {!isFetching && !error && products.length === 0 && (
                <p className="text-center text-gray-500 py-8">Belum ada produk.</p>
            )}
        </div>
    );
}
