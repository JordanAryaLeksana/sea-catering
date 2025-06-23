import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "./lib/auth";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard/user", "/dashboard/admin"];

const comingSoonRoutes = [
  "/menu/special",
  "/dashboard/user/deliverySchedule",
  "/dashboard/admin/deliverySchedule",
  "/dashboard/user/subscription",
  "/dashboard/admin/subscription",
  "/menu/packages",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";
  if (isComingSoon && comingSoonRoutes.includes(pathname)) {
    return NextResponse.rewrite(new URL("/comingSoon", request.url));
  }
  if (!isProtected) {
    return NextResponse.next();
  }

  // CSRF ORIGIN CHECK
  const allowedOrigin = process.env.NEXT_PUBLIC_BASE_URL;
  const origin = request.headers.get("origin");
  if (origin && origin !== allowedOrigin) {
    console.warn("Blocked CSRF attempt from origin:", origin);
    return NextResponse.json({ error: "CSRF detected" }, { status: 403 });
  }


  const token = request.cookies.get("token")?.value;
  if (token) {
    const user = jwtVerify(token);
    if (user) {
      return NextResponse.next();
    }
  }
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (session) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/dashboard/user/:path*", "/dashboard/admin/:path*", 
    "/menu/special", "/dashboard/user/deliverySchedule", 
    "/dashboard/admin/deliverySchedule", "/dashboard/user/subscription", 
    "/dashboard/admin/subscription", "/menu/packages"
  ],
};
