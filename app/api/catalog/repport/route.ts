import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.carModel || !body.wrongInfo || !body.correctInfo) {
      return NextResponse.json({ error: "모든 항목을 입력해주세요" }, { status: 400 });
    }

    /* 스키마: userId(Int), carModel, wrongInfo(@db.Text), correctInfo(@db.Text), status */
    const report = await prisma.catalogReport.create({
      data: {
        userId: user.id,
        carModel: String(body.carModel),
        wrongInfo: String(body.wrongInfo),
        correctInfo: String(body.correctInfo),
        status: "PENDING",
      },
    });
    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (e) {
    console.error("CatalogReport POST:", e);
    return NextResponse.json({ error: "신고 실패" }, { status: 500 });
  }
}
