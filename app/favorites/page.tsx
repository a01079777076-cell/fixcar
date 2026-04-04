// 📁 저장 경로: app/favorites/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Heart, Trash2, Car } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites").then(r => r.json()).then(d => {
      setFavorites(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (carId: number) => {
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId }),
    }).catch(() => {});
    setFavorites(prev => prev.filter(f => f.carId !== carId && f.car?.id !== carId));
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"32px 24px 100px"}}>
          <h1 style={{fontSize:24,fontWeight:800,marginBottom:8}}>❤ 찜 목록</h1>
          <p style={{fontSize:13,color:"#AAA",marginBottom:24}}>관심 있는 매물을 모아봤어요</p>

          {loading ? (
            <div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>
          ) : favorites.length === 0 ? (
            <div style={{background:"white",borderRadius:18,padding:60,textAlign:"center"}}>
              <Heart size={40} color="#E0DDD7" style={{marginBottom:12}}/>
              <div style={{fontSize:18,fontWeight:700,color:"#AAA"}}>찜한 매물이 없습니다</div>
              <div style={{fontSize:13,color:"#CCC",marginTop:8,marginBottom:20}}>매물 상세 페이지에서 ♡를 눌러 찜해보세요!</div>
              <Link href="/cars"><button style={{padding:"12px 28px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>매물 보러가기</button></Link>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {favorites.map(f => {
                const car = f.car || f;
                return (
                  <div key={f.id || car.id} style={{background:"white",borderRadius:16,padding:"16px 18px",display:"flex",gap:14,alignItems:"center"}}>
                    <Link href={`/cars/${car.id}`} style={{flexShrink:0}}>
                      <div style={{width:100,height:72,borderRadius:10,overflow:"hidden",background:"#F0EEE9"}}>
                        {car.images?.[0] ? <img src={car.images[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><Car size={24} color="#CCC"/></div>}
                      </div>
                    </Link>
                    <Link href={`/cars/${car.id}`} style={{flex:1,minWidth:0,textDecoration:"none",color:"inherit"}}>
                      <div style={{fontSize:15,fontWeight:800,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{car.brand} {car.name}</div>
                      <div style={{fontSize:12,color:"#888",marginTop:2}}>{car.year}년식 · {car.mileage?.toLocaleString()}km · {car.fuel}</div>
                      <div style={{fontSize:18,fontWeight:800,color:"#FF3B1E",marginTop:4}}>{car.price?.toLocaleString()}만원</div>
                    </Link>
                    <button onClick={()=>handleRemove(car.id)} style={{border:"none",background:"#FFF0ED",borderRadius:10,padding:"10px",cursor:"pointer",color:"#E24B4A",flexShrink:0}}>
                      <Trash2 size={16}/>
                    </button>
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
