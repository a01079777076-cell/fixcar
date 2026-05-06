/**
 * CAR_GRADES 정리 2단계:
 *   1) 미스매치 rename (EV3 SV3 → EV3 SV1, 봉고 III PU → 봉고 3 PU, 옵티마 MS → 로체 MS)
 *   2) BM에 없는 옛 키(중복) 일괄 삭제 — lookup이 새 키만 사용하므로 dead data
 *
 *   dry-run:  npx tsx scripts/cleanup-car-grades.ts
 *   apply:    npx tsx scripts/cleanup-car-grades.ts --apply
 */

import * as fs from "fs";
import * as path from "path";

const FILE = path.join(process.cwd(), "data", "catalog_data.ts");

// (1) 추가 rename — BM과 정확히 일치하도록 정정
const FIX_RENAME: Record<string, string> = {
  "EV3 SV3": "EV3 SV1",
  "봉고 III PU": "봉고 3 PU",
  "옵티마 MS": "로체 MS",
};

// (2) 삭제할 옛 고아 키 — BM과 일치하지 않고, BM에 매칭되는 새 키가 이미 CG에 존재
const DELETE_KEYS = [
  // 현대
  "팰리세이드", "아이오닉5", "아이오닉6", "넥쏘", "코나 2세대",
  "베뉴", "스타리아", "캐스퍼",
  // 기아
  "K5 3세대", "K8", "K9 2세대", "스포티지 5세대", "모하비", "모하비 HM2",
  "카니발 4세대", "셀토스", "EV6", "EV9", "니로 2세대", "레이",
  "모닝 3세대", "비스토/모닝 SA",
  // 제네시스
  "G70", "G80 2세대", "G90 2세대", "GV70", "GV80", "GV60",
  // KG모빌리티
  "코란도 4세대", "렉스턴(G4) Y400",
  // 쉐보레
  "트랙스 크로스오버",
];

// 카탈로그 BM 미존재이지만 보존 (수동 검토 대상)
const KEEP_AS_IS = new Set(["투스카니 RD", "GV90", "토레스 KR10"]);

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
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 한 키 블록 ("key": [ ... ]) 통째로 매칭. 콤마/공백 정리는 별도 처리.
function deleteKeyBlock(body: string, key: string): { body: string; deleted: boolean } {
  const escapedKey = escapeForJsonKey(key);
  // 매칭: "key": [ ... 매칭 ] (배열 끝까지)
  const re = new RegExp(`,?\\s*"${escapedKey}":\\s*\\[[\\s\\S]*?\\n  \\]`, "");
  const m = body.match(re);
  if (!m) return { body, deleted: false };
  return { body: body.replace(re, ""), deleted: true };
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

  // (1) Rename
  console.log(`\n=== STEP 1: RENAME ===`);
  let renamed = 0;
  for (const [oldKey, newKey] of Object.entries(FIX_RENAME)) {
    const oldPattern = new RegExp(`"${escapeForJsonKey(oldKey)}":\\s*\\[`, "g");
    const newPattern = new RegExp(`"${escapeForJsonKey(newKey)}":\\s*\\[`, "g");
    if (newPattern.test(body)) {
      console.log(`  [SKIP - new key exists] "${oldKey}" → "${newKey}"`);
      continue;
    }
    if (!oldPattern.test(body)) {
      console.log(`  [NOT FOUND] "${oldKey}"`);
      continue;
    }
    body = body.replace(oldPattern, `"${newKey}": [`);
    console.log(`  [RENAME] "${oldKey}" → "${newKey}"`);
    renamed++;
  }

  // (2) Delete
  console.log(`\n=== STEP 2: DELETE ORPHAN KEYS ===`);
  let deleted = 0;
  for (const key of DELETE_KEYS) {
    const r = deleteKeyBlock(body, key);
    if (r.deleted) {
      body = r.body;
      console.log(`  [DELETE] "${key}"`);
      deleted++;
    } else {
      console.log(`  [NOT FOUND] "${key}"`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  renamed:    ${renamed}`);
  console.log(`  deleted:    ${deleted}`);
  console.log(`  keep as-is: ${KEEP_AS_IS.size}`);

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
