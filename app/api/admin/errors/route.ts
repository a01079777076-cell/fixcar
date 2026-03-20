import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const ERRORS_PATH = path.join(process.cwd(), "data", "error_reports.json");

interface ErrorReport {
  id: string;
  page: string;
  description: string;
  userAgent: string;
  createdAt: string;
  status: string;
}

async function loadErrors(): Promise<ErrorReport[]> {
  try {
    const data = await readFile(ERRORS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveErrors(errors: ErrorReport[]) {
  const dir = path.dirname(ERRORS_PATH);
  await mkdir(dir, { recursive: true });
  await writeFile(ERRORS_PATH, JSON.stringify(errors, null, 2), "utf-8");
}

/* GET: 전체 오류 목록 */
export async function GET() {
  const errors = await loadErrors();
  return NextResponse.json(errors);
}

/* PATCH: 처리 완료 표시 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ error: "id 필수" }, { status: 400 });

    const errors = await loadErrors();
    const idx = errors.findIndex(e => e.id === id);
    if (idx === -1) return NextResponse.json({ error: "오류 신고를 찾을 수 없습니다" }, { status: 404 });

    errors[idx].status = status || "RESOLVED";
    await saveErrors(errors);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "처리 실패", detail: String(e) }, { status: 500 });
  }
}
