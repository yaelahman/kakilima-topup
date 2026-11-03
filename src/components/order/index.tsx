"use client"
import { useFormik } from "formik";
import { ProductInfo } from "./ProductInfo";
import { DiamondSelector } from "./DiamondSelector";
import { BuyerInfoForm } from "./BuyerInfoForm";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { SummaryBar } from "./SummaryBar";
import { ReviewsRating } from "./ReviewsRating";
import { ProductFAQ } from "./ProductFAQ";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { checkPromoCode, createTransaction } from "@/services/order.service";
import { formatPromoDiscountLabel } from "@/lib/helper";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthClient } from "@/lib/use-auth-client";
import { useQuery } from "@tanstack/react-query";
import { VoucherQuantitySelector } from "./VoucherQuantitySelector";
import { getProfile } from "@/services/account.service";

function getInitialDenom(product: any, initialPriceId?: string) {
    if (!initialPriceId || !product?.product_type?.length) return {};
    const found = product.product_type.find((pt: any) => String(pt.id) === String(initialPriceId));
    return found || {};
}

export default function Order({
    product,
    payments,
    enableCheckerId,
    initialPromoCode,
    initialPriceId
}: {
    product: any,
    payments: any,
    enableCheckerId: boolean,
    initialPromoCode?: string,
    initialPriceId?: string
}) {
    const [showModal, setShowModal] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState<{
        code: string;
        discount: number;
        discount_type: number;
        message: string;
    } | null>(null);
    const [promoChecking, setPromoChecking] = useState(false);
    const hasRestoredRef = useRef(false);
    const paymentSectionRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const storageKey = `kakilima:order:${product?.slug || product?.id || 'default'}`;
    const initialDenom = getInitialDenom(product, initialPriceId);
    const { data: session, status } = useSession();
    const token = session?.accessToken ?? null;
    const api = useAuthClient();
    const isAuthenticated = status === "authenticated" && !!session?.user;
    const isVoucherProduct = Boolean(product?.is_voucher)
        || (Array.isArray(product?.product_type) && product.product_type.some((pt: any) => pt?.voucher_count != null));

    const { data: profile } = useQuery({
        queryKey: ["account", "profile"],
        queryFn: () => getProfile(api),
        enabled: isAuthenticated,
    });

    const formik = useFormik({
        initialValues: {
            productId: product.id,
            denom: initialDenom,
            userInfo: (product.product_form ?? []).reduce((acc: any, form: any) => {
                acc[form.name] = "";
                return acc;
            }, {}),
            paymentMethod: null as any,
            whatsApp: "",
            email: "",
            promoCode: initialPromoCode || "",
            quantity: 1

        },
        validationSchema: Yup.object({
            denom: Yup.object().test('is-not-empty', 'Nominal diperlukan', (value) => {
                return value && Object.keys(value).length > 0;
            }),
            userInfo: Yup.object().test('all-fields-filled', 'Semua field info pengguna harus diisi', (value) => {
                if (!value) return false;
                return Object.values(value).every((field: any) => field && field.toString().trim() !== '');
            }),
            paymentMethod: Yup.object().required('Metode pembayaran diperlukan').test('is-not-empty', 'Metode pembayaran diperlukan', (value) => {
                return value && Object.keys(value).length > 0;
            }),
            whatsApp: Yup.string().required("WhatsApp diperlukan"),
            email: Yup.string().email("Alamat email tidak valid").required("Email diperlukan"),
            quantity: Yup.number().min(1, "Jumlah minimal 1").required()
        }),
        onSubmit: async (values, helpers) => {
            const errors = await formik.validateForm();
            if (Object.keys(errors).length > 0) {
                if (errors.denom) {
                    toast.error(typeof errors.denom === 'string' ? errors.denom : 'Nominal diperlukan');
                } else if (errors.userInfo) {
                    toast.error(typeof errors.userInfo === 'string' ? errors.userInfo : 'Semua field info pengguna harus diisi');
                } else if (errors.paymentMethod) {
                    toast.error(typeof errors.paymentMethod === 'string' ? errors.paymentMethod : 'Metode pembayaran diperlukan');
                } else if (errors.whatsApp) {
                    toast.error(typeof errors.whatsApp === 'string' ? errors.whatsApp : 'WhatsApp diperlukan');
                } else if (errors.email) {
                    toast.error(typeof errors.email === 'string' ? errors.email : 'Email diperlukan');
                }
                return;
            }

            const userInformation = product.product_form.map((form: any) => ({
                name: form.name,
                value: values.userInfo?.[form.name] ?? ''
            }));

            const payload = {
                product_id: values.productId,
                price_id: values.denom?.id,
                price_type: values.denom?.code ?? null,
                user_information: JSON.stringify(userInformation),
                whatsapp: values.whatsApp,
                email: values.email,
                payment_method: values.paymentMethod?.id,
                code: values.promoCode || null,
                quantity: isVoucherProduct ? values.quantity : 1
            };

            const toastId = toast.loading('Memproses transaksi...');
            helpers.setSubmitting(true);
            try {
                const response = await createTransaction(payload, token);
                if (!response?.success) {
                    toast.dismiss(toastId);
                    toast.error(response?.message || 'Gagal membuat transaksi');
                    return;
                }
                toast.dismiss(toastId);
                toast.success(response?.message || 'Transaksi berhasil dibuat');
                setShowModal(false);
                if (response?.invoice) {
                    router.push(`/invoice/${response.invoice}`);
                    return;
                }
            } catch (error: any) {
                toast.dismiss(toastId);
                toast.error(error?.message || 'Gagal membuat transaksi');
            } finally {
                helpers.setSubmitting(false);
            }
        }
    });
    useEffect(() => {
        setAppliedPromo(null);
        const stock = Number(formik.values.denom?.voucher_count) || 1;
        if (formik.values.quantity > stock) {
            formik.setFieldValue('quantity', Math.max(1, stock), false);
        }
    }, [formik.values.denom?.id]);

    useEffect(() => {
        if (!appliedPromo) return;
        if ((formik.values.promoCode || '').trim().toLowerCase() !== appliedPromo.code.trim().toLowerCase()) {
            setAppliedPromo(null);
        }
    }, [formik.values.promoCode, appliedPromo]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed?.whatsApp) formik.setFieldValue('whatsApp', parsed.whatsApp, false);
                if (parsed?.email) formik.setFieldValue('email', parsed.email, false);
            } catch (error) {
                console.warn('Failed to parse saved order data', error);
            }
        }
        hasRestoredRef.current = true;
    }, [storageKey]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!hasRestoredRef.current) return;
        const payload = {
            whatsApp: formik.values.whatsApp,
            email: formik.values.email,
        };
        localStorage.setItem(storageKey, JSON.stringify(payload));
    }, [storageKey, formik.values.whatsApp, formik.values.email]);

    const handleBuy = async () => {
        // Validate the form
        const errors = await formik.validateForm();

        if (Object.keys(errors).length > 0) {
            // Show toast error messages
            if (errors.denom) {
                return toast.error(typeof errors.denom === 'string' ? errors.denom : 'Nominal diperlukan');
            }
            if (errors.userInfo) {
                return toast.error(typeof errors.userInfo === 'string' ? errors.userInfo : 'Semua field info pengguna harus diisi');
            }
            if (errors.paymentMethod) {
                return toast.error(typeof errors.paymentMethod === 'string' ? errors.paymentMethod : 'Metode pembayaran diperlukan');
            }
            if (errors.whatsApp) {
                return toast.error(typeof errors.whatsApp === 'string' ? errors.whatsApp : 'WhatsApp diperlukan');
            }
            if (errors.email) {
                return toast.error(typeof errors.email === 'string' ? errors.email : 'Email diperlukan');
            }
        }
        setShowModal(true);
    };

    const handlePaymentSelect = (payment: any) => {
        formik.setFieldValue('paymentMethod', payment);
    };

    const handleCheckPromo = async () => {
        const code = (formik.values.promoCode || '').trim();
        if (!code) {
            toast.error('Masukkan kode promo terlebih dahulu');
            return;
        }
        if (!formik.values.denom?.id) {
            toast.error('Pilih nominal terlebih dahulu');
            return;
        }
        const qty = isVoucherProduct ? Math.max(1, Number(formik.values.quantity) || 1) : 1;
        const basePrice = (Number(formik.values.denom?.price) || 0) * qty;
        const userData = product.product_form.map((f: any) => ({
            name: f.name,
            value: String(formik.values.userInfo?.[f.name] ?? ''),
        }));

        setPromoChecking(true);
        try {
            const res = await checkPromoCode(
                {
                    code,
                    id_product: product.id,
                    id_product_type: formik.values.denom.id,
                    price: basePrice,
                    userData,
                },
                token
            );

            if (res?.data != null && typeof res.data.discount === 'number') {
                setAppliedPromo({
                    code,
                    discount: res.data.discount,
                    discount_type: res.data.discount_type,
                    message: res.message || 'Promo berhasil diterapkan.',
                });
                toast.success(res.message || 'Promo berhasil diterapkan!');
            } else {
                setAppliedPromo(null);
                toast.error(res?.message || 'Promo tidak bisa digunakan.');
            }
        } catch {
            setAppliedPromo(null);
            toast.error('Gagal memeriksa promo. Coba lagi.');
        } finally {
            setPromoChecking(false);
        }
    };

    return (
        <>
            <ProductInfo variant="desktop" product={product} />
            <div className="space-y-6 mt-5 md:mt-16">
                <div className="mb-2 hidden md:block relative pl-4">
                    <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary to-sky-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Checkout</p>
                    <h2 className="font-display text-2xl font-bold text-slate-900">Lengkapi pesanan</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    <ProductInfo variant="mobile" product={product} />
                    <div className="col-span-1 md:col-span-2">

                        <div className="mb-4 block md:hidden">
                            <BuyerInfoForm
                                userInfo={formik.values.userInfo}
                                productSlug={product.slug}
                                enableCheckerId={enableCheckerId}
                                forms={product.product_form}
                                onChange={(userInfo: any) => formik.setFieldValue('userInfo', userInfo)}
                            />
                        </div>
                        <DiamondSelector
                            selectedPrice={formik.values.denom}
                            onChange={(diamond: any) => {
                                formik.setFieldValue('denom', diamond);
                                formik.setFieldValue('quantity', 1);
                                if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
                                    requestAnimationFrame(() => {
                                        paymentSectionRef.current?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        });
                                    });
                                }
                            }}
                            denoms={product.product_type}
                            icon={product.icon}
                        />
                        {isVoucherProduct ? (
                            <div className="mt-4">
                                <VoucherQuantitySelector
                                    value={formik.values.quantity}
                                    max={Number(formik.values.denom?.voucher_count) || 0}
                                    onChange={(qty) => formik.setFieldValue('quantity', qty)}
                                />
                            </div>
                        ) : null}
                        <div className="md:mt-4">
                            <SummaryBar
                                onBuy={handleBuy}
                                selectedPrice={formik.values.denom}
                                paymentMethod={formik.values.paymentMethod as any}
                                appliedPromo={appliedPromo}
                                quantity={isVoucherProduct ? formik.values.quantity : 1}
                                desktop
                            />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="sticky top-22">
                            <BuyerInfoForm
                                userInfo={formik.values.userInfo}
                                productSlug={product.slug}
                                enableCheckerId={enableCheckerId}
                                forms={product.product_form}
                                onChange={(userInfo: any) => formik.setFieldValue('userInfo', userInfo)}
                            />
                            <div
                                ref={paymentSectionRef}
                                id="order-payment"
                                className="scroll-mt-24 md:scroll-mt-28"
                            >
                            <PaymentMethodSelector
                                selectedPayment={formik.values.paymentMethod}
                                payments={payments}
                                denom={{
                                    ...formik.values.denom,
                                    price: (Number(formik.values.denom?.price) || 0) * (isVoucherProduct ? Math.max(1, Number(formik.values.quantity) || 1) : 1),
                                }}
                                isLoggedIn={isAuthenticated}
                                currentBalance={profile?.balance ?? null}
                                onSelectPayment={handlePaymentSelect}
                                onSelectBalance={() =>
                                    handlePaymentSelect({
                                        id: 0,
                                        name: "Bayar dengan Saldo",
                                        provider: "balance",
                                    })
                                }
                            />
                            </div>
                            <div className="my-4 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-950 px-4 py-4 text-white">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                                        <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300">Langkah 04</p>
                                        <span className="font-display text-lg font-semibold">Kontak & Promo</span>
                                    </div>
                                </div>
                                <div className="p-4 md:p-5 space-y-6">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="whatsApp"
                                                name="whatsApp"
                                                placeholder=" "
                                                value={formik.values.whatsApp}
                                                onChange={(e) => {
                                                    let value = e.target.value;
                                                    // Only allow numbers
                                                    value = value.replace(/\D/g, '');
                                                    formik.setFieldValue('whatsApp', value);
                                                }}
                                                onBlur={formik.handleBlur}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 peer"
                                            />
                                            <label
                                                htmlFor="whatsApp"
                                                className="absolute left-4 top-4 text-gray-500 transition-all duration-300 -translate-y-7 bg-white px-2 scale-75 transform origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:bg-white peer-focus:text-primary peer-placeholder-shown:top-2 peer-focus:top-4"
                                            >
                                                WhatsApp (+62)
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder=" "
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 peer"
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute left-4 top-4 text-gray-500 transition-all duration-300 -translate-y-7 bg-white px-2 scale-75 transform origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:bg-white peer-focus:text-primary peer-placeholder-shown:top-2 peer-focus:top-4"
                                            >
                                                Email
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <div className="flex gap-2">
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="text"
                                                        id="promoCode"
                                                        name="promoCode"
                                                        placeholder=" "
                                                        value={formik.values.promoCode || ''}
                                                        onChange={formik.handleChange}
                                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 peer"
                                                    />
                                                    <label
                                                        htmlFor="promoCode"
                                                        className="absolute left-4 top-4 text-gray-500 transition-all duration-300 -translate-y-7 bg-white px-2 scale-75 transform origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:bg-white peer-focus:text-primary peer-placeholder-shown:top-2 peer-focus:top-4"
                                                    >
                                                        Kode Promo (Opsional)
                                                    </label>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => void handleCheckPromo()}
                                                    disabled={promoChecking}
                                                    className="px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 whitespace-nowrap font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {promoChecking ? 'Memeriksa…' : 'Cek Promo'}
                                                </button>
                                            </div>
                                            {appliedPromo ? (
                                                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-2.5 text-sm text-emerald-900">
                                                    <p className="font-medium leading-snug">{appliedPromo.message}</p>
                                                    <p className="text-xs mt-1 text-emerald-800/90">
                                                        Potongan: <strong>{formatPromoDiscountLabel(appliedPromo)}</strong>
                                                        {' · '}kode <span className="font-mono">{appliedPromo.code}</span>
                                                    </p>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SummaryBar
                            onBuy={handleBuy}
                            selectedPrice={formik.values.denom}
                            paymentMethod={formik.values.paymentMethod}
                            appliedPromo={appliedPromo}
                            quantity={isVoucherProduct ? formik.values.quantity : 1}
                            mobile
                        />
                    </div>
                </div>
                <ReviewsRating productName={product?.name} />
                <ProductFAQ />
            </div>
            <PaymentConfirmationModal
                show={showModal}
                onClose={() => setShowModal(false)}
                selectedPrice={formik.values.denom}
                userInfo={formik.values.userInfo}
                paymentMethod={formik.values.paymentMethod}
                whatsApp={formik.values.whatsApp}
                email={formik.values.email}
                productName={product.name}
                promoCode={formik.values.promoCode}
                appliedPromo={appliedPromo}
                quantity={isVoucherProduct ? formik.values.quantity : 1}
                onSubmit={() => formik.submitForm()}
            />
        </>
    )
}