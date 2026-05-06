"use client";

/**
 * 블로그 본문 렌더러 v3
 * - HTML(리치 에디터 출력) 지원: blockquote, hr, font face, 정렬, 색상 모두 적용
 * - 기존 [이미지: URL] 텍스트 폼도 호환
 * - XSS 방지: script/iframe/on* 제거
 */

const RENDER_CSS = `
@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap');

@font-face {
  font-family: 'NanumSquare';
  src: local('NanumSquare'),
       url('https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquare/NanumSquareR.woff2') format('woff2'),
       url('https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquare/NanumSquareR.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'NanumBarunHipi';
  src: local('NanumBarunHipi'),
       url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2107@1.1/NanumSonGeulSsiBarunHipi.woff') format('woff'),
       url('https://hangeul.pstatic.net/hangeul_static/webfont/nanumbarunhipi/NanumBarunHipi.woff') format('woff');
  font-display: swap;
}

.fixcar-blog-render blockquote {
  border-left: 4px solid #FF3B1E;
  margin: 16px 0;
  padding: 10px 18px;
  color: #555;
  background: #FAFAF8;
  border-radius: 0 8px 8px 0;
}
.fixcar-blog-render hr {
  border: none;
  border-top: 1px solid #E0DDD7;
  margin: 24px 0;
}
.fixcar-blog-render img {
  max-width: 100%;
  border-radius: 8px;
  margin: 12px 0;
}
.fixcar-blog-render ul, .fixcar-blog-render ol {
  padding-left: 24px;
  margin: 8px 0;
}
`;

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
      <>
        <style>{RENDER_CSS}</style>
        <div
          className="fixcar-blog-render"
          style={{ fontSize: 15, color: "#333", lineHeight: 2.0, fontWeight: 400 }}
          dangerouslySetInnerHTML={{ __html: cleaned }}
        />
      </>
    );
  }

  /* 기존 텍스트 형식 — [이미지: URL] 변환 */
  const parts = content.split(/(\[이미지:\s*https?:\/\/[^\]]+\])/g);

  return (
    <>
      <style>{RENDER_CSS}</style>
      <div className="fixcar-blog-render" style={{ fontSize: 15, color: "#333", lineHeight: 2.0, fontWeight: 400 }}>
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
    </>
  );
}
