// 📁 저장 경로: app/api/admin/master/[model]/[id]/route.ts
// 운영자 통합관리 — 레코드 단건 조회 / 수정 / 삭제
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { getModel, delegate, safeSelect, parseId, buildUpdateData } from "@/lib/admin-master";

type Ctx = { params: Promise<{ model: string; id: string }> };

async function resolve(req: NextRequest, ctx: Ctx) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return { error: admin };
  const { model: modelName, id } = await ctx.params;
  const model = getModel(modelName);
  if (!model) return { error: NextResponse.json({ success: false, error: "없는 테이블입니다" }, { status: 404 }) };
  return { admin, model, id: parseId(model, id) };
}

/* Prisma 에러 → 사람이 읽을 수 있는 메시지 */
function prismaMessage(e: unknown): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2025") return "레코드를 찾을 수 없습니다";
    if (e.code === "P2002") return "중복된 값이 있습니다 (고유값 충돌)";
    if (e.code === "P2003") return "다른 데이터가 이 항목을 참조하고 있어 처리할 수 없습니다. 연결된 데이터를 먼저 정리하세요";
  }
  return (e as Error)?.message || "처리 실패";
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const r = await resolve(req, ctx);
  if ("error" in r) return r.error;
  const row = await delegate(r.model).findUnique({ where: { [r.model.idField]: r.id }, select: safeSelect(r.model) });
  if (!row) return NextResponse.json({ success: false, error: "레코드를 찾을 수 없습니다" }, { status: 404 });
  return NextResponse.json({ success: true, data: row });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const r = await resolve(req, ctx);
  if ("error" in r) return r.error;

  let data: Record<string, unknown>;
  try { data = buildUpdateData(r.model, await req.json()); }
  catch (e) { return NextResponse.json({ success: false, error: (e as Error).message }, { status: 400 }); }
  if (Object.keys(data).length === 0) return NextResponse.json({ success: false, error: "변경할 항목이 없습니다" }, { status: 400 });

  /* 운영자 본인 계정의 관리자 권한 해제 방지 */
  if (r.model.name === "User" && r.id === r.admin.id && "role" in data && data.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "본인 계정의 관리자 권한은 해제할 수 없습니다" }, { status: 400 });
  }

  try {
    const row = await delegate(r.model).update({ where: { [r.model.idField]: r.id }, data, select: safeSelect(r.model) });
    console.log(`[admin/master] UPDATE ${r.model.name}#${r.id} by admin#${r.admin.id}:`, Object.keys(data).join(","));
    return NextResponse.json({ success: true, data: row });
  } catch (e) {
    return NextResponse.json({ success: false, error: prismaMessage(e) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const r = await resolve(req, ctx);
  if ("error" in r) return r.error;

  if (r.model.name === "User" && r.id === r.admin.id) {
    return NextResponse.json({ success: false, error: "본인 계정은 삭제할 수 없습니다" }, { status: 400 });
  }

  try {
    await delegate(r.model).delete({ where: { [r.model.idField]: r.id } });
    console.log(`[admin/master] DELETE ${r.model.name}#${r.id} by admin#${r.admin.id}`);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: prismaMessage(e) }, { status: 400 });
  }
}
