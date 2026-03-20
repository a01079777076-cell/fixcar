import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    const carId = Number(body.carId);
    if (!carId || !body.amount) {
      return NextResponse.json({ error: "차량 ID와 금액이 필요합니다" }, { status: 400 });
    }

    /* 스키마: userId, carId, amount, payType, status(PurchaseStatus), depositDate */
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        carId,
        amount: Number(body.amount),
        payType: body.payType || "installment",
        status: "DEPOSIT_PAID",
      },
    });
    return NextResponse.json({ success: true, purchase }, { status: 201 });
  } catch (e) {
    console.error("Purchase POST:", e);
    return NextResponse.json({ error: "결제 기록 실패" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json([]);

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id },
      include: { car: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(purchases);
  } catch {
    return NextResponse.json([]);
  }
}
