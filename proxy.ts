import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  /* ═══ 보안 헤더 ═══ */
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  /* ═══ API 보호: 인증 없이 접근 불가 라우트 ═══ */
  const protectedApiPaths = ["/api/admin/", "/api/dealer/"];
  if (protectedApiPaths.some(p => pathname.startsWith(p))) {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }
  }

  /* ═══ 페이지 보호: 딜러/관리자 페이지 ═══ */
  const protectedPagePaths = ["/dealer", "/admin"];
  if (protectedPagePaths.some(p => pathname.startsWith(p) && !pathname.startsWith("/dealer/apply"))) {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  /* ═══ 봇/크롤러 차단 (API) ═══ */
  if (pathname.startsWith("/api/")) {
    const ua = req.headers.get("user-agent") || "";
    const blockedBots = ["scrapy", "python-requests/", "curl/", "wget/", "httrack"];
    if (blockedBots.some(bot => ua.toLowerCase().includes(bot))) {
      return NextResponse.json({ error: "접근 불가" }, { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*", "/dealer/:path*", "/admin/:path*"],
};
