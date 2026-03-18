"use client";
import { useState, useEffect } from "react";
import { Plus, Eye, Heart, Edit, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Car{id:number;name:string;price:number;year:number;mileage:number;status:string;views?:number;favorites?:number;}

export default function DealerCarsPage() {
  const [cars,setCars]=useState<Car[]>([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("ALL");

  useEffect(()=>{
    fetch("/api/dealer/cars").then(r=>r.json()).then(d=>{if(d.success)setCars(d.data);setLoading(false);})
      .catch(()=>{setCars([
        {id:1,name:"2021 현대 아반떼 CN7 1.6 MPI 인스퍼레이션",price:1450,year:2021,mileage:32000,status:"AVAILABLE",views:234,favorites:12},
        {id:2,name:"2020 기아 K5 2.0 MPI 프레스티지",price:1980,year:2020,mileage:44000,status:"RESERVED",views:178,favorites:8},
        {id:3,name:"2019 현대 투싼 1.6T 프리미엄",price:2100,year:2019,mileage:62000,status:"REVIEWING",views:0,favorites:0},
      ]);setLoading(false);});
  },[]);

  const STATUS:Record<string,{l:string;color:string;bg:string}>={
AVAILABLE:{l:"판매중",color:"#2D8A52",bg:"#EAF6EF"},
RESERVED:{l:"예약중",color:"#E8A020",bg:"#FFF8EC"},
SOLD:{l:"판매완료",color:"#888",bg:"#F0EEE9"},
REVIEWING:{l:"검수중",color:"#1847FF",bg:"#EEF2FF"},
  };

  const filtered=filter==="ALL"?cars:cars.filter(c=>c.status===filter);
  const NAV=[["대시보드","/dealer"],["매물","/dealer/cars"],["문의","/dealer/inquiries"],["거래","/dealer/transactions"],["분석","/dealer/analytics"]];

  const handleDelete=async(id:number)=>{
    if(!confirm("정말 삭제하시겠어요?"))return;
    await fetch(`/api/cars/${id}`,{method:"DELETE"}).catch(()=>{});
    setCars(p=>p.filter(c=>c.id!==id));
  };

  return(
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0F6FF"}}>
        <div style={{background:"white",borderBottom:"1.5px solid #DDEEFF",padding:"0 32px",height:"68px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,100,255,0.06)"}}>
          <Link href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px",display:"flex",alignItems:"center",gap:"8px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"#1A1A1A"}}>CAR</span><span style={{fontSize:"11px",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:800,color:"#0066FF",background:"#EEF5FF",padding:"3px 10px",borderRadius:"100px",marginLeft:"4px"}}>DEALER</span></Link>
          <div style={{display:"flex",gap:"4px"}}>{NAV.map(([l,h])=>(<Link key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/dealer/cars"?"#0066FF":"#888",padding:"7px 12px",borderRadius:"9px",background:h==="/dealer/cars"?"#EEF5FF":"transparent"}}>{l}</Link>))}</div>
          <Link href="/dealer"><button style={{background:"#F0F6FF",color:"#0066FF",border:"1.5px solid #DDEEFF",padding:"7px 16px",borderRadius:"100px",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>← 대시보드</button></Link>
        </div>
        <div style={{maxWidth:"960px",margin:"0 auto",padding:"24px 28px 60px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
            <h1 style={{fontSize:"22px",fontWeight:800,color:"#0066FF"}}>내 매물 관리</h1>
            <Link href="/dealer/cars/new"><button style={{background:"#0066FF",color:"white",border:"none",padding:"11px 20px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"7px"}}><Plus size={16}/>새 매물 등록</button></Link>
          </div>
          <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap"}}>
            {[["ALL","전체"],["AVAILABLE","판매중"],["RESERVED","예약중"],["REVIEWING","검수중"],["SOLD","완료"]].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)} style={{padding:"6px 14px",borderRadius:"100px",border:`1.5px solid ${filter===v?"#0066FF":"#DDEEFF"}`,background:filter===v?"#0066FF":"white",color:filter===v?"white":"#555",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
          {loading?<div style={{textAlign:"center",padding:"40px",color:"#AAA"}}>로딩 중...</div>:(
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {filtered.map(c=>{
                const s=STATUS[c.status]||{l:c.status,c:"#888",bg:"#F0EEE9"};
                return(
                  <div key={c.id} style={{background:"white",border:"1.5px solid #DDEEFF",borderRadius:"16px",padding:"16px 20px",display:"flex",alignItems:"center",gap:"14px",flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px",flexWrap:"wrap"}}>
                        <span style={{fontSize:"15px",fontWeight:800}}>{c.name}</span>
                        <span style={{background:s.bg,color:s.color,padding:"2px 9px",borderRadius:"100px",fontSize:"11px",fontWeight:800,flexShrink:0}}>{s.l}</span>
                        {c.status==="REVIEWING"&&<span style={{display:"flex",alignItems:"center",gap:"3px",fontSize:"11px",color:"#1847FF",fontWeight:700}}><AlertCircle size={11}/>검수 대기 중</span>}
                      </div>
                      <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{c.year}년 · {c.mileage.toLocaleString()}km</div>
                    </div>
                    {(c.views!==undefined)&&(
                      <div style={{display:"flex",gap:"12px",fontSize:"13px",color:"#888",fontWeight:400}}>
                        <span style={{display:"flex",alignItems:"center",gap:"4px"}}><Eye size={13}/>{c.views}</span>
                        <span style={{display:"flex",alignItems:"center",gap:"4px"}}><Heart size={13}/>{c.favorites}</span>
                      </div>
                    )}
                    <div style={{fontSize:"18px",fontWeight:800,color:"#0066FF"}}>{c.price.toLocaleString()}<span style={{fontSize:"12px",color:"#AAA"}}>만원</span></div>
                    <div style={{display:"flex",gap:"6px"}}>
                      <Link href={`/dealer/cars/${c.id}/edit`}><button style={{background:"#EEF5FF",color:"#0066FF",border:"none",padding:"8px 14px",borderRadius:"8px",fontSize:"12px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"}}><Edit size={12}/>수정</button></Link>
                      <button onClick={()=>handleDelete(c.id)} style={{background:"#FFF0ED",color:"#FF3B1E",border:"none",padding:"8px 14px",borderRadius:"8px",fontSize:"12px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"}}><Trash2 size={12}/>삭제</button>
                    </div>
                  </div>
                );
              })}
              {filtered.length===0&&<div style={{textAlign:"center",padding:"60px",color:"#AAA",background:"white",borderRadius:"16px",border:"1.5px solid #DDEEFF"}}>등록된 매물이 없어요. 새 매물을 등록해주세요!</div>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
