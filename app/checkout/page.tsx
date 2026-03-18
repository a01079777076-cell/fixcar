"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Lock, CheckCircle, CreditCard, Smartphone } from "lucide-react";

declare global { interface Window { PortOne: any; } }

function CheckoutContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const [car, setCar] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [payMethod, setPayMethod] = useState<"KAKAO"|"TOSS"|"CARD">("KAKAO");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{ if(!d.user){window.location.href="/login";return;} setUser(d.user); });
    if (carId) {
      fetch(`/api/cars/${carId}`).then(r=>r.json()).then(d=>{ if(d.success)setCar(d.data); setLoading(false); })
        .catch(()=>{ setCar({id:carId,name:"현대 아반떼 CN7",price:1450,year:2021,fuel:"가솔린",mileage:32000}); setLoading(false); });
    } else setLoading(false);
  }, [carId]);

  const handlePayment = async () => {
    if (!car||!user) return;
    setPaying(true);
    try {
      const orderId = `fixcar-${Date.now()}-${user.id}`;
      const depositAmount = Math.round(car.price * 10000 * 0.1);
      const script = document.createElement("script");
      script.src = "https://cdn.portone.io/v2/browser-sdk.js";
      document.head.appendChild(script);
      await new Promise(r => script.onload = r);

      const response = await window.PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
        channelKey: payMethod==="KAKAO" ? process.env.NEXT_PUBLIC_PORTONE_KAKAO_CHANNEL_KEY : payMethod==="TOSS" ? process.env.NEXT_PUBLIC_PORTONE_TOSS_CHANNEL_KEY : process.env.NEXT_PUBLIC_PORTONE_CARD_CHANNEL_KEY,
        paymentId: orderId,
        orderName: `[픽스카] ${car.name} 계약금`,
        totalAmount: depositAmount,
        currency: "KRW",
        payMethod: payMethod==="CARD" ? "CARD" : "EASY_PAY",
        customer: { customerId: String(user.id), fullName: user.name, email: user.email },
      });
      if (response.code) throw new Error(response.message);
      const verifyRes = await fetch("/api/payment/verify",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({paymentId:orderId,carId:car.id,amount:depositAmount}) });
      const verifyData = await verifyRes.json();
      if (verifyData.success) setDone(true);
      else alert("결제 검증에 실패했어요");
    } catch(e:any) { if(!e.message?.includes("cancel")) alert("결제 오류: "+(e.message||"")); }
    setPaying(false);
  };

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F0EEE9",fontFamily:"sans-serif"}}>로딩 중...</div>;

  if (done) return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{background:"white",borderRadius:"24px",padding:"48px",textAlign:"center",maxWidth:"400px",width:"90%"}}>
          <CheckCircle size={64} color="#2D8A52" style={{margin:"0 auto 20px"}} />
          <div style={{fontSize:"24px",fontWeight:800,marginBottom:"8px"}}>계약금 결제 완료!</div>
          <div style={{fontSize:"15px",color:"#888",marginBottom:"28px",fontWeight:400}}>딜러가 24시간 내 연락드릴 거예요.</div>
          <a href="/mypage"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"14px 32px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer",width:"100%"}}>마이페이지에서 확인하기</button></a>
        </div>
      </div>
    </>
  );

  const deposit = car ? Math.round(car.price * 0.1) : 0;

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .pay-method{border:2px solid #E0DDD7;border-radius:14px;padding:14px 20px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:all 0.15s;}
        .pay-method.active{border-color:#1A1A1A;background:#F8F6F2;}
        @media(max-width:768px){.checkout-grid{grid-template-columns:1fr!important;}}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar />
        <div style={{maxWidth:"860px",margin:"0 auto",padding:"32px 32px 80px"}}>
          <h1 style={{fontSize:"28px",fontWeight:800,marginBottom:"24px",letterSpacing:"-1px"}}>계약금 결제</h1>
          <div className="checkout-grid" style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"20px",alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
              <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
                <div style={{fontSize:"13px",fontWeight:800,color:"#FF3B1E",marginBottom:"8px"}}>결제 차량</div>
                {car && <>
                  <div style={{fontSize:"20px",fontWeight:800,marginBottom:"6px"}}>{car.name}</div>
                  <div style={{fontSize:"14px",color:"#888",marginBottom:"16px",fontWeight:400}}>{car.year}년식 · {car.fuel}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"14px",borderTop:"1px solid #F0EEE9"}}>
                    <div><div style={{fontSize:"13px",color:"#888",fontWeight:400}}>차량 가격</div><div style={{fontSize:"22px",fontWeight:800}}>{car.price.toLocaleString()}만원</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:"13px",color:"#888",fontWeight:400}}>계약금 (10%)</div><div style={{fontSize:"22px",fontWeight:800,color:"#FF3B1E"}}>{deposit.toLocaleString()}만원</div></div>
                  </div>
                </>}
              </div>
              <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"14px",padding:"16px 18px"}}>
                <div style={{fontSize:"14px",fontWeight:800,color:"#2D8A52",marginBottom:"6px"}}>💡 계약금 안내</div>
                <div style={{fontSize:"13px",color:"#555",lineHeight:1.75,fontWeight:400}}>차량 가격의 10%를 계약금으로 먼저 결제해요. 잔금은 차량 수령 후 딜러와 직접 정산해요. 계약 취소 시 3일 이내 100% 환불됩니다.</div>
              </div>
            </div>
            <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
              <div style={{fontSize:"16px",fontWeight:800,marginBottom:"16px"}}>결제 수단 선택</div>
              <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"20px"}}>
                {[["KAKAO","카카오페이","카카오톡으로 간편결제"],["TOSS","토스페이","토스앱으로 간편결제"],["CARD","신용/체크카드","모든 카드 결제 가능"]].map(([key,label,desc])=>(
                  <div key={key} className={`pay-method${payMethod===key?" active":""}`} onClick={()=>setPayMethod(key as any)}>
                    {key==="KAKAO"?<svg width="22" height="22" viewBox="0 0 24 24" fill="#391B1B"><path d="M12 3C6.477 3 2 6.477 2 10.909c0 2.868 1.671 5.388 4.199 6.894l-1.07 3.966a.5.5 0 0 0 .731.546l4.469-2.97A11.6 11.6 0 0 0 12 19.818c5.523 0 10-3.477 10-7.909S17.523 3 12 3z"/></svg>:key==="TOSS"?<Smartphone size={22} color="#0064FF"/>:<CreditCard size={22} color="#555"/>}
                    <div><div style={{fontSize:"14px",fontWeight:800}}>{label}</div><div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{desc}</div></div>
                    {payMethod===key && <CheckCircle size={16} color="#2D8A52" style={{marginLeft:"auto"}}/>}
                  </div>
                ))}
              </div>
              <div style={{padding:"14px",background:"#F8F6F2",borderRadius:"10px",marginBottom:"16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"16px",fontWeight:800}}><span>결제 금액</span><span style={{color:"#FF3B1E"}}>{deposit.toLocaleString()}만원</span></div>
              </div>
              <button onClick={handlePayment} disabled={paying||!car} style={{background:paying||!car?"#E0DDD7":"#FF3B1E",color:paying||!car?"#AAA":"white",border:"none",padding:"15px",borderRadius:"12px",fontSize:"15px",fontWeight:800,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",cursor:paying||!car?"default":"pointer"}}>
                <Lock size={16}/> {paying?"결제 중...":"계약금 결제하기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F0EEE9",fontFamily:"sans-serif"}}>로딩 중...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
