import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CarDetailClient from "./CarDetailClient";

/* ── SEO 메타데이터 동적 생성 ── */
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const car = await prisma.car.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true, name: true, brand: true, year: true,
        mileage: true, fuel: true, price: true, color: true,
        transmission: true, region: true, accident: true,
        description: true, images: true,
        dealer: { select: { shopName: true } },
      },
    });

    if (!car) {
      return {
        title: "매물 없음 | 픽스카",
        description: "요청하신 매물을 찾을 수 없습니다.",
      };
    }

    const titleStr    = `${car.brand} ${car.name} ${car.price.toLocaleString()}만원`;
    const descStr     = `${car.year}년식 ${car.brand} ${car.name} · ${car.mileage.toLocaleString()}km · ${car.fuel} · ${car.transmission}${car.accident ? "" : " · 무사고"} | 광주 정찰제 중고차 픽스카`;
    const ogImg       = car.images?.[0] || "https://fixcar.kr/og-default.png";
    const pageUrl     = `https://fixcar.kr/cars/${car.id}`;

    return {
      title:       `${titleStr} | 픽스카`,
      description: descStr,
      keywords:    `중고차,${car.brand},${car.name},광주중고차,픽스카,정찰제,${car.fuel},${car.year}년식`,
      openGraph: {
        title:       titleStr,
        description: descStr,
        url:         pageUrl,
        siteName:    "픽스카 FIXCAR",
        type:        "website",
        images: [
          {
            url:    ogImg,
            width:  800,
            height: 600,
            alt:    `${car.brand} ${car.name}`,
          },
        ],
      },
      twitter: {
        card:        "summary_large_image",
        title:       titleStr,
        description: descStr,
        images:      [ogImg],
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch {
    return {
      title: "픽스카 FIXCAR | 광주 정찰제 중고차",
      description: "픽스카는 광주/전남 정찰제 중고차 플랫폼입니다.",
    };
  }
}

/* ── 페이지 렌더링 (클라이언트 컴포넌트 위임) ── */
export default function CarDetailPage() {
  return <CarDetailClient />;
}
