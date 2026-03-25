import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* GET: 이벤트 목록 */
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: [{ active: "desc" }, { startDate: "desc" }],
    });
    return NextResponse.json(events);
  } catch (e) {
    console.error("Events GET error:", e);
    return NextResponse.json([]);
  }
}
