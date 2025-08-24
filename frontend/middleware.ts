import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
interface JwtPayload {
  id: string;
  role: string;
}
const protectedRoutes = ['/user', '/cart', '/orders'];
const roleRoutes = ['/user/restaurant'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshtoken = request.cookies.get('refreshtoken')?.value as string;
  let decoded: JwtPayload;
  try {
    const { payload } = await jwtVerify(
      refreshtoken,
      new TextEncoder().encode(process.env.REFRESH_SECRET_KEY)
    );
    decoded = payload as unknown as JwtPayload;
  } catch (err) {
    console.log(err);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!refreshtoken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (roleRoutes.some((route) => pathname.startsWith(route))) {
      if (decoded.role === 'customer') {
        return NextResponse.redirect(new URL('/user', request.url));
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user', '/cart', '/orders', '/user/restaurant'],
};
