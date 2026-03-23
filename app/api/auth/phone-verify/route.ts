import { NextRequest, NextResponse } from "next/server";

const verifyStore = new Map<string, { code: string; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const { phone, action, code } = await req.json();
    const cleaned = String(phone || "").replace(/[^0-9]/g, "");

    if (!/^01[016789]\d{7,8}$/.test(cleaned)) {
      return NextResponse.json({ error: "올바른 휴대폰 번호를 입력해주세요" }, { status: 400 });
    }

    if (action === "send") {
      const verifyCode = String(Math.floor(100000 + Math.random() * 900000));
      verifyStore.set(cleaned, { code: verifyCode, expires: Date.now() + 3 * 60 * 1000 });

      console.log(`\n📱 [픽스카 본인인증] ${cleaned} → 인증번호: ${verifyCode}\n`);

      /* SMS 서비스 연동 여부 확인 */
      const smsApiKey = process.env.NHN_SMS_APPKEY || process.env.COOLSMS_API_KEY;

      if (smsApiKey) {
        /* TODO: 실제 SMS 발송 (NHN Cloud / CoolSMS) */
        return NextResponse.json({ success: true, message: "인증번호가 발송되었습니다" });
      } else {
        /* 개발 모드: 인증번호를 응답에 포함 (테스트용) */
        return NextResponse.json({
          success: true,
          message: "인증번호가 발송되었습니다",
          devCode: verifyCode, /* ★ 프론트에서 표시 */
        });
      }
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
    return NextResponse.json({ error: "처리 실패" }, { status: 500 });
  }
}
