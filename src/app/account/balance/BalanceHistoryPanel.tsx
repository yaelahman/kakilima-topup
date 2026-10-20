"use client";

import { formatRupiah } from "@/lib/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import type { BalanceHistoryItem } from "@/services/balance.service";

type BalanceHistoryPanelProps = {
  history: BalanceHistoryItem[];
  search: string;
  onSearchChange: (value: string) => void;
  from: string;
  onFromChange: (value: string) => void;
  to: string;
  onToChange: (value: string) => void;
  onPay: (id: number) => void;
};

export function BalanceHistoryPanel({
  history,
  search,
  onSearchChange,
  from,
  onFromChange,
  to,
  onToChange,
  onPay,
}: BalanceHistoryPanelProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
        <FontAwesomeIcon icon={faHistory} className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-800">Riwayat Top-up</h2>
      </div>
      <div className="px-4 py-3 border-b border-gray-100 space-y-2">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari invoice / nominal"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Periode:</span>
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          <span>s.d</span>
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
        {history.map((item) => {
          const isPending = item.status === 0;
          let statusLabel = "Tidak diketahui";
          let statusClass = "bg-gray-100 text-gray-600";

          if (item.status === 0) {
            statusLabel = "Menunggu";
            statusClass = "bg-amber-100 text-amber-700";
          } else if (item.status === 2) {
            statusLabel = "Sedang diproses";
            statusClass = "bg-blue-100 text-blue-700";
          } else if (item.status === 3) {
            statusLabel = "Success";
            statusClass = "bg-green-100 text-green-700";
          } else if (item.status === 100) {
            statusLabel = "Failed";
            statusClass = "bg-red-100 text-red-700";
          }
          return (
            <div
              key={item.id}
              className="px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
            >
              <div>
                <p className="font-mono text-xs sm:text-sm font-medium text-gray-800">
                  {item.invoice}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                  {formatRupiah(item.amount)} ·{" "}
                  {new Date(item.created_at).toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full ${
                    statusClass
                  }`}
                >
                  {statusLabel}
                </span>
                {isPending && (
                  <button
                    type="button"
                    onClick={() => onPay(item.id)}
                    className="text-[11px] sm:text-xs px-2 py-1 rounded-full border border-primary/40 text-primary hover:bg-primary/5 transition-colors"
                  >
                    Bayar
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {history.length === 0 && (
          <div className="px-4 py-6 text-center text-xs text-gray-500">
            Tidak ada riwayat untuk filter ini.
          </div>
        )}
      </div>
    </section>
  );
}

