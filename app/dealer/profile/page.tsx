// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/dealer/profile/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import { CheckCircle, User, Camera, X } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function DealerProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({shopName:"",phone:"",phoneLand:"",address:"",intro:"",brands:"",profilePhoto:""});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(!d?.user?.id||(d.user.role!=="DEALER"&&d.user.role!=="ADMIN")){router.push("/");return;}
    }).catch(()=>router.push("/"));
    fetch("/api/dealer/profile").then(r=>r.json()).then(d=>{
      const p=d?.data||d;
      if(p) setForm({shopName:p.shopName||"",phone:p.shopPhone||"",phoneLand:p.phoneLand||"",address:p.address||"",intro:p.intro||"",brands:(p.brands||[]).join(", "),profilePhoto:p.profilePhoto||""});
    }).catch(()=>{});
  }, [router]);

  const inp:React.CSSProperties = {width:"100%",border:"1.5px solid #E0DDD7",borderRadius:10,padding:"12px 14px",fontSize:14,background:"white",fontFamily:"'NanumSquareRound',sans-serif",outline:"none"};

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/dealer/profile",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      shopName:form.shopName,shopPhone:form.phone,phoneLand:form.phoneLand,address:form.address,intro:form.intro,
      brands:form.brands.split(",").map(s=>s.trim()).filter(Boolean),profilePhoto:form.profilePhoto,
    })}).catch(()=>{});
    setSaved(true); setSaving(false);
    setTimeout(()=>setSaved(false),3000);
  };

  const handlePhotoUpload = () => {
    const inp = document.createElement("input");
    inp.type="file"; inp.accept="image/jpeg,image/png,image/webp";
    inp.onchange = async(e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if(!file) return;
      if(file.size > 5*1024*1024){ alert("5MB 이하 파일만 업로드 가능합니다."); return; }
      setUploading(true);
      const fd = new FormData(); fd.append("file", file);
      try {
        const res = await fetch("/api/upload",{method:"POST",body:fd});
        const d = await res.json();
        if(d.success && d.url) setForm(p=>({...p, profilePhoto: d.url}));
        else alert("업로드 실패");
      } catch { alert("네트워크 오류"); }
      setUploading(false);
    };
    inp.click();
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,textarea:focus{outline:none;border-color:#0066FF!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:680,margin:"0 auto",padding:"28px 24px 80px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h1 style={{fontSize:22,fontWeight:800}}>딜러 프로필</h1>
            <Link href="/dealer" style={{fontSize:13,fontWeight:700,color:"#888",textDecoration:"none"}}>← 대시보드</Link>
          </div>

          {saved&&<div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:700,color:"#2D8A52"}}><CheckCircle size={16}/>저장됐어요!</div>}

          <div style={{background:"white",borderRadius:18,padding:24,marginBottom:16}}>
            {/* 프로필 사진 */}
            <div style={{display:"flex",alignItems:"center",gap:16,paddingBottom:20,borderBottom:"1px solid #F0EEE9",marginBottom:20}}>
              <div style={{position:"relative",width:80,height:80,borderRadius:20,overflow:"hidden",background:"#EEF5FF",flexShrink:0}}>
                {form.profilePhoto ? (
                  <>
                    <img src={form.profilePhoto} alt="프로필" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <button onClick={()=>setForm(p=>({...p,profilePhoto:""}))} style={{position:"absolute",top:2,right:2,width:20,height:20,borderRadius:"50%",background:"rgba(220,50,50,0.8)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={10}/></button>
                  </>
                ) : (
                  <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><User size={36} color="#0066FF"/></div>
                )}
              </div>
              <div>
                <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>{form.shopName||"상호명 입력"}</div>
                <button onClick={handlePhotoUpload} disabled={uploading} style={{padding:"8px 16px",background:"#EEF5FF",border:"1.5px solid #0066FF",borderRadius:10,fontSize:12,fontWeight:700,color:"#0066FF",cursor:uploading?"wait":"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'NanumSquareRound',sans-serif"}}>
                  <Camera size={14}/> {uploading?"업로드 중...":"프로필 사진 변경"}
                </button>
                <div style={{fontSize:10,color:"#AAA",marginTop:4}}>JPG, PNG, WebP · 5MB 이하 · 정사각형 권장</div>
              </div>
            </div>

            {/* 기본 정보 */}
            {[
              {l:"상호명",k:"shopName",ph:"상호명을 입력하세요"},
              {l:"휴대전화",k:"phone",ph:"010-0000-0000"},
              {l:"일반전화 (선택)",k:"phoneLand",ph:"062-000-0000"},
              {l:"주소",k:"address",ph:"매매단지 주소"},
              {l:"전문 브랜드",k:"brands",ph:"예: 현대, 기아, 제네시스 (콤마 구분)"},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:14}}>
                <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>{f.l}</label>
                <input style={inp} value={form[f.k as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}/>
              </div>
            ))}
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>딜러 소개</label>
              <textarea rows={4} style={{...inp,resize:"none"}} value={form.intro} onChange={e=>setForm(p=>({...p,intro:e.target.value}))} placeholder="상사 경력, 전문 분야, 고객에게 하고 싶은 말 등"/>
            </div>
            <button onClick={handleSave} disabled={saving} style={{width:"100%",background:saving?"#CCC":saved?"#2D8A52":"#0066FF",color:"white",border:"none",padding:"16px",borderRadius:12,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
              {saving?"저장 중...":saved?"✓ 저장 완료!":"프로필 저장"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
