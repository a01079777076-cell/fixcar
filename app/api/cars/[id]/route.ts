import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cars/[id] — 차량 상세
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) },
      include: {
        dealer: {
          select: {
            shopName: true,
            rating: true,
            dealCount: true,
            verified: true,
          },
        },
        _count: {
          select: { favorites: true, inquiries: true },
        },
      },
    });

    if (!car) {
      return NextResponse.json(
        { success: false, error: "차량을 찾을 수 없어요" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: car });
  } catch (error) {
    console.error("Car Detail Error:", error);
    return NextResponse.json(
      { success: false, error: "차량 정보를 불러올 수 없어요" },
      { status: 500 }
    );
  }
}

// PATCH /api/cars/[id] — 차량 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const car = await prisma.car.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json({ success: true, data: car });
  } catch (error) {
    console.error("Car Update Error:", error);
    return NextResponse.json(
      { success: false, error: "차량 수정에 실패했어요" },
      { status: 500 }
    );
  }
}

// DELETE /api/cars/[id] — 차량 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.car.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: "삭제됐어요" });
  } catch (error) {
    console.error("Car Delete Error:", error);
    return NextResponse.json(
      { success: false, error: "차량 삭제에 실패했어요" },
      { status: 500 }
    );
  }
}
