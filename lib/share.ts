// 📁 저장 경로: lib/share.ts
// 공유 유틸리티 — 카카오톡, 링크 복사, 네이티브 공유

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      Share?: {
        sendDefault: (params: Record<string, unknown>) => void;
      };
    };
  }
}

interface ShareParams {
  title: string;
  description: string;
  imageUrl?: string;
  url: string;
  price?: number;
}

/**
 * 카카오톡 공유
 */
export function shareKakao({ title, description, imageUrl, url, price }: ShareParams) {
  if (!window.Kakao?.isInitialized?.()) {
    alert("카카오 SDK가 로드되지 않았습니다.");
    return;
  }

  window.Kakao?.Share?.sendDefault({
    objectType: "feed",
    content: {
      title,
      description: price ? `${description}\n💰 ${price.toLocaleString()}만원` : description,
      imageUrl: imageUrl || "https://www.fixcar.kr/og-image.png",
      link: { mobileWebUrl: url, webUrl: url },
    },
    buttons: [
      { title: "매물 보기", link: { mobileWebUrl: url, webUrl: url } },
      { title: "픽스카 앱", link: { mobileWebUrl: "https://www.fixcar.kr", webUrl: "https://www.fixcar.kr" } },
    ],
  });
}

/**
 * 링크 복사
 */
export async function copyLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // fallback
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  }
}

/**
 * 네이티브 공유 (모바일)
 */
export async function nativeShare({ title, description, url }: ShareParams): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text: description, url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
