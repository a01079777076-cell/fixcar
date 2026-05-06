/**
 * 기아 브랜드 Car.name 코드명 마이그레이션
 *
 *   dry-run:  npx tsx scripts/migrate-kia-names.ts
 *   apply:    npx tsx scripts/migrate-kia-names.ts --apply
 */

import { prisma } from "../lib/prisma";

type YearRule = { from: number; to: number; newName: string };
type Rule =
  | { kind: "direct"; newName: string }
  | { kind: "byYear"; ranges: YearRule[] }
  | { kind: "warn"; note: string };

const RULES: Record<string, Rule> = {
  // --- DIRECT (오탈자/표기 정정) ---
  "모닝 BA": { kind: "direct", newName: "모닝 SA" },
  "로체(옵티마) MG": { kind: "direct", newName: "로체 MG" },
  "스토닉": { kind: "direct", newName: "스토닉 YB" },
  "옵티마 MS": { kind: "direct", newName: "옵티마 MS" },

  // --- BY_YEAR (구 일반명 → 코드명) ---
  "모닝": {
    kind: "byYear",
    ranges: [
      { from: 2004, to: 2011, newName: "모닝 SA" },
      { from: 2011, to: 2017, newName: "모닝 TA" },
      { from: 2017, to: 2099, newName: "모닝 JA" },
    ],
  },
  "레이": {
    kind: "byYear",
    ranges: [{ from: 2011, to: 2099, newName: "레이 TAM" }],
  },
  "K3": {
    kind: "byYear",
    ranges: [
      { from: 2012, to: 2018, newName: "K3 YD" },
      { from: 2018, to: 2024, newName: "K3 BD" },
      { from: 2024, to: 2099, newName: "K3 BL3" },
    ],
  },
  "K5": {
    kind: "byYear",
    ranges: [
      { from: 2010, to: 2015, newName: "K5 TF" },
      { from: 2015, to: 2019, newName: "K5 JF" },
      { from: 2019, to: 2099, newName: "K5 DL3" },
    ],
  },
  "K7": {
    kind: "byYear",
    ranges: [
      { from: 2009, to: 2016, newName: "K7 VG" },
      { from: 2016, to: 2021, newName: "K7 YG" },
    ],
  },
  "K8": {
    kind: "byYear",
    ranges: [{ from: 2021, to: 2099, newName: "K8 GL3" }],
  },
  "K9": {
    kind: "byYear",
    ranges: [
      { from: 2012, to: 2018, newName: "K9 KH" },
      { from: 2018, to: 2099, newName: "K9 RJ" },
    ],
  },
  "스팅어": {
    kind: "byYear",
    ranges: [{ from: 2017, to: 2023, newName: "스팅어 CK" }],
  },
  "셀토스": {
    kind: "byYear",
    ranges: [
      { from: 2019, to: 2025, newName: "셀토스 SP2" },
      { from: 2025, to: 2099, newName: "셀토스 SP2i" },
    ],
  },
  "스포티지": {
    kind: "byYear",
    ranges: [
      { from: 1993, to: 2002, newName: "스포티지 NB" },
      { from: 2004, to: 2010, newName: "스포티지 KM" },
      { from: 2010, to: 2015, newName: "스포티지 SL" },
      { from: 2015, to: 2021, newName: "스포티지 QL" },
      { from: 2021, to: 2099, newName: "스포티지 NQ5" },
    ],
  },
  "쏘렌토": {
    kind: "byYear",
    ranges: [
      { from: 2002, to: 2009, newName: "쏘렌토 BL" },
      { from: 2009, to: 2014, newName: "쏘렌토 XM" },
      { from: 2014, to: 2020, newName: "쏘렌토 UM" },
      { from: 2020, to: 2099, newName: "쏘렌토 MQ4" },
    ],
  },
  "모하비": {
    kind: "byYear",
    ranges: [{ from: 2008, to: 2099, newName: "모하비 HM" }],
  },
  "카니발": {
    kind: "byYear",
    ranges: [
      { from: 1998, to: 2005, newName: "카니발 GQ" },
      { from: 2005, to: 2014, newName: "카니발 VQ" },
      { from: 2014, to: 2020, newName: "카니발 YP" },
      { from: 2020, to: 2099, newName: "카니발 KA4" },
    ],
  },
  "봉고": {
    kind: "byYear",
    ranges: [
      { from: 1997, to: 2004, newName: "봉고 프론티어 J3" },
      { from: 2004, to: 2099, newName: "봉고 3 PU" },
    ],
  },
  "봉고3": {
    kind: "direct",
    newName: "봉고 3 PU",
  },
  "봉고 III": {
    kind: "direct",
    newName: "봉고 3 PU",
  },
  "EV6": {
    kind: "byYear",
    ranges: [{ from: 2021, to: 2099, newName: "EV6 CV" }],
  },
  "EV9": {
    kind: "byYear",
    ranges: [{ from: 2023, to: 2099, newName: "EV9 MV" }],
  },
  "EV3": {
    kind: "byYear",
    ranges: [{ from: 2024, to: 2099, newName: "EV3 SV1" }],
  },
  "EV5": {
    kind: "byYear",
    ranges: [{ from: 2024, to: 2099, newName: "EV5 OV" }],
  },
  "니로": {
    kind: "byYear",
    ranges: [
      { from: 2016, to: 2022, newName: "니로 DE" },
      { from: 2022, to: 2099, newName: "니로 SG2" },
    ],
  },
  "니로 EV": {
    kind: "byYear",
    ranges: [
      { from: 2018, to: 2022, newName: "니로 EV DE" },
      { from: 2022, to: 2099, newName: "니로 EV SG2" },
    ],
  },
  "쎄라토": {
    kind: "byYear",
    ranges: [
      { from: 2003, to: 2008, newName: "쎄라토 LD" },
      { from: 2008, to: 2012, newName: "쎄라토 TD" },
    ],
  },
  "프라이드": {
    kind: "byYear",
    ranges: [
      { from: 1987, to: 2000, newName: "프라이드 K1" },
      { from: 2005, to: 2011, newName: "프라이드 JB" },
      { from: 2011, to: 2017, newName: "프라이드 UB" },
    ],
  },
  "카렌스": {
    kind: "byYear",
    ranges: [
      { from: 1999, to: 2006, newName: "카렌스 RS" },
      { from: 2006, to: 2013, newName: "카렌스 RP" },
      { from: 2013, to: 2019, newName: "카렌스 RP" },
    ],
  },
  "오피러스": {
    kind: "direct",
    newName: "오피러스 GH",
  },
  "엔터프라이즈": {
    kind: "direct",
    newName: "엔터프라이즈",
  },
  "리오": {
    kind: "byYear",
    ranges: [{ from: 2000, to: 2005, newName: "리오 DC" }],
  },
  "쏘울": {
    kind: "byYear",
    ranges: [
      { from: 2008, to: 2013, newName: "쏘울 AM" },
      { from: 2013, to: 2019, newName: "쏘울 PS" },
      { from: 2019, to: 2099, newName: "쏘울 SK3" },
    ],
  },
  "포르테": {
    kind: "byYear",
    ranges: [{ from: 2008, to: 2012, newName: "포르테 TD" }],
  },
  "로체": {
    kind: "byYear",
    ranges: [{ from: 2005, to: 2010, newName: "로체 MG" }],
  },
  "옵티마": {
    kind: "byYear",
    ranges: [{ from: 2000, to: 2005, newName: "옵티마 MS" }],
  },
  "크레도스": {
    kind: "direct",
    newName: "크레도스",
  },
  "세피아": {
    kind: "direct",
    newName: "세피아",
  },
  "그랜버드": {
    kind: "direct",
    newName: "그랜버드",
  },
  "봉고 프론티어": {
    kind: "direct",
    newName: "봉고 프론티어 J3",
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
  /\s(SA|TA|JA|TAM|YD|BD|BL3|TF|JF|DL3|VG|YG|GL3|KH|RJ|CK|SP2|SP2i|NB|KM|SL|QL|NQ5|BL|XM|UM|MQ4|HM|GQ|VQ|YP|KA4|J3|PU|CV|MV|SV3|OV|DE|SG2|LD|TD|MS|MG|RP|RS|GH|AM|PS|SK3|K1|JB|UB|DC)\b/;

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`[mode] ${apply ? "APPLY" : "DRY-RUN"}`);

  const cars = await prisma.car.findMany({
    where: { brand: "기아" },
    select: { id: true, name: true, year: true, status: true },
    orderBy: { id: "asc" },
  });
  console.log(`[kia cars] ${cars.length}`);

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
      if (CODE_PATTERN.test(c.name)) {
        noops.push({ id: c.id, name: c.name, year: c.year });
      } else {
        unmapped.push({ id: c.id, name: c.name, year: c.year });
      }
      continue;
    }
    if (resolved.newName === c.name) {
      noops.push({ id: c.id, name: c.name, year: c.year });
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
