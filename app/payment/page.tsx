"use client";

import { useState, useEffect } from "react";
import { Lock, CheckCircle, CreditCard, Smartphone, ArrowRight, Shield, Star, Zap } from "lucide-react";

declare global {
  interface Window {
    PortOne: {
      requestPayment: (params: Record<string, unknown>) => Promise<{
        paymentId?: string;
        code?: string;
        message?: string;
      }>;
    };
  }
}

const PRODUCTS = [
  {
    id: "premium_buyer",
    name: "구매자 프리미엄",
    price: 9900,
    desc: "차량 상세 시세 분석, 딜러 직통 연결, 우선 매물 알림",
    features: ["시세 상세 분석", "딜러 직통 연결", "우선 알림", "30일 이용"],
    badge: "인기",
    color: "#FF3B1E",
  },
  {
    id: "dealer_listing",
    name: "딜러 매물 등록",
    price: 29000,
    desc: "차량 1대 프리미엄 홍보 등록. 메인 노출 + 추천 알고리즘 포함",
    features: ["메인 페이지 노출", "추천 알고리즘 포함", "30일 홍보", "조회수 통계"],
    badge: "딜러 전용",
    color: "#1847FF",
  },
  {
    id: "dealer_premium",
    name: "딜러 프리미엄 홍보",
    price: 59000,
    desc: "차량 3대 동시 프리미엄 홍보 + 딜러 인증 뱃지 + 상단 고정",
    features: ["3대 동시 홍보", "상단 고정 노출", "인증 뱃지", "60일 홍보"],
    badge: "Best",
    color: "#2D8A52",
  },
];

const PAY_METHODS = [
  { id: "kakaopay", label: "카카오페이", emoji: "💛", color: "#FEE500", textColor: "#391B1B" },
  { id: "tosspay", label: "토스페이", emoji: "💙", color: "#0064FF", textColor: "white" },
  { id: "card", label: "신용·체크카드", emoji: "💳", color: "#1A1A1A", textColor: "white" },
];

