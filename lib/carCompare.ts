// 📁 저장 경로: lib/carCompare.ts
// 차량 비교 유틸리티 — 연비, 유지비, 감가 계산

export interface CarSpec {
  name: string;
  brand: string;
  year: number;
  price: number; // 만원
  mileage: number; // km
  fuel: string; // 가솔린/디젤/전기/하이브리드/LPG
  cc: number;
  efficiency: string; // km/L or km/kWh
}

/**
 * 연간 연료비 계산
 * @param efficiency - km/L 또는 km/kWh
 * @param fuel - 연료 종류
 * @param annualKm - 연간 주행거리 (기본 15000km)
 */
export function calcFuelCost(efficiency: number, fuel: string, annualKm = 15000): number {
  const fuelPrices: Record<string, number> = {
    "가솔린": 1650,
    "디젤": 1500,
    "LPG": 950,
    "전기": 300, // 원/kWh
    "하이브리드": 1650,
  };
  const price = fuelPrices[fuel] || 1650;
  if (efficiency <= 0) return 0;
  return Math.round((annualKm / efficiency) * price);
}

/**
 * 연간 유지비 계산 (보험+세금+정비+연료)
 */
export function calcAnnualCost(car: CarSpec, annualKm = 15000): {
  fuel: number; insurance: number; tax: number; maintenance: number; total: number;
} {
  const eff = parseFloat(car.efficiency) || 10;
  const fuel = calcFuelCost(eff, car.fuel, annualKm);

  // 보험료 (차량가액 기반 대략치)
  const insurance = Math.round(car.price * 0.035) * 10000; // 3.5%

  // 자동차세 (배기량 기반)
  let taxPerCC = car.cc <= 1000 ? 80 : car.cc <= 1600 ? 140 : 200;
  if (car.fuel === "전기") taxPerCC = 0;
  const tax = car.cc * taxPerCC + (car.fuel === "전기" ? 130000 : 0); // 전기차 교육세 대체

  // 정비비 (연식 기반)
  const age = new Date().getFullYear() - car.year;
  const maintenance = age <= 3 ? 300000 : age <= 7 ? 600000 : 900000;

  return {
    fuel,
    insurance: Math.round(insurance),
    tax: Math.round(tax),
    maintenance,
    total: fuel + Math.round(insurance) + Math.round(tax) + maintenance,
  };
}

/**
 * 3년 후 예상 감가율 계산
 */
export function calcDepreciation(price: number, year: number): {
  threeYearValue: number;
  depreciationRate: number;
  depreciationAmount: number;
} {
  const age = new Date().getFullYear() - year;
  // 감가율: 1년차 20%, 2~3년차 연 10%, 이후 연 7%
  let rate = 1;
  for (let i = 0; i < age + 3; i++) {
    if (i === 0) rate *= 0.8;
    else if (i < 3) rate *= 0.9;
    else rate *= 0.93;
  }
  const futureValue = Math.round(price * rate);
  return {
    threeYearValue: futureValue,
    depreciationRate: Math.round((1 - rate) * 100),
    depreciationAmount: price - futureValue,
  };
}
