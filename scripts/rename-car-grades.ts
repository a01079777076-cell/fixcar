/**
 * CAR_GRADES 고아 키를 새 BRAND_MODELS 코드명으로 일괄 rename
 *
 *   dry-run:  npx tsx scripts/rename-car-grades.ts
 *   apply:    npx tsx scripts/rename-car-grades.ts --apply
 *
 * data/catalog_data.ts 안의 CAR_GRADES 블록만 수정. JSON 키 문자열만 교체.
 */

import * as fs from "fs";
import * as path from "path";

const FILE = path.join(process.cwd(), "data", "catalog_data.ts");

// 고아 키 → 새 코드명 매핑
const RENAME: Record<string, string> = {
  // --- 현대 ---
  "팰리세이드": "팰리세이드 LX2",
  "아이오닉5": "아이오닉 5 NE",
  "아이오닉5 N": "아이오닉 5 N NE",
  "아이오닉6": "아이오닉 6 CE",
  "아이오닉9": "아이오닉 9 ME",
  "넥쏘": "넥쏘 FE",
  "코나 2세대": "코나 SX2",
  "베뉴": "베뉴 QX",
  "스타리아": "스타리아 US4",
  "캐스퍼": "캐스퍼 AX1",

  // --- 기아 ---
  "K5 3세대": "K5 DL3",
  "K8": "K8 GL3",
  "K9 2세대": "K9 RJ",
  "스포티지 5세대": "스포티지 NQ5",
  "모하비": "모하비 HM",
  "모하비 HM2": "모하비 HM",
  "카니발 4세대": "카니발 KA4",
  "셀토스": "셀토스 SP2",
  "EV6": "EV6 CV",
  "EV9": "EV9 MV",
  "EV3": "EV3 SV3",
  "니로 2세대": "니로 SG2",
  "레이": "레이 TAM",
  "모닝 3세대": "모닝 JA",
  "모닝 BA": "모닝 SA",
  "비스토/모닝 SA": "모닝 SA",
  "봉고 PU": "봉고 III PU",
  "프라이드(리오) DC": "리오 DC",
  "스펙트라/쎄라토 LD": "쎄라토 LD",
  "포르테/쎄라토 TD": "쎄라토 TD",
  "옵티마/매그넨티스 MS": "옵티마 MS",
  "로체(옵티마) MG": "로체 MG",

  // --- 제네시스 ---
  "G70": "G70 IK",
  "G80 2세대": "G80 RG3",
  "G90 2세대": "G90 RS4",
  "GV70": "GV70 JK1",
  "GV80": "GV80 JX1",
  "GV60": "GV60 JW",

  // --- KG모빌리티 ---
  "토레스": "토레스 R4",
  "코란도 4세대": "코란도 C300",
  "G4 렉스턴": "렉스턴 Y400",
  "액티언": "액티언 R4",
  "렉스턴(G4) Y400": "렉스턴 Y400",
  "무쏘(렉스턴 스포츠) Q200": "렉스턴 스포츠 Q200",
  "무쏘 EV": "무쏘 EV Q201e",
  "코란도C C200": "코란도 C C200",
  "렉스턴 Y200~Y296": "렉스턴 Y200",
  "액티언(구) A100": "액티언 C100",
  "뉴코란도 KJ": "코란도 KJ",
  "로디우스/투리스모 R100": "로디우스 R100",

  // --- 쉐보레 ---
  "트레일블레이저": "트레일블레이저 RG4",
  "트랙스 2세대": "트랙스 크로스오버 R04",
  "트랙스 크로스오버": "트랙스 크로스오버 R04",
  "타호": "타호 T1XX",
  "트래버스": "트래버스 N1UC",
  "트랙스": "트랙스 U300",
  "이쿼녹스": "이쿼녹스 D",
  "이쿼녹스 EV": "이쿼녹스 EV BEV3",
  "크루즈(라세티P) J300": "크루즈 J300",
  "스파크(마티즈) M300": "스파크 M300",
  "다마스": "다마스 MD",
  "라보": "라보 MD",
  "칼로스(아베오) T200": "칼로스 T200",
  "젠트라(아베오) T250": "젠트라 T250",
  "매그너스L/베리타스 V200L": "베리타스 V200L",
  "윈스톰(캡티바) C100": "윈스톰 C100",
  "실버라도 EV": "실버라도 EV BT1",
  "콜로라도": "콜로라도 T1XX",
};

// 카탈로그 안에 그대로 두지만 BM 매칭 없음 (확인 필요한 잔여 고아)
const KEEP_AS_IS = new Set<string>([
  "투스카니 RD",   // 카탈로그 BM에 미등록 (별도 차종)
  "GV90",         // 출시 예정/미존재 — 수동 검토
  "토레스 KR10",  // 코드 미상 — 수동 검토
  "그랜버드",     // BM에 그대로 존재
]);

function findBlock(src: string, name: string): { start: number; end: number; body: string } | null {
  const marker = `export const ${name} = `;
  const start = src.indexOf(marker);
  if (start === -1) return null;
  const open = src.indexOf("{", start);
  let depth = 0;
  let end = -1;
  for (let j = open; j < src.length; j++) {
    if (src[j] === "{") depth++;
    else if (src[j] === "}") {
      depth--;
      if (depth === 0) {
        end = j + 1;
        break;
      }
    }
  }
  if (end === -1) return null;
  return { start: open, end, body: src.substring(open, end) };
}

function escapeForJsonKey(s: string): string {
  // JSON 키는 큰따옴표로 감싸여 있고 안에 특수문자가 없는 단순 문자열만 다룸
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`[mode] ${apply ? "APPLY" : "DRY-RUN"}`);

  let src = fs.readFileSync(FILE, "utf8");
  const block = findBlock(src, "CAR_GRADES");
  if (!block) {
    console.error("CAR_GRADES 블록을 찾을 수 없음");
    process.exit(1);
  }
  let body = block.body;
  console.log(`[CAR_GRADES] ${body.length} chars`);

  let renamed = 0;
  let alreadyExists = 0;
  let notFound = 0;
  for (const [oldKey, newKey] of Object.entries(RENAME)) {
    const oldPattern = new RegExp(`"${escapeForJsonKey(oldKey)}":\\s*\\[`, "g");
    const newPattern = new RegExp(`"${escapeForJsonKey(newKey)}":\\s*\\[`, "g");
    const oldExists = oldPattern.test(body);
    oldPattern.lastIndex = 0;
    const newExists = newPattern.test(body);
    if (!oldExists) {
      console.log(`  [NOT FOUND] "${oldKey}"`);
      notFound++;
      continue;
    }
    if (newExists) {
      console.log(`  [SKIP - new key already exists] "${oldKey}" → "${newKey}"`);
      alreadyExists++;
      continue;
    }
    // replace
    body = body.replace(oldPattern, `"${newKey}": [`);
    console.log(`  [RENAME] "${oldKey}" → "${newKey}"`);
    renamed++;
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  renamed:        ${renamed}`);
  console.log(`  already exists: ${alreadyExists}`);
  console.log(`  not found:      ${notFound}`);
  console.log(`  keep as-is:     ${KEEP_AS_IS.size} (수동 검토)`);

  if (!apply) {
    console.log(`\n[dry-run] --apply 추가 시 catalog_data.ts에 반영합니다.`);
    return;
  }

  const newSrc = src.substring(0, block.start) + body + src.substring(block.end);
  fs.writeFileSync(FILE, newSrc, "utf8");
  console.log(`\n[apply] 완료: ${FILE} 갱신`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
