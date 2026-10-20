"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { formatRupiah, calcPaymentFee, priceAfterPromo, formatPromoDiscountLabel } from "@/lib/helper";
import type { AppliedPromoSummary } from "./SummaryBar";

interface SummaryBarDesktopProps {
    onBuy: () => void;
    selectedPrice: any;
    paymentMethod?: { fee?: number | null; fee_type?: string | null; extra_price?: number; name?: string } | null;
    appliedPromo?: AppliedPromoSummary | null;
    quantity?: number;
}

export function SummaryBarDesktop({ onBuy, selectedPrice, paymentMethod, appliedPromo = null, quantity = 1 }: SummaryBarDesktopProps) {
    const qty = Math.max(1, Number(quantity) || 1);
    const basePrice = (Number(selectedPrice?.price) || 0) * qty;
    const { subtotal: afterPromo, savings } = appliedPromo
        ? priceAfterPromo(basePrice, appliedPromo)
        : { subtotal: basePrice, savings: 0 };
    const paymentFee = calcPaymentFee(afterPromo, paymentMethod);
    const totalPrice = afterPromo + paymentFee;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="hidden md:block w-full md:static col-span-2"
        >
            <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950 text-white shadow-brand-lg">
                <div
                    className="pointer-events-none absolute inset-0 opacity-70"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 80% at 100% 0%, rgba(var(--primary-rgb),0.45), transparent 50%)",
                    }}
                />
                <div className="relative flex items-center gap-4 px-5 py-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                        <FontAwesomeIcon icon={faGamepad} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-wrap items-center gap-4">
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-sky-300/90">Produk</p>
                            <p className="truncate font-display font-semibold">{selectedPrice?.name || "–"}{qty > 1 ? ` × ${qty}` : ""}</p>
                        </div>
                        {appliedPromo && savings > 0 ? (
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-sky-300/90">Promo</p>
                                <p className="truncate text-sm font-medium text-sky-100">{appliedPromo.code} · −{formatPromoDiscountLabel(appliedPromo)}</p>
                            </div>
                        ) : null}
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-sky-300/90">Total</p>
                            <motion.p key={totalPrice} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-lg font-bold tabular-nums">
                                {formatRupiah(totalPrice)}
                            </motion.p>
                        </div>
                    </div>
                    <motion.button
                        type="button"
                        onClick={onBuy}
                        className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-sky-100"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Beli Sekarang
                        <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
