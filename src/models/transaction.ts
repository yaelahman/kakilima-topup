export interface TransactionStatusMeta {
    color: string;
    text: string;
}

export const STATUS_STEP_BY_CODE: Record<number, number> = {
    0: 2,
    1: 3,
    2: 3,
    21: 3,
    3: 4,
    100: 1
};
export const STATUS_ANIMATE_BY_CODE: Record<number, number> = {
    0: 2,
    1: 0,
    2: 0.5,
    21: 1.75,
    3: 0,
    100: 1.75
};

export const getStepFromStatus = (status?: number) => {
    if (status == null) return 1;
    return STATUS_STEP_BY_CODE[status] ?? 1;
};

/** Default header subtitle when status is pending/success */
export const DEFAULT_INVOICE_DESCRIPTION =
    'Silakan selesaikan pembayaran Anda untuk memproses pesanan';/** Default header subtitle when status is failed (100) */
export const DEFAULT_FAILED_DESCRIPTION =
    'Pembayaran tidak berhasil atau transaksi telah dibatalkan.';/** Default order description when none provided */
export const DEFAULT_ORDER_DESCRIPTION = 'Pembelian produk';