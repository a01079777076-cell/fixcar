import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/inquiries — 문의 목록
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const carId = searchParams.get("carId");
    const dealerId = searchParams.get("dealerId");

    const where: Record<string, unknown> = {};
    if (userId) where.userId = parseInt(userId);
    if (carId) where.carId = parseInt(carId);
    if (dealerId) {
      where.car = { dealerId: parseInt(dealerId) };
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        user: { select: { name: true, phone: true } },
        car: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    console.error("Inquiries Error:", error);
    return NextResponse.json(
      { success: false, error: "문의 목록을 불러올 수 없어요" },
      { status: 500 }
    );
  }
}

// POST /api/inquiries — 문의 등록
export async function POST(request: NextRequest) {
  try {
    const { userId, carId, message } = await request.json();

    if (!userId || !carId || !message) {
      return NextResponse.json(
        { success: false, error: "필수 항목이 누락됐어요" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        userId: parseInt(userId),
        carId: parseInt(carId),
        message,
      },
    });

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error("Inquiry Create Error:", error);
    return NextResponse.json(
      { success: false, error: "문의 등록에 실패했어요" },
      { status: 500 }
    );
  }
}
