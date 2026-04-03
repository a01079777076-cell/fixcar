// 📁 저장 경로: app/inspection/page.tsx
"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Shield, CheckCircle, Clock, Car } from "lucide-react";

const CENTERS = [
  {name:"빛고을 (빛고을오토자동차공업사)",addr:"광주 서구",partner:true},
  {name:"서광주",addr:"광주 서구",partner:true},
  {name:"엠플러스",addr:"광주 광산구",partner:true},
  {name:"웰퓨처",addr:"광주 북구",partner:false},
  {name:"카존",addr:"광주 광산구",partner:false},
  {name:"하나카",addr:"광주 서구",partner:false},
  {name:"(주)광주성능정비",addr:"광주 서구",partner:true},
  {name:"자동차성능점검인협동조합",addr:"광주",partner:false},
  {name:"완성자동차공업사",addr:"광주",partner:false},
];

export default function InspectionPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 히어로 */}
        <div style={{background:"linear-gradient(135deg,#0A1628,#1A2A4A)",padding:"60px 24px",textAlign:"center"}}>
          <Shield size={48} color="#2D8A52" style={{marginBottom:16}}/>
          <h1 style={{fontSize:32,fontWeight:800,color:"white",marginBottom:8}}>FIXCAR 차량 검수 서비스</h1>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.6)",lineHeight:1.8}}>전문 검수원이 100개 항목을 직접 점검합니다</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:24,flexWrap:"wrap"}}>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 24px"}}>
              <div style={{fontSize:28,fontWeight:800,color:"#2D8A52"}}>100+</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>점검 항목</div>
            </div>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 24px"}}>
              <div style={{fontSize:28,fontWeight:800,color:"#E8A020"}}>15,000원</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>온라인 결제 (잔액 현장)</div>
            </div>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 24px"}}>
              <div style={{fontSize:28,fontWeight:800,color:"#0066FF"}}>60분</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>소요 시간</div>
            </div>
          </div>
        </div>

        <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px 100px"}}>
          {/* 진행 과정 */}
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>🔍 검수 진행 과정</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:40}}>
            {[
              {step:"01",icon:<Car size={24}/>,title:"검수 신청",desc:"온라인으로 15,000원 결제"},
              {step:"02",icon:<Clock size={24}/>,title:"방문 예약",desc:"원하는 검수업체 선택"},
              {step:"03",icon:<Shield size={24}/>,title:"100항목 점검",desc:"전문 검수원 직접 확인"},
              {step:"04",icon:<CheckCircle size={24}/>,title:"결과 발급",desc:"성능점검기록부 자동 연동"},
            ].map(v=>(
              <div key={v.step} style={{background:"white",borderRadius:16,padding:"24px 18px",textAlign:"center"}}>
                <div style={{fontSize:11,fontWeight:800,color:"#FF3B1E",marginBottom:8}}>STEP {v.step}</div>
                <div style={{color:"#0066FF",marginBottom:8}}>{v.icon}</div>
                <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>{v.title}</div>
                <div style={{fontSize:12,color:"#AAA"}}>{v.desc}</div>
              </div>
            ))}
          </div>

          {/* 검수 항목 */}
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>📋 주요 검수 항목</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:40}}>
            {[
              {cat:"엔진",items:"원동기, 오일 누유, 냉각수 누수, 오일량, 작동상태"},
              {cat:"변속기",items:"자동/수동 변속기, 오일 누유, 오일량, 클러치"},
              {cat:"조향장치",items:"스티어링 펌프/기어/조인트, 파워호스, 타이로드"},
              {cat:"제동장치",items:"브레이크 오일/마스터실린더/배력장치"},
              {cat:"전기장치",items:"발전기, 시동모터, 와이퍼, 윈도우모터"},
              {cat:"외판/골격",items:"1·2랭크 외판, A·B·C랭크 골격, 사고 이력"},
              {cat:"고전원(EV)",items:"충전구 절연, 축전지 격리, 고전원배선"},
              {cat:"외관/내장",items:"외장, 내장, 광택, 휠, 타이어, 유리 상태"},
              {cat:"기타",items:"배출가스, 튜닝, 침수, 주행거리 조작 여부"},
            ].map(v=>(
              <div key={v.cat} style={{background:"white",borderRadius:14,padding:"18px 16px"}}>
                <div style={{fontSize:14,fontWeight:800,color:"#0066FF",marginBottom:6}}>{v.cat}</div>
                <div style={{fontSize:12,color:"#888",lineHeight:1.8}}>{v.items}</div>
              </div>
            ))}
          </div>

          {/* 제휴 검수업체 */}
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>🏢 광주 지역 검수업체</h2>
          <div style={{marginBottom:40}}>
            {CENTERS.map(c=>(
              <div key={c.name} style={{background:"white",borderRadius:12,padding:"16px 20px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700}}>{c.name}</div>
                  <div style={{fontSize:12,color:"#AAA"}}>{c.addr}</div>
                </div>
                {c.partner&&<span style={{fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:100,background:"#EAF6EF",color:"#2D8A52"}}>FIXCAR 제휴</span>}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{background:"white",borderRadius:18,padding:"32px 24px",textAlign:"center"}}>
            <h3 style={{fontSize:20,fontWeight:800,marginBottom:8}}>중고차, 눈으로만 보지 마세요.</h3>
            <p style={{fontSize:14,color:"#AAA",marginBottom:20}}>전문 검수로 안전한 거래를 시작하세요.</p>
            <Link href="/cars">
              <button style={{padding:"16px 48px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>매물 보러가기</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
