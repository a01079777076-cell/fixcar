import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as crypto from "crypto";

function hashPw(password: string): string {
  return crypto.createHash("sha256").update(password + "fixcar_salt_2025").digest("hex");
}

/* admin 관련 차단 키워드 */
const BLOCKED_IDS = [
  "admin", "administrator", "fixcar", "fixcar_admin",
  "root", "superuser", "system", "moderator", "manager",
];

export async function POST(req: NextRequest) {
  try {
    const { username, password, name, birthdate, phone } = await req.json();

    /* 유효성 검사 */
    if (!username || !password || !name || !birthdate) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요" }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_]{6,20}$/.test(username)) {
      return NextResponse.json({ error: "아이디는 영문/숫자/밑줄 6~20자" }, { status: 400 });
    }
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json({ error: "비밀번호는 영문+숫자 조합 8자 이상" }, { status: 400 });
    }

    /* admin 키워드 차단 */
    const lowerUser = username.toLowerCase();
    if (BLOCKED_IDS.some((b) => lowerUser.includes(b))) {
      return NextResponse.json({ error: "사용할 수 없는 아이디입니다" }, { status: 400 });
    }

    /* 생년월일 형식 검사 (YYYYMMDD 또는 YYYY-MM-DD) */
    const bdClean = birthdate.replace(/-/g, "");
    if (!/^\d{8}$/.test(bdClean)) {
      return NextResponse.json({ error: "생년월일 형식이 올바르지 않습니다 (예: 19960101)" }, { status: 400 });
    }

    /* 중복 체크 */
    const email = `${username}@fixcar.local`;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "이미 사용 중인 아이디입니다" }, { status: 409 });

    /* 생성 */
    const user = await prisma.user.create({
      data: {
        email,
        name:      String(name).slice(0, 50),
        birthdate: bdClean,
        phone:     phone ? String(phone).replace(/[^0-9]/g, "") : null,
        password:  hashPw(password),
        provider:  "fixcar",
        role:      "USER",
      },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "가입 실패", detail: String(e) }, { status: 500 });
  }
}
