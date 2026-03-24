"use client";
import { Share2, Link as LinkIcon, MessageCircle } from "lucide-react";
import { useState } from "react";

interface Props { title: string; description?: string; url?: string; imageUrl?: string; }

export default function ShareButtons({ title, description, url, imageUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "https://www.fixcar.kr");

  const handleKakaoShare = () => {
    if (typeof window !== "undefined" && (window as any).Kakao?.Share) {
      (window as any).Kakao.Share.sendDefault({
        objectType: "feed",
        content: { title, description: description || "픽스카에서 확인하세요!", imageUrl: imageUrl || "https://www.fixcar.kr/og-image.png", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
        buttons: [{ title: "자세히 보기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
      });
    } else { alert("카카오톡 공유는 모바일에서 이용 가능합니다"); }
  };

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { alert("링크 복사에 실패했어요"); }
  };

  const handleNativeShare = () => {
    if (navigator.share) { navigator.share({ title, text: description, url: shareUrl }).catch(() => {}); }
    else handleCopyLink();
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={handleKakaoShare} style={{ padding: "8px 14px", background: "#FEE500", color: "#3C1E1E", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif" }}>
        <MessageCircle size={14} /> 카카오 공유
      </button>
      <button onClick={handleCopyLink} style={{ padding: "8px 14px", background: "#F0EEE9", color: "#888", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif" }}>
        <LinkIcon size={14} /> {copied ? "✓ 복사됨!" : "링크 복사"}
      </button>
      <button onClick={handleNativeShare} style={{ padding: "8px", background: "#F0EEE9", color: "#888", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center" }}>
        <Share2 size={14} />
      </button>
    </div>
  );
}
