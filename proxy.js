import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // 1. Define Public Paths exactly to avoid "/" matching everything
  const publicPaths = ["/signin", "/signup", "/auth/error"];
  const isPublicPath = publicPaths.some((path) => pathname === path);
  const isHomePage = pathname === "/";

  // 2. Blocked / deleted users
  if (token && ["blocked", "deleted"].includes(token.status)) {
    return NextResponse.redirect(new URL(`/auth/error?error=${token.status}`, request.url));
  }

  // 3. Not logged in: Redirect to signin if not on a public path or home
  if (!token && !isPublicPath && !isHomePage) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 4. Logged in user: Handling specific roles
  if (token) {
    const isAdmin = token.role === "admin";

    // Prevent logged-in users from hitting auth pages
    if (isPublicPath) {
      return NextResponse.redirect(new URL(isAdmin ? "/admin/dashboard" : "/dashboard", request.url));
    }

    // Protect Admin routes
    if (pathname.startsWith("/admin/dashboard") && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Redirect Admin away from general dashboard if you want them strictly in /admin
    if (pathname === "/dashboard" && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};