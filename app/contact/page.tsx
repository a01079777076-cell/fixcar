"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { MessageCircle, Phone, Mail, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const inputStyle: React.CSSProperties = { width: "100%", border: "1.5px solid #E0DDD7", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", outline: "none", background: "#FAFAF8", fontFamily: "'NanumSquareRound',sans-serif" };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input,textarea { font-family:'NanumSquareRound',sans-serif; }
        input:focus, textarea:focus { border-color:#FF3B1E !important; background:white !important; outline:none; }
        @media(max-width:768px) { .contact-grid { grid-template-columns:1fr !important; } .page-wrap { padding:20px !important; } }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />
        <div style={{ background: "#1A1A1A", padding: "56px 52px 48px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "#FF7A63", marginBottom: "12px" }}>CONTACT</div>
            <h1 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, color: "white", letterSpacing: "-1.5px" }}>고객센터</h1>
          </div>
        </div>

        <div className="page-wrap" style={{ maxWidth: "900px", margin: "0 auto", padding: "36px 52px 80px" }}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { icon: <MessageCircle size={22} color="white" />, title: "카카오톡 채널", desc: "@픽스카 FIXCAR", sub: "평일 09:00 ~ 18:00", color: "#FEE500", tc: "#391B1B" },
                { icon: <Phone size={22} color="white" />, title: "전화 상담", desc: "062-000-0000", sub: "평일 09:00 ~ 18:00", color: "#1847FF", tc: "white" },
                { icon: <Mail size={22} color="white" />, title: "이메일", desc: "help@fixcar.kr", sub: "24시간 접수", color: "#FF3B1E", tc: "white" },
              ].map(item => (
                <div key={item.title} style={{ background: "white", borderRadius: "18px", padding: "22px 20px" }}>
                  <div style={{ width: "44px", height: "44px", background: item.color, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>{item.icon}</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "4px" }}>{item.title}</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A1A", marginBottom: "4px" }}>{item.desc}</div>
                  <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 400 }}>{item.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "28px 32px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <CheckCircle size={52} color="#2D8A52" style={{ margin: "0 auto 16px" }} />
                  <div style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>문의가 접수됐어요!</div>
                  <p style={{ fontSize: "14px", color: "#888", fontWeight: 400 }}>영업일 기준 1~2일 내로 답변드릴게요.</p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "20px" }}>문의하기</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "6px" }}>이름</label>
                        <input style={inputStyle} type="text" placeholder="홍길동" value={form.name} onChange={e => update("name", e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "6px" }}>이메일</label>
                        <input style={inputStyle} type="email" placeholder="example@email.com" value={form.email} onChange={e => update("email", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "6px" }}>문의 유형</label>
                      <select style={inputStyle} value={form.subject} onChange={e => update("subject", e.target.value)}>
                        <option value="">선택해주세요</option>
                        {["차량 구매 문의", "환불 요청", "딜러 신청", "결제 문의", "서비스 개선 제안", "기타"].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "6px" }}>문의 내용</label>
                      <textarea style={{ ...inputStyle, resize: "none" }} rows={5} placeholder="문의 내용을 자세히 적어주세요" value={form.message} onChange={e => update("message", e.target.value)} />
                    </div>
                    <button onClick={() => setSent(true)} disabled={!form.name || !form.email || !form.message}
                      style={{ background: !form.name || !form.email || !form.message ? "#E0DDD7" : "#FF3B1E", color: !form.name || !form.email || !form.message ? "#AAA" : "white", border: "none", padding: "15px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, cursor: !form.name || !form.email || !form.message ? "default" : "pointer" }}>
                      문의 제출
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
