import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

/* DB 테이블 없이 JSON 파일로 설정 저장 */
const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

const DEFAULT_SETTINGS = {
  siteName: "픽스카 FIXCAR",
  siteDesc: "광주 중고차 정찰제 플랫폼",
  phone: "062-000-0000",
  email: "info@fixcar.kr",
  address: "광주광역시",
  notice: "",
  bannerText: "",
  maintenanceMode: false,
};

async function loadSettings() {
  try {
    const data = await readFile(SETTINGS_PATH, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings: Record<string, unknown>) {
  const dir = path.dirname(SETTINGS_PATH);
  await mkdir(dir, { recursive: true });
  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
}

export async function GET() {
  const settings = await loadSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await loadSettings();
    const merged = { ...current, ...body };
    await saveSettings(merged);
    return NextResponse.json({ success: true, settings: merged });
  } catch (e) {
    console.error("Settings save error:", e);
    return NextResponse.json({ error: "설정 저장 실패", detail: String(e) }, { status: 500 });
  }
}
