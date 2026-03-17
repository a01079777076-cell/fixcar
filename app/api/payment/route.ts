import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

// 포트원 V2 결제 준비
export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const token = request.cookies.get("fixcar-token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "로그인이 필요해요" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as number;

    const { type, carId, amount, orderName, payMethod } = await request.json();

    // 주문 ID 생성
    const orderId = `fixcar_${Date.now()}_${userId}`;

    // 결제 타입별 처리
    const paymentData = {
      storeId: process.env.PORTONE_STORE_ID!,
      channelKey: payMethod === "kakaopay"
        ? process.env.PORTONE_KAKAO_CHANNEL_KEY
        : process.env.PORTONE_TOSS_CHANNEL_KEY,
      orderId,
      orderName,
      amount: { total: amount, currency: "KRW" },
      customer: { id: String(userId) },
      type,
      carId: carId || null,
    };

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        storeId: process.env.PORTONE_STORE_ID,
        amount,
        orderName,
        channelKey: paymentData.channelKey,
      }
    });
  } catch (error) {
    console.error("Payment prepare error:", error);
    return NextResponse.json({ success: false, error: "결제 준비에 실패했어요" }, { status: 500 });
  }
}
