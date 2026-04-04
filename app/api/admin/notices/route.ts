// 📁 저장 경로: app/api/admin/notices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function isAdmin(req: NextRequest) {
  const user = verifyToken(req);
  return user?.role === "ADMIN" ? user : null;
}

/* POST: 공지 생성 */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const { title, content, pinned } = await req.json();
    if (!title || !content) return NextResponse.json({ error: "제목/내용 필수" }, { status: 400 });
    const notice = await prisma.notice.create({ data: { title, content, pinned: pinned || false } });
    return NextResponse.json({ success: true, data: notice });
  } catch (e) {
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}

/* PUT: 공지 수정 */
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const { id, title, content, pinned } = await req.json();
    if (!id) return NextResponse.json({ error: "id 필수" }, { status: 400 });
    const notice = await prisma.notice.update({
      where: { id: Number(id) },
      data: { ...(title && { title }), ...(content && { content }), ...(pinned !== undefined && { pinned }) },
    });
    return NextResponse.json({ success: true, data: notice });
  } catch (e) {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

/* DELETE: 공지 삭제 */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const { id } = await req.json();
    await prisma.notice.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
