"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_FAQS = [
  {
    q: "Bagaimana cara memesan?",
    a: "Pilih nominal yang diinginkan, isi data akun game (ID, server, dll), pilih metode pembayaran, lalu lengkapi WhatsApp dan email. Klik Beli Sekarang dan selesaikan pembayaran. Diamond/voucher akan diproses otomatis setelah pembayaran terverifikasi.",
  },
  {
    q: "Berapa lama proses pengiriman?",
    a: "Umumnya pengiriman diamond atau item game diproses secara otomatis dalam 1–15 menit setelah pembayaran dikonfirmasi. Jika lebih dari 30 menit, hubungi CS kami via WhatsApp dengan menyertakan nomor invoice.",
  },
  {
    q: "Apa yang harus dilakukan jika diamond/item tidak masuk?",
    a: "Pastikan ID dan server game sudah benar. Cek inbox email untuk konfirmasi pembayaran. Jika sudah benar dan belum masuk dalam 30 menit, hubungi Customer Service kami via WhatsApp dengan nomor invoice dan screenshot bukti transfer. Kami akan cek dan proses kompensasi jika sesuai ketentuan.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menyediakan berbagai metode pembayaran: transfer bank, e-wallet (OVO, DANA, GoPay, dll), minimarket, dan virtual account. Pilih metode yang paling nyaman saat checkout.",
  },
  {
    q: "Apakah transaksi di sini aman?",
    a: "Ya. Semua transaksi dilindungi dan data Anda dijaga kerahasiaannya. Kami melayani ribuan transaksi setiap hari dengan sistem pembayaran terpercaya dan Customer Service 24/7.",
  },
];

export function ProductFAQ({ faqs }: { faqs?: { q: string; a: string }[] }) {
  const items = faqs?.length ? faqs : DEFAULT_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mt-10 md:mt-14 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faQuestionCircle} className="h-6 w-6 text-primary" />
        Pertanyaan Umum
      </h2>
      <div className="space-y-2">
        {items.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl border border-gray-100 overflow-hidden transition-colors hover:border-primary/20"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-medium text-gray-800 bg-gray-50/50 hover:bg-primary/5 transition-colors"
              >
                <span className="text-sm md:text-base">{faq.q}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-4 w-4 text-primary shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-all duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-gray-100 px-4 py-3 text-gray-600 text-sm md:text-base bg-white">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
