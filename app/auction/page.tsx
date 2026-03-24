"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Gavel, Bell, CheckCircle } from "lucide-react";

export default function AuctionPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if(!email.includes("@")){alert("이메일을 정확히 입력해주세요");return;}
    setSubscribed(true);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{maxWidth:500,textAlign:"center"}}>
          <div style={{background:"linear-gradient(135deg,#E8A020,#B8860B)",borderRadius:28,padding:"48px 32px",color:"white",marginBottom:24,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-20,bottom:-30,fontFamily:"'Bebas Neue',serif",fontSize:140,color:"rgba(255,255,255,0.1)",lineHeight:1}}>BID</div>
            <Gavel size={48} style={{marginBottom:16,opacity:0.9}}/>
            <h1 style={{fontSize:32,fontWeight:800,marginBottom:8}}>공개 경매</h1>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.8)",lineHeight:1.8}}>실시간 역경매로 최저가 확보!<br/>곧 오픈됩니다</p>
            <div style={{fontFamily:"'Bebas Neue',serif",fontSize:48,letterSpacing:4,marginTop:20,color:"rgba(255,255,255,0.9)"}}>COMING SOON</div>
          </div>

          {subscribed?(
            <div style={{background:"white",borderRadius:18,padding:"32px 24px"}}>
              <CheckCircle size={40} color="#2D8A52" style={{marginBottom:12}}/>
              <h3 style={{fontSize:18,fontWeight:800,marginBottom:6}}>알림 신청 완료!</h3>
              <p style={{fontSize:13,color:"#AAA"}}>오픈되면 가장 먼저 알려드릴게요</p>
            </div>
          ):(
            <div style={{background:"white",borderRadius:18,padding:"28px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginBottom:16}}>
                <Bell size={18} color="#E8A020"/><span style={{fontSize:16,fontWeight:800}}>오픈 알림 받기</span>
              </div>
              <div style={{display:"flex",gap:8}}>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일 주소" type="email" style={{flex:1,padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                <button onClick={handleSubscribe} style={{padding:"14px 24px",background:"#E8A020",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'NanumSquareRound',sans-serif"}}>신청</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
