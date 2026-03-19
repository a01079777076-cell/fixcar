import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인이 필요해요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const { carId, amount, payType, paymentId } = await req.json();

    // 차량 예약 상태로 변경
    await prisma.car.update({
      where: { id: carId },
      data: { status: "RESERVED" },
    });

    // 구매 레코드 생성
    const purchase = await prisma.purchase.create({
      data: {
        userId: payload.id,
        carId,
        amount,
        payType: payType || "card",
        status: "DEPOSIT_PAID",
      },
    });

    return NextResponse.json({ success: true, data: purchase });
  } catch {
    return NextResponse.json({ success: false, error: "결제 처리 실패" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const purchases = await prisma.purchase.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: "desc" },
      include: { car: { select: { name:true, price:true, images:true } } },
    });

    return NextResponse.json({ success: true, data: purchases });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}
