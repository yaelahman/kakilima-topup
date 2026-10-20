import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { DEFAULT_INVOICE_DESCRIPTION, DEFAULT_FAILED_DESCRIPTION } from "@/models/transaction";

const STATUS_FAILED = 100;

interface HeaderInfoProps {
    status?: number;
    statusText?: string;
    description?: string;
}

export const HeaderInfo = ({ status, statusText, description }: HeaderInfoProps) => {
    const isFailed = status === STATUS_FAILED;
    const defaultDescription = isFailed ? DEFAULT_FAILED_DESCRIPTION : DEFAULT_INVOICE_DESCRIPTION;
    const subtitle = description ?? statusText ?? defaultDescription;

    return (
        <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative mb-8 overflow-hidden rounded-[1.75rem] border border-white/10 px-6 py-11 text-center text-white shadow-brand-lg"
            style={{
                background: isFailed
                    ? "linear-gradient(160deg, #450a0a 0%, #7f1d1d 55%, #991b1b 100%)"
                    : "linear-gradient(160deg, #042F2E 0%, #0E7490 48%, #0891B2 100%)",
            }}
        >
            <div
                className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full blur-3xl opacity-40"
                style={{ background: isFailed ? "#f87171" : "#22D3EE" }}
            />
            <div
                className="pointer-events-none absolute -right-8 bottom-0 h-36 w-36 rounded-full blur-3xl opacity-30"
                style={{ background: isFailed ? "#ef4444" : "#67E8F9" }}
            />

            <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur"
            >
                <FontAwesomeIcon icon={faReceipt} className="h-3 w-3" />
                Invoice
            </motion.p>

            <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
                <motion.span
                    className={`absolute inset-0 rounded-full ${isFailed ? "bg-red-400/25" : "bg-cyan-300/25"}`}
                    animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.15, 0.45] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                    className={`absolute inset-3 rounded-full border-2 ${isFailed ? "border-red-300/50" : "border-white/35"}`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    style={{
                        borderStyle: "dashed",
                    }}
                />
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    className={`relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] shadow-brand-lg ring-4 ${
                        isFailed
                            ? "bg-red-500 ring-red-200/40"
                            : "bg-white ring-cyan-200/50"
                    }`}
                >
                    <FontAwesomeIcon
                        icon={isFailed ? faTimesCircle : faCheckCircle}
                        className={isFailed ? "text-white" : "text-primary"}
                        style={{ width: "3.5rem", height: "3.5rem", fontSize: "3.5rem" }}
                    />
                </motion.div>
            </div>

            <h2 className="relative font-display text-2xl font-bold md:text-3xl">
                {isFailed ? "Transaksi Gagal" : "Pesanan diterima"}
            </h2>
            <p className={`relative mx-auto mt-2 max-w-lg text-sm leading-relaxed ${isFailed ? "text-red-100/90" : "text-cyan-50/90"}`}>
                {subtitle}
            </p>
        </motion.div>
    );
};
