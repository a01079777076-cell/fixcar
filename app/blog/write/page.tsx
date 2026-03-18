"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, ArrowLeft, Plus, X, Tag } from "lucide-react";

const CATEGORIES = ["구매 가이드", "차량 추천", "추천 용품", "전기차", "관리 팁", "딜러 인터뷰"];

export default function BlogWritePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    category: "구매 가이드",
    content: "",
    products: [] as { name: string; url: string; platform: string }[],
    tags: [] as string[],
  });
  const [newProduct, setNewProduct] = useState({ name: "", url: "", platform: "쿠팡" });
  const [newTag, setNewTag] = useState("");

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(d => {
        setUser(d.user);
        setLoading(false);
        if (d.user?.role !== "ADMIN") router.push("/");
      })
      .catch(() => { setLoading(false); router.push("/"); });
  }, []);

  const addProduct = () => {
    if (!newProduct.name || !newProduct.url) return;
    setForm(p => ({ ...p, products: [...p.products, { ...newProduct }] }));
    setNewProduct({ name: "", url: "", platform: "쿠팡" });
  };

  const removeProduct = (i: number) => setForm(p => ({ ...p, products: p.products.filter((_, idx) => idx !== i) }));

  const addTag = () => {
    if (!newTag.trim() || form.tags.includes(newTag.trim())) return;
    setForm(p => ({ ...p, tags: [...p.tags, newTag.trim()] }));
    setNewTag("");
  };

  const handleSave = async () => {
    if (!form.title || !form.content) { alert("제목과 내용을 입력해주세요"); return; }
    setSaving(true);
    // 실제 저장 API 연동 시 여기에 fetch 추가
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    alert("블로그 글이 저장됐어요!");
    router.push("/blog");
  };

  const inputStyle: React.CSSProperties = { width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"11px 14px", fontSize:"14px", outline:"none", background:"#FAFAF8", fontFamily:"'NanumSquareRound',sans-serif" };

  if (loading) return <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>로딩 중...</div>;

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input,select,textarea { font-family:'NanumSquareRound',sans-serif; }
        input:focus,select:focus,textarea:focus { border-color:#FF3B1E !important; background:white !important; outline:none; }
        .preview-content p { margin-bottom:16px; line-height:1.85; }
        .preview-content h2 { font-size:22px; font-weight:800; margin:28px 0 12px; }
        .preview-content h3 { font-size:18px; font-weight:800; margin:20px 0 10px; }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        {/* 헤더 */}
        <div style={{ background:"#1A1A1A", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <a href="/blog" style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"14px", fontWeight:700, color:"rgba(255,255,255,0.5)" }}>
            <ArrowLeft size={16} /> 블로그로
          </a>
          <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"20px", letterSpacing:"3px", color:"white" }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span>CAR BLOG
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            <button onClick={() => setPreview(!preview)} style={{ background:"rgba(255,255,255,0.1)", color:"white", border:"none", padding:"9px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:700, display:"flex", alignItems:"center", gap:"6px" }}>
              <Eye size={14} /> {preview ? "편집" : "미리보기"}
            </button>
            <button onClick={handleSave} disabled={saving} style={{ background:"#FF3B1E", color:"white", border:"none", padding:"9px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:800, display:"flex", alignItems:"center", gap:"6px", opacity:saving?0.7:1 }}>
              <Save size={14} /> {saving ? "저장 중..." : "발행하기"}
            </button>
          </div>
        </div>

        <div style={{ maxWidth:"860px", margin:"0 auto", padding:"28px 32px 80px" }}>
          {!preview ? (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

              {/* 기본 정보 */}
              <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"20px" }}>기본 정보</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  <div>
                    <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"6px" }}>카테고리</label>
                    <select style={inputStyle} value={form.category} onChange={e => update("category", e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"6px" }}>제목 <span style={{ color:"#FF3B1E" }}>*</span></label>
                    <input style={{ ...inputStyle, fontSize:"18px", fontWeight:800 }} type="text" placeholder="블로그 제목을 입력해주세요" value={form.title} onChange={e => update("title", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"6px" }}>요약 설명</label>
                    <input style={inputStyle} type="text" placeholder="목록에 표시될 짧은 설명" value={form.summary} onChange={e => update("summary", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* 본문 */}
              <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"6px" }}>본문 내용 <span style={{ color:"#FF3B1E" }}>*</span></div>
                <div style={{ fontSize:"12px", color:"#AAA", marginBottom:"14px", fontWeight:400 }}>마크다운 지원: ## 제목, ### 소제목, **굵게**, 줄바꿈은 엔터 두 번</div>
                <textarea
                  style={{ ...inputStyle, resize:"vertical", minHeight:"400px", lineHeight:1.8 }}
                  placeholder="본문을 작성해주세요...&#10;&#10;## 제목&#10;### 소제목&#10;**굵은 텍스트**&#10;&#10;일반 내용..."
                  value={form.content}
                  onChange={e => update("content", e.target.value)}
                />
              </div>

              {/* 추천 용품 (쿠팡·알리 어필리에이트) */}
              <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"6px" }}>추천 용품 (어필리에이트 링크)</div>
                <div style={{ fontSize:"12px", color:"#AAA", marginBottom:"16px", fontWeight:400 }}>쿠팡파트너스·알리익스프레스 링크 등록 시 수수료 수익 발생</div>

                <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"14px" }}>
                  {form.products.map((p, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", background:"#F8F6F2", borderRadius:"10px" }}>
                      <span style={{ background:p.platform==="쿠팡"?"#FFF0ED":"#FFF5EE", color:p.platform==="쿠팡"?"#FF3B1E":"#E85D24", padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{p.platform}</span>
                      <span style={{ flex:1, fontSize:"14px", fontWeight:700 }}>{p.name}</span>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:"12px", color:"#1847FF", fontWeight:400 }}>링크 확인</a>
                      <button onClick={() => removeProduct(i)} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={14} color="#AAA" /></button>
                    </div>
                  ))}
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr auto", gap:"8px" }}>
                  <select style={{ ...inputStyle }} value={newProduct.platform} onChange={e => setNewProduct(p => ({ ...p, platform: e.target.value }))}>
                    {["쿠팡", "알리익스프레스", "11번가", "G마켓"].map(v => <option key={v}>{v}</option>)}
                  </select>
                  <input style={inputStyle} type="text" placeholder="상품명" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
                  <input style={inputStyle} type="text" placeholder="URL" value={newProduct.url} onChange={e => setNewProduct(p => ({ ...p, url: e.target.value }))} />
                  <button onClick={addProduct} style={{ background:"#1A1A1A", color:"white", border:"none", padding:"11px 16px", borderRadius:"10px", fontSize:"13px", fontWeight:800 }}>추가</button>
                </div>
              </div>

              {/* 태그 */}
              <div style={{ background:"white", borderRadius:"20px", padding:"24px 28px" }}>
                <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"14px" }}>태그</div>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"12px" }}>
                  {form.tags.map(tag => (
                    <span key={tag} style={{ background:"#EEF2FF", color:"#1847FF", padding:"5px 12px", borderRadius:"100px", fontSize:"13px", fontWeight:700, display:"flex", alignItems:"center", gap:"5px" }}>
                      #{tag}
                      <button onClick={() => setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}><X size={11} color="#1847FF" /></button>
                    </span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  <input style={{ ...inputStyle, flex:1 }} type="text" placeholder="태그 입력 후 Enter" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addTag(); }} />
                  <button onClick={addTag} style={{ background:"#1A1A1A", color:"white", border:"none", padding:"11px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:800 }}>추가</button>
                </div>
              </div>
            </div>
          ) : (
            /* 미리보기 */
            <div style={{ background:"white", borderRadius:"20px", overflow:"hidden" }}>
              <div style={{ background:"#FF3B1E", padding:"32px 36px" }}>
                <span style={{ background:"rgba(255,255,255,0.2)", color:"white", padding:"4px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800, display:"inline-block", marginBottom:"12px" }}>{form.category}</span>
                <h1 style={{ fontSize:"28px", fontWeight:800, color:"white", lineHeight:1.2, marginBottom:"8px" }}>{form.title || "제목을 입력해주세요"}</h1>
                <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.75)", fontWeight:400 }}>{form.summary}</p>
              </div>
              <div style={{ padding:"32px 36px" }}>
                <div className="preview-content" style={{ fontSize:"15px", color:"#444", lineHeight:1.85, fontWeight:400 }}>
                  {form.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("## ")) return <h2 key={i}>{para.slice(3)}</h2>;
                    if (para.startsWith("### ")) return <h3 key={i}>{para.slice(4)}</h3>;
                    return <p key={i}>{para.replace(/\*\*(.*?)\*\*/g, "$1") || ""}</p>;
                  })}
                </div>
                {form.products.length > 0 && (
                  <div style={{ marginTop:"28px", paddingTop:"24px", borderTop:"1px solid #F0EEE9" }}>
                    <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"12px" }}>추천 용품</div>
                    {form.products.map((p, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", background:"#F8F6F2", borderRadius:"10px", marginBottom:"8px" }}>
                        <span style={{ background:p.platform==="쿠팡"?"#FFF0ED":"#FFF5EE", color:p.platform==="쿠팡"?"#FF3B1E":"#E85D24", padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{p.platform}</span>
                        <span style={{ flex:1, fontSize:"14px", fontWeight:700 }}>{p.name}</span>
                        <Tag size={12} color="#AAA" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
