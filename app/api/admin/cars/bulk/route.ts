// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/admin/cars/bulk/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import * as XLSX from "xlsx";

const s = (v: unknown, def = ""): string => { const r = String(v ?? "").trim(); return r === "undefined" ? def : r || def; };
const n = (v: unknown, def = 0): number => { const r = Number(v); return isNaN(r) ? def : r; };

export async function POST(req: NextRequest) {
  const result = requireAdmin(req);
  if (result instanceof NextResponse) return result;
  const admin = result;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    if (!ws) return NextResponse.json({ error: "시트를 읽을 수 없습니다" }, { status: 400 });

    /* row 1 = 헤더, row 2 = 가이드(스킵), row 3+ = 데이터 */
    const allRows: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
    /* 첫 행이 가이드행이면 제거 (값에 "예:" 포함 여부로 판단) */
    const rows = allRows.filter(r => {
      const brand = String(r["브랜드 *"] || "").trim();
      return brand && !brand.startsWith("예:");
    });
    if (rows.length === 0) return NextResponse.json({ error: "데이터가 없습니다" }, { status: 400 });

    let dealer = await prisma.dealer.findUnique({ where: { userId: admin.id } });
    if (!dealer) {
      dealer = await prisma.dealer.create({ data: { userId: admin.id, shopName: "픽스카 관리자", verified: true } });
    }

    const results: { row: number; success: boolean; name?: string; error?: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const brand = s(r["브랜드 *"]);
      const model = s(r["모델명 *"]);
      const price = n(r["판매가(만원) *"]);

      if (!brand || !model || !price) {
        results.push({ row: i + 3, success: false, error: "브랜드/모델명/판매가 필수" });
        continue;
      }

      try {
        const options = s(r["옵션 (콤마구분)"]).split(",").map(x => x.trim()).filter(Boolean);
        const accident = s(r["사고여부 *"], "무사고").includes("있음");
        const fullName = [model, s(r["세부모델"]), s(r["등급"])].filter(Boolean).join(" ");
        const saleType = s(r["판매구분"], "일반차량");

        /* 설명글 + 리스/렌트 정보 */
        let desc = s(r["설명글"]);
        if (saleType === "리스승계차량") {
          const info = [`[리스승계 정보]`, s(r["리스종류"]) && `리스종류: ${s(r["리스종류"])}`, s(r["리스사"]) && `리스사: ${s(r["리스사"])}`, s(r["리스기간 시작"]) && `리스기간: ${s(r["리스기간 시작"])}~${s(r["리스기간 종료"])}`, s(r["월리스료(만원)"]) && `월리스료: ${s(r["월리스료(만원)"])}만원`, s(r["리스 보증금(만원)"]) && `보증금: ${s(r["리스 보증금(만원)"])}만원`, s(r["리스 잔존가치(만원)"]) && `잔존가치: ${s(r["리스 잔존가치(만원)"])}만원`, s(r["리스 인수정산금(만원)"]) && `인수정산금: ${s(r["리스 인수정산금(만원)"])}만원`].filter(Boolean).join("\n");
          if (info.split("\n").length > 1) desc = desc ? `${desc}\n\n${info}` : info;
        }
        if (saleType === "렌트차량") {
          const info = [`[렌트 정보]`, s(r["렌트사"]) && `렌트사: ${s(r["렌트사"])}`, s(r["렌트기간 시작"]) && `렌트기간: ${s(r["렌트기간 시작"])}~${s(r["렌트기간 종료"])}`, s(r["월렌트료(만원)"]) && `월렌트료: ${s(r["월렌트료(만원)"])}만원`, s(r["렌트 보증금(만원)"]) && `보증금: ${s(r["렌트 보증금(만원)"])}만원`, s(r["렌트 잔존가치(만원)"]) && `잔존가치: ${s(r["렌트 잔존가치(만원)"])}만원`, s(r["렌트 인수정산금(만원)"]) && `인수정산금: ${s(r["렌트 인수정산금(만원)"])}만원`].filter(Boolean).join("\n");
          if (info.split("\n").length > 1) desc = desc ? `${desc}\n\n${info}` : info;
        }

        /* 태그 자동 */
        const tags: string[] = [];
        if (!accident) tags.push("무사고");
        if (saleType === "리스승계차량") tags.push("리스승계");
        if (saleType === "렌트차량") tags.push("렌트");
        if (s(r["연료 *"]) === "전기") tags.push("전기차");
        if (n(r["주행거리(km) *"]) < 30000) tags.push("저주행");

        const car = await prisma.car.create({
          data: {
            dealerId: dealer.id, brand, name: fullName,
            year: n(r["연식(년) *"], new Date().getFullYear()),
            mileage: n(r["주행거리(km) *"]), fuel: s(r["연료 *"], "가솔린"),
            transmission: s(r["변속기 *"], "오토"), color: s(r["색상 *"]),
            cc: n(r["배기량(cc)"]), owners: n(r["소유자수"], 1),
            accident, price, region: s(r["지역"], "광주"),
            status: "REVIEWING", tags, options, images: [],
            description: desc.slice(0, 5000) || null,
            inspected: false, views: 0,
          },
        });
        results.push({ row: i + 3, success: true, name: `${brand} ${fullName}` });
      } catch (e) {
        results.push({ row: i + 3, success: false, name: `${brand} ${model}`, error: String(e).slice(0, 100) });
      }
    }

    const ok = results.filter(r => r.success).length;
    const fail = results.filter(r => !r.success).length;
    return NextResponse.json({ success: true, message: `✅ ${ok}건 등록 (사진은 관리자 페이지에서 수기 등록)${fail > 0 ? ` · ❌ ${fail}건 실패` : ""}`, total: rows.length, successCount: ok, failCount: fail, details: results });
  } catch (e) {
    console.error("Bulk upload error:", e);
    return NextResponse.json({ error: "엑셀 처리 실패: " + String(e).slice(0, 200) }, { status: 500 });
  }
}
