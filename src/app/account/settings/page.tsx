"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCheckCircle,
  faTimesCircle,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthClient } from "@/lib/use-auth-client";
import { getProfile, changePassword, type UserProfile } from "@/services/account.service";
import toast from "react-hot-toast";
import { roleLabel } from "@/lib/role";

export default function AccountSettingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const api = useAuthClient();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=/account/settings");
    }
  }, [status, router]);

  const profileQuery = useQuery({
    queryKey: ["account", "profile"],
    queryFn: () => getProfile(api),
    enabled: status === "authenticated",
  });

  const profile = profileQuery.data as UserProfile | undefined;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validatePasswordForm = () => {
    const err: Record<string, string> = {};
    if (!passwordForm.current_password) err.current_password = "Password saat ini wajib diisi";
    if (!passwordForm.password) err.password = "Password baru wajib diisi";
    else if (passwordForm.password.length < 8) err.password = "Password minimal 8 karakter";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.password))
      err.password = "Password harus mengandung huruf besar, huruf kecil, dan angka";
    if (passwordForm.password !== passwordForm.password_confirmation)
      err.password_confirmation = "Konfirmasi password tidak cocok";
    setPasswordErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    setPasswordLoading(true);
    setPasswordErrors({});
    try {
      await changePassword(
        api,
        passwordForm.current_password,
        passwordForm.password,
        passwordForm.password_confirmation
      );
      toast.success("Password berhasil diubah");
      setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengubah password";
      toast.error(message);
      setPasswordErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setPasswordLoading(false);
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
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Akun</h1>
        <p className="text-gray-600 mt-1">Kelola detail akun dan keamanan</p>
      </div>

      {/* Profile / Detail */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Detail Akun</h2>
          <p className="text-sm text-gray-500 mt-0.5">Informasi akun Anda</p>
        </div>
        <div className="p-6 space-y-4">
          {profileQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : profile ? (
            <>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium text-gray-900">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 truncate">{profile.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {profile.email_verified_at ? (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Terverifikasi</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTimesCircle} className="h-5 w-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">Belum terverifikasi</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faPhone} className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nomor WhatsApp</p>
                  <p className="font-medium text-gray-900">
                    {profile.phone ?? "-"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Nomor ini digunakan untuk notifikasi dan instruksi pembayaran.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUserTag} className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-900">{roleLabel(profile.role)}</p>
                </div>
              </div>
              {profile.created_at && (
                <p className="text-sm text-gray-500">
                  Bergabung sejak{" "}
                  {new Date(profile.created_at).toLocaleDateString("id-ID", {
                    dateStyle: "long",
                  })}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500 py-4">Tidak dapat memuat profil.</p>
          )}
        </div>
      </section>

      {/* Change password */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Ubah Password</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gunakan password kuat (min. 8 karakter, huruf besar, huruf kecil, angka)</p>
        </div>
        <form onSubmit={onSubmitPassword} className="p-6 space-y-4 max-w-md">
          {passwordErrors.form && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{passwordErrors.form}</p>
          )}
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
              Password saat ini
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
              />
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="current_password"
                name="current_password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${passwordErrors.current_password ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Masukkan password saat ini"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} className="h-4 w-4" />
              </button>
            </div>
            {passwordErrors.current_password && (
              <p className="text-sm text-red-500 mt-1">{passwordErrors.current_password}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password baru
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
              />
              <input
                type={showNewPassword ? "text" : "password"}
                id="password"
                name="password"
                value={passwordForm.password}
                onChange={handlePasswordChange}
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${passwordErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Password baru (min. 8 karakter)"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="h-4 w-4" />
              </button>
            </div>
            {passwordErrors.password && (
              <p className="text-sm text-red-500 mt-1">{passwordErrors.password}</p>
            )}
          </div>
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi password baru
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password_confirmation"
                name="password_confirmation"
                value={passwordForm.password_confirmation}
                onChange={handlePasswordChange}
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${passwordErrors.password_confirmation ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Ulangi password baru"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-4 w-4" />
              </button>
            </div>
            {passwordErrors.password_confirmation && (
              <p className="text-sm text-red-500 mt-1">{passwordErrors.password_confirmation}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {passwordLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin mr-2" />
                Memproses...
              </>
            ) : (
              "Simpan password"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
