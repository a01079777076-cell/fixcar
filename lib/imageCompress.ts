// 📁 저장 경로: lib/imageCompress.ts
// 클라이언트 사이드 이미지 압축 유틸리티
// 4.5MB 이상 사진을 자동 리사이즈+압축하여 업로드 속도 개선

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeMB?: number;
  quality?: number;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const { maxWidth = 1920, maxHeight = 1440, maxSizeMB = 4.5, quality = 0.85 } = options;

  // 이미 작으면 그대로 반환
  if (file.size <= maxSizeMB * 1024 * 1024) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      // 비율 유지하면서 리사이즈
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("압축 실패")); return; }
          const compressed = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          console.log(`[ImageCompress] ${(file.size/1024/1024).toFixed(1)}MB → ${(compressed.size/1024/1024).toFixed(1)}MB`);
          resolve(compressed);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => reject(new Error("이미지 로드 실패"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 여러 이미지를 병렬 압축
 */
export async function compressImages(
  files: File[],
  options?: CompressOptions
): Promise<File[]> {
  return Promise.all(files.map(f => compressImage(f, options)));
}
