"use client";
import Navbar from "@/components/Navbar";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <div style={{ maxWidth:600, margin:"0 auto", padding:"40px 24px 100px" }}>
          <h1 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>🔔 알림</h1>
          <p style={{ fontSize:14, color:"#AAA", marginBottom:28 }}>새로운 소식과 알림을 확인하세요</p>

          <div style={{ background:"white", borderRadius:18, padding:"48px 24px", textAlign:"center" }}>
            <Bell size={40} color="#E0DDD7" style={{ marginBottom:16 }} />
            <div style={{ fontSize:16, fontWeight:700, color:"#AAA", marginBottom:6 }}>아직 알림이 없어요</div>
            <p style={{ fontSize:13, color:"#CCC" }}>찜한 차량의 가격 변동, 문의 답변 등<br/>중요한 소식이 여기에 표시됩니다</p>
          </div>
        </div>
      </div>
    </>
  );
}
