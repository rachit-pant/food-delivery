import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JwtPayload {
  id: number;
  role: number;
}

const roleRoutes = ['/merchant', '/subscription'];
const staffRoutes = ['/staff'];
const deliveryRoutes = ['/delivery'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/cart/success' || pathname === '/cart/failure') {
    return NextResponse.next();
  }

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

  let decodedStaff: JwtPayload | undefined;

  if (decoded.role === 4) {
    const staffToken = request.cookies.get('staffToken')?.value;

    if (staffToken) {
      try {
        const { payload } = await jwtVerify(
          staffToken,
          new TextEncoder().encode(process.env.REFRESH_SECRET_KEY!)
        );
        decodedStaff = payload as unknown as JwtPayload;
      } catch (err) {
        console.error('Invalid staff token:', err);
      }
    }
  }
  console.log('decoded', decoded, 'decodedStaff', decodedStaff);
  if (roleRoutes.some((route) => pathname.startsWith(route))) {
    const isMerchantIdRoute = /^\/merchant\/\d+$/.test(pathname);
    if (![1, 2, 3].includes(decoded.role)) {
      if (
        !(decoded.role === 4 && decodedStaff?.id === 1 && isMerchantIdRoute)
      ) {
        return NextResponse.redirect(new URL('/user', request.url));
      }
    }
  }

  if (staffRoutes.some((route) => pathname.startsWith(route))) {
    if (![4].includes(decoded.role)) {
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
    '/staff/:path*',
    '/delivery/:path*',
  ],
};
