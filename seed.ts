import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시드 데이터 삽입 시작...");

  // 딜러 유저 생성
  const dealerUser1 = await prisma.user.upsert({
    where: { email: "dealer1@fixcar.kr" },
    update: {},
    create: {
      email: "dealer1@fixcar.kr",
      name: "박준형",
      phone: "010-1234-5678",
      role: "DEALER",
    },
  });

  const dealerUser2 = await prisma.user.upsert({
    where: { email: "dealer2@fixcar.kr" },
    update: {},
    create: {
      email: "dealer2@fixcar.kr",
      name: "김민수",
      phone: "010-2345-6789",
      role: "DEALER",
    },
  });

  // 딜러 생성
  const dealer1 = await prisma.dealer.upsert({
    where: { userId: dealerUser1.id },
    update: {},
    create: {
      userId: dealerUser1.id,
      shopName: "광주모터스",
      rating: 4.9,
      dealCount: 142,
      verified: true,
    },
  });

  const dealer2 = await prisma.dealer.upsert({
    where: { userId: dealerUser2.id },
    update: {},
    create: {
      userId: dealerUser2.id,
      shopName: "전남자동차",
      rating: 4.7,
      dealCount: 89,
      verified: true,
    },
  });

  // 차량 데이터
  const cars = [
    {
      dealerId: dealer1.id,
      name: "아반떼 CN7 1.6 가솔린 스마트",
      brand: "현대",
      year: 2021,
      mileage: 32000,
      fuel: "가솔린",
      color: "흰색",
      region: "광주 북구",
      price: 1450,
      cc: 1598,
      power: 123,
      efficiency: "15.2",
      transmission: "자동",
      owners: 1,
      accident: false,
      status: "AVAILABLE" as const,
      tags: ["무사고", "초보 추천", "1인 오너"],
      options: ["후방카메라", "열선시트", "스마트크루즈", "애플카플레이", "LED 헤드램프"],
      images: [],
    },
    {
      dealerId: dealer2.id,
      name: "K3 1.6 가솔린 프레스티지",
      brand: "기아",
      year: 2020,
      mileage: 51000,
      fuel: "가솔린",
      color: "실버",
      region: "광주 서구",
      price: 1090,
      cc: 1591,
      power: 128,
      efficiency: "13.8",
      transmission: "자동",
      owners: 1,
      accident: false,
      status: "AVAILABLE" as const,
      tags: ["무사고", "가성비", "1인 오너"],
      options: ["후방카메라", "스마트키", "열선시트", "LED 주간주행등"],
      images: [],
    },
    {
      dealerId: dealer1.id,
      name: "투싼 NX4 2.0 가솔린 인스퍼레이션",
      brand: "현대",
      year: 2022,
      mileage: 28000,
      fuel: "가솔린",
      color: "검정",
      region: "광주 남구",
      price: 2780,
      cc: 1999,
      power: 156,
      efficiency: "12.4",
      transmission: "자동",
      owners: 1,
      accident: false,
      status: "RESERVED" as const,
      tags: ["1인 오너", "가족용", "넓은 트렁크"],
      options: ["파노라마 선루프", "BOSE 사운드", "원격 주차보조", "HDA2"],
      images: [],
    },
    {
      dealerId: dealer1.id,
      name: "아이오닉 5 롱레인지 2WD",
      brand: "현대",
      year: 2022,
      mileage: 22000,
      fuel: "전기",
      color: "그린",
      region: "광주 동구",
      price: 3890,
      cc: 0,
      power: 217,
      efficiency: "5.8",
      transmission: "자동",
      owners: 1,
      accident: false,
      status: "AVAILABLE" as const,
      tags: ["무사고", "전기차", "1인 오너"],
      options: ["원격 스마트 주차보조", "증강현실 HUD", "V2L", "히트펌프"],
      images: [],
    },
    {
      dealerId: dealer2.id,
      name: "엑센트 1.4 가솔린",
      brand: "현대",
      year: 2019,
      mileage: 68000,
      fuel: "가솔린",
      color: "흰색",
      region: "광주 북구",
      price: 680,
      cc: 1368,
      power: 100,
      efficiency: "14.8",
      transmission: "자동",
      owners: 1,
      accident: false,
      status: "AVAILABLE" as const,
      tags: ["무사고", "초보 추천", "주차 쉬움"],
      options: ["후방카메라", "스마트키", "USB 충전"],
      images: [],
    },
    {
      dealerId: dealer1.id,
      name: "쏘렌토 MQ4 2.0 디젤 7인승",
      brand: "기아",
      year: 2021,
      mileage: 38000,
      fuel: "디젤",
      color: "실버",
      region: "광주 서구",
      price: 3450,
      cc: 1999,
      power: 186,
      efficiency: "13.2",
      transmission: "자동",
      owners: 1,
      accident: false,
      status: "AVAILABLE" as const,
      tags: ["무사고", "7인승", "가족용"],
      options: ["파노라마 선루프", "BSD", "원격 스마트 주차보조", "HDA"],
      images: [],
    },
    {
      dealerId: dealer2.id,
      name: "쏘나타 DN8 2.0 가솔린 프리미엄",
      brand: "현대",
      year: 2021,
      mileage: 41000,
      fuel: "가솔린",
      color: "흰색",
      region: "광주 남구",
      price: 2100,
      cc: 1999,
      power: 160,
      efficiency: "13.5",
      transmission: "자동",
      owners: 1,
      accident: false,
      status: "AVAILABLE" as const,
      tags: ["무사고", "초보 추천", "넓은 실내"],
      options: ["원격 스마트 주차보조", "HDA", "열선시트", "애플카플레이"],
      images: [],
    },
    {
      dealerId: dealer1.id,
      name: "K5 DL3 1.6 터보 프레스티지",
      brand: "기아",
      year: 2020,
      mileage: 55000,
      fuel: "가솔린",
      color: "검정",
      region: "광주 광산구",
      price: 1780,
      cc: 1591,
      power: 180,
      efficiency: "12.8",
      transmission: "자동",
      owners: 1,
      accident: false,
      status: "AVAILABLE" as const,
      tags: ["무사고", "1인 오너", "스포티"],
      options: ["전동 트렁크", "HUD", "열선시트", "원격 시동"],
      images: [],
    },
  ];

  // 기존 차량 삭제 후 새로 삽입
  await prisma.car.deleteMany({});

  for (const car of cars) {
    await prisma.car.create({ data: car });
  }

  console.log(`✅ 차량 ${cars.length}대 삽입 완료!`);
  console.log("✅ 딜러 2명 생성 완료!");
  console.log("🎉 시드 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
