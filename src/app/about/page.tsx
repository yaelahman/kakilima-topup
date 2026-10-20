"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faHandshake, faShieldAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { SITE_NAME } from "@/lib/site-config";

export default function About() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Tentang {SITE_NAME}</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    {SITE_NAME} adalah platform top-up game dan voucher digital terpercaya di Indonesia.
                    Kami berkomitmen untuk memberikan layanan terbaik dengan proses yang cepat dan aman untuk berbagai game populer.
                </p>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Terpercaya</h3>
                    <p className="text-gray-600">Platform top-up game terpercaya dengan ribuan pelanggan setia.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    <FontAwesomeIcon icon={faHandshake} className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Pelayanan Terbaik</h3>
                    <p className="text-gray-600">Dukungan pelanggan 24/7 untuk membantu setiap kebutuhan Anda.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    <FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Transaksi Aman</h3>
                    <p className="text-gray-600">Sistem pembayaran yang aman dan terjamin keamanannya.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Proses Cepat</h3>
                    <p className="text-gray-600">Proses top-up instan dan otomatis dalam hitungan detik.</p>
                </motion.div>
            </section>

            {/* About Section */}
            <section className="bg-gray-50 p-8 rounded-2xl">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-2xl font-bold text-center mb-8">Mengapa Memilih {SITE_NAME}?</h2>
                    <p className="text-gray-600">
                        {SITE_NAME} hadir sebagai solusi untuk para gamers yang menginginkan proses top-up yang mudah,
                        cepat, dan aman. Dengan pengalaman bertahun-tahun dalam industri ini, kami telah melayani
                        ribuan pelanggan dengan tingkat kepuasan yang tinggi.
                    </p>
                    <p className="text-gray-600">
                        Kami menyediakan berbagai metode pembayaran yang dapat disesuaikan dengan kebutuhan Anda,
                        mulai dari e-wallet, transfer bank, hingga QRIS. Semua transaksi dijamin aman dan terpercaya
                        dengan sistem keamanan terkini.
                    </p>
                    <p className="text-gray-600">
                        Tim support kami siap membantu Anda 24/7 untuk memastikan setiap transaksi berjalan lancar.
                        Kepuasan pelanggan adalah prioritas utama kami, dan kami terus berinovasi untuk memberikan
                        pengalaman bertransaksi yang terbaik.
                    </p>
                </div>
            </section>
        </div>
    );
}
