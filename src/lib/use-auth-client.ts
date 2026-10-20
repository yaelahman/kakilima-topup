'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { createAxiosInstance } from './client';

/**
 * Returns an axios instance with the current session's Bearer token.
 * Use in client components for authenticated API calls.
 */
export function useAuthClient() {
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? null;
  return useMemo(() => createAxiosInstance(token), [token]);
}

export { useSession, signOut } from 'next-auth/react';
