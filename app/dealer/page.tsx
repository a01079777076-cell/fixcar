"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, MessageSquare, Plus, Eye, Heart, TrendingUp, ChevronRight, Settings } from "lucide-react";

export default function DealerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{name?:string;role?:string}|null>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(!d?.user?.id||(d.user.role!=="DEALER"&&d.user.role!=="ADMIN")){router.push("/");return;}
      setUser(d.user);
      loadData();
    }).catch(()=>router.push("/"));
  },[router]);

  const loadData = async () => {
    try {
      const [cRes,iRes] = await Promise.all([
        fetch("/api/dealer/cars").then(r=>r.json()).catch(()=>[]),
        fetch("/api/dealer/inquiries").then(r=>r.json()).catch(()=>[]),
      ]);
      setCars(Array.isArray(cRes)?cRes:[]);
      setInquiries(Array.isArray(iRes)?iRes:[]);
    } catch {}
    setLoading(false);
  };

  if(loading) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div></>;

  const activeCars = cars.filter(c=>c.status==="AVAILABLE");
  const reviewingCars = cars.filter(c=>c.status==="REVIEWING");
  const soldCars = cars.filter(c=>c.status==="SOLD");
  const pendingInq = inquiries.filter((i:any)=>i.status==="PENDING");

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F4FF;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F4FF"}}>
        <div style={{background:"white",borderBottom:"1px solid #DDEEFF",padding:"20px 24px"}}>
          <div style={{maxWidth:1000,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:20,fontWeight:800}}>🏪 딜러 대시보드</div>
              <div style={{fontSize:13,color:"#888"}}>{user?.name}님, 오늘도 좋은 하루 되세요!</div>
            </div>
            <Link href="/dealer/cars/new">
              <button style={{padding:"12px 24px",background:"#0066FF",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                <Plus size={16}/>매물 등록
              </button>
            </Link>
          </div>
        </div>

        <div style={{maxWidth:1000,margin:"0 auto",padding:"20px 16px 80px"}}>
          {/* 통계 카드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
            {[
              {icon:Car,label:"판매 중",value:activeCars.length,color:"#0066FF"},
              {icon:Eye,label:"검수 대기",value:reviewingCars.length,color:"#E8A020"},
              {icon:MessageSquare,label:"답변 대기",value:pendingInq.length,color:"#FF3B1E"},
              {icon:TrendingUp,label:"판매 완료",value:soldCars.length,color:"#2D8A52"},
            ].map(s=>{
              const Icon = s.icon;
              return (
                <div key={s.label} style={{background:"white",borderRadius:16,padding:"22px 20px"}}>
                  <Icon size={20} color={s.color} style={{marginBottom:8}}/>
                  <div style={{fontSize:28,fontWeight:800,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:12,color:"#AAA"}}>{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* 답변 대기 알림 */}
          {pendingInq.length>0&&(
            <Link href="/dealer/inquiries">
              <div style={{background:"#FFF0ED",borderRadius:16,padding:"18px 22px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #FFB8A8",cursor:"pointer"}}>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#FF3B1E"}}>📨 답변 대기 문의 {pendingInq.length}건</div>
                  <div style={{fontSize:12,color:"#CC6633",marginTop:2}}>빠른 답변이 계약률을 높여요!</div>
                </div>
                <ChevronRight size={18} color="#FF3B1E"/>
              </div>
            </Link>
          )}

          {/* 내 매물 목록 */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h2 style={{fontSize:18,fontWeight:800}}>내 매물 ({cars.length})</h2>
            <Link href="/dealer/cars/new" style={{fontSize:13,fontWeight:700,color:"#0066FF"}}>+ 새 매물 등록</Link>
          </div>

          {cars.length===0?(
            <div style={{background:"white",borderRadius:18,padding:"60px 24px",textAlign:"center"}}>
              <Car size={40} color="#CCC" style={{marginBottom:12}}/>
              <div style={{fontSize:16,fontWeight:700,color:"#AAA",marginBottom:6}}>등록된 매물이 없어요</div>
              <Link href="/dealer/cars/new"><button style={{padding:"12px 24px",background:"#0066FF",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",marginTop:8,fontFamily:"'NanumSquareRound',sans-serif"}}>첫 매물 등록하기</button></Link>
            </div>
          ):(
            <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
              {cars.map((car:any,i:number)=>(
                <div key={car.id} style={{padding:"16px 22px",borderBottom:i<cars.length-1?"1px solid #F0F4FF":"none",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:60,height:45,borderRadius:8,background:"#F0F4FF",overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {car.images?.[0]?<img src={car.images[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:18}}>🚗</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:800}}>{car.brand} {car.name}</div>
                    <div style={{fontSize:11,color:"#AAA"}}>{car.year}년 · {car.mileage?.toLocaleString()}km · {car.fuel}</div>
                  </div>
                  <div style={{fontSize:15,fontWeight:800,color:"#0066FF"}}>{car.price?.toLocaleString()}<span style={{fontSize:10,color:"#AAA"}}>만</span></div>
                  <span style={{
                    fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:100,
                    background:car.status==="AVAILABLE"?"#EAF6EF":car.status==="REVIEWING"?"#FFF8EC":"#F0EEE9",
                    color:car.status==="AVAILABLE"?"#2D8A52":car.status==="REVIEWING"?"#E8A020":"#888",
                  }}>{car.status==="AVAILABLE"?"판매중":car.status==="REVIEWING"?"검수대기":car.status==="SOLD"?"완료":"예약"}</span>
                </div>
              ))}
            </div>
          )}

          {/* 하단 메뉴 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:24}}>
            {[
              {label:"문의 관리",href:"/dealer/inquiries",icon:MessageSquare,color:"#0066FF"},
              {label:"매물 등록",href:"/dealer/cars/new",icon:Plus,color:"#2D8A52"},
              {label:"설정",href:"/settings",icon:Settings,color:"#888"},
            ].map(m=>{
              const Icon = m.icon;
              return <Link key={m.label} href={m.href}><div style={{background:"white",borderRadius:14,padding:"18px",textAlign:"center",cursor:"pointer"}}><Icon size={22} color={m.color} style={{marginBottom:6}}/><div style={{fontSize:13,fontWeight:700}}>{m.label}</div></div></Link>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
