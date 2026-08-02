import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a dashboard route
  if (pathname.startsWith("/dashboard")) {
    const authSession = request.cookies.get("auth_session");
    
    // If no cookie, redirect to login
    if (!authSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If user is trying to access login page but already has a session
  if (pathname.startsWith("/login")) {
    const authSession = request.cookies.get("auth_session");
    if (authSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If trying to access API, return 401 if unauthenticated
  if (pathname.startsWith("/api")) {
    const authSession = request.cookies.get("auth_session");
    console.log("[PROXY] API request to", pathname, "| authSession =", authSession?.value);
    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/api/:path*"],
};
