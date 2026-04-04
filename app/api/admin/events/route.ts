// 📁 저장 경로: app/api/admin/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function isAdmin(req: NextRequest) {
  const user = verifyToken(req);
  return user?.role === "ADMIN" ? user : null;
}

/* POST: 이벤트 생성 */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const { title, content, image, startDate, endDate } = await req.json();
    if (!title || !content || !startDate || !endDate) return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    const event = await prisma.event.create({
      data: { title, content, image: image || null, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    return NextResponse.json({ success: true, data: event });
  } catch (e) {
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}

/* PUT: 이벤트 수정 */
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const { id, title, content, image, startDate, endDate, active } = await req.json();
    if (!id) return NextResponse.json({ error: "id 필수" }, { status: 400 });
    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }), ...(content && { content }), ...(image !== undefined && { image }),
        ...(startDate && { startDate: new Date(startDate) }), ...(endDate && { endDate: new Date(endDate) }),
        ...(active !== undefined && { active }),
      },
    });
    return NextResponse.json({ success: true, data: event });
  } catch (e) {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

/* DELETE: 이벤트 삭제 */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const { id } = await req.json();
    await prisma.event.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
