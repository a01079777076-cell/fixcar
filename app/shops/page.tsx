// 📁 저장 경로: app/shops/page.tsx
"use client";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Star, Car } from "lucide-react";

function ShopsInner() {
  const searchParams = useSearchParams();
  const complexFilter = searchParams.get("complex") || "";
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/dealers").then(r=>r.json()).then(d=>{
      setDealers(Array.isArray(d)?d:[]);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const filtered = dealers.filter(d=>{
    const matchSearch = !search || d.shopName?.includes(search) || d.shopAddr?.includes(search);
    const matchComplex = !complexFilter || d.complexName?.includes(complexFilter) || d.shopAddr?.includes(complexFilter);
    return matchSearch && matchComplex;
  });

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px 100px"}}>
      <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>🏪 매매상사 목록</h1>
      <p style={{fontSize:14,color:"#AAA",marginBottom:20}}>
        {complexFilter ? `${complexFilter} 소속 상사` : "픽스카에 입점한 광주·전남 매매상사"}
      </p>

      {/* 검색 */}
      <div style={{marginBottom:24}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="상호명 또는 주소로 검색" style={{width:"100%",padding:"14px 18px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"white"}}/>
      </div>

      {loading ? (
        <div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>
      ) : filtered.length===0 ? (
        <div style={{background:"white",borderRadius:18,padding:60,textAlign:"center"}}>
          <Car size={40} color="#CCC" style={{marginBottom:12}}/>
          <div style={{fontSize:16,fontWeight:700,color:"#AAA"}}>
            {dealers.length===0?"아직 입점한 상사가 없습니다":"검색 결과가 없습니다"}
          </div>
          <div style={{fontSize:13,color:"#CCC",marginTop:8}}>딜러 모집이 진행 중입니다. 곧 만나실 수 있어요!</div>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {filtered.map(d=>(
            <div key={d.id} style={{background:"white",borderRadius:16,padding:"20px 18px",border:"1px solid #E8E6E1"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{width:48,height:48,borderRadius:14,background:"#EEF5FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏪</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:800}}>{d.shopName}</div>
                  <div style={{display:"flex",gap:6,marginTop:4}}>
                    {d.verified&&<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"#EAF6EF",color:"#2D8A52"}}>FIX 인증</span>}
                    {d.complexName&&<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"#F8F7F4",color:"#888"}}>{d.complexName}</span>}
                  </div>
                </div>
              </div>
              {d.shopAddr&&<div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#888",marginBottom:6}}><MapPin size={12}/>{d.shopAddr}</div>}
              {d.shopPhone&&<div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#888",marginBottom:6}}><Phone size={12}/>{d.shopPhone}</div>}
              <div style={{display:"flex",alignItems:"center",gap:12,fontSize:12,color:"#AAA",marginBottom:12}}>
                <span style={{display:"flex",alignItems:"center",gap:3}}><Star size={12} color="#E8A020"/>{d.rating||0}점</span>
                <span style={{display:"flex",alignItems:"center",gap:3}}><Car size={12}/>{d._count?.cars||0}대 판매중</span>
              </div>
              {d.shopDesc&&<div style={{fontSize:12,color:"#888",lineHeight:1.6,marginBottom:12,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{d.shopDesc}</div>}
              <Link href={`/cars?dealer=${d.id}`}>
                <button style={{width:"100%",padding:"10px",background:"#EEF5FF",border:"1.5px solid #0066FF",borderRadius:10,fontSize:12,fontWeight:700,color:"#0066FF",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>매물 보기</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopsPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{outline:none;border-color:#0066FF!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Suspense fallback={<div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div>}>
          <ShopsInner/>
        </Suspense>
      </div>
    </>
  );
}
