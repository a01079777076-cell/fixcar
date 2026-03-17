import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.fixcar.kr";
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=kakao`);
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/kakao/callback`;

    // 토큰 요청 파라미터
    const tokenParams: Record<string, string> = {
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_CLIENT_ID!,
      redirect_uri: redirectUri,
      code,
    };

    // client_secret이 있으면 추가
    if (process.env.KAKAO_CLIENT_SECRET && process.env.KAKAO_CLIENT_SECRET !== "dummy") {
      tokenParams.client_secret = process.env.KAKAO_CLIENT_SECRET;
    }

    // 1. 카카오 토큰 발급
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams(tokenParams).toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      const errMsg = tokenData.error_description || tokenData.error || "no_token";
      console.error("Token error:", tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(errMsg)}`);
    }

    // 2. 카카오 사용자 정보 조회
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const kakaoUser = await userRes.json();
    const kakaoId = kakaoUser.id;

    if (!kakaoId) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_user`);
    }

    const email = `kakao_${kakaoId}@fixcar.kr`;
    const name = kakaoUser.properties?.nickname ||
      kakaoUser.kakao_account?.profile?.nickname ||
      "카카오 사용자";

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
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // 6. 리다이렉트
    const redirectUrl = isNewUser ? `${baseUrl}/auth/additional-info` : `${baseUrl}/`;
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set({
      name: "fixcar-token",
      value: token,
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Kakao callback error:", errMsg);
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(errMsg)}`);
  }
}
