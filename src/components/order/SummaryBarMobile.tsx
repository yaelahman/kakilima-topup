"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { formatRupiah, calcPaymentFee, priceAfterPromo } from "@/lib/helper";
import type { AppliedPromoSummary } from "./SummaryBar";

interface SummaryBarMobileProps {
    onBuy: () => void;
    selectedPrice: any;
    paymentMethod?: { fee?: number | null; fee_type?: string | null; extra_price?: number; name?: string } | null;
    appliedPromo?: AppliedPromoSummary | null;
    quantity?: number;
}

export function SummaryBarMobile({ onBuy, selectedPrice, paymentMethod, appliedPromo = null, quantity = 1 }: SummaryBarMobileProps) {
    const qty = Math.max(1, Number(quantity) || 1);
    const basePrice = (Number(selectedPrice?.price) || 0) * qty;
    const { subtotal: afterPromo } = appliedPromo
        ? priceAfterPromo(basePrice, appliedPromo)
        : { subtotal: basePrice };
    const paymentFee = calcPaymentFee(afterPromo, paymentMethod);
    const totalPrice = afterPromo + paymentFee;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom))] left-0 right-0 block md:hidden w-full z-40 px-3 pb-2"
        >
            <motion.div
                data-summary-inner
                className="w-full overflow-hidden rounded-[1.35rem] border border-white/20 bg-slate-950 shadow-brand-lg"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.25, delay: 0.03 }}
            >
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
                    <div className="relative px-3 py-2 flex items-center gap-2 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
                            <FontAwesomeIcon icon={faGamepad} className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                            <div className="min-w-0">
                                <span className="text-[10px] text-white/70 block leading-tight">Produk</span>
                                <span className="text-xs font-semibold text-white truncate block">{selectedPrice?.name || "–"}{qty > 1 ? ` × ${qty}` : ""}</span>
                            </div>
                            <div className="h-6 w-px bg-white/20 shrink-0" />
                            <div className="shrink-0 text-left">
                                <span className="text-[10px] text-white/70 block leading-tight">Total</span>
                                <motion.span
                                    className="text-sm font-bold text-white tabular-nums"
                                    key={totalPrice}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {formatRupiah(totalPrice)}
                                </motion.span>
                                {appliedPromo ? (
                                    <span className="text-[9px] text-white/85 block leading-tight truncate max-w-[92px]" title={appliedPromo.code}>
                                        Promo {appliedPromo.code}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                        <motion.button
                            type="button"
                            onClick={onBuy}
                            className="shrink-0 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold active:scale-[0.98] flex items-center gap-1.5 shadow-brand"
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <span>Beli</span>
                            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
