"use client";
import { useRef, useState, useEffect } from "react";
import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, Image as ImageIcon, Type, Palette,
  Quote, Minus, ChevronDown,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  onImageUpload?: (url: string) => void;
}

const FONTS: { label: string; val: string }[] = [
  { label: "기본서체",   val: "NanumSquareRound" },
  { label: "나눔고딕",   val: "Nanum Gothic" },
  { label: "나눔스퀘어", val: "NanumSquare" },
  { label: "바른히피",   val: "NanumBarunHipi" },
];

/* pt 프리셋 (네이버 블로그 기준 자주 쓰이는 값) */
const SIZES_PT = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 48];

const COLORS = ["#1A1A1A","#FF3B1E","#1847FF","#2D8A52","#E8A020","#9B30FF","#888888","#FF6B9D"];

/* 글꼴 + 인용구/구분선 스타일 — 에디터·본문 양쪽에 동일하게 주입 (BlogContent 와 동일) */
const EDITOR_CSS = `
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

.fixcar-blog-editor .editor-area blockquote {
  border-left: 4px solid #FF3B1E;
  margin: 16px 0;
  padding: 10px 18px;
  color: #555;
  background: #FAFAF8;
  border-radius: 0 8px 8px 0;
}
.fixcar-blog-editor .editor-area hr {
  border: none;
  border-top: 1px solid #E0DDD7;
  margin: 24px 0;
}
.fixcar-blog-editor .editor-area img {
  max-width: 100%;
  border-radius: 8px;
  margin: 12px 0;
}
`;

