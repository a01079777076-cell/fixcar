import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const voteStore = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const { carName } = await req.json();
    if (!carName) return NextResponse.json({ error: "carName 필요" }, { status: 400 });
    voteStore.set(carName, (voteStore.get(carName) || 0) + 1);
    return NextResponse.json({ success: true, votes: voteStore.get(carName) });
  } catch { return NextResponse.json({ error: "투표 실패" }, { status: 500 }); }
}
