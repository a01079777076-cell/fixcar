// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/dealer/apply/route.ts
// 📂 폴더 새로 생성 필요: app/api/dealer/apply/
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* POST /api/dealer/apply — 딜러 입점 신청 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      /* 개인 정보 */
      name, phone, birthdate,
      /* 상사 정보 */
      associationName, complexName, shopName, shopPhone, shopAddr,
      businessNumber, licenseNumber,
      /* 약관 동의 */
      agreeTerms, agreePrivacy, agreeClean, agreeMarketing, agreeNonMember,
    } = body;

    /* 필수값 검증 */
    if (!name || !phone || !shopName || !businessNumber || !licenseNumber) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요" }, { status: 400 });
    }
    if (!agreeTerms || !agreePrivacy || !agreeClean) {
      return NextResponse.json({ error: "필수 약관에 동의해주세요" }, { status: 400 });
    }

    /* 로그인 유저면 계정 연결, 비로그인이면 이름+전화로 유저 찾기 */
    const authUser = verifyToken(req);
    let userId: number | null = authUser?.id || null;

    if (!userId) {
      const cleanPhone = String(phone).replace(/[^0-9]/g, "");
      const existingUser = await prisma.user.findFirst({
        where: { phone: cleanPhone },
        select: { id: true },
      });
      userId = existingUser?.id || null;
    }

    /* DealerApplication 테이블이 없으므로 shopDesc에 직렬화 저장
       (추후 DealerApplication 모델 추가 시 교체) */
    const applicationData = JSON.stringify({
      status: "PENDING",
      applicantName: name,
      phone: String(phone).replace(/[^0-9]/g, ""),
      birthdate,
      associationName,
      complexName,
      shopName,
      shopPhone: String(shopPhone || "").replace(/[^0-9]/g, ""),
      shopAddr,
      businessNumber: String(businessNumber).replace(/[^0-9]/g, ""),
      licenseNumber,
      agreeMarketing: !!agreeMarketing,
      agreeNonMember: !!agreeNonMember,
      appliedAt: new Date().toISOString(),
    });

    /* 이미 Dealer 레코드가 있으면 업데이트, 없으면 PENDING 상태로 생성 */
    if (userId) {
      const existingDealer = await prisma.dealer.findUnique({ where: { userId } });
      if (existingDealer) {
        /* 이미 신청됨 → shopDesc에 신청 데이터 업데이트 */
        await prisma.dealer.update({
          where: { userId },
          data: {
            shopName,
            shopPhone: String(shopPhone || "").replace(/[^0-9]/g, ""),
            shopAddr: `${complexName} ${shopAddr}`,
            complexName,
            shopDesc: applicationData,
            verified: false,
          },
        });
      } else {
        await prisma.dealer.create({
          data: {
            userId,
            shopName,
            shopPhone: String(shopPhone || "").replace(/[^0-9]/g, ""),
            shopAddr: `${complexName} ${shopAddr}`,
            complexName,
            shopDesc: applicationData,
            verified: false,
          },
        });
      }

      /* 유저 role을 PENDING 용도로 그냥 USER 유지 (관리자 승인 후 DEALER로 변경) */
    }

    /* 관리자 알림용 Notice 생성 (간단 알림) */
    await prisma.notice.create({
      data: {
        title: `[딜러신청] ${shopName} - ${name} (${String(phone).replace(/[^0-9]/g,"").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")})`,
        content: applicationData,
        pinned: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("dealer/apply error:", e);
    return NextResponse.json({ error: "신청 실패", detail: String(e) }, { status: 500 });
  }
}

/* GET /api/dealer/apply — 관리자용 신청 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }
  try {
    /* shopDesc에 PENDING 포함된 딜러 목록 반환 */
    const dealers = await prisma.dealer.findMany({
      where: { verified: false, shopDesc: { contains: "PENDING" } },
      include: { User: { select: { name: true, email: true, phone: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: dealers });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
