import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// 간단한 인메모리 설정 (추후 DB 연동)
let SETTINGS = {
  siteName: "픽스카 FIXCAR",
  bannerText: "NEW AI 나에게 알맞는 완벽한 중고차 · 광주 1위 AI 추천차량 픽스카",
  commissionRate: "3",
  depositRate: "10",
  maxCarsPerDealer: "50",
  kakaoAlertEnabled: true,
  emailAlertEnabled: true,
  maintenanceMode: false,
  newSignupEnabled: true,
  notice: "",
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "권한 없음" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ success: false, error: "관리자만 접근" }, { status: 403 });
    return NextResponse.json({ success: true, data: SETTINGS });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "권한 없음" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ success: false, error: "관리자만 접근" }, { status: 403 });
    const body = await req.json();
    SETTINGS = { ...SETTINGS, ...body };
    return NextResponse.json({ success: true, data: SETTINGS });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
