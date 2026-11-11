// 📁 저장 경로: app/api/admin/master/[model]/route.ts
// 운영자 통합관리 — 아무 테이블이나 목록 조회 (검색·필터·정렬·페이지)
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getModel, delegate, safeSelect, buildSearch, buildFilters, LIST_INCLUDE } from "@/lib/admin-master";

export async function GET(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const { model: modelName } = await params;
  const model = getModel(modelName);
  if (!model) return NextResponse.json({ success: false, error: "없는 테이블입니다" }, { status: 404 });

  try {
    const sp = new URL(req.url).searchParams;
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const size = Math.min(200, Math.max(1, Number(sp.get("size")) || 50));
    const q = (sp.get("q") || "").trim();

    const sortField = sp.get("sort") || model.idField;
    const sortOk = model.fields.some(f => f.name === sortField && !f.hidden && !f.isList);
    const dir = sp.get("dir") === "asc" ? "asc" : "desc";

    let filters: Record<string, unknown>;
    try { filters = buildFilters(model, sp); }
    catch (e) { return NextResponse.json({ success: false, error: String((e as Error).message) }, { status: 400 }); }

    const where = { ...filters, ...(q ? buildSearch(model, q) : {}) };
    const select = { ...safeSelect(model), ...(LIST_INCLUDE[model.name] || {}) };

    const db = delegate(model);
    const [rows, total] = await Promise.all([
      db.findMany({
        where, select,
        orderBy: { [sortOk ? sortField : model.idField]: dir },
        skip: (page - 1) * size, take: size,
      }),
      db.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: { rows, total, page, size } });
  } catch (e) {
    console.error(`[admin/master] list ${modelName} error:`, e);
    return NextResponse.json({ success: false, error: "목록을 불러오지 못했습니다" }, { status: 500 });
  }
}
