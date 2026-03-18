"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle, Car, Phone, ArrowRight } from "lucide-react";

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ plate:"", brand:"", model:"", year:"", mileage:"", fuel:"가솔린", accident:"없음", name:"", phone:"", memo:"" });
  const [done, setDone] = useState(false);

  const inp = { width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"11px 14px", fontSize:"14px", background:"#FAFAF8", fontFamily:"'NanumSquareRound',sans-serif", outline:"none" } as const;
  const sel = { ...inp, cursor:"pointer" };

  const handleSubmit = async () => {
    await fetch("/api/sell", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) }).catch(()=>{});
    setDone(true);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button,input,select,textarea{font-family:'NanumSquareRound',sans-serif;} input:focus,select:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"720px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>SELL</div>
            <h1 style={{fontSize:"clamp(22px,4vw,40px)",fontWeight:800,color:"white",letterSpacing:"-1px",marginBottom:"6px"}}>내 차 팔기</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",fontWeight:400}}>간단한 정보 입력 → 딜러 견적 연락 → FIX 가격 협의</p>
          </div>
        </div>

        <div style={{maxWidth:"720px",margin:"0 auto",padding:"28px 32px 80px"}}>
          {done ? (
            <div style={{background:"white",borderRadius:"20px",padding:"52px",textAlign:"center"}}>
              <CheckCircle size={56} color="#2D8A52" style={{margin:"0 auto 18px"}}/>
              <div style={{fontSize:"22px",fontWeight:800,marginBottom:"8px"}}>접수 완료!</div>
              <div style={{fontSize:"15px",color:"#888",marginBottom:"24px",fontWeight:400}}>등록된 연락처로 딜러가 24시간 내 연락드릴게요.</div>
              <a href="/auction"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"14px 28px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer"}}>공개 경매로 더 높게 팔기 →</button></a>
            </div>
          ) : (
            <>
              {/* 프로세스 안내 */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"20px"}}>
                {[{n:"01",t:"차량 정보 입력",d:"차량번호·모델·상태 입력"},{ n:"02",t:"딜러 견적 연락",d:"24시간 내 딜러 연락"},{ n:"03",t:"FIX 가격 협의",d:"공정한 가격으로 거래"}].map((s,i)=>(
                  <div key={i} style={{background:"white",borderRadius:"14px",padding:"16px",textAlign:"center"}}>
                    <div style={{fontSize:"22px",fontWeight:800,color:"#FF3B1E",marginBottom:"6px",fontFamily:"'Bebas Neue',serif"}}>{s.n}</div>
                    <div style={{fontSize:"14px",fontWeight:800,marginBottom:"4px"}}>{s.t}</div>
                    <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{s.d}</div>
                  </div>
                ))}
              </div>

              <div style={{background:"white",borderRadius:"18px",padding:"24px 28px",display:"flex",flexDirection:"column",gap:"14px"}}>
                <div style={{fontSize:"16px",fontWeight:800,borderBottom:"1px solid #F0EEE9",paddingBottom:"12px"}}>차량 정보</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                  <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>차량번호</label><input style={inp} placeholder="12가3456" value={form.plate} onChange={e=>setForm(p=>({...p,plate:e.target.value}))}/></div>
                  <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>브랜드</label><input style={inp} placeholder="현대" value={form.brand} onChange={e=>setForm(p=>({...p,brand:e.target.value}))}/></div>
                  <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>모델명</label><input style={inp} placeholder="아반떼" value={form.model} onChange={e=>setForm(p=>({...p,model:e.target.value}))}/></div>
                  <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>연식</label><input type="number" style={inp} placeholder="2020" value={form.year} onChange={e=>setForm(p=>({...p,year:e.target.value}))}/></div>
                  <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>주행거리 (km)</label><input type="number" style={inp} placeholder="50000" value={form.mileage} onChange={e=>setForm(p=>({...p,mileage:e.target.value}))}/></div>
                  <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>연료</label>
                    <select style={sel} value={form.fuel} onChange={e=>setForm(p=>({...p,fuel:e.target.value}))}>
                      {["가솔린","디젤","LPG","하이브리드","전기"].map(f=><option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div style={{gridColumn:"1/-1"}}><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>사고 이력</label>
                    <select style={sel} value={form.accident} onChange={e=>setForm(p=>({...p,accident:e.target.value}))}>
                      {["없음","경미한 사고","사고 있음"].map(a=><option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{fontSize:"16px",fontWeight:800,borderBottom:"1px solid #F0EEE9",paddingBottom:"12px",marginTop:"4px"}}>연락처</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                  <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>이름</label><input style={inp} placeholder="홍길동" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
                  <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>연락처 *</label><input type="tel" style={inp} placeholder="010-0000-0000" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/></div>
                </div>
                <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px"}}>추가 사항</label>
                  <textarea rows={3} style={{...inp,resize:"none"}} placeholder="특이사항, 원하는 가격 등 자유롭게 입력" value={form.memo} onChange={e=>setForm(p=>({...p,memo:e.target.value}))}/>
                </div>

                <button onClick={handleSubmit} disabled={!form.phone} style={{background:!form.phone?"#E0DDD7":"#FF3B1E",color:!form.phone?"#AAA":"white",border:"none",padding:"15px",borderRadius:"12px",fontSize:"16px",fontWeight:800,cursor:!form.phone?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                  <Car size={18}/> 견적 신청하기 <ArrowRight size={16}/>
                </button>
                <div style={{fontSize:"12px",color:"#AAA",textAlign:"center",fontWeight:400}}>공개 경매로 더 높은 가격을 받고 싶다면 <a href="/auction" style={{color:"#1847FF",fontWeight:700}}>공개 경매 →</a></div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
