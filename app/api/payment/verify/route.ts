import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// 포트원 V2 결제 검증
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("fixcar-token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "로그인이 필요해요" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    await jwtVerify(token, secret);

    const { paymentId, orderId, amount } = await request.json();

    // 포트원 V2 결제 조회
    const verifyRes = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      headers: {
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    const payment = await verifyRes.json();

    // 결제 금액 검증
    if (payment.amount?.total !== amount) {
      return NextResponse.json({ success: false, error: "결제 금액이 일치하지 않아요" }, { status: 400 });
    }

    // 결제 상태 확인
    if (payment.status !== "PAID") {
      return NextResponse.json({ success: false, error: "결제가 완료되지 않았어요" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentId,
        orderId,
        amount: payment.amount?.total,
        status: payment.status,
        method: payment.method?.type,
        paidAt: payment.paidAt,
      }
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ success: false, error: "결제 검증에 실패했어요" }, { status: 500 });
  }
}
