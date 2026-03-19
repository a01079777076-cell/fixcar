"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import FavoriteButton from "@/components/FavoriteButton";
import CarScoreWidget from "@/components/CarScoreWidget";
import InstallmentCalc from "@/components/InstallmentCalc";
import { Lock, Share2, Phone, MessageCircle, ChevronLeft, ChevronRight, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

interface CarDetail { id:number; name:string; brand:string; year:number; mileage:number; fuel:string; color:string; region:string; price:number; cc:number; power:number; efficiency:string; transmission:string; owners:number; accident:boolean; status:string; tags:string[]; options:string[]; images:string[]; dealer:{ shopName:string; phone?:string; rating:number; dealCount:number; }; }

export default function CarDetailClient({ car }: { car: CarDetail }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState<"info"|"score"|"calc">("info");
  const [copied, setCopied] = useState(false);

  const images = car.images?.length > 0 ? car.images : [`https://source.unsplash.com/800x500/?${car.brand},car`];
  const monthly = Math.round((car.price*10000*0.05/12*Math.pow(1+0.05/12,36))/(Math.pow(1+0.05/12,36)-1));

  const handleShare = async () => {
    const url = `https://www.fixcar.kr/cars/${car.id}`;
    if (navigator.share) { await navigator.share({ title:car.name, url }); }
    else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),2000); }
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} @media(max-width:1024px){.dg{grid-template-columns:1fr!important;}}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{maxWidth:"1200px",margin:"0 auto",padding:"24px 32px 100px"}}>
          <Link href="/cars" style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"14px",fontWeight:700,color:"#888",marginBottom:"16px"}}><ChevronLeft size={16}/>매물 목록</Link>
          <div className="dg" style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:"24px",alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              <div style={{background:"white",borderRadius:"20px",overflow:"hidden"}}>
                <div style={{position:"relative",height:"360px",background:"#F0EEE9"}}>
                  <img src={images[imgIdx]} alt={car.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <div style={{position:"absolute",top:12,left:12,display:"flex",gap:"6px"}}>
                    {car.status==="AVAILABLE"&&<span style={{background:"#FF3B1E",color:"white",padding:"5px 12px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>🔒 FIX 정찰가</span>}
                    {car.accident&&<span style={{background:"#E8A020",color:"white",padding:"5px 12px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>⚠ 사고이력</span>}
                  </div>
                  <div style={{position:"absolute",top:12,right:12,display:"flex",gap:"8px"}}>
                    <FavoriteButton carId={car.id}/>
                    <button onClick={handleShare} style={{background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:"36px",height:"36px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Share2 size={15} color="#555"/></button>
                  </div>
                  {images.length>1&&<>
                    <button onClick={()=>setImgIdx(p=>Math.max(0,p-1))} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><ChevronLeft size={16}/></button>
                    <button onClick={()=>setImgIdx(p=>Math.min(images.length-1,p+1))} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><ChevronRight size={16}/></button>
                    <div style={{position:"absolute",bottom:10,right:12,background:"rgba(0,0,0,0.5)",color:"white",padding:"3px 10px",borderRadius:"100px",fontSize:"11px",fontWeight:700}}>{imgIdx+1}/{images.length}</div>
                  </>}
                  {copied&&<div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",background:"#1A1A1A",color:"white",padding:"7px 18px",borderRadius:"100px",fontSize:"13px",fontWeight:700}}>링크가 복사됐어요!</div>}
                </div>
                {images.length>1&&<div style={{display:"flex",gap:"7px",padding:"10px",overflowX:"auto"}}>{images.map((img,i)=><div key={i} onClick={()=>setImgIdx(i)} style={{width:"60px",height:"44px",borderRadius:"7px",overflow:"hidden",flexShrink:0,border:`2px solid ${imgIdx===i?"#FF3B1E":"transparent"}`,cursor:"pointer"}}><img src={img} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>)}</div>}
              </div>

              <div style={{background:"white",borderRadius:"18px",overflow:"hidden"}}>
                <div style={{display:"flex",borderBottom:"2px solid #F0EEE9"}}>
                  {([["info","차량 정보"],["score","선호도 점수"],["calc","할부 계산"]] as const).map(([t,l])=>(
                    <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"13px",border:"none",background:"transparent",fontSize:"14px",fontWeight:tab===t?800:600,color:tab===t?"#FF3B1E":"#888",borderBottom:`3px solid ${tab===t?"#FF3B1E":"transparent"}`,cursor:"pointer"}}>{l}</button>
                  ))}
                </div>
                <div style={{padding:"20px 22px"}}>
                  {tab==="info"&&(
                    <>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0"}}>
                        {[["연식",`${car.year}년식`],["주행거리",`${car.mileage.toLocaleString()}km`],["연료",car.fuel],["변속기",car.transmission],["색상",car.color],["배기량",car.cc?`${car.cc.toLocaleString()}cc`:"전기"],["최대출력",car.power?`${car.power}마력`:"-"],["연비",car.efficiency||"-"],["소유자",`${car.owners}인`],["사고이력",car.accident?"있음":"없음"]].map(([k,v])=>(
                          <div key={k as string} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #F0EEE9",paddingRight:"14px"}}>
                            <span style={{fontSize:"13px",color:"#888",fontWeight:400}}>{k}</span>
                            <span style={{fontSize:"13px",fontWeight:800,color:k==="사고이력"&&v==="있음"?"#FF3B1E":"#1A1A1A"}}>{v as string}</span>
                          </div>
                        ))}
                      </div>
                      {car.options?.length>0&&<div style={{marginTop:"14px"}}><div style={{fontSize:"13px",fontWeight:800,marginBottom:"8px"}}>옵션</div><div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{car.options.map(o=><span key={o} style={{background:"#EEF2FF",color:"#1847FF",padding:"3px 9px",borderRadius:"7px",fontSize:"11px",fontWeight:700}}>{o}</span>)}</div></div>}
                    </>
                  )}
                  {tab==="score"&&<CarScoreWidget carId={car.id}/>}
                  {tab==="calc"&&<InstallmentCalc defaultPrice={car.price}/>}
                </div>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"12px",position:"sticky",top:"84px"}}>
              <div style={{background:"white",borderRadius:"20px",padding:"22px"}}>
                <div style={{fontSize:"12px",color:"#888",fontWeight:400,marginBottom:"4px"}}>{car.brand} · {car.year}년식 · {car.region}</div>
                <h1 style={{fontSize:"19px",fontWeight:800,letterSpacing:"-0.5px",marginBottom:"12px",lineHeight:1.35}}>{car.name}</h1>
                <div style={{display:"flex",gap:"5px",marginBottom:"14px",flexWrap:"wrap"}}>{car.tags?.map(t=><span key={t} style={{background:"#EAF6EF",color:"#2D8A52",padding:"3px 9px",borderRadius:"100px",fontSize:"11px",fontWeight:700}}>✓ {t}</span>)}</div>
                <div style={{marginBottom:"14px"}}>
                  <div style={{fontSize:"30px",fontWeight:800,color:"#FF3B1E",letterSpacing:"-1px"}}>{car.price.toLocaleString()}<span style={{fontSize:"15px",color:"#AAA",fontWeight:700}}>만원</span></div>
                  <div style={{fontSize:"12px",color:"#1847FF",fontWeight:800,marginTop:"3px",display:"flex",alignItems:"center",gap:"3px"}}><Lock size={11}/> FIX 정찰가 · 흥정 없음</div>
                  <div style={{fontSize:"11px",color:"#AAA",fontWeight:400,marginTop:"2px"}}>월 {monthly.toLocaleString()}원~ (36개월·5%)</div>
                </div>
                <Link href={`/checkout?carId=${car.id}`}><button style={{width:"100%",background:"#FF3B1E",color:"white",border:"none",padding:"15px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer",marginBottom:"8px"}}>계약금 결제 (10%)</button></Link>
                <button onClick={handleShare} style={{width:"100%",background:"#F0EEE9",color:"#555",border:"none",padding:"12px",borderRadius:"12px",fontSize:"13px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}><Share2 size={14}/> 공유하기</button>
              </div>

              <div style={{background:"white",borderRadius:"18px",padding:"16px 18px"}}>
                <div style={{fontSize:"12px",fontWeight:800,color:"#888",marginBottom:"10px"}}>딜러 정보</div>
                <div style={{fontSize:"15px",fontWeight:800,marginBottom:"3px"}}>{car.dealer?.shopName||"픽스카 딜러"}</div>
                <div style={{fontSize:"12px",color:"#AAA",fontWeight:400,marginBottom:"10px"}}>⭐ {car.dealer?.rating||4.8} · 거래 {car.dealer?.dealCount||0}건</div>
                <div style={{display:"flex",gap:"7px"}}>
                  <Link href={`/inquiry?carId=${car.id}`} style={{flex:1}}><button style={{width:"100%",background:"#EEF2FF",color:"#1847FF",border:"none",padding:"10px",borderRadius:"9px",fontSize:"12px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"4px"}}><MessageCircle size={13}/>문의</button></Link>
                  {car.dealer?.phone&&<a href={`tel:${car.dealer.phone}`} style={{flex:1}}><button style={{width:"100%",background:"#F0EEE9",color:"#555",border:"none",padding:"10px",borderRadius:"9px",fontSize:"12px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"4px"}}><Phone size={13}/>전화</button></a>}
                </div>
              </div>

              <div style={{background:"#1A1A1A",borderRadius:"18px",padding:"16px 18px"}}>
                <div style={{fontSize:"12px",fontWeight:800,color:"rgba(255,255,255,0.4)",marginBottom:"10px"}}>픽스카 보장</div>
                {[{i:<Lock size={13}/>,t:"FIX 정찰가",d:"표시가 = 최종가"},{i:<Shield size={13}/>,t:"100항목 검수",d:"전문 정비사 점검"},{i:<CheckCircle size={13}/>,t:"3일 환불",d:"이유 불문 전액 환불"}].map(x=>(
                  <div key={x.t} style={{display:"flex",gap:"10px",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                    <div style={{color:"#FF3B1E",flexShrink:0,marginTop:"1px"}}>{x.i}</div>
                    <div><div style={{fontSize:"12px",fontWeight:800,color:"white"}}>{x.t}</div><div style={{fontSize:"11px",color:"rgba(255,255,255,0.35)",fontWeight:400}}>{x.d}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