export default function PaymentPage() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [selectedMethod, setSelectedMethod] = useState(PAY_METHODS[0]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{amount: number; method: string; paidAt: string} | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // 포트원 V2 SDK 로드
    const script = document.createElement("script");
    script.src = "https://cdn.portone.io/v2/browser-sdk.js";
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      alert("결제 모듈 로딩 중이에요. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 1. 결제 준비 API 호출
      const prepRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedProduct.id,
          amount: selectedProduct.price,
          orderName: selectedProduct.name,
          payMethod: selectedMethod.id,
        }),
      });

      const prepData = await prepRes.json();
      if (!prepData.success) {
        alert(prepData.error || "결제 준비에 실패했어요");
        setLoading(false);
        return;
      }

      const { orderId, storeId, amount, orderName, channelKey } = prepData.data;

      // 2. 포트원 V2 결제 요청
      const paymentId = `payment_${Date.now()}`;

      const result = await window.PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount: amount,
        currency: "CURRENCY_KRW",
        payMethod: selectedMethod.id === "card" ? "CARD" :
                   selectedMethod.id === "kakaopay" ? "EASY_PAY" : "EASY_PAY",
        easyPay: selectedMethod.id !== "card" ? {
          easyPayProvider: selectedMethod.id === "kakaopay" ? "KAKAOPAY" : "TOSSPAY",
        } : undefined,
        customer: { fullName: "픽스카 사용자" },
      });

      if (result.code) {
        alert(`결제 실패: ${result.message}`);
        setLoading(false);
        return;
      }

      // 3. 결제 검증
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: result.paymentId,
          orderId,
          amount,
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setPaymentResult(verifyData.data);
        setDone(true);
      } else {
        alert(verifyData.error || "결제 검증에 실패했어요");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("결제 중 오류가 발생했어요");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        @keyframes scaleIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#F0EEE9", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div style={{ textAlign:"center", maxWidth:"480px", width:"100%" }}>
          <div style={{ width:"88px", height:"88px", background:"#EAF6EF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", animation:"scaleIn 0.5s ease" }}>
            <CheckCircle size={44} color="#2D8A52" />
          </div>
          <h1 style={{ fontSize:"36px", fontWeight:800, letterSpacing:"-1px", marginBottom:"12px", animation:"fadeUp 0.5s 0.1s both" }}>결제 완료! 🎉</h1>
          <p style={{ fontSize:"16px", color:"#888", lineHeight:1.8, marginBottom:"32px", fontWeight:400, animation:"fadeUp 0.5s 0.2s both" }}>
            <strong style={{ color:"#1A1A1A", fontWeight:800 }}>{selectedProduct.name}</strong> 결제가 완료됐어요.
          </p>
          <div style={{ background:"white", borderRadius:"20px", padding:"24px", marginBottom:"20px", animation:"fadeUp 0.5s 0.3s both" }}>
            {[
              ["결제 상품", selectedProduct.name],
              ["결제 금액", `${selectedProduct.price.toLocaleString()}원`],
              ["결제 수단", selectedMethod.label],
              ["결제 일시", new Date().toLocaleString("ko-KR")],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #F0EEE9" }}>
                <span style={{ fontSize:"14px", color:"#888", fontWeight:400 }}>{k}</span>
                <span style={{ fontSize:"14px", fontWeight:800 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"12px", animation:"fadeUp 0.5s 0.4s both" }}>
            <a href="/mypage" style={{ flex:1 }}><button style={{ width:"100%", background:"#FF3B1E", color:"white", border:"none", padding:"15px", borderRadius:"12px", fontSize:"15px", fontWeight:800, cursor:"pointer" }}>마이페이지</button></a>
            <a href="/" style={{ flex:1 }}><button style={{ width:"100%", background:"white", border:"2px solid #E0DDD7", padding:"13px", borderRadius:"12px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>홈으로</button></a>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .product-card { transition:all 0.2s; cursor:pointer; border:2px solid; border-radius:18px; padding:22px; }
        .product-card:hover { transform:translateY(-2px); }
        .pay-btn { transition:all 0.15s; cursor:pointer; border:2px solid; border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:12px; }
        .pay-btn:hover { transform:translateY(-1px); }
        .btn-red { background:#FF3B1E; color:white; border:none; border-radius:14px; font-size:16px; font-weight:800; width:100%; padding:18px; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:10px; cursor:pointer; }
        .btn-red:hover { background:#D42E14; }
        .btn-red:disabled { background:#E0DDD7; color:#AAA; cursor:default; }
        .nav-link:hover { color:#1A1A1A !important; }
        @media(max-width:1024px) { .pay-grid { grid-template-columns:1fr !important; } .nav-menu { display:none !important; } }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        {/* 네비 */}
        <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px", fontSize:"13px", fontWeight:700 }}>
          <span style={{ color:"#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp; <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제
        </div>
        <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px" }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}><span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span></a>
          <div className="nav-menu" style={{ display:"flex", gap:"36px" }}>
            {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
              <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight:700, color:"#888" }}>{l}</a>
            ))}
          </div>
        </nav>

        {/* 헤더 */}
        <div style={{ background:"#1A1A1A", padding:"44px 52px 36px" }}>
          <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"10px" }}>PAYMENT</div>
            <h1 style={{ fontSize:"clamp(26px,4vw,48px)", fontWeight:800, color:"white", letterSpacing:"-1.5px" }}>픽스카 서비스 결제</h1>
          </div>
        </div>

        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"32px 52px 80px" }}>
          <div className="pay-grid" style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:"28px", alignItems:"start" }}>

            {/* 왼쪽 */}
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

              {/* 상품 선택 */}
              <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
                  <Star size={20} color="#FF3B1E" /> 서비스 선택
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  {PRODUCTS.map(product => (
                    <div key={product.id} className="product-card" onClick={()=>setSelectedProduct(product)} style={{ borderColor:selectedProduct.id===product.id?product.color:"#E0DDD7", background:selectedProduct.id===product.id?`${product.color}0D`:"#F8F6F2" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                          <span style={{ background:product.color, color:"white", padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{product.badge}</span>
                          <span style={{ fontSize:"16px", fontWeight:800 }}>{product.name}</span>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", color:selectedProduct.id===product.id?product.color:"#1A1A1A", letterSpacing:"0.5px" }}>{product.price.toLocaleString()}<span style={{ fontSize:"14px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#AAA" }}>원</span></div>
                        </div>
                      </div>
                      <div style={{ fontSize:"13px", color:"#888", marginBottom:"12px", fontWeight:400 }}>{product.desc}</div>
                      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                        {product.features.map(f => (
                          <span key={f} style={{ background:"white", border:`1px solid ${product.color}33`, padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:700, color:product.color }}>✓ {f}</span>
                        ))}
                      </div>
                      {selectedProduct.id===product.id && <CheckCircle size={18} color={product.color} style={{ marginTop:"10px" }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* 결제 수단 */}
              <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
                  <CreditCard size={20} color="#1847FF" /> 결제 수단
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {PAY_METHODS.map(method => (
                    <div key={method.id} className="pay-btn" onClick={()=>setSelectedMethod(method)} style={{ borderColor:selectedMethod.id===method.id?"#1847FF":"#E0DDD7", background:selectedMethod.id===method.id?"#EEF2FF":"#F8F6F2" }}>
                      <div style={{ width:"40px", height:"40px", background:method.color, borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>{method.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"15px", fontWeight:800 }}>{method.label}</div>
                        {method.id==="kakaopay" && <div style={{ fontSize:"12px", color:"#888", fontWeight:400 }}>카카오페이 간편결제</div>}
                        {method.id==="tosspay" && <div style={{ fontSize:"12px", color:"#888", fontWeight:400 }}>토스페이 간편결제</div>}
                        {method.id==="card" && <div style={{ fontSize:"12px", color:"#888", fontWeight:400 }}>국내외 모든 카드 · 무이자 할부</div>}
                      </div>
                      {selectedMethod.id===method.id && <CheckCircle size={18} color="#1847FF" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* 보안 */}
              <div style={{ background:"#EEF2FF", border:"1px solid #B8C8FF", borderRadius:"14px", padding:"16px 20px", display:"flex", gap:"12px" }}>
                <Shield size={20} color="#1847FF" style={{ flexShrink:0 }} />
                <div style={{ fontSize:"13px", color:"#1847FF", fontWeight:400, lineHeight:1.6 }}>
                  <strong style={{ fontWeight:800 }}>안전한 결제:</strong> 포트원(PortOne) PG사를 통해 처리돼요. 카드 정보는 저장되지 않아요.
                </div>
              </div>
            </div>

            {/* 오른쪽 요약 */}
            <div style={{ position:"sticky", top:"88px", display:"flex", flexDirection:"column", gap:"16px" }}>
              <div style={{ background:"white", borderRadius:"20px", padding:"24px" }}>
                <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"16px" }}>결제 요약</div>
                {[
                  ["선택 서비스", selectedProduct.name],
                  ["이용 기간", selectedProduct.features[selectedProduct.features.length-1]],
                  ["결제 수단", selectedMethod.label],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #F0EEE9" }}>
                    <span style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{k}</span>
                    <span style={{ fontSize:"13px", fontWeight:700 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"14px", marginTop:"4px" }}>
                  <span style={{ fontSize:"15px", fontWeight:800, color:"#FF3B1E" }}>결제 금액</span>
                  <span style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", color:"#FF3B1E", letterSpacing:"0.5px" }}>{selectedProduct.price.toLocaleString()}<span style={{ fontSize:"13px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#AAA" }}>원</span></span>
                </div>
              </div>

              <button className="btn-red" onClick={handlePayment} disabled={loading}>
                {loading ? "결제 처리 중..." : <><Lock size={18}/> {selectedProduct.price.toLocaleString()}원 결제하기 <ArrowRight size={16}/></>}
              </button>

              <div style={{ background:"#F8F6F2", borderRadius:"14px", padding:"16px", display:"flex", flexDirection:"column", gap:"8px" }}>
                {[
                  { icon:<Zap size={14} color="#FF3B1E"/>, text:"즉시 이용 가능" },
                  { icon:<Shield size={14} color="#2D8A52"/>, text:"환불 정책 7일 이내" },
                  { icon:<Lock size={14} color="#1847FF"/>, text:"안전한 암호화 결제" },
                ].map(item => (
                  <div key={item.text} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"#555", fontWeight:600 }}>
                    {item.icon} {item.text}
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
