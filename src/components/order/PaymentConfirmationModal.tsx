import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faTimes, faArrowRight, faUser, faPhone, faEnvelope, faCoins, faTicket, faCheckCircle, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { CustomLink } from "../utils/custom-link";
import { formatRupiah, calcPaymentFee, priceAfterPromo, formatPromoDiscountLabel } from "@/lib/helper";
import { useMemo, useState } from "react";

export type PaymentConfirmationModalProps = {
    show: boolean;
    onClose: () => void;
    selectedPrice: any;
    userInfo: any;
    paymentMethod: any;
    whatsApp: string;
    email: string;
    productName: string;
    promoCode?: string;
    appliedPromo?: { code: string; discount: number; discount_type: number; message: string } | null;
    quantity?: number;
    onSubmit: () => Promise<void> | void;
};

export const PaymentConfirmationModal = ({
    show,
    onClose,
    selectedPrice,
    userInfo,
    paymentMethod,
    whatsApp,
    email,
    productName,
    promoCode = "",
    appliedPromo = null,
    quantity = 1,
    onSubmit
}: PaymentConfirmationModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const qty = Math.max(1, Number(quantity) || 1);

    const paymentTotal = useMemo(() => {
        const base = (Number(selectedPrice?.price) || 0) * qty;
        const afterPromo = appliedPromo
            ? priceAfterPromo(base, appliedPromo).subtotal
            : base;
        const fee = calcPaymentFee(afterPromo, paymentMethod);
        return afterPromo + fee;
    }, [selectedPrice, paymentMethod, appliedPromo, qty]);

    const savings = useMemo(() => {
        const base = (Number(selectedPrice?.price) || 0) * qty;
        if (!appliedPromo) return 0;
        return priceAfterPromo(base, appliedPromo).savings;
    }, [selectedPrice, appliedPromo, qty]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
            <motion.div
                initial={{
                    scale: 1,
                    opacity: 0,
                    y: "100%"
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0
                }}
                exit={{
                    scale: 1,
                    opacity: 0,
                    y: "100%"
                }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-t-2xl md:rounded-lg p-6 max-w-lg w-full mx-0 md:mx-4 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCreditCard} className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-bold text-gray-800">Konfirmasi Pembayaran</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Product Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCartShopping} className="h-4 w-4" />
                            Detail Pesanan
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Produk:</span>
                                <span className="font-medium">{productName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Nominal:</span>
                                <span className="font-medium">{selectedPrice?.name || '-'}</span>
                            </div>
                            {qty > 1 ? (
                                <div className="flex justify-between">
                                    <span>Jumlah:</span>
                                    <span className="font-medium">{qty} voucher</span>
                                </div>
                            ) : null}
                            <div className="flex justify-between">
                                <span>User ID:</span>
                                <span className="font-medium flex gap-1">
                                    {Object.keys(userInfo).map((key) => (
                                        <span key={key}>
                                            {userInfo[key] || '-'}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Metode Pembayaran:</span>
                                <span className="font-medium">{paymentMethod?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Biaya pembayaran:</span>
                                <span className="font-medium text-red-500">
                                    {formatRupiah(
                                        calcPaymentFee(
                                            appliedPromo
                                                ? priceAfterPromo((Number(selectedPrice?.price) || 0) * qty, appliedPromo).subtotal
                                                : (Number(selectedPrice?.price) || 0) * qty,
                                            paymentMethod
                                        )
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Harga:</span>
                                <span className="font-semibold text-success">{formatRupiah((selectedPrice?.price || 0) * qty)}</span>
                            </div>
                            {appliedPromo && savings > 0 ? (
                                <div className="flex justify-between text-green-700">
                                    <span>Promo ({appliedPromo.code})</span>
                                    <span className="font-medium">
                                        −{formatPromoDiscountLabel(appliedPromo)} ({formatRupiah(savings)})
                                    </span>
                                </div>
                            ) : null}
                            <hr className="text-gray-300" />
                            <div className="flex justify-between">
                                <span>WhatsApp:</span>
                                <span className="font-medium">+62 {whatsApp || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Email:</span>
                                <span className="font-medium">{email || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Promo Code */}
                    {/* {promoCode && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faTicket} className="h-4 w-4" />
                                Kode Promo
                            </h4>
                            <div className="flex justify-between">
                                <span>Kode:</span>
                                <span className="font-medium font-mono bg-yellow-100 px-2 py-1 rounded">{promoCode}</span>
                            </div>
                        </div>
                    )} */}

                    {/* Total */}
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Total Pembayaran:</span>
                            <span className="font-bold text-xl text-primary">{formatRupiah(paymentTotal)}</span>
                        </div>
                        {appliedPromo && promoCode ? (
                            <div className="text-xs text-green-600 text-center mt-2">
                                {appliedPromo.message || `Kode promo ${promoCode} telah diterapkan.`}
                            </div>
                        ) : promoCode ? (
                            <div className="text-xs text-amber-700 text-center mt-2">
                                Kode {promoCode} akan dikirim — gunakan &quot;Cek Promo&quot; untuk memastikan potongan.
                            </div>
                        ) : null}
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="text-yellow-800 text-sm">
                            ⚠️ Pastikan semua informasi sudah benar sebelum melanjutkan pembayaran.
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={async () => {
                            if (isSubmitting) return;
                            setIsSubmitting(true);
                            try {
                                await onSubmit();
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        disabled={isSubmitting}
                        className="w-full bg-success text-white font-semibold py-4 rounded-lg hover:bg-success/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Memproses...
                            </span>
                        ) : (
                            <>
                                Lanjutkan Pembayaran
                                <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 ms-2" />
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};