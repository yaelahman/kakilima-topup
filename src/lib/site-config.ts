/**
 * Central site config for SEO and metadata. Driven by env: NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SITE_NAME.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://https://kakilimatopup.com";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "KAKILIMA TOPUP";
export const SITE_DEFAULT_TITLE =
  process.env.NEXT_PUBLIC_SITE_TITLE ||
  `${SITE_NAME} - Top Up Game Murah dan Cepat No 1 Di Indonesia`;
export const SITE_DEFAULT_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  `Penuhi kebutuhan game mu bersama ${SITE_NAME}. Specialist top up game No.1: murah, aman, terpercaya, legal 100%. Layanan 24 jam.`;
export const SITE_LOGO_PATH = "/images/logo.png";
/** Full wordmark for navbar / brand lockups */
export const SITE_LOGO_HORIZONTAL_PATH = "/images/logo-horizontal.png";
export const SITE_LOCALE = "id_ID";
