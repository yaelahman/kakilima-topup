import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";

const faqs = [
  {
    q: "Berapa lama proses top up?",
    a: "Untuk banyak metode pembayaran, verifikasi berjalan otomatis setelah pembayaran berhasil. Waktu penyelesaian dapat bervariasi tergantung metode dan beban sistem.",
  },
  {
    q: "Apa yang harus dilakukan jika pembayaran sudah dilakukan tapi status belum berubah?",
    a: "Tunggu beberapa menit. Pastikan nominal dan kode pembayaran sesuai. Jika masih bermasalah, siapkan bukti bayar dan hubungi tim support melalui halaman Hubungi Kami.",
  },
  {
    q: "Bisakah membatalkan pesanan?",
    a: "Kebijakan pembatalan bergantung pada status transaksi. Hubungi support dengan nomor invoice Anda untuk penanganan kasus per kasus.",
  },
  {
    q: "Apakah aman membayar di situs ini?",
    a: `${SITE_NAME} menggunakan jalur pembayaran resmi (gateway). Jangan transfer ke rekening pribadi di luar instruksi resmi di halaman pembayaran.`,
  },
  {
    q: "Bagaimana cara top up saldo akun?",
    a: "Masuk ke akun Anda, buka menu isi saldo / balance, pilih nominal dan metode pembayaran, lalu ikuti instruksi hingga selesai.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Pertanyaan Umum (FAQ)</h1>
        <p className="text-gray-600">
          Jawaban singkat untuk pertanyaan yang sering ditanyakan di {SITE_NAME}.
        </p>
      </header>

      <ul className="space-y-4">
        {faqs.map((item) => (
          <li
            key={item.q}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <h2 className="font-semibold text-gray-900 mb-2">{item.q}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-500">
        Pertanyaan lain?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Hubungi kami
        </Link>
        .
      </p>
    </div>
  );
}
