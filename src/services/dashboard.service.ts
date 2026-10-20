import type { AxiosInstance } from 'axios';

export type DashboardSummary = {
  balance: number;
  today: { count: number; amount: number };
  monthly: { count: number; amount: number };
};

export type DashboardTransaction = {
  id: number;
  invoice: string;
  product: string;
  amount: number;
  status: string;
  status_key: number;
  status_color: string;
  created_at: string | null;
};

export type DashboardTransactionsResponse = {
  transactions: DashboardTransaction[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export async function getDashboardSummary(api: AxiosInstance): Promise<DashboardSummary> {
  const res = await api.get<{ success: boolean; data: DashboardSummary }>('/dashboard/summary');
  if (!res.data?.data) throw new Error('Invalid summary response');
  return res.data.data;
}

export type DashboardTransactionsParams = {
  page?: number;
  per_page?: number;
  status?: string | number | null;
  search?: string | null;
};

export async function getDashboardTransactions(
  api: AxiosInstance,
  page = 1,
  perPage = 15,
  params?: DashboardTransactionsParams
): Promise<DashboardTransactionsResponse> {
  const { status = null, search = null } = params ?? {};
  const requestParams: Record<string, string | number | undefined> = {
    page,
    per_page: perPage,
  };
  if (status !== null && status !== undefined && status !== '' && String(status) !== 'all') {
    requestParams.status = String(status);
  }
  if (search !== null && search !== undefined && String(search).trim()) {
    requestParams.search = String(search).trim();
  }
  const res = await api.get<{ success: boolean; data: DashboardTransactionsResponse }>('/dashboard/transactions', {
    params: requestParams,
  });
  if (!res.data?.data) throw new Error('Invalid transactions response');
  return res.data.data;
}
