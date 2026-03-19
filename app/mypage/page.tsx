"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface UserData { name?: string; email?: string; kakaoId?: string; createdAt?: string; }
interface Favorite { id: string; car: { id: string; title: string; price: number; year: number; mileage: number; fuelType: string; imageUrl?: string } }
interface Inquiry { id: string; car: { title: string }; message: string; createdAt: string; status: string }

export default function MyPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [tab, setTab] = useState<"overview"|"favorites"|"inquiries"|"mbti"|"alert">("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session").then(r => r.json()).catch(() => null),
      fetch("/api/favorites/list").then(r => r.json()).catch(() => []),
      fetch("/api/inquiries/my").then(r => r.json()).catch(() => []),
    ]).then(([session, favs, inqs]) => {
      if (session?.user) setUser(session.user);
      if (Array.isArray(favs)) setFavorites(favs);
      if (Array.isArray(inqs)) setInquiries(inqs);
      setLoading(false);
    });
  }, []);

  /* 해시로 탭 이동 */
  useEffect(() => {
    const hash = window.location.hash.replace("#","");
    if (hash === "favorites") setTab("favorites");
    else if (hash === "inquiries") setTab("inquiries");
  }, []);

  if (loading) return (
    <>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center",color:"#AAA"}}>
          <div style={{fontSize:32,marginBottom:12}}>⏳</div>
          <div style={{fontSize:14,fontWeight:700}}>로딩 중...</div>
        </div>
      </div>
    </>
  );

  if (!user) return (
    <>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{textAlign:"center",background:"white",borderRadius:22,padding:"48px 32px",maxWidth:400,width:"100%"}}>
          <div style={{fontSize:48,marginBottom:16}}>🔒</div>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:8}}>로그인이 필요해요</h2>
          <p style={{fontSize:14,color:"#888",fontWeight:400,marginBottom:24}}>마이페이지는 로그인 후 이용할 수 있어요</p>
          <a href="/api/auth/kakao/callback">
            <button style={{padding:"14px 32px",background:"#FEE500",color:"#3C1E1E",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>🗨️ 카카오 로그인</button>
          </a>
        </div>
      </div>
    </>
  );

  const TABS = [
    {id:"overview" as const,label:"내 정보",icon:"👤"},
    {id:"favorites" as const,label:"찜 목록",icon:"❤️",count:favorites.length},
    {id:"inquiries" as const,label:"문의 내역",icon:"💬",count:inquiries.length},
    {id:"mbti" as const,label:"차량 성향",icon:"🧬"},
    {id:"alert" as const,label:"희망 매물 알림",icon:"🔔"},
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 헤더 */}
        <div style={{background:"#1A1A1A",padding:"36px 24px 28px"}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:"#FF3B1E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:"white",fontWeight:800}}>
                {(user.name||"U")[0]}
              </div>
              <div>
                <h1 style={{fontSize:22,fontWeight:800,color:"white"}}>{user.name||"회원"}</h1>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:400}}>{user.email||"카카오 로그인 사용자"}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{maxWidth:800,margin:"0 auto",padding:"20px 16px 120px"}}>
          {/* 탭 */}
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:"10px 16px",borderRadius:12,border:"none",fontSize:13,fontWeight:tab===t.id?800:600,
                background:tab===t.id?"#1A1A1A":"white",color:tab===t.id?"white":"#777",
                cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",whiteSpace:"nowrap",
                display:"flex",alignItems:"center",gap:6,boxShadow:tab===t.id?"none":"0 1px 4px rgba(0,0,0,0.06)",
              }}>
                <span style={{fontSize:15}}>{t.icon}</span> {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span style={{background:tab===t.id?"#FF3B1E":"#E8E6E1",color:tab===t.id?"white":"#888",padding:"2px 7px",borderRadius:100,fontSize:10,fontWeight:800}}>{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ═══ 내 정보 탭 ═══ */}
          {tab === "overview" && (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"white",borderRadius:18,padding:"22px 24px"}}>
                <div style={{fontSize:15,fontWeight:800,marginBottom:16}}>계정 정보</div>
                {[
                  ["이름",user.name||"-"],
                  ["이메일",user.email||"-"],
                  ["로그인 방식","카카오"],
                ].map(([l,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<2?"1px solid #F0EEE9":"none"}}>
                    <span style={{fontSize:13,color:"#888",fontWeight:400}}>{l}</span>
                    <span style={{fontSize:13,fontWeight:700}}>{v}</span>
                  </div>
                ))}
              </div>

              {/* 빠른 메뉴 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  {icon:"❤️",label:"찜 목록",count:`${favorites.length}대`,action:()=>setTab("favorites")},
                  {icon:"💬",label:"문의 내역",count:`${inquiries.length}건`,action:()=>setTab("inquiries")},
                  {icon:"🧬",label:"차량 MBTI",count:"성향 분석",action:()=>setTab("mbti")},
                  {icon:"🔔",label:"희망 매물 알림",count:"알림 관리",action:()=>setTab("alert")},
                ].map((item,i)=>(
                  <button key={i} onClick={item.action} style={{
                    background:"white",borderRadius:16,padding:"20px 16px",border:"none",cursor:"pointer",
                    textAlign:"left",fontFamily:"'NanumSquareRound',sans-serif",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{fontSize:24,marginBottom:8}}>{item.icon}</div>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>{item.label}</div>
                    <div style={{fontSize:12,color:"#AAA",fontWeight:400}}>{item.count}</div>
                  </button>
                ))}
              </div>

              {/* 기타 메뉴 */}
              <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
                {[
                  {label:"내 차 팔기",href:"/sell",icon:"🚙"},
                  {label:"고객센터",href:"/contact",icon:"📞"},
                  {label:"이용약관",href:"/terms",icon:"📋"},
                  {label:"개인정보처리방침",href:"/privacy",icon:"🔐"},
                ].map((item,i)=>(
                  <Link key={i} href={item.href} style={{
                    display:"flex",alignItems:"center",gap:12,padding:"14px 20px",textDecoration:"none",
                    borderBottom:i<3?"1px solid #F0EEE9":"none",
                  }}>
                    <span style={{fontSize:16}}>{item.icon}</span>
                    <span style={{fontSize:14,fontWeight:600,color:"#555",flex:1}}>{item.label}</span>
                    <span style={{color:"#CCC",fontSize:14}}>›</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ═══ 찜 목록 탭 ═══ */}
          {tab === "favorites" && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {favorites.length === 0 ? (
                <div style={{background:"white",borderRadius:18,padding:"60px 24px",textAlign:"center"}}>
                  <div style={{fontSize:40,marginBottom:12}}>❤️</div>
                  <div style={{fontSize:16,fontWeight:800,marginBottom:6}}>찜한 차량이 없어요</div>
                  <p style={{fontSize:13,color:"#AAA",fontWeight:400,marginBottom:20}}>마음에 드는 차량에 하트를 눌러보세요</p>
                  <Link href="/cars"><button style={{padding:"12px 24px",background:"#FF3B1E",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>매물 보러가기</button></Link>
                </div>
              ) : favorites.map(fav=>(
                <Link key={fav.id} href={`/cars/${fav.car.id}`} style={{textDecoration:"none"}}>
                  <div style={{background:"white",borderRadius:16,padding:"16px 18px",display:"flex",gap:14,alignItems:"center"}}>
                    <div style={{width:80,height:60,borderRadius:10,background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#AAA",flexShrink:0}}>
                      {fav.car.imageUrl ? <img src={fav.car.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}}/> : "📷"}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:800,color:"#1A1A1A"}}>{fav.car.title}</div>
                      <div style={{fontSize:12,color:"#AAA",fontWeight:400,marginTop:2}}>{fav.car.year}년식 · {fav.car.mileage?.toLocaleString()}km · {fav.car.fuelType}</div>
                    </div>
                    <div style={{fontSize:16,fontWeight:800,color:"#FF3B1E"}}>{fav.car.price?.toLocaleString()}<span style={{fontSize:11,color:"#AAA"}}>만원</span></div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ═══ 문의 내역 탭 ═══ */}
          {tab === "inquiries" && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {inquiries.length === 0 ? (
                <div style={{background:"white",borderRadius:18,padding:"60px 24px",textAlign:"center"}}>
                  <div style={{fontSize:40,marginBottom:12}}>💬</div>
                  <div style={{fontSize:16,fontWeight:800,marginBottom:6}}>문의 내역이 없어요</div>
                  <p style={{fontSize:13,color:"#AAA",fontWeight:400}}>차량에 대해 궁금한 점을 문의해보세요</p>
                </div>
              ) : inquiries.map(inq=>(
                <div key={inq.id} style={{background:"white",borderRadius:16,padding:"18px 20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:14,fontWeight:800}}>{inq.car?.title||"차량"}</span>
                    <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:100,
                      background:inq.status==="ANSWERED"?"#E8F8EF":"#FFF8EC",
                      color:inq.status==="ANSWERED"?"#00A854":"#CC8800",
                    }}>{inq.status==="ANSWERED"?"답변완료":"대기중"}</span>
                  </div>
                  <p style={{fontSize:13,color:"#888",fontWeight:400,lineHeight:1.6}}>{inq.message}</p>
                  <div style={{fontSize:11,color:"#CCC",marginTop:8,fontWeight:400}}>{new Date(inq.createdAt).toLocaleDateString("ko-KR")}</div>
                </div>
              ))}
            </div>
          )}

          {/* ═══ 차량 성향 (MBTI) 탭 ═══ */}
          {tab === "mbti" && (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"linear-gradient(135deg, #1A1A1A 0%, #0f3460 100%)",borderRadius:22,padding:"36px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"radial-gradient(ellipse at 30% 20%, rgba(255,59,30,0.15) 0%, transparent 60%)"}}/>
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{fontSize:48,marginBottom:12}}>🧬</div>
                  <h2 style={{fontSize:22,fontWeight:800,color:"white",marginBottom:8}}>나의 차량 성향 MBTI</h2>
                  <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",fontWeight:400,lineHeight:1.7,marginBottom:24}}>
                    12가지 질문으로 나에게 딱 맞는<br/>차량 유형을 분석해 드려요
                  </p>
                  <Link href="/mbti">
                    <button style={{padding:"14px 32px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                      MBTI 테스트 하러가기 →
                    </button>
                  </Link>
                </div>
              </div>

              <div style={{background:"white",borderRadius:18,padding:"22px 24px"}}>
                <div style={{fontSize:15,fontWeight:800,marginBottom:16}}>이런 걸 알 수 있어요</div>
                {[
                  {icon:"📏",title:"선호하는 차량 크기",desc:"소형 ↔ 대형"},
                  {icon:"🎯",title:"원하는 주행 스타일",desc:"스포티 ↔ 편안"},
                  {icon:"⛽",title:"맞는 연료 타입",desc:"내연기관 ↔ 전기차"},
                  {icon:"💎",title:"새차 vs 가성비 중고 성향",desc:"구매 스타일 분석"},
                  {icon:"🏆",title:"우선순위 정리",desc:"1순위 대형 SUV, 2순위 세단 등"},
                ].map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:i<4?"1px solid #F0EEE9":"none",alignItems:"center"}}>
                    <span style={{fontSize:22}}>{item.icon}</span>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:"#1A1A1A"}}>{item.title}</div>
                      <div style={{fontSize:12,color:"#AAA",fontWeight:400}}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ 희망 매물 알림 탭 ═══ */}
          {tab === "alert" && (
            <WishAlertSection userKakao={!!user.kakaoId || !!user.email} />
          )}
        </div>
      </div>
    </>
  );
}

/* ─── 매물 알림 설정 서브 컴포넌트 ─── */
function WishAlertSection({ userKakao }: { userKakao: boolean }) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [alerts, setAlerts] = useState<{id:string;brand:string;model:string;priceRange:string}[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const BRANDS: Record<string,string[]> = {
    "현대":["아반떼","쏘나타","그랜저","투싼","싼타페","팰리세이드","아이오닉5","아이오닉6","코나","캐스퍼","스타리아","넥쏘"],
    "기아":["K3","K5","K8","K9","스포티지","쏘렌토","카니발","셀토스","EV6","EV9","EV3","니로","모닝","레이"],
    "제네시스":["G70","G80","G90","GV70","GV80","GV60"],
    "BMW":["1시리즈","3시리즈","5시리즈","7시리즈","X1","X3","X5","X7","i4","iX","M3","M5"],
    "메르세데스-벤츠":["C-클래스","E-클래스","S-클래스","GLA","GLC","GLE","GLS","EQA","EQE","EQS"],
    "아우디":["A3","A5","A6","A7","A8","Q3","Q5","Q7","Q8","e-tron GT"],
    "테슬라":["모델 3","모델 Y","모델 S","모델 X"],
    "볼보":["S60","S90","XC40","XC60","XC90","EX30","EX90"],
    "토요타":["캠리","RAV4","프리우스","크라운","하이랜더"],
    "렉서스":["ES","IS","NX","RX","LS","UX","LX"],
    "포르쉐":["카이엔","마칸","타이칸","파나메라","911"],
    "기타":["직접입력"],
  };

  const models = selectedBrand ? BRANDS[selectedBrand] || [] : [];

  const handleSave = () => {
    if (!selectedBrand || !selectedModel) { alert("브랜드와 모델을 선택해주세요"); return; }
    const newAlert = {
      id: Date.now().toString(),
      brand: selectedBrand,
      model: selectedModel,
      priceRange: priceMin || priceMax ? `${priceMin||"0"}~${priceMax||"∞"}만원` : "전체",
    };
    setAlerts(prev => [...prev, newAlert]);
    setSelectedBrand(""); setSelectedModel(""); setPriceMin(""); setPriceMax(""); setYearMin("");
    setShowForm(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const deleteAlert = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {saved && (
        <div style={{background:"#E8F8EF",border:"1px solid #B8DFC8",borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:16}}>✅</span>
          <span style={{fontSize:14,fontWeight:700,color:"#2D8A52"}}>알림이 등록됐어요! 매물이 들어오면 알려드릴게요.</span>
        </div>
      )}

      {/* 알림 설정한 매물 */}
      <div style={{background:"white",borderRadius:18,padding:"22px 24px"}}>
        <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>알림 설정한 매물</div>
        <p style={{fontSize:12,color:"#AAA",fontWeight:400,marginBottom:16}}>조건에 맞는 매물이 등록되면 알려드려요</p>
        {alerts.length === 0 ? (
          <div style={{textAlign:"center",padding:"32px 0",color:"#CCC"}}>
            <div style={{fontSize:32,marginBottom:8}}>🔔</div>
            <div style={{fontSize:13,fontWeight:600}}>등록된 알림이 없어요</div>
          </div>
        ) : alerts.map(a => (
          <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:"#FAFAF8",borderRadius:12,marginBottom:8}}>
            <div>
              <div style={{fontSize:14,fontWeight:800}}>{a.brand} {a.model}</div>
              <div style={{fontSize:11,color:"#AAA",fontWeight:400}}>가격: {a.priceRange}</div>
            </div>
            <button onClick={() => deleteAlert(a.id)} style={{padding:"6px 12px",background:"#FFF0ED",color:"#E24B4A",border:"none",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>삭제</button>
          </div>
        ))}
      </div>

      {/* 알림 등록 버튼/폼 */}
      {!showForm ? (
        <button onClick={() => {
          if (!userKakao) { /* 카카오 미연동 시 안내 */ }
          setShowForm(true);
        }} style={{
          width:"100%",padding:"18px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
        }}>
          + 내가 원하는 차량 알림등록하기
        </button>
      ) : (
        <div style={{background:"white",borderRadius:18,padding:"24px"}}>
          <div style={{fontSize:15,fontWeight:800,marginBottom:18}}>🔔 알림 등록</div>

          {/* 카카오 미연동 안내 */}
          {!userKakao && (
            <div style={{background:"#FFF8EC",border:"1px solid #FFD89A",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:"#7A5500",marginBottom:8}}>카카오 연동이 필요해요!</div>
              <p style={{fontSize:12,color:"#AA8800",fontWeight:400,marginBottom:10}}>알림을 받으려면 카카오 로그인 연동이 필요해요. 5초면 끝나요!</p>
              <a href="/api/auth/kakao/callback">
                <button style={{padding:"10px 20px",background:"#FEE500",color:"#3C1E1E",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                  🗨️ 카카오 연동하러 가기!
                </button>
              </a>
            </div>
          )}

          {/* 브랜드 선택 */}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>브랜드 선택</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {Object.keys(BRANDS).map(b => (
                <button key={b} onClick={() => { setSelectedBrand(b); setSelectedModel(""); }} style={{
                  padding:"8px 16px",borderRadius:10,border:selectedBrand===b?"2px solid #FF3B1E":"1.5px solid #E0DDD7",
                  background:selectedBrand===b?"#FFF0ED":"white",color:selectedBrand===b?"#FF3B1E":"#555",
                  fontSize:13,fontWeight:selectedBrand===b?800:600,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                }}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 모델 선택 - 선택한 브랜드에 따라 표시 */}
          {selectedBrand && (
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>모델 선택</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {models.map(m => (
                  <button key={m} onClick={() => setSelectedModel(m)} style={{
                    padding:"8px 14px",borderRadius:10,border:selectedModel===m?"2px solid #1847FF":"1.5px solid #E0DDD7",
                    background:selectedModel===m?"#EEF2FF":"white",color:selectedModel===m?"#1847FF":"#555",
                    fontSize:13,fontWeight:selectedModel===m?800:600,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                  }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 가격 범위 */}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>희망 가격대 (만원)</label>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <input type="number" placeholder="최소" value={priceMin} onChange={e=>setPriceMin(e.target.value)}
                style={{flex:1,padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"#FAFAF8"}}/>
              <span style={{color:"#AAA",fontWeight:700}}>~</span>
              <input type="number" placeholder="최대" value={priceMax} onChange={e=>setPriceMax(e.target.value)}
                style={{flex:1,padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"#FAFAF8"}}/>
            </div>
          </div>

          {/* 최소 연식 */}
          <div style={{marginBottom:20}}>
            <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>최소 연식</label>
            <input type="number" placeholder="예: 2020" value={yearMin} onChange={e=>setYearMin(e.target.value)}
              style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"#FAFAF8"}}/>
          </div>

          <div style={{display:"flex",gap:10}}>
            <button onClick={handleSave} style={{flex:1,padding:"14px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>등록하기</button>
            <button onClick={()=>setShowForm(false)} style={{padding:"14px 20px",background:"#F0EEE9",color:"#888",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}
