import { SITE_NAME } from "@/lib/site-config";

export default function SyaratKetentuanPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Syarat &amp; Ketentuan</h1>
        <p className="text-gray-600">
          Dengan menggunakan layanan {SITE_NAME}, Anda dianggap telah membaca dan menyetujui ketentuan berikut.
        </p>
      </header>

      <section className="space-y-6 text-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Layanan</h2>
          <p>
            {SITE_NAME} menyediakan layanan top up game dan produk digital. Ketersediaan produk dan harga dapat berubah
            sewaktu-waktu mengikuti kebijakan penyedia atau game terkait.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Akun &amp; data</h2>
          <p>
            Anda bertanggung jawab atas kebenaran data yang diinput (ID game, server, email, nomor WhatsApp, dll.).
            Kesalahan input dapat mengakibatkan gagalnya pengiriman atau proses yang tidak dapat dikembalikan.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Pembayaran</h2>
          <p>
            Pembayaran wajib dilakukan sesuai nominal dan instruksi yang ditampilkan. Kami tidak bertanggung jawab atas
            transfer ke rekening atau metode di luar yang tertera di sistem resmi {SITE_NAME}.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Pengembalian &amp; sengketa</h2>
          <p>
            Kebijakan refund atau kompensasi mengikuti aturan yang berlaku per transaksi dan bukti yang dapat diverifikasi.
            Hubungi support untuk penanganan kasus khusus.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Perubahan</h2>
          <p className="text-sm text-gray-600">
            {SITE_NAME} dapat memperbarui syarat dan ketentuan ini. Perubahan material akan diinformasikan melalui
            kanal yang wajar (misalnya halaman ini atau pengumuman di situs).
          </p>
        </div>
      </section>
    </div>
  );
}
