"use client";
import Navbar from "@/components/Navbar";
import { Megaphone, ChevronRight } from "lucide-react";
import { useState } from "react";

const NOTICES = [
  { id:5, title:"[필독] Railway DB 정기점검 안내 (3/25 02:00~04:00)", date:"2026.03.19", important:true, content:"서버 정기점검으로 해당 시간대 서비스 이용이 일시 중단돼요. 이용에 불편을 드려 죄송합니다." },
  { id:4, title:"[업데이트] 딜러 매물 등록 폼 개편 안내", date:"2026.03.17", important:false, content:"딜러 매물 등록 화면이 8단계 스텝 방식으로 개편됐어요. 사진 업로드 최대 30장, 옵션 선택 기능이 추가됐습니다." },
  { id:3, title:"[이벤트] 봄맞이 특가전 진행 안내", date:"2026.03.15", important:false, content:"3월 한 달간 선착순 특가 매물을 준비했어요. 자세한 내용은 이벤트 페이지를 확인해주세요." },
  { id:2, title:"[안내] 개인정보처리방침 개정 안내", date:"2026.03.10", important:true, content:"2026년 3월 10일부로 개인정보처리방침이 일부 개정됐어요. 주요 변경 사항은 제3자 제공 범위 조정입니다." },
  { id:1, title:"픽스카 서비스 오픈 안내", date:"2026.03.01", important:false, content:"광주 1위 중고차 정찰제 플랫폼 픽스카가 오픈했어요! 많은 이용 부탁드립니다." },
];

export default function NoticePage() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} .nrow{background:white;border-radius:14px;overflow:hidden;transition:box-shadow 0.15s;} .nrow:hover{box-shadow:0 4px 16px rgba(0,0,0,0.07);}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"800px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>NOTICE</div>
            <h1 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:800,color:"white",letterSpacing:"-1px"}}>공지사항</h1>
          </div>
        </div>
        <div style={{maxWidth:"800px",margin:"0 auto",padding:"24px 32px 80px",display:"flex",flexDirection:"column",gap:"8px"}}>
          {NOTICES.map(n=>(
            <div key={n.id} className="nrow">
              <button onClick={()=>setOpen(open===n.id?null:n.id)} style={{width:"100%",background:"none",border:"none",padding:"18px 20px",display:"flex",alignItems:"center",gap:"12px",cursor:"pointer",textAlign:"left"}}>
                {n.important && <Megaphone size={16} color="#FF3B1E" style={{flexShrink:0}}/>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"3px"}}>
                    {n.important && <span style={{background:"#FFF0ED",color:"#FF3B1E",padding:"2px 8px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>중요</span>}
                    <span style={{fontSize:"15px",fontWeight:800,color:"#1A1A1A"}}>{n.title}</span>
                  </div>
                  <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{n.date}</div>
                </div>
                <ChevronRight size={16} color="#CCC" style={{flexShrink:0,transform:open===n.id?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
              </button>
              {open===n.id && (
                <div style={{padding:"0 20px 18px",borderTop:"1px solid #F0EEE9"}}>
                  <p style={{fontSize:"14px",color:"#555",lineHeight:1.8,fontWeight:400,marginTop:"14px"}}>{n.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
