"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Car, Users, FileText, BarChart3, MessageSquare, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{role?:string}|null>(null);
  const [tab, setTab] = useState("dashboard");
  const [cars, setCars] = useState<any[]>([]);
  const [stats, setStats] = useState({totalCars:0,pendingCars:0,totalUsers:0,totalInquiries:0,todayVisitors:0});

  useEffect(()=>{
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(d?.user?.role!=="ADMIN") { router.push("/"); return; }
      setUser(d.user);
      loadData();
    }).catch(()=>router.push("/"));
  },[router]);

  const loadData = async () => {
    try {
      const [cRes] = await Promise.all([
        fetch("/api/admin/cars").then(r=>r.json()).catch(()=>[]),
      ]);
      if(Array.isArray(cRes)) setCars(cRes);
    } catch {}
  };

  const updateCarStatus = async (carId:number, status:string) => {
    try {
      await fetch("/api/admin/cars", {
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({carId, status}),
      });
      setCars(cars.map(c=>c.id===carId?{...c,status}:c));
    } catch {}
  };

  if(!user) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>권한 확인 중...</div></>;

  const TABS = [
    {id:"dashboard",label:"대시보드",icon:BarChart3},
    {id:"cars",label:"매물 관리",icon:Car},
    {id:"inquiries",label:"문의 관리",icon:MessageSquare},
    {id:"reports",label:"신고 관리",icon:AlertTriangle},
  ];

  const pendingCars = cars.filter(c=>c.status==="REVIEWING");
  const activeCars = cars.filter(c=>c.status==="AVAILABLE");

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F8F7F4;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F8F7F4"}}>
        <div style={{background:"#0A0A0A",padding:"20px 24px"}}>
          <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",gap:12}}>
            <Shield size={20} color="#FF3B1E"/>
            <span style={{fontSize:18,fontWeight:800,color:"white"}}>관리자 패널</span>
          </div>
        </div>

        <div style={{maxWidth:1200,margin:"0 auto",padding:"20px 16px 80px",display:"flex",gap:20}}>
          {/* 사이드바 */}
          <div style={{width:200,flexShrink:0}}>
            {TABS.map(t=>{
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  width:"100%",padding:"14px 16px",borderRadius:12,border:"none",marginBottom:4,
                  background:tab===t.id?"white":"transparent",color:tab===t.id?"#FF3B1E":"#888",
                  fontSize:14,fontWeight:tab===t.id?800:600,textAlign:"left",cursor:"pointer",
                  display:"flex",alignItems:"center",gap:10,fontFamily:"'NanumSquareRound',sans-serif",
                  boxShadow:tab===t.id?"0 2px 8px rgba(0,0,0,0.06)":"none",
                }}>
                  <Icon size={18}/>{t.label}
                </button>
              );
            })}
          </div>

          {/* 컨텐츠 */}
          <div style={{flex:1}}>
            {tab==="dashboard"&&(
              <>
                <h2 style={{fontSize:22,fontWeight:800,marginBottom:16}}>대시보드</h2>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
                  {[
                    {label:"전체 매물",value:cars.length,color:"#1847FF"},
                    {label:"검수 대기",value:pendingCars.length,color:"#E8A020"},
                    {label:"판매 중",value:activeCars.length,color:"#2D8A52"},
                    {label:"판매 완료",value:cars.filter(c=>c.status==="SOLD").length,color:"#888"},
                  ].map(s=>(
                    <div key={s.label} style={{background:"white",borderRadius:16,padding:"22px 20px"}}>
                      <div style={{fontSize:11,color:"#AAA",marginBottom:6}}>{s.label}</div>
                      <div style={{fontSize:28,fontWeight:800,color:s.color}}>{s.value}</div>
                    </div>
                  ))}
                </div>
                {pendingCars.length>0&&(
                  <div style={{background:"#FFF0ED",borderRadius:16,padding:"18px 22px",border:"1px solid #FFB8A8"}}>
                    <div style={{fontSize:14,fontWeight:800,color:"#FF3B1E",marginBottom:4}}>⚠️ 검수 대기 매물 {pendingCars.length}건</div>
                    <button onClick={()=>setTab("cars")} style={{border:"none",background:"transparent",fontSize:13,fontWeight:700,color:"#FF3B1E",cursor:"pointer",padding:0}}>매물 관리로 이동 →</button>
                  </div>
                )}
              </>
            )}

            {tab==="cars"&&(
              <>
                <h2 style={{fontSize:22,fontWeight:800,marginBottom:16}}>매물 관리 ({cars.length})</h2>
                <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
                  {/* 헤더 */}
                  <div style={{display:"grid",gridTemplateColumns:"60px 1fr 100px 100px 120px",padding:"14px 20px",background:"#F8F7F4",fontSize:12,fontWeight:800,color:"#AAA"}}>
                    <span>ID</span><span>차량명</span><span>가격</span><span>상태</span><span>액션</span>
                  </div>
                  {cars.length===0?<div style={{padding:"40px",textAlign:"center",color:"#CCC"}}>등록된 매물이 없어요</div>:
                  cars.map(car=>(
                    <div key={car.id} style={{display:"grid",gridTemplateColumns:"60px 1fr 100px 100px 120px",padding:"14px 20px",borderBottom:"1px solid #F0EEE9",alignItems:"center",fontSize:13}}>
                      <span style={{color:"#CCC"}}>#{car.id}</span>
                      <span style={{fontWeight:700}}>{car.brand} {car.name}</span>
                      <span>{car.price?.toLocaleString()}만</span>
                      <span style={{
                        fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:100,display:"inline-block",
                        background:car.status==="AVAILABLE"?"#EAF6EF":car.status==="REVIEWING"?"#FFF0ED":"#F0EEE9",
                        color:car.status==="AVAILABLE"?"#2D8A52":car.status==="REVIEWING"?"#FF3B1E":"#888",
                      }}>{car.status==="AVAILABLE"?"판매중":car.status==="REVIEWING"?"검수대기":car.status==="SOLD"?"판매완료":"예약"}</span>
                      <div style={{display:"flex",gap:4}}>
                        {car.status==="REVIEWING"&&(
                          <>
                            <button onClick={()=>updateCarStatus(car.id,"AVAILABLE")} style={{border:"none",background:"#2D8A52",color:"white",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}><CheckCircle size={12}/> 승인</button>
                            <button onClick={()=>updateCarStatus(car.id,"SOLD")} style={{border:"none",background:"#E24B4A",color:"white",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}><XCircle size={12}/> 반려</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(tab==="inquiries"||tab==="reports")&&(
              <div style={{background:"white",borderRadius:18,padding:"48px",textAlign:"center",color:"#CCC"}}>
                <div style={{fontSize:36,marginBottom:12}}>{tab==="inquiries"?"💬":"⚠️"}</div>
                <p>{tab==="inquiries"?"문의 관리":"신고 관리"} — 연동 준비 중</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
