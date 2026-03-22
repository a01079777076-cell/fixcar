import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  /* fixcar-token 쿠키 삭제 */
  res.cookies.set("fixcar-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
