import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("fixcar-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "fixcar-secret"
    );
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
