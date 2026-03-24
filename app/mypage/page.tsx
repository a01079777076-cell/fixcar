"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageSquare, Settings, ChevronRight, LogOut, Zap, Bell, Shield, Pencil } from "lucide-react";

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview"|"favorites"|"inquiries">("overview");
  const [favs, setFavs] = useState<any[]>([]);
  const [inqs, setInqs] = useState<any[]>([]);

  useEffect(()=>{
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(d?.user?.id){setUser(d.user);loadData();}
      else router.push("/login");
      setLoading(false);
    }).catch(()=>{setLoading(false);router.push("/login");});
  },[router]);

  const loadData = async () => {
    try {
      const [fRes,iRes] = await Promise.all([
        fetch("/api/favorites").then(r=>r.json()),
        fetch("/api/inquiries").then(r=>r.json()),
      ]);
      setFavs(Array.isArray(fRes)?fRes:[]);
      setInqs(Array.isArray(iRes)?iRes:[]);
    } catch {}
  };

  const handleLogout = async () => {
    if(!confirm("정말 로그아웃 하시겠습니까?")) return;
    try { await fetch("/api/auth/logout",{method:"POST"}); } catch {}
    document.cookie="fixcar-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/");
  };

  if(loading) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div></>;
  if(!user) return null;

  const providerLabel = user.provider==="kakao"?"카카오":"픽스카";
  const providerColor = user.provider==="kakao"?"#FEE500":"#FF3B1E";
  const providerBg = user.provider==="kakao"?"#3C1E1E":"white";
  const displayId = user.email?.includes("@fixcar.local") ? user.email.replace("@fixcar.local","") : user.email;

  const MENU = [
    {icon:Heart,label:"찜 목록",count:favs.length,onClick:()=>setTab("favorites"),color:"#FF3B1E"},
    {icon:MessageSquare,label:"문의 내역",count:inqs.length,onClick:()=>setTab("inquiries"),color:"#1847FF"},
    {icon:Zap,label:"차량 MBTI",href:"/mbti",color:"#E8A020"},
    {icon:Bell,label:"알림",href:"/notifications",color:"#2D8A52"},
    {icon:Shield,label:"클린픽스카",href:"/clean",color:"#9B30FF"},
    {icon:Settings,label:"설정",href:"/settings",color:"#888"},
  ];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"28px 20px 100px"}}>

          {/* 프로필 카드 */}
          <div style={{background:"linear-gradient(135deg,#1A1A1A,#333)",borderRadius:22,padding:"28px 26px",marginBottom:20,color:"white",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-10,top:-20,fontFamily:"'Bebas Neue',serif",fontSize:120,color:"rgba(255,255,255,0.05)",lineHeight:1}}>FIXCAR</div>
            <div style={{display:"flex",alignItems:"center",gap:16,position:"relative",zIndex:1}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:"#FF3B1E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800}}>
                {(user.nickname||user.name||"U")[0]}
              </div>
              <div>
                {/* 닉네임 + 실명 둘 다 표시 */}
                <div style={{fontSize:20,fontWeight:800}}>{user.nickname||user.name}</div>
                {user.nickname&&<div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>실명: {user.name}</div>}
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>{displayId}</div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginTop:4}}>
                  <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:4,background:providerColor,color:providerBg}}>{providerLabel}</span>
                  {user.role!=="USER"&&<span style={{fontSize:10,background:"rgba(255,255,255,0.15)",padding:"2px 8px",borderRadius:4,fontWeight:700}}>{user.role}</span>}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:24,marginTop:20,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.1)"}}>
              <div><div style={{fontSize:20,fontWeight:800}}>{favs.length}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>찜 목록</div></div>
              <div><div style={{fontSize:20,fontWeight:800}}>{inqs.length}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>문의 내역</div></div>
              <div><div style={{fontSize:20,fontWeight:800}}>{inqs.filter((i:any)=>i.status==="REPLIED").length}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>답변 완료</div></div>
            </div>
          </div>

          {tab==="overview"&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
                {MENU.map(m=>{const Icon=m.icon;const inner=(<div style={{background:"white",borderRadius:16,padding:"22px 16px",textAlign:"center",cursor:"pointer",position:"relative"}}>{m.count!==undefined&&m.count>0&&<div style={{position:"absolute",top:10,right:10,background:"#FF3B1E",color:"white",borderRadius:100,minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>{m.count}</div>}<Icon size={24} color={m.color} style={{marginBottom:8}}/><div style={{fontSize:13,fontWeight:700,color:"#333"}}>{m.label}</div></div>);
                if(m.href) return <Link key={m.label} href={m.href}>{inner}</Link>;
                return <div key={m.label} onClick={m.onClick}>{inner}</div>;
                })}
              </div>
              {favs.length>0&&(
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:16,fontWeight:800}}>최근 찜한 차량</span>
                    <button onClick={()=>setTab("favorites")} style={{border:"none",background:"transparent",fontSize:12,fontWeight:700,color:"#FF3B1E",cursor:"pointer"}}>전체보기 →</button>
                  </div>
                  {favs.slice(0,3).map((f:any)=>(
                    <Link key={f.id} href={`/cars/${f.car?.id||f.carId}`}>
                      <div style={{background:"white",borderRadius:14,padding:"14px 18px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontSize:14,fontWeight:800}}>{f.car?.name||"차량"}</div><div style={{fontSize:11,color:"#AAA"}}>{f.car?.brand} · {f.car?.mileage?.toLocaleString()}km</div></div>
                        <div style={{fontSize:16,fontWeight:800,color:"#FF3B1E"}}>{f.car?.price?.toLocaleString()}<span style={{fontSize:10,color:"#AAA"}}>만</span></div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <button onClick={handleLogout} style={{width:"100%",padding:"16px",background:"white",border:"1.5px solid #E8E6E1",borderRadius:14,fontSize:14,fontWeight:700,color:"#E24B4A",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}><LogOut size={16}/> 로그아웃</button>
            </>
          )}

          {tab==="favorites"&&(
            <div>
              <button onClick={()=>setTab("overview")} style={{border:"none",background:"transparent",fontSize:13,fontWeight:700,color:"#888",cursor:"pointer",marginBottom:16}}>← 돌아가기</button>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:14}}>❤️ 찜 목록 ({favs.length})</h2>
              {favs.length===0?<div style={{background:"white",borderRadius:16,padding:"48px 20px",textAlign:"center",color:"#CCC"}}>찜한 차량이 없어요</div>:
              favs.map((f:any)=>(<Link key={f.id} href={`/cars/${f.car?.id||f.carId}`}><div style={{background:"white",borderRadius:14,padding:"16px 20px",marginBottom:8,display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:70,height:52,borderRadius:10,background:"#F0EEE9",overflow:"hidden",flexShrink:0}}>{f.car?.images?.[0]?<img src={f.car.images[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🚗</div>}</div>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800}}>{f.car?.name||"차량"}</div><div style={{fontSize:11,color:"#AAA"}}>{f.car?.mileage?.toLocaleString()}km · {f.car?.fuel}</div></div>
                <div style={{fontSize:16,fontWeight:800,color:"#FF3B1E"}}>{f.car?.price?.toLocaleString()}<span style={{fontSize:10,color:"#AAA"}}>만</span></div>
              </div></Link>))}
            </div>
          )}

          {tab==="inquiries"&&(
            <div>
              <button onClick={()=>setTab("overview")} style={{border:"none",background:"transparent",fontSize:13,fontWeight:700,color:"#888",cursor:"pointer",marginBottom:16}}>← 돌아가기</button>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:14}}>💬 문의 내역 ({inqs.length})</h2>
              {inqs.length===0?<div style={{background:"white",borderRadius:16,padding:"48px 20px",textAlign:"center",color:"#CCC"}}>문의 내역이 없어요</div>:
              inqs.map((inq:any)=>(<div key={inq.id} style={{background:"white",borderRadius:14,padding:"18px 20px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:14,fontWeight:800}}>{inq.car?.name||"차량"}</span>
                  <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:inq.status==="REPLIED"?"#EAF6EF":"#FFF0ED",color:inq.status==="REPLIED"?"#2D8A52":"#FF3B1E"}}>{inq.status==="REPLIED"?"답변완료":"대기중"}</span>
                </div>
                <p style={{fontSize:13,color:"#666",lineHeight:1.7}}>{inq.message}</p>
                {inq.reply&&(<div style={{background:"#F8F7F4",borderRadius:10,padding:"12px 14px",marginTop:8}}><div style={{fontSize:11,fontWeight:800,color:"#1847FF",marginBottom:4}}>딜러 답변</div><p style={{fontSize:13,color:"#555",lineHeight:1.7}}>{inq.reply}</p></div>)}
                <div style={{fontSize:11,color:"#CCC",marginTop:8}}>{new Date(inq.createdAt).toLocaleDateString("ko-KR")}</div>
              </div>))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
