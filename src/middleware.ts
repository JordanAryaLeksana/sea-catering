import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from './lib/auth';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['dashboard', 'dashboard/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.includes(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Cek JWT custom dari cookie 'token'
  const token = request.cookies.get('token')?.value;
  if (token) {
    const decoded = jwtVerify(token);
    if (decoded) {
      return NextResponse.next();
    }
  }

  // Jika bukan JWT, cek NextAuth session token
  const nextAuthToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (nextAuthToken) {
    return NextResponse.next();
  }


  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard/admin/:path*'],
};
