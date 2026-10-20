import { httpClient } from '@/lib/client';

export const getProduct = async (slug: string, token?: string | null): Promise<any> => {
    try {
        const response = await httpClient({
            route: `/product/${slug}`,
            token
        });
        return response;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
};

export const getAccountInfo = async (params: any, token?: string | null): Promise<any> => {
    try {
        const response = await httpClient({
            route: `/account-check`,
            body: params,
            token
        });
        return response;
    } catch (error) {
        console.error('Failed to fetch account info:', error);
        throw error;
    }
};

export const getLatestTransactions = async (params?: { q?: string } | null, token?: string | null): Promise<{ transactions: any[] }> => {
    try {
        const route = params?.q?.trim()
            ? `/transaction/latest?q=${encodeURIComponent(params.q.trim())}`
            : '/transaction/latest';
        const response = await httpClient({
            route,
            token
        });
        return response;
    } catch (error) {
        console.error('Failed to fetch latest transactions:', error);
        throw error;
    }
};

export const getInvoice = async (invoice: string, token?: string | null): Promise<any> => {
    try {
        const response = await httpClient({
            route: `/transaction/invoice/${invoice}`,
            token
        });
        return response;
    } catch (error) {
        console.error('Failed to fetch invoice:', error);
        throw error;
    }
};

export type PromoCheckPayload = {
    code: string;
    id_product: number;
    id_product_type: number;
    price: number;
    userData: { name: string; value: string }[];
};

/** discount_type: 0 = normal (fixed Rp), 1 = percent */
export type PromoCheckResponse = {
    data: { discount: number; discount_type: number } | null;
    message: string;
};

export const checkPromoCode = async (
    payload: PromoCheckPayload,
    token?: string | null
): Promise<PromoCheckResponse> => {
    try {
        const response = await httpClient({
            route: `/promo/check`,
            method: 'POST',
            body: payload,
            token,
        });
        return response as PromoCheckResponse;
    } catch (error) {
        console.error('Failed to check promo:', error);
        throw error;
    }
};

export const createTransaction = async (payload: any, token?: string | null): Promise<any> => {
    try {
        const response = await httpClient({
            route: `/transaction/store`,
            method: 'POST',
            body: payload,
            token
        });
        return response;
    } catch (error) {
        console.error('Failed to create transaction:', error);
        throw error;
    }
};
