"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { encodeCarId } from "@/lib/url-encode";

interface CarItem {
  id:number; name:string; brand:string; price:number; year:number;
  mileage:number; fuel:string; images:string[]; tags:string[];
  dealer?:{shopName?:string; rating?:number};
}

export default function HomeRecommendCars() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch("/api/cars?limit=6")
      .then(r=>r.json())
      .then(d=>{ setCars(d.data || []); setLoading(false); })
      .catch(()=>setLoading(false));
  },[]);

  if(loading) return <div style={{textAlign:"center",padding:40,color:"#CCC"}}>매물 불러오는 중...</div>;
  if(cars.length===0) return null; /* DB에 매물 없으면 숨김 */

  return (
    <section style={{maxWidth:1360,margin:"0 auto 60px",padding:"0 52px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{fontSize:12,fontWeight:800,letterSpacing:3,color:"#FF3B1E",marginBottom:6}}>FIX PRICE</div>
          <h2 style={{fontSize:24,fontWeight:800}}>추천 매물</h2>
        </div>
        <Link href="/cars" style={{fontSize:13,fontWeight:700,color:"#888",textDecoration:"none"}}>전체 보기 →</Link>
      </div>
      <div className="cars-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {cars.map(car=>(
          <Link key={car.id} href={`/cars/detail?v=${encodeCarId(car.id)}`} style={{textDecoration:"none"}}>
            <div style={{background:"white",borderRadius:18,overflow:"hidden",cursor:"pointer",transition:"all 0.2s"}}>
              <div style={{height:180,background:"#F0EEE9",overflow:"hidden",position:"relative"}}>
                {car.images?.[0]?(
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={car.images[0]} alt={car.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                ):(
                  <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,opacity:0.3}}>🚗</div>
                )}
                {car.tags?.[0]&&<span style={{position:"absolute",top:10,left:10,background:"#FF3B1E",color:"white",padding:"3px 10px",borderRadius:100,fontSize:11,fontWeight:800}}>{car.tags[0]}</span>}
              </div>
              <div style={{padding:"16px 20px"}}>
                <div style={{fontSize:11,color:"#AAA",marginBottom:4}}>{car.brand} · {car.year}년식</div>
                <div style={{fontSize:16,fontWeight:800,marginBottom:6}}>{car.name}</div>
                <div style={{fontSize:11,color:"#CCC",marginBottom:8}}>{car.mileage?.toLocaleString()}km · {car.fuel}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:20,fontWeight:800,color:"#FF3B1E"}}>{car.price?.toLocaleString()}<span style={{fontSize:12,color:"#AAA",fontWeight:400}}>만원</span></span>
                  {car.dealer?.shopName&&<span style={{fontSize:11,color:"#CCC"}}>{car.dealer.shopName}</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
