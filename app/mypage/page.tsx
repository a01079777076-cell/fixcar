"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Heart, ShoppingBag, MessageCircle, Bell, Settings, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";

interface User { id:number; name:string; email:string; role:string; phone?:string; }
interface Favorite { id:number; car:{ id:number; name:string; price:number; year:number; mileage:number; fuel:string; images:string[]; }; }
interface Purchase { id:number; amount:number; status:string; createdAt:string; car:{ name:string; price:number; }; }
interface Inquiry { id:number; message:string; reply:string|null; status:string; createdAt:string; car:{ name:string; }; }

export default function MyPage() {
  const [user, setUser] = useState<User|null>(null);
  const [tab, setTab] = useState<"favorites"|"purchases"|"inquiries"|"alerts">("favorites");
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(d.user) setUser(d.user);
      else window.location.href="/login";
    });
  }, []);

  useEffect(() => {
    if(!user) return;
    setLoading(true);
    const fetches: Record<string, Promise<Response>> = {
      favorites: fetch("/api/favorites/list"),
      purchases: fetch("/api/purchases"),
      inquiries: fetch("/api/inquiries/my"),
    };
    Promise.all(Object.values(fetches)).then(async ([fRes,pRes,iRes]) => {
      const [fData,pData,iData] = await Promise.all([fRes.json(),pRes.json(),iRes.json()]);
      if(fData.success) setFavorites(fData.data||[]);
      if(pData.success) setPurchases(pData.data||[]);
      if(iData.success) setInquiries(iData.data||[]);
      setLoading(false);
    }).catch(()=>{
      setFavorites([]);setPurchases([]);setInquiries([]);setLoading(false);
    });
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method:"POST" });
    window.location.href = "/";
  };

  const STATUS_MAP: Record<string,string> = {
    DEPOSIT_PAID:"계약금 납부", BALANCE_PENDING:"잔금 대기", COMPLETED:"거래 완료", CANCELLED:"취소"
  };

  const TABS = [
    { key:"favorites" as const, label:"찜한 차량", icon:<Heart size={16}/>, count:favorites.length },
    { key:"purchases" as const, label:"구매 내역", icon:<ShoppingBag size={16}/>, count:purchases.length },
    { key:"inquiries" as const, label:"문의 내역", icon:<MessageCircle size={16}/>, count:inquiries.length },
    { key:"alerts" as const, label:"알림 설정", icon:<Bell size={16}/>, count:0 },
  ];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} @media(max-width:900px){.mypage-grid{grid-template-columns:1fr!important;}}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"36px 52px"}}>
          <div style={{maxWidth:"1000px",margin:"0 auto",display:"flex",alignItems:"center",gap:"18px"}}>
            <div style={{width:"56px",height:"56px",background:"#FF3B1E",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",fontWeight:800,color:"white",flexShrink:0}}>
              {user?.name?.[0]||"?"}
            </div>
            <div>
              <div style={{fontSize:"20px",fontWeight:800,color:"white"}}>{user?.name||"로딩 중..."}</div>
              <div style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",fontWeight:400}}>{user?.email}</div>
              {user?.role==="DEALER"&&<span style={{background:"#0066FF",color:"white",padding:"2px 10px",borderRadius:"100px",fontSize:"11px",fontWeight:800,display:"inline-block",marginTop:"4px"}}>딜러</span>}
              {user?.role==="ADMIN"&&<span style={{background:"#FF3B1E",color:"white",padding:"2px 10px",borderRadius:"100px",fontSize:"11px",fontWeight:800,display:"inline-block",marginTop:"4px"}}>관리자</span>}
            </div>
          </div>
        </div>

        <div style={{maxWidth:"1000px",margin:"0 auto",padding:"24px 32px 80px"}}>
          <div className="mypage-grid" style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:"20px",alignItems:"start"}}>
            {/* 사이드 메뉴 */}
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              <div style={{background:"white",borderRadius:"16px",overflow:"hidden"}}>
                {TABS.map(t=>(
                  <button key={t.key} onClick={()=>setTab(t.key)} style={{width:"100%",padding:"13px 16px",border:"none",background:tab===t.key?"#EEF2FF":"white",color:tab===t.key?"#1847FF":"#555",textAlign:"left",fontSize:"14px",fontWeight:tab===t.key?800:600,cursor:"pointer",borderBottom:"1px solid #F0EEE9",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>{t.icon}{t.label}</div>
                    {t.count>0&&<span style={{background:tab===t.key?"#1847FF":"#F0EEE9",color:tab===t.key?"white":"#888",padding:"1px 7px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>{t.count}</span>}
                  </button>
                ))}
              </div>
              <div style={{background:"white",borderRadius:"16px",overflow:"hidden"}}>
                {[{href:"/alerts",icon:<Bell size={15}/>,label:"매물 알림"},{href:"/compare",icon:<ChevronRight size={15}/>,label:"차량 비교"},{href:"/quiz",icon:<ChevronRight size={15}/>,label:"AI 추천 퀴즈"}].map(m=>(
                  <Link key={m.href} href={m.href}>
                    <div style={{padding:"12px 16px",fontSize:"13px",fontWeight:600,color:"#555",display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid #F0EEE9",cursor:"pointer"}}>{m.icon}{m.label}</div>
                  </Link>
                ))}
                <button onClick={handleLogout} style={{width:"100%",padding:"12px 16px",border:"none",background:"white",color:"#E24B4A",fontSize:"13px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",textAlign:"left"}}>
                  <LogOut size={15}/>로그아웃
                </button>
              </div>
            </div>

            {/* 콘텐츠 */}
            <div>
              {loading ? (
                <div style={{background:"white",borderRadius:"18px",padding:"60px",textAlign:"center",color:"#AAA"}}>로딩 중...</div>
              ) : tab==="favorites" ? (
                <div>
                  {favorites.length===0 ? (
                    <div style={{background:"white",borderRadius:"18px",padding:"60px",textAlign:"center"}}>
                      <Heart size={40} color="#E0DDD7" style={{margin:"0 auto 12px"}}/>
                      <div style={{fontSize:"16px",fontWeight:800,marginBottom:"8px"}}>찜한 차량이 없어요</div>
                      <div style={{fontSize:"14px",color:"#AAA",fontWeight:400,marginBottom:"20px"}}>마음에 드는 차량을 찜해보세요!</div>
                      <Link href="/cars"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"12px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>매물 보러가기</button></Link>
                    </div>
                  ) : (
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}}>
                      {favorites.map(f=>(
                        <Link key={f.id} href={`/cars/${f.car.id}`}>
                          <div style={{background:"white",borderRadius:"16px",overflow:"hidden",cursor:"pointer",transition:"box-shadow 0.2s"}}>
                            <div style={{height:"140px",background:"#F0EEE9",overflow:"hidden"}}>
                              {f.car.images?.[0]&&<img src={f.car.images[0]} alt={f.car.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                            </div>
                            <div style={{padding:"12px 14px"}}>
                              <div style={{fontSize:"14px",fontWeight:800,marginBottom:"3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.car.name}</div>
                              <div style={{fontSize:"11px",color:"#AAA",fontWeight:400}}>{f.car.year}년 · {f.car.mileage?.toLocaleString()}km · {f.car.fuel}</div>
                              <div style={{fontSize:"17px",fontWeight:800,color:"#FF3B1E",marginTop:"6px"}}>{f.car.price?.toLocaleString()}<span style={{fontSize:"11px",color:"#AAA"}}>만원</span></div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : tab==="purchases" ? (
                <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                  {purchases.length===0?(
                    <div style={{background:"white",borderRadius:"18px",padding:"60px",textAlign:"center",color:"#AAA"}}><ShoppingBag size={40} color="#E0DDD7" style={{margin:"0 auto 12px"}}/><div style={{fontSize:"16px",fontWeight:800}}>구매 내역이 없어요</div></div>
                  ):purchases.map(p=>(
                    <div key={p.id} style={{background:"white",borderRadius:"16px",padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
                      <div>
                        <div style={{fontSize:"15px",fontWeight:800,marginBottom:"3px"}}>{p.car?.name}</div>
                        <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{p.createdAt?.slice(0,10)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:"18px",fontWeight:800,color:"#FF3B1E"}}>{p.amount?.toLocaleString()}<span style={{fontSize:"12px",color:"#AAA"}}>만원</span></div>
                        <span style={{background:"#EAF6EF",color:"#2D8A52",padding:"3px 10px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>{STATUS_MAP[p.status]||p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : tab==="inquiries" ? (
                <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                  {inquiries.length===0?(
                    <div style={{background:"white",borderRadius:"18px",padding:"60px",textAlign:"center",color:"#AAA"}}><MessageCircle size={40} color="#E0DDD7" style={{margin:"0 auto 12px"}}/><div style={{fontSize:"16px",fontWeight:800}}>문의 내역이 없어요</div></div>
                  ):inquiries.map(i=>(
                    <div key={i.id} style={{background:"white",borderRadius:"16px",padding:"16px 18px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
                        <div style={{fontSize:"14px",fontWeight:800}}>{i.car?.name}</div>
                        <span style={{background:i.status==="PENDING"?"#FFF8EC":"#EAF6EF",color:i.status==="PENDING"?"#E8A020":"#2D8A52",padding:"2px 9px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>{i.status==="PENDING"?"미답변":"답변완료"}</span>
                      </div>
                      <div style={{fontSize:"13px",color:"#555",fontWeight:400,marginBottom:i.reply?"10px":"0"}}>{i.message}</div>
                      {i.reply&&<div style={{background:"#EEF2FF",borderRadius:"8px",padding:"10px 12px",fontSize:"13px",color:"#1847FF",fontWeight:400}}>{i.reply}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{background:"white",borderRadius:"18px",padding:"24px"}}>
                  <div style={{fontSize:"16px",fontWeight:800,marginBottom:"16px"}}>매물 알림 관리</div>
                  <Link href="/alerts"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"13px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"7px"}}><Bell size={15}/>알림 설정 바로가기</button></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
