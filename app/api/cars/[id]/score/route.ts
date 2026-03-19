import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const carId = parseInt(id);
    const carScores = await prisma.carScore.findMany({ where: { carId } });
    const cats = ["외관","실내","주행성능","연비","편의사양","가성비"];
    const data = cats.map(cat => {
      const catScores = carScores.filter(s=>s.category===cat);
      const avg = catScores.length > 0 ? +(catScores.reduce((s,c)=>s+c.score,0)/catScores.length).toFixed(1) : 0;
      return { category:cat, avg, count:catScores.length };
    });
    return NextResponse.json({ success:true, data });
  } catch { return NextResponse.json({ success:false, error:"조회 실패" }, { status:500 }); }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success:false, error:"로그인 필요" }, { status:401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success:false, error:"인증 실패" }, { status:401 });
    const { id } = await params;
    const carId = parseInt(id);
    const { scores } = await req.json();
    for (const [category, score] of Object.entries(scores)) {
      await prisma.carScore.upsert({
        where: { carId_userId_category:{ carId, userId:payload.id, category } },
        update: { score: score as number },
        create: { carId, userId:payload.id, category, score: score as number },
      });
    }
    return NextResponse.json({ success:true });
  } catch { return NextResponse.json({ success:false, error:"저장 실패" }, { status:500 }); }
}
