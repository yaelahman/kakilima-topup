import { httpClient } from "@/lib/client";

export type BalanceHistoryItem = {
  id: number;
  invoice: string;
  amount: number;
  fee?: number | null;
  status: number;
  created_at: string;
  payment_method: number;
};

export type BalancePageData = {
  balance: number;
  history: BalanceHistoryItem[];
  payment_methods: Record<
    string,
    {
      id: number;
      name: string;
      group: string;
      image?: string;
      provider?: string;
      code?: string;
      extra_price?: number | null;
      fee?: number | null;
      fee_type?: string | null;
    }[]
  >;
  groups: string[];
};

export type BalanceHistoryLedgerItem = {
  id: number;
  invoice?: string | null;
  amount: number;
  type?: string | null;
  reference_type?: string | null;
  reference_id?: number | null;
  balance_before?: number | null;
  balance_after?: number | null;
  description?: string | null;
  created_at: string;
};

export type RechargeResult = {
  id: number;
  invoice: string;
  amount: number;
  status: number;
  rekening: string | null;
  qr_url: string | null;
  payment_method: { id: number; name: string } | null;
};

export async function getBalancePage(token?: string | null): Promise<BalancePageData> {
  const res = await httpClient({
    route: "/balance",
    token,
  });
  if (!res?.success || !res?.data) {
    throw new Error(res?.message ?? "Failed to load balance");
  }
  return res.data as BalancePageData;
}

export async function createRecharge(
  payload: { amount: number; payment_method_id: number; whatsapp?: string },
  token?: string | null
): Promise<{ message: string; data: RechargeResult }> {
  const res = await httpClient({
    route: "/balance",
    method: "POST",
    body: payload,
    token,
  });
  if (!res?.success) {
    throw new Error(res?.message ?? "Gagal membuat pesanan top-up");
  }
  return { message: res.message, data: res.data as RechargeResult };
}

export async function getBalanceTrx(
  id: number,
  token?: string | null
): Promise<RechargeResult & { rekening?: string; qr_url?: string }> {
  const res = await httpClient({
    route: `/balance/${id}`,
    token,
  });
  if (!res?.success || !res?.data) {
    throw new Error(res?.message ?? "Transaksi tidak ditemukan");
  }
  return res.data as RechargeResult & { rekening?: string; qr_url?: string };
}

export async function getBalanceHistoryLedger(
  token?: string | null
): Promise<BalanceHistoryLedgerItem[]> {
  const res = await httpClient({
    route: "/balance-history",
    token,
  });
  if (!res?.success || !res?.data) {
    throw new Error(res?.message ?? "Gagal memuat riwayat saldo");
  }
  return res.data as BalanceHistoryLedgerItem[];
}
