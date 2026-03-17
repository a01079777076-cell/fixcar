import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=kakao`);
  }

  try {
    // 1. 카카오 토큰 발급
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/kakao/callback`,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=token`);
    }

    // 2. 카카오 사용자 정보 조회
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const kakaoUser = await userRes.json();
    const kakaoId = kakaoUser.id;
    const email = `kakao_${kakaoId}@fixcar.kr`;
    const name = kakaoUser.properties?.nickname || "카카오 사용자";

    // 3. 기존 유저 확인
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const isNewUser = !existingUser || !existingUser.phone;

    // 4. DB 저장
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name, provider: "kakao" },
    });

    // 5. JWT 토큰 생성
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "fixcar-secret"
    );
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // 6. 쿠키 저장
    // 신규 유저 → 추가 정보 입력 페이지
    // 기존 유저 → 홈
    const redirectUrl = isNewUser
      ? `${process.env.NEXTAUTH_URL}/auth/additional-info`
      : `${process.env.NEXTAUTH_URL}/`;

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("fixcar-token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      domain: ".fixcar.kr",
      });

    return response;
  } catch (error) {
    console.error("Kakao callback error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=server`);
  }
}
