import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.fixcar.kr";
  const kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize";
  
  const redirectUri = `${baseUrl}/api/auth/kakao/callback`;
  
  const params = new URLSearchParams({
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "profile_nickname",
  });

  console.log("Kakao login redirect_uri:", redirectUri);

  return NextResponse.redirect(`${kakaoAuthUrl}?${params.toString()}`);
}
