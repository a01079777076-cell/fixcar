// 📁 저장 경로: components/ReportModal.tsx
"use client";
import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

const REPORT_CATEGORIES = [
  { value: "허위매물", label: "허위매물", desc: "실제와 다른 차량 정보" },
  { value: "허위정보", label: "허위/거짓 정보", desc: "사실이 아닌 내용 게시" },
  { value: "광고/홍보", label: "광고/홍보성 글", desc: "상업적 목적의 글" },
  { value: "욕설/비방", label: "욕설/비방", desc: "타인을 모욕하거나 비하하는 내용" },
  { value: "음란물", label: "음란/선정적 내용", desc: "부적절한 성적 내용" },
  { value: "도배/스팸", label: "도배/스팸", desc: "같은 내용 반복 게시" },
  { value: "개인정보", label: "개인정보 노출", desc: "타인의 개인정보 게시" },
  { value: "기타", label: "기타", desc: "위에 해당하지 않는 신고" },
];

interface ReportModalProps {
  postId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReportModal({ postId, onClose, onSuccess }: ReportModalProps) {
  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!category) { alert("신고 유형을 선택해주세요."); return; }
    setSending(true);
    try {
      const res = await fetch(`/api/community/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, reason: reason.trim() || undefined }),
      });
      const d = await res.json();
      if (d.success) {
        alert("신고가 접수되었습니다. 관리자 확인 후 조치하겠습니다.");
        onSuccess?.();
        onClose();
      } else {
        alert(d.error || "신고 실패");
      }
    } catch { alert("네트워크 오류"); }
    setSending(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 440, maxHeight: "80vh", overflow: "auto" }}>
        {/* 헤더 */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0EEE9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={18} color="#FF3B1E" />
            <span style={{ fontSize: 18, fontWeight: 800 }}>게시글 신고</span>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#F0EEE9", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* 카테고리 선택 */}
          <div style={{ fontSize: 13, fontWeight: 800, color: "#666", marginBottom: 10 }}>신고 유형을 선택해주세요</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
            {REPORT_CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setCategory(c.value)} style={{
                padding: "14px 16px", border: category === c.value ? "2px solid #FF3B1E" : "1.5px solid #E8E6E1",
                borderRadius: 12, background: category === c.value ? "#FFF0ED" : "white",
                textAlign: "left", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: category === c.value ? "#FF3B1E" : "#333" }}>{c.label}</div>
                <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>{c.desc}</div>
              </button>
            ))}
          </div>

          {/* 상세 사유 */}
          <div style={{ fontSize: 13, fontWeight: 800, color: "#666", marginBottom: 8 }}>상세 사유 (선택)</div>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="구체적인 신고 사유를 적어주시면 처리에 도움이 됩니다."
            maxLength={500}
            rows={3}
            style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 13, resize: "none", fontFamily: "'NanumSquareRound',sans-serif", lineHeight: 1.6, outline: "none" }}
          />
          <div style={{ fontSize: 10, color: "#CCC", textAlign: "right", marginTop: 4 }}>{reason.length}/500</div>

          {/* 제출 */}
          <button onClick={handleSubmit} disabled={sending || !category} style={{
            width: "100%", padding: "16px", marginTop: 12,
            background: category ? "#FF3B1E" : "#E0DDD7", color: "white",
            border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800,
            cursor: category ? "pointer" : "default", fontFamily: "'NanumSquareRound',sans-serif",
          }}>
            {sending ? "접수 중..." : "신고 접수"}
          </button>
          <div style={{ fontSize: 11, color: "#CCC", textAlign: "center", marginTop: 10 }}>
            허위 신고 시 클린픽스카 규정에 따라 이용이 제한될 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
