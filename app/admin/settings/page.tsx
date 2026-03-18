"use client";
import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "픽스카 FIXCAR",
    siteDesc: "광주 1위 중고차 정찰제 플랫폼",
    contactEmail: "help@fixcar.kr",
    contactPhone: "062-000-0000",
    commissionRate: "2",
    depositRate: "10",
    refundDays: "3",
    kakaoChannelId: "",
    gaId: "",
  });

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false), 3000); };
  const u = (k: string, v: string) => setSettings(p => ({ ...p, [k]: v }));
  const inputStyle: React.CSSProperties = { width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"11px 14px", fontSize:"14px", outline:"none", background:"#FAFAF8", fontFamily:"'NanumSquareRound',sans-serif" };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        input:focus{border-color:#FF3B1E!important;background:white!important;outline:none;}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <a href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span></a>
          <div style={{display:"flex",gap:"20px"}}>
            {[["대시보드","/admin"],["회원","/admin/users"],["매물","/admin/cars"],["딜러신청","/admin/dealers"],["설정","/admin/settings"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/admin/settings"?"white":"rgba(255,255,255,0.4)"}}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{maxWidth:"700px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <h1 style={{fontSize:"26px",fontWeight:800,marginBottom:"20px"}}>사이트 설정</h1>

          {saved && <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"12px",padding:"14px 18px",marginBottom:"18px",display:"flex",alignItems:"center",gap:"10px"}}><CheckCircle size={18} color="#2D8A52"/><span style={{fontSize:"14px",fontWeight:700,color:"#2D8A52"}}>설정이 저장됐어요!</span></div>}

          {[
            { title:"기본 정보", fields:[["사이트명","siteName","text"],["사이트 소개","siteDesc","text"],["문의 이메일","contactEmail","email"],["문의 전화","contactPhone","tel"]] },
            { title:"거래 정책", fields:[["픽스카 수수료 (%)","commissionRate","number"],["계약금 비율 (%)","depositRate","number"],["환불 가능 기간 (일)","refundDays","number"]] },
            { title:"외부 연동", fields:[["카카오채널 ID","kakaoChannelId","text"],["구글 애널리틱스 ID","gaId","text"]] },
          ].map(section => (
            <div key={section.title} style={{background:"white",borderRadius:"18px",padding:"24px 28px",marginBottom:"16px"}}>
              <div style={{fontSize:"17px",fontWeight:800,marginBottom:"18px"}}>{section.title}</div>
              <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                {section.fields.map(([label, key, type]) => (
                  <div key={key}>
                    <label style={{fontSize:"14px",fontWeight:800,display:"block",marginBottom:"6px"}}>{label}</label>
                    <input style={inputStyle} type={type} value={settings[key as keyof typeof settings]} onChange={e => u(key, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button onClick={handleSave} style={{background:"#1847FF",color:"white",border:"none",padding:"15px",borderRadius:"12px",fontSize:"15px",fontWeight:800,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
            <Save size={17}/> 설정 저장
          </button>
        </div>
      </div>
    </>
  );
}
