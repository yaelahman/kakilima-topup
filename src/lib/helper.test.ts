import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  calcPaymentFee,
  calcPaymentFeeFromTotal,
  formatPromoDiscountLabel,
  formatRupiah,
  getImageUrl,
  priceAfterPromo,
  timeAgo,
} from "./helper";

vi.mock("./client", () => ({
  IMAGE_URL_API: "https://cdn.example.com/storage",
}));

describe("calcPaymentFee", () => {
  it("returns 0 when payment is missing", () => {
    expect(calcPaymentFee(10000)).toBe(0);
    expect(calcPaymentFee(10000, null)).toBe(0);
  });

  it("falls back to extra_price when fee or fee_type is null", () => {
    expect(calcPaymentFee(10000, { fee: null, fee_type: "normal", extra_price: 1500 })).toBe(1500);
    expect(calcPaymentFee(10000, { fee: 500, fee_type: null, extra_price: 2000 })).toBe(2000);
    expect(calcPaymentFee(10000, { fee: null, fee_type: null })).toBe(0);
  });

  it("calculates percent fee from base amount", () => {
    expect(calcPaymentFee(100000, { fee: 2.5, fee_type: "percent" })).toBe(2500);
    expect(calcPaymentFee(9999, { fee: 1, fee_type: "percent" })).toBe(100);
  });

  it("returns flat fee for non-percent fee_type", () => {
    expect(calcPaymentFee(100000, { fee: 2500, fee_type: "normal" })).toBe(2500);
  });
});

describe("calcPaymentFeeFromTotal", () => {
  it("returns 0 when payment is missing", () => {
    expect(calcPaymentFeeFromTotal(10000)).toBe(0);
  });

  it("falls back to extra_price when fee metadata incomplete", () => {
    expect(calcPaymentFeeFromTotal(10000, { fee: null, fee_type: null, extra_price: 900 })).toBe(900);
  });

  it("derives percent fee from inclusive total", () => {
    // total 102500 with 2.5% => fee = 102500 * 2.5 / 102.5 = 2500
    expect(calcPaymentFeeFromTotal(102500, { fee: 2.5, fee_type: "percent" })).toBe(2500);
  });

  it("returns flat fee for normal fee_type", () => {
    expect(calcPaymentFeeFromTotal(50000, { fee: 1000, fee_type: "normal" })).toBe(1000);
  });
});

describe("priceAfterPromo", () => {
  it("applies fixed Rp discount (discount_type 0)", () => {
    expect(priceAfterPromo(50000, { discount: 5000, discount_type: 0 })).toEqual({
      subtotal: 45000,
      savings: 5000,
    });
  });

  it("applies percent discount (discount_type 1)", () => {
    expect(priceAfterPromo(100000, { discount: 10, discount_type: 1 })).toEqual({
      subtotal: 90000,
      savings: 10000,
    });
  });

  it("clamps subtotal at 0 when discount exceeds base", () => {
    expect(priceAfterPromo(3000, { discount: 5000, discount_type: 0 })).toEqual({
      subtotal: 0,
      savings: 3000,
    });
  });

  it("treats invalid base as 0", () => {
    expect(priceAfterPromo(Number.NaN, { discount: 10, discount_type: 0 })).toEqual({
      subtotal: 0,
      savings: 0,
    });
  });
});

describe("formatPromoDiscountLabel", () => {
  it("formats fixed discount as rupiah", () => {
    expect(formatPromoDiscountLabel({ discount: 5000, discount_type: 0 })).toBe("Rp 5.000");
  });

  it("formats percent discount with %", () => {
    expect(formatPromoDiscountLabel({ discount: 15, discount_type: 1 })).toBe("15%");
  });
});

describe("formatRupiah", () => {
  it("formats number as IDR currency", () => {
    expect(formatRupiah(15000)).toBe("Rp 15.000");
  });

  it("parses numeric string", () => {
    expect(formatRupiah("2500")).toBe("Rp 2.500");
  });

  it("returns Rp 0 for invalid input", () => {
    expect(formatRupiah("abc")).toBe("Rp 0");
  });
});

describe("getImageUrl", () => {
  it("builds product image url by default", () => {
    expect(getImageUrl("mlbb.png")).toBe("https://cdn.example.com/storage/product/mlbb.png");
  });

  it("accepts custom prefix", () => {
    expect(getImageUrl("banner.jpg", "banners")).toBe(
      "https://cdn.example.com/storage/banners/banner.jpg",
    );
  });
});

describe("timeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-03T12:00:00+07:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns baru saja for recent or future times", () => {
    expect(timeAgo(new Date("2026-11-03T11:59:30+07:00"))).toBe("baru saja");
    expect(timeAgo(new Date("2026-11-03T12:01:00+07:00"))).toBe("baru saja");
  });

  it("returns minutes, hours, days", () => {
    expect(timeAgo(new Date("2026-11-03T11:45:00+07:00"))).toBe("15 menit yang lalu");
    expect(timeAgo(new Date("2026-11-03T09:00:00+07:00"))).toBe("3 jam yang lalu");
    expect(timeAgo(new Date("2026-11-01T12:00:00+07:00"))).toBe("2 hari yang lalu");
  });

  it("accepts ISO string dates", () => {
    expect(timeAgo("2026-11-03T10:00:00+07:00")).toBe("2 jam yang lalu");
  });
});
