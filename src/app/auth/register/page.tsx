"use client"
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faLock, faUser, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faGoogle as faGoogleBrand, faFacebook as faFacebookBrand } from "@fortawesome/free-brands-svg-icons";
import { CustomLink } from "@/components/utils/custom-link";
import toast from 'react-hot-toast';
import { SITE_NAME } from "@/lib/site-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const isReallyAuthenticated = status === 'authenticated' && !!session?.accessToken && !session?.error;

    useEffect(() => {
        if (isReallyAuthenticated) {
            router.replace('/');
        }
    }, [isReallyAuthenticated, router]);

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

        if (!formData.fullName) {
            newErrors.fullName = 'Nama lengkap wajib diisi';
        } else if (formData.fullName.length < 3) {
            newErrors.fullName = 'Nama minimal 3 karakter';
        }

        if (!formData.email) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!formData.phone) {
            newErrors.phone = 'Nomor telepon wajib diisi';
        } else if (!/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Format nomor telepon tidak valid';
        }

        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password harus mengandung huruf besar, huruf kecil, dan angka';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'Anda harus menyetujui syarat dan ketentuan';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !API_URL) return;
        setLoading(true);
        setErrors({});
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,
                }),
            });
            const json = await res.json();
            if (!res.ok) {
                const msg = json?.message ?? 'Registrasi gagal';
                const firstError = json?.errors ? Object.values(json.errors as Record<string, string[]>).flat()[0] : null;
                setErrors({ form: firstError ?? msg });
                toast.error(firstError ?? msg);
                setLoading(false);
                return;
            }
            const signInRes = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });
            if (signInRes?.error) {
                toast.success('Akun berhasil dibuat. Silakan masuk.');
                router.push('/auth/login');
            } else {
                toast.success('Berhasil mendaftar');
                router.push('/');
                router.refresh();
            }
        } catch {
            toast.error('Terjadi kesalahan');
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
                className="relative hidden lg:flex lg:w-[38%] flex-col justify-between overflow-hidden p-10 text-white"
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(34,211,238,0.3), transparent 50%), linear-gradient(200deg, #042F2E 0%, #0E7490 55%, #22D3EE 120%)",
                    }}
                />
                <div className="relative">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">Daftar</p>
                    <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
                        Buat akun<br />dalam hitungan menit
                    </h1>
                    <p className="mt-4 max-w-sm text-sm text-sky-100/85 leading-relaxed">
                        Bergabung dengan komunitas top-up {SITE_NAME} — cepat, aman, transparan.
                    </p>
                </div>
                <p className="relative text-xs text-sky-100/70">Sudah punya akun? Masuk dari panel kanan.</p>
            </motion.aside>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="relative flex flex-1 flex-col justify-center px-5 py-8 sm:px-10 md:px-12"
            >
                <div className="mx-auto w-full max-w-md">
                <div className="mb-6">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 font-display text-lg font-bold text-white lg:hidden">
                        {SITE_NAME.slice(0, 1).toUpperCase()}
                    </div>
                    <h2 className="font-display text-2xl font-bold text-slate-900">Buat akun baru</h2>
                    <p className="mt-1 text-slate-500">Bergabunglah dengan {SITE_NAME}</p>
                </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name Field */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                                />
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all duration-200 ${errors.fullName
                                        ? 'border-red-500 focus:ring-red-500/30'
                                        : 'border-gray-300 focus:border-primary focus:ring-primary/30'
                                        }`}
                                    placeholder="Masukkan nama lengkap Anda"
                                />
                            </div>
                            {errors.fullName && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-1"
                                >
                                    {errors.fullName}
                                </motion.p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                                />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all duration-200 ${errors.email
                                        ? 'border-red-500 focus:ring-red-500/30'
                                        : 'border-gray-300 focus:border-primary focus:ring-primary/30'
                                        }`}
                                    placeholder="Masukkan email Anda"
                                />
                            </div>
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-1"
                                >
                                    {errors.email}
                                </motion.p>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Nomor Telepon
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faPhone}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                                />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all duration-200 ${errors.phone
                                        ? 'border-red-500 focus:ring-red-500/30'
                                        : 'border-gray-300 focus:border-primary focus:ring-primary/30'
                                        }`}
                                    placeholder="Contoh: 08123456789"
                                />
                            </div>
                            {errors.phone && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-1"
                                >
                                    {errors.phone}
                                </motion.p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition-all duration-200 ${errors.password
                                        ? 'border-red-500 focus:ring-red-500/30'
                                        : 'border-gray-300 focus:border-primary focus:ring-primary/30'
                                        }`}
                                    placeholder="Minimal 8 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                                </button>
                            </div>
                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-1"
                                >
                                    {errors.password}
                                </motion.p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                                />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition-all duration-200 ${errors.confirmPassword
                                        ? 'border-red-500 focus:ring-red-500/30'
                                        : 'border-gray-300 focus:border-primary focus:ring-primary/30'
                                        }`}
                                    placeholder="Ulangi password Anda"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-1"
                                >
                                    {errors.confirmPassword}
                                </motion.p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div>
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Saya setuju dengan{' '}
                                    <CustomLink
                                        href="/terms"
                                        className="text-primary hover:underline"
                                    >
                                        Syarat & Ketentuan
                                    </CustomLink>
                                    {' '}dan{' '}
                                    <CustomLink
                                        href="/privacy"
                                        className="text-primary hover:underline"
                                    >
                                        Kebijakan Privasi
                                    </CustomLink>
                                </span>
                            </label>
                            {errors.agreeToTerms && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-1 ml-6"
                                >
                                    {errors.agreeToTerms}
                                </motion.p>
                            )}
                        </div>

                        {errors.form && (
                            <p className="text-red-500 text-sm text-center">{errors.form}</p>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-slate-900 py-3.5 font-semibold text-white shadow-lg transition hover:bg-primary disabled:opacity-70"
                        >
                            {loading ? 'Memproses...' : 'Daftar'}
                        </motion.button>
                    </form>

                    <div className="my-5 flex items-center gap-3">
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

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Sudah punya akun?{' '}
                        <CustomLink href="/auth/login" className="font-semibold text-primary hover:underline">
                            Masuk sekarang
                        </CustomLink>
                    </p>
                </div>
            </motion.div>
        </div>
    );
} 