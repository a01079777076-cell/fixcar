"use client";
import Navbar from "@/components/Navbar";
import { MapPin, Phone, Star, Car, ArrowRight } from "lucide-react";

const COMPLEXES = [
  { name:"광주 서부 자동차매매단지", address:"광주광역시 서구 매월1로 62번길", desc:"광주 최대 중고차 매매단지. 60여개 매매상사 밀집.", count:65, region:"서구" },
  { name:"광주 동부 오토갤러리", address:"광주광역시 동구 동문대로", desc:"수입차 및 프리미엄 중고차 전문 단지.", count:28, region:"동구" },
  { name:"광주 북구 자동차타운", address:"광주광역시 북구 동문대로 일대", desc:"국산차 전문 매매상사 단지.", count:40, region:"북구" },
];

const DEALERS = [
  { name:"아이비원모터스", complex:"광주 서부 자동차매매단지", phone:"062-671-4005", address:"광주 서구 회재유통길 78, B동 219호", brands:["현대","기아","제네시스"], rating:4.8, deals:124, badge:"FIX인증" },
  { name:"광주모터스", complex:"광주 서부 자동차매매단지", phone:"062-000-0000", address:"광주 서구 일대", brands:["BMW","벤츠","아우디"], rating:4.6, deals:89, badge:"수입차전문" },
  { name:"골든카", complex:"광주 동부 오토갤러리", phone:"062-000-0001", address:"광주 동구 일대", brands:["현대","기아","쉐보레"], rating:4.5, deals:67, badge:"" },
  { name:"드림카센터", complex:"광주 북구 자동차타운", phone:"062-000-0002", address:"광주 북구 일대", brands:["기아","제네시스","KG모빌리티"], rating:4.7, deals:103, badge:"FIX인증" },
];

export default function MarketplacePage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} .dcard{background:white;border-radius:18px;padding:20px 22px;transition:all 0.2s;} .dcard:hover{box-shadow:0 6px 20px rgba(0,0,0,0.08);}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>MARKETPLACE</div>
            <h1 style={{fontSize:"clamp(22px,4vw,40px)",fontWeight:800,color:"white",letterSpacing:"-1px",marginBottom:"6px"}}>매매단지 안내</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",fontWeight:400}}>광주 중고차 매매단지 소개 · 픽스카 제휴 딜러 목록</p>
          </div>
        </div>

        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"28px 32px 80px"}}>
          {/* 매매단지 */}
          <div style={{marginBottom:"40px"}}>
            <h2 style={{fontSize:"22px",fontWeight:800,marginBottom:"16px"}}>광주 주요 매매단지</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"14px"}}>
              {COMPLEXES.map(c=>(
                <div key={c.name} style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:"12px",marginBottom:"12px"}}>
                    <div style={{width:"44px",height:"44px",background:"#FFF0ED",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <MapPin size={20} color="#FF3B1E"/>
                    </div>
                    <div>
                      <div style={{fontSize:"16px",fontWeight:800,marginBottom:"2px"}}>{c.name}</div>
                      <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{c.address}</div>
                    </div>
                  </div>
                  <div style={{fontSize:"13px",color:"#555",lineHeight:1.65,marginBottom:"12px",fontWeight:400}}>{c.desc}</div>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <span style={{background:"#EEF2FF",color:"#1847FF",padding:"3px 10px",borderRadius:"100px",fontSize:"12px",fontWeight:800}}>{c.region}</span>
                    <span style={{fontSize:"12px",color:"#888",fontWeight:400}}>매매상사 약 {c.count}개</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 딜러 목록 */}
          <div>
            <h2 style={{fontSize:"22px",fontWeight:800,marginBottom:"16px"}}>픽스카 제휴 딜러</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"14px"}}>
              {DEALERS.map(d=>(
                <div key={d.name} className="dcard">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px"}}>
                    <div style={{width:"44px",height:"44px",background:"#F0F6FF",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"16px",fontWeight:800,color:"#0066FF"}}>
                      {d.name[0]}
                    </div>
                    {d.badge && <span style={{background:d.badge==="FIX인증"?"#FFF0ED":"#EEF2FF",color:d.badge==="FIX인증"?"#FF3B1E":"#1847FF",padding:"3px 10px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>{d.badge}</span>}
                  </div>
                  <div style={{fontSize:"17px",fontWeight:800,marginBottom:"4px"}}>{d.name}</div>
                  <div style={{fontSize:"12px",color:"#AAA",marginBottom:"10px",fontWeight:400}}>{d.complex}</div>
                  <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
                    {d.brands.map(b=><span key={b} style={{background:"#F0EEE9",color:"#555",padding:"2px 8px",borderRadius:"6px",fontSize:"11px",fontWeight:700}}>{b}</span>)}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"10px",borderTop:"1px solid #F0EEE9"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                      <Star size={13} fill="#FF3B1E" color="#FF3B1E"/>
                      <span style={{fontSize:"13px",fontWeight:800}}>{d.rating}</span>
                      <span style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>· {d.deals}건</span>
                    </div>
                    <a href={`tel:${d.phone}`}>
                      <button style={{background:"#FF3B1E",color:"white",border:"none",padding:"7px 14px",borderRadius:"8px",fontSize:"12px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"}}>
                        <Phone size={12}/> 연락
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
