import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;
export const IMAGE_URL_API = process.env.NEXT_PUBLIC_IMAGE_URL_API;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = API_URL;

/** Prevent concurrent 401 handlers from causing redirect storms */
let signingOutOn401 = false;

async function handleUnauthorizedSession(callbackPath?: string) {
    if (typeof window === 'undefined' || signingOutOn401) return;
    signingOutOn401 = true;
    try {
        const { signOut } = await import('next-auth/react');
        const path = callbackPath || window.location.pathname + window.location.search;
        const callbackUrl =
            path.startsWith('/auth')
                ? '/auth/login'
                : `/auth/login?callbackUrl=${encodeURIComponent(path)}`;
        await signOut({ callbackUrl });
    } catch {
        window.location.href = '/auth/login';
    } finally {
        // allow retry after a short delay in case signOut fails
        setTimeout(() => {
            signingOutOn401 = false;
        }, 3000);
    }
}

// Create axios instance with bearer token support
export const createAxiosInstance = (token?: string | null) => {
    const instance = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': API_URL,
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    // Request interceptor to add token
    instance.interceptors.request.use(
        (config) => {
            config.withCredentials = true;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // On 401 with a Bearer token: clear NextAuth session (not just hard-redirect).
    // Hard redirect alone leaves the cookie valid → middleware bounce loop.
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (token && error.response?.status === 401) {
                void handleUnauthorizedSession();
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

axios.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export async function httpClient({
    route,
    method = 'GET',
    body,
    headers,
    token,
}: {
    route: string;
    method?: string;
    body?: any;
    headers?: any;
    token?: string | null;
}): Promise<any> {
    const url = `${API_URL}${route}`;
    const axiosInstance = createAxiosInstance(token);

    try {
        if (method == 'POST') {
            const csrfToken = await getCsrfToken();
            headers = {
                ...headers,
                'X-XSRF-TOKEN': csrfToken,
            };
        }

        const response = await axiosInstance({
            method,
            url,
            data: body,
            params: method === 'GET' ? body : undefined,
            headers: {
                ...(body instanceof FormData
                    ? { 'Content-Type': 'multipart/form-data' }
                    : { 'Content-Type': 'application/json' }),
                'Access-Control-Allow-Origin': API_URL,
                ...headers,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error, 'CLIENT ERROR');
        if (axios.isAxiosError(error)) {
            if (error.response?.data?.message) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }
            throw new Error(`Failed to fetch from ${url}: ${error.message}`);
        }
        throw error;
    }
}

export async function getCsrfToken() {
    let URL = API_URL + '/sanctum/csrf-cookie';
    URL = URL.replace('/api/', '/');
    const response = await axios.get(URL);
    return response.data.csrf_token;
}
