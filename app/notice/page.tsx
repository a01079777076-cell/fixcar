"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Pin, ChevronDown, ChevronUp, Megaphone } from "lucide-react";

interface NoticeItem { id: number; title: string; content: string; pinned: boolean; createdAt: string }

export default function NoticePage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/notice").then(r => r.json()).then(d => {
      setNotices(Array.isArray(d) ? d : d.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => { const dt = new Date(d); return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`; };

  /* 샘플 (DB 연동 전) */
  const sampleNotices: NoticeItem[] = notices.length > 0 ? [] : [
    { id: 1, title: "📢 픽스카 서비스 오픈 안내", content: "안녕하세요, 픽스카입니다.\n\n광주 지역 중고차 정찰제 플랫폼 '픽스카'가 정식 오픈하였습니다.\n\n✅ 정찰가(FIX) 제도로 가격 흥정 없이 투명한 거래\n✅ 허위매물 ZERO를 위한 다중 검증 시스템\n✅ 광주/전남 딜러 직접 방문 확인\n\n많은 이용 부탁드립니다!", pinned: true, createdAt: "2026-03-20T00:00:00Z" },
    { id: 2, title: "딜러 회원 모집 안내 (6개월 무료)", content: "픽스카에서 광주 지역 딜러 회원을 모집합니다.\n\n📌 모집 조건:\n- 광주/전남 소재 중고차 매매상사\n- 사업자등록증 + 종사원증 보유\n\n📌 혜택:\n- 6개월 등록비 무료\n- 프리미엄 슬롯 3개 무료 제공\n- 20개 딜러 한정 선착순\n\n신청: fixcar.kr/dealer/apply", pinned: true, createdAt: "2026-03-18T00:00:00Z" },
    { id: 3, title: "개인정보처리방침 업데이트 안내", content: "2026년 3월 25일부로 개인정보처리방침이 업데이트됩니다.\n\n주요 변경사항:\n- 수집 항목 명확화\n- 보관 기간 구체화\n\n자세한 내용은 개인정보처리방침 페이지를 확인해주세요.", pinned: false, createdAt: "2026-03-15T00:00:00Z" },
    { id: 4, title: "시스템 점검 안내 (3/28 새벽)", content: "서비스 안정화를 위한 시스템 점검이 예정되어 있습니다.\n\n📅 일시: 2026년 3월 28일(토) 02:00 ~ 06:00\n⏱️ 소요시간: 약 4시간\n\n점검 시간 동안 서비스 이용이 제한될 수 있습니다.\n이용에 불편을 드려 죄송합니다.", pinned: false, createdAt: "2026-03-25T00:00:00Z" },
  ];

  const displayNotices = notices.length > 0 ? notices : sampleNotices;
  const pinned = displayNotices.filter(n => n.pinned);
  const normal = displayNotices.filter(n => !n.pinned).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "40px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, fontFamily: "'Bebas Neue',serif", fontSize: "clamp(80px,15vw,150px)", color: "rgba(255,255,255,0.05)", lineHeight: 1 }}>NOTICE</div>
          <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <Megaphone size={32} color="#FF3B1E" style={{ marginBottom: 12 }} />
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 6 }}>공지사항</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>픽스카의 중요한 소식을 확인하세요</p>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 100px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#CCC" }}>로딩 중...</div>
          ) : (
            <div style={{ background: "white", borderRadius: 18, overflow: "hidden", border: "1px solid #E8E6E1" }}>
              {/* 고정 공지 */}
              {pinned.map(n => (
                <div key={n.id}>
                  <button onClick={() => setOpenId(openId === n.id ? null : n.id)} style={{ width: "100%", padding: "18px 20px", border: "none", borderBottom: "1px solid #F0EEE9", background: "#FFFCF0", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left", fontFamily: "'NanumSquareRound',sans-serif" }}>
                    <Pin size={14} color="#E8A020" />
                    <span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: "#1A1A1A" }}>{n.title}</span>
                    <span style={{ fontSize: 12, color: "#CCC", marginRight: 8 }}>{formatDate(n.createdAt)}</span>
                    {openId === n.id ? <ChevronUp size={16} color="#AAA" /> : <ChevronDown size={16} color="#AAA" />}
                  </button>
                  {openId === n.id && (
                    <div style={{ padding: "20px 24px 20px 46px", background: "#FAFAF8", fontSize: 14, lineHeight: 1.8, color: "#555", whiteSpace: "pre-line", borderBottom: "1px solid #F0EEE9" }}>{n.content}</div>
                  )}
                </div>
              ))}
              {/* 일반 공지 */}
              {normal.map(n => (
                <div key={n.id}>
                  <button onClick={() => setOpenId(openId === n.id ? null : n.id)} style={{ width: "100%", padding: "16px 20px", border: "none", borderBottom: "1px solid #F0EEE9", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left", fontFamily: "'NanumSquareRound',sans-serif" }}>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#333" }}>{n.title}</span>
                    <span style={{ fontSize: 12, color: "#CCC", marginRight: 8 }}>{formatDate(n.createdAt)}</span>
                    {openId === n.id ? <ChevronUp size={16} color="#AAA" /> : <ChevronDown size={16} color="#AAA" />}
                  </button>
                  {openId === n.id && (
                    <div style={{ padding: "20px 24px", background: "#FAFAF8", fontSize: 14, lineHeight: 1.8, color: "#555", whiteSpace: "pre-line", borderBottom: "1px solid #F0EEE9" }}>{n.content}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
