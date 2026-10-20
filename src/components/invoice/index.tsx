"use client"
import { useState, useEffect, useMemo } from 'react';
import { faShoppingCart, faCreditCard, faClock, faCheckCircle, faInfoCircle, faArrowRight, faCartShopping, faTicket, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatRupiah, calcPaymentFeeFromTotal } from '@/lib/helper';
import { DEFAULT_ORDER_DESCRIPTION, STATUS_ANIMATE_BY_CODE, TransactionStatusMeta, getStepFromStatus } from '@/models/transaction';
import { HeaderInfo } from './HeaderInfo';

// interface InvoiceProps {
//     // Add props as needed
// }

interface InvoiceProps {
    transaction: any;
    statusMeta?: TransactionStatusMeta | null;
}

const PAYMENT_DEADLINE_HOURS = 1;

function getRemainingFromDeadline(createdAt: string | undefined): { hours: number; minutes: number; seconds: number } {
    if (!createdAt) return { hours: PAYMENT_DEADLINE_HOURS, minutes: 0, seconds: 0 };
    const created = new Date(createdAt).getTime();
    const deadline = created + PAYMENT_DEADLINE_HOURS * 60 * 60 * 1000;
    const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    return { hours, minutes, seconds };
}

export const Invoice = ({ transaction, statusMeta }: InvoiceProps) => {
    const [currentStep, setCurrentStep] = useState(getStepFromStatus(transaction?.status));
    const [tick, setTick] = useState(0);
    const product = transaction?.Product ?? transaction?.product;
    const productType = transaction?.ProductType ?? transaction?.product_type;
    const payment = transaction?.PaymentMethod ?? transaction?.payment_method;
    const productVoucher = transaction?.ProductVoucher ?? transaction?.product_voucher;
    const productVouchersRaw = transaction?.ProductVouchers ?? transaction?.product_vouchers;
    const productVouchers = Array.isArray(productVouchersRaw) && productVouchersRaw.length
        ? productVouchersRaw
        : (productVoucher ? [productVoucher] : []);
    const productName = typeof product === 'string' ? product : product?.name;
    const quantity = Math.max(1, Number(transaction?.quantity) || productVouchers.length || 1);

    const timeLeft = useMemo(
        () => getRemainingFromDeadline(transaction?.created_at),
        [transaction?.created_at, tick]
    );

    const userInfoList = useMemo(() => {
        if (!transaction?.user_information) return [];
        try {
            const parsed = typeof transaction.user_information === 'string'
                ? JSON.parse(transaction.user_information)
                : transaction.user_information;
            if (Array.isArray(parsed)) return parsed;
            return [];
        } catch {
            return [];
        }
    }, [transaction?.user_information]);

    useEffect(() => {
        setCurrentStep(getStepFromStatus(transaction?.status));
    }, [transaction?.status]);

    // Interval 1 detik: tick berubah tiap detik → timeLeft dihitung ulang → UI update
    useEffect(() => {
        if (transaction?.status !== 0) return;
        const intervalId = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(intervalId);
    }, [transaction?.status]);

    const steps = [
        {
            title: 'Pesanan Dibuat',
            icon: faShoppingCart,
            completed: currentStep >= 1
        },
        {
            title: 'Menunggu Pembayaran',
            icon: faCreditCard,
            completed: currentStep >= 2
        },
        {
            title: 'Sedang Diproses',
            icon: faClock,
            completed: currentStep >= 3
        },
        {
            title: 'Selesai',
            icon: faCheckCircle,
            completed: currentStep >= 4
        }
    ];

    const isSaldoPayment =
        transaction?.payment_method === 0 || transaction?.payment_method === null;

    return (
        <div className="py-4 md:py-6">
            <HeaderInfo status={transaction?.status} statusText={statusMeta?.text} />
            {transaction?.status != 100 && (
                <>
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm md:p-8 md:px-16">
                        <div className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary to-sky-400" />
                        <div className="relative">
                            {/* Progress bar */}
                            <div className="hidden md:block h-1.5 bg-slate-100 rounded-full overflow-hidden">

                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${(currentStep / (steps.length + STATUS_ANIMATE_BY_CODE[transaction?.status])) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            {/* Steps */}
                            <div className="flex flex-col md:flex-row md:justify-between md:mt-[-16px] space-y-4 md:space-y-0">
                                {steps.map((step, index) => (
                                    <div key={index} className="relative flex items-center md:block">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.12, type: "spring" }}
                                            className={`w-8 h-8 rounded-2xl flex items-center justify-center ${step.completed
                                                ? 'bg-slate-900 text-white shadow-brand'
                                                : 'bg-slate-100 text-slate-400'
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={step.icon} className={`h-3.5 w-3.5 ${index === currentStep ? 'animate-pulse' : ''}`} />
                                        </motion.div>
                                        <div className="ml-3 md:ml-0 md:absolute md:-bottom-7 md:left-1/2 md:transform md:-translate-x-1/2 md:w-max">
                                            <motion.span
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.12 + 0.15 }}
                                                className={`text-xs ${step.completed
                                                    ? 'text-primary font-semibold'
                                                    : 'text-slate-500'
                                                    }`}
                                            >
                                                {step.title}
                                            </motion.span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="grid md:grid-cols-2 gap-5 mt-6 md:mt-10">
                {/* Right Grid - Order Details (Shown first on mobile) */}
                <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm md:order-2 order-1">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10" />
                    <div className="relative flex justify-between md:flex-row flex-col items-start md:items-center gap-2 mb-6">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCartShopping} className="h-5 w-5 text-primary" />
                            <h2 className="font-display text-xl font-bold text-slate-900">Detail Pemesanan</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 ring-1 ring-sky-200">
                                {statusMeta?.text || 'Menunggu Pembayaran'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 pb-4 border-b">
                            <div className="w-16 h-16 relative">
                                <Image
                                    src={product?.image || "/images/mlbb.webp"}
                                    alt={product?.name || "Product"}

                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium">{product?.name || '-'}</h3>
                                <p className="text-gray-500 text-sm">{productType?.name || '-'}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between md:flex-row flex-col">
                                <span className="text-gray-600">Invoice</span>
                                <span className="font-medium">
                                    <span className="text-sm text-gray-500 border border-gray-300 rounded-md px-2 py-1">
                                        #{transaction?.invoice || '-'}
                                    </span>
                                </span>
                            </div>
                            <div className="flex justify-between md:flex-row flex-col">
                                <span className="text-gray-600">User ID</span>
                                <span className="font-medium">
                                    {userInfoList.map((row: any) => row?.value).filter(Boolean).join(' ') || '-'}
                                </span>
                            </div>
                            <div className="flex justify-between md:flex-row flex-col">
                                <span className="text-gray-600">Item</span>
                                <span className="font-medium">
                                    {(typeof transaction?.product_type === 'string' ? transaction.product_type : productType?.name) ?? '-'}
                                    {quantity > 1 ? ` × ${quantity}` : ''}
                                </span>
                            </div>
                            <div className="flex justify-between md:flex-row flex-col">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium">{payment?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between md:flex-row flex-col">
                                <span className="text-gray-600">Tanggal Dibuat</span>
                                <span className="font-medium">
                                    {transaction?.created_at ? new Date(transaction.created_at).toLocaleString('id-ID') : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between md:flex-row flex-col">
                                <span className="text-gray-600">Deskripsi</span>
                                <span className="font-medium">
                                    {productName || DEFAULT_ORDER_DESCRIPTION}
                                </span>
                            </div>
                            {productVouchers.length > 0 && (
                                <div className="pt-4 mt-2 border-t space-y-4">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faTicket} className="h-4 w-4 text-primary" />
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            Detail Voucher{productVouchers.length > 1 ? ` (${productVouchers.length})` : ''}
                                        </h4>
                                    </div>
                                    {productVouchers.map((item: any, idx: number) => (
                                    <div key={item?.id ?? idx} className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4">
                                        {productVouchers.length > 1 ? (
                                            <p className="text-xs font-semibold text-primary">Voucher {idx + 1}</p>
                                        ) : null}
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Data / Kode / Link</p>
                                            <p className="text-gray-800 break-all whitespace-pre-wrap font-medium">{item?.data || '-'}</p>
                                            {item?.data && item.data.startsWith('http') ? (
                                                <a
                                                    href={item.data}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary text-sm mt-1 inline-block hover:underline"
                                                >
                                                    Buka link
                                                </a>
                                            ) : null}
                                        </div>
                                        {item?.description ? (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Deskripsi</p>
                                                <p className="text-gray-800 whitespace-pre-wrap text-sm">{item.description}</p>
                                            </div>
                                        ) : null}
                                        {item?.purchased_at ? (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tanggal Diterima</p>
                                                <p className="text-gray-800 text-sm">
                                                    {new Date(item.purchased_at).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        ) : null}
                                        {item?.expired_at ? (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Kadaluarsa</p>
                                                <p className="text-gray-800 text-sm">
                                                    {new Date(item.expired_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 mt-4">
                            {(() => {
                                const totalAmount = transaction?.amount ?? 0;
                                const paymentFee = calcPaymentFeeFromTotal(totalAmount, payment);
                                const subtotal = totalAmount - paymentFee;
                                return (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Subtotal</span>
                                            <span className="font-medium">{formatRupiah(subtotal)}</span>
                                        </div>
                                        {paymentFee > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Biaya Pembayaran</span>
                                                <span className="font-medium">{formatRupiah(paymentFee)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="font-medium">Total Pembayaran</span>
                                            <span className="text-xl font-bold text-primary">{formatRupiah(totalAmount)}</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Left Grid - Payment Steps (Shown second on mobile) */}
                <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm md:order-1 order-2">
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-sky-400 to-primary" />
                    <div className="relative flex items-center gap-2 mb-6">
                        <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-primary" />
                        <h2 className="font-display text-xl font-bold text-slate-900">Langkah Pembayaran</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="border-b pb-4">
                            {isSaldoPayment ? (
                                <>
                                    <p className="font-medium mb-1">Total saldo terpotong</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatRupiah(transaction?.amount || 0)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Pembayaran menggunakan saldo akun Anda. Tidak ada langkah pembayaran tambahan yang perlu
                                        dilakukan.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="font-medium">Nominal yang harus dibayar</p>
                                        {transaction?.status === 0 && (
                                            <div className="text-red-500 font-medium">
                                                Batas waktu: {String(timeLeft.hours).padStart(2, '0')}:
                                                {String(timeLeft.minutes).padStart(2, '0')}:
                                                {String(timeLeft.seconds).padStart(2, '0')}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatRupiah(transaction?.amount || 0)}
                                    </p>
                                </>
                            )}
                        </div>

                        {!isSaldoPayment && (
                            <>
                                <div className="border-b pb-4">
                                    <p className="font-medium mb-2">Metode Pembayaran</p>
                                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded">
                                        <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={
                                                    typeof payment?.image === 'string' &&
                                                    (payment.image.startsWith('http://') ||
                                                        payment.image.startsWith('https://'))
                                                        ? payment.image
                                                        : payment?.image
                                                        ? payment.image
                                                        : "/images/bca.png"
                                                }
                                                alt={payment?.name || "Payment"}
                                                width={40}
                                                height={40}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{payment?.name || '-'}</p>
                                            <p className="text-gray-500 text-sm">
                                                {transaction?.rekening || transaction?.provider_reference || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {(() => {
                                    const qrUrl = transaction?.qr_url;
                                    const qrStr = transaction?.qr_string;
                                    const qrImageSrc =
                                        qrUrl ||
                                        (typeof qrStr === 'string' &&
                                            (qrStr.startsWith('data:') || qrStr.startsWith('http'))
                                            ? qrStr
                                            : null);
                                    return qrImageSrc ? (
                                        <div className="border-b pb-4">
                                            <p className="font-medium mb-3">Scan QRIS</p>
                                            <div className="flex justify-center bg-white p-4 rounded-lg border border-gray-200">
                                                <Image
                                                    src={qrImageSrc}
                                                    alt="QRIS Pembayaran"
                                                    width={192}
                                                    height={192}
                                                    className="w-48 h-48 object-contain"
                                                />
                                            </div>
                                            <p className="text-center text-gray-500 text-sm mt-2">
                                                Scan kode QR di atas dengan aplikasi e-wallet atau mobile banking Anda
                                            </p>
                                        </div>
                                    ) : null;
                                })()}

                                {(() => {
                                    const instructions = Array.isArray(payment?.instructions)
                                        ? payment.instructions
                                        : [];
                                        
                                    const payCode =
                                        transaction?.rekening || transaction?.provider_reference || '';

                                    const renderStep = (step: string, index: number) => {
                                        const resolved = step.replace(/{{\s*pay_code\s*}}/gi, payCode);
                                        return (
                                            <li
                                                key={index}
                                                className="text-sm text-gray-700"
                                                dangerouslySetInnerHTML={{ __html: resolved }}
                                            />
                                        );
                                    };

                                    if (instructions.length === 0) {
                                        return (
                                            <div className="space-y-4">
                                                <p className="font-medium">Langkah Pembayaran QRIS:</p>
                                                <ol className="list-decimal list-inside space-y-3">
                                                    <li>
                                                        Buka aplikasi e-wallet atau mobile banking Anda (GoPay, OVO, Dana,
                                                        ShopeePay, dll.)
                                                    </li>
                                                    <li>
                                                        Pilih fitur <strong>Scan QRIS</strong> atau{' '}
                                                        <strong>Bayar dengan QR</strong>
                                                    </li>
                                                    <li>
                                                        Scan kode QR yang ditampilkan di atas atau yang dikirim ke
                                                        nomor/email Anda
                                                    </li>
                                                    <li>Pastikan nominal pembayaran sesuai dengan total yang tertera</li>
                                                    <li>Periksa kembali detail transaksi lalu konfirmasi pembayaran</li>
                                                    <li>Selesaikan pembayaran dan tunggu verifikasi otomatis</li>
                                                </ol>
                                            </div>
                                        );
                                    }

                                    if (instructions.length === 1) {
                                        const instr = instructions[0];
                                        return (
                                            <div className="space-y-3">
                                                <p className="font-medium">
                                                    {instr.title || 'Langkah Pembayaran'}
                                                </p>
                                                <ol className="list-decimal list-inside space-y-3">
                                                    {(instr.steps || []).map(renderStep)}
                                                </ol>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="space-y-3">
                                            <p className="font-medium">Instruksi Pembayaran:</p>
                                            <div className="space-y-2">
                                                {instructions.map((instr: any, idx: number) => (
                                                    <details
                                                        key={idx}
                                                        className="group border border-gray-200 rounded-lg bg-gray-50/70 open:bg-white open:border-primary/40 transition-colors"
                                                        open={idx === 0}
                                                    >
                                                        <summary className="flex items-center justify-between px-3 py-2 cursor-pointer select-none">
                                                            <span className="text-sm font-semibold text-gray-800">
                                                                {instr.title || `Metode ${idx + 1}`}
                                                            </span>
                                                            <FontAwesomeIcon
                                                                icon={faChevronDown}
                                                                className="h-3 w-3 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                                                            />
                                                        </summary>
                                                        <div className="px-4 pb-3 pt-1">
                                                            <ol className="list-decimal list-inside space-y-2">
                                                                {(instr.steps || []).map(renderStep)}
                                                            </ol>
                                                        </div>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </>
                        )}

                        {isSaldoPayment && (
                            <div className="space-y-4">
                                <p className="font-medium">Informasi Pembayaran Saldo:</p>
                                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                                    <li>Saldo akun Anda telah dipotong otomatis sebesar total pembayaran.</li>
                                    <li>Tidak perlu melakukan transfer atau scan QR tambahan.</li>
                                    <li>Pantau status pesanan di bagian atas halaman ini atau melalui menu Lacak Pesanan.</li>
                                </ol>
                            </div>
                        )}

                        <div className="bg-sky-50 p-4 rounded-2xl ring-1 ring-sky-100">
                            <p className="text-sky-900 text-sm">
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-primary" />
                                Pembayaran akan diverifikasi secara otomatis setelah pembayaran berhasil
                            </p>
                        </div>

                        {/* <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            Konfirmasi Pembayaran
                        </button> */}
                    </div>
                </div>
            </div>

        </div>
    );
};
