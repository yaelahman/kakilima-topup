import { SITE_NAME } from "@/lib/site-config";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  author: string;
  publishedAt: string; // ISO
  updatedAt: string;   // ISO
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "cara-top-up-game-murah-dan-aman-2024",
    title: "Cara Top Up Game Murah dan Aman di 2024",
    excerpt: "Panduan lengkap memilih layanan top up game yang terpercaya, murah, dan proses instan. Tips agar tidak tertipu dan tetap aman.",
    content: `
      <p>Top up game sudah menjadi kebutuhan bagi para gamer. Baik untuk membeli diamond, UC, atau voucher in-game lainnya, memilih tempat yang <strong>murah dan aman</strong> sangat penting.</p>
      <h2>1. Pilih Situs Resmi atau Terpercaya</h2>
      <p>Pastikan Anda melakukan top up melalui platform yang sudah memiliki reputasi baik dan dilengkapi dengan lisensi resmi. Cek ulasan pengguna dan lama situs beroperasi.</p>
      <h2>2. Bandingkan Harga</h2>
      <p>Harga diamond atau item game bisa berbeda antar penyedia. Bandingkan beberapa situs dan pilih yang menawarkan harga kompetitif tanpa mengorbankan keamanan.</p>
      <h2>3. Proses Cepat dan Notifikasi Jelas</h2>
      <p>Layanan terbaik biasanya memproses order dalam hitungan menit dan mengirim konfirmasi via email atau WhatsApp. Simpan bukti transaksi untuk jaga-jaga.</p>
      <h2>4. Metode Pembayaran Aman</h2>
      <p>Gunakan metode pembayaran yang Anda kenal (e-wallet, transfer bank, atau minimarket). Hindari transfer ke rekening pribadi tanpa jaminan.</p>
      <p>Dengan mengikuti tips di atas, pengalaman top up game Anda akan lebih nyaman dan aman. Selamat bermain!</p>
    `,
    image: "/images/logo.png",
    imageAlt: "Cara top up game murah dan aman",
    author: `Tim ${SITE_NAME}`,
    publishedAt: "2024-01-15T09:00:00+07:00",
    updatedAt: "2024-01-15T09:00:00+07:00",
  },
  {
    id: "2",
    slug: "perbedaan-diamond-dan-voucher-game",
    title: "Perbedaan Diamond dan Voucher Game: Mana yang Lebih Menguntungkan?",
    excerpt: "Memahami perbedaan diamond, UC, voucher, dan kredit game agar Anda bisa memilih opsi terbaik sesuai kebutuhan bermain.",
    content: `
      <p>Banyak pemain game bingung memilih antara <strong>diamond</strong>, <strong>voucher</strong>, atau <strong>kredit game</strong>. Artikel ini menjelaskan perbedaannya secara singkat.</p>
      <h2>Diamond / UC / Voucher In-Game</h2>
      <p>Ini adalah mata uang dalam game yang dipakai untuk beli skin, karakter, atau item di dalam game. Harganya biasanya tetap per nominal (misal 100 diamond, 500 UC). Cocok jika Anda sudah tahu ingin beli apa di dalam game.</p>
      <h2>Voucher Game (Kode)</h2>
      <p>Voucher berbentuk kode yang Anda tukar di dalam game. Biasanya untuk game tertentu (contoh: Mobile Legends, Free Fire). Proses: beli voucher → dapat kode → redeem di game.</p>
      <h2>Kredit / Pass</h2>
      <p>Beberapa game punya sistem pass atau kredit khusus event. Pastikan Anda beli yang sesuai dengan game dan server Anda.</p>
      <h2>Kesimpulan</h2>
      <p>Pilih <strong>diamond/UC</strong> jika ingin fleksibel belanja di dalam game. Pilih <strong>voucher kode</strong> jika ada promo atau lebih nyaman dengan sistem redeem. Keduanya aman asal dibeli di tempat resmi.</p>
    `,
    image: "/images/logo.png",
    imageAlt: "Perbedaan diamond dan voucher game",
    author: `Tim ${SITE_NAME}`,
    publishedAt: "2024-02-01T10:30:00+07:00",
    updatedAt: "2024-02-01T10:30:00+07:00",
  },
  {
    id: "3",
    slug: "tips-hemat-saat-top-up-mobile-legends",
    title: "Tips Hemat Saat Top Up Mobile Legends",
    excerpt: "Cara dapat diamond ML murah, waktu terbaik beli, dan trik memanfaatkan event agar pengeluaran tetap terkontrol.",
    content: `
      <p><strong>Mobile Legends</strong> adalah salah satu game yang paling sering di-top up oleh pemain Indonesia. Berikut tips agar pengeluaran Anda tetap hemat.</p>
      <h2>1. Manfaatkan Event dan Promo</h2>
      <p>Biasanya saat event (tahun baru, anniversary, kolaborasi) ada diskon atau bonus diamond. Tunggu momen tersebut dan beli dalam paket yang lebih besar untuk harga per unit lebih murah.</p>
      <h2>2. Pilih Paket yang Sesuai Kebutuhan</h2>
      <p>Jangan beli diamond dalam jumlah kecil berkali-kali; seringnya paket sedang atau besar lebih murah per diamond. Hitung dulu kebutuhan Anda (misal untuk satu skin) lalu pilih paket terdekat.</p>
      <h2>3. Gunakan Layanan dengan Harga Bersaing</h2>
      <p>Bandingkan harga di beberapa situs top up resmi. Perbedaan beberapa ratus rupiah per 100 diamond bisa terasa jika Anda top up rutin.</p>
      <h2>4. Hindari Penipuan</h2>
      <p>Jangan tergiur penawaran "diamond gratis" atau harga di bawah pasaran dari sumber tidak jelas. Selalu gunakan channel resmi atau mitra terpercaya.</p>
      <p>Dengan disiplin dan memanfaatkan promo, Anda tetap bisa menikmati ML tanpa boros. Semoga bermanfaat!</p>
    `,
    image: "/images/logo.png",
    imageAlt: "Tips hemat top up Mobile Legends",
    author: `Tim ${SITE_NAME}`,
    publishedAt: "2024-02-20T08:00:00+07:00",
    updatedAt: "2024-02-20T08:00:00+07:00",
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
