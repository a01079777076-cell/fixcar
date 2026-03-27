import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as crypto from "crypto";

function hashPw(pw: string) {
  return crypto.createHash("sha256").update(pw + "fixcar_salt_2025").digest("hex");
}

/* POST /api/admin/create-admin
   body: { secret: "FIXCAR_ADMIN_SECRET" }
   → admin1 계정 생성 (이미 있으면 스킵)
*/
export async function POST(req: NextRequest) {
  try {
    const { secret, username, password } = await req.json();

    /* 환경변수 또는 하드코딩 시크릿으로 보호 */
    const ADMIN_SECRET = process.env.ADMIN_INIT_SECRET || "FIXCAR_ADMIN_2025";
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: "시크릿이 올바르지 않습니다" }, { status: 403 });
    }

    const id   = username || "admin1";
    const pw   = password || "fixcar!Admin1";
    const email = `${id}@fixcar.local`;

    /* 이미 존재하면 스킵 */
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ success: true, message: "이미 존재하는 계정입니다", userId: exists.id });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name:     "관리자",
        password: hashPw(pw),
        provider: "fixcar",
        role:     "ADMIN",
        nickname: "픽스카 관리자",
        nicknameAdmin: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message:  `admin1 계정이 생성되었습니다`,
      userId:   user.id,
      username: id,
      password: pw,
    });
  } catch (e) {
    console.error("create-admin error:", e);
    return NextResponse.json({ error: "생성 실패", detail: String(e) }, { status: 500 });
  }
}
