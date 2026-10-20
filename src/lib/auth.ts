import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
/** Refresh session cookie at most once per day; absolute lifetime still maxAge */
const DEFAULT_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** Clear a bit early so UI logs out before API rejects */
const EXPIRY_SKEW_MS = 60 * 1000;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !API_URL) {
          return null;
        }
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json?.success || !json?.data?.access_token) {
          throw new Error(json?.message ?? 'Login failed');
        }
        return {
          id: String(json.data.user?.id),
          name: json.data.user?.name ?? undefined,
          email: json.data.user?.email ?? credentials.email,
          role: json.data.user?.role ?? undefined,
          accessToken: json.data.access_token,
          expiresIn: json.data.expires_in ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          accessToken?: string;
          expiresIn?: number;
          id?: string;
          role?: string;
        };
        token.accessToken = u.accessToken;
        token.expiresIn = u.expiresIn;
        token.accessTokenExpiresAt = u.expiresIn
          ? Date.now() + u.expiresIn * 1000
          : Date.now() + DEFAULT_TOKEN_TTL_MS;
        token.id = u.id ?? user.id;
        token.role = u.role;
        delete token.error;
        return token;
      }

      const expiresAt = token.accessTokenExpiresAt as number | undefined;
      if (token.accessToken && expiresAt && Date.now() < expiresAt - EXPIRY_SKEW_MS) {
        return token;
      }

      // Sanctum Bearer expired (or never set) — drop API credentials so middleware/client treat as logged out
      if (token.accessToken) {
        return {
          ...token,
          accessToken: undefined,
          error: 'AccessTokenExpired',
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === 'AccessTokenExpired' || !token.accessToken) {
        (session as { error?: string }).error = (token.error as string) || 'AccessTokenExpired';
        (session as { accessToken?: string }).accessToken = undefined;
        return session;
      }

      if (session.user) {
        (session as { user: { id?: string; role?: string } }).user.id = token.id as string;
        (session as { user: { id?: string; role?: string } }).user.role = token.role as string;
        (session as { accessToken?: string }).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days, align with Sanctum
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

/** Use in Server Components / API routes to get session and access token */
export async function getServerSession() {
  const { getServerSession: getSession } = await import('next-auth');
  return getSession({ ...authOptions });
}
