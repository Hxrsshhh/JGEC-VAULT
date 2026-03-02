import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  const publicPaths = ["/", "/signin", "/signup", "/auth/error"];
  const isPublic = publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Blocked / deleted users
  if (token && ["blocked", "deleted"].includes(token.status)) {
    return NextResponse.redirect(
      new URL(`/auth/error?error=${token.status}`, request.url)
    );
  }

  // Not logged in
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Logged in user visiting auth pages
  if (token && ["/signin", "/signup"].includes(pathname)) {
    return NextResponse.redirect(
      new URL(
        token.role === "admin" ? "/admin" : "/dashboard",
        request.url
      )
    );
  }

  return NextResponse.next();
}
