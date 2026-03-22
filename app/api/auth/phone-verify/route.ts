import { NextRequest, NextResponse } from "next/server";

/**
 * 휴대폰 본인인증 API
 * 
 * 개발 모드: 인증번호를 콘솔에 출력 (실제 SMS 미발송)
 * 운영 모드: CoolSMS / NHN Cloud 등 SMS API 연동 필요
 */

/* 메모리 저장소 (서버 재시작 시 초기화 — 운영 시 Redis 사용 권장) */
const verifyStore = new Map<string, { code: string; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const { phone, action, code } = await req.json();
    const cleaned = String(phone || "").replace(/[^0-9]/g, "");

    if (!/^01[016789]\d{7,8}$/.test(cleaned)) {
      return NextResponse.json({ error: "올바른 휴대폰 번호를 입력해주세요" }, { status: 400 });
    }

    if (action === "send") {
      /* 인증번호 생성 (6자리) */
      const verifyCode = String(Math.floor(100000 + Math.random() * 900000));
      verifyStore.set(cleaned, { code: verifyCode, expires: Date.now() + 3 * 60 * 1000 /* 3분 */ });

      /* ★ 개발 모드: 콘솔 출력 (운영 시 SMS API로 교체) */
      console.log(`\n📱 [픽스카 본인인증] ${cleaned} → 인증번호: ${verifyCode}\n`);

      /* TODO: 운영 모드 SMS 발송 예시
       * await fetch("https://api.coolsms.co.kr/messages/v4/send", {
       *   method: "POST",
       *   headers: { "Content-Type": "application/json", "Authorization": `HMAC-SHA256 ...` },
       *   body: JSON.stringify({ message: { to: cleaned, from: "발신번호", text: `[픽스카] 인증번호: ${verifyCode}` } }),
       * });
       */

      return NextResponse.json({ success: true, message: "인증번호가 발송되었습니다" });
    }

    if (action === "verify") {
      const stored = verifyStore.get(cleaned);
      if (!stored) return NextResponse.json({ verified: false, error: "인증번호를 먼저 발송해주세요" });
      if (Date.now() > stored.expires) {
        verifyStore.delete(cleaned);
        return NextResponse.json({ verified: false, error: "인증번호가 만료됐어요. 다시 발송해주세요" });
      }
      if (stored.code !== String(code)) {
        return NextResponse.json({ verified: false, error: "인증번호가 일치하지 않습니다" });
      }
      verifyStore.delete(cleaned);
      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "처리 실패", detail: String(e) }, { status: 500 });
  }
}
