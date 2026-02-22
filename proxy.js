import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Skip static & internal
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  const publicPaths = ["/", "/signin", "/signup", "/auth/error"];
  const isPublic = publicPaths.includes(pathname);

  // Blocked or deleted
  if (token && (token.status === "blocked" || token.status === "deleted")) {
    return NextResponse.redirect(
      new URL(`/auth/error?error=${token.status}`, request.url)
    );
  }

  // Not logged in
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Logged in visiting auth pages
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(
      new URL(token.role === "admin" ? "/admin" : "/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};