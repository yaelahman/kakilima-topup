import { httpClient } from "@/lib/client";

export type UserApiKey = {
  id: number;
  name: string;
  key: string;
  is_active: boolean;
  created_at?: string | null;
  last_used_at?: string | null;
  ip_restriction?: string | null;
  webhook_url?: string | null;
};

export async function getUserApiKeys(token?: string | null): Promise<UserApiKey[]> {
  const res = await httpClient({
    route: "/api-keys",
    token,
  });
  if (!res?.success || !res?.data) throw new Error(res?.message ?? "Gagal memuat API key");
  return res.data as UserApiKey[];
}

export async function createUserApiKey(
  token: string | null,
  params: { name: string; ip_restriction?: string; webhook_url?: string; webhook_secret?: string }
): Promise<UserApiKey> {
  const res = await httpClient({
    route: "/api-keys",
    method: "POST",
    body: params,
    token,
  });
  if (!res?.success || !res?.data) throw new Error(res?.message ?? "Gagal membuat API key");
  return res.data as UserApiKey;
}

export type UpdateUserApiKeyParams = {
  name?: string;
  ip_restriction?: string;
  webhook_url?: string;
  webhook_secret?: string;
};

export async function updateUserApiKey(
  token: string | null,
  id: number,
  params: UpdateUserApiKeyParams
): Promise<UserApiKey> {
  const res = await httpClient({
    route: `/api-keys/${id}`,
    method: "PUT",
    body: params,
    token,
  });
  if (!res?.success || !res?.data) throw new Error(res?.message ?? "Gagal memperbarui API key");
  return res.data as UserApiKey;
}

export async function deleteUserApiKey(token: string | null, id: number): Promise<void> {
  const res = await httpClient({
    route: `/api-keys/${id}`,
    method: "DELETE",
    token,
  });
  if (!res?.success) throw new Error(res?.message ?? "Gagal menghapus API key");
}

