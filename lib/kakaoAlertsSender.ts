import { prisma } from "@/lib/prisma";

interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  fuel: string;
  mileage: number;
}

// 카카오 알림톡 발송 (카카오 비즈니스 API 필요)
async function sendKakaoMessage(kakaoId: string, car: Car) {
  try {
    // 카카오 알림톡 API 연동
    // 실제 운영 시 카카오 비즈니스 채널 등록 후 아래 API 사용
    const KAKAO_CHANNEL_KEY = process.env.KAKAO_CHANNEL_KEY;
    const KAKAO_ACCESS_TOKEN = process.env.KAKAO_ACCESS_TOKEN;

    if (!KAKAO_CHANNEL_KEY || !KAKAO_ACCESS_TOKEN) {
      console.log("[알림] 카카오 API 키 미설정 - 로그만 출력");
      console.log(`[알림] 새 매물: ${car.name} ${car.price}만원 → 사용자: ${kakaoId}`);
      return true;
    }

    // 카카오 메시지 API 호출
    const response = await fetch("https://kapi.kakao.com/v1/api/talk/friends/message/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KAKAO_ACCESS_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        receiver_uuids: JSON.stringify([kakaoId]),
        template_object: JSON.stringify({
          object_type: "feed",
          content: {
            title: `🚗 찜한 조건의 차량이 등록됐어요!`,
            description: `${car.name} ${car.year}년식\n${car.mileage.toLocaleString()}km · ${car.fuel}\n\n🔒 FIX 가격 ${car.price.toLocaleString()}만원`,
            image_url: "https://www.fixcar.kr/favicon.svg",
            link: { web_url: `https://www.fixcar.kr/cars/${car.id}`, mobile_web_url: `https://www.fixcar.kr/cars/${car.id}` },
          },
          buttons: [{ title: "지금 바로 보기", link: { web_url: `https://www.fixcar.kr/cars/${car.id}`, mobile_web_url: `https://www.fixcar.kr/cars/${car.id}` } }],
        }),
      }),
    });
    return response.ok;
  } catch (e) {
    console.error("카카오 알림 발송 실패:", e);
    return false;
  }
}

// 새 차량 등록 시 호출 - 조건에 맞는 알림 사용자에게 발송
export async function sendNewCarAlerts(car: Car) {
  try {
    // 조건에 맞는 활성 알림 조회
    const alerts = await prisma.wishAlert.findMany({
      where: {
        active: true,
        AND: [
          { OR: [{ brand: null }, { brand: car.brand }] },
          { OR: [{ model: null }, { model: { contains: car.name.split(" ")[1] || car.name } }] },
          { OR: [{ minPrice: null }, { minPrice: { lte: car.price } }] },
          { OR: [{ maxPrice: null }, { maxPrice: { gte: car.price } }] },
          { OR: [{ minYear: null }, { minYear: { lte: car.year } }] },
          { OR: [{ maxYear: null }, { maxYear: { gte: car.year } }] },
          { OR: [{ fuel: null }, { fuel: car.fuel }] },
        ],
      },
      include: { user: { select: { id: true, email: true } } },
    });

    console.log(`[알림] 새 매물 ${car.name} - ${alerts.length}명에게 알림 발송 예정`);

    // 각 사용자에게 알림 발송
    for (const alert of alerts) {
      const kakaoId = alert.user.email.replace("kakao_", "");
      await sendKakaoMessage(kakaoId, car);
    }

    return alerts.length;
  } catch (e) {
    console.error("알림 발송 오류:", e);
    return 0;
  }
}
