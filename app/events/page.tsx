"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Calendar, Clock, Gift } from "lucide-react";

interface EventItem { id: number; title: string; content: string; image?: string; startDate: string; endDate: string; active: boolean }

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [tab, setTab] = useState<"진행중" | "종료">("진행중");

  useEffect(() => {
    fetch("/api/events").then(r => r.json()).then(d => {
      setEvents(Array.isArray(d) ? d : d.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const now = new Date();
  const ongoing = events.filter(e => new Date(e.endDate) >= now);
  const ended = events.filter(e => new Date(e.endDate) < now);
  const filtered = tab === "진행중" ? ongoing : ended;

  const formatDate = (d: string) => { const dt = new Date(d); return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`; };
  const daysLeft = (end: string) => { const diff = Math.ceil((new Date(end).getTime() - now.getTime()) / 86400000); return diff > 0 ? `D-${diff}` : "마감"; };

  /* 샘플 데이터 (DB 연동 전) */
  const sampleEvents: EventItem[] = events.length > 0 ? [] : [
    { id: 1, title: "🎉 픽스카 오픈 기념 이벤트", content: "픽스카 오픈을 기념하여 첫 매물 등록 딜러에게 프리미엄 슬롯 3개월 무료 제공!\n\n참여 방법:\n1. 딜러 회원가입\n2. 매물 1대 이상 등록\n3. 자동 프리미엄 슬롯 적용", image: "", startDate: "2026-03-01", endDate: "2026-06-30", active: true },
    { id: 2, title: "🚗 중고차 시승 후기 이벤트", content: "픽스카를 통해 차량 구매 후 시승 후기를 커뮤니티에 작성해주세요!\n\n추첨을 통해 주유 상품권 5만원권을 드립니다.\n\n참여 조건: 픽스카 거래 완료 회원", image: "", startDate: "2026-04-01", endDate: "2026-05-31", active: true },
    { id: 3, title: "📱 앱 설치 이벤트 (예정)", content: "픽스카 앱 출시 기념 이벤트를 준비 중입니다.\n자세한 내용은 추후 공지됩니다.", image: "", startDate: "2026-07-01", endDate: "2026-08-31", active: false },
  ];

  const displayEvents = events.length > 0 ? filtered : sampleEvents.filter(e => tab === "진행중" ? new Date(e.endDate) >= now : new Date(e.endDate) < now);

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "linear-gradient(135deg,#FF3B1E,#CC2200)", padding: "40px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, fontFamily: "'Bebas Neue',serif", fontSize: "clamp(80px,15vw,150px)", color: "rgba(255,255,255,0.1)", lineHeight: 1 }}>EVENT</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <Gift size={36} color="white" style={{ marginBottom: 12 }} />
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 6 }}>이벤트</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>픽스카의 다양한 이벤트에 참여하세요!</p>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 100px" }}>
          <div style={{ display: "flex", gap: 0, background: "white", borderRadius: 10, overflow: "hidden", border: "1.5px solid #E0DDD7", marginBottom: 20 }}>
            {(["진행중", "종료"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "12px", border: "none", fontSize: 14, fontWeight: tab === t ? 800 : 500, background: tab === t ? "#FF3B1E" : "white", color: tab === t ? "white" : "#888", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>
                {t === "진행중" ? `진행중 (${events.length > 0 ? ongoing.length : sampleEvents.filter(e => new Date(e.endDate) >= now).length})` : `종료 (${events.length > 0 ? ended.length : 0})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#CCC" }}>로딩 중...</div>
          ) : displayEvents.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#CCC" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎁</div>
              <p style={{ fontSize: 16, fontWeight: 700 }}>{tab === "진행중" ? "진행 중인 이벤트가 없어요" : "종료된 이벤트가 없어요"}</p>
            </div>
          ) : (
            displayEvents.map(evt => (
              <div key={evt.id} onClick={() => setSelected(selected?.id === evt.id ? null : evt)} style={{ background: "white", borderRadius: 18, padding: "24px", marginBottom: 12, cursor: "pointer", border: selected?.id === evt.id ? "2px solid #FF3B1E" : "1px solid #E8E6E1", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, flex: 1 }}>{evt.title}</h3>
                  <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: new Date(evt.endDate) >= now ? "#FFF0ED" : "#F0EEE9", color: new Date(evt.endDate) >= now ? "#FF3B1E" : "#AAA", whiteSpace: "nowrap", marginLeft: 12 }}>
                    {daysLeft(evt.endDate)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#AAA" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {formatDate(evt.startDate)} ~ {formatDate(evt.endDate)}</span>
                </div>
                {selected?.id === evt.id && (
                  <div style={{ marginTop: 16, padding: "20px", background: "#F8F7F4", borderRadius: 14, fontSize: 14, lineHeight: 1.8, color: "#555", whiteSpace: "pre-line" }}>
                    {evt.content}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
