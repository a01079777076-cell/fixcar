import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("fixcar-token")?.value;

    console.log("Session check - token exists:", !!token);

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "fixcar-secret-key-2025"
    );

    const { payload } = await jwtVerify(token, secret);

    console.log("Session valid - user:", payload.id);

    return NextResponse.json({
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch (err) {
    console.error("Session error:", err);
    return NextResponse.json({ user: null });
  }
}
