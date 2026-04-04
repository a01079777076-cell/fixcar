// 📁 저장 경로: app/wish-alert/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Bell, Plus, Trash2, CheckCircle } from "lucide-react";

const BRANDS = ["현대","기아","제네시스","쉐보레","르노","KG모빌리티","BMW","벤츠","아우디","폭스바겐","볼보","테슬라","토요타","혼다","렉서스","포르쉐"];
const FUELS = ["전체","가솔린","디젤","LPG","전기","하이브리드"];

export default function WishAlertPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ brand: "", model: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "", fuel: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/wish-alert").then(r => r.json()).then(d => {
      setAlerts(Array.isArray(d?.data) ? d.data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.brand && !form.model) { alert("브랜드 또는 모델을 선택해주세요."); return; }
    try {
      const res = await fetch("/api/wish-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: form.brand || undefined,
          model: form.model || undefined,
          minPrice: form.minPrice ? Number(form.minPrice) : undefined,
          maxPrice: form.maxPrice ? Number(form.maxPrice) : undefined,
          minYear: form.minYear ? Number(form.minYear) : undefined,
          maxYear: form.maxYear ? Number(form.maxYear) : undefined,
          fuel: form.fuel || undefined,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setAlerts(prev => [...prev, d.data]);
        setForm({ brand: "", model: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "", fuel: "" });
        setShowForm(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else alert(d.error || "등록 실패");
    } catch { alert("네트워크 오류"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("알림을 삭제하시겠습니까?")) return;
    await fetch("/api/wish-alert", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }).catch(() => {});
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const sel: React.CSSProperties = { width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 14, background: "white", fontFamily: "'NanumSquareRound',sans-serif" };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} select:focus,input:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"32px 24px 100px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <h1 style={{fontSize:24,fontWeight:800}}>🔔 매물 알림</h1>
              <p style={{fontSize:13,color:"#888",marginTop:4}}>원하는 조건의 매물이 등록되면 알려드려요</p>
            </div>
            <button onClick={()=>setShowForm(!showForm)} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",background:"#FF3B1E",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
              <Plus size={14}/> 알림 추가
            </button>
          </div>

          {saved && <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:700,color:"#2D8A52"}}><CheckCircle size={16}/>알림이 등록되었습니다!</div>}

          {/* 알림 생성 폼 */}
          {showForm && (
            <div style={{background:"white",borderRadius:18,padding:"24px",marginBottom:20}}>
              <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>알림 조건 설정</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>브랜드</label>
                  <select value={form.brand} onChange={e=>setForm(p=>({...p,brand:e.target.value}))} style={sel}>
                    <option value="">전체</option>
                    {BRANDS.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>모델명</label>
                  <input value={form.model} onChange={e=>setForm(p=>({...p,model:e.target.value}))} placeholder="예: 쏘나타" style={sel}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>최소 가격 (만원)</label>
                  <input type="number" value={form.minPrice} onChange={e=>setForm(p=>({...p,minPrice:e.target.value}))} placeholder="0" style={sel}/>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>최대 가격 (만원)</label>
                  <input type="number" value={form.maxPrice} onChange={e=>setForm(p=>({...p,maxPrice:e.target.value}))} placeholder="10000" style={sel}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
                <div>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>최소 연식</label>
                  <input type="number" value={form.minYear} onChange={e=>setForm(p=>({...p,minYear:e.target.value}))} placeholder="2018" style={sel}/>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>최대 연식</label>
                  <input type="number" value={form.maxYear} onChange={e=>setForm(p=>({...p,maxYear:e.target.value}))} placeholder="2026" style={sel}/>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>연료</label>
                  <select value={form.fuel} onChange={e=>setForm(p=>({...p,fuel:e.target.value}))} style={sel}>
                    {FUELS.map(f=><option key={f} value={f==="전체"?"":f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={handleCreate} style={{flex:1,padding:"14px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>알림 등록</button>
                <button onClick={()=>setShowForm(false)} style={{padding:"14px 20px",background:"#F0EEE9",color:"#888",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>취소</button>
              </div>
            </div>
          )}

          {/* 등록된 알림 목록 */}
          {loading ? (
            <div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>
          ) : alerts.length === 0 ? (
            <div style={{background:"white",borderRadius:18,padding:60,textAlign:"center"}}>
              <Bell size={40} color="#CCC" style={{marginBottom:12}}/>
              <div style={{fontSize:16,fontWeight:700,color:"#AAA"}}>등록된 알림이 없습니다</div>
              <div style={{fontSize:13,color:"#CCC",marginTop:8}}>위의 "알림 추가" 버튼으로 원하는 조건을 설정하세요.</div>
            </div>
          ) : alerts.map(a => (
            <div key={a.id} style={{background:"white",borderRadius:14,padding:"18px 20px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:15,fontWeight:700}}>
                  {a.brand || "전체 브랜드"} {a.model || ""}
                </div>
                <div style={{fontSize:12,color:"#888",marginTop:4}}>
                  {a.minPrice || 0}~{a.maxPrice || "∞"}만원 · {a.minYear || "—"}~{a.maxYear || "—"}년식 {a.fuel ? `· ${a.fuel}` : ""}
                </div>
              </div>
              <button onClick={()=>handleDelete(a.id)} style={{border:"none",background:"#FFF0ED",borderRadius:8,padding:"8px 12px",cursor:"pointer",color:"#E24B4A",display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif"}}>
                <Trash2 size={12}/> 삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
