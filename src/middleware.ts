import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/account', '/dashboard', '/profile'];
const adminPaths = ['/admin'];

function isAuthPage(pathname: string) {
  return pathname.startsWith('/auth') && !pathname.startsWith('/api');
}
function isProtected(pathname: string) {
  return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}
function isAdminPath(pathname: string) {
  return adminPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

/** Valid app session = NextAuth JWT with a non-expired Sanctum access token */
function hasValidAccess(token: Record<string, unknown> | null): boolean {
  if (!token?.accessToken) return false;
  const expiresAt = token.accessTokenExpiresAt as number | undefined;
  if (expiresAt && Date.now() >= expiresAt) return false;
  if (token.error === 'AccessTokenExpired') return false;
  return true;
}

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = secret
    ? await getToken({
        req: request,
        secret,
      })
    : null;
  const { pathname } = request.nextUrl;
  const authenticated = hasValidAccess(token as Record<string, unknown> | null);

  // Only redirect to login when we can actually verify (secret set) and session is invalid.
  if (isProtected(pathname) && !authenticated && secret) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow /auth/* when cookie exists but API token expired (so user can re-login)
  if (isAuthPage(pathname) && authenticated && secret) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdminPath(pathname)) {
    if (!authenticated && secret) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role = (token as { role?: string } | null)?.role;
    if (role !== 'superadmin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/dashboard/:path*', '/profile/:path*', '/auth/:path*', '/admin/:path*'],
};
