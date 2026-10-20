import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCode, faKey, faLink } from "@fortawesome/free-solid-svg-icons";
import { SITE_NAME } from "@/lib/site-config";

const FRONTEND_BASE_URL = (
  process.env.NEXT_FRONTEND_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");
const API_BASE = `${FRONTEND_BASE_URL}/api`;

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 md:px-0 space-y-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <FontAwesomeIcon icon={faBook} className="h-3.5 w-3.5" />
          <span>Developer Documentation</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{SITE_NAME} API Documentation</h1>
        <p className="text-gray-600 max-w-2xl">
          Integrasikan layanan top up {SITE_NAME} ke aplikasi Anda dengan API berbasis JSON yang sederhana.
          Halaman ini menjelaskan cara autentikasi, endpoint utama, dan format webhook.
        </p>
        <div className="mt-2 text-xs text-gray-500">
          Base URL: <code className="px-1.5 py-0.5 bg-gray-100 rounded">{API_BASE}</code>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">1. Autentikasi & API Key</h2>
        <p className="text-sm text-gray-600">
          Semua permintaan ke endpoint <code className="px-1 bg-gray-100 rounded text-xs">/external/*</code> harus
          menyertakan API key di header:
        </p>
        <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto">
{`GET ${API_BASE}/external/profile
X-Api-Key: wx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
        </pre>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>
            <strong>Admin</strong> dapat membuat API key di panel admin: menu{" "}
            <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">API Access</span>.
          </li>
          <li>
            <strong>User biasa</strong> dapat membuat API key di halaman{" "}
            <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">/account/api</span> (menu{" "}
            <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">API Access</span>).
          </li>
          <li>
            Opsional: batasi IP dan setel <em>webhook URL</em> + <em>webhook secret</em> di panel admin untuk notifikasi
            status transaksi.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">2. Cek Profil</h2>
        <p className="text-sm text-gray-600">
          Mengambil informasi user yang terhubung dengan API key.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <FontAwesomeIcon icon={faCode} className="h-4 w-4 text-primary" />
            <span>GET /external/profile</span>
          </div>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto">
{`GET ${API_BASE}/external/profile
X-Api-Key: wx_your_api_key`}
          </pre>
          <p className="text-xs text-gray-500">Contoh respon (disederhanakan):</p>
          <pre className="bg-gray-100 text-gray-800 text-xs rounded-lg p-4 overflow-x-auto">
{`{
  "success": true,
  "data": {
    "id": 1,
    "name": "Demo User",
    "email": "user@example.com",
    "phone": "628123456789",
    "role": "member",
    "member_type": 1,
    "balance": 150000
  }
}`}
          </pre>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">3. Daftar Produk</h2>
        <p className="text-sm text-gray-600">
          Mengambil daftar produk yang tersedia untuk ditampilkan di sistem Anda.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <FontAwesomeIcon icon={faCode} className="h-4 w-4 text-primary" />
            <span>GET /external/products</span>
          </div>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto">
{`GET ${API_BASE}/external/products
X-Api-Key: wx_your_api_key`}
          </pre>
          <p className="text-xs text-gray-500">Respon berisi list produk aktif dengan <code>id</code>, <code>slug</code>, <code>name</code>, dan <code>image</code>.</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">4. Detail Produk + Harga & Form</h2>
        <p className="text-sm text-gray-600">
          Mengambil detail produk termasuk daftar harga (<code>ProductType</code>) dan form isian akun (<code>ProductForm</code>),
          sama seperti yang digunakan frontend {SITE_NAME}.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <FontAwesomeIcon icon={faCode} className="h-4 w-4 text-primary" />
            <span>GET /external/products/{`{slug}`}</span>
          </div>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto">
{`GET ${API_BASE}/external/products/mobile-legends
X-Api-Key: wx_your_api_key`}
          </pre>
          <p className="text-xs text-gray-500">
            Struktur respon mengikuti endpoint internal <code>/product/{`{slug}`}</code> (produk, daftar harga, form, dsb).
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">5. Membuat Transaksi</h2>
        <p className="text-sm text-gray-600">
          Membuat pesanan top up dari sistem Anda. Transaksi akan selalu menggunakan{" "}
          <strong>metode pembayaran saldo akun</strong> dengan email/WhatsApp user pemilik API key.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <FontAwesomeIcon icon={faCode} className="h-4 w-4 text-primary" />
            <span>POST /external/transactions</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Body (JSON):</p>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto">
{`POST ${API_BASE}/external/transactions
X-Api-Key: wx_your_api_key
Content-Type: application/json

{
  "product_id": 1,
  "price_id": 123,
  "quantity": 2,
  "user_information": [
    { "name": "player_id", "value": "123456789" },
    { "name": "zone_id", "value": "1234" }
  ]
}`}
          </pre>
          <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
            <li><code>product_id</code>: ID produk (gunakan hasil dari <code>/external/products</code> atau detail produk).</li>
            <li><code>price_id</code>: ID tipe harga yang dipilih.</li>
            <li><code>quantity</code> (opsional, default 1): jumlah voucher. Hanya berlaku untuk produk voucher; stok harus cukup. 2 voucher = 2 kode dikirim.</li>
            <li><code>user_information</code>: array sesuai definisi form produk (nama field harus sama dengan <code>ProductForm</code>).</li>
            <li>Email dan WhatsApp diambil dari profil user yang terhubung dengan API key.</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">Contoh respon (disederhanakan):</p>
          <pre className="bg-gray-100 text-gray-800 text-xs rounded-lg p-4 overflow-x-auto">
{`{
  "success": true,
  "message": "Berhasil membuat pesanan, halaman akan dialihkan!",
  "invoice": "WXSTRX1234567890",
  "amount": 85000
}`}
          </pre>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">6. Detail Transaksi</h2>
        <p className="text-sm text-gray-600">
          Mengecek status transaksi berdasarkan nomor invoice. Hanya transaksi milik user pemilik API key yang bisa diakses.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <FontAwesomeIcon icon={faCode} className="h-4 w-4 text-primary" />
            <span>GET /external/transactions/{`{invoice}`}</span>
          </div>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto">
{`GET ${API_BASE}/external/transactions/WXSTRX1234567890
X-Api-Key: wx_your_api_key`}
          </pre>
          <p className="text-xs text-gray-500">Contoh respon:</p>
          <pre className="bg-gray-100 text-gray-800 text-xs rounded-lg p-4 overflow-x-auto">
{`{
  "success": true,
  "data": {
    "invoice": "WXSTRX1234567890",
    "amount": 85000,
    "status": 3,
    "status_text": "Berhasil",
    "product": "Mobile Legends",
    "product_type": "86 Diamonds",
    "payment_method": "Saldo",
    "is_api": true,
    "created_at": "2026-03-06T10:00:00+07:00",
    "processed_at": "2026-03-06T10:01:00+07:00",
    "refunded_at": null
  }
}`}
          </pre>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">7. Webhook Status Transaksi</h2>
        <p className="text-sm text-gray-600">
          Jika <strong>Webhook URL</strong> dan <strong>Webhook Secret</strong> diisi pada API key (di panel admin),
          maka setiap perubahan status transaksi API akan mengirim request ke endpoint webhook Anda.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <FontAwesomeIcon icon={faLink} className="h-4 w-4 text-primary" />
            <span>Contoh webhook request</span>
          </div>
          <p className="text-xs text-gray-500">Headers:</p>
          <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto">
{`POST https://your-webhook-url.com/wxstore
Content-Type: application/json
X-Api-Key-Id: 12
X-Api-Key-Name: Server Utama
X-Webhook-Signature: &lt;HMAC-SHA256 body menggunakan webhook_secret&gt;`}
          </pre>
          <p className="text-xs text-gray-500">Body (JSON):</p>
          <pre className="bg-gray-100 text-gray-800 text-xs rounded-lg p-4 overflow-x-auto">
{`{
  "invoice": "WXSTRX1234567890",
  "status": 3,
  "status_text": "Berhasil",
  "amount": 85000,
  "product": "Mobile Legends",
  "product_type": "86 Diamonds",
  "is_refund": false,
  "created_at": "2026-03-06T10:00:00+07:00",
  "processed_at": "2026-03-06T10:01:00+07:00",
  "refunded_at": null
}`}
          </pre>
          <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
            <li>Gunakan header <code className="px-1 bg-gray-100 rounded text-xs">X-Webhook-Signature</code> untuk memverifikasi integritas payload.</li>
            <li>
              Signature dihitung sebagai <code className="px-1 bg-gray-100 rounded text-xs">HMAC-SHA256(JSON.stringify(body), webhook_secret)</code>.
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">8. Catatan & Best Practice</h2>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Simpan API key seperti password: jangan commit ke repository publik.</li>
          <li>Gunakan IP restriction dan webhook secret untuk keamanan tambahan.</li>
          <li>Gunakan <code className="px-1 bg-gray-100 rounded text-xs">/external/transactions/{`{invoice}`}</code> untuk polling status bila webhook tidak tersedia.</li>
          <li>Jika respons <code className="px-1 bg-gray-100 rounded text-xs">success: false</code>, periksa field <code className="px-1 bg-gray-100 rounded text-xs">message</code> untuk detail error.</li>
        </ul>
      </section>
    </div>
  );
}

