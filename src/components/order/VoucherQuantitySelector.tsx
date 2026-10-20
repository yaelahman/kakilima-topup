"use client";

import { faMinus, faPlus, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface VoucherQuantitySelectorProps {
    value: number;
    max: number;
    onChange: (qty: number) => void;
}

export function VoucherQuantitySelector({ value, max, onChange }: VoucherQuantitySelectorProps) {
    const safeMax = Math.max(0, Number(max) || 0);
    const qty = safeMax < 1 ? 0 : Math.min(Math.max(1, value), safeMax);
    const disabledMinus = qty <= 1;
    const disabledPlus = safeMax < 1 || qty >= safeMax;

    return (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-950 px-4 py-4 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                    <FontAwesomeIcon icon={faTicket} className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300">Opsional</p>
                    <span className="font-display text-lg font-semibold">Jumlah Voucher</span>
                </div>
            </div>
            <div className="p-4 md:p-5 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-600">Berapa voucher yang ingin dibeli?</p>
                    <p className="text-xs text-gray-400 mt-1">{safeMax < 1 ? 'Stok voucher habis' : `Stok tersedia: ${safeMax}`}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={disabledMinus}
                        onClick={() => onChange(qty - 1)}
                        className="h-10 w-10 rounded-xl border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                        aria-label="Kurangi"
                    >
                        <FontAwesomeIcon icon={faMinus} className="h-3.5 w-3.5" />
                    </button>
                    <input
                        type="number"
                        min={1}
                        max={safeMax}
                        value={qty}
                        onChange={(e) => {
                            const next = parseInt(e.target.value, 10);
                            if (Number.isNaN(next)) return;
                            onChange(Math.min(Math.max(1, next), safeMax));
                        }}
                        className="h-10 w-14 text-center font-semibold border border-gray-200 rounded-xl outline-none focus:border-primary"
                    />
                    <button
                        type="button"
                        disabled={disabledPlus}
                        onClick={() => onChange(qty + 1)}
                        className="h-10 w-10 rounded-xl border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                        aria-label="Tambah"
                    >
                        <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
