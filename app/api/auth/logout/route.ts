import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const res = NextResponse.json({ success: true, loggedOut: true });
  const cookieStore = await cookies();

  /* 존재하는 모든 쿠키 이름 수집 */
  const allCookies = cookieStore.getAll();
  const knownAuthCookies = [
    "token", "auth-token", "session",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Secure-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  /* 알려진 인증 쿠키 삭제 */
  knownAuthCookies.forEach(name => {
    res.cookies.set(name, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
    /* secure: false 버전도 삭제 (개발환경 대응) */
    res.cookies.set(name, "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  });

  /* 실제 존재하는 쿠키 중 인증 관련 추가 삭제 */
  allCookies.forEach(cookie => {
    if (
      cookie.name.includes("token") ||
      cookie.name.includes("session") ||
      cookie.name.includes("auth")
    ) {
      res.cookies.set(cookie.name, "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
      res.cookies.set(cookie.name, "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
    }
  });

  return res;
}

/* GET도 지원 (브라우저 직접 접근 시) */
export async function GET() {
  return POST();
}
