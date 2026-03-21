"use client";

/**
 * 블로그 본문 렌더러
 * [이미지: URL] 형식을 실제 <img>로 변환
 */
export default function BlogContent({ content }: { content: string }) {
  if (!content) return null;

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
        /* 일반 텍스트 — 줄바꿈 처리 */
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
