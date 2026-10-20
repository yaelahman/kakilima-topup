'use client';

import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { Suspense, useRef } from 'react';
import { store } from '@/lib/store';
import { useNProgress, injectNProgressStyles } from '@/lib/nprogress';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionExpiryGuard } from '@/components/utils/SessionExpiryGuard';

// Separate component for NProgress to wrap in Suspense
function NProgressWrapper() {
    useNProgress();
    return null;
}

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    // Initialize NProgress styles
    if (typeof window !== 'undefined') {
        injectNProgressStyles();
    }
    const queryClientRef = useRef<QueryClient | null>(null)
    if (!queryClientRef.current) {
        queryClientRef.current = new QueryClient()
    }

    return (
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
            <SessionExpiryGuard />
            <Provider store={store}>
                <QueryClientProvider client={queryClientRef.current}>
                    <Suspense fallback={null}>
                        <NProgressWrapper />
                    </Suspense>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#4ade80',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 5000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </QueryClientProvider>
            </Provider>
        </SessionProvider>
    );
} 