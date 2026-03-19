import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const res = NextResponse.json({ success: true, loggedOut: true });
  const cookieStore = await cookies();

  /* ★ fixcar-token 포함 모든 인증 쿠키 삭제 */
  const knownAuthCookies = [
    "fixcar-token", "token", "auth-token", "session",
    "next-auth.session-token", "__Secure-next-auth.session-token",
  ];

  knownAuthCookies.forEach(name => {
    res.cookies.set(name, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0, expires: new Date(0) });
    res.cookies.set(name, "", { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 0, expires: new Date(0) });
    /* httpOnly: false 버전도 (fixcar-token은 httpOnly:false로 설정됨) */
    res.cookies.set(name, "", { httpOnly: false, secure: true, sameSite: "lax", path: "/", maxAge: 0, expires: new Date(0) });
    res.cookies.set(name, "", { httpOnly: false, secure: false, sameSite: "lax", path: "/", maxAge: 0, expires: new Date(0) });
  });

  /* 실제 존재하는 쿠키도 삭제 */
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    if (cookie.name.includes("token") || cookie.name.includes("session") || cookie.name.includes("auth") || cookie.name.includes("fixcar")) {
      res.cookies.set(cookie.name, "", { httpOnly: false, secure: true, sameSite: "lax", path: "/", maxAge: 0, expires: new Date(0) });
    }
  });

  return res;
}

export async function GET() { return POST(); }
