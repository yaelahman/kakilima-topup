import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faWallet, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { formatRupiah, calcPaymentFee } from "@/lib/helper";
import Image from "next/image";

interface PaymentMethodSelectorProps {
    selectedPayment: any;
    payments?: any[];
    denom?: any;
    isLoggedIn?: boolean;
    currentBalance?: number | null;
    onSelectPayment: (payment: any) => void;
    onSelectBalance?: () => void;
}

export const PaymentMethodSelector = ({
    selectedPayment,
    payments = [],
    denom = {},
    isLoggedIn = false,
    currentBalance = null,
    onSelectPayment,
    onSelectBalance,
}: PaymentMethodSelectorProps) => {
    const basePrice = Number(denom?.price) || 0;

    // Normalize payments to grouped structure like PaymentMethodModal
    let groupedPayments: { group?: string; payments: any[] }[] = [];
    try {
        if (payments.length > 0) {
            if (payments[0].payments && Array.isArray(payments[0].payments)) {
                groupedPayments = payments;
            } else if (payments[0].name && payments[0].id) {
                groupedPayments = [{ group: "Metode Lainnya", payments }];
            }
        }
    } catch {
        groupedPayments = [];
    }

    const selectedFee =
        selectedPayment && basePrice > 0 ? calcPaymentFee(basePrice, selectedPayment) : 0;
    const selectedTotal = basePrice + selectedFee;

    return (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-950 px-4 py-3 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white">
                    <FontAwesomeIcon icon={faCreditCard} className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300">Langkah 03</p>
                    <p className="text-sm font-display font-semibold">
                        {selectedPayment?.name || "Pilih pembayaran"}
                    </p>
                    {basePrice > 0 && selectedPayment && (
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                            <span>
                                Fee: {selectedFee > 0 ? formatRupiah(selectedFee) : "Rp 0"}
                            </span>
                            <span className="h-3 w-px bg-gray-300" />
                            <span>Total: {formatRupiah(selectedTotal)}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 space-y-3">
                {/* Saldo option - always visible, locked if not logged in */}
                <button
                    type="button"
                    onClick={isLoggedIn ? onSelectBalance : undefined}
                    disabled={!isLoggedIn}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs sm:text-sm transition-colors ${
                        isLoggedIn
                            ? selectedPayment?.id === 0
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                : "border-emerald-200 bg-emerald-25 text-emerald-700 hover:bg-emerald-50"
                            : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <FontAwesomeIcon icon={faWallet} className="h-3.5 w-3.5" />
                        </span>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-xs sm:text-sm">Bayar dengan Saldo</span>
                            {isLoggedIn ? (
                                <span className="text-[11px] text-emerald-700">
                                    Saldo saat ini: {formatRupiah(currentBalance ?? 0)}
                                </span>
                            ) : (
                                <span className="text-[11px] text-gray-500">
                                    Masuk untuk menggunakan saldo akun
                                </span>
                            )}
                        </div>
                    </div>
                    {isLoggedIn && selectedPayment?.id === 0 && (
                        <span className="text-[11px] font-semibold">Dipilih</span>
                    )}
                </button>

                {groupedPayments.length > 0 && (
                    <div className="space-y-2 overflow-y-auto">
                        {groupedPayments.map((group, idx) => (
                            <details
                                key={group.group || `group-${idx}`}
                                className="group rounded-xl border border-gray-200 bg-gray-50/60 open:bg-white open:border-primary/40 transition-colors"
                                open={idx === 0}
                            >
                                <summary className="flex items-center justify-between px-3 py-2 cursor-pointer select-none">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <FontAwesomeIcon icon={faCreditCard} className="h-3.5 w-3.5" />
                                        </span>
                                        <span className="text-[11px] font-semibold text-gray-700">
                                            {group.group || "Metode Lainnya"}
                                        </span>
                                    </div>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className="h-3 w-3 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                                    />
                                </summary>
                                <div className="px-3 pb-2 pt-1 space-y-1.5">
                                    {group.payments.map((pm: any) => {
                                        const fee = calcPaymentFee(basePrice, pm);
                                        const total = basePrice + fee;
                                        const isActive = selectedPayment?.id === pm.id;
                                        const showFeeBadge = fee > 0;
                                        return (
                                            <button
                                                key={pm.id}
                                                type="button"
                                                onClick={() => onSelectPayment(pm)}
                                                className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-xs sm:text-sm transition-colors ${
                                                    isActive
                                                        ? "border-primary bg-primary/5"
                                                        : "border-gray-200 hover:border-primary/40 hover:bg-gray-50"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                        {pm.icon || pm.image ? (
                                                            <Image
                                                                src={pm.icon || pm.image}
                                                                alt={pm.name}
                                                                width={32}
                                                                height={32}
                                                                className="object-contain"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-gray-600">
                                                                {pm.name?.charAt(0) || "?"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-start">
                                                        <span className="font-semibold text-xs sm:text-sm text-gray-800">
                                                            {pm.name}
                                                        </span>
                                                        {showFeeBadge && (
                                                            <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-0.5">
                                                                Fee {formatRupiah(fee)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-semibold text-gray-800">
                                                        {formatRupiah(total)}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500">
                                                        Total
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </details>
                        ))}
                    </div>
                )}

                {!groupedPayments.length && (
                    <p className="text-[11px] text-gray-500">
                        Metode pembayaran belum tersedia untuk produk ini.
                    </p>
                )}
            </div>
        </div>
    );
};