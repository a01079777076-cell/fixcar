// app/api/auth/naver/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) return NextResponse.redirect(new URL("/login?error=naver", req.url));

    // 네이버 토큰 발급
    const tokenRes = await fetch("https://nid.naver.com/oauth2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NAVER_CLIENT_ID || "",
        client_secret: process.env.NAVER_CLIENT_SECRET || "",
        code,
        state: state || "",
      }),
    });
    const tokenData = await tokenRes.json();

    // 네이버 사용자 정보 조회
    const profileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileRes.json();
    const profile = profileData.response;

    const email = `naver_${profile.id}`;
    const name = profile.name || profile.nickname || "네이버 사용자";

    // 사용자 조회 또는 생성
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, provider: "naver", phone: profile.mobile },
      });
    }

    // JWT 발급
    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.set("fixcar-token", token, {
      httpOnly: true, secure: true, sameSite: "lax", maxAge: 60*60*24*30,
    });
    return response;
  } catch (e) {
    console.error("네이버 로그인 오류:", e);
    return NextResponse.redirect(new URL("/login?error=naver", req.url));
  }
}
