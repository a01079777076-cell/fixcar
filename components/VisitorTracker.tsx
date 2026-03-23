"use client";
import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    /* 하루에 한 번만 기록 */
    const today = new Date().toISOString().slice(0, 10);
    const lastVisit = sessionStorage.getItem("fixcar_visit");
    if (lastVisit === today) return;

    fetch("/api/stats/visit", { method: "POST" })
      .then(() => sessionStorage.setItem("fixcar_visit", today))
      .catch(() => {});
  }, []);

  return null;
}
