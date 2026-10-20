"use client";

import { SummaryBarMobile } from "./SummaryBarMobile";
import { SummaryBarDesktop } from "./SummaryBarDesktop";

export type AppliedPromoSummary = {
    code: string;
    discount: number;
    discount_type: number;
    message: string;
};

interface SummaryBarProps {
    onBuy: () => void;
    selectedPrice: any;
    paymentMethod?: { fee?: number | null; fee_type?: string | null; extra_price?: number; name?: string } | null;
    appliedPromo?: AppliedPromoSummary | null;
    quantity?: number;
    mobile?: boolean;
    desktop?: boolean;
}

export function SummaryBar({ onBuy, selectedPrice, paymentMethod, appliedPromo = null, quantity = 1, mobile = false, desktop = false }: SummaryBarProps) {
    if (mobile) {
        return (
            <SummaryBarMobile
                onBuy={onBuy}
                selectedPrice={selectedPrice}
                paymentMethod={paymentMethod}
                appliedPromo={appliedPromo}
                quantity={quantity}
            />
        );
    }
    if (desktop) {
        return (
            <SummaryBarDesktop
                onBuy={onBuy}
                selectedPrice={selectedPrice}
                paymentMethod={paymentMethod}
                appliedPromo={appliedPromo}
                quantity={quantity}
            />
        );
    }
    return null;
}
