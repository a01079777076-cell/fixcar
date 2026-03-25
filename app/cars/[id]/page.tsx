"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, MessageSquare, Phone, MapPin, Shield, ChevronLeft, Share2, AlertTriangle, Check, Award, Star, Clock } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { saveRecentCar } from "@/components/RecentCars";

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [userId, setUserId] = useState<number|null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [mainImg, setMainImg] = useState(0);

  useEffect(()=>{
    fetch(`/api/cars/${id}`).then(r=>r.json()).then(d=>{
      if(d.id||d.data) { const c = d.data||d; setCar(c); saveRecentCar(c); }
      setLoading(false);
    }).catch(()=>setLoading(false));
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{ if(d?.user?.id) setUserId(d.user.id); }).catch(()=>{});
    fetch("/api/favorites/list").then(r=>r.json()).then(d=>{ if(Array.isArray(d)&&d.some((f:any)=>String(f.carId)===String(id))) setIsFav(true); }).catch(()=>{});
  },[id]);

  const toggleFav = async () => {
    if(!userId){alert("로그인이 필요해요!");return;}
    if(isFav){await fetch("/api/favorites",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({carId:Number(id)})});setIsFav(false);}
    else{await fetch("/api/favorites",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({carId:Number(id)})});setIsFav(true);}
  };

  const sendInquiry = async () => {
    if(!userId){alert("로그인이 필요해요!");return;}
    if(!inquiryMsg.trim()){alert("문의 내용을 입력해주세요");return;}
    setSending(true);
    try{
      const res=await fetch("/api/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({carId:Number(id),message:inquiryMsg})});
      const data=await res.json();
      if(data.success){alert("문의가 접수되었습니다! 딜러가 곧 답변드릴게요.");setShowInquiry(false);setInquiryMsg("");}
      else alert(data.error||"문의 실패");
    }catch{alert("네트워크 오류");}
    setSending(false);
  };

  if(loading) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div></>;
  if(!car) return <><Navbar/><div style={{textAlign:"center",padding:100}}><div style={{fontSize:48,marginBottom:12}}>🚗</div><h2 style={{fontSize:20,fontWeight:800}}>매물을 찾을 수 없어요</h2><Link href="/cars" style={{color:"#FF3B1E",fontWeight:700,marginTop:12,display:"inline-block"}}>매물 보러가기 →</Link></div></>;

  const images = car.images||[];
  const tags = car.tags||[];
  const options = car.options||[];
  const dealer = car.dealer;
  const isVerified = dealer?.verified;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} textarea:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px 100px"}}>
          <Link href="/cars" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:"#888",marginBottom:16}}><ChevronLeft size={14}/>매물 목록</Link>

          <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:24}}>
            {/* 왼쪽: 사진 */}
            <div>
              <div style={{borderRadius:20,overflow:"hidden",background:"#E8E6E1",aspectRatio:"4/3",marginBottom:12,position:"relative"}}>
                {images[mainImg]?<img src={images[mainImg]} alt={car.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:60,opacity:0.2}}>🚗</div>}
                {/* 검수 인증 배지 */}
                {car.inspected&&(
                  <div style={{position:"absolute",top:12,left:12,display:"flex",alignItems:"center",gap:5,background:"rgba(45,138,82,0.9)",borderRadius:100,padding:"6px 12px",backdropFilter:"blur(4px)"}}>
                    <Award size={13} color="white"/>
                    <span style={{fontSize:11,fontWeight:800,color:"white"}}>FIXCAR 검수 완료</span>
                  </div>
                )}
              </div>
              {images.length>1&&(
                <div style={{display:"flex",gap:8,overflowX:"auto"}}>
                  {images.map((img:string,i:number)=>(<button key={i} onClick={()=>setMainImg(i)} style={{width:72,height:54,borderRadius:10,overflow:"hidden",border:i===mainImg?"3px solid #FF3B1E":"2px solid transparent",cursor:"pointer",flexShrink:0,padding:0,background:"none"}}><img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></button>))}
                </div>
              )}
            </div>

            {/* 오른쪽: 정보 */}
            <div>
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                {tags.map((t:string)=><span key={t} style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:"#FFF0ED",color:"#FF3B1E"}}>{t}</span>)}
                {!car.accident&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:"#EAF6EF",color:"#2D8A52"}}>무사고</span>}
                {car.inspected&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:"#F0FAF4",color:"#2D8A52",display:"flex",alignItems:"center",gap:3}}><Award size={10}/>검수완료</span>}
              </div>
              <div style={{fontSize:12,color:"#AAA",marginBottom:4}}>{car.brand}</div>
              <h1 style={{fontSize:26,fontWeight:800,marginBottom:8,lineHeight:1.3}}>{car.name}</h1>
              <div style={{fontSize:12,color:"#888",marginBottom:16}}>{car.year}년 · {car.mileage?.toLocaleString()}km · {car.fuel} · {car.color} · {car.transmission}</div>

              <div style={{background:"white",borderRadius:18,padding:"24px",marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:800,letterSpacing:2,color:"#FF3B1E",marginBottom:4}}>FIX 정찰가</div>
                <div style={{fontSize:36,fontWeight:800,color:"#1A1A1A"}}>{car.price?.toLocaleString()}<span style={{fontSize:16,color:"#AAA",fontWeight:600}}>만원</span></div>
                <div style={{fontSize:12,color:"#AAA",marginTop:4}}>월 {Math.round(car.price*0.7/36)}만원 (36개월 할부 기준)</div>
              </div>

              {/* ═══ 딜러 정보 카드 (인증 배지 포함) ═══ */}
              {dealer&&(
                <Link href={`/shops/${dealer.id}`}>
                  <div style={{background:"white",borderRadius:18,padding:"18px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:14,cursor:"pointer",border:"1px solid #E8E6E1",transition:"all 0.15s"}}>
                    <div style={{width:44,height:44,borderRadius:"50%",background:isVerified?"linear-gradient(135deg,#0055FF,#003399)":"#E8E6E1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"white",flexShrink:0}}>
                      {(dealer.shopName||"D")[0]}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:15,fontWeight:800}}>{dealer.shopName}</span>
                        {isVerified&&<Shield size={14} color="#2D8A52"/>}
                        {isVerified&&<span style={{fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:100,background:"#F0FAF4",color:"#2D8A52"}}>인증딜러</span>}
                      </div>
                      <div style={{display:"flex",gap:10,marginTop:4,fontSize:12,color:"#AAA"}}>
                        <span style={{display:"flex",alignItems:"center",gap:3}}><Star size={10} color="#E8A020"/>{dealer.rating?.toFixed(1)||"0.0"}</span>
                        <span>거래 {dealer.dealCount||0}건</span>
                      </div>
                    </div>
                    <ChevronLeft size={16} color="#CCC" style={{transform:"rotate(180deg)"}}/>
                  </div>
                </Link>
              )}

              {/* 스펙 */}
              <div style={{background:"white",borderRadius:18,padding:"20px",marginBottom:16}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[{l:"연식",v:`${car.year}년`},{l:"주행거리",v:`${car.mileage?.toLocaleString()}km`},{l:"연료",v:car.fuel},{l:"변속기",v:car.transmission},{l:"색상",v:car.color},{l:"소유자",v:`${car.owners||1}인`},{l:"배기량",v:car.cc?`${car.cc}cc`:"-"},{l:"지역",v:car.region}].map(s=>(
                    <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F0EEE9"}}>
                      <span style={{fontSize:13,color:"#AAA"}}>{s.l}</span><span style={{fontSize:13,fontWeight:700}}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 옵션 */}
              {options.length>0&&(
                <div style={{background:"white",borderRadius:18,padding:"20px",marginBottom:16}}>
                  <div style={{fontSize:14,fontWeight:800,marginBottom:10}}>옵션</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {options.map((o:string)=><span key={o} style={{fontSize:11,padding:"4px 10px",borderRadius:8,background:"#EEF5FF",color:"#0066FF",fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Check size={10}/>{o}</span>)}
                  </div>
                </div>
              )}

              {/* 액션 버튼 */}
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <button onClick={toggleFav} style={{flex:1,padding:"16px",background:isFav?"#FFF0ED":"white",border:isFav?"2px solid #FF3B1E":"1.5px solid #E0DDD7",borderRadius:14,fontSize:15,fontWeight:800,color:isFav?"#FF3B1E":"#888",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}><Heart size={18} fill={isFav?"#FF3B1E":"none"}/>{isFav?"찜 완료":"찜하기"}</button>
                <button onClick={()=>setShowInquiry(!showInquiry)} style={{flex:1,padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}><MessageSquare size={18}/>문의하기</button>
              </div>

              <ShareButtons title={`${car.brand} ${car.name} ${car.price?.toLocaleString()}만원`} description={`${car.year}년 · ${car.mileage?.toLocaleString()}km · ${car.fuel}`} imageUrl={images[0]}/>
            </div>
          </div>

          {/* 문의 폼 */}
          {showInquiry&&(
            <div style={{background:"white",borderRadius:20,padding:"24px",marginTop:20}}>
              <h3 style={{fontSize:18,fontWeight:800,marginBottom:12}}>💬 딜러에게 문의하기</h3>
              <textarea rows={4} value={inquiryMsg} onChange={e=>setInquiryMsg(e.target.value)} placeholder="궁금한 점을 자유롭게 작성해주세요 (차량 상태, 시승 가능 여부, 할부 조건 등)" maxLength={2000} style={{width:"100%",padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",resize:"none",lineHeight:1.8}}/>
              <button onClick={sendInquiry} disabled={sending} style={{width:"100%",padding:"16px",background:sending?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:sending?"wait":"pointer",marginTop:12,fontFamily:"'NanumSquareRound',sans-serif"}}>{sending?"전송 중...":"문의 보내기"}</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
