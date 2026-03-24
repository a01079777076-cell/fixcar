import { NextResponse } from "next/server";

const voteStore = new Map<string, number>();

/* GET: 투표 랭킹 */
export async function GET() {
  const rankings = [...voteStore.entries()]
    .map(([name, votes]) => ({ name, votes }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 20);
  return NextResponse.json(rankings);
}

/* POST: 투표 (vote API와 공유 store 위해 별도 export) */
export async function POST(req: Request) {
  try {
    const { carName } = await req.json();
    if (!carName) return NextResponse.json({ error: "carName 필요" }, { status: 400 });
    voteStore.set(carName, (voteStore.get(carName) || 0) + 1);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "실패" }, { status: 500 }); }
}
