import { NextResponse } from "next/server";
import { verifyToken } from "./lib/utils";

export async function middleware(req) {
  console.log({ req });
  // Check the token
  const token = req ? req.cookies.get("token") : null;
  const userId = await verifyToken(token);
  // If token is valid || if page is /login
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/login") ||
    userId ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }

  // if no token
  // redirect to login page
  if ((!token || !userId) && !pathname.includes("/login")) {
    console.log("Redirected");
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }
}
