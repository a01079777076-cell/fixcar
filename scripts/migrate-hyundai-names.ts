/**
 * 현대 브랜드 Car.name 코드명 마이그레이션
 *
 *   dry-run:  npx tsx scripts/migrate-hyundai-names.ts
 *   apply:    npx tsx scripts/migrate-hyundai-names.ts --apply
 *
 * 동작:
 *   - brand === "현대" 인 Car 레코드 전부 조회
 *   - name + year 로 매핑 규칙 조회
 *   - dry-run: 변경 예정만 출력
 *   - apply: 실제 update 실행
 *
 * 규칙:
 *   DIRECT  : 연식 무관 일괄 rename (오탈자/표기 정정)
 *   BY_YEAR : 구 일반명("아반떼")을 year 기반으로 코드명("아반떼 CN7") 매핑
 *   WARN    : 매핑 불가 (삭제된 잘못된 키 등) — 그대로 두고 수동 확인 요청
 */

import { prisma } from "../lib/prisma";

type YearRule = { from: number; to: number; newName: string };
type Rule =
  | { kind: "direct"; newName: string }
  | { kind: "byYear"; ranges: YearRule[] }
  | { kind: "warn"; note: string };

const RULES: Record<string, Rule> = {
  // --- DIRECT ---
  "아슬란": { kind: "direct", newName: "아슬란 AG" },
  "클릭/겟츠 TB": { kind: "direct", newName: "클릭 TB" },
  "트라제XG FO": { kind: "direct", newName: "트라제 XG FO" },
  "스타렉스(그랜드) A1": { kind: "direct", newName: "스타렉스 A1" },
  "포터 HR": { kind: "direct", newName: "포터 2 HR" },
  "아이오닉 9": { kind: "direct", newName: "아이오닉 9 ME" },

  // --- BY_YEAR ---
  "아반떼": {
    kind: "byYear",
    ranges: [
      { from: 1990, to: 1995, newName: "엘란트라 J1" },
      { from: 1995, to: 2000, newName: "아반떼 J2" },
      { from: 2000, to: 2006, newName: "아반떼 XD" },
      { from: 2006, to: 2010, newName: "아반떼 HD" },
      { from: 2010, to: 2015, newName: "아반떼 MD" },
      { from: 2015, to: 2020, newName: "아반떼 AD" },
      { from: 2020, to: 2099, newName: "아반떼 CN7" },
    ],
  },
  "쏘나타": {
    kind: "byYear",
    ranges: [
      { from: 1985, to: 1988, newName: "쏘나타 Y1" },
      { from: 1988, to: 1993, newName: "쏘나타 Y2" },
      { from: 1993, to: 1998, newName: "쏘나타 Y3" },
      { from: 1998, to: 2004, newName: "쏘나타 EF" },
      { from: 2004, to: 2009, newName: "쏘나타 NF" },
      { from: 2009, to: 2014, newName: "쏘나타 YF" },
      { from: 2014, to: 2019, newName: "쏘나타 LF" },
      { from: 2019, to: 2099, newName: "쏘나타 DN8" },
    ],
  },
  "그랜저": {
    kind: "byYear",
    ranges: [
      { from: 1986, to: 1992, newName: "그랜저 L" },
      { from: 1992, to: 1998, newName: "그랜저 LX" },
      { from: 1998, to: 2005, newName: "그랜저 XG" },
      { from: 2005, to: 2011, newName: "그랜저 TG" },
      { from: 2011, to: 2016, newName: "그랜저 HG" },
      { from: 2016, to: 2022, newName: "그랜저 IG" },
      { from: 2022, to: 2099, newName: "그랜저 GN7" },
    ],
  },
  "투싼": {
    kind: "byYear",
    ranges: [
      { from: 2004, to: 2010, newName: "투싼 JM" },
      { from: 2010, to: 2015, newName: "투싼 LM" },
      { from: 2015, to: 2020, newName: "투싼 TL" },
      { from: 2020, to: 2099, newName: "투싼 NX4" },
    ],
  },
  "싼타페": {
    kind: "byYear",
    ranges: [
      { from: 2000, to: 2006, newName: "싼타페 SM" },
      { from: 2006, to: 2012, newName: "싼타페 CM" },
      { from: 2012, to: 2018, newName: "싼타페 DM" },
      { from: 2018, to: 2023, newName: "싼타페 TM" },
      { from: 2023, to: 2099, newName: "싼타페 MX5" },
    ],
  },
  "팰리세이드": {
    kind: "byYear",
    ranges: [{ from: 2018, to: 2099, newName: "팰리세이드 LX2" }],
  },
  "코나": {
    kind: "byYear",
    ranges: [
      { from: 2017, to: 2023, newName: "코나 OS" },
      { from: 2023, to: 2099, newName: "코나 SX2" },
    ],
  },
  "베뉴": {
    kind: "byYear",
    ranges: [{ from: 2019, to: 2099, newName: "베뉴 QX" }],
  },
  "캐스퍼": {
    kind: "byYear",
    ranges: [{ from: 2021, to: 2099, newName: "캐스퍼 AX1" }],
  },
  "스타리아": {
    kind: "byYear",
    ranges: [{ from: 2021, to: 2099, newName: "스타리아 US4" }],
  },
  "아이오닉 5": {
    kind: "byYear",
    ranges: [{ from: 2021, to: 2099, newName: "아이오닉 5 NE" }],
  },
  "아이오닉 6": {
    kind: "byYear",
    ranges: [{ from: 2022, to: 2099, newName: "아이오닉 6 CE" }],
  },
  "아이오닉": {
    kind: "byYear",
    ranges: [{ from: 2016, to: 2022, newName: "아이오닉 AE" }],
  },
  "넥쏘": {
    kind: "byYear",
    ranges: [
      { from: 2018, to: 2025, newName: "넥쏘 FE" },
      { from: 2025, to: 2099, newName: "넥쏘 FE2" },
    ],
  },
  "포터": {
    kind: "byYear",
    ranges: [
      { from: 1977, to: 2004, newName: "포터 1 AU" },
      { from: 2004, to: 2099, newName: "포터 2 HR" },
    ],
  },
  "마이티": {
    kind: "byYear",
    ranges: [
      { from: 2015, to: 2023, newName: "마이티 WT1" },
      { from: 2023, to: 2099, newName: "마이티 WQ" },
    ],
  },
  "스타렉스": {
    kind: "byYear",
    ranges: [
      { from: 1997, to: 2007, newName: "스타렉스 A1" },
      { from: 2007, to: 2021, newName: "스타렉스 TQ" },
    ],
  },
  "벨로스터": {
    kind: "byYear",
    ranges: [
      { from: 2011, to: 2018, newName: "벨로스터 FS" },
      { from: 2018, to: 2022, newName: "벨로스터 JS" },
    ],
  },
  "엑센트": { kind: "direct", newName: "액센트 RB" }, // "엑센트"→"액센트" 표기 정정
  "액센트": {
    kind: "byYear",
    ranges: [{ from: 2010, to: 2019, newName: "액센트 RB" }],
  },
  "i30": {
    kind: "byYear",
    ranges: [
      { from: 2007, to: 2012, newName: "i30 FD" },
      { from: 2012, to: 2017, newName: "i30 GD" },
      { from: 2017, to: 2023, newName: "i30 PD" },
    ],
  },
  "i40": {
    kind: "byYear",
    ranges: [{ from: 2011, to: 2019, newName: "i40 VF" }],
  },
  "갤로퍼": {
    kind: "byYear",
    ranges: [
      { from: 1991, to: 1997, newName: "갤로퍼 MK1" },
      { from: 1997, to: 2003, newName: "갤로퍼 MK2 II" },
    ],
  },

  // --- WARN (삭제된 잘못된 이름 / 모호함) ---
  "쏘나타 MX5": {
    kind: "warn",
    note: "MX5는 싼타페 5세대 코드. '싼타페 MX5' 또는 연식에 맞는 쏘나타 세대로 수동 재등록 필요",
  },
  "액센트 HC": {
    kind: "warn",
    note: "한국 미판매 세대(HC는 해외향 5세대). 실제 연식 기준 '액센트 RB' 또는 '베르나 MC/LC'로 수동 재등록 필요",
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

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`[mode] ${apply ? "APPLY" : "DRY-RUN"}`);

  const cars = await prisma.car.findMany({
    where: { brand: "현대" },
    select: { id: true, name: true, year: true, status: true },
    orderBy: { id: "asc" },
  });
  console.log(`[hyundai cars] ${cars.length}`);

  const changes: Array<{ id: number; oldName: string; newName: string; year: number; via: string }> = [];
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
      // name already coded (e.g. "그랜저 GN7") or not in rules → no-op
      if (/\s(CN7|DN8|GN7|QX|SX2|NX4|MX5|LX2|LX3|AX1|AX1e|US4|NE|CE|ME|FE|FE2|HR|TQ|A1|LM|JM|TL|SM|CM|DM|TM|TG|HG|IG|XG|EF|NF|YF|LF|Y1|Y2|Y3|FD|GD|PD|VF|RB|HC|AE|AD|MD|HD|XD|J1|J2|WQ|WT1|EY4|NK4|MK1|MK2|RD|RL|GK|FC|AU|X1|X2|SZ|L|LX)\b/.test(c.name)) {
        noops.push({ id: c.id, name: c.name, year: c.year });
      } else {
        unmapped.push({ id: c.id, name: c.name, year: c.year });
      }
      continue;
    }
    changes.push({ id: c.id, oldName: c.name, newName: resolved.newName, year: c.year, via: resolved.via });
  }

  console.log(`\n=== CHANGES (${changes.length}) ===`);
  for (const ch of changes) {
    console.log(`  #${ch.id} [${ch.year}] ${ch.oldName}  →  ${ch.newName}  (${ch.via})`);
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
    await prisma.car.update({ where: { id: ch.id }, data: { name: ch.newName } });
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
