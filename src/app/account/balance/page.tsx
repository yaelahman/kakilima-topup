"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  getBalancePage,
  createRecharge,
  getBalanceTrx,
  getBalanceHistoryLedger,
  type BalancePageData,
  type BalanceHistoryLedgerItem,
  type RechargeResult,
} from "@/services/balance.service";
import { calcPaymentFee, formatRupiah } from "@/lib/helper";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faSpinner, faCheckCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BalanceHistoryPanel } from "./BalanceHistoryPanel";
import { useAuthClient } from "@/lib/use-auth-client";
import { getProfile, type UserProfile } from "@/services/account.service";

const AMOUNT_PRESETS = [10000, 25000, 50000, 100000, 250000, 500000, 1000000];

export default function AccountBalancePage() {
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? null;
  const api = useAuthClient();
  const [amount, setAmount] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState<number | "">("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<RechargeResult | null>(null);
  const [historySearch, setHistorySearch] = useState("");
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");
  const [loadingExisting, setLoadingExisting] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["account", "profile"],
    queryFn: () => getProfile(api),
    enabled: status === "authenticated",
  });

  const profile = profileQuery.data as UserProfile | undefined;

  useEffect(() => {
    if (profile?.phone) {
      setWhatsapp(profile.phone);
    }
  }, [profile?.phone]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["balance-page", token],
    queryFn: () => getBalancePage(token),
    enabled: status === "authenticated",
  });

  const { data: ledger } = useQuery({
    queryKey: ["balance-history-ledger", token],
    queryFn: () => getBalanceHistoryLedger(token),
    enabled: status === "authenticated",
  });

  const paymentMethodsFlat = data
    ? (data.groups ?? []).flatMap((g) => data.payment_methods?.[g] ?? [])
    : [];
  const numAmount = parseInt(amount, 10) || 0;
  const validAmount = numAmount >= 10000 && numAmount <= 10000000;

  const selectedPayment = useMemo(
    () => paymentMethodsFlat.find((pm) => pm.id === paymentMethodId) ?? null,
    [paymentMethodsFlat, paymentMethodId]
  );

  const paymentFee = useMemo(
    () => calcPaymentFee(numAmount, selectedPayment),
    [numAmount, selectedPayment]
  );

  const totalToPay = numAmount + paymentFee;

  const filteredHistory = useMemo(() => {
    if (!data?.history) return [];
    const q = historySearch.trim().toLowerCase();
    const fromDate = historyFrom ? new Date(historyFrom) : null;
    const toDate = historyTo ? new Date(historyTo) : null;
    return data.history.filter((item) => {
      const created = new Date(item.created_at);
      if (fromDate && created < fromDate) return false;
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (created > to) return false;
      }
      if (q) {
        const haystack = `${item.invoice} ${item.amount}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [data?.history, historySearch, historyFrom, historyTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validAmount || !paymentMethodId) {
      toast.error("Isi nominal (min Rp 10.000) dan pilih metode pembayaran");
      return;
    }
    setSubmitting(true);
    setSuccessData(null);
    try {
      const { data: result } = await createRecharge(
        {
          amount: numAmount,
          payment_method_id: paymentMethodId as number,
          ...(whatsapp.trim() ? { whatsapp: whatsapp.trim() } : {}),
        },
        token
      );
      setSuccessData(result);
      refetch();
      toast.success("Pesanan top-up berhasil dibuat");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat top-up";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayExisting = async (id: number) => {
    if (!token) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }
    try {
      setLoadingExisting(true);
      const trx = await getBalanceTrx(id, token);
      const mapped: RechargeResult = {
        id: trx.id,
        invoice: trx.invoice,
        amount: trx.amount,
        status: trx.status,
        rekening: trx.rekening ?? null,
        qr_url: trx.qr_url ?? null,
        payment_method: trx.payment_method,
      };
      setSuccessData(mapped);
      toast.success("Detail pembayaran dimuat");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat detail pembayaran";
      toast.error(msg);
    } finally {
      setLoadingExisting(false);
    }
  };

  const copyInvoice = () => {
    if (successData?.invoice) {
      navigator.clipboard.writeText(successData.invoice);
      toast.success("Invoice disalin");
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Isi Saldo</h1>
        <p className="text-gray-600 mt-1">Top-up saldo untuk belanja lebih mudah</p>
      </div>

      {/* Current balance */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <h2 className="text-lg font-semibold text-gray-800">Saldo Saat Ini</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : (
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faWallet} className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Saldo tersedia</p>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{formatRupiah(data?.balance ?? 0)}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main content: left = pay section, right = history table */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: pay section */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {successData ? "Bayar Top-up" : "Top-up Saldo"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {successData
                  ? "Gunakan instruksi di bawah untuk menyelesaikan pembayaran."
                  : "Pilih nominal dan metode pembayaran"}
              </p>
            </div>
            {loadingExisting && (
              <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 text-primary animate-spin" />
            )}
          </div>
          <div className="p-6">
          {successData ? (
            <div className="space-y-5 max-w-lg">
              <div className="flex items-center gap-3 text-green-700 bg-green-50 rounded-xl px-4 py-3">
                <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 flex-shrink-0" />
                <span className="font-semibold">Pesanan top-up berhasil</span>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-sm text-gray-500">Invoice</span>
                  <button
                    type="button"
                    onClick={copyInvoice}
                    className="text-sm font-mono font-semibold text-primary hover:text-primary/80 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    {successData.invoice}
                    <FontAwesomeIcon icon={faCopy} className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">Nominal</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(successData.amount)}</span>
                </div>
                {successData.payment_method && (
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-gray-600">Metode</span>
                    <span className="font-medium text-gray-900">{successData.payment_method.name}</span>
                  </div>
                )}
              </div>
              {successData.rekening && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
                  <p className="text-sm font-semibold text-amber-800 mb-2">Rekening / instruksi pembayaran</p>
                  <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{successData.rekening}</p>
                </div>
              )}
              {successData.qr_url && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Scan QR untuk bayar</p>
                  <div className="mx-auto max-w-[200px]">
                    <Image
                      src={successData.qr_url}
                      alt="QR Pembayaran"
                      width={200}
                      height={200}
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  setAmount("");
                  setPaymentMethodId("");
                }}
                className="w-full py-3 px-6 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Buat top-up lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Nominal top-up</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                  <input
                    type="number"
                    min={10000}
                    max={10000000}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Min. Rp 10.000 – Maks. Rp 10.000.000</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {AMOUNT_PRESETS.map((preset) => {
                    const isSelected = amount === String(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(String(preset))}
                        className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${isSelected
                          ? "bg-primary text-white border-primary"
                          : "border-gray-200 text-gray-700 bg-white hover:border-primary/50 hover:bg-primary/5"
                          }`}
                      >
                        {formatRupiah(preset)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Metode pembayaran</label>
                <select
                  value={paymentMethodId === "" ? "" : String(paymentMethodId)}
                  onChange={(e) => setPaymentMethodId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                >
                  <option value="">Pilih metode pembayaran</option>
                  {paymentMethodsFlat.map((pm) => {
                    let feeLabel = "";
                    if (pm.fee && pm.fee_type) {
                      if (pm.fee_type === "percent") {
                        feeLabel = ` (fee ${pm.fee}% payment gateway)`;
                      } else {
                        feeLabel = ` (+${formatRupiah(pm.fee)} biaya gateway)`;
                      }
                    }
                    return (
                      <option key={pm.id} value={pm.id}>
                        {pm.name}
                        {feeLabel}
                      </option>
                    );
                  })}
                </select>
              </div>
              {paymentMethodId && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nominal top-up</span>
                    <span className="font-medium text-gray-900">{formatRupiah(numAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya payment gateway</span>
                    <span className="font-medium text-red-600">
                      {paymentFee > 0 ? formatRupiah(paymentFee) : "Rp 0"}
                    </span>
                  </div>
                  <div className="border-t border-primary/10 my-1" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total yang harus dibayar</span>
                    <span className="font-extrabold text-gray-900">{formatRupiah(totalToPay)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Fee dihitung sesuai kebijakan payment gateway dan dapat berbeda untuk setiap metode.
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  readOnly
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !validAmount || !paymentMethodId}
                className="w-full py-3.5 px-6 bg-primary text-white font-semibold rounded-xl shadow-sm hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5" />
                    Memproses...
                  </>
                ) : (
                  "Lanjut ke pembayaran"
                )}
              </button>
            </form>
          )}
          </div>
        </section>

        {/* Right: history with filters + ledger */}
        <div className="space-y-4">
          {data && (data.history?.length ?? 0) > 0 && (
            <BalanceHistoryPanel
              history={filteredHistory}
              search={historySearch}
              onSearchChange={setHistorySearch}
              from={historyFrom}
              onFromChange={setHistoryFrom}
              to={historyTo}
              onToChange={setHistoryTo}
              onPay={handlePayExisting}
            />
          )}

          {ledger && ledger.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Riwayat Saldo (in / out)</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Catatan lengkap perubahan saldo Anda.
                  </p>
                </div>
              </div>
              <div className="max-h-[260px] overflow-y-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="text-left text-gray-500">
                      <th className="px-4 py-2 font-medium">Tanggal</th>
                      <th className="px-2 py-2 font-medium text-right">Perubahan</th>
                      <th className="px-2 py-2 font-medium text-right hidden sm:table-cell">
                        Saldo sebelum
                      </th>
                      <th className="px-2 py-2 font-medium text-right hidden sm:table-cell">
                        Saldo sesudah
                      </th>
                      <th className="px-4 py-2 font-medium">Tipe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ledger.map((item: BalanceHistoryLedgerItem) => (
                      <tr key={item.id} className="hover:bg-gray-50/60">
                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">
                          {new Date(item.created_at).toLocaleString("id-ID")}
                        </td>
                        <td className="px-2 py-2 text-right whitespace-nowrap">
                          {item.amount >= 0 ? (
                            <span className="text-green-600 font-semibold">
                              +{formatRupiah(item.amount)}
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              -{formatRupiah(Math.abs(item.amount))}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-right text-gray-500 hidden sm:table-cell">
                          {item.balance_before != null ? formatRupiah(item.balance_before) : "-"}
                        </td>
                        <td className="px-2 py-2 text-right text-gray-700 font-medium hidden sm:table-cell">
                          {item.balance_after != null ? formatRupiah(item.balance_after) : "-"}
                        </td>
                        <td className="px-4 py-2 text-gray-500">
                          <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                            {item.type ?? "UNKNOWN"}
                          </span>
                          {item.description && (
                            <p className="mt-1 text-[11px] text-gray-500 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
