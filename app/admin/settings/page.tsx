"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle, Settings, Bell, Shield, DollarSign } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName:"픽스카 FIXCAR", bannerText:"NEW AI 나에게 알맞는 완벽한 중고차 · 광주 1위 AI 추천차량 픽스카",
    commissionRate:"3", depositRate:"10", maxCarsPerDealer:"50",
    kakaoAlertEnabled:true, emailAlertEnabled:true,
    maintenanceMode:false, newSignupEnabled:true,
    notice:"",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await fetch("/api/admin/settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(settings)}).catch(()=>{});
    setSaved(true); setTimeout(()=>setSaved(false),3000);
  };

  const inp = {width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"10px 14px",fontSize:"14px",background:"#FAFAF8",fontFamily:"'NanumSquareRound',sans-serif",outline:"none"} as const;
  const tog = (k: keyof typeof settings) => setSettings(p=>({...p,[k]:!p[k]}));

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button,input,textarea{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} input:focus,textarea:focus{border-color:#FF3B1E!important;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"860px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"8px"}}>ADMIN</div>
              <h1 style={{fontSize:"28px",fontWeight:800,color:"white",letterSpacing:"-0.5px"}}>관리자 설정</h1>
            </div>
            <div style={{display:"flex",gap:"10px"}}>
              {[["방문자","/admin/visitors"],["회원","/admin/users"],["딜러","/admin/dealers"],["매물","/admin/cars"]].map(([l,h])=>(
                <a key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:"rgba(255,255,255,0.5)",padding:"7px 14px",borderRadius:"8px",background:"rgba(255,255,255,0.06)"}}>{l}</a>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:"860px",margin:"0 auto",padding:"24px 32px 80px",display:"flex",flexDirection:"column",gap:"16px"}}>
          {saved&&<div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"12px",padding:"13px 16px",display:"flex",alignItems:"center",gap:"8px",fontSize:"14px",fontWeight:700,color:"#2D8A52"}}><CheckCircle size={16}/>설정이 저장됐어요!</div>}

          {/* 사이트 기본 설정 */}
          <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
            <div style={{fontSize:"16px",fontWeight:800,marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px"}}><Settings size={18} color="#FF3B1E"/>사이트 기본 설정</div>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px",color:"#666"}}>사이트명</label><input style={inp} value={settings.siteName} onChange={e=>setSettings(p=>({...p,siteName:e.target.value}))}/></div>
              <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px",color:"#666"}}>상단 배너 문구</label><input style={inp} value={settings.bannerText} onChange={e=>setSettings(p=>({...p,bannerText:e.target.value}))}/></div>
              <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px",color:"#666"}}>공지사항 (홈 노출)</label><textarea rows={2} style={{...inp,resize:"none"}} value={settings.notice} onChange={e=>setSettings(p=>({...p,notice:e.target.value}))} placeholder="공지사항 입력 (빈칸이면 비노출)"/></div>
            </div>
          </div>

          {/* 거래 설정 */}
          <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
            <div style={{fontSize:"16px",fontWeight:800,marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px"}}><DollarSign size={18} color="#1847FF"/>거래 설정</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px"}}>
              {[{l:"수수료율 (%)",k:"commissionRate"},{l:"계약금 비율 (%)",k:"depositRate"},{l:"딜러 최대 매물 수",k:"maxCarsPerDealer"}].map(f=>(
                <div key={f.k}><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px",color:"#666"}}>{f.l}</label><input type="number" style={inp} value={settings[f.k as keyof typeof settings] as string} onChange={e=>setSettings(p=>({...p,[f.k]:e.target.value}))}/></div>
              ))}
            </div>
          </div>

          {/* 알림 설정 */}
          <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
            <div style={{fontSize:"16px",fontWeight:800,marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px"}}><Bell size={18} color="#E8A020"/>알림 설정</div>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              {[{l:"카카오 알림톡 발송",k:"kakaoAlertEnabled",d:"새 매물·거래 시 카카오톡 자동 발송"},{l:"이메일 알림",k:"emailAlertEnabled",d:"회원가입·문의 시 이메일 자동 발송"}].map(f=>(
                <div key={f.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0EEE9"}}>
                  <div><div style={{fontSize:"14px",fontWeight:700}}>{f.l}</div><div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{f.d}</div></div>
                  <button onClick={()=>tog(f.k as keyof typeof settings)} style={{background:settings[f.k as keyof typeof settings]?"#FF3B1E":"#E0DDD7",border:"none",borderRadius:"100px",width:"48px",height:"26px",cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
                    <div style={{width:"20px",height:"20px",background:"white",borderRadius:"50%",position:"absolute",top:"3px",transition:"left 0.2s",left:settings[f.k as keyof typeof settings]?"25px":"3px"}}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 시스템 설정 */}
          <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
            <div style={{fontSize:"16px",fontWeight:800,marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px"}}><Shield size={18} color="#2D8A52"/>시스템 설정</div>
            {[{l:"점검 모드 (서비스 일시 중단)",k:"maintenanceMode",d:"활성화 시 관리자 외 접근 차단",warn:true},{l:"신규 회원가입 허용",k:"newSignupEnabled",d:"비활성화 시 가입 폼 잠금"}].map(f=>(
              <div key={f.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0EEE9"}}>
                <div>
                  <div style={{fontSize:"14px",fontWeight:700,color:f.warn&&settings[f.k as keyof typeof settings]?"#FF3B1E":"#1A1A1A"}}>{f.l}</div>
                  <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{f.d}</div>
                </div>
                <button onClick={()=>tog(f.k as keyof typeof settings)} style={{background:settings[f.k as keyof typeof settings]?"#FF3B1E":"#E0DDD7",border:"none",borderRadius:"100px",width:"48px",height:"26px",cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
                  <div style={{width:"20px",height:"20px",background:"white",borderRadius:"50%",position:"absolute",top:"3px",transition:"left 0.2s",left:settings[f.k as keyof typeof settings]?"25px":"3px"}}/>
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleSave} style={{background:"#FF3B1E",color:"white",border:"none",padding:"16px",borderRadius:"14px",fontSize:"16px",fontWeight:800,cursor:"pointer"}}>설정 저장하기</button>
        </div>
      </div>
    </>
  );
}
