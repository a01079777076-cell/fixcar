"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";

const SAMPLE_APPS = [
  { id:1, shopName:"광주모터스", ownerName:"박준형", phone:"010-1234-5678", email:"dealer1@fixcar.kr", address:"광주 북구 운암동", bizNumber:"123-45-67890", experience:"5~10년", intro:"10년 경력 국산차 전문 딜러입니다.", date:"2025-03-18", status:"대기" },
  { id:2, shopName:"전남자동차", ownerName:"김민수", phone:"010-2345-6789", email:"dealer2@fixcar.kr", address:"광주 서구", bizNumber:"234-56-78901", experience:"3~5년", intro:"SUV 전문 딜러입니다.", date:"2025-03-17", status:"대기" },
  { id:3, shopName:"수완카센터", ownerName:"이정호", phone:"010-3456-7890", email:"dealer3@fixcar.kr", address:"광주 광산구 수완동", bizNumber:"345-67-89012", experience:"1~3년", intro:"전기차 전문 신진 딜러입니다.", date:"2025-03-16", status:"승인" },
];

export default function AdminDealerAppsPage() {
  const [apps, setApps] = useState(SAMPLE_APPS);
  const [selected, setSelected] = useState<typeof SAMPLE_APPS[0] | null>(null);

  const approve = async (id: number) => {
    await fetch(`/api/users`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ dealerAppId: id, action: "approve" }) });
    setApps(prev => prev.map(a => a.id===id ? { ...a, status:"승인" } : a));
    setSelected(null);
  };
  const reject = (id: number) => {
    setApps(prev => prev.map(a => a.id===id ? { ...a, status:"거절" } : a));
    setSelected(null);
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .row { cursor:pointer; transition:background 0.1s; }
        .row:hover { background:#FAFAF8; }
        @media(max-width:768px) { .split { grid-template-columns:1fr !important; } }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <div style={{ background:"#1A1A1A", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"24px", letterSpacing:"3px" }}><span style={{ color:"#FF3B1E" }}>FIX</span><span style={{ color:"white" }}>CAR</span></a>
          <div style={{ display:"flex", gap:"20px" }}>
            {[["대시보드","/admin"],["회원","/admin/users"],["매물","/admin/cars"],["딜러신청","/admin/dealers"],["설정","/admin/settings"]].map(([l,h])=>(
              <a key={l} href={h} style={{ fontSize:"13px", fontWeight:700, color: h==="/admin/dealers"?"white":"rgba(255,255,255,0.4)" }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"28px 32px 80px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
            <h1 style={{ fontSize:"26px", fontWeight:800 }}>딜러 신청 관리</h1>
            <div style={{ display:"flex", gap:"8px" }}>
              <span style={{ background:"#FFF8EC", color:"#E8A020", padding:"5px 14px", borderRadius:"100px", fontSize:"13px", fontWeight:800, display:"flex", alignItems:"center", gap:"5px" }}><Clock size={13}/> 대기 {apps.filter(a=>a.status==="대기").length}건</span>
              <span style={{ background:"#EAF6EF", color:"#2D8A52", padding:"5px 14px", borderRadius:"100px", fontSize:"13px", fontWeight:800, display:"flex", alignItems:"center", gap:"5px" }}><CheckCircle size={13}/> 승인 {apps.filter(a=>a.status==="승인").length}건</span>
            </div>
          </div>

          <div className="split" style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:"16px", alignItems:"start" }}>
            <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
              {apps.map((app, i) => (
                <div key={app.id} className="row" onClick={() => setSelected(app)}
                  style={{ padding:"16px 18px", borderBottom:i<apps.length-1?"1px solid #F0EEE9":"none", background:selected?.id===app.id?"#FFF0ED":"white" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                    <span style={{ fontSize:"15px", fontWeight:800 }}>{app.shopName}</span>
                    <span style={{ background:app.status==="대기"?"#FFF8EC":app.status==="승인"?"#EAF6EF":"#FFF0ED", color:app.status==="대기"?"#E8A020":app.status==="승인"?"#2D8A52":"#FF3B1E", padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{app.status}</span>
                  </div>
                  <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{app.ownerName} · {app.experience} · {app.date}</div>
                </div>
              ))}
            </div>

            {selected ? (
              <div style={{ background:"white", borderRadius:"18px", padding:"24px" }}>
                <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"16px" }}>{selected.shopName} 신청 내용</div>
                {[["상호명",selected.shopName],["대표자",selected.ownerName],["연락처",selected.phone],["이메일",selected.email],["주소",selected.address],["사업자번호",selected.bizNumber],["경력",selected.experience]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #F0EEE9" }}>
                    <span style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{k}</span>
                    <span style={{ fontSize:"13px", fontWeight:700 }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop:"14px", padding:"12px", background:"#F8F6F2", borderRadius:"10px", fontSize:"14px", color:"#444", lineHeight:1.7, fontWeight:400 }}>{selected.intro}</div>
                {selected.status === "대기" && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginTop:"16px" }}>
                    <button onClick={() => approve(selected.id)} style={{ background:"#2D8A52", color:"white", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}><CheckCircle size={15}/> 승인하기</button>
                    <button onClick={() => reject(selected.id)} style={{ background:"#FFF0ED", color:"#FF3B1E", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}><XCircle size={15}/> 거절하기</button>
                  </div>
                )}
                {selected.status !== "대기" && (
                  <div style={{ marginTop:"14px", background:selected.status==="승인"?"#EAF6EF":"#FFF0ED", borderRadius:"10px", padding:"14px", textAlign:"center", fontSize:"14px", fontWeight:800, color:selected.status==="승인"?"#2D8A52":"#FF3B1E" }}>
                    {selected.status==="승인"?"✅ 승인 완료된 딜러예요":"❌ 거절된 신청이에요"}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background:"white", borderRadius:"18px", padding:"60px", textAlign:"center", color:"#AAA" }}>
                <Eye size={40} color="#E0DDD7" style={{ margin:"0 auto 14px" }} />
                <div style={{ fontSize:"15px", fontWeight:800 }}>신청서를 선택해주세요</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
