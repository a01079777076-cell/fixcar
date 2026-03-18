"use client";
import { useState } from "react";
import { CheckCircle, User } from "lucide-react";
import Link from "next/link";

export default function DealerProfilePage() {
  const [form, setForm] = useState({shopName:"아이비원모터스",phone:"062-671-4005",address:"광주 서구 회재유통길 78, B동 219호",intro:"광주 서부 매매단지 20년 경력 딜러입니다. FIX 정찰가 원칙을 지키며 믿을 수 있는 거래를 약속드립니다.",brands:"현대,기아,제네시스"});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const inp = {width:"100%",border:"1.5px solid #DDEEFF",borderRadius:"10px",padding:"11px 14px",fontSize:"14px",background:"#FAFCFF",fontFamily:"'NanumSquareRound',sans-serif",outline:"none"} as const;
  const NAV = [["대시보드","/dealer"],["매물","/dealer/cars"],["문의","/dealer/inquiries"],["거래","/dealer/transactions"],["분석","/dealer/analytics"]];

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/dealer/profile",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}).catch(()=>{});
    setSaved(true); setSaving(false);
    setTimeout(()=>setSaved(false),3000);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;} a{text-decoration:none;color:inherit;} button,input,textarea{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} input:focus,textarea:focus{border-color:#0066FF!important;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0F6FF"}}>
        <div style={{background:"white",borderBottom:"1.5px solid #DDEEFF",padding:"0 32px",height:"68px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,100,255,0.06)"}}>
          <Link href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px",display:"flex",alignItems:"center",gap:"8px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"#1A1A1A"}}>CAR</span><span style={{fontSize:"11px",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:800,color:"#0066FF",background:"#EEF5FF",padding:"3px 10px",borderRadius:"100px",marginLeft:"4px"}}>DEALER</span></Link>
          <div style={{display:"flex",gap:"4px"}}>{NAV.map(([l,h])=>(<Link key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/dealer/profile"?"#0066FF":"#888",padding:"7px 12px",borderRadius:"9px",background:h==="/dealer/profile"?"#EEF5FF":"transparent"}}>{l}</Link>))}</div>
          <Link href="/dealer"><button style={{background:"#F0F6FF",color:"#0066FF",border:"1.5px solid #DDEEFF",padding:"7px 16px",borderRadius:"100px",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>← 대시보드</button></Link>
        </div>
        <div style={{maxWidth:"680px",margin:"0 auto",padding:"28px 28px 60px"}}>
          <h1 style={{fontSize:"22px",fontWeight:800,marginBottom:"20px",color:"#0066FF"}}>딜러 프로필</h1>
          {saved&&<div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"12px",padding:"12px 16px",marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px",fontSize:"14px",fontWeight:700,color:"#2D8A52"}}><CheckCircle size={16}/>저장됐어요!</div>}

          <div style={{background:"white",border:"1.5px solid #DDEEFF",borderRadius:"18px",padding:"24px",display:"flex",flexDirection:"column",gap:"14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"14px",paddingBottom:"16px",borderBottom:"1px solid #F0EEE9"}}>
              <div style={{width:"56px",height:"56px",background:"#EEF5FF",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center"}}><User size={28} color="#0066FF"/></div>
              <div>
                <div style={{fontSize:"18px",fontWeight:800}}>{form.shopName}</div>
                <div style={{fontSize:"13px",color:"#0066FF",fontWeight:400}}>FIX 인증 딜러</div>
              </div>
            </div>
            {[{l:"상호명",k:"shopName",ph:"상호명"},{l:"연락처",k:"phone",ph:"062-000-0000"},{l:"주소",k:"address",ph:"주소"},{l:"전문 브랜드",k:"brands",ph:"예: 현대, 기아, 제네시스"}].map(f=>(
              <div key={f.k}>
                <label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px",color:"#666"}}>{f.l}</label>
                <input style={inp} value={form[f.k as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}/>
              </div>
            ))}
            <div>
              <label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px",color:"#666"}}>딜러 소개</label>
              <textarea rows={4} style={{...inp,resize:"none"}} value={form.intro} onChange={e=>setForm(p=>({...p,intro:e.target.value}))}/>
            </div>
            <button onClick={handleSave} disabled={saving} style={{background:saving?"#E0DDD7":"#0066FF",color:saving?"#AAA":"white",border:"none",padding:"13px",borderRadius:"10px",fontSize:"15px",fontWeight:800,cursor:saving?"default":"pointer"}}>
              {saving?"저장 중...":"프로필 저장"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