export default function BlogEditor({ value, onChange, onImageUpload }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ptInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [openMenu, setOpenMenu] = useState<"" | "color" | "size" | "font">("");
  const initializedRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !initializedRef.current && value) {
      editorRef.current.innerHTML = value;
      initializedRef.current = true;
    }
  }, [value]);

  /* 외부 클릭 시 드롭다운 닫기 */
  useEffect(() => {
    if (!openMenu) return;
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenu("");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenu]);

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    syncContent();
  };

  const syncContent = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  /* pt 단위 글자 크기 적용
     - 선택 영역이 있으면: execCommand("fontSize","7") 로 정규화 → font[size=7] 을 span style 로 교체
     - 커서만 있을 때: 영폭 공백을 가진 span 삽입 후 커서 진입 → 다음 입력부터 적용 */
  const applyFontSize = (pt: number) => {
    if (!pt || pt < 6 || pt > 200) return;
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel) return;

    if (sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = `${pt}pt`;
      const zw = document.createTextNode("​");
      span.appendChild(zw);
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.setStart(zw, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      document.execCommand("fontSize", false, "7");
      editorRef.current?.querySelectorAll('font[size="7"]').forEach((f) => {
        const span = document.createElement("span");
        span.style.fontSize = `${pt}pt`;
        span.innerHTML = (f as HTMLElement).innerHTML;
        /* 내부 span 의 옛 font-size 제거 (중첩 방지) */
        span.querySelectorAll("span").forEach((s) => {
          if (s.style.fontSize) s.style.fontSize = "";
          if (!s.getAttribute("style")) s.removeAttribute("style");
        });
        f.replaceWith(span);
      });
    }
    syncContent();
    setOpenMenu("");
  };

  const applyFont = (val: string) => {
    editorRef.current?.focus();
    document.execCommand("fontName", false, val);
    syncContent();
    setOpenMenu("");
  };

  const insertBlockquote = () => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, "blockquote");
    syncContent();
  };

  const insertDivider = () => exec("insertHorizontalRule");

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url || data.secure_url) {
          const url = data.url || data.secure_url;
          exec("insertHTML", `<img src="${url}" style="max-width:100%;border-radius:8px;margin:12px 0;" />`);
          onImageUpload?.(url);
        } else {
          alert("업로드 실패: " + (data.error || "다시 시도해주세요"));
        }
      } catch { alert("업로드 중 오류"); }
      setUploading(false);
    };
    input.click();
  };

  const ToolBtn = ({ onClick, active, children, title }: {
    onClick: () => void; active?: boolean; children: React.ReactNode; title: string;
  }) => (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      style={{
        padding: "6px 8px", border: "none", borderRadius: 6, cursor: "pointer",
        background: active ? "#E8E6E1" : "transparent", color: "#555",
        display: "flex", alignItems: "center",
        fontFamily: "'NanumSquareRound',sans-serif",
      }}
    >{children}</button>
  );

  const Sep = () => <div style={{ width: 1, height: 20, background: "#E0DDD7", margin: "0 4px" }} />;

  return (
    <>
      <style>{EDITOR_CSS}</style>
      <div
        ref={containerRef}
        className="fixcar-blog-editor"
        style={{ border: "1.5px solid #E0DDD7", borderRadius: 14, overflow: "hidden", background: "white" }}
      >
        {/* 툴바 */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 2, padding: "8px 10px",
          borderBottom: "1px solid #F0EEE9", background: "#FAFAF8", alignItems: "center",
        }}>
          {/* 글꼴 드롭다운 */}
          <div style={{ position: "relative" }}>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => { e.preventDefault(); setOpenMenu(openMenu === "font" ? "" : "font"); }}
              title="글꼴"
              style={{
                padding: "6px 10px", border: "1px solid #E0DDD7", borderRadius: 6,
                background: "white", cursor: "pointer", fontSize: 12, fontWeight: 700,
                color: "#444", display: "flex", alignItems: "center", gap: 4,
                fontFamily: "'NanumSquareRound',sans-serif",
              }}
            >
              글꼴 <ChevronDown size={12} />
            </button>
            {openMenu === "font" && (
              <div style={{
                position: "absolute", top: "100%", left: 0, marginTop: 4,
                background: "white", borderRadius: 10,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)", padding: 6, zIndex: 20, minWidth: 160,
              }}>
                {FONTS.map((f) => (
                  <button
                    key={f.label}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyFont(f.val)}
                    style={{
                      display: "block", width: "100%", padding: "8px 14px", border: "none",
                      background: "transparent", fontSize: 14, color: "#333",
                      textAlign: "left", cursor: "pointer", borderRadius: 6,
                      fontFamily: `'${f.val}', sans-serif`,
                    }}
                  >{f.label}</button>
                ))}
              </div>
            )}
          </div>
          <Sep />

          <ToolBtn onClick={() => exec("bold")} title="굵게"><Bold size={16}/></ToolBtn>
          <ToolBtn onClick={() => exec("italic")} title="기울임"><Italic size={16}/></ToolBtn>
          <ToolBtn onClick={() => exec("underline")} title="밑줄"><Underline size={16}/></ToolBtn>
          <Sep />

          <ToolBtn onClick={() => exec("justifyLeft")} title="왼쪽 정렬"><AlignLeft size={16}/></ToolBtn>
          <ToolBtn onClick={() => exec("justifyCenter")} title="가운데 정렬"><AlignCenter size={16}/></ToolBtn>
          <ToolBtn onClick={() => exec("justifyRight")} title="오른쪽 정렬"><AlignRight size={16}/></ToolBtn>
          <ToolBtn onClick={() => exec("justifyFull")} title="양쪽 정렬"><AlignJustify size={16}/></ToolBtn>
          <Sep />

          <ToolBtn onClick={() => exec("insertUnorderedList")} title="목록"><List size={16}/></ToolBtn>
          <ToolBtn onClick={insertBlockquote} title="인용구"><Quote size={16}/></ToolBtn>
          <ToolBtn onClick={insertDivider} title="구분선"><Minus size={16}/></ToolBtn>
          <Sep />

          {/* 글자 크기 (pt 단위) */}
          <div style={{ position: "relative" }}>
            <ToolBtn onClick={() => setOpenMenu(openMenu === "size" ? "" : "size")} title="글자 크기 (pt)">
              <Type size={16}/>
            </ToolBtn>
            {openMenu === "size" && (
              <div style={{
                position: "absolute", top: "100%", left: 0, marginTop: 4,
                background: "white", borderRadius: 10,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)", padding: 8, zIndex: 20, minWidth: 220,
              }}>
                {/* 직접 입력 */}
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
                  <input
                    ref={ptInputRef}
                    type="number"
                    min={6}
                    max={100}
                    defaultValue={14}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const v = Number((e.target as HTMLInputElement).value);
                        if (v) applyFontSize(v);
                      }
                    }}
                    style={{
                      width: 70, padding: "6px 8px", border: "1.5px solid #E0DDD7", borderRadius: 6,
                      fontSize: 13, fontFamily: "'NanumSquareRound',sans-serif", outline: "none",
                    }}
                  />
                  <span style={{ fontSize: 12, color: "#888", fontWeight: 700 }}>pt</span>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      const v = Number(ptInputRef.current?.value);
                      if (v) applyFontSize(v);
                    }}
                    style={{
                      padding: "6px 12px", border: "none", background: "#FF3B1E", color: "white",
                      borderRadius: 6, fontSize: 12, fontWeight: 800, cursor: "pointer",
                      fontFamily: "'NanumSquareRound',sans-serif",
                    }}
                  >적용</button>
                </div>
                <div style={{ height: 1, background: "#F0EEE9", margin: "0 0 6px" }} />
                {/* 프리셋 */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                  {SIZES_PT.map((pt) => (
                    <button
                      key={pt}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyFontSize(pt)}
                      style={{
                        padding: "7px 0", border: "none", background: "transparent",
                        fontSize: 13, fontWeight: 600, color: "#333",
                        cursor: "pointer", borderRadius: 6,
                        fontFamily: "'NanumSquareRound',sans-serif",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F0EEE9")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >{pt}pt</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 글자 색상 */}
          <div style={{ position: "relative" }}>
            <ToolBtn onClick={() => setOpenMenu(openMenu === "color" ? "" : "color")} title="글자 색상">
              <Palette size={16}/>
            </ToolBtn>
            {openMenu === "color" && (
              <div style={{
                position: "absolute", top: "100%", left: 0, marginTop: 4,
                background: "white", borderRadius: 10,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)", padding: 8, zIndex: 20,
                display: "flex", gap: 4,
              }}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { exec("foreColor", c); setOpenMenu(""); }}
                    style={{
                      width: 24, height: 24, borderRadius: "50%",
                      border: "2px solid #E8E6E1", background: c, cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <Sep />

          <ToolBtn onClick={handleImageUpload} title="이미지 삽입">
            <ImageIcon size={16}/> {uploading && <span style={{ fontSize: 11, marginLeft: 4 }}>업로드중...</span>}
          </ToolBtn>
        </div>

        {/* 에디터 영역 */}
        <div
          ref={editorRef}
          className="editor-area"
          contentEditable
          suppressContentEditableWarning
          onInput={syncContent}
          onBlur={syncContent}
          style={{
            minHeight: 300, padding: "18px 22px", fontSize: 15, lineHeight: 1.9, color: "#333",
            outline: "none", fontFamily: "'NanumSquareRound',sans-serif",
          }}
        />
      </div>
    </>
  );
}
