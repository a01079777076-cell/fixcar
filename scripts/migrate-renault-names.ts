/**
 * 르노코리아 (구 르노삼성) Car.name 코드명 마이그레이션
 *
 *   dry-run:  npx tsx scripts/migrate-renault-names.ts
 *   apply:    npx tsx scripts/migrate-renault-names.ts --apply
 *
 * 주의:
 *   - 2022년 3월 사명 변경: 르노삼성자동차 → 르노코리아자동차
 *   - DB에 brand="르노삼성" / "르노삼성자동차" 등록된 매물도 brand="르노코리아"로 통일
 *   - 본 스크립트는 brand IN ("르노코리아", "르노삼성", "르노삼성자동차", "르노") 모두 처리
 */

import { prisma } from "../lib/prisma";

type YearRule = { from: number; to: number; newName: string };
type Rule =
  | { kind: "direct"; newName: string }
  | { kind: "byYear"; ranges: YearRule[] }
  | { kind: "warn"; note: string };

const RULES: Record<string, Rule> = {
  // --- DIRECT (오탈자/표기 정정) ---
  "그랑 콜레오스": { kind: "direct", newName: "그랑 콜레오스" },
  "그랜드 콜레오스": { kind: "direct", newName: "그랑 콜레오스" },
  "조에": { kind: "direct", newName: "조에 ZE40" },
  "ZOE": { kind: "direct", newName: "조에 ZE40" },
  "QM3": { kind: "direct", newName: "QM3 H5F" },
  "QM5": { kind: "direct", newName: "QM5 J72" },
  "QM6": { kind: "direct", newName: "QM6 D2" },
  "XM3": { kind: "direct", newName: "XM3 HJB" },
  "아르카나": { kind: "direct", newName: "XM3 HJB" },

  // --- BY_YEAR ---
  "SM3": {
    kind: "byYear",
    ranges: [
      { from: 2002, to: 2009, newName: "SM3 N16" },
      { from: 2009, to: 2020, newName: "SM3 L38" },
    ],
  },
  "SM3 ZE": { kind: "direct", newName: "SM3 Z.E." },
  "SM3 Z.E.": { kind: "direct", newName: "SM3 Z.E." },
  "SM3 전기차": { kind: "direct", newName: "SM3 Z.E." },
  "SM5": {
    kind: "byYear",
    ranges: [
      { from: 1998, to: 2005, newName: "SM5 EX1" },
      { from: 2005, to: 2010, newName: "SM5 KPQ" },
      { from: 2010, to: 2019, newName: "SM5 L43" },
    ],
  },
  "SM6": {
    kind: "byYear",
    ranges: [{ from: 2016, to: 2024, newName: "SM6 LFD" }],
  },
  "SM7": {
    kind: "byYear",
    ranges: [
      { from: 2004, to: 2011, newName: "SM7 EX2" },
      { from: 2011, to: 2020, newName: "SM7 L47" },
    ],
  },
  "콜레오스": {
    kind: "warn",
    note: "콜레오스는 1세대 르노 SUV(국내 미정식판매). '그랑 콜레오스'와 다름. 수동 확인 필요.",
  },
};

function resolve(name: string, year: number): { newName: string; via: string } | null {
  const rule = RULES[name];
  if (!rule) return null;
  if (rule.kind === "direct") return { newName: rule.newName, via: "DIRECT" };
  if (rule.kind === "byYear") {
    for (const r of rule.ranges) {
      if (year >= r.from && year < r.to) return { newName: r.newName, via: `BY_YEAR(${r.from}-${r.to})` };
    }
    return null;
  }
  return null;
}

const CODE_PATTERN =
  /\s(D2|HJB|LFD|L47|EX2|L43|KPQ|EX1|L38|N16|H5F|J72|ZE40|Z\.E\.)\b/;

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`[mode] ${apply ? "APPLY" : "DRY-RUN"}`);

  const cars = await prisma.car.findMany({
    where: { brand: { in: ["르노코리아", "르노삼성", "르노삼성자동차", "르노"] } },
    select: { id: true, name: true, year: true, status: true, brand: true },
    orderBy: { id: "asc" },
  });
  console.log(`[renault cars] ${cars.length}`);

  const changes: Array<{ id: number; oldName: string; newName: string; year: number; via: string; oldBrand: string; brandChange: boolean }> = [];
  const warns: Array<{ id: number; name: string; year: number; note: string }> = [];
  const noops: Array<{ id: number; name: string; year: number }> = [];
  const unmapped: Array<{ id: number; name: string; year: number }> = [];

  for (const c of cars) {
    const brandChange = c.brand !== "르노코리아";
    const rule = RULES[c.name];
    if (rule?.kind === "warn") {
      warns.push({ id: c.id, name: c.name, year: c.year, note: rule.note });
      continue;
    }
    const resolved = resolve(c.name, c.year);
    if (!resolved) {
      if (CODE_PATTERN.test(c.name) || c.name === "그랑 콜레오스") {
        if (brandChange) {
          changes.push({ id: c.id, oldName: c.name, newName: c.name, year: c.year, via: "BRAND_ONLY", oldBrand: c.brand, brandChange: true });
        } else {
          noops.push({ id: c.id, name: c.name, year: c.year });
        }
      } else {
        unmapped.push({ id: c.id, name: c.name, year: c.year });
      }
      continue;
    }
    if (resolved.newName === c.name && !brandChange) {
      noops.push({ id: c.id, name: c.name, year: c.year });
      continue;
    }
    changes.push({ id: c.id, oldName: c.name, newName: resolved.newName, year: c.year, via: resolved.via, oldBrand: c.brand, brandChange });
  }

  console.log(`\n=== CHANGES (${changes.length}) ===`);
  for (const ch of changes) {
    const brandNote = ch.brandChange ? ` [brand: ${ch.oldBrand} → 르노코리아]` : "";
    console.log(`  #${ch.id} [${ch.year}] ${ch.oldName}  →  ${ch.newName}  (${ch.via})${brandNote}`);
  }

  if (warns.length) {
    console.log(`\n=== WARN (${warns.length}) ===`);
    for (const w of warns) console.log(`  #${w.id} [${w.year}] ${w.name}  ⚠ ${w.note}`);
  }

  if (unmapped.length) {
    console.log(`\n=== UNMAPPED (${unmapped.length}) ===`);
    const by = new Map<string, number>();
    for (const u of unmapped) by.set(u.name, (by.get(u.name) ?? 0) + 1);
    for (const [n, cnt] of [...by.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${cnt}x  ${n}`);
    }
  }

  console.log(`\n=== NO-OP (${noops.length}) ===`);

  if (!apply) {
    console.log(`\n[dry-run] --apply 추가 시 위 CHANGES를 DB에 반영합니다.`);
    return;
  }

  console.log(`\n[apply] 업데이트 시작...`);
  let ok = 0;
  for (const ch of changes) {
    const data: { name?: string; brand?: string } = {};
    if (ch.newName !== ch.oldName) data.name = ch.newName;
    if (ch.brandChange) data.brand = "르노코리아";
    if (Object.keys(data).length === 0) continue;
    await prisma.car.update({ where: { id: ch.id }, data });
    ok++;
    if (ok % 20 === 0) console.log(`  ...${ok}/${changes.length}`);
  }
  console.log(`[apply] 완료: ${ok}건 업데이트`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
