// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/dealer/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, MessageSquare, Plus, Eye, TrendingUp, ChevronRight, Settings, Pencil, Award, Star, Zap, Flame, Shield, Heart, DollarSign, ChevronDown } from "lucide-react";

interface DealerProfile { verified?:boolean; soldCount?:number; favCount?:number; replyRate?:number; totalInq?:number; createdAt?:string; _count?:{cars?:number}; }
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
  const [showLedger, setShowLedger] = useState<number|null>(null);
  const [ledgerData, setLedgerData] = useState<Record<number,{buy:string;cost:string;sell:string}>>({});

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
      /* 차계부 localStorage 로드 */
      try{const ld=localStorage.getItem("fixcar_dealer_ledger");if(ld)setLedgerData(JSON.parse(ld));}catch{}
    } catch {}
    setLoading(false);
  };

  const saveLedger=(carId:number,data:{buy:string;cost:string;sell:string})=>{
    setLedgerData(prev=>{const next={...prev,[carId]:data};try{localStorage.setItem("fixcar_dealer_ledger",JSON.stringify(next));}catch{}return next;});
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
        {/* 헤더 */}
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
          {/* ═══ 통계 카드 (큰 글씨) ═══ */}
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

          {/* 바로가기 버튼 (통계 하단) */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24}}>
            {[
              {label:`문의 관리${pendingInq.length>0?` (${pendingInq.length})`:``}`,href:"/dealer/inquiries",icon:MessageSquare,color:pendingInq.length>0?"#FF3B1E":"#0066FF",bg:pendingInq.length>0?"#FFF0ED":"white"},
              {label:"매물 등록",href:"/dealer/cars/new",icon:Plus,color:"#2D8A52",bg:"white"},
              {label:"프로필 설정",href:"/dealer/profile",icon:Settings,color:"#888",bg:"white"},
            ].map(m=>{const Icon=m.icon;return(
              <Link key={m.label} href={m.href}>
                <div style={{background:m.bg,borderRadius:14,padding:"16px",textAlign:"center",cursor:"pointer",border:m.bg!=="#FFF0ED"?"1px solid #DDEEFF":"2px solid #FFB8A8"}}>
                  <Icon size={20} color={m.color} style={{marginBottom:6}}/>
                  <div style={{fontSize:13,fontWeight:700,color:m.color}}>{m.label}</div>
                </div>
              </Link>
            );})}
          </div>

          {/* ═══ 내 매물 (탭) ═══ */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h2 style={{fontSize:18,fontWeight:800}}>내 매물</h2>
            <Link href="/dealer/cars/new" style={{fontSize:13,fontWeight:700,color:"#0066FF"}}>+ 새 매물</Link>
          </div>

          {/* 탭 */}
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

          {/* 매물 리스트 */}
          {tabCars.length===0?(
            <div style={{background:"white",borderRadius:18,padding:"48px 24px",textAlign:"center"}}>
              <Car size={40} color="#CCC" style={{marginBottom:12}}/>
              <div style={{fontSize:16,fontWeight:700,color:"#AAA"}}>
                {carTab==="selling"?"판매 중인 매물이 없어요":carTab==="reviewing"?"검수 대기 중인 매물이 없어요":"판매 완료된 매물이 없어요"}
              </div>
            </div>
          ):(
            <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
              {tabCars.map((car:any,i:number)=>{
                const views=car.views||0;
                const favs=car._count?.favorites||car.favCount||0;
                const ledger=ledgerData[car.id]||{buy:"",cost:"",sell:""};
                const profit=ledger.sell&&ledger.buy?Number(ledger.sell)-Number(ledger.buy)-Number(ledger.cost||0):null;
                return(
                  <div key={car.id} style={{borderBottom:i<tabCars.length-1?"1px solid #F0F4FF":"none"}}>
                    <div style={{padding:"16px 22px",display:"flex",alignItems:"center",gap:14}}>
                      {/* 사진 */}
                      <div style={{width:80,height:60,borderRadius:10,background:"#F0F4FF",overflow:"hidden",flexShrink:0}}>
                        {car.images?.[0]?<img src={car.images[0].split("#")[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{display:"flex",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontSize:22}}>🚗</span>}
                      </div>
                      {/* 정보 */}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:15,fontWeight:800}}>{car.brand} {car.name}</div>
                        <div style={{fontSize:12,color:"#AAA",marginTop:2}}>{car.year}년 · {car.mileage?.toLocaleString()}km · {car.fuel}</div>
                      </div>
                      {/* 조회수/찜 (크게) */}
                      <div style={{display:"flex",gap:16,alignItems:"center"}}>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:18,fontWeight:800,color:"#E8A020"}}>{views.toLocaleString()}</div>
                          <div style={{fontSize:10,color:"#AAA"}}>조회</div>
                        </div>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:18,fontWeight:800,color:"#FF3B1E"}}>{favs}</div>
                          <div style={{fontSize:10,color:"#AAA"}}>찜</div>
                        </div>
                      </div>
                      {/* 가격 */}
                      <div style={{fontSize:16,fontWeight:800,color:"#0066FF",minWidth:80,textAlign:"right"}}>
                        {car.price?.toLocaleString()}<span style={{fontSize:10,color:"#AAA"}}>만</span>
                      </div>
                      {/* 상태 + 버튼 */}
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,
                          background:car.status==="AVAILABLE"?"#EAF6EF":car.status==="REVIEWING"?"#FFF8EC":"#F0EEE9",
                          color:car.status==="AVAILABLE"?"#2D8A52":car.status==="REVIEWING"?"#E8A020":"#888"}}>
                          {car.status==="AVAILABLE"?"판매중":car.status==="REVIEWING"?"검수대기":"완료"}
                        </span>
                        <Link href={`/cars/${car.id}`}>
                          <button style={{border:"1px solid #DDEEFF",background:"white",padding:"5px 10px",borderRadius:8,fontSize:11,fontWeight:700,color:"#0066FF",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>보기</button>
                        </Link>
                        {carTab==="sold"&&(
                          <button onClick={()=>setShowLedger(showLedger===car.id?null:car.id)} style={{border:"1px solid #B8DFC8",background:"#EAF6EF",padding:"5px 10px",borderRadius:8,fontSize:11,fontWeight:700,color:"#2D8A52",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",gap:4}}>
                            <DollarSign size={11}/>차계부
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ═══ 차계부 (판매완료 탭에서만) ═══ */}
                    {showLedger===car.id&&carTab==="sold"&&(
                      <div style={{padding:"0 22px 18px",background:"#F8FFF8"}}>
                        <div style={{background:"white",borderRadius:14,padding:"18px 20px",border:"1px solid #B8DFC8"}}>
                          <div style={{fontSize:14,fontWeight:800,color:"#2D8A52",marginBottom:12,display:"flex",alignItems:"center",gap:6}}><DollarSign size={16}/>차계부 — {car.brand} {car.name}</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
                            <div>
                              <label style={{fontSize:11,fontWeight:700,color:"#888",display:"block",marginBottom:4}}>매입가 (만원)</label>
                              <input type="number" value={ledger.buy} onChange={e=>saveLedger(car.id,{...ledger,buy:e.target.value})} placeholder="0" style={{width:"100%",padding:"10px 12px",border:"1.5px solid #E0DDD7",borderRadius:8,fontSize:14,fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                            </div>
                            <div>
                              <label style={{fontSize:11,fontWeight:700,color:"#888",display:"block",marginBottom:4}}>부대비용 (만원)</label>
                              <input type="number" value={ledger.cost} onChange={e=>saveLedger(car.id,{...ledger,cost:e.target.value})} placeholder="0" style={{width:"100%",padding:"10px 12px",border:"1.5px solid #E0DDD7",borderRadius:8,fontSize:14,fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                            </div>
                            <div>
                              <label style={{fontSize:11,fontWeight:700,color:"#888",display:"block",marginBottom:4}}>판매가 (만원)</label>
                              <input type="number" value={ledger.sell} onChange={e=>saveLedger(car.id,{...ledger,sell:e.target.value})} placeholder="0" style={{width:"100%",padding:"10px 12px",border:"1.5px solid #E0DDD7",borderRadius:8,fontSize:14,fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                            </div>
                          </div>
                          {profit!==null&&(
                            <div style={{background:profit>=0?"#EAF6EF":"#FFF0ED",borderRadius:10,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <span style={{fontSize:13,fontWeight:700,color:profit>=0?"#2D8A52":"#E24B4A"}}>예상 수익금</span>
                              <span style={{fontSize:22,fontWeight:800,color:profit>=0?"#2D8A52":"#E24B4A"}}>{profit>=0?"+":""}{profit.toLocaleString()}만원</span>
                            </div>
                          )}
                          <div style={{fontSize:10,color:"#AAA",marginTop:10,lineHeight:1.6}}>* 이 차계부는 개인 참고용이며 본인만 볼 수 있습니다. 데이터는 브라우저에만 저장되며 서버로 전송되지 않습니다. 법적 효력이 없으며 세무/회계 목적으로 사용할 수 없습니다.</div>
                        </div>
                      </div>
                    )}
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
