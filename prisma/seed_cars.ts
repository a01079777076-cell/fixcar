// @ts-nocheck
import { PrismaClient, CarStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚗 픽스카 테스트 차량 14대 시드 시작...");

  const cars = [
    { name:"현대 아반떼 CN7", brand:"현대", year:2022, mileage:32000, price:1580, fuel:"가솔린", transmission:"자동", color:"흰색", tags:["무사고","초보추천","1인소유"], isAccident:false, isPick:true, status:CarStatus.AVAILABLE },
    { name:"기아 K5 DL3", brand:"기아", year:2021, mileage:45000, price:2150, fuel:"가솔린", transmission:"자동", color:"검정", tags:["무사고","풀옵션"], isAccident:false, isPick:true, status:CarStatus.AVAILABLE },
    { name:"현대 쏘나타 DN8 하이브리드", brand:"현대", year:2023, mileage:18000, price:2680, fuel:"하이브리드", transmission:"자동", color:"회색", tags:["무사고","하이브리드","저주행"], isAccident:false, isPick:true, status:CarStatus.AVAILABLE },
    { name:"현대 투싼 NX4", brand:"현대", year:2022, mileage:28000, price:2780, fuel:"가솔린", transmission:"자동", color:"검정", tags:["무사고","가족용","AWD"], isAccident:false, isPick:false, status:CarStatus.AVAILABLE },
    { name:"기아 쏘렌토 MQ4 하이브리드", brand:"기아", year:2023, mileage:21000, price:3450, fuel:"하이브리드", transmission:"자동", color:"흰색", tags:["무사고","7인승","하이브리드"], isAccident:false, isPick:true, status:CarStatus.AVAILABLE },
    { name:"현대 아이오닉5 롱레인지", brand:"현대", year:2023, mileage:15000, price:4200, fuel:"전기", transmission:"자동", color:"회색", tags:["무사고","전기차","초급속충전"], isAccident:false, isPick:true, status:CarStatus.AVAILABLE },
    { name:"기아 EV6 GT-Line", brand:"기아", year:2022, mileage:25000, price:4580, fuel:"전기", transmission:"자동", color:"검정", tags:["무사고","전기차","GT-Line"], isAccident:false, isPick:false, status:CarStatus.AVAILABLE },
    { name:"제네시스 G70 2.0T", brand:"제네시스", year:2021, mileage:38000, price:3200, fuel:"가솔린", transmission:"자동", color:"검정", tags:["무사고","스포츠세단","후륜구동"], isAccident:false, isPick:false, status:CarStatus.AVAILABLE },
    { name:"제네시스 GV70 2.5T", brand:"제네시스", year:2022, mileage:32000, price:4980, fuel:"가솔린", transmission:"자동", color:"흰색", tags:["무사고","프리미엄SUV"], isAccident:false, isPick:true, status:CarStatus.AVAILABLE },
    { name:"현대 그랜저 GN7 하이브리드", brand:"현대", year:2023, mileage:12000, price:3850, fuel:"하이브리드", transmission:"자동", color:"검정", tags:["무사고","대형세단","하이브리드","저주행"], isAccident:false, isPick:true, status:CarStatus.AVAILABLE },
    { name:"기아 모닝 JA", brand:"기아", year:2020, mileage:55000, price:650, fuel:"가솔린", transmission:"자동", color:"빨강", tags:["무사고","경차","가성비"], isAccident:false, isPick:false, status:CarStatus.AVAILABLE },
    { name:"현대 캐스퍼", brand:"현대", year:2023, mileage:8000, price:1380, fuel:"가솔린", transmission:"자동", color:"민트", tags:["무사고","경차","저주행","귀여움"], isAccident:false, isPick:true, status:CarStatus.AVAILABLE },
    { name:"기아 셀토스 1.6T", brand:"기아", year:2021, mileage:42000, price:1950, fuel:"가솔린", transmission:"자동", color:"회색", tags:["무사고","소형SUV"], isAccident:false, isPick:false, status:CarStatus.AVAILABLE },
    { name:"쉐보레 트레일블레이저 RS", brand:"쉐보레", year:2022, mileage:35000, price:2100, fuel:"가솔린", transmission:"자동", color:"흰색", tags:["무사고","디자인좋음","가성비"], isAccident:false, isPick:false, status:CarStatus.AVAILABLE },
  ];

  for (const car of cars) {
    await prisma.car.create({
      data: {
        name: car.name,
        brand: car.brand,
        year: car.year,
        mileage: car.mileage,
        price: car.price,
        fuel: car.fuel,
        transmission: car.transmission,
        color: car.color,
        tags: car.tags,
        isAccident: car.isAccident,
        isPick: car.isPick,
        status: car.status,
        description: `${car.name} ${car.year}년식 / ${car.mileage.toLocaleString()}km / ${car.fuel} / FIX 정찰가 ${car.price.toLocaleString()}만원`,
        images: [],
      },
    });
    console.log(`  ✅ ${car.name} 등록 완료`);
  }

  console.log(`\n🎉 총 ${cars.length}대 시드 완료!`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
