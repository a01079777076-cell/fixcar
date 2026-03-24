import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 내 문의 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json([]);
  try {
    const inqs = await prisma.inquiry.findMany({
      where: { userId: user.id },
      include: { car: { select: { name: true, brand: true, price: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inqs);
  } catch { return NextResponse.json([]); }
}

/* POST: 문의 작성 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const { carId, message } = await req.json();
    if (!carId || !message?.trim()) return NextResponse.json({ error: "차량과 메시지를 입력해주세요" }, { status: 400 });
    const inquiry = await prisma.inquiry.create({
      data: { userId: user.id, carId: Number(carId), message: String(message).slice(0, 2000) },
    });
    return NextResponse.json({ success: true, inquiry });
  } catch { return NextResponse.json({ error: "문의 실패" }, { status: 500 }); }
}
