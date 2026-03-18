"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Bell, Plus, Trash2, BellOff, CheckCircle } from "lucide-react";

const BRANDS = ["전체", "현대", "기아", "제네시스", "쉐보레", "르노", "KG모빌리티", "BMW", "벤츠", "아우디", "볼보", "포르쉐", "렉서스", "토요타"];
const FUELS = ["전체", "가솔린", "디젤", "하이브리드", "전기", "LPG"];

interface Alert {
  id: number;
  brand: string | null;
  model: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  fuel: string | null;
  active: boolean;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    brand: "", model: "", minPrice: "", maxPrice: "",
    minYear: "", maxYear: "", fuel: "",
  });

  useEffect(() => {
    fetch("/api/alerts")
      .then(r => r.json())
      .then(d => { if (d.success) setAlerts(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    setSaving(true);
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: form.brand || null,
        model: form.model || null,
        minPrice: form.minPrice ? parseInt(form.minPrice) : null,
        maxPrice: form.maxPrice ? parseInt(form.maxPrice) : null,
        minYear: form.minYear ? parseInt(form.minYear) : null,
        maxYear: form.maxYear ? parseInt(form.maxYear) : null,
        fuel: form.fuel || null,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setAlerts(prev => [data.data, ...prev]);
      setShowForm(false);
      setForm({ brand:"", model:"", minPrice:"", maxPrice:"", minYear:"", maxYear:"", fuel:"" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert(data.error);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const formatAlert = (alert: Alert) => {
    const parts = [];
    if (alert.brand) parts.push(alert.brand);
    if (alert.model) parts.push(alert.model);
    if (alert.minPrice || alert.maxPrice) {
      if (alert.minPrice && alert.maxPrice) parts.push(`${alert.minPrice}~${alert.maxPrice}만원`);
      else if (alert.minPrice) parts.push(`${alert.minPrice}만원 이상`);
      else parts.push(`${alert.maxPrice}만원 이하`);
    }
    if (alert.minYear || alert.maxYear) {
      if (alert.minYear && alert.maxYear) parts.push(`${alert.minYear}~${alert.maxYear}년식`);
      else if (alert.minYear) parts.push(`${alert.minYear}년식 이상`);
      else parts.push(`${alert.maxYear}년식 이하`);
    }
    if (alert.fuel) parts.push(alert.fuel);
    return parts.length > 0 ? parts.join(" · ") : "전체 차량";
  };

  const inputStyle: React.CSSProperties = { width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", background:"#FAFAF8", fontFamily:"'NanumSquareRound',sans-serif" };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor:"pointer" };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        input,select{font-family:'NanumSquareRound',sans-serif;}
        input:focus,select:focus{outline:none;border-color:#FF3B1E!important;background:white!important;}
        .alert-card{background:white;border-radius:16px;padding:18px 20px;transition:all 0.2s;}
        .alert-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.07);}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar />
        <div style={{ background:"#1A1A1A", padding:"44px 52px 36px" }}>
          <div style={{ maxWidth:"700px", margin:"0 auto" }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"10px" }}>WISH ALERT</div>
            <h1 style={{ fontSize:"clamp(24px,4vw,40px)", fontWeight:800, color:"white", letterSpacing:"-1px" }}>매물 알림 설정</h1>
            <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.4)", marginTop:"8px", fontWeight:400 }}>원하는 조건의 차량이 등록되면 카카오톡으로 바로 알려드려요</p>
          </div>
        </div>

        <div style={{ maxWidth:"700px", margin:"0 auto", padding:"28px 52px 80px" }}>
          {saved && (
            <div style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", borderRadius:"12px", padding:"14px 18px", marginBottom:"16px", display:"flex", alignItems:"center", gap:"10px" }}>
              <CheckCircle size={18} color="#2D8A52" />
              <span style={{ fontSize:"14px", fontWeight:700, color:"#2D8A52" }}>알림이 설정됐어요! 새 매물이 등록되면 카카오톡으로 알려드릴게요 🚗</span>
            </div>
          )}

          {/* 알림 추가 버튼 */}
          {!showForm && (
            <button onClick={() => setShowForm(true)} disabled={alerts.length >= 5}
              style={{ width:"100%", border:`2px dashed ${alerts.length >= 5 ? "#E0DDD7":"#FF3B1E"}`, background:"transparent", padding:"16px", borderRadius:"16px", fontSize:"15px", fontWeight:800, color:alerts.length >= 5 ? "#AAA":"#FF3B1E", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"16px", cursor:alerts.length >= 5?"not-allowed":"pointer" }}>
              <Plus size={18} /> 알림 추가 {alerts.length > 0 && `(${alerts.length}/5)`}
            </button>
          )}

          {/* 알림 추가 폼 */}
          {showForm && (
            <div style={{ background:"white", borderRadius:"18px", padding:"24px", marginBottom:"16px" }}>
              <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"18px" }}>새 알림 조건 설정</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
                <div>
                  <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>브랜드</label>
                  <select style={selectStyle} value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}>
                    {BRANDS.map(b => <option key={b} value={b === "전체" ? "" : b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>모델명</label>
                  <input type="text" placeholder="예: 아반떼, K3, 투싼" style={inputStyle} value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>최소 가격 (만원)</label>
                  <input type="number" placeholder="예: 500" style={inputStyle} value={form.minPrice} onChange={e => setForm(p => ({ ...p, minPrice: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>최대 가격 (만원)</label>
                  <input type="number" placeholder="예: 2000" style={inputStyle} value={form.maxPrice} onChange={e => setForm(p => ({ ...p, maxPrice: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>최소 연식</label>
                  <input type="number" placeholder="예: 2020" style={inputStyle} value={form.minYear} onChange={e => setForm(p => ({ ...p, minYear: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>최대 연식</label>
                  <input type="number" placeholder="예: 2024" style={inputStyle} value={form.maxYear} onChange={e => setForm(p => ({ ...p, maxYear: e.target.value }))} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>연료</label>
                  <select style={selectStyle} value={form.fuel} onChange={e => setForm(p => ({ ...p, fuel: e.target.value }))}>
                    {FUELS.map(f => <option key={f} value={f === "전체" ? "" : f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ background:"#FFF8EC", border:"1px solid #FFD89A", borderRadius:"10px", padding:"12px 14px", marginBottom:"14px" }}>
                <div style={{ fontSize:"12px", color:"#7A5500", fontWeight:400, lineHeight:1.65 }}>
                  💡 조건을 비워두면 해당 항목은 전체로 설정돼요. 모두 비워두면 모든 새 매물에 알림이 와요.
                </div>
              </div>
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={handleAdd} disabled={saving} style={{ background:"#FF3B1E", color:"white", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:800, flex:1, opacity:saving?0.7:1 }}>
                  {saving ? "저장 중..." : "알림 설정 완료"}
                </button>
                <button onClick={() => setShowForm(false)} style={{ background:"#F0EEE9", color:"#555", border:"none", padding:"13px 20px", borderRadius:"10px", fontSize:"14px", fontWeight:700 }}>취소</button>
              </div>
            </div>
          )}

          {/* 알림 목록 */}
          {loading ? (
            <div style={{ textAlign:"center", padding:"40px", color:"#AAA" }}>로딩 중...</div>
          ) : alerts.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px", color:"#AAA", background:"white", borderRadius:"18px" }}>
              <BellOff size={48} color="#E0DDD7" style={{ margin:"0 auto 16px" }} />
              <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"8px", color:"#1A1A1A" }}>설정된 알림이 없어요</div>
              <div style={{ fontSize:"14px", fontWeight:400 }}>원하는 차량 조건을 설정하면<br />새 매물이 등록될 때 카카오톡으로 알려드려요!</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {alerts.map(alert => (
                <div key={alert.id} className="alert-card">
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:"14px" }}>
                      <div style={{ width:"44px", height:"44px", background:"#FFF0ED", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Bell size={20} color="#FF3B1E" />
                      </div>
                      <div>
                        <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"4px", color:"#1A1A1A" }}>{formatAlert(alert)}</div>
                        <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>설정일: {alert.createdAt?.slice(0,10)}</div>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(alert.id)}
                      style={{ background:"#FFF0ED", border:"none", borderRadius:"10px", padding:"8px", cursor:"pointer", flexShrink:0 }}>
                      <Trash2 size={16} color="#FF3B1E" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 안내 */}
          <div style={{ background:"#1A1A1A", borderRadius:"18px", padding:"20px 24px", marginTop:"20px" }}>
            <div style={{ fontSize:"15px", fontWeight:800, color:"white", marginBottom:"10px" }}>💛 카카오톡 알림 안내</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              {[
                "딜러가 새 매물을 등록하면 즉시 카카오톡 메시지가 발송돼요",
                "인기 매물은 등록 후 수 시간 내 나가는 경우가 많아요",
                "알림은 최대 5개까지 설정 가능해요",
                "카카오 비즈니스 채널 연동 완료 시 알림이 발송돼요",
              ].map((t, i) => (
                <div key={i} style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", display:"flex", gap:"8px", fontWeight:400 }}>
                  <span style={{ color:"#FF7A63", flexShrink:0 }}>•</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
