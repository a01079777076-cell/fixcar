import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/kakao/callback`,
    response_type: "code",
  });

  return NextResponse.redirect(`${kakaoAuthUrl}?${params.toString()}`);
}
