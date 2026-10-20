import { IMAGE_URL_API } from "./client";

export const getImageUrl = (image: string, prefix: string = "product") => {
    return `${IMAGE_URL_API}/${prefix}/${image}`;
}

/**
 * Calculate payment gateway fee from base amount.
 * fee_type: 'normal' = flat amount, 'percent' = percentage of base
 */
export function calcPaymentFee(
  baseAmount: number,
  payment?: { fee?: number | null; fee_type?: string | null; extra_price?: number | null } | null
): number {
  if (!payment) return 0;
  const fee = payment.fee;
  const feeType = payment.fee_type ?? null;
  if (fee == null || feeType == null) {
    return Number(payment.extra_price ?? 0);
  }
  if (feeType === "percent") {
    return Math.round(baseAmount * Number(fee) / 100);
  }
  return Number(fee);
}

/**
 * Derive payment fee from total amount (for display when base is unknown).
 * total = base + fee; for percent: fee = base * p/100 => base = total/(1+p/100), fee = total * p/(100+p)
 */
/**
 * Apply promo discount to a base price.
 * discount_type: 0 = normal (fixed nominal in Rp), 1 = percent of base.
 */
export function priceAfterPromo(
  basePrice: number,
  promo: { discount: number; discount_type: number }
): { subtotal: number; savings: number } {
  const base = Math.max(0, Math.round(Number(basePrice) || 0));
  let subtotal = base;
  if (promo.discount_type === 0) {
    subtotal = Math.round(base - Number(promo.discount));
  } else {
    subtotal = Math.round(base - (base * Number(promo.discount)) / 100);
  }
  if (subtotal < 0) subtotal = 0;
  return { subtotal, savings: base - subtotal };
}

export function formatPromoDiscountLabel(promo: { discount: number; discount_type: number }): string {
  if (promo.discount_type === 0) {
    return formatRupiah(promo.discount);
  }
  return `${promo.discount}%`;
}

export function calcPaymentFeeFromTotal(
  totalAmount: number,
  payment?: { fee?: number | null; fee_type?: string | null; extra_price?: number | null } | null
): number {
  if (!payment) return 0;
  const fee = payment.fee;
  const feeType = payment.fee_type ?? null;
  if (fee == null || feeType == null) {
    return Number(payment.extra_price ?? 0);
  }
  if (feeType === "percent") {
    const p = Number(fee);
    return Math.round(totalAmount * p / (100 + p));
  }
  return Number(fee);
}

export const formatRupiah = (amount: number | string): string => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return 'Rp 0';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numericAmount);
};

/**
 * Relative time in Indonesian, e.g. "1 menit yang lalu", "2 jam yang lalu"
 */
export function timeAgo(date: Date | string): string {
    const now = new Date();
    const then = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    if (seconds < 0) return 'baru saja';
    if (seconds < 60) return 'baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari yang lalu`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} minggu yang lalu`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} bulan yang lalu`;
    const years = Math.floor(days / 365);
    return `${years} tahun yang lalu`;
}
