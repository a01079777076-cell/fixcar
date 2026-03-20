"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Clock, Users, Shield, ChevronUp } from "lucide-react";
import { Suspense } from "react";

const MOCK_AUCTIONS = [
  { id:1, name:"2019 현대 아반떼 1.6 GDi", year:2019, mileage:62000, fuel:"가솔린", color:"흰색", region:"광주 북구", startPrice:780, currentBid:850, bidCount:7, endsAt:new Date(Date.now()+3600000*5), defects:["뒷범퍼 경미한 스크래치"], deduction:30, tags:["1인소유","무사고"] },
  { id:2, name:"2020 기아 K5 2.0 MPI", year:2020, mileage:44000, fuel:"가솔린", color:"검정", region:"광주 서구", startPrice:1580, currentBid:1620, bidCount:3, endsAt:new Date(Date.now()+3600000*12), defects:["앞유리 미세 크랙"], deduction:50, tags:["2인소유","하자감가적용"] },
  { id:3, name:"2021 현대 투싼 1.6 T-GDi", year:2021, mileage:38000, fuel:"가솔린", color:"은색", region:"광주 남구", startPrice:2100, currentBid:2180, bidCount:11, endsAt:new Date(Date.now()+3600000*2), defects:[], deduction:0, tags:["1인소유","무사고","가득충전"] },
];

/* 뒤 2자리 마스킹 */
function hideBid(price: number): string {
  if (price < 100) return "xx만원";
  return String(price).slice(0, -2) + "xx만원";
}

/* 마스킹 기준값 (100단위) */
function maskedBase(price: number): number {
  return Math.floor(price / 100);
}

