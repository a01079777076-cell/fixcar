import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json([], { status: 403 });
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        car: { select: { name: true, brand: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch { return NextResponse.json([]); }
}

export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const { inquiryId, reply } = await req.json();
    await prisma.inquiry.update({ where: { id: Number(inquiryId) }, data: { reply, status: "REPLIED" } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "실패" }, { status: 500 }); }
}
