"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Heart, MessageCircle, ChevronRight, Plus, Star } from "lucide-react";

const TABS = ["자유게시판", "차량 리뷰", "질문·답변"];

const POSTS = {
  "자유게시판": [
    { id: 1, title: "광주 북구 중고차 매매단지 솔직 후기", author: "김○○", date: "2025-03-15", likes: 24, comments: 8, tag: "정보" },
    { id: 2, title: "처음 중고차 사봤는데 생각보다 쉬웠어요!", author: "이○○", date: "2025-03-14", likes: 18, comments: 12, tag: "후기" },
    { id: 3, title: "아반떼 vs K3 어떤 게 더 괜찮을까요?", author: "박○○", date: "2025-03-13", likes: 31, comments: 22, tag: "질문" },
    { id: 4, title: "FIX 정찰가 덕분에 흥정 스트레스 없이 샀어요", author: "최○○", date: "2025-03-12", likes: 45, comments: 6, tag: "후기" },
  ],
  "차량 리뷰": [
    { id: 5, title: "현대 아반떼 CN7 1년 타본 솔직 리뷰", author: "정○○", date: "2025-03-10", likes: 67, comments: 15, tag: "아반떼", rating: 4.5 },
    { id: 6, title: "기아 K3 2020년식 — 연비 진짜 괜찮아요", author: "한○○", date: "2025-03-08", likes: 42, comments: 9, tag: "K3", rating: 4.0 },
    { id: 7, title: "아이오닉5 전기차 6개월 사용기", author: "임○○", date: "2025-03-05", likes: 89, comments: 31, tag: "전기차", rating: 5.0 },
  ],
  "질문·답변": [
    { id: 8, title: "할부 이율 어느 정도가 적당한가요?", author: "오○○", date: "2025-03-15", likes: 5, comments: 7, tag: "미해결", answered: false },
    { id: 9, title: "차량번호로 사고이력 조회하는 방법이요", author: "서○○", date: "2025-03-14", likes: 12, comments: 3, tag: "해결됨", answered: true },
    { id: 10, title: "탁송 받을 때 주의사항 알려주세요", author: "윤○○", date: "2025-03-13", likes: 8, comments: 11, tag: "해결됨", answered: true },
  ],
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab];
  const posts = POSTS[tab as keyof typeof POSTS] || [];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .post-row { background:white; transition:all 0.15s; cursor:pointer; }
        .post-row:hover { background:#FAFAF8; }
        @media(max-width:768px) { .page-wrap { padding:16px !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />

        <div style={{ background: "#1A1A1A", padding: "56px 52px 0" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "#FF7A63", marginBottom: "12px" }}>COMMUNITY</div>
            <h1 style={{ fontSize: "clamp(26px,4vw,48px)", fontWeight: 800, color: "white", letterSpacing: "-1.5px", marginBottom: "32px" }}>픽스카 커뮤니티</h1>
            <div style={{ display: "flex", gap: "0" }}>
              {TABS.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)} style={{ padding: "14px 28px", background: "transparent", border: "none", fontSize: "15px", fontWeight: activeTab === i ? 800 : 600, color: activeTab === i ? "white" : "rgba(255,255,255,0.4)", borderBottom: `3px solid ${activeTab === i ? "#FF3B1E" : "transparent"}`, cursor: "pointer", marginBottom: "-1px" }}>{tab}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="page-wrap" style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 52px 80px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <button style={{ background: "#FF3B1E", color: "white", border: "none", padding: "11px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 800, display: "flex", alignItems: "center", gap: "7px" }}>
              <Plus size={15} /> 글 쓰기
            </button>
          </div>

          <div style={{ background: "white", borderRadius: "18px", overflow: "hidden" }}>
            {posts.map((post: typeof posts[0], i) => (
              <div key={post.id} className="post-row" style={{ padding: "18px 22px", borderBottom: i < posts.length - 1 ? "1px solid #F0EEE9" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{
                        background: "tag" in post && post.tag === "해결됨" ? "#EAF6EF" : "tag" in post && post.tag === "미해결" ? "#FFF0ED" : "#EEF2FF",
                        color: "tag" in post && post.tag === "해결됨" ? "#2D8A52" : "tag" in post && post.tag === "미해결" ? "#FF3B1E" : "#1847FF",
                        padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 800
                      }}>{post.tag}</span>
                      {"rating" in post && post.rating && (
                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                          {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < Math.floor(post.rating) ? "#FF3B1E" : "none"} color="#FF3B1E" />)}
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#FF3B1E" }}>{post.rating}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px", lineHeight: 1.3 }}>{post.title}</div>
                    <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 400 }}>{post.author} · {post.date}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#AAA", fontWeight: 400 }}><Heart size={12} />{post.likes}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#AAA", fontWeight: 400 }}><MessageCircle size={12} />{post.comments}</span>
                    </div>
                    <ChevronRight size={16} color="#E0DDD7" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
