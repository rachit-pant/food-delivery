import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JwtPayload {
  id: number;
  role: number;
}

const roleRoutes = ['/merchant', 'subscription'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshtoken = request.cookies.get('refreshtoken')?.value;

  if (!refreshtoken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  let decoded: JwtPayload;
  try {
    const { payload } = await jwtVerify(
      refreshtoken,
      new TextEncoder().encode(process.env.REFRESH_SECRET_KEY!)
    );
    decoded = payload as unknown as JwtPayload;
  } catch (err) {
    console.error('JWT verify error:', err);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  if (roleRoutes.some((route) => pathname.startsWith(route))) {
    if (![2, 3].includes(decoded.role)) {
      return NextResponse.redirect(new URL('/user', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user/:path*',
    '/cart/:path*',
    '/orders/:path*',
    '/merchant/:path*',
    '/subscription/:path*',
  ],
};
