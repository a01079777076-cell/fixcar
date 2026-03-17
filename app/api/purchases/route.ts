import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/purchases?userId=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const where: Record<string, unknown> = {};
    if (userId) where.userId = parseInt(userId);

    const purchases = await prisma.purchase.findMany({
      where,
      include: {
        car: {
          include: {
            dealer: { select: { shopName: true } },
          },
        },
        user: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: purchases });
  } catch (error) {
    console.error("Purchases Error:", error);
    return NextResponse.json(
      { success: false, error: "구매 이력을 불러올 수 없어요" },
      { status: 500 }
    );
  }
}

// POST /api/purchases — 계약금 결제
export async function POST(request: NextRequest) {
  try {
    const { userId, carId, amount, payType } = await request.json();

    if (!userId || !carId || !amount) {
      return NextResponse.json(
        { success: false, error: "필수 항목이 누락됐어요" },
        { status: 400 }
      );
    }

    // 차량 상태를 예약중으로 변경
    await prisma.car.update({
      where: { id: parseInt(carId) },
      data: { status: "RESERVED" },
    });

    const purchase = await prisma.purchase.create({
      data: {
        userId: parseInt(userId),
        carId: parseInt(carId),
        amount: parseInt(amount),
        payType: payType || "installment",
        status: "DEPOSIT_PAID",
      },
    });

    return NextResponse.json({ success: true, data: purchase }, { status: 201 });
  } catch (error) {
    console.error("Purchase Create Error:", error);
    return NextResponse.json(
      { success: false, error: "구매 처리에 실패했어요" },
      { status: 500 }
    );
  }
}
