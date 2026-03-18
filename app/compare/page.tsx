"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Plus, X } from "lucide-react";
interface Car{id:number;name:string;brand:string;year:number;mileage:number;fuel:string;price:number;cc:number;power:number;efficiency:string;transmission:string;accident:boolean;color:string;}
export default function ComparePage() {
  const [cars,setCars]=useState<Car[]>([]);
  const [sel,setSel]=useState<Car[]>([]);
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch("/api/cars?limit=50").then(r=>r.json()).then(d=>{if(d.success)setCars(d.data);setLoading(false);}).catch(()=>{setCars([{id:1,name:"2021 아반떼 CN7",brand:"현대",year:2021,mileage:32000,fuel:"가솔린",price:1450,cc:1598,power:123,efficiency:"14.2",transmission:"자동",accident:false,color:"흰색"},{id:2,name:"2020 기아 K5 2.0",brand:"기아",year:2020,mileage:44000,fuel:"가솔린",price:1980,cc:1999,power:160,efficiency:"12.8",transmission:"자동",accident:false,color:"검정"},{id:3,name:"2019 현대 투싼",brand:"현대",year:2019,mileage:62000,fuel:"가솔린",price:2100,cc:1598,power:180,efficiency:"13.0",transmission:"자동",accident:false,color:"은색"}]);setLoading(false);});},[]);
  const add=(c:Car)=>{if(sel.length>=3||sel.find(s=>s.id===c.id))return;setSel(p=>[...p,c]);};
  const remove=(id:number)=>setSel(p=>p.filter(c=>c.id!==id));
  const filtered=cars.filter(c=>c.name.includes(search)||c.brand.includes(search));
  const ROWS=[{l:"가격",f:(c:Car)=>`${c.price.toLocaleString()}만원`,best:"low",parse:(v:string)=>parseFloat(v.replace(/[^0-9.]/g,""))},{l:"연식",f:(c:Car)=>`${c.year}년식`,best:null,parse:null},{l:"주행거리",f:(c:Car)=>`${c.mileage.toLocaleString()}km`,best:"low",parse:(v:string)=>parseFloat(v.replace(/[^0-9.]/g,""))},{l:"연료",f:(c:Car)=>c.fuel,best:null,parse:null},{l:"배기량",f:(c:Car)=>c.cc?`${c.cc.toLocaleString()}cc`:"전기",best:null,parse:null},{l:"최대출력",f:(c:Car)=>c.power?`${c.power}마력`:"정보없음",best:"high",parse:(v:string)=>parseFloat(v.replace(/[^0-9.]/g,""))},{l:"연비",f:(c:Car)=>c.efficiency||"정보없음",best:"high",parse:(v:string)=>parseFloat(v.replace(/[^0-9.]/g,""))},{l:"변속기",f:(c:Car)=>c.transmission,best:null,parse:null},{l:"사고이력",f:(c:Car)=>c.accident?"있음":"없음",best:null,parse:null}];
  const inp={width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"11px 14px",fontSize:"14px",background:"#FAFAF8",fontFamily:"'NanumSquareRound',sans-serif",outline:"none"} as const;
  return(
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button,input{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} input:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>COMPARE</div>
            <h1 style={{fontSize:"clamp(22px,4vw,40px)",fontWeight:800,color:"white",letterSpacing:"-1px"}}>차량 비교</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",marginTop:"6px",fontWeight:400}}>최대 3대 · 가격·연비·주행거리 한눈에</p>
          </div>
        </div>
        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"24px 32px 80px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"20px"}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{background:"white",borderRadius:"16px",minHeight:"90px",display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${sel[i]?"#FF3B1E":"#E0DDD7"}`}}>
                {sel[i]?(
                  <div style={{width:"100%",padding:"14px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                      <div style={{fontSize:"14px",fontWeight:800,color:"#FF3B1E"}}>{sel[i].name}</div>
                      <button onClick={()=>remove(sel[i].id)} style={{background:"none",border:"none",cursor:"pointer"}}><X size={14} color="#AAA"/></button>
                    </div>
                    <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{sel[i].year}년 · {sel[i].mileage.toLocaleString()}km</div>
                    <div style={{fontSize:"17px",fontWeight:800,marginTop:"6px"}}>{sel[i].price.toLocaleString()}<span style={{fontSize:"11px",color:"#AAA"}}>만원</span></div>
                  </div>
                ):(
                  <div style={{textAlign:"center",color:"#DDD"}}>
                    <Plus size={24} color="#E0DDD7"/>
                    <div style={{fontSize:"11px",marginTop:"5px",fontWeight:400}}>차량 선택</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {sel.length>=2&&(
            <div style={{background:"white",borderRadius:"18px",overflow:"hidden",marginBottom:"20px"}}>
              <div style={{padding:"14px 18px",background:"#F8F6F2",fontSize:"15px",fontWeight:800}}>스펙 비교</div>
              {ROWS.map(({l,f,best,parse})=>(
                <div key={l} style={{display:"grid",gridTemplateColumns:`100px ${"1fr ".repeat(sel.length)}`,borderBottom:"1px solid #F0EEE9"}}>
                  <div style={{padding:"10px 14px",fontSize:"12px",color:"#888",fontWeight:400,background:"#FAFAF8"}}>{l}</div>
                  {sel.map(c=>{
                    const val=f(c);
                    const num=parse?parse(val):null;
                    const allNums=parse?sel.map(sc=>parse(f(sc))):[];
                    const isBest=best&&num!==null&&((best==="low"&&num===Math.min(...allNums))||(best==="high"&&num===Math.max(...allNums)));
                    return(
                      <div key={c.id} style={{padding:"10px 14px",fontSize:"13px",fontWeight:isBest?800:600,color:isBest?"#2D8A52":"#333",background:isBest?"#EAF6EF":"white",display:"flex",alignItems:"center",gap:"4px"}}>
                        {isBest&&<span style={{fontSize:"10px"}}>✓</span>}{val}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          <div style={{background:"white",borderRadius:"18px",padding:"18px 20px"}}>
            <div style={{fontSize:"15px",fontWeight:800,marginBottom:"12px"}}>비교할 차량 선택 <span style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>(최대 3대)</span></div>
            <input type="text" placeholder="차량명·브랜드 검색" value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,marginBottom:"12px"}}/>
            {loading?<div style={{textAlign:"center",color:"#AAA",padding:"20px"}}>로딩 중...</div>:(
              <div style={{display:"flex",flexDirection:"column",gap:"6px",maxHeight:"280px",overflowY:"auto"}}>
                {filtered.slice(0,20).map(c=>{
                  const isSel=!!sel.find(s=>s.id===c.id);
                  return(
                    <button key={c.id} onClick={()=>add(c)} disabled={isSel||sel.length>=3} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",border:`1.5px solid ${isSel?"#FF3B1E":"#E0DDD7"}`,borderRadius:"10px",background:isSel?"#FFF0ED":"white",cursor:isSel||sel.length>=3?"default":"pointer",textAlign:"left"}}>
                      <div><div style={{fontSize:"13px",fontWeight:700}}>{c.name}</div><div style={{fontSize:"11px",color:"#AAA",fontWeight:400}}>{c.year}년 · {c.mileage.toLocaleString()}km · {c.fuel}</div></div>
                      <div style={{fontSize:"15px",fontWeight:800,color:isSel?"#FF3B1E":"#1A1A1A"}}>{c.price.toLocaleString()}만</div>
                    </button>
                  );
                })}
                {filtered.length===0&&<div style={{textAlign:"center",color:"#AAA",padding:"20px",fontSize:"14px"}}>검색 결과 없음</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
