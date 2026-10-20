import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";

export default function KebijakanPrivasiPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Kebijakan Privasi</h1>
        <p className="text-gray-600">
          Kami menghormati privasi Anda. Kebijakan ini menjelaskan secara ringkas data apa yang terkait dengan layanan{" "}
          {SITE_NAME}.
        </p>
      </header>

      <section className="space-y-6 text-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Data yang dikumpulkan</h2>
          <p>
            Misalnya: data akun (email, nama), informasi pesanan (produk, nominal, status), data teknis (log, alamat IP)
            untuk keamanan dan analitik dasar, serta data yang Anda berikan saat menghubungi support.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Penggunaan data</h2>
          <p>
            Data digunakan untuk memproses transaksi, verifikasi pembayaran, layanan pelanggan, peningkatan keamanan, dan
            pemenuhan kewajiban hukum yang berlaku.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Penyimpanan &amp; keamanan</h2>
          <p>
            Kami menerapkan langkah wajar untuk melindungi data dari akses tidak sah. Data disimpan selama diperlukan
            untuk tujuan di atas atau sesuai retention policy internal.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Pihak ketiga</h2>
          <p>
            Pemrosesan pembayaran dapat melibatkan penyedia gateway pembayaran (misalnya Tripay, bank, atau e-wallet).
            Penggunaan data oleh pihak ketiga mengikuti kebijakan masing-masing penyedia tersebut.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Hak Anda</h2>
          <p className="text-sm text-gray-600">
            Anda dapat menghubungi kami untuk pertanyaan terkait data pribadi melalui halaman{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Hubungi Kami
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
