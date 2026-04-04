// 📁 저장 경로: components/CommunityReplies.tsx
"use client";
import { useState, useEffect } from "react";
import { Send, Trash2, MessageCircle } from "lucide-react";

interface Reply {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string; nickname?: string; role: string };
}

export default function CommunityReplies({ postId, currentUserId }: { postId: number; currentUserId?: number }) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchReplies = () => {
    fetch(`/api/community/${postId}/replies`).then(r => r.json()).then(d => {
      setReplies(Array.isArray(d) ? d : []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchReplies(); }, [postId]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/community/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      const d = await res.json();
      if (d.success && d.reply) {
        setReplies(prev => [...prev, d.reply]);
        setInput("");
      } else {
        alert(d.error || "답글 작성 실패");
      }
    } catch { alert("네트워크 오류"); }
    setSending(false);
  };

  const handleDelete = async (replyId: number) => {
    if (!confirm("답글을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/community/${postId}/replies`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId }),
      });
      const d = await res.json();
      if (d.success) setReplies(prev => prev.filter(r => r.id !== replyId));
    } catch {}
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "방금";
    if (min < 60) return `${min}분 전`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}시간 전`;
    const day = Math.floor(hr / 24);
    return `${day}일 전`;
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <MessageCircle size={18} color="#FF3B1E" />
        <span style={{ fontSize: 16, fontWeight: 800 }}>답글 {replies.length}개</span>
      </div>

      {/* 답글 목록 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 20, color: "#CCC", fontSize: 13 }}>로딩 중...</div>
      ) : replies.length === 0 ? (
        <div style={{ textAlign: "center", padding: 24, color: "#CCC", fontSize: 13, background: "#F8F7F4", borderRadius: 12 }}>아직 답글이 없습니다. 첫 답글을 남겨보세요!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {replies.map(r => (
            <div key={r.id} style={{ background: "#F8F7F4", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{r.author.nickname || r.author.name}</span>
                  {r.author.role === "DEALER" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 100, background: "#EEF5FF", color: "#0066FF" }}>딜러</span>}
                  {r.author.role === "ADMIN" && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 100, background: "#FFF0ED", color: "#FF3B1E" }}>관리자</span>}
                  <span style={{ fontSize: 11, color: "#AAA" }}>{timeAgo(r.createdAt)}</span>
                </div>
                {currentUserId && (currentUserId === r.author.id) && (
                  <button onClick={() => handleDelete(r.id)} style={{ border: "none", background: "none", cursor: "pointer", color: "#CCC", padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: 14, color: "#444", lineHeight: 1.7, whiteSpace: "pre-line" }}>{r.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* 답글 입력 */}
      {currentUserId ? (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="답글을 입력하세요..."
            maxLength={1000}
            style={{ flex: 1, padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif", outline: "none" }}
          />
          <button onClick={handleSend} disabled={sending || !input.trim()} style={{
            width: 44, height: 44, borderRadius: 12, background: input.trim() ? "#FF3B1E" : "#E0DDD7",
            color: "white", border: "none", cursor: input.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Send size={16} />
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "14px", background: "#F8F7F4", borderRadius: 12, fontSize: 13, color: "#AAA" }}>
          답글을 작성하려면 <a href="/login" style={{ color: "#FF3B1E", fontWeight: 700 }}>로그인</a>해주세요.
        </div>
      )}
    </div>
  );
}
