import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Car, CheckCircle, XCircle } from "lucide-react";

async function getCars() {
  try {
    return await prisma.car.findMany({
      orderBy: { createdAt: "desc" }, take: 50,
      include: { dealer: { select: { shopName: true } } },
    });
  } catch { return []; }
}

export default async function AdminCarsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("fixcar-token")?.value;
  if (!token) redirect("/login");
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") redirect("/");

  const cars = await getCars();
  const reviewing = cars.filter((c:any) => c.status === "REVIEWING");

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .row:hover{background:#FAFAF8;}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <a href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span></a>
          <div style={{display:"flex",gap:"20px"}}>
            {[["대시보드","/admin"],["회원","/admin/users"],["매물","/admin/cars"],["딜러신청","/admin/dealers"],["신고","/admin/reports"],["정산","/admin/settlements"],["설정","/admin/settings"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/admin/cars"?"white":"rgba(255,255,255,0.4)"}}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
            <h1 style={{fontSize:"26px",fontWeight:800}}>매물 검수</h1>
            <div style={{display:"flex",gap:"8px"}}>
              <span style={{background:"#FFF8EC",color:"#E8A020",padding:"5px 14px",borderRadius:"100px",fontSize:"13px",fontWeight:800}}>검수대기 {reviewing.length}건</span>
              <span style={{background:"#EAF6EF",color:"#2D8A52",padding:"5px 14px",borderRadius:"100px",fontSize:"13px",fontWeight:800}}>전체 {cars.length}대</span>
            </div>
          </div>

          {reviewing.length > 0 && (
            <div style={{background:"#FFF8EC",border:"1px solid #FFD89A",borderRadius:"16px",padding:"18px 22px",marginBottom:"20px"}}>
              <div style={{fontSize:"15px",fontWeight:800,color:"#E8A020",marginBottom:"12px"}}>⚡ 검수 대기 매물</div>
              {(reviewing as any[]).map((car:any) => (
                <div key={car.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #FFD89A"}}>
                  <div>
                    <div style={{fontSize:"14px",fontWeight:800}}>{car.name}</div>
                    <div style={{fontSize:"12px",color:"#888",fontWeight:400}}>{car.dealer?.shopName} · {car.price.toLocaleString()}만원</div>
                  </div>
                  <div style={{display:"flex",gap:"8px"}}>
                    <a href={`/api/admin/cars/${car.id}/approve`}><button style={{background:"#2D8A52",color:"white",border:"none",padding:"7px 16px",borderRadius:"8px",fontSize:"12px",fontWeight:800,display:"flex",alignItems:"center",gap:"4px"}}><CheckCircle size={13}/> 승인</button></a>
                    <a href={`/api/admin/cars/${car.id}/reject`}><button style={{background:"#FFF0ED",color:"#FF3B1E",border:"none",padding:"7px 16px",borderRadius:"8px",fontSize:"12px",fontWeight:800,display:"flex",alignItems:"center",gap:"4px"}}><XCircle size={13}/> 반려</button></a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{background:"white",borderRadius:"18px",overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:"2px solid #F0EEE9",fontSize:"12px",fontWeight:800,color:"#AAA"}}>
              <span>차량명</span><span>딜러</span><span>가격</span><span>연식</span><span>상태</span><span>등록일</span>
            </div>
            {cars.length === 0 ? (
              <div style={{padding:"60px",textAlign:"center",color:"#AAA"}}>
                <Car size={40} color="#E0DDD7" style={{margin:"0 auto 14px"}} />
                <div style={{fontSize:"15px",fontWeight:800}}>등록된 매물이 없어요</div>
              </div>
            ) : (
              (cars as any[]).map((car, i) => (
                <div key={car.id} className="row" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",padding:"13px 20px",borderBottom:i<cars.length-1?"1px solid #F0EEE9":"none",alignItems:"center"}}>
                  <a href={`/cars/${car.id}`} style={{fontSize:"14px",fontWeight:800,color:"#1847FF"}}>{car.name}</a>
                  <span style={{fontSize:"13px",color:"#555",fontWeight:400}}>{car.dealer?.shopName||"-"}</span>
                  <span style={{fontSize:"14px",fontWeight:800}}>{car.price.toLocaleString()}만</span>
                  <span style={{fontSize:"13px",color:"#555",fontWeight:400}}>{car.year}년</span>
                  <span style={{background:car.status==="AVAILABLE"?"#EAF6EF":car.status==="REVIEWING"?"#FFF8EC":car.status==="SOLD"?"#F0EEE9":"#EEF2FF",color:car.status==="AVAILABLE"?"#2D8A52":car.status==="REVIEWING"?"#E8A020":car.status==="SOLD"?"#888":"#1847FF",padding:"3px 10px",borderRadius:"100px",fontSize:"11px",fontWeight:800,display:"inline-block"}}>
                    {car.status==="AVAILABLE"?"판매중":car.status==="REVIEWING"?"검수중":car.status==="SOLD"?"판매완료":"예약중"}
                  </span>
                  <span style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{String(car.createdAt).slice(0,10)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
