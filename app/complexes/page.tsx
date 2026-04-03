// 📁 저장 경로: app/complexes/page.tsx
"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { MapPin, Car, Users, Phone } from "lucide-react";

const COMPLEXES = [
  {
    name: "광주 서부 자동차매매단지",
    alias: "서부 매매단지",
    addr: "광주 서구 회재유통길 78",
    phone: "062-380-8000",
    shops: "약 200개 상사",
    cars: "약 3,000~5,000대",
    desc: "광주 최대 규모의 중고차 매매단지. 국산/수입 다양한 매물 보유.",
    features: ["대규모 매물","성능점검장 인접","금융사 상주"],
  },
  {
    name: "광주 첨단 자동차매매단지",
    alias: "첨단 매매단지",
    addr: "광주 광산구 첨단중앙로",
    phone: "062-970-0000",
    shops: "약 80개 상사",
    cars: "약 1,000~2,000대",
    desc: "첨단 지구 인근에 위치한 매매단지. 접근성 좋고 최신 시설.",
    features: ["접근성 좋음","주차 편리","최신 시설"],
  },
  {
    name: "광주 북구 자동차매매단지",
    alias: "북구 매매단지",
    addr: "광주 북구 본촌동 일대",
    phone: "062-000-0000",
    shops: "약 50개 상사",
    cars: "약 500~800대",
    desc: "북구 지역 중소규모 매매단지. 가성비 좋은 매물이 많음.",
    features: ["가성비 매물","소규모 운영","친절한 상담"],
  },
];

export default function ComplexesPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"linear-gradient(135deg,#1A1A1A,#333)",padding:"48px 24px",textAlign:"center"}}>
          <MapPin size={36} color="#FF3B1E" style={{marginBottom:12}}/>
          <h1 style={{fontSize:28,fontWeight:800,color:"white"}}>광주 매매단지 안내</h1>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.5)",marginTop:8}}>광주·전남 주요 중고차 매매단지 정보</p>
        </div>

        <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px 100px"}}>
          {COMPLEXES.map(c=>(
            <div key={c.name} style={{background:"white",borderRadius:18,padding:"28px 24px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div>
                  <h2 style={{fontSize:20,fontWeight:800,marginBottom:4}}>{c.name}</h2>
                  <div style={{fontSize:13,color:"#AAA"}}>{c.alias}</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  {c.features.map(f=>(
                    <span key={f} style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:100,background:"#EEF5FF",color:"#0066FF"}}>{f}</span>
                  ))}
                </div>
              </div>
              <div style={{fontSize:14,color:"#666",lineHeight:1.8,marginBottom:16}}>{c.desc}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <MapPin size={16} color="#FF3B1E"/>
                  <div><div style={{fontSize:11,color:"#AAA"}}>주소</div><div style={{fontSize:13,fontWeight:700}}>{c.addr}</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Phone size={16} color="#0066FF"/>
                  <div><div style={{fontSize:11,color:"#AAA"}}>연락처</div><div style={{fontSize:13,fontWeight:700}}>{c.phone}</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Users size={16} color="#2D8A52"/>
                  <div><div style={{fontSize:11,color:"#AAA"}}>입점 상사</div><div style={{fontSize:13,fontWeight:700}}>{c.shops}</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Car size={16} color="#E8A020"/>
                  <div><div style={{fontSize:11,color:"#AAA"}}>보유 매물</div><div style={{fontSize:13,fontWeight:700}}>{c.cars}</div></div>
                </div>
              </div>
              <Link href={`/shops?complex=${encodeURIComponent(c.alias)}`}>
                <button style={{padding:"12px 24px",background:"#EEF5FF",border:"1.5px solid #0066FF",borderRadius:10,fontSize:13,fontWeight:700,color:"#0066FF",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>이 단지 상사 목록 보기</button>
              </Link>
            </div>
          ))}

          <div style={{background:"#FFF0ED",borderRadius:14,padding:"18px 22px",marginTop:24}}>
            <div style={{fontSize:13,color:"#CC6633",lineHeight:1.8}}>
              위 정보는 참고용이며, 정확한 상사 수·매물 수는 실시간으로 변동될 수 있습니다.
              상세 정보는 각 매매단지에 직접 문의해주세요.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
