"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Gavel, Bell, Clock, Shield, Eye, TrendingUp } from "lucide-react";

export default function AuctionPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.includes("@")) { alert("이메일을 입력해주세요"); return; }
    setSubscribed(true);
    setEmail("");
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{outline:none;border-color:#E8A020!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"linear-gradient(135deg,#1A1A1A 0%,#2D1B00 50%,#1A1A1A 100%)",padding:"80px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",left:-20,bottom:-30,fontFamily:"'Bebas Neue',serif",fontSize:"clamp(100px,20vw,200px)",color:"rgba(255,255,255,0.04)",lineHeight:1}}>AUCTION</div>
          <div style={{position:"relative",zIndex:1}}>
            <Gavel size={48} color="#E8A020" style={{marginBottom:16}}/>
            <h1 style={{fontSize:"clamp(28px,5vw,44px)",fontWeight:800,color:"white",marginBottom:12}}>공개 경매</h1>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.5)",fontWeight:400,lineHeight:1.8}}>직접 검수한 차량을 경매로!<br/>뒷자리 숨김 입찰 시스템</p>
            <div style={{display:"inline-block",background:"rgba(232,160,32,0.2)",color:"#E8A020",padding:"8px 20px",borderRadius:100,fontSize:13,fontWeight:800,marginTop:20}}>
              <Clock size={14} style={{verticalAlign:"middle",marginRight:6}}/>COMING SOON
            </div>
          </div>
        </div>

        <div style={{maxWidth:700,margin:"0 auto",padding:"32px 24px 80px"}}>
          {/* 기능 미리보기 */}
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:16}}>이런 경매가 준비 중이에요</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:32}}>
            {[
              {icon:Eye, title:"뒷자리 숨김 입찰",desc:"다른 입찰자의 금액을 볼 수 없어요",color:"#E8A020"},
              {icon:Shield, title:"100항목 검수 완료",desc:"경매 차량은 전부 검수 통과",color:"#2D8A52"},
              {icon:TrendingUp, title:"실시간 입찰",desc:"마감까지 실시간 경쟁",color:"#FF3B1E"},
              {icon:Bell, title:"카톡 알림",desc:"입찰 현황을 카카오톡으로 안내",color:"#1847FF"},
            ].map(f=>{
              const Icon = f.icon;
              return (
                <div key={f.title} style={{background:"white",borderRadius:16,padding:"24px 20px"}}>
                  <Icon size={24} color={f.color} style={{marginBottom:10}}/>
                  <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>{f.title}</div>
                  <div style={{fontSize:12,color:"#AAA",fontWeight:400}}>{f.desc}</div>
                </div>
              );
            })}
          </div>

          {/* 알림 신청 */}
          <div style={{background:"white",borderRadius:20,padding:"32px 28px",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🔔</div>
            <h3 style={{fontSize:18,fontWeight:800,marginBottom:6}}>오픈 알림 받기</h3>
            <p style={{fontSize:13,color:"#AAA",marginBottom:20}}>경매 서비스가 오픈되면 가장 먼저 알려드려요</p>
            {subscribed?(
              <div style={{background:"#EAF6EF",borderRadius:12,padding:"16px",fontSize:14,fontWeight:700,color:"#2D8A52"}}>✅ 알림 신청 완료! 오픈되면 바로 연락드릴게요.</div>
            ):(
              <div style={{display:"flex",gap:8}}>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일 입력" type="email" style={{flex:1,padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                <button onClick={handleSubscribe} style={{padding:"14px 24px",background:"#E8A020",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,whiteSpace:"nowrap",fontFamily:"'NanumSquareRound',sans-serif"}}>신청</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
