/**
 * KG모빌리티 (구 쌍용) Car.name 코드명 마이그레이션
 *
 *   dry-run:  npx tsx scripts/migrate-kgm-names.ts
 *   apply:    npx tsx scripts/migrate-kgm-names.ts --apply
 *
 * 주의:
 *   - 2023년 3월 사명 변경: 쌍용자동차 → KG모빌리티
 *   - DB에 brand="쌍용" 또는 "쌍용자동차"로 등록된 매물도 brand="KG모빌리티"로 통일
 *   - 본 스크립트는 brand IN ("KG모빌리티", "쌍용", "쌍용자동차") 모두 처리
 */

import { prisma } from "../lib/prisma";

type YearRule = { from: number; to: number; newName: string };
type Rule =
  | { kind: "direct"; newName: string }
  | { kind: "byYear"; ranges: YearRule[] }
  | { kind: "warn"; note: string };

const RULES: Record<string, Rule> = {
  // --- DIRECT (오탈자/표기 정정) ---
  "토레스": { kind: "direct", newName: "토레스 R4" },
  "토레스 EV": { kind: "direct", newName: "토레스 EVX" },
  "액티언": {
    kind: "byYear",
    ranges: [
      { from: 2005, to: 2011, newName: "액티언 C100" },
      { from: 2024, to: 2099, newName: "액티언 R4" },
    ],
  },
  "무쏘 (렉스턴 스포츠)": { kind: "direct", newName: "렉스턴 스포츠 Q200" },
  "무쏘(렉스턴 스포츠)": { kind: "direct", newName: "렉스턴 스포츠 Q200" },
  "렉스턴 스포츠": { kind: "direct", newName: "렉스턴 스포츠 Q200" },
  "렉스턴 칸": { kind: "direct", newName: "렉스턴 스포츠 Q200" },
  "코란도 스포츠": { kind: "direct", newName: "코란도 스포츠 Q150" },
  "티볼리 에어": { kind: "direct", newName: "티볼리 에어 X150" },
  "코란도 C": { kind: "direct", newName: "코란도 C C200" },
  "코란도C": { kind: "direct", newName: "코란도 C C200" },
  "체어맨 W": { kind: "direct", newName: "체어맨 W W140" },
  "체어맨 H": { kind: "direct", newName: "체어맨 H W140" },
  "체어맨": {
    kind: "byYear",
    ranges: [
      { from: 1997, to: 2003, newName: "체어맨 W100" },
      { from: 2003, to: 2008, newName: "체어맨 W140" },
      { from: 2008, to: 2014, newName: "체어맨 H W140" },
      { from: 2008, to: 2018, newName: "체어맨 W W140" },
    ],
  },
  "로디우스": {
    kind: "byYear",
    ranges: [
      { from: 2004, to: 2013, newName: "로디우스 R100" },
      { from: 2013, to: 2018, newName: "투리스모 R200" },
    ],
  },
  "투리스모": { kind: "direct", newName: "투리스모 R200" },
  "이스타나": { kind: "direct", newName: "이스타나 MB100" },

  // --- BY_YEAR ---
  "렉스턴": {
    kind: "byYear",
    ranges: [
      { from: 2001, to: 2006, newName: "렉스턴 Y200" },
      { from: 2006, to: 2012, newName: "렉스턴 Y290" },
      { from: 2012, to: 2017, newName: "렉스턴 W Y280" },
      { from: 2017, to: 2099, newName: "렉스턴 Y400" },
    ],
  },
  "렉스턴 G4": { kind: "direct", newName: "렉스턴 Y400" },
  "G4 렉스턴": { kind: "direct", newName: "렉스턴 Y400" },
  "렉스턴 W": { kind: "direct", newName: "렉스턴 W Y280" },
  "코란도": {
    kind: "byYear",
    ranges: [
      { from: 1983, to: 1996, newName: "코란도 KJ" },
      { from: 1996, to: 2005, newName: "코란도 훼미리 CJ" },
      { from: 2011, to: 2019, newName: "코란도 C C200" },
      { from: 2019, to: 2099, newName: "코란도 C300" },
    ],
  },
  "코란도 훼미리": { kind: "direct", newName: "코란도 훼미리 CJ" },
  "티볼리": {
    kind: "byYear",
    ranges: [{ from: 2015, to: 2099, newName: "티볼리 X100" }],
  },
  "카이런": {
    kind: "byYear",
    ranges: [{ from: 2005, to: 2011, newName: "카이런 D100" }],
  },
  "액티언 스포츠": { kind: "direct", newName: "액티언 스포츠 Q100" },
  "무쏘": {
    kind: "byYear",
    ranges: [
      { from: 1993, to: 2005, newName: "무쏘 FJ" },
      { from: 2024, to: 2099, newName: "무쏘 Q201" },
    ],
  },
  "무쏘 EV": { kind: "direct", newName: "무쏘 EV Q201e" },
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
  /\s(R4|EVX|Q201|Q201e|Y400|C300|X100|Q200|Q150|X150|C200|KJ|CJ|C100|Q100|D100|Y200|Y290|Y280|R100|R200|W100|W140|FJ|MB100)\b/;

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`[mode] ${apply ? "APPLY" : "DRY-RUN"}`);

  const cars = await prisma.car.findMany({
    where: { brand: { in: ["KG모빌리티", "쌍용", "쌍용자동차", "KGM"] } },
    select: { id: true, name: true, year: true, status: true, brand: true },
    orderBy: { id: "asc" },
  });
  console.log(`[kgm cars] ${cars.length}`);

  const changes: Array<{ id: number; oldName: string; newName: string; year: number; via: string; oldBrand: string; brandChange: boolean }> = [];
  const warns: Array<{ id: number; name: string; year: number; note: string }> = [];
  const noops: Array<{ id: number; name: string; year: number }> = [];
  const unmapped: Array<{ id: number; name: string; year: number }> = [];

  for (const c of cars) {
    const brandChange = c.brand !== "KG모빌리티";
    const rule = RULES[c.name];
    if (rule?.kind === "warn") {
      warns.push({ id: c.id, name: c.name, year: c.year, note: rule.note });
      continue;
    }
    const resolved = resolve(c.name, c.year);
    if (!resolved) {
      if (CODE_PATTERN.test(c.name)) {
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
    const brandNote = ch.brandChange ? ` [brand: ${ch.oldBrand} → KG모빌리티]` : "";
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

  console.log(`\n=== NO-OP (${noops.length}) === (이미 코드명, brand=KG모빌리티)`);

  if (!apply) {
    console.log(`\n[dry-run] --apply 추가 시 위 CHANGES를 DB에 반영합니다.`);
    return;
  }

  console.log(`\n[apply] 업데이트 시작...`);
  let ok = 0;
  for (const ch of changes) {
    const data: { name?: string; brand?: string } = {};
    if (ch.newName !== ch.oldName) data.name = ch.newName;
    if (ch.brandChange) data.brand = "KG모빌리티";
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
