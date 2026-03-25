import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* GET: 공지사항 목록 */
export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(notices);
  } catch (e) {
    console.error("Notice GET error:", e);
    return NextResponse.json([]);
  }
}
