/**
 * 카탈로그 엑셀 → TypeScript 자동 변환 스크립트
 * 
 * 사용법:
 *   npx tsx scripts/convert-catalog.ts
 * 
 * 또는 package.json에 추가:
 *   "catalog": "npx tsx scripts/convert-catalog.ts"
 *   → npm run catalog
 */

import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const EXCEL_PATH = path.join(process.cwd(), "data", "fixcar_catalog.xlsx");
const OUTPUT_PATH = path.join(process.cwd(), "data", "catalog_data.ts");

if (!fs.existsSync(EXCEL_PATH)) {
  console.error(`❌ 엑셀 파일을 찾을 수 없습니다: ${EXCEL_PATH}`);
  console.log("   data/fixcar_catalog.xlsx 파일을 넣어주세요.");
  process.exit(1);
}

console.log("📊 카탈로그 변환 시작...");
const wb = XLSX.readFile(EXCEL_PATH);

// 1. 브랜드_모델목록
const ws1 = wb.Sheets["브랜드_모델목록"];
const rows1: any[] = XLSX.utils.sheet_to_json(ws1);
const brandModels: Record<string, { category: string; models: { name: string; status: string }[] }> = {};
for (const r of rows1) {
  const brand = r["브랜드"];
  if (!brand) continue;
  if (!brandModels[brand]) brandModels[brand] = { category: r["구분"] || "국산", models: [] };
  brandModels[brand].models.push({ name: r["모델명"] || "", status: r["상태"] || "" });
}

// 2. 차량스펙_상세
const ws2 = wb.Sheets["차량스펙_상세"];
const rows2: any[] = XLSX.utils.sheet_to_json(ws2);
const carSpecs: Record<string, any> = {};
for (const r of rows2) {
  const name = r["차량명"];
  if (!name) continue;
  carSpecs[name] = {
    cc: r["배기량(cc)"] || 0,
    fuel: r["연료"] || "",
    transmission: r["변속기"] || "",
    drivetrain: r["구동"] || "",
    zeroToHundred: String(r["0→100"] || ""),
    topSpeed: r["최고속도(km/h)"] || 0,
    weight: r["공차중량(kg)"] || 0,
    length: r["전장(mm)"] || 0,
    width: r["전폭(mm)"] || 0,
    height: r["전고(mm)"] || 0,
    wheelbase: r["휠베이스(mm)"] || 0,
    bodyType: r["차체"] || "",
    seats: r["좌석"] || 0,
    segment: r["세그먼트"] || "",
  };
}

// 3. 등급_가격
const ws3 = wb.Sheets["등급_가격"];
const rows3: any[] = XLSX.utils.sheet_to_json(ws3);
const carGrades: Record<string, any[]> = {};
for (const r of rows3) {
  const name = r["차량명"];
  if (!name) continue;
  if (!carGrades[name]) carGrades[name] = [];
  carGrades[name].push({
    grade: r["등급"] || "",
    price: r["가격(만원)"] || 0,
    engine: r["엔진"] || "",
    power: String(r["출력(PS)"] || ""),
    torque: String(r["토크(kg·m)"] || ""),
    efficiency: String(r["연비"] || ""),
  });
}

// 4. 세금_보험
const ws4 = wb.Sheets["세금_보험"];
const rows4: any[] = XLSX.utils.sheet_to_json(ws4);
const carTax: Record<string, any> = {};
for (const r of rows4) {
  const name = r["차량명"];
  if (!name) continue;
  carTax[name] = {
    annualTax: r["연간 자동차세(원)"] || 0,
    insuranceClass: r["보험 분류"] || "",
    performanceSurcharge: r["고성능 할증"] || "X",
  };
}

// 5. 고질병_주의사항
const ws5 = wb.Sheets["고질병_주의사항"];
const rows5: any[] = XLSX.utils.sheet_to_json(ws5);
const carIssues: Record<string, any> = {};
for (const r of rows5) {
  const name = r["차량명"];
  if (!name) continue;
  carIssues[name] = {
    knownIssues: r["고질병"] || "",
    fuelNotes: r["연료별 주의사항"] || "",
    yearIssues: r["연도별 이슈"] || "",
  };
}

// 6. 세대_히스토리
const ws6 = wb.Sheets["세대_히스토리"];
const rows6: any[] = XLSX.utils.sheet_to_json(ws6);
const carHistory: Record<string, any[]> = {};
for (const r of rows6) {
  const name = r["차량명"];
  if (!name) continue;
  if (!carHistory[name]) carHistory[name] = [];
  carHistory[name].push({
    generation: r["세대"] || "",
    period: r["기간"] || "",
    code: r["코드"] || "",
    note: r["비고"] || "",
  });
}

// TS 파일 생성
const totalModels = Object.values(brandModels).reduce((sum, b) => sum + b.models.length, 0);
const lines = [
  `/* 픽스카 카탈로그 데이터 - 엑셀에서 자동 변환 */`,
  `/* ${Object.keys(brandModels).length}개 브랜드 · ${totalModels}개 모델 · ${Object.keys(carSpecs).length}개 스펙 · ${Object.keys(carGrades).length}개 등급 */`,
  ``,
  `export const BRAND_MODELS = ${JSON.stringify(brandModels, null, 2)} as const;`,
  ``,
  `export const CAR_SPECS = ${JSON.stringify(carSpecs, null, 2)} as const;`,
  ``,
  `export const CAR_GRADES = ${JSON.stringify(carGrades, null, 2)} as const;`,
  ``,
  `export const CAR_TAX = ${JSON.stringify(carTax, null, 2)} as const;`,
  ``,
  `export const CAR_ISSUES = ${JSON.stringify(carIssues, null, 2)} as const;`,
  ``,
  `export const CAR_HISTORY = ${JSON.stringify(carHistory, null, 2)} as const;`,
  ``,
  `export const DOMESTIC_BRANDS = ${JSON.stringify(Object.entries(brandModels).filter(([,v]) => v.category === "국산").map(([k]) => k))};`,
  `export const IMPORT_BRANDS = ${JSON.stringify(Object.entries(brandModels).filter(([,v]) => v.category === "수입").map(([k]) => k))};`,
  `export const ALL_BRANDS = [...DOMESTIC_BRANDS, ...IMPORT_BRANDS];`,
];

fs.writeFileSync(OUTPUT_PATH, lines.join("\n"));
console.log(`✅ 변환 완료!`);
console.log(`   브랜드: ${Object.keys(brandModels).length}개`);
console.log(`   모델: ${totalModels}개`);
console.log(`   스펙: ${Object.keys(carSpecs).length}개`);
console.log(`   등급: ${Object.keys(carGrades).length}개`);
console.log(`   → ${OUTPUT_PATH}`);
