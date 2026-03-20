"use client";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { Send, ChevronLeft } from "lucide-react";
import Link from "next/link";

function InquiryForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const carId = searchParams.get("carId") || "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [car, setCar] = useState<{name?:string; price?:number; brand?:string; year?:number} | null>(null);

  useEffect(() => {
    if (carId) {
      fetch(`/api/cars/${carId}`).then(r=>r.json()).then(d=>setCar(d)).catch(()=>{});
    }
    /* 로그인 정보 자동 채움 */
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if (d?.user?.name) setName(d.user.name);
      if (d?.user?.phone) setPhone(d.user.phone);
    }).catch(()=>{});
  }, [carId]);

  const handleSubmit = async () => {
    if (!message.trim()) { alert("문의 내용을 입력해주세요."); return; }
    setSending(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: Number(carId), name, phone, message }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const err = await res.json().catch(()=>({}));
        alert("문의 실패: " + (err.error || "다시 시도해주세요"));
      }
    } catch { alert("네트워크 오류"); }
    setSending(false);
  };

  if (sent) return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ fontSize:60, marginBottom:20 }}>✅</div>
      <h2 style={{ fontSize:24, fontWeight:800, marginBottom:10 }}>문의가 접수됐어요!</h2>
      <p style={{ fontSize:15, color:"#888", fontWeight:400, lineHeight:1.8, marginBottom:28 }}>담당 딜러가 빠르게 연락드릴게요.<br/>마이페이지에서 문의 내역을 확인하실 수 있어요.</p>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <Link href={`/cars/${carId}`}><button style={{ padding:"14px 28px", background:"#FF3B1E", color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:800, cursor:"pointer" }}>차량으로 돌아가기</button></Link>
        <Link href="/mypage#inquiries"><button style={{ padding:"14px 28px", background:"#F0EEE9", color:"#555", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer" }}>내 문의 확인</button></Link>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:600, margin:"0 auto" }}>
      {/* 차량 정보 요약 */}
      {car && (
        <div style={{ background:"white", borderRadius:16, padding:"18px 22px", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:"#F0EEE9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🚗</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800 }}>{car.name}</div>
            <div style={{ fontSize:13, color:"#888", fontWeight:400 }}>{car.brand} · {car.year}년식 · {car.price?.toLocaleString()}만원</div>
          </div>
        </div>
      )}

      {/* 문의 폼 */}
      <div style={{ background:"white", borderRadius:20, padding:"28px 26px" }}>
        <h2 style={{ fontSize:20, fontWeight:800, marginBottom:4 }}>차량 문의하기</h2>
        <p style={{ fontSize:13, color:"#AAA", fontWeight:400, marginBottom:24 }}>궁금한 점을 남겨주시면 딜러가 직접 연락드려요</p>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:700, display:"block", marginBottom:6 }}>이름</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="홍길동"
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #E0DDD7", borderRadius:10, fontSize:15, fontFamily:"'NanumSquareRound',sans-serif" }} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:700, display:"block", marginBottom:6 }}>연락처</label>
            <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="010-1234-5678"
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #E0DDD7", borderRadius:10, fontSize:15, fontFamily:"'NanumSquareRound',sans-serif" }} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:700, display:"block", marginBottom:6 }}>문의 내용 <span style={{ color:"#FF3B1E" }}>*</span></label>
            <textarea rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder="궁금한 점을 자유롭게 적어주세요. (차량 상태, 시승 가능 여부, 추가 사진 요청 등)"
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #E0DDD7", borderRadius:10, fontSize:15, fontFamily:"'NanumSquareRound',sans-serif", resize:"none" }} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={sending} style={{
          width:"100%", padding:"16px", background:sending?"#CCC":"#FF3B1E", color:"white",
          border:"none", borderRadius:12, fontSize:16, fontWeight:800,
          cursor:sending?"wait":"pointer", marginTop:20,
          fontFamily:"'NanumSquareRound',sans-serif",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        }}>
          <Send size={16} /> {sending ? "전송 중..." : "문의 보내기"}
        </button>
      </div>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        input:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;}
      `}</style>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <div style={{ background:"#1A1A1A", padding:"36px 24px 28px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <Link href="/cars" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.4)", marginBottom:10 }}><ChevronLeft size={14}/>매물 목록</Link>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:4, color:"#FF3B1E", marginBottom:6 }}>INQUIRY</div>
            <h1 style={{ fontSize:26, fontWeight:800, color:"white" }}>차량 문의</h1>
          </div>
        </div>
        <div style={{ padding:"24px 16px 100px" }}>
          <Suspense fallback={<div style={{ textAlign:"center", padding:60, color:"#AAA" }}>로딩 중...</div>}>
            <InquiryForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
