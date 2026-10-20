import type { AxiosInstance } from 'axios';

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone?: string | null;
  role?: number | string;
  member_type?: number | string;
  status?: number | string;
  balance?: number;
  created_at: string;
  updated_at?: string;
};

export async function getProfile(api: AxiosInstance): Promise<UserProfile> {
  const res = await api.get<{ success: boolean; data: UserProfile }>('/auth/user');
  if (!res.data?.data) throw new Error('Invalid profile response');
  return res.data.data;
}

export async function changePassword(
  api: AxiosInstance,
  currentPassword: string,
  newPassword: string,
  newPasswordConfirmation: string
): Promise<void> {
  try {
    const res = await api.post<{ success: boolean; message?: string; errors?: Record<string, string[]> }>('/auth/change-password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPasswordConfirmation,
    });
    if (!res.data?.success) throw new Error(res.data?.message ?? 'Gagal mengubah password');
  } catch (err: unknown) {
    const ax = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
    const msg = ax.response?.data?.message ?? (err instanceof Error ? err.message : 'Gagal mengubah password');
    const firstError = ax.response?.data?.errors
      ? Object.values(ax.response.data.errors).flat()[0]
      : null;
    throw new Error(firstError ?? msg);
  }
}
