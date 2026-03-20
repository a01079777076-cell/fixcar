import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.fixcar.kr";
  const redirectUri = `${baseUrl}/api/auth/kakao/callback`;

  if (!clientId) {
    return NextResponse.redirect(`${baseUrl}/login?error=kakao_not_configured`);
  }

  const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

  return NextResponse.redirect(kakaoUrl);
}
