// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/dealer/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, MessageSquare, Plus, Eye, TrendingUp, ChevronRight, Settings, Pencil, Award, Star, Zap, Flame, Shield, Heart, DollarSign } from "lucide-react";

interface DealerProfile { verified?:boolean; soldCount?:number; favCount?:number; replyRate?:number; totalInq?:number; createdAt?:string; }
interface Badge { icon:React.ReactNode; label:string; color:string; bg:string; desc:string; }
function computeBadges(p:DealerProfile,n:number):Badge[]{const b:Badge[]=[];const d=p.createdAt?(Date.now()-new Date(p.createdAt).getTime())/86400000:999;if(p.verified)b.push({icon:<Shield size={12}/>,label:"인증딜러",color:"#2D8A52",bg:"#EAF6EF",desc:"픽스카 공식 인증"});if((p.soldCount||0)>=5)b.push({icon:<Award size={12}/>,label:"판매왕",color:"#E8A020",bg:"#FFF8E0",desc:`판매완료 ${p.soldCount}건`});if((p.totalInq||0)>=3&&(p.replyRate||0)>=80)b.push({icon:<Zap size={12}/>,label:"응답왕",color:"#0066FF",bg:"#EEF5FF",desc:`답변률 ${p.replyRate}%`});if(d<=60)b.push({icon:<Star size={12}/>,label:"신규딜러",color:"#FF3B1E",bg:"#FFF0ED",desc:"등록 60일 이내"});if(n>=5)b.push({icon:<Flame size={12}/>,label:"인기딜러",color:"#FF6B35",bg:"#FFF3EE",desc:`판매중 ${n}대`});return b;}

