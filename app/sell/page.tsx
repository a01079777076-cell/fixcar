"use client";

import { useState } from "react";
import {
  Car, Camera, CheckCircle, ChevronRight, ArrowLeft,
  DollarSign, Clock, Shield, Truck, AlertCircle, Phone
} from "lucide-react";

const STEPS = ["차량 정보", "상태 입력", "가격 확인", "신청 완료"];

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    brand: "", model: "", year: "", mileage: "",
    fuel: "가솔린", color: "", region: "",
    accident: "없음", name: "", phone: "", memo: "",
  });

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  if (done) return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        @keyframes scaleIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#F0EEE9", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div style={{ textAlign:"center", maxWidth:"480px", width:"100%" }}>
          <div style={{ width:"88px", height:"88px", background:"#EAF6EF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", animation:"scaleIn 0.5s ease" }}>
            <CheckCircle size={44} color="#2D8A52" />
          </div>
          <h1 style={{ fontSize:"36px", fontWeight:800, letterSpacing:"-1px", marginBottom:"12px", animation:"fadeUp 0.5s 0.1s both" }}>신청 완료! 🎉</h1>
          <p style={{ fontSize:"16px", color:"#888", lineHeight:1.8, marginBottom:"36px", fontWeight:400, animation:"fadeUp 0.5s 0.2s both" }}>
            픽스카 담당자가 <strong style={{ color:"#1A1A1A", fontWeight:800 }}>1 영업일 내</strong>로 연락드릴게요.<br />
            차량 상태 확인 후 <strong style={{ color:"#FF3B1E", fontWeight:800 }}>FIX 가격</strong>을 제안해드려요.
          </p>
          <div style={{ background:"white", borderRadius:"20px", padding:"24px", marginBottom:"20px", animation:"fadeUp 0.5s 0.3s both" }}>
            {[["신청 차량", `${form.brand} ${form.model}`], ["연식", `${form.year}년식`], ["주행거리", `${parseInt(form.mileage||"0").toLocaleString()}km`], ["연락처", form.phone]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #F0EEE9" }}>
                <span style={{ fontSize:"14px", color:"#888", fontWeight:400 }}>{k}</span>
                <span style={{ fontSize:"14px", fontWeight:800 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"12px", animation:"fadeUp 0.5s 0.4s both" }}>
            <a href="/" style={{ flex:1 }}><button style={{ width:"100%", background:"#FF3B1E", color:"white", border:"none", padding:"15px", borderRadius:"12px", fontSize:"15px", fontWeight:800, cursor:"pointer" }}>홈으로</button></a>
            <a href="/cars" style={{ flex:1 }}><button style={{ width:"100%", background:"white", border:"2px solid #E0DDD7", padding:"13px", borderRadius:"12px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>매물 보기</button></a>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input, select, textarea { font-family:'NanumSquareRound',sans-serif; }
        .form-input { width:100%; border:1.5px solid #E0DDD7; border-radius:12px; padding:14px 16px; font-size:15px; outline:none; transition:border-color 0.2s; background:#FAFAF8; }
        .form-input:focus { border-color:#FF3B1E; background:white; }
        .btn-red { background:#FF3B1E; color:white; border:none; border-radius:14px; font-size:16px; font-weight:800; width:100%; padding:18px; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:10px; cursor:pointer; }
        .btn-red:hover { background:#D42E14; }
        .btn-red:disabled { background:#E0DDD7; color:#AAA; cursor:default; }
        .nav-link:hover { color:#1A1A1A !important; }
        @media(max-width:1024px) { .sell-grid { grid-template-columns:1fr !important; } .nav-menu { display:none !important; } }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px", fontSize:"13px", fontWeight:700 }}>
          <span style={{ color:"#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp; <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제
        </div>

        <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px" }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}><span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span></a>
          <div className="nav-menu" style={{ display:"flex", gap:"36px" }}>
            {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
              <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight:l==="내 차 팔기"?800:700, color:l==="내 차 팔기"?"#1A1A1A":"#888", borderBottom:l==="내 차 팔기"?"2px solid #FF3B1E":"none", paddingBottom:"2px" }}>{l}</a>
            ))}
          </div>
          <a href="/login"><button style={{ background:"#FF3B1E", color:"white", border:"none", padding:"10px 22px", borderRadius:"100px", fontSize:"14px", fontWeight:800, cursor:"pointer" }}>로그인</button></a>
        </nav>

        {/* 헤더 */}
        <div style={{ background:"#1A1A1A", padding:"44px 52px 36px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"320px", height:"320px", background:"radial-gradient(circle,rgba(255,59,30,0.1),transparent 65%)", borderRadius:"50%" }} />
          <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"10px" }}>SELL YOUR CAR</div>
            <h1 style={{ fontSize:"clamp(26px,4vw,48px)", fontWeight:800, color:"white", letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:"8px" }}>
              내 차를 <span style={{ color:"#FF3B1E" }}>FIX 가격</span>으로 팔기
            </h1>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.4)", fontWeight:400 }}>3분 입력 → 1영업일 내 가격 제안 → 바로 판매</p>
          </div>
        </div>

        {/* 스텝 */}
        <div style={{ background:"white", borderBottom:"1px solid #ECEAE4", padding:"0 52px" }}>
          <div style={{ maxWidth:"1100px", margin:"0 auto", display:"flex", alignItems:"center", padding:"16px 0" }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length-1 ? 1 : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:step > i+1?"#2D8A52":step === i+1?"#FF3B1E":"#E0DDD7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:800, color:"white", transition:"all 0.3s" }}>
                    {step > i+1 ? <CheckCircle size={16}/> : i+1}
                  </div>
                  <span style={{ fontSize:"13px", fontWeight:step===i+1?800:600, color:step>=i+1?"#1A1A1A":"#AAA", whiteSpace:"nowrap" }}>{s}</span>
                </div>
                {i < STEPS.length-1 && <div style={{ flex:1, height:"1px", background:step>i+1?"#2D8A52":"#E0DDD7", margin:"0 12px", transition:"background 0.3s" }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"32px 52px 80px" }}>
          <div className="sell-grid" style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:"28px", alignItems:"start" }}>

            {/* 왼쪽 폼 */}
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

              {/* STEP 1 */}
              {step === 1 && (
                <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                  <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"22px", display:"flex", alignItems:"center", gap:"10px" }}>
                    <Car size={20} color="#FF3B1E" /> 차량 기본 정보
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>브랜드 <span style={{ color:"#FF3B1E" }}>*</span></label>
                      <select className="form-input" value={form.brand} onChange={e=>update("brand",e.target.value)}>
                        <option value="">선택</option>
                        {["현대","기아","제네시스","쉐보레","르노","KG모빌리티","BMW","벤츠","아우디","폭스바겐"].map(b=><option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>모델명 <span style={{ color:"#FF3B1E" }}>*</span></label>
                      <input className="form-input" type="text" placeholder="예: 아반떼 CN7" value={form.model} onChange={e=>update("model",e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>연식 <span style={{ color:"#FF3B1E" }}>*</span></label>
                      <select className="form-input" value={form.year} onChange={e=>update("year",e.target.value)}>
                        <option value="">선택</option>
                        {Array.from({length:15},(_,i)=>2024-i).map(y=><option key={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>주행거리 <span style={{ color:"#FF3B1E" }}>*</span></label>
                      <input className="form-input" type="number" placeholder="예: 45000" value={form.mileage} onChange={e=>update("mileage",e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>연료</label>
                      <select className="form-input" value={form.fuel} onChange={e=>update("fuel",e.target.value)}>
                        {["가솔린","디젤","전기","하이브리드","LPG"].map(f=><option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>색상</label>
                      <input className="form-input" type="text" placeholder="예: 흰색" value={form.color} onChange={e=>update("color",e.target.value)} />
                    </div>
                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>차량 위치 <span style={{ color:"#FF3B1E" }}>*</span></label>
                      <select className="form-input" value={form.region} onChange={e=>update("region",e.target.value)}>
                        <option value="">선택</option>
                        {["광주 동구","광주 서구","광주 남구","광주 북구","광주 광산구"].map(r=><option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className="btn-red" style={{ marginTop:"22px" }} disabled={!form.brand||!form.model||!form.year||!form.mileage||!form.region} onClick={()=>setStep(2)}>
                    다음 — 차량 상태 입력 <ChevronRight size={18}/>
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                  <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"22px", display:"flex", alignItems:"center", gap:"10px" }}>
                    <Shield size={20} color="#1847FF" /> 차량 상태
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"10px" }}>사고이력</label>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
                        {["없음","경미한 사고","큰 사고"].map(v=>(
                          <div key={v} onClick={()=>update("accident",v)} style={{ padding:"14px", borderRadius:"12px", border:`2px solid ${form.accident===v?"#FF3B1E":"#E0DDD7"}`, background:form.accident===v?"#FFF0ED":"#F8F6F2", cursor:"pointer", textAlign:"center", fontSize:"14px", fontWeight:form.accident===v?800:600, color:form.accident===v?"#FF3B1E":"#555", transition:"all 0.15s" }}>{v}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>차량 사진 첨부</label>
                      <div style={{ border:"2px dashed #E0DDD7", borderRadius:"14px", padding:"32px", textAlign:"center", cursor:"pointer", background:"#F8F6F2" }}>
                        <Camera size={32} color="#AAA" style={{ margin:"0 auto 10px" }} />
                        <div style={{ fontSize:"14px", fontWeight:700, color:"#888", marginBottom:"4px" }}>클릭해서 사진 업로드</div>
                        <div style={{ fontSize:"12px", color:"#CCC", fontWeight:400 }}>외관·실내·엔진룸 사진을 올려주시면 더 정확한 가격을 제안해드려요</div>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>추가 메모</label>
                      <textarea className="form-input" rows={4} placeholder="수리 이력, 옵션, 특이사항 등 자유롭게 적어주세요" value={form.memo} onChange={e=>update("memo",e.target.value)} style={{ resize:"none" }} />
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"12px", marginTop:"22px" }}>
                    <button onClick={()=>setStep(1)} style={{ background:"white", border:"2px solid #E0DDD7", borderRadius:"14px", padding:"16px 24px", fontSize:"15px", fontWeight:700, display:"flex", alignItems:"center", gap:"8px", cursor:"pointer" }}>
                      <ArrowLeft size={16}/> 이전
                    </button>
                    <button className="btn-red" style={{ flex:1 }} onClick={()=>setStep(3)}>
                      다음 — 연락처 입력 <ChevronRight size={18}/>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                  <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"22px", display:"flex", alignItems:"center", gap:"10px" }}>
                    <Phone size={20} color="#2D8A52" /> 연락처 정보
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"14px", marginBottom:"22px" }}>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>이름 <span style={{ color:"#FF3B1E" }}>*</span></label>
                      <input className="form-input" type="text" placeholder="홍길동" value={form.name} onChange={e=>update("name",e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>연락처 <span style={{ color:"#FF3B1E" }}>*</span></label>
                      <input className="form-input" type="tel" placeholder="010-0000-0000" value={form.phone} onChange={e=>update("phone",e.target.value)} />
                    </div>
                  </div>
                  <div style={{ background:"#FFF8EC", border:"1px solid #FFD89A", borderRadius:"14px", padding:"16px 18px", marginBottom:"20px", display:"flex", gap:"12px" }}>
                    <AlertCircle size={20} color="#E8A020" style={{ flexShrink:0 }} />
                    <div style={{ fontSize:"13px", color:"#7A5500", lineHeight:1.7, fontWeight:400 }}>
                      입력하신 연락처로 픽스카 담당자가 연락드려요. 스팸 전화 걱정 없어요!
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"12px" }}>
                    <button onClick={()=>setStep(2)} style={{ background:"white", border:"2px solid #E0DDD7", borderRadius:"14px", padding:"16px 24px", fontSize:"15px", fontWeight:700, display:"flex", alignItems:"center", gap:"8px", cursor:"pointer" }}>
                      <ArrowLeft size={16}/> 이전
                    </button>
                    <button className="btn-red" style={{ flex:1 }} disabled={!form.name||!form.phone} onClick={()=>setDone(true)}>
                      판매 신청 완료 <CheckCircle size={18}/>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 오른쪽 요약 */}
            <div style={{ position:"sticky", top:"88px", display:"flex", flexDirection:"column", gap:"16px" }}>
              <div style={{ background:"#1A1A1A", borderRadius:"20px", padding:"24px" }}>
                <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"2px", color:"#FF7A63", marginBottom:"10px" }}>픽스카 판매 혜택</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  {[
                    { icon:<DollarSign size={18} color="white"/>, color:"#FF3B1E", title:"FIX 가격 제안", desc:"시세 분석 후 적정 가격을 제안해드려요" },
                    { icon:<Clock size={18} color="white"/>, color:"#1847FF", title:"1영업일 내 연락", desc:"빠른 검토 후 연락드려요" },
                    { icon:<Shield size={18} color="white"/>, color:"#2D8A52", title:"안전한 거래", desc:"픽스카가 거래를 보증해요" },
                    { icon:<Truck size={18} color="white"/>, color:"#555", title:"무료 픽업", desc:"광주 내 무료 차량 픽업 서비스" },
                  ].map(item => (
                    <div key={item.title} style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                      <div style={{ width:"36px", height:"36px", background:item.color, borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize:"14px", fontWeight:800, color:"white", marginBottom:"2px" }}>{item.title}</div>
                        <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:400 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {form.brand && (
                <div style={{ background:"white", borderRadius:"18px", padding:"20px 22px" }}>
                  <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"14px" }}>입력 정보 확인</div>
                  {[["차량", `${form.brand} ${form.model||"-"}`], ["연식", form.year?`${form.year}년식`:"-"], ["주행거리", form.mileage?`${parseInt(form.mileage).toLocaleString()}km`:"-"], ["연료", form.fuel], ["사고이력", form.accident]].map(([k,v]) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #F0EEE9" }}>
                      <span style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>{k}</span>
                      <span style={{ fontSize:"13px", fontWeight:800 }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
