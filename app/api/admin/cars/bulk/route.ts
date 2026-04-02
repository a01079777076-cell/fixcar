// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/admin/cars/bulk/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import * as XLSX from "xlsx";

/* POST: 엑셀 파일 업로드 → 매물 일괄 등록 */
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

    const rows: any[] = XLSX.utils.sheet_to_json(ws, { range: 1, defval: "" });
    /* range:1 → 2행(가이드) 스킵, 3행부터 데이터 */

    if (rows.length === 0) return NextResponse.json({ error: "데이터가 없습니다" }, { status: 400 });

    /* 딜러 레코드 확인/생성 */
    let dealer = await prisma.dealer.findUnique({ where: { userId: admin.id } });
    if (!dealer) {
      dealer = await prisma.dealer.create({
        data: { userId: admin.id, shopName: "픽스카 관리자", verified: true },
      });
    }

    const results: { row: number; success: boolean; name?: string; error?: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const brand = String(r["브랜드 *"] || "").trim();
      const name  = String(r["모델명 *"] || "").trim();
      const price = Number(r["판매가(만원) *"]) || 0;

      if (!brand || !name || !price) {
        results.push({ row: i + 3, success: false, error: "브랜드/모델명/판매가 필수" });
        continue;
      }

      try {
        const images: string[] = [];
        for (const col of ["메인사진1 URL", "메인사진2 URL", "메인사진3 URL", "메인사진4 URL", "실내사진 URL"]) {
          const url = String(r[col] || "").trim();
          if (url && url.startsWith("http")) images.push(url);
        }

        const options = String(r["옵션 (콤마구분)"] || "").split(",").map(s => s.trim()).filter(Boolean);
        const accident = String(r["사고여부"] || "").includes("있음");

        const carData: any = {
          dealerId:     dealer.id,
          brand,
          name:         `${name}${r["세부모델"] ? " " + r["세부모델"] : ""}${r["등급"] ? " " + r["등급"] : ""}`,
          year:         Number(r["연식(년) *"]) || new Date().getFullYear(),
          mileage:      Number(r["주행거리(km) *"]) || 0,
          fuel:         String(r["연료 *"] || "가솔린"),
          transmission: String(r["변속기 *"] || "오토"),
          color:        String(r["색상 *"] || ""),
          cc:           Number(r["배기량(cc)"]) || 0,
          owners:       Number(r["소유자수"]) || 1,
          accident,
          price,
          region:       String(r["지역"] || "광주"),
          status:       "REVIEWING",
          tags:         [],
          options,
          images,
          description:  String(r["설명글"] || "").slice(0, 5000) || null,
          inspected:    false,
          views:        0,
        };

        const car = await prisma.car.create({ data: carData });
        results.push({ row: i + 3, success: true, name: `${brand} ${name}` });
      } catch (e) {
        results.push({ row: i + 3, success: false, name: `${brand} ${name}`, error: String(e).slice(0, 100) });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `${successCount}건 등록 완료, ${failCount}건 실패`,
      total: rows.length,
      successCount,
      failCount,
      details: results,
    });
  } catch (e) {
    console.error("Bulk upload error:", e);
    return NextResponse.json({ error: "엑셀 처리 실패: " + String(e).slice(0, 200) }, { status: 500 });
  }
}
