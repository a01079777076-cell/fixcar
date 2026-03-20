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

/* POST: 오류 신고 접수 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = await loadErrors();

    const report: ErrorReport = {
      id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      page: body.page || body.url || "알 수 없음",
      description: body.description || body.message || body.wrongInfo || "",
      userAgent: req.headers.get("user-agent") || "",
      createdAt: new Date().toISOString(),
      status: "PENDING",
    };

    errors.unshift(report);
    await saveErrors(errors);

    return NextResponse.json({ success: true, id: report.id });
  } catch (e) {
    console.error("Error report save failed:", e);
    return NextResponse.json({ error: "신고 접수 실패", detail: String(e) }, { status: 500 });
  }
}
