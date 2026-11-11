// 📁 저장 경로: lib/uploadImage.ts
// 공용 사진 업로드 (클라이언트 전용) — 압축 → /api/upload → 결과/실패 사유 반환
import { compressImage } from "@/lib/imageCompress";

/** Vercel 함수 요청 본문 한도 4.5MB — 여유를 두고 4.3MB */
const MAX_UPLOAD_BYTES = 4.3 * 1024 * 1024;

export type UploadResult = { ok: true; url: string } | { ok: false; error: string; fileName: string };

export async function uploadImage(file: File): Promise<UploadResult> {
  const fileName = file.name;
  try {
    const compressed = await compressImage(file);
    if (compressed.size > MAX_UPLOAD_BYTES) {
      return { ok: false, fileName, error: "사진 용량이 너무 커요 (지원하지 않는 형식이면 JPG로 바꿔 올려주세요)" };
    }

    const fd = new FormData();
    fd.append("file", compressed);
    const res = await fetch("/api/upload", { method: "POST", body: fd });

    if (res.status === 413) return { ok: false, fileName, error: "사진 용량이 너무 커요" };
    if (res.status === 401) return { ok: false, fileName, error: "로그인이 필요해요" };

    const d = await res.json().catch(() => ({}));
    if (res.ok && d.success && d.url) return { ok: true, url: d.url };
    return { ok: false, fileName, error: d.error || `업로드 실패 (${res.status})` };
  } catch {
    return { ok: false, fileName, error: "네트워크 오류" };
  }
}

/**
 * 여러 장 순차 업로드 — 성공 URL과 실패 목록을 함께 반환
 * onUploaded: 한 장 성공할 때마다 호출 (화면에 바로 반영)
 */
export async function uploadImages(
  files: File[],
  onUploaded?: (url: string) => void
): Promise<{ urls: string[]; failed: { fileName: string; error: string }[] }> {
  const urls: string[] = [];
  const failed: { fileName: string; error: string }[] = [];
  for (const f of files) {
    const r = await uploadImage(f);
    if (r.ok) { urls.push(r.url); onUploaded?.(r.url); }
    else failed.push({ fileName: r.fileName, error: r.error });
  }
  return { urls, failed };
}

/** 실패 목록 → 사용자 안내 문구 */
export function failedMessage(failed: { fileName: string; error: string }[], total: number): string {
  if (failed.length === 0) return "";
  const lines = failed.slice(0, 5).map(f => `· ${f.fileName}: ${f.error}`).join("\n");
  const more = failed.length > 5 ? `\n…외 ${failed.length - 5}장` : "";
  return `사진 ${total}장 중 ${failed.length}장 업로드 실패\n${lines}${more}`;
}
