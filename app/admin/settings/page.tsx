"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ siteName:"픽스카 FIXCAR", siteDesc:"광주 중고차 정찰제 플랫폼", phone:"062-000-0000", email:"info@fixcar.kr", address:"광주광역시", notice:"", bannerText:"", maintenanceMode:false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r=>r.json())
      .then(data=>{ if (data && typeof data === "object") setSettings(prev=>({...prev,...data})); setLoading(false); })
      .catch(()=>setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const err = await res.json().catch(()=>({}));
        alert("저장 실패: " + (err.error || res.statusText));
      }
    } catch (e) { alert("저장 중 오류: " + String(e)); }
    setSaving(false);
  };

  if (loading) return (<><Navbar/><div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center"}}><p>로딩 중...</p></div></>);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        input:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"36px 24px 28px"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:4,color:"#9B30FF",marginBottom:6}}>SITE SETTINGS</div>
            <h1 style={{fontSize:28,fontWeight:800,color:"white"}}>사이트 설정</h1>
          </div>
        </div>
        <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px 100px"}}>
          {saved && (
            <div style={{background:"#E8F8EF",border:"1px solid #B8DFC8",borderRadius:12,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <span>✅</span><span style={{fontSize:14,fontWeight:700,color:"#2D8A52"}}>설정이 저장됐어요!</span>
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[
              {key:"siteName",label:"사이트명",type:"text"},
              {key:"siteDesc",label:"사이트 설명",type:"text"},
              {key:"phone",label:"고객센터 전화번호",type:"text"},
              {key:"email",label:"고객센터 이메일",type:"text"},
              {key:"address",label:"사업장 주소",type:"text"},
            ].map(field=>(
              <div key={field.key} style={{background:"white",borderRadius:16,padding:"18px 22px"}}>
                <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>{field.label}</label>
                <input type={field.type}
                  value={(settings as Record<string,string|boolean>)[field.key] as string || ""}
                  onChange={e=>setSettings(prev=>({...prev,[field.key]:e.target.value}))}
                  style={{width:"100%",padding:"12px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"#FAFAF8"}}
                />
              </div>
            ))}

            <div style={{background:"white",borderRadius:16,padding:"18px 22px"}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>공지사항</label>
              <textarea rows={3} value={settings.notice}
                onChange={e=>setSettings(prev=>({...prev,notice:e.target.value}))}
                style={{width:"100%",padding:"12px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",resize:"none",background:"#FAFAF8"}}
              />
            </div>

            <div style={{background:"white",borderRadius:16,padding:"18px 22px"}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>배너 텍스트</label>
              <input type="text" value={settings.bannerText}
                onChange={e=>setSettings(prev=>({...prev,bannerText:e.target.value}))}
                style={{width:"100%",padding:"12px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"#FAFAF8"}}
              />
            </div>

            <button onClick={handleSave} disabled={saving} style={{
              width:"100%",padding:"18px",background:saving?"#CCC":"#FF3B1E",color:"white",border:"none",
              borderRadius:14,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",
              fontFamily:"'NanumSquareRound',sans-serif",
            }}>
              {saving ? "저장 중..." : "💾 설정 저장하기"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