function useCountdown(target: Date) {
  const [left, setLeft] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(target.getTime() - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
  return left > 0 ? `${h}시간 ${m}분 ${s}초 남음` : "경매 종료";
}

function AuctionCard({ a }: { a: typeof MOCK_AUCTIONS[0] }) {
  const [myBid, setMyBid] = useState("");
  const [bidding, setBidding] = useState(false);
  const [bidResult, setBidResult] = useState<string | null>(null);
  const countdown = useCountdown(a.endsAt);

  const handleBid = () => {
    const v = parseInt(myBid);
    if (!v || v <= 0) { alert("입찰 금액을 입력해주세요"); return; }

    /*
     * ★ 핵심 로직: 마스킹된 값이 같거나 크면 입찰 허용
     * ex) 현재 최고 850 → 마스킹 "8xx"
     * 입찰 810 → 마스킹 "8xx" → 같으므로 허용 (실제로는 낮지만 모름)
     * 입찰 750 → 마스킹 "7xx" → 낮으므로 거부
     */
    if (maskedBase(v) < maskedBase(a.currentBid)) {
      alert(`현재 입찰가(${hideBid(a.currentBid)}) 이상으로 입찰해주세요.\n\n마스킹 범위(${String(maskedBase(a.currentBid))}xx만원) 이상이어야 합니다.`);
      return;
    }

    setBidding(true);
    setTimeout(() => {
      setBidResult(`${hideBid(v)}으로 입찰 완료!`);
      setBidding(false);
      setMyBid("");
      setTimeout(() => setBidResult(null), 4000);
    }, 600);
  };

  return (
    <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", marginBottom: "20px" }}>
      <div style={{ background: "#F0EEE9", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>🚗</div>
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "4px" }}>{a.name}</h2>
            <div style={{ fontSize: "13px", color: "#888", fontWeight: 400 }}>{a.year}년 · {a.mileage.toLocaleString()}km · {a.fuel} · {a.color} · {a.region}</div>
          </div>
          <div style={{ background: countdown.includes("종료") ? "#F0EEE9" : "#FFF0ED", border: `1px solid ${countdown.includes("종료") ? "#E0DDD7" : "#FFB8A8"}`, borderRadius: "100px", padding: "6px 14px", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <Clock size={13} color={countdown.includes("종료") ? "#AAA" : "#FF3B1E"} />
            <span style={{ fontSize: "13px", fontWeight: 800, color: countdown.includes("종료") ? "#AAA" : "#FF3B1E" }}>{countdown}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
          {a.tags.map(t => <span key={t} style={{ background: "#EAF6EF", color: "#2D8A52", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 700 }}>✓ {t}</span>)}
          {a.deduction > 0 && <span style={{ background: "#FFF0ED", color: "#FF3B1E", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 700 }}>⚠️ 하자감가 -{a.deduction}만원</span>}
        </div>
        {a.defects.length > 0 && (
          <div style={{ background: "#FFF8EC", border: "1px solid #FFD89A", borderRadius: "10px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: "#7A5500", fontWeight: 400 }}>
            <strong style={{ fontWeight: 800 }}>⚠️ 하자 내역:</strong> {a.defects.join(", ")}
          </div>
        )}
        <div style={{ background: "#F8F6F2", borderRadius: "14px", padding: "16px 20px", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#AAA", marginBottom: "3px", fontWeight: 400 }}>시작 호가</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#888" }}>{hideBid(a.startPrice)}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#1847FF", marginBottom: "3px", fontWeight: 800 }}>현재 최고 입찰가</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#1847FF" }}>{hideBid(a.currentBid)}</div>
            </div>
          </div>
          <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Users size={14} color="#888" />
            <span style={{ fontSize: "13px", color: "#888", fontWeight: 400 }}>{a.bidCount}명 입찰 중</span>
            <span style={{ fontSize: "11px", color: "#AAA", fontWeight: 400 }}>· 순위 비공개 · 이름 비공개</span>
          </div>
        </div>

        {/* 입찰 안내 */}
        <div style={{ background: "#EEF2FF", border: "1px solid #B8C8FF", borderRadius: "12px", padding: "12px 14px", marginBottom: "14px", fontSize: "12px", color: "#1847FF", lineHeight: 1.7, fontWeight: 400 }}>
          <Shield size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
          입찰가 뒤 2자리 비공개 · 이름 절대 비공개 · <strong style={{ fontWeight: 800 }}>같은 마스킹 범위({String(maskedBase(a.currentBid))}xx만원) 이상이면 입찰 가능</strong>
        </div>

        {/* 입찰 결과 알림 */}
        {bidResult && (
          <div style={{ background: "#E8F8EF", border: "1px solid #B8DFC8", borderRadius: "10px", padding: "12px 16px", marginBottom: "12px", fontSize: "14px", fontWeight: 700, color: "#2D8A52", textAlign: "center" }}>
            ✅ {bidResult}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <input type="number" placeholder={`${String(maskedBase(a.currentBid))}xx만원 이상 입력`} value={myBid} onChange={e => setMyBid(e.target.value)}
            style={{ flex: 1, border: "1.5px solid #E0DDD7", borderRadius: "10px", padding: "13px 14px", fontSize: "15px", fontFamily: "'NanumSquareRound',sans-serif", outline: "none" }} />
          <button onClick={handleBid} disabled={bidding} style={{ background: bidding ? "#E0DDD7" : "#FF3B1E", color: bidding ? "#AAA" : "white", border: "none", padding: "13px 24px", borderRadius: "10px", fontSize: "15px", fontWeight: 800, cursor: bidding ? "default" : "pointer", flexShrink: 0, display: "flex", alignItems: "center", gap: "6px" }}>
            <ChevronUp size={16} /> 입찰
          </button>
        </div>
      </div>
    </div>
  );
}

function AuctionContent() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button,input{font-family:'NanumSquareRound',sans-serif;} input:focus{border-color:#FF3B1E!important;}`}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />
        <div style={{ background: "#1A1A1A", padding: "44px 52px 36px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "#FF7A63", marginBottom: "10px" }}>PUBLIC AUCTION</div>
            <h1 style={{ fontSize: "clamp(22px,4vw,40px)", fontWeight: 800, color: "white", letterSpacing: "-1px", marginBottom: "6px" }}>내 차 팔기 공개 경매</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>말도 안 되는 비공개 견적은 이제 그만 · 투명한 공개 경매로</p>
          </div>
        </div>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 32px 80px" }}>
          <div style={{ background: "#FFF8EC", border: "1px solid #FFD89A", borderRadius: "14px", padding: "16px 20px", marginBottom: "20px", fontSize: "13px", color: "#7A5500", lineHeight: 1.8, fontWeight: 400 }}>
            <strong style={{ fontWeight: 800 }}>📌 경매 안내</strong><br />
            • 하자·누락 감가는 필수 반영 (허위 등록 시 즉시 취소)<br />
            • 입찰가 뒤 2자리 숨김: <strong style={{ fontWeight: 800 }}>ex) 19xx만원</strong><br />
            • <strong style={{ fontWeight: 800 }}>같은 마스킹 범위면 입찰 가능</strong> (실제 높은지 낮은지는 본인만 앎)<br />
            • 입찰자 수만 표시 · 순위·이름 절대 비공개<br />
            • 경매 종료 후 최고가 낙찰자에게 딜러 직접 연락
          </div>
          {MOCK_AUCTIONS.map(a => <AuctionCard key={a.id} a={a} />)}
        </div>
      </div>
    </>
  );
}

export default function AuctionPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F0EEE9", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAA" }}>로딩 중...</div>}><AuctionContent /></Suspense>;
}
