"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<{name?:string;email?:string;role?:string}|null>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{if(d?.user)setUser(d.user);}).catch(()=>{});
  }, []);

  const MENU = [
    { section:"계정", items:[
      { label:"프로필 수정", href:"/mypage", desc:"이름, 연락처 변경" },
      { label:"알림 설정", href:"/notifications", desc:"푸시 알림, 이메일 알림" },
    ]},
    { section:"서비스", items:[
      { label:"찜 목록", href:"/mypage/favorites", desc:"관심 차량 모아보기" },
      { label:"문의 내역", href:"/mypage/inquiries", desc:"딜러 문의 확인" },
      { label:"매물 알림", href:"/mypage/alerts", desc:"조건 맞는 차량 알림" },
    ]},
    { section:"정보", items:[
      { label:"클린픽스카", href:"/clean", desc:"허위매물 신고·규정" },
      { label:"이용약관", href:"/terms", desc:"" },
      { label:"개인정보 처리방침", href:"/privacy", desc:"" },
      { label:"고객센터", href:"/contact", desc:"문의·건의사항" },
    ]},
  ];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <div style={{ maxWidth:600, margin:"0 auto", padding:"40px 24px 100px" }}>
          <h1 style={{ fontSize:24, fontWeight:800, marginBottom:28 }}>⚙️ 설정</h1>

          {/* 사용자 정보 */}
          {user && (
            <div style={{ background:"white", borderRadius:18, padding:"20px 22px", marginBottom:16, display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:"#FF3B1E", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800 }}>
                {(user.name||"U")[0]}
              </div>
              <div>
                <div style={{ fontSize:16, fontWeight:800 }}>{user.name}</div>
                <div style={{ fontSize:12, color:"#AAA" }}>{user.email}</div>
              </div>
            </div>
          )}

          {MENU.map(section => (
            <div key={section.section} style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#AAA", letterSpacing:1, padding:"0 4px", marginBottom:8 }}>{section.section}</div>
              <div style={{ background:"white", borderRadius:18, overflow:"hidden" }}>
                {section.items.map((item, i) => (
                  <Link key={item.label} href={item.href}>
                    <div style={{
                      padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center",
                      borderBottom: i < section.items.length - 1 ? "1px solid #F0EEE9" : "none",
                    }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:"#333" }}>{item.label}</div>
                        {item.desc && <div style={{ fontSize:12, color:"#AAA", marginTop:2 }}>{item.desc}</div>}
                      </div>
                      <ChevronRight size={16} color="#CCC" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div style={{ textAlign:"center", marginTop:24, fontSize:12, color:"#CCC" }}>
            픽스카 FIXCAR v1.0.0
          </div>
        </div>
      </div>
    </>
  );
}
