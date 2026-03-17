import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/favorites?userId=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId가 필요해요" },
        { status: 400 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: parseInt(userId) },
      include: {
        car: {
          include: {
            dealer: {
              select: { shopName: true, rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: favorites });
  } catch (error) {
    console.error("Favorites Error:", error);
    return NextResponse.json(
      { success: false, error: "찜 목록을 불러올 수 없어요" },
      { status: 500 }
    );
  }
}

// POST /api/favorites — 찜 추가/해제 토글
export async function POST(request: NextRequest) {
  try {
    const { userId, carId } = await request.json();

    if (!userId || !carId) {
      return NextResponse.json(
        { success: false, error: "userId, carId가 필요해요" },
        { status: 400 }
      );
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId: parseInt(userId),
          carId: parseInt(carId),
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, action: "removed" });
    } else {
      await prisma.favorite.create({
        data: {
          userId: parseInt(userId),
          carId: parseInt(carId),
        },
      });
      return NextResponse.json({ success: true, action: "added" });
    }
  } catch (error) {
    console.error("Favorite Toggle Error:", error);
    return NextResponse.json(
      { success: false, error: "찜 처리에 실패했어요" },
      { status: 500 }
    );
  }
}
