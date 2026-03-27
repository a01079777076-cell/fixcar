import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as crypto from "crypto";

/* 임시 리셋 토큰 (10분 유효) */
const resetTokens = new Map<string, { userId: number; expires: number }>();

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

/* POST /api/auth/find-pw
   body: { action: "verify", name, birthdate, phone, username }
         { action: "reset",  token, newPassword }
*/
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    /* ── 본인 확인 ── */
    if (action === "verify") {
      const { name, birthdate, phone: rawPhone, username } = body;
      const phone = String(rawPhone || "").replace(/[^0-9]/g, "");

      if (!name?.trim() || !birthdate?.trim() || !phone || !username?.trim()) {
        return NextResponse.json({ error: "모든 항목을 입력해주세요" }, { status: 400 });
      }

      const email = `${username.trim()}@fixcar.local`;
      const user = await prisma.user.findFirst({
        where: {
          email,
          phone,
          provider: { not: "kakao" },
        },
        select: { id: true, name: true, birthdate: true },
      });

      if (!user) {
        return NextResponse.json({ error: "입력하신 정보와 일치하는 계정이 없습니다" }, { status: 404 });
      }

      /* 이름·생년월일 추가 검증 (DB에 저장된 경우만) */
      if (user.name && user.name !== name.trim()) {
        return NextResponse.json({ error: "입력하신 정보와 일치하는 계정이 없습니다" }, { status: 404 });
      }
      if (user.birthdate && user.birthdate !== birthdate.trim()) {
        return NextResponse.json({ error: "입력하신 정보와 일치하는 계정이 없습니다" }, { status: 404 });
      }

      /* 리셋 토큰 발급 (10분) */
      const token = generateToken();
      resetTokens.set(token, { userId: user.id, expires: Date.now() + 10 * 60 * 1000 });

      return NextResponse.json({ success: true, resetToken: token });
    }

    /* ── 비밀번호 재설정 ── */
    if (action === "reset") {
      const { token, newPassword } = body;
      if (!token || !newPassword) {
        return NextResponse.json({ error: "토큰과 새 비밀번호를 입력해주세요" }, { status: 400 });
      }
      if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        return NextResponse.json({ error: "비밀번호는 영문+숫자 조합 8자 이상이어야 합니다" }, { status: 400 });
      }

      const entry = resetTokens.get(token);
      if (!entry || entry.expires < Date.now()) {
        resetTokens.delete(token);
        return NextResponse.json({ error: "토큰이 만료되었습니다. 다시 인증해주세요" }, { status: 400 });
      }

      const hashed = crypto.createHash("sha256").update(newPassword + "fixcar_salt_2025").digest("hex");
      await prisma.user.update({
        where: { id: entry.userId },
        data:  { password: hashed },
      });

      resetTokens.delete(token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  } catch (e) {
    console.error("find-pw error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
