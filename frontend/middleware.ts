import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/user', '/cart', '/orders'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const refreshtoken = request.cookies.get('refreshtoken')?.value;

    if (!refreshtoken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user', '/cart', '/orders'],
};
