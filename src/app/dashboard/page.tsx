"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faCalendarDay,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthClient } from "@/lib/use-auth-client";
import {
  getDashboardSummary,
  getDashboardTransactions,
  type DashboardSummary,
  type DashboardTransaction,
} from "@/services/dashboard.service";
import { roleLabel } from "@/lib/role";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  const colorClasses: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    info: "bg-blue-100 text-blue-800",
    danger: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800",
  };
  const cls = colorClasses[color] ?? colorClasses.secondary;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Semua status" },
  { value: "0", label: "Menunggu Pembayaran" },
  { value: "1", label: "Lunas" },
  { value: "2", label: "Sedang Diproses" },
  { value: "21", label: "Pending" },
  { value: "3", label: "Berhasil" },
  { value: "100", label: "Gagal" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const api = useAuthClient();
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  const summaryQuery = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => getDashboardSummary(api),
    enabled: status === "authenticated",
  });

  const transactionsQuery = useQuery({
    queryKey: ["dashboard", "transactions", page, perPage, statusFilter, searchQuery],
    queryFn: () =>
      getDashboardTransactions(api, page, perPage, {
        status: statusFilter === "all" ? null : statusFilter,
        search: searchQuery || null,
      }),
    enabled: status === "authenticated",
  });

  const applySearch = () => {
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const summary = summaryQuery.data as DashboardSummary | undefined;
  const transactionsData = transactionsQuery.data;
  const transactions = transactionsData?.transactions ?? [];
  const pagination = transactionsData?.pagination;

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
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Selamat datang, {session?.user?.name ?? session?.user?.email}
          {session?.user?.role ? ` (${roleLabel(session.user.role)})` : ""}.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Saldo saat ini"
          value={summary ? "Rp " + formatRupiah(summary.balance) : "—"}
          icon={faWallet}
          loading={summaryQuery.isLoading}
          className="bg-primary/10 border-primary/20"
          iconColor="text-primary"
        />
        <SummaryCard
          title="Transaksi hari ini"
          subtitle={summary ? `${summary.today.count} transaksi` : undefined}
          value={summary ? "Rp " + formatRupiah(summary.today.amount) : "—"}
          icon={faCalendarDay}
          loading={summaryQuery.isLoading}
          className="bg-blue-50 border-blue-200"
          iconColor="text-blue-600"
        />
        <SummaryCard
          title="Transaksi bulan ini"
          subtitle={summary ? `${summary.monthly.count} transaksi` : undefined}
          value={summary ? "Rp " + formatRupiah(summary.monthly.amount) : "—"}
          icon={faCalendarAlt}
          loading={summaryQuery.isLoading}
          className="bg-amber-50 border-amber-200"
          iconColor="text-amber-600"
        />
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Riwayat Transaksi</h2>
          <p className="text-sm text-gray-500 mt-0.5">Daftar transaksi Anda</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 max-w-sm gap-2">
              <div className="relative flex-1">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                />
                <input
                  type="search"
                  placeholder="Cari invoice atau produk..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applySearch())}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              <button
                type="button"
                onClick={applySearch}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 whitespace-nowrap"
              >
                Cari
              </button>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-white"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {transactionsQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Belum ada transaksi.</div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Produk</th>
                    <th className="px-4 py-3 font-medium">Jumlah</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((row: DashboardTransaction) => (
                    <tr key={row.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-sm">{row.invoice}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px] truncate" title={row.product}>
                        {row.product}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">Rp {formatRupiah(row.amount)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} color={row.status_color} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(row.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Menampilkan {(pagination.current_page - 1) * pagination.per_page + 1}–{Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.current_page <= 1}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-600">
                      {pagination.current_page} / {pagination.last_page}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                      disabled={pagination.current_page >= pagination.last_page}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  loading,
  className,
  iconColor,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: typeof faWallet;
  loading?: boolean;
  className?: string;
  iconColor?: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${className ?? ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
          )}
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg ${iconColor ?? "text-primary"}`}>
          <FontAwesomeIcon icon={icon} className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
