/**
 * 쉐보레 (구 GM대우/대우) Car.name 코드명 마이그레이션
 *
 *   dry-run:  npx tsx scripts/migrate-chevrolet-names.ts
 *   apply:    npx tsx scripts/migrate-chevrolet-names.ts --apply
 *
 * 주의:
 *   - 2011년 1월 GM대우 → 한국지엠(쉐보레 브랜드)
 *   - DB의 brand="GM대우" / "대우" 등록 매물도 brand="쉐보레"로 통일
 *   - 본 스크립트는 brand IN ("쉐보레", "GM대우", "대우", "대우자동차", "한국지엠") 모두 처리
 */

import { prisma } from "../lib/prisma";

type YearRule = { from: number; to: number; newName: string };
type Rule =
  | { kind: "direct"; newName: string }
  | { kind: "byYear"; ranges: YearRule[] }
  | { kind: "warn"; note: string };

const RULES: Record<string, Rule> = {
  // --- DIRECT (오탈자/표기 정정) ---
  "트레일블레이저": { kind: "direct", newName: "트레일블레이저 RG4" },
  "트랙스 크로스오버": { kind: "direct", newName: "트랙스 크로스오버 R04" },
  "트래버스": { kind: "direct", newName: "트래버스 N1UC" },
  "타호": { kind: "direct", newName: "타호 T1XX" },
  "콜로라도": { kind: "direct", newName: "콜로라도 T1XX" },
  "실버라도 EV": { kind: "direct", newName: "실버라도 EV BT1" },
  "이쿼녹스 EV": { kind: "direct", newName: "이쿼녹스 EV BEV3" },
  "캡티바": { kind: "direct", newName: "캡티바 3세대" },
  "윈스톰": { kind: "direct", newName: "윈스톰 C100" },
  "윈스톰(캡티바)": { kind: "direct", newName: "윈스톰 C100" },
  "올란도": { kind: "direct", newName: "올란도 J309" },
  "레조": { kind: "direct", newName: "레조 U100" },
  "토스카": { kind: "direct", newName: "토스카 V250" },
  "매그너스": { kind: "direct", newName: "매그너스 V200" },
  "매그너스L": { kind: "direct", newName: "베리타스 V200L" },
  "베리타스": { kind: "direct", newName: "베리타스 V200L" },
  "스테이츠맨": { kind: "direct", newName: "스테이츠맨 WM" },
  "알페온": { kind: "direct", newName: "알페온 WM" },
  "라세티": { kind: "direct", newName: "라세티 J200" },
  "라세티 프리미어": { kind: "direct", newName: "크루즈 J300" },
  "라세티P": { kind: "direct", newName: "크루즈 J300" },
  "젠트라": { kind: "direct", newName: "젠트라 T250" },
  "젠트라X": { kind: "direct", newName: "젠트라 T250" },
  "칼로스": { kind: "direct", newName: "칼로스 T200" },
  "다마스": { kind: "direct", newName: "다마스 MD" },
  "라보": { kind: "direct", newName: "라보 MD" },
  "볼트EV": { kind: "direct", newName: "볼트 EV" },
  "볼트EUV": { kind: "direct", newName: "볼트 EUV" },

  // --- BY_YEAR ---
  "이쿼녹스": {
    kind: "byYear",
    ranges: [
      { from: 2018, to: 2024, newName: "이쿼녹스 D" },
      { from: 2024, to: 2099, newName: "이쿼녹스 NAU" },
    ],
  },
  "트랙스": {
    kind: "byYear",
    ranges: [
      { from: 2013, to: 2022, newName: "트랙스 U300" },
      { from: 2023, to: 2099, newName: "트랙스 크로스오버 R04" },
    ],
  },
  "말리부": {
    kind: "byYear",
    ranges: [
      { from: 2011, to: 2016, newName: "말리부 V300" },
      { from: 2016, to: 2022, newName: "말리부 D2UL" },
    ],
  },
  "크루즈": {
    kind: "byYear",
    ranges: [
      { from: 2008, to: 2016, newName: "크루즈 J300" },
      { from: 2017, to: 2018, newName: "크루즈 D2XX" },
    ],
  },
  "아베오": {
    kind: "byYear",
    ranges: [{ from: 2011, to: 2017, newName: "아베오 T300" }],
  },
  "스파크": {
    kind: "byYear",
    ranges: [
      { from: 2009, to: 2015, newName: "스파크 M300" },
      { from: 2015, to: 2022, newName: "스파크 M400" },
    ],
  },
  "마티즈": {
    kind: "byYear",
    ranges: [
      { from: 1998, to: 2005, newName: "마티즈 M150" },
      { from: 2005, to: 2009, newName: "마티즈 M200" },
    ],
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
  /\s(RG4|R04|N1UC|T1XX|BT1|BEV3|NAU|3세대|C100|J309|U100|V250|V200|V200L|WM|D2UL|V300|D2XX|J300|J200|T300|T250|T200|M400|M300|M200|M150|MD|D|U300|EV|EUV)\b/;

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`[mode] ${apply ? "APPLY" : "DRY-RUN"}`);

  const cars = await prisma.car.findMany({
    where: { brand: { in: ["쉐보레", "GM대우", "대우", "대우자동차", "한국지엠"] } },
    select: { id: true, name: true, year: true, status: true, brand: true },
    orderBy: { id: "asc" },
  });
  console.log(`[chevrolet cars] ${cars.length}`);

  const changes: Array<{ id: number; oldName: string; newName: string; year: number; via: string; oldBrand: string; brandChange: boolean }> = [];
  const warns: Array<{ id: number; name: string; year: number; note: string }> = [];
  const noops: Array<{ id: number; name: string; year: number }> = [];
  const unmapped: Array<{ id: number; name: string; year: number }> = [];

  for (const c of cars) {
    const brandChange = c.brand !== "쉐보레";
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
    const brandNote = ch.brandChange ? ` [brand: ${ch.oldBrand} → 쉐보레]` : "";
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
    if (ch.brandChange) data.brand = "쉐보레";
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
