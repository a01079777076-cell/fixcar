"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Heart } from "lucide-react";

interface FavCar { id:number; car:{ id:number; name:string; brand:string; price:number; year:number; mileage:number; fuel:string; images:string[] } }

export default function FavoritesPage() {
  const [favs, setFavs] = useState<FavCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites").then(r=>r.json()).then(d=>{ setFavs(Array.isArray(d)?d:[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 24px 100px" }}>
          <h1 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>❤️ 보관함</h1>
          <p style={{ fontSize:14, color:"#AAA", marginBottom:28 }}>찜한 차량을 모아봤어요</p>

          {loading ? (
            <div style={{ textAlign:"center", padding:60, color:"#CCC" }}>불러오는 중...</div>
          ) : favs.length === 0 ? (
            <div style={{ background:"white", borderRadius:18, padding:"60px 24px", textAlign:"center" }}>
              <Heart size={40} color="#E0DDD7" style={{ marginBottom:16 }} />
              <div style={{ fontSize:16, fontWeight:700, color:"#AAA", marginBottom:6 }}>찜한 차량이 없어요</div>
              <p style={{ fontSize:13, color:"#CCC", marginBottom:20 }}>마음에 드는 차량에 ❤️를 눌러보세요</p>
              <Link href="/cars"><button style={{ padding:"14px 28px", background:"#FF3B1E", color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif" }}>매물 보러가기</button></Link>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {favs.map(fav => (
                <Link key={fav.id} href={`/cars/${fav.car.id}`}>
                  <div style={{ background:"white", borderRadius:16, padding:"16px 20px", display:"flex", gap:16, alignItems:"center" }}>
                    <div style={{ width:80, height:60, borderRadius:10, background:"#F0EEE9", overflow:"hidden", flexShrink:0 }}>
                      {fav.car.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fav.car.images[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      ) : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🚗</div>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:800, marginBottom:3 }}>{fav.car.name}</div>
                      <div style={{ fontSize:12, color:"#AAA" }}>{fav.car.year}년 · {fav.car.mileage?.toLocaleString()}km · {fav.car.fuel}</div>
                    </div>
                    <div style={{ fontSize:18, fontWeight:800, color:"#FF3B1E" }}>{fav.car.price?.toLocaleString()}<span style={{ fontSize:11, color:"#AAA" }}>만</span></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
