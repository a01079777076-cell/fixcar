import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    process.env.NEXTAUTH_URL || "https://fixcar.kr"
  );
  response.cookies.delete("fixcar-token");
  return response;
}
