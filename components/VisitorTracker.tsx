"use client";
import { useEffect } from "react";

/* 하트비트 간격 — 서버 '접속 중' 판정(5분)보다 짧게 */
const HEARTBEAT_MS = 2 * 60 * 1000;

/** 브라우저별 익명 세션 ID (개인정보 아님, 접속자 수 집계용) */
function getSid(): string {
  try {
    let sid = localStorage.getItem("fixcar_sid");
    if (!sid) {
      sid = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem("fixcar_sid", sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export default function VisitorTracker() {
  /* 1) 일일 방문 기록 — 하루에 한 번만 */
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    try { if (sessionStorage.getItem("fixcar_visit") === today) return; } catch {}

    fetch("/api/stats/visit", { method: "POST" })
      .then(() => { try { sessionStorage.setItem("fixcar_visit", today); } catch {} })
      .catch(() => {});
  }, []);

  /* 2) 실시간 접속자 하트비트 — 탭이 보일 때만 */
  useEffect(() => {
    const sid = getSid();
    if (!sid) return;

    const beat = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/stats/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid }),
        keepalive: true,
      }).catch(() => {});
    };

    beat();
    const timer = setInterval(beat, HEARTBEAT_MS);
    const onVisible = () => { if (document.visibilityState === "visible") beat(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, []);

  return null;
}
