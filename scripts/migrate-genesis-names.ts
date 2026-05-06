/**
 * 제네시스 브랜드 Car.name 코드명 마이그레이션
 *
 *   dry-run:  npx tsx scripts/migrate-genesis-names.ts
 *   apply:    npx tsx scripts/migrate-genesis-names.ts --apply
 *
 * 주의: brand 필드가 "현대" 또는 "제네시스" 일 수 있음.
 *       제네시스 브랜드 독립은 2015년 EQ900부터.
 *       2008-2014 제네시스(BH)는 "현대 제네시스" 시절. 그 시절 등록된 매물은 brand="현대" 일 가능성.
 *       → 본 스크립트는 brand="제네시스" 와 brand="현대" + name 매칭 둘 다 처리.
 */

import { prisma } from "../lib/prisma";

type YearRule = { from: number; to: number; newName: string; newBrand?: string };
type Rule =
  | { kind: "direct"; newName: string; newBrand?: string }
  | { kind: "byYear"; ranges: YearRule[] }
  | { kind: "warn"; note: string };

const RULES: Record<string, Rule> = {
  // --- DIRECT (오탈자/표기 정정) ---
  "G80": { kind: "byYear", ranges: [
    { from: 2016, to: 2020, newName: "G80 DH" },
    { from: 2020, to: 2099, newName: "G80 RG3" },
  ]},
  "G80 EV": { kind: "direct", newName: "G80e RG3e" },
  "G80 전기차": { kind: "direct", newName: "G80e RG3e" },
  "G80e": { kind: "direct", newName: "G80e RG3e" },
  "G70": { kind: "byYear", ranges: [{ from: 2017, to: 2099, newName: "G70 IK" }] },
  "G90": { kind: "byYear", ranges: [
    { from: 2015, to: 2018, newName: "EQ900 HI" },
    { from: 2018, to: 2022, newName: "G90 HI" },
    { from: 2022, to: 2099, newName: "G90 RS4" },
  ]},
  "EQ900": { kind: "direct", newName: "EQ900 HI" },
  "GV60": { kind: "direct", newName: "GV60 JW" },
  "GV70": { kind: "direct", newName: "GV70 JK1" },
  "GV70 EV": { kind: "direct", newName: "GV70e JK1e" },
  "GV70e": { kind: "direct", newName: "GV70e JK1e" },
  "GV80": { kind: "direct", newName: "GV80 JX1" },
  "GV80 쿠페": { kind: "direct", newName: "GV80 쿠페 JX1C" },
  "제네시스": {
    kind: "byYear",
    ranges: [
      { from: 2008, to: 2014, newName: "제네시스 BH" },
    ],
  },
  "제네시스 쿠페": {
    kind: "warn",
    note: "제네시스 쿠페(BK) — 별도 코드. 카탈로그에 미등록. 매핑 규칙 미정.",
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

const CODE_PATTERN = /\s(IK|RG3|RG3e|RS4|HI|JW|JK1|JK1e|JX1|JX1C|BH|DH)\b/;

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`[mode] ${apply ? "APPLY" : "DRY-RUN"}`);

  // 제네시스 + 현대(중 BH 가능성) 모두 조회
  const cars = await prisma.car.findMany({
    where: {
      OR: [
        { brand: "제네시스" },
        { brand: "현대", name: { in: ["제네시스", "제네시스 BH", "G80", "G80 DH", "EQ900", "EQ900 HI"] } },
      ],
    },
    select: { id: true, name: true, year: true, status: true, brand: true },
    orderBy: { id: "asc" },
  });
  console.log(`[genesis cars] ${cars.length}`);

  const changes: Array<{ id: number; oldName: string; newName: string; year: number; via: string; oldBrand: string }> = [];
  const warns: Array<{ id: number; name: string; year: number; note: string }> = [];
  const noops: Array<{ id: number; name: string; year: number }> = [];
  const unmapped: Array<{ id: number; name: string; year: number }> = [];

  for (const c of cars) {
    const rule = RULES[c.name];
    if (rule?.kind === "warn") {
      warns.push({ id: c.id, name: c.name, year: c.year, note: rule.note });
      continue;
    }
    const resolved = resolve(c.name, c.year);
    if (!resolved) {
      if (CODE_PATTERN.test(c.name)) {
        noops.push({ id: c.id, name: c.name, year: c.year });
      } else {
        unmapped.push({ id: c.id, name: c.name, year: c.year });
      }
      continue;
    }
    if (resolved.newName === c.name && c.brand === "제네시스") {
      noops.push({ id: c.id, name: c.name, year: c.year });
      continue;
    }
    changes.push({
      id: c.id,
      oldName: c.name,
      newName: resolved.newName,
      year: c.year,
      via: resolved.via,
      oldBrand: c.brand,
    });
  }

  console.log(`\n=== CHANGES (${changes.length}) ===`);
  for (const ch of changes) {
    const brandNote = ch.oldBrand === "현대" ? " [brand: 현대 → 제네시스]" : "";
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

  console.log(`\n=== NO-OP (${noops.length}) === (이미 코드명)`);

  if (!apply) {
    console.log(`\n[dry-run] --apply 추가 시 위 CHANGES를 DB에 반영합니다.`);
    return;
  }

  console.log(`\n[apply] 업데이트 시작...`);
  let ok = 0;
  for (const ch of changes) {
    const data: { name: string; brand?: string } = { name: ch.newName };
    if (ch.oldBrand === "현대") data.brand = "제네시스";
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
