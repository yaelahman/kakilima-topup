"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContactInfo, submitContactForm } from "@/services/contact.service";

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [statusMessage, setStatusMessage] = useState("");

    const { data: contact } = useQuery({
        queryKey: ["contact-info"],
        queryFn: getContactInfo,
        staleTime: 5 * 60 * 1000,
    });

    const supportEmail = contact?.email ?? "support@https://kakilimatopup.com";
    const whatsappDisplay = contact?.whatsapp ?? "-";
    const whatsappLink = contact?.whatsapp_link;
    const hours = contact?.operational_hours ?? "Senin - Minggu, 24 Jam Non-Stop";
    const address = contact?.address ?? "Indonesia";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setStatusMessage("");
        try {
            const res = await submitContactForm({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim() || undefined,
                subject: subject.trim() || undefined,
                message: message.trim(),
            });
            if (res.success) {
                setStatus("success");
                setStatusMessage(res.message ?? "Pesan berhasil dikirim.");
                setName("");
                setEmail("");
                setPhone("");
                setSubject("");
                setMessage("");
            } else {
                setStatus("error");
                setStatusMessage((res as { message?: string }).message ?? "Gagal mengirim pesan.");
            }
        } catch (err: unknown) {
            setStatus("error");
            const msg = err && typeof err === "object" && "response" in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                : null;
            setStatusMessage(msg ?? "Terjadi kesalahan. Coba lagi nanti.");
        }
    }

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Hubungi Kami</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Kami siap membantu Anda. Jangan ragu untuk menghubungi kami melalui berbagai channel yang tersedia.
                </p>
            </section>

            {/* Contact Methods */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    <FontAwesomeIcon icon={faPhone} className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                    {whatsappLink ? (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            {whatsappDisplay}
                        </a>
                    ) : (
                        <p className="text-gray-600">{whatsappDisplay}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-2">Chat langsung dengan CS</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    <FontAwesomeIcon icon={faEnvelope} className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <a
                        href={`mailto:${supportEmail}`}
                        className="text-gray-600 hover:text-primary transition-colors break-all"
                    >
                        {supportEmail}
                    </a>
                    <p className="text-gray-500 text-sm mt-2">Respon dalam 24 jam</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Jam Operasional</h3>
                    <p className="text-gray-600">{hours}</p>
                    <p className="text-gray-500 text-sm mt-2">Layanan pelanggan</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Alamat</h3>
                    <p className="text-gray-600">{address}</p>
                    <p className="text-gray-500 text-sm mt-2">Lokasi operasional</p>
                </motion.div>
            </section>

            {/* Contact Form */}
            <section className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h2>
                {status === "success" && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200">
                        {statusMessage}
                    </div>
                )}
                {status === "error" && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
                        {statusMessage}
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nama *</label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Masukkan nama Anda"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Masukkan email Anda"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="08xxxxxxxxxx"
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Keluhan, pertanyaan, dll."
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Pesan *</label>
                        <textarea
                            id="message"
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Tulis pesan Anda"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full md:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {status === "loading" ? "Mengirim..." : "Kirim Pesan"}
                    </button>
                </form>
            </section>
        </div>
    );
}
