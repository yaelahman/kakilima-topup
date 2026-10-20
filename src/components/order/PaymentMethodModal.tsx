import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Image from "next/image";
import { formatRupiah, calcPaymentFee } from "@/lib/helper";
import { useMemo } from "react";

interface PaymentMethodModalProps {
    show: boolean;
    onClose: () => void;
    onSelect: (payment: any) => void;
    payments?: any[];
    denom?: any;
    selectedPayment?: any;
}

export const PaymentMethodModal = ({ show, onClose, onSelect, payments = [], denom = {}, selectedPayment = {} }: PaymentMethodModalProps) => {
    if (!show) return null;
    // Default payment methods if no payments data is provided
    const defaultPayments: any[] = [];

    let paymentMethods = defaultPayments;

    try {
        if (payments && payments.length > 0) {
            // Check if payments data is properly structured
            if (payments[0].payments && Array.isArray(payments[0].payments)) {
                paymentMethods = payments;
            } else if (payments[0].name && payments[0].id) {
                // If payments is a flat array of payment objects
                paymentMethods = payments;
            }
        }
    } catch (error) {
        console.warn('Error processing payments data:', error);
        paymentMethods = defaultPayments;
    }

    const basePrice = Number(denom?.price) || 0;
    const calculatePaymentTotal = (payment: any) => {
        return basePrice + calcPaymentFee(basePrice, payment);
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Pilih Metode Pembayaran</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                    </button>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-96">
                    {paymentMethods.map((paymentGroup: any) => (
                        <div key={paymentGroup.group || paymentGroup.id} className="border-b pb-4">
                            <h4 className="font-semibold mb-2">{paymentGroup.group || paymentGroup.description}</h4>
                            <div className="space-y-2">
                                {paymentGroup.payments.map((payment: any) => (
                                    <div
                                        key={payment.id}
                                        className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 group hover:shadow-md ${selectedPayment?.id === payment.id
                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50/80'
                                            }`}
                                        onClick={() => onSelect(payment)}
                                    >

                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                            {payment.icon ? (
                                                <Image
                                                    src={payment.icon}
                                                    alt={payment.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <span className="text-primary font-bold text-lg">
                                                        {payment.name?.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 ml-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h5 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                                        {payment.name}
                                                    </h5>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                            Fee: {formatRupiah(calcPaymentFee(basePrice, payment))}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right ml-3">
                                                    <div className="text-sm font-semibold text-gray-800">
                                                        {formatRupiah(calculatePaymentTotal(payment))}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Total</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};