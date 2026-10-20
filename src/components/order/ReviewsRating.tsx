"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

const STAR_SIZE = "text-lg md:text-xl";

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="inline-flex items-center gap-0.5 text-primary">
      {Array.from({ length: full }).map((_, i) => (
        <FontAwesomeIcon key={`f-${i}`} icon={faStar} className={STAR_SIZE} />
      ))}
      {half > 0 && (
        <FontAwesomeIcon icon={faStarHalfAlt} className={STAR_SIZE} />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <FontAwesomeIcon key={`e-${i}`} icon={faStarRegular} className={`${STAR_SIZE} text-gray-300`} />
      ))}
    </span>
  );
}

const MOCK_REVIEWS = [
  { name: "Budi S.", rating: 5, date: "2 hari lalu", comment: "Proses cepat, diamond masuk kurang dari 5 menit. Recommended!" },
  { name: "Ani W.", rating: 5, date: "1 minggu lalu", comment: "Pertama kali top up di sini, aman dan harganya bersaing." },
  { name: "Rudi K.", rating: 4, date: "2 minggu lalu", comment: "Pelayanan CS ramah, transaksi lancar. Harga oke." },
  { name: "Dewi L.", rating: 5, date: "3 minggu lalu", comment: "Sudah langganan, selalu proses instan. Mantap." },
];

const AVERAGE_RATING = 4.8;
const TOTAL_REVIEWS = 1247;

export function ReviewsRating({ productName }: { productName?: string }) {
  return (
    <section className="mt-10 md:mt-14 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <StarRating value={AVERAGE_RATING} />
        <span>Ulasan & Rating</span>
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-800">{AVERAGE_RATING}</span>
          <StarRating value={AVERAGE_RATING} />
        </div>
        <p className="text-gray-600 text-sm">
          Berdasarkan <strong>{TOTAL_REVIEWS.toLocaleString("id-ID")}</strong> ulasan
          {productName ? ` untuk ${productName}` : ""}.
        </p>
      </div>
      <div className="space-y-5">
        {MOCK_REVIEWS.map((review, index) => (
          <div
            key={index}
            className="rounded-xl bg-gray-50/80 p-4 md:p-5 border border-gray-100"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StarRating value={review.rating} />
              <span className="font-semibold text-gray-800">{review.name}</span>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-500 text-sm">{review.date}</span>
            </div>
            <p className="text-gray-600 text-sm md:text-base">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
