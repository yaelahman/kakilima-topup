'use client';

import { useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';

/**
 * Clears NextAuth cookie when Sanctum token is expired/missing
 * so middleware and login page don't bounce in a loop.
 */
export function SessionExpiryGuard() {
  const { data: session, status } = useSession();
  const signingOut = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || signingOut.current) return;

    const expired =
      session?.error === 'AccessTokenExpired' ||
      (session && !session.accessToken);

    if (!expired) return;

    signingOut.current = true;
    const path = window.location.pathname + window.location.search;
    const callbackUrl = path.startsWith('/auth')
      ? '/auth/login'
      : `/auth/login?callbackUrl=${encodeURIComponent(path)}`;

    void signOut({ callbackUrl }).finally(() => {
      signingOut.current = false;
    });
  }, [session, status]);

  return null;
}
