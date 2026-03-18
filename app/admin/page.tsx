import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Car, DollarSign, MessageCircle, TrendingUp, Shield, Settings, FileText } from "lucide-react";

async function getStats() {
  try {
    const [userCount, carCount, dealerCount, inquiryCount, pendingCars, pendingDealers] = await Promise.all([
      prisma.user.count(),
      prisma.car.count({ where: { status:"AVAILABLE" } }),
      prisma.user.count({ where: { role:"DEALER" } }),
      prisma.inquiry.count({ where: { status:"PENDING" } }),
      prisma.car.count({ where: { status:"PENDING" } }),
      prisma.dealerApplication?.count({ where: { status:"PENDING" } }).catch(()=>0) || 0,
    ]);
    return { userCount, carCount, dealerCount, inquiryCount, pendingCars, pendingDealers };
  } catch {
    return { userCount:0, carCount:0, dealerCount:0, inquiryCount:0, pendingCars:0, pendingDealers:0 };
  }
}

export default async function AdminDashboard() {
  const cookieStore = cookies();
  const token = cookieStore.get("fixcar-token")?.value;
  if (!token) redirect("/login");
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") redirect("/");

  const stats = await getStats();

  const KPI = [
    { label:"총 회원수", value:stats.userCount.toLocaleString()+"명", icon:<Users size={22} color="white"/>, color:"#1847FF", href:"/admin/users" },
    { label:"딜러수", value:stats.dealerCount.toLocaleString()+"명", icon:<Shield size={22} color="white"/>, color:"#2D8A52", href:"/admin/dealers" },
    { label:"현재 매물", value:stats.carCount.toLocaleString()+"대", icon:<Car size={22} color="white"/>, color:"#FF3B1E", href:"/admin/cars" },
    { label:"답변 대기 문의", value:stats.inquiryCount.toLocaleString()+"건", icon:<MessageCircle size={22} color="white"/>, color:"#E8A020", href:"/admin/reports" },
  ];

  const QUICK_LINKS = [
    { label:"매물 검수 대기", count:stats.pendingCars, href:"/admin/cars", color:"#FF3B1E" },
    { label:"딜러 신청 대기", count:stats.pendingDealers, href:"/admin/dealers", color:"#E8A020" },
    { label:"블로그 글쓰기", count:null, href:"/blog/write", color:"#1847FF" },
    { label:"사이트 설정", count:null, href:"/admin/settings", color:"#555" },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        .kpi-card{background:white;border-radius:18px;padding:22px;display:flex;align-items:center;gap:16px;transition:all 0.2s;}
        .kpi-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.07);}
        .quick-link{background:white;border-radius:14px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;transition:all 0.2s;cursor:pointer;}
        .quick-link:hover{background:#F8F6F2;}
        @media(max-width:768px){.kpi-grid{grid-template-columns:1fr 1fr!important;}}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 어드민 네비 */}
        <div style={{background:"#1A1A1A",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <a href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span> <span style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:700,letterSpacing:0}}>관리자</span></a>
          <div style={{display:"flex",gap:"20px"}}>
            {[["대시보드","/admin"],["회원","/admin/users"],["매물","/admin/cars"],["딜러신청","/admin/dealers"],["신고","/admin/reports"],["정산","/admin/settlements"],["설정","/admin/settings"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/admin"?"white":"rgba(255,255,255,0.4)"}}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <div style={{marginBottom:"28px"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF3B1E",marginBottom:"8px"}}>ADMIN</div>
            <h1 style={{fontSize:"28px",fontWeight:800,letterSpacing:"-1px"}}>관리자 대시보드</h1>
            <p style={{fontSize:"14px",color:"#888",marginTop:"4px",fontWeight:400}}>안녕하세요! 오늘도 픽스카를 운영해주셔서 감사해요 🙌</p>
          </div>

          {/* KPI */}
          <div className="kpi-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px"}}>
            {KPI.map(k=>(
              <a key={k.label} href={k.href} className="kpi-card">
                <div style={{width:"48px",height:"48px",background:k.color,borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{k.icon}</div>
                <div><div style={{fontSize:"13px",color:"#AAA",fontWeight:400,marginBottom:"3px"}}>{k.label}</div><div style={{fontSize:"24px",fontWeight:800,letterSpacing:"-0.5px"}}>{k.value}</div></div>
              </a>
            ))}
          </div>

          {/* 긴급 처리 + 빠른 링크 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"24px"}}>
            <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
              <div style={{fontSize:"16px",fontWeight:800,marginBottom:"14px"}}>⚡ 긴급 처리 항목</div>
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {QUICK_LINKS.filter(q=>q.count!==null).map(q=>(
                  <a key={q.label} href={q.href} className="quick-link">
                    <span style={{fontSize:"14px",fontWeight:700}}>{q.label}</span>
                    {q.count !== null && <span style={{background:Number(q.count)>0?"#FFF0ED":"#EAF6EF",color:Number(q.count)>0?q.color:"#2D8A52",padding:"3px 12px",borderRadius:"100px",fontSize:"13px",fontWeight:800}}>{q.count}건</span>}
                  </a>
                ))}
              </div>
            </div>
            <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
              <div style={{fontSize:"16px",fontWeight:800,marginBottom:"14px"}}>🔗 빠른 링크</div>
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {[["✍️ 블로그 글쓰기","/blog/write"],["📊 딜러 신청 관리","/admin/dealers"],["💰 수수료 정산","/admin/settlements"],["⚙️ 사이트 설정","/admin/settings"]].map(([l,h])=>(
                  <a key={l as string} href={h as string} className="quick-link"><span style={{fontSize:"14px",fontWeight:700}}>{l}</span><span style={{fontSize:"16px",color:"#DDD"}}>→</span></a>
                ))}
              </div>
            </div>
          </div>

          {/* 관리자 전용 메모 */}
          <div style={{background:"#1A1A1A",borderRadius:"18px",padding:"24px 28px"}}>
            <div style={{fontSize:"15px",fontWeight:800,color:"white",marginBottom:"12px"}}>📋 운영 노트</div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {[
                "Railway DB: 매달 $5 Hobby 플랜 유지 필요 (database.railway.app)",
                "Vercel 무료 플랜: 월 100GB 대역폭 초과 시 Pro 전환 필요",
                "카히스토리 API: 건당 770원 (사고이력 조회 연동 전 예산 확보 필요)",
                "포트원 V2: 거래 발생 시 카드 수수료 약 1.5~3% 자동 차감",
              ].map((note,i)=>(
                <div key={i} style={{fontSize:"13px",color:"rgba(255,255,255,0.5)",fontWeight:400,display:"flex",gap:"8px",alignItems:"flex-start"}}>
                  <span style={{color:"#FF7A63",flexShrink:0}}>•</span>{note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
