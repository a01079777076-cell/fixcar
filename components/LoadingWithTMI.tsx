"use client";
import { useState, useEffect } from "react";
import { CAR_TMI } from "@/data/tmi";

interface Props {
  message?: string;
}

/**
 * 로딩 화면 + TMI 자동 순환
 * 
 * 사용법:
 * <LoadingWithTMI message="매물을 불러오는 중..." />
 */
export default function LoadingWithTMI({ message = "로딩 중..." }: Props) {
  const [tmiIdx, setTmiIdx] = useState(Math.floor(Math.random() * CAR_TMI.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setTmiIdx(Math.floor(Math.random() * CAR_TMI.length));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: "60vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "40px 24px",
      textAlign: "center", fontFamily: "'NanumSquareRound',sans-serif",
    }}>
      {/* 스피너 */}
      <div style={{
        width: 48, height: 48, border: "4px solid #E8E6E1",
        borderTop: "4px solid #FF3B1E", borderRadius: "50%",
        animation: "spin 0.8s linear infinite", marginBottom: 20,
      }} />

      {/* 메시지 */}
      <div style={{ fontSize: 16, fontWeight: 700, color: "#555", marginBottom: 24 }}>
        {message}
      </div>

      {/* TMI */}
      <div style={{
        maxWidth: 400, background: "white", borderRadius: 16,
        padding: "18px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#FF3B1E", letterSpacing: 2, marginBottom: 8 }}>
          💡 자동차 TMI
        </div>
        <p style={{
          fontSize: 14, color: "#555", fontWeight: 400, lineHeight: 1.7,
          transition: "opacity 0.3s",
        }}>
          {CAR_TMI[tmiIdx]}
        </p>
      </div>

      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
