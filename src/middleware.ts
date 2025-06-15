
import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from './lib/auth';


const protectedRoutes = [
    'dashboard',
    'dashboard/admin',
]

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    const isProtectedRoute = protectedRoutes.some(route => pathname.includes(route));

    if(!isProtectedRoute) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = jwtVerify(token);
    if (!decoded) {
        return NextResponse.redirect(new URL('/login', request.url));  
    }

    return NextResponse.next();

}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard/admin/:path*"],
};

