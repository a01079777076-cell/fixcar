"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import FavoriteButton from "@/components/FavoriteButton";
import InstallmentCalc from "@/components/InstallmentCalc";
import { Lock, Share2, Phone, MessageCircle, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import Link from "next/link";

interface CarDetail { id:number; name:string; brand:string; year:number; mileage:number; fuel:string; color:string; region:string; price:number; cc:number; power:number; efficiency:string; transmission:string; owners:number; accident:boolean; status:string; tags:string[]; options:string[]; images:string[]; dealer:{ shopName:string; ownerName?:string; phone?:string; rating:number; dealCount:number; profileImage?:string; }; }

export default function CarDetailClient({ car }: { car: CarDetail }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState<"info"|"calc">("info");
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [paying, setPaying] = useState(false);

  const images = car.images?.length > 0 ? car.images : [];
  const monthly = Math.round((car.price*10000*0.06/12*Math.pow(1+0.06/12,36))/(Math.pow(1+0.06/12,36)-1));
  const depositAmount = Math.round(car.price * 0.1) * 10000;

  const handleShare = async () => {
    const url = `https://www.fixcar.kr/cars/${car.id}`;
    if (navigator.share) { await navigator.share({ title:car.name, url }); }
    else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),2000); }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const PortOne = (window as any).PortOne;
      if (!PortOne) { alert("결제 모듈 로딩 중입니다."); setPaying(false); return; }
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
      if (!storeId) { alert("결제 설정이 완료되지 않았습니다."); setPaying(false); return; }
      const res = await PortOne.requestPayment({
        storeId, channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "",
        paymentId: `fixcar-${car.id}-${Date.now()}`,
        orderName: `${car.name} 계약금 (10%)`, totalAmount: depositAmount, currency: "KRW", payMethod: "EASY_PAY",
      });
      if (res?.paymentId) { alert("계약금 결제가 완료됐어요!"); }
      else if (res?.code === "FAILURE") { alert("결제가 취소되었습니다."); }
    } catch (e) { alert("결제 오류: " + String(e)); }
    setPaying(false);
  };

  const prevImg = () => setImgIdx(p => Math.max(0, p-1));
  const nextImg = () => setImgIdx(p => Math.min(images.length-1, p+1));

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} @media(max-width:1024px){.detail-grid{grid-template-columns:1fr!important;}} .thumb-item:hover{opacity:0.8;} .gallery-arrow{transition:background 0.15s;} .gallery-arrow:hover{background:rgba(255,255,255,1)!important;}`}</style>

      {/* 풀스크린 갤러리 */}
      {fullscreen && images.length > 0 && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", zIndex:99999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <button onClick={()=>setFullscreen(false)} style={{ position:"absolute", top:20, right:20, background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><X size={22} color="white"/></button>
          <div style={{ position:"relative", maxWidth:"90vw", maxHeight:"80vh" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[imgIdx]} alt="" style={{ maxWidth:"90vw", maxHeight:"80vh", objectFit:"contain", borderRadius:8 }} />
            {images.length>1 && <>
              <button onClick={prevImg} style={{ position:"absolute", left:-50, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><ChevronLeft size={20} color="white"/></button>
              <button onClick={nextImg} style={{ position:"absolute", right:-50, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><ChevronRight size={20} color="white"/></button>
            </>}
          </div>
          <div style={{ color:"rgba(255,255,255,0.5)", marginTop:16, fontSize:14 }}>{imgIdx+1} / {images.length}</div>
        </div>
      )}

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar />
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"24px 32px 100px" }}>
          <Link href="/cars" style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"14px", fontWeight:700, color:"#888", marginBottom:"16px" }}><ChevronLeft size={16}/>매물 목록</Link>

          <div className="detail-grid" style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:"24px", alignItems:"start" }}>
            {/* ═══ 좌측 ═══ */}
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

              {/* 사진 갤러리 */}
              <div style={{ background:"white", borderRadius:"20px", overflow:"hidden" }}>
                {images.length > 0 ? (
                  <>
                    <div style={{ display:"flex", gap:"4px", height:"380px" }}>
                      {/* 메인 사진 */}
                      <div style={{ flex:"1 1 70%", position:"relative", overflow:"hidden", background:"#F0EEE9" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={images[imgIdx]} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        {/* 뱃지 */}
                        <div style={{ position:"absolute", top:12, left:12, display:"flex", gap:"6px" }}>
                          {car.status==="AVAILABLE"&&<span style={{ background:"#FF3B1E", color:"white", padding:"5px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>🔒 FIX 정찰가</span>}
                          {car.accident&&<span style={{ background:"#E8A020", color:"white", padding:"5px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>⚠ 사고이력</span>}
                        </div>
                        {/* 좌우 화살표 */}
                        {images.length>1 && <>
                          <button className="gallery-arrow" onClick={prevImg} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.85)", border:"none", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><ChevronLeft size={18}/></button>
                          <button className="gallery-arrow" onClick={nextImg} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.85)", border:"none", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><ChevronRight size={18}/></button>
                        </>}
                        {/* 전체보기 + 인덱스 */}
                        <div style={{ position:"absolute", bottom:12, right:12, display:"flex", gap:"8px" }}>
                          <button onClick={()=>setFullscreen(true)} style={{ background:"rgba(0,0,0,0.55)", color:"white", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}><Maximize2 size={13}/>전체보기</button>
                          <span style={{ background:"rgba(0,0,0,0.5)", color:"white", padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:700 }}>{imgIdx+1}/{images.length}</span>
                        </div>
                        {/* 즐겨찾기+공유 */}
                        <div style={{ position:"absolute", top:12, right:12, display:"flex", gap:"8px" }}>
                          <FavoriteButton carId={car.id}/>
                          <button onClick={handleShare} style={{ background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:"36px", height:"36px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><Share2 size={15} color="#555"/></button>
                        </div>
                        {copied&&<div style={{ position:"absolute", bottom:50, left:"50%", transform:"translateX(-50%)", background:"#1A1A1A", color:"white", padding:"7px 18px", borderRadius:"100px", fontSize:"13px", fontWeight:700 }}>링크가 복사됐어요!</div>}
                      </div>
                      {/* 사이드 사진 3장 */}
                      {images.length > 1 && (
                        <div style={{ flex:"0 0 30%", display:"flex", flexDirection:"column", gap:"4px" }}>
                          {images.slice(1, 4).map((img, i) => (
                            <div key={i} className="thumb-item" onClick={() => setImgIdx(i+1)} style={{ flex:1, overflow:"hidden", cursor:"pointer", background:"#F0EEE9", position:"relative" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity: imgIdx===i+1?0.7:1, transition:"opacity 0.15s" }} />
                              {i===2 && images.length>4 && (
                                <div onClick={(e)=>{e.stopPropagation();setFullscreen(true);}} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:16, fontWeight:800 }}>+{images.length-4}장 더보기</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* 하단 썸네일 스트립 */}
                    {images.length > 4 && (
                      <div style={{ display:"flex", gap:"6px", padding:"10px", overflowX:"auto" }}>
                        {images.map((img, i) => (
                          <div key={i} onClick={()=>setImgIdx(i)} style={{ width:"56px", height:"42px", borderRadius:"6px", overflow:"hidden", flexShrink:0, border:`2px solid ${imgIdx===i?"#FF3B1E":"transparent"}`, cursor:"pointer" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ height:"380px", display:"flex", alignItems:"center", justifyContent:"center", background:"#F0EEE9", color:"#CCC", flexDirection:"column", gap:8 }}>
                    <span style={{ fontSize:48 }}>📷</span>
                    <span style={{ fontSize:14 }}>사진 업데이트 예정</span>
                  </div>
                )}
              </div>

              {/* 탭: 차량 정보 / 할부 계산 */}
              <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                <div style={{ display:"flex", borderBottom:"2px solid #F0EEE9" }}>
                  {([["info","차량 정보"],["calc","할부 계산"]] as const).map(([t,l])=>(
                    <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:"13px", border:"none", background:"transparent", fontSize:"14px", fontWeight:tab===t?800:600, color:tab===t?"#FF3B1E":"#888", borderBottom:`3px solid ${tab===t?"#FF3B1E":"transparent"}`, cursor:"pointer" }}>{l}</button>
                  ))}
                </div>
                <div style={{ padding:"20px 22px" }}>
                  {tab==="info"&&(
                    <>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0" }}>
                        {[["연식",`${car.year}년식`],["주행거리",`${car.mileage.toLocaleString()}km`],["연료",car.fuel],["변속기",car.transmission],["색상",car.color],["배기량",car.cc?`${car.cc.toLocaleString()}cc`:"전기"],["최대출력",car.power?`${car.power}마력`:"-"],["연비",car.efficiency||"-"],["소유자",`${car.owners}인`],["사고이력",car.accident?"있음":"없음"]].map(([k,v])=>(
                          <div key={k as string} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #F0EEE9", paddingRight:"14px" }}>
                            <span style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{k}</span>
                            <span style={{ fontSize:"13px", fontWeight:800, color:k==="사고이력"&&v==="있음"?"#FF3B1E":"#1A1A1A" }}>{v as string}</span>
                          </div>
                        ))}
                      </div>
                      {car.options?.length>0&&<div style={{ marginTop:"14px" }}><div style={{ fontSize:"13px", fontWeight:800, marginBottom:"8px" }}>옵션</div><div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>{car.options.map(o=><span key={o} style={{ background:"#EEF2FF", color:"#1847FF", padding:"3px 9px", borderRadius:"7px", fontSize:"11px", fontWeight:700 }}>{o}</span>)}</div></div>}
                    </>
                  )}
                  {tab==="calc"&&<InstallmentCalc defaultPrice={car.price}/>}
                </div>
              </div>
            </div>

            {/* ═══ 우측 사이드바 ═══ */}
            <div style={{ display:"flex", flexDirection:"column", gap:"12px", position:"sticky", top:"84px" }}>
              {/* 가격 + 결제 */}
              <div style={{ background:"white", borderRadius:"20px", padding:"22px" }}>
                <div style={{ fontSize:"12px", color:"#888", fontWeight:400, marginBottom:"4px" }}>{car.brand} · {car.year}년식 · {car.region}</div>
                <h1 style={{ fontSize:"19px", fontWeight:800, letterSpacing:"-0.5px", marginBottom:"12px", lineHeight:1.35 }}>{car.name}</h1>
                <div style={{ display:"flex", gap:"5px", marginBottom:"14px", flexWrap:"wrap" }}>{car.tags?.map(t=><span key={t} style={{ background:"#EAF6EF", color:"#2D8A52", padding:"3px 9px", borderRadius:"100px", fontSize:"11px", fontWeight:700 }}>✓ {t}</span>)}</div>
                <div style={{ marginBottom:"14px" }}>
                  <div style={{ fontSize:"30px", fontWeight:800, color:"#FF3B1E", letterSpacing:"-1px" }}>{car.price.toLocaleString()}<span style={{ fontSize:"15px", color:"#AAA", fontWeight:700 }}>만원</span></div>
                  <div style={{ fontSize:"12px", color:"#1847FF", fontWeight:800, marginTop:"3px", display:"flex", alignItems:"center", gap:"3px" }}><Lock size={11}/> FIX 정찰가 · 흥정 없음</div>
                  <div style={{ fontSize:"11px", color:"#AAA", fontWeight:400, marginTop:"2px" }}>월 {monthly.toLocaleString()}원~ (36개월·금리6%)</div>
                </div>
                <button onClick={handlePayment} disabled={paying} style={{ width:"100%", background:paying?"#CCC":"#FF3B1E", color:"white", border:"none", padding:"15px", borderRadius:"12px", fontSize:"15px", fontWeight:800, cursor:paying?"wait":"pointer", marginBottom:"8px" }}>
                  {paying ? "결제 진행 중..." : `계약금 결제 (${(car.price*0.1).toFixed(0)}만원 · 10%)`}
                </button>
                <button onClick={handleShare} style={{ width:"100%", background:"#F0EEE9", color:"#555", border:"none", padding:"12px", borderRadius:"12px", fontSize:"13px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}><Share2 size={14}/> 공유하기</button>
              </div>

              {/* 매매상사 정보 */}
              <div style={{ background:"white", borderRadius:"18px", padding:"18px 20px" }}>
                <div style={{ fontSize:"12px", fontWeight:800, color:"#888", marginBottom:"12px" }}>매매상사</div>
                <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"12px" }}>
                  {/* 딜러 프로필 사진 */}
                  <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:"#F0EEE9", border:"2px solid #E8E6E1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", overflow:"hidden", flexShrink:0 }}>
                    {car.dealer?.profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={car.dealer.profileImage} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    ) : "🏪"}
                  </div>
                  <div>
                    <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"2px" }}>{car.dealer?.shopName||"픽스카 매매상사"}</div>
                    {car.dealer?.ownerName && <div style={{ fontSize:"13px", color:"#666", fontWeight:600 }}>담당: {car.dealer.ownerName}</div>}
                    <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>⭐ {car.dealer?.rating||4.8} · 거래 {car.dealer?.dealCount||0}건</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:"7px" }}>
                  <Link href={`/inquiry?carId=${car.id}`} style={{ flex:1 }}><button style={{ width:"100%", background:"#EEF2FF", color:"#1847FF", border:"none", padding:"11px", borderRadius:"9px", fontSize:"13px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"4px" }}><MessageCircle size={14}/>문의하기</button></Link>
                  {car.dealer?.phone&&<a href={`tel:${car.dealer.phone}`} style={{ flex:1 }}><button style={{ width:"100%", background:"#F0EEE9", color:"#555", border:"none", padding:"11px", borderRadius:"9px", fontSize:"13px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"4px" }}><Phone size={14}/>전화</button></a>}
                </div>
              </div>

              {/* 할부 계산 (간략) */}
              <div style={{ background:"white", borderRadius:"18px", padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                  <div style={{ fontSize:"12px", fontWeight:800, color:"#888" }}>예상 할부금</div>
                  <div style={{ fontSize:"10px", color:"#CCC", fontWeight:400 }}>금리 6% 기준</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:6 }}>
                  {[{m:24},{m:36},{m:48},{m:60}].map(({m})=>{
                    const r=0.06;
                    const mo = Math.round((car.price*10000*r/12*Math.pow(1+r/12,m))/(Math.pow(1+r/12,m)-1));
                    return (
                      <div key={m} style={{ textAlign:"center", padding:"10px 0", background:"#F8F7F4", borderRadius:10 }}>
                        <div style={{ fontSize:11, color:"#AAA", fontWeight:400 }}>{m}개월</div>
                        <div style={{ fontSize:14, fontWeight:800, color:"#1A1A1A" }}>{Math.round(mo/10000)}만</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
