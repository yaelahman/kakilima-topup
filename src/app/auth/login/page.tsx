"use client"
import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle as faGoogleBrand, faFacebook as faFacebookBrand } from "@fortawesome/free-brands-svg-icons";
import { CustomLink } from "@/components/utils/custom-link";
import toast from 'react-hot-toast';
import { SITE_NAME } from "@/lib/site-config";

function LoginContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') ?? '/';
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isReallyAuthenticated = status === 'authenticated' && !!session?.accessToken && !session?.error;

    useEffect(() => {
        if (isReallyAuthenticated) {
            router.replace(callbackUrl);
        }
    }, [isReallyAuthenticated, router, callbackUrl]);

    if (status === 'loading' || isReallyAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-primary font-medium">Memuat...</div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setErrors({});
        try {
            const res = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });
            if (res?.error) {
                setErrors({ form: res.error });
                toast.error(res.error);
                setLoading(false);
                return;
            }
            toast.success('Berhasil masuk');
            router.push(callbackUrl);
            router.refresh();
        } catch {
            toast.error('Gagal masuk');
            setErrors({ form: 'Terjadi kesalahan. Coba lagi.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] -mx-4 md:-mx-6 -my-2 flex flex-col lg:flex-row overflow-hidden rounded-[1.75rem] ring-1 ring-primary/10 bg-white shadow-brand-lg">
            <motion.aside
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="relative hidden lg:flex lg:w-[42%] flex-col justify-between overflow-hidden p-10 text-white"
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 60% at 20% 20%, rgba(34,211,238,0.35), transparent 55%), linear-gradient(160deg, #042F2E 0%, #0E7490 48%, #0891B2 100%)",
                    }}
                />
                <div className="relative">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">Masuk</p>
                    <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
                        Top-up lebih cepat<br />dengan akun {SITE_NAME}
                    </h1>
                    <p className="mt-4 max-w-sm text-sm text-sky-100/85 leading-relaxed">
                        Riwayat transaksi, saldo, dan promo tersimpan aman di satu tempat.
                    </p>
                </div>
                <div className="relative space-y-3 text-sm text-sky-100/90">
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">Proses otomatis dalam hitungan detik</div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">Pembayaran aman & terverifikasi</div>
                </div>
            </motion.aside>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="relative flex flex-1 flex-col justify-center px-5 py-10 sm:px-10 md:px-14"
            >
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 lg:mb-10">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 font-display text-lg font-bold text-white lg:hidden">
                            {SITE_NAME.slice(0, 1).toUpperCase()}
                        </div>
                        <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">Selamat datang kembali</h2>
                        <p className="mt-1.5 text-slate-500">Masuk ke akun {SITE_NAME} Anda</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-2xl border bg-slate-50 py-3 pl-11 pr-4 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'}`}
                                    placeholder="nama@email.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faLock} className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-2xl border bg-slate-50 py-3 pl-11 pr-12 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'}`}
                                    placeholder="Minimal 6 karakter"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                                Ingat saya
                            </label>
                            <CustomLink href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Lupa password?</CustomLink>
                        </div>

                        {errors.form && <p className="text-center text-sm text-red-500">{errors.form}</p>}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-slate-900 py-3.5 font-semibold text-white shadow-lg transition hover:bg-primary disabled:opacity-70"
                        >
                            {loading ? 'Memproses...' : 'Masuk'}
                        </motion.button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs uppercase tracking-wider text-slate-400">atau</span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <button type="button" className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <FontAwesomeIcon icon={faGoogleBrand} className="h-4 w-4 text-red-500" /> Google
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <FontAwesomeIcon icon={faFacebookBrand} className="h-4 w-4 text-blue-600" /> Facebook
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Belum punya akun?{' '}
                        <CustomLink href="/auth/register" className="font-semibold text-primary hover:underline">Daftar sekarang</CustomLink>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-primary font-medium">Memuat...</div>
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}