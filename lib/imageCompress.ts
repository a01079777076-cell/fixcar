// 📁 저장 경로: lib/imageCompress.ts
// 클라이언트 사이드 이미지 압축 유틸리티
// - 모든 사진을 긴 변 1920px 이하 JPEG로 변환 → 저장 용량·전송량 절감
// - Vercel 함수 요청 한도(4.5MB) 초과로 업로드가 실패하는 문제 방지

interface CompressOptions {
  /** 긴 변 최대 픽셀 (기본 1920) */
  maxSide?: number;
  /** JPEG 품질 0~1 (기본 0.82) */
  quality?: number;
  /** 이 크기 이하이고 해상도도 작으면 그대로 사용 (기본 400KB) */
  skipUnderBytes?: number;
}

/** 압축하지 않는 형식 (애니메이션·벡터) */
const PASS_THROUGH = ["image/gif", "image/svg+xml"];

export async function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
  const { maxSide = 1920, quality = 0.82, skipUnderBytes = 400 * 1024 } = options;
  if (!file.type.startsWith("image/") || PASS_THROUGH.includes(file.type)) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      const scale = Math.min(1, maxSide / Math.max(width, height));

      /* 이미 작은 사진은 그대로 */
      if (scale === 1 && file.size <= skipUnderBytes) { resolve(file); return; }

      const w = Math.round(width * scale);
      const h = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob((blob) => {
        /* 압축 결과가 더 크면 원본 사용 */
        if (!blob || blob.size >= file.size) { resolve(file); return; }
        resolve(new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg", lastModified: Date.now() }));
      }, "image/jpeg", quality);
    };

    /* 브라우저가 못 읽는 형식(일부 HEIC 등)은 원본 그대로 — 업로드 단계에서 용량 검사 */
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

/** 여러 이미지 압축 (순차 — 휴대폰 메모리 부담 줄이기) */
export async function compressImages(files: File[], options?: CompressOptions): Promise<File[]> {
  const out: File[] = [];
  for (const f of files) out.push(await compressImage(f, options));
  return out;
}
