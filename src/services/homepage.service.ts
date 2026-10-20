import { httpClient } from "@/lib/client";

export const getHomepage = async (token?: string | null): Promise<any> => {
  try {
    const response = await httpClient({
      route: "/homepage",
      token,
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    throw error;
  }
};

export const getBanners = async (token?: string | null): Promise<{ banners: any[] }> => {
  const response = await httpClient({
    route: "/homepage/banners",
    token,
  });
  return response;
};

export const getHomepageCategories = async (
  token?: string | null,
): Promise<{ categories: any[] }> => {
  const response = await httpClient({
    route: "/homepage/categories",
    token,
  });
  return response;
};

export const getHomepageProducts = async (
  token?: string | null,
): Promise<{ products: any[] }> => {
  const response = await httpClient({
    route: "/homepage/products",
    token,
  });
  return response;
};

export const getHomepagePromos = async (
  token?: string | null,
): Promise<{ promos: any[] }> => {
  const response = await httpClient({
    route: "/homepage/promos",
    token,
  });
  return response;
};

export const getHomepagePopup = async (
  token?: string | null,
): Promise<{ popup_notification: any | null }> => {
  const response = await httpClient({
    route: "/homepage/popup",
    token,
  });
  return response;
};

export type TrendingProduct = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  category?: string | null;
  transaction_count?: number;
};

export const getHomepageTrending = async (
  token?: string | null,
): Promise<{ trending: TrendingProduct[] }> => {
  const response = await httpClient({
    route: "/homepage/trending",
    token,
  });
  return response;
};

export type HomepageStats = {
  total_transactions: number;
  active_users: number;
  games_available: number;
  satisfaction_rate: number;
};

export const getHomepageStats = async (
  token?: string | null,
): Promise<{ stats: HomepageStats }> => {
  const response = await httpClient({
    route: "/homepage/stats",
    token,
  });
  return response;
};

export const getPriceList = async (token?: string | null): Promise<{ products: any[] }> => {
  try {
    const response = await httpClient({
      route: "/price-list",
      token,
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch price list:", error);
    throw error;
  }
};