export default function DealerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [profile, setProfile] = useState<DealerProfile>({});
  const [loading, setLoading] = useState(true);
  const [carTab, setCarTab] = useState<"selling"|"reviewing"|"sold">("selling");

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(!d?.user?.id||(d.user.role!=="DEALER"&&d.user.role!=="ADMIN")){router.push("/");return;}
      setUser(d.user); loadData();
    }).catch(()=>router.push("/"));
  }, [router]);

  const loadData = async () => {
    try {
      const [cR,iR,pR] = await Promise.all([
        fetch("/api/dealer/cars").then(r=>r.json()).catch(()=>[]),
        fetch("/api/dealer/inquiries").then(r=>r.json()).catch(()=>[]),
        fetch("/api/dealer/profile").then(r=>r.json()).catch(()=>({})),
      ]);
      setCars(Array.isArray(cR)?cR:[]);
      setInquiries(Array.isArray(iR)?iR:[]);
      if(pR?.data)setProfile(pR.data);
    } catch {}
    setLoading(false);
  };

  if(loading)return<><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div></>;

  const activeCars=cars.filter(c=>c.status==="AVAILABLE");
  const reviewingCars=cars.filter(c=>c.status==="REVIEWING");
  const soldCars=cars.filter(c=>c.status==="SOLD"||c.status==="COMPLETED");
  const pendingInq=inquiries.filter((i:any)=>i.status==="PENDING");
  const badges=computeBadges(profile,activeCars.length);
  const totalViews=cars.reduce((s,c)=>s+(c.views||0),0);
  const totalFavs=cars.reduce((s,c)=>s+(c._count?.favorites||c.favCount||0),0);
  const tabCars=carTab==="selling"?activeCars:carTab==="reviewing"?reviewingCars:soldCars;

  return(
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F4FF;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F4FF"}}>
        <div style={{background:"white",borderBottom:"1px solid #DDEEFF",padding:"20px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:20,fontWeight:800}}>🏪 딜러 대시보드</div>
              <div style={{fontSize:13,color:"#888"}}>{user?.name}님, 오늘도 좋은 하루 되세요!</div>
              {badges.length>0&&<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>{badges.map(b=><div key={b.label} title={b.desc} style={{display:"flex",alignItems:"center",gap:4,background:b.bg,color:b.color,fontSize:11,fontWeight:800,padding:"3px 10px",borderRadius:100}}>{b.icon}{b.label}</div>)}</div>}
            </div>
            <Link href="/dealer/cars/new"><button style={{padding:"12px 24px",background:"#0066FF",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}><Plus size={16}/>매물 등록</button></Link>
          </div>
        </div>

        <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px 80px"}}>
          {/* 통계 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            {[
              {icon:Car,label:"판매 중",value:activeCars.length,color:"#0066FF"},
              {icon:Eye,label:"총 조회수",value:totalViews,color:"#E8A020"},
              {icon:Heart,label:"총 찜",value:totalFavs,color:"#FF3B1E"},
              {icon:TrendingUp,label:"판매 완료",value:soldCars.length,color:"#2D8A52"},
            ].map(s=>{const Icon=s.icon;return(
              <div key={s.label} style={{background:"white",borderRadius:16,padding:"22px 20px"}}>
                <Icon size={20} color={s.color} style={{marginBottom:8}}/>
                <div style={{fontSize:32,fontWeight:800,color:s.color}}>{s.value.toLocaleString()}</div>
                <div style={{fontSize:12,color:"#AAA"}}>{s.label}</div>
              </div>
            );})}
          </div>

          {/* 바로가기 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:24}}>
            {[
              {label:`문의 관리${pendingInq.length>0?` (${pendingInq.length})`:``}`,href:"/dealer/inquiries",icon:MessageSquare,color:pendingInq.length>0?"#FF3B1E":"#0066FF",bg:pendingInq.length>0?"#FFF0ED":"white"},
              {label:"매물 등록",href:"/dealer/cars/new",icon:Plus,color:"#2D8A52",bg:"white"},
              {label:"차계부",href:"/dealer/ledger",icon:DollarSign,color:"#E8A020",bg:"white"},
              {label:"프로필 설정",href:"/dealer/profile",icon:Settings,color:"#888",bg:"white"},
            ].map(m=>{const Icon=m.icon;return(
              <Link key={m.label} href={m.href}>
                <div style={{background:m.bg,borderRadius:14,padding:"16px",textAlign:"center",cursor:"pointer",border:m.bg==="#FFF0ED"?"2px solid #FFB8A8":"1px solid #DDEEFF"}}>
                  <Icon size={20} color={m.color} style={{marginBottom:6}}/>
                  <div style={{fontSize:13,fontWeight:700,color:m.color}}>{m.label}</div>
                </div>
              </Link>
            );})}
          </div>

          {/* 내 매물 */}
          <h2 style={{fontSize:18,fontWeight:800,marginBottom:12}}>내 매물</h2>
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            {([
              {id:"selling" as const,label:"판매 중",count:activeCars.length,color:"#0066FF"},
              {id:"reviewing" as const,label:"검수 대기",count:reviewingCars.length,color:"#E8A020"},
              {id:"sold" as const,label:"판매 완료",count:soldCars.length,color:"#2D8A52"},
            ]).map(t=>(
              <button key={t.id} onClick={()=>setCarTab(t.id)} style={{padding:"10px 18px",borderRadius:10,border:"none",fontSize:13,fontWeight:carTab===t.id?800:600,background:carTab===t.id?"white":"transparent",color:carTab===t.id?t.color:"#AAA",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",boxShadow:carTab===t.id?"0 2px 8px rgba(0,0,0,0.06)":"none",display:"flex",alignItems:"center",gap:6}}>
                {t.label}
                {t.count>0&&<span style={{background:carTab===t.id?t.color:"#E0DDD7",color:carTab===t.id?"white":"#888",borderRadius:100,minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>{t.count}</span>}
              </button>
            ))}
          </div>

          {tabCars.length===0?(
            <div style={{background:"white",borderRadius:18,padding:"48px 24px",textAlign:"center"}}>
              <Car size={40} color="#CCC" style={{marginBottom:12}}/>
              <div style={{fontSize:16,fontWeight:700,color:"#AAA"}}>{carTab==="selling"?"판매 중인 매물이 없어요":carTab==="reviewing"?"검수 대기 중인 매물이 없어요":"판매 완료된 매물이 없어요"}</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {tabCars.map((car:any)=>{
                const views=car.views||0;
                const favs=car._count?.favorites||car.favCount||0;
                const imgs=car.images||[];
                const img1=imgs[0]?imgs[0].split("#")[0]:"";
                const img2=(imgs[4]||imgs[1]||"").split("#")[0];
                return(
                  <div key={car.id} style={{background:"white",borderRadius:16,overflow:"hidden",border:"1px solid #EEEEFF"}}>
                    <Link href={`/cars/${car.id}`}>
                      <div style={{padding:"16px 22px",display:"flex",alignItems:"center",gap:16,cursor:"pointer",transition:"box-shadow 0.15s"}} onMouseOver={e=>(e.currentTarget.style.background="#FAFBFF")} onMouseOut={e=>(e.currentTarget.style.background="white")}>
                        <div style={{display:"flex",gap:3,flexShrink:0}}>
                          <div style={{width:100,height:75,borderRadius:10,overflow:"hidden",background:"#F0F4FF"}}>
                            {img1?<img src={img1} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 60%"}}/>:<span style={{display:"flex",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontSize:22}}>🚗</span>}
                          </div>
                          <div style={{width:100,height:75,borderRadius:10,overflow:"hidden",background:"#F0F4FF"}}>
                            {img2?<img src={img2} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 60%"}}/>:<span style={{display:"flex",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontSize:16,color:"#DDD"}}>📷</span>}
                          </div>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:15,fontWeight:800}}>{car.brand} {car.name}</div>
                          <div style={{fontSize:12,color:"#AAA",marginTop:2}}>{car.year}년 · {car.mileage?.toLocaleString()}km · {car.fuel}</div>
                        </div>
                        <div style={{display:"flex",gap:24,alignItems:"center"}}>
                          <div style={{textAlign:"center",minWidth:50}}>
                            <div style={{fontSize:20,fontWeight:800,color:"#E8A020"}}>{views.toLocaleString()}</div>
                            <div style={{fontSize:10,color:"#AAA",marginTop:2}}>조회수</div>
                          </div>
                          <div style={{textAlign:"center",minWidth:50}}>
                            <div style={{fontSize:20,fontWeight:800,color:"#FF3B1E"}}>{favs}</div>
                            <div style={{fontSize:10,color:"#AAA",marginTop:2}}>찜</div>
                          </div>
                        </div>
                        <div style={{fontSize:16,fontWeight:800,color:"#0066FF",minWidth:90,textAlign:"right"}}>
                          {car.price?.toLocaleString()}<span style={{fontSize:10,color:"#AAA"}}>만</span>
                        </div>
                        <span style={{fontSize:10,fontWeight:700,padding:"4px 12px",borderRadius:100,flexShrink:0,
                          background:car.status==="AVAILABLE"?"#EAF6EF":car.status==="REVIEWING"?"#FFF8EC":"#F0EEE9",
                          color:car.status==="AVAILABLE"?"#2D8A52":car.status==="REVIEWING"?"#E8A020":"#888"}}>
                          {car.status==="AVAILABLE"?"판매중":car.status==="REVIEWING"?"검수대기":"완료"}
                        </span>
                      </div>
                    </Link>
                    {/* 수정/삭제 버튼 */}
                    <div style={{padding:"0 22px 14px",display:"flex",gap:8}}>
                      <Link href={`/dealer/cars/new?edit=${car.id}`}>
                        <button style={{padding:"8px 16px",background:"#EEF5FF",border:"1.5px solid #0066FF",borderRadius:8,fontSize:12,fontWeight:700,color:"#0066FF",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>✏️ 수정</button>
                      </Link>
                      <button onClick={async(e)=>{
                        e.preventDefault();
                        const ok=confirm(`⚠️ "${car.brand} ${car.name}" 매물을 삭제하시겠습니까?\n\n• 삭제된 매물은 복구할 수 없습니다.\n• 결제된 광고비가 있는 경우 환불되지 않습니다.\n• 자세한 내용은 이용약관을 확인해주세요.`);
                        if(!ok)return;
                        try{
                          const res=await fetch(`/api/dealer/cars/${car.id}`,{method:"DELETE"});
                          const d=await res.json();
                          if(d.success){setCars(prev=>prev.filter(c=>c.id!==car.id));alert("매물이 삭제되었습니다.");}
                          else alert(d.error||"삭제 실패");
                        }catch{alert("네트워크 오류");}
                      }} style={{padding:"8px 16px",background:"white",border:"1.5px solid #E24B4A",borderRadius:8,fontSize:12,fontWeight:700,color:"#E24B4A",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>🗑 삭제</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
