"use client";

/**
 * 블로그 본문 렌더러 v2
 * - HTML(리치 에디터 출력) 지원
 * - 기존 [이미지: URL] 텍스트도 변환
 * - XSS 방지: script/iframe/on* 제거
 */
export default function BlogContent({ content }: { content: string }) {
  if (!content) return null;

  /* HTML 태그 포함 여부 확인 */
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    /* HTML 정제 (위험 태그/속성 제거) */
    const cleaned = content
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/javascript:/gi, "");

    return (
      <div
        style={{ fontSize: 15, color: "#333", lineHeight: 2.0, fontWeight: 400 }}
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  }

  /* 기존 텍스트 형식 — [이미지: URL] 변환 */
  const parts = content.split(/(\[이미지:\s*https?:\/\/[^\]]+\])/g);

  return (
    <div style={{ fontSize: 15, color: "#333", lineHeight: 2.0, fontWeight: 400 }}>
      {parts.map((part, i) => {
        const imgMatch = part.match(/\[이미지:\s*(https?:\/\/[^\]]+)\]/);
        if (imgMatch) {
          return (
            <div key={i} style={{ margin: "20px 0", borderRadius: 12, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgMatch[1]}
                alt="블로그 이미지"
                style={{ width: "100%", maxHeight: 500, objectFit: "cover", display: "block", borderRadius: 12 }}
              />
            </div>
          );
        }
        return (
          <span key={i}>
            {part.split("\n").map((line, j) => (
              <span key={j}>
                {line}
                {j < part.split("\n").length - 1 && <br />}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
}
