"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserApiKey, deleteUserApiKey, getUserApiKeys, updateUserApiKey, type UserApiKey } from "@/services/api-key.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faPlus, faSpinner, faTrash, faPen, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { SITE_NAME } from "@/lib/site-config";

export default function AccountApiPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newIp, setNewIp] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookSecret, setNewWebhookSecret] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editIp, setEditIp] = useState("");
  const [editWebhookUrl, setEditWebhookUrl] = useState("");
  const [editWebhookSecret, setEditWebhookSecret] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=/account/api");
    }
  }, [status, router]);

  const { data: apiKeys, isLoading } = useQuery<UserApiKey[]>({
    queryKey: ["account", "api-keys"],
    queryFn: () => getUserApiKeys(session?.accessToken ?? null),
    enabled: status === "authenticated",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Nama API key wajib diisi");
      return;
    }
    setCreating(true);
    try {
      const key = await createUserApiKey(session?.accessToken ?? null, {
        name: newName.trim(),
        ip_restriction: newIp.trim() || undefined,
        webhook_url: newWebhookUrl.trim() || undefined,
        webhook_secret: newWebhookSecret.trim() || undefined,
      });
      toast.success("API key berhasil dibuat");
      setNewName("");
      setNewIp("");
      setNewWebhookUrl("");
      setNewWebhookSecret("");
      queryClient.invalidateQueries({ queryKey: ["account", "api-keys"] });
      // Show the key once for easy copy
      toast((t) => (
        <div className="space-y-1 text-sm">
          <p className="font-semibold">API Key baru</p>
          <p className="break-all font-mono text-xs bg-gray-100 px-2 py-1 rounded">{key.key}</p>
        </div>
      ), { duration: 8000 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat API key";
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (key: UserApiKey) => {
    setEditingId(key.id);
    setEditName(key.name);
    setEditIp(key.ip_restriction ?? "");
    setEditWebhookUrl(key.webhook_url ?? "");
    setEditWebhookSecret("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditIp("");
    setEditWebhookUrl("");
    setEditWebhookSecret("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId == null) return;
    if (!editName.trim()) {
      toast.error("Nama API key wajib diisi");
      return;
    }
    setSaving(true);
    try {
      await updateUserApiKey(session?.accessToken ?? null, editingId, {
        name: editName.trim(),
        ip_restriction: editIp.trim() || undefined,
        webhook_url: editWebhookUrl.trim() || undefined,
        webhook_secret: editWebhookSecret !== "" ? editWebhookSecret : undefined,
      });
      toast.success("API key berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["account", "api-keys"] });
      cancelEdit();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui API key";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: UserApiKey) => {
    if (!confirm(`Hapus API key "${key.name}"?`)) return;
    try {
      await deleteUserApiKey(session?.accessToken ?? null, key.id);
      toast.success("API key dihapus");
      queryClient.invalidateQueries({ queryKey: ["account", "api-keys"] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus API key";
      toast.error(msg);
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
        <h1 className="text-2xl font-bold text-gray-800">API Access</h1>
        <p className="text-gray-600 mt-1">
          Kelola API key untuk mengintegrasikan {SITE_NAME} ke aplikasi atau server Anda.
        </p>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FontAwesomeIcon icon={faKey} className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">API Key</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Satu akun hanya boleh memiliki satu API key. Gunakan pada header{" "}
              <code className="px-1 bg-gray-100 rounded text-xs">X-Api-Key</code>.
            </p>
          </div>
        </div>
        {apiKeys && apiKeys.length > 0 ? (
          <div className="p-4 md:p-6">
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Anda sudah memiliki API key. Hapus API key yang ada terlebih dahulu jika ingin membuat baru.
            </p>
          </div>
        ) : (
        <form onSubmit={handleCreate} className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama API key
              </label>
              <input
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="Contoh: Server utama, Bot Discord"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP whitelist (opsional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="Contoh: 1.2.3.4"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL (opsional)
              </label>
              <input
                type="url"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="https://example.com/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Kami akan mengirim update status transaksi API ke alamat ini.
              </p>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook secret (opsional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="Digunakan untuk verifikasi signature"
                value={newWebhookSecret}
                onChange={(e) => setNewWebhookSecret(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Kami akan membuat signature HMAC-SHA256 dari payload menggunakan secret ini.
              </p>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-70"
            >
              {creating ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                  Membuat...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                  Buat API key
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </section>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">API Key Anda</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Simpan API key dengan aman. Hapus untuk bisa membuat API key baru.
          </p>
        </div>
        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : !apiKeys?.length ? (
            <p className="text-sm text-gray-500">Belum ada API key. Buat satu untuk mulai integrasi.</p>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="border border-gray-100 rounded-lg overflow-hidden hover:bg-gray-50/50"
                >
                  {editingId === key.id ? (
                    <form onSubmit={handleUpdate} className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            placeholder="Nama API key"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">IP whitelist</label>
                          <input
                            type="text"
                            value={editIp}
                            onChange={(e) => setEditIp(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            placeholder="1.2.3.4"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                          <input
                            type="url"
                            value={editWebhookUrl}
                            onChange={(e) => setEditWebhookUrl(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            placeholder="https://example.com/webhook"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook secret</label>
                          <input
                            type="text"
                            value={editWebhookSecret}
                            onChange={(e) => setEditWebhookSecret(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            placeholder="Kosongkan untuk tidak mengubah"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-70"
                        >
                          {saving ? <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" /> : <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5" />}
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                        >
                          <FontAwesomeIcon icon={faTimes} className="h-3.5 w-3.5" />
                          Batal
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-3 py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-800">{key.name}</p>
                        <p className="font-mono text-xs text-gray-700 break-all bg-gray-100 px-2 py-1 rounded">
                          {key.key}
                        </p>
                        {(key.ip_restriction || key.webhook_url) && (
                          <p className="text-[11px] text-gray-500">
                            {key.ip_restriction && <>IP: {key.ip_restriction}</>}
                            {key.ip_restriction && key.webhook_url && " · "}
                            {key.webhook_url && <>Webhook: {key.webhook_url}</>}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-500">
                          Dibuat {key.created_at ? new Date(key.created_at).toLocaleString("id-ID") : "-"}{" "}
                          {key.last_used_at && (
                            <>• Terakhir digunakan {new Date(key.last_used_at).toLocaleString("id-ID")}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-start md:self-auto">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            key.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {key.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                        <button
                          type="button"
                          onClick={() => startEdit(key)}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <FontAwesomeIcon icon={faPen} className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(key)}
                          className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

