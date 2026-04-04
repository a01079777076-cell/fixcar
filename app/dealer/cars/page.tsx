// 📁 저장 경로: app/dealer/cars/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Plus, Eye, Heart, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react";

interface CarItem {
  id: number; name: string; brand: string; year: number; mileage: number;
  price: number; status: string; views: number; images: string[]; createdAt: string;
}

export default function DealerCarsPage() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"AVAILABLE"|"REVIEWING"|"SOLD"|"all">("all");

  useEffect(() => {
    fetch("/api/dealer/cars").then(r => r.json()).then(d => {
      setCars(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("매물을 삭제하시겠습니까?\n결제된 광고비는 환불되지 않습니다.")) return;
    try {
      const res = await fetch(`/api/dealer/cars/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) setCars(prev => prev.filter(c => c.id !== id));
      else alert(d.error || "삭제 실패");
    } catch { alert("네트워크 오류"); }
  };

  const filtered = tab === "all" ? cars : cars.filter(c => c.status === tab);
  const counts = { all: cars.length, AVAILABLE: cars.filter(c=>c.status==="AVAILABLE").length, REVIEWING: cars.filter(c=>c.status==="REVIEWING").length, SOLD: cars.filter(c=>c.status==="SOLD").length };
  const statusLabel: Record<string,{label:string;color:string;bg:string}> = {
    AVAILABLE:{label:"판매중",color:"#2D8A52",bg:"#EAF6EF"},
    REVIEWING:{label:"검수대기",color:"#E8A020",bg:"#FFF8E0"},
    SOLD:{label:"판매완료",color:"#888",bg:"#F0EEE9"},
    RESERVED:{label:"예약중",color:"#0066FF",bg:"#EEF5FF"},
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F6FF"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"28px 24px 100px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <h1 style={{fontSize:24,fontWeight:800}}>🚗 내 매물 관리</h1>
              <p style={{fontSize:13,color:"#888",marginTop:4}}>등록한 매물을 관리하세요</p>
            </div>
            <Link href="/dealer/cars/new">
              <button style={{display:"flex",alignItems:"center",gap:6,padding:"12px 24px",background:"#0066FF",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                <Plus size={16}/> 매물 등록
              </button>
            </Link>
          </div>

          {/* 탭 */}
          <div style={{display:"flex",gap:6,marginBottom:20}}>
            {([["all","전체"],["AVAILABLE","판매중"],["REVIEWING","검수대기"],["SOLD","판매완료"]] as const).map(([v,l])=>(
              <button key={v} onClick={()=>setTab(v)} style={{padding:"8px 16px",borderRadius:100,border:tab===v?"2px solid #0066FF":"1px solid #DDEEFF",background:tab===v?"#EEF5FF":"white",color:tab===v?"#0066FF":"#888",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                {l} <span style={{fontSize:11,color:tab===v?"#0066FF":"#CCC"}}>{counts[v]}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>
          ) : filtered.length === 0 ? (
            <div style={{background:"white",borderRadius:18,padding:60,textAlign:"center",border:"1px solid #DDEEFF"}}>
              <div style={{fontSize:40,marginBottom:12}}>🚗</div>
              <div style={{fontSize:16,fontWeight:700,color:"#AAA"}}>등록된 매물이 없습니다</div>
              <Link href="/dealer/cars/new"><button style={{marginTop:16,padding:"12px 28px",background:"#0066FF",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>첫 매물 등록하기</button></Link>
            </div>
          ) : filtered.map(car => {
            const s = statusLabel[car.status] || statusLabel.AVAILABLE;
            return (
              <div key={car.id} style={{background:"white",borderRadius:16,padding:"16px 18px",marginBottom:10,border:"1px solid #DDEEFF",display:"flex",gap:14,alignItems:"center"}}>
                {/* 사진 */}
                <div style={{width:90,height:68,borderRadius:10,overflow:"hidden",background:"#F0EEE9",flexShrink:0}}>
                  {car.images?.[0] ? <img src={car.images[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📷</div>}
                </div>
                {/* 정보 */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <span style={{fontSize:15,fontWeight:800,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{car.brand} {car.name}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,background:s.bg,color:s.color,flexShrink:0}}>{s.label}</span>
                  </div>
                  <div style={{fontSize:12,color:"#888"}}>{car.year}년식 · {car.mileage?.toLocaleString()}km</div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginTop:4}}>
                    <span style={{fontSize:17,fontWeight:800,color:"#FF3B1E"}}>{car.price?.toLocaleString()}만원</span>
                    <span style={{fontSize:11,color:"#CCC",display:"flex",alignItems:"center",gap:2}}><Eye size={11}/>{car.views}</span>
                  </div>
                </div>
                {/* 액션 */}
                <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                  <Link href={`/dealer/cars/new?edit=${car.id}`}>
                    <button style={{padding:"8px 14px",background:"#EEF5FF",border:"1px solid #DDEEFF",borderRadius:8,fontSize:11,fontWeight:700,color:"#0066FF",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"'NanumSquareRound',sans-serif",width:"100%"}}><Edit size={12}/>수정</button>
                  </Link>
                  <button onClick={()=>handleDelete(car.id)} style={{padding:"8px 14px",background:"#FFF0ED",border:"1px solid #FFD4CC",borderRadius:8,fontSize:11,fontWeight:700,color:"#E24B4A",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"'NanumSquareRound',sans-serif"}}><Trash2 size={12}/>삭제</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
