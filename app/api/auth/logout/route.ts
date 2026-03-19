import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  /* 모든 가능한 인증 쿠키 삭제 */
  const cookieNames = ["token", "auth-token", "session", "next-auth.session-token", "__Secure-next-auth.session-token"];

  cookieNames.forEach(name => {
    res.cookies.set(name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  });

  return res;
}

export async function GET() {
  return POST();
}
