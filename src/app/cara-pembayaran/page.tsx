import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";

export default function CaraPembayaranPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Cara Pembayaran</h1>
        <p className="text-gray-600">
          Berikut ringkasan cara membayar pesanan Anda di {SITE_NAME}.
        </p>
      </header>

      <section className="prose prose-gray max-w-none space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold text-gray-900">1. Pilih produk &amp; nominal</h2>
        <p>
          Pilih game atau voucher, isi data akun sesuai petunjuk, lalu pilih metode pembayaran yang tersedia di halaman
          checkout.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">2. Saldo akun</h2>
        <p>
          Jika Anda memilih <strong>Bayar dengan Saldo</strong>, pastikan saldo mencukupi. Pembayaran akan langsung
          dipotong dari saldo Anda setelah konfirmasi.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">3. Transfer / VA / E-wallet / QRIS</h2>
        <p>
          Untuk metode lain (misalnya virtual account, e-wallet, atau QRIS), ikuti instruksi pembayaran yang muncul setelah
          pesanan dibuat. Nominal dan kode pembayaran harus sesuai agar verifikasi berjalan otomatis.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">4. Verifikasi</h2>
        <p>
          Setelah pembayaran berhasil diverifikasi oleh sistem, status pesanan akan diperbarui. Anda dapat memantau
          transaksi di halaman lacak pesanan atau invoice.
        </p>

        <p className="text-sm text-gray-500 pt-4">
          Jika mengalami kendala, hubungi tim support melalui halaman{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Hubungi Kami
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
