"use client";
import { useState, useRef } from "react";
import { ChevronRight, CheckCircle, Camera, X, Search } from "lucide-react";

const STEPS = ["판매자·차량 정보", "차량 사진 등록", "최종 확인"];
const FUELS = ["가솔린","디젤","LPG","하이브리드","전기","수소"];
const COLORS = ["흰색","검정","은색","회색","파랑","빨강","초록","갈색","노랑","주황","보라","기타"];
const TRANSMISSIONS = ["자동","수동","CVT","DCT","AMT"];
const REGIONS = ["광주 동구","광주 서구","광주 남구","광주 북구","광주 광산구","전남 목포","전남 여수","전남 순천","전남 기타","타지역 탁송"];
const OPTIONS_LIST: Record<string, string[]> = {
  "내/외장·편의": ["선루프","파노라마","풀오토 에어컨","스마트키","하이패스","블루투스","네비게이션","열선 스티어링 휠","알루미늄 휠","레인센서","전동식 트렁크 도어","루프랙","고스트 도어 클로징","모바일기기 무선충전","패들 시프트","공기청정기","커튼/블라인드"],
  "주행·주차": ["주차센서(전방)","주차센서(후방)","크루즈컨트롤","어댑티브","차체자세 제어(ESC)","구동력 제어(TCS)","브레이크 잠김방지(ABS)","4륜구동","전자식 주차브레이크(EPB)","타이어 공기압 모니터링","차선유지보조(LDWS)","측후방 경보","경사로발진 보조","전자동주차(SPAS)","전자제어 서스펜션(ECS)","전방충돌방지(FCA)","후방교차충돌방지(RCCW)","아이들링 스톱(ISG)"],
  "램프·미러·카메라": ["헤드램프(HID)","헤드램프(LED)","레이저 헤드램프","어댑티브 헤드램프","오토 라이트","상향등 보조(HBA)","전방카메라","후방카메라","360도 어라운드뷰","헤드업 디스플레이","전동접이 사이드미러","눈부심방지 미러","AV모니터"],
  "시트·에어백": ["가죽시트","전동시트(운전)","전동시트(동승)","전동시트(뒤)","열선시트(앞)","열선시트(뒤)","통풍시트(앞)","통풍시트(뒤)","마사지(앞)","운전자세 메모리(IMS)","에어백(운전)","에어백(동승)","에어백(사이드/커튼)"],
  "화물·특장": ["파워 리프트게이트","전동 틸팅캠","루프 스포일러","동력인출장치(PTO)","자동 호루 덮개","그리스 주유기","매연저감장치","무시동 히터/에어컨","에어브레이크","타코미터","열선내장 슬리핑 베드"],
};

export default function DealerNewCarPage() {
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [opts, setOpts] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    sellerName:"", sellerPhone:"", licenseNumber:"", region:"광주 북구",
    plateNumber:"", brand:"", modelName:"", grade:"",
    year:"", firstRegDate:"", transmission:"자동", fuel:"가솔린",
    color:"흰색", mileage:"", displacement:"", power:"", efficiency:"",
    owners:"1", accident:"없음",
    price:"", negotiable:false, fixPrice:true,
    usageChange:"없음", ownerChange:"없음", plateChange:"없음",
    selfDamage:"없음", otherDamage:"없음", shareAccident:false,
    engineStatus:"양호", transmissionStatus:"양호", brakeStatus:"양호", bodyStatus:"양호",
    description:"", specialNote:"",
  });

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));
  const toggleOpt = (o: string) => setOpts(p => p.includes(o) ? p.filter(x=>x!==o) : [...p, o]);

  const inp: React.CSSProperties = { width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", background:"#FAFAF8", fontFamily:"'NanumSquareRound',sans-serif" };
  const sel: React.CSSProperties = { ...inp, cursor:"pointer" };
  const lbl: React.CSSProperties = { fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImages(p => p.length < 30 ? [...p, ev.target?.result as string] : p);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!form.brand || !form.modelName || !form.price) { alert("필수 항목을 입력해주세요"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/cars", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.brand} ${form.modelName} ${form.grade}`.trim(),
          brand: form.brand, year: parseInt(form.year)||2020,
          mileage: parseInt(form.mileage.replace(/,/g,""))||0,
          fuel: form.fuel, color: form.color, region: form.region,
          price: parseInt(form.price.replace(/,/g,""))||0,
          transmission: form.transmission, owners: parseInt(form.owners)||1,
          accident: form.accident !== "없음",
          cc: parseInt(form.displacement)||0, power: parseInt(form.power)||0,
          efficiency: form.efficiency||"0",
          tags: opts.slice(0,5), options: opts, images: images.slice(0,30),
          description: form.description, status: "REVIEWING",
        }),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else alert(data.error || "등록 실패");
    } catch { alert("오류 발생"); }
    setSubmitting(false);
  };

  if (done) return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{background:"white",borderRadius:"24px",padding:"48px",textAlign:"center",maxWidth:"440px",width:"90%"}}>
          <CheckCircle size={64} color="#2D8A52" style={{margin:"0 auto 20px"}}/>
          <div style={{fontSize:"24px",fontWeight:800,marginBottom:"8px"}}>매물 등록 완료!</div>
          <div style={{fontSize:"15px",color:"#888",marginBottom:"28px",fontWeight:400}}>관리자 검수 후 24시간 내 게시돼요.</div>
          <div style={{display:"flex",gap:"10px"}}>
            <a href="/dealer" style={{flex:1}}><button style={{width:"100%",background:"#F0EEE9",color:"#1A1A1A",border:"none",padding:"13px",borderRadius:"12px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>대시보드</button></a>
            <a href="/dealer/cars" style={{flex:1}}><button style={{width:"100%",background:"#FF3B1E",color:"white",border:"none",padding:"13px",borderRadius:"12px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>내 매물 보기</button></a>
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
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        input,select,textarea{font-family:'NanumSquareRound',sans-serif;}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;background:white!important;}
        .card{background:white;border-radius:18px;padding:24px 28px;margin-bottom:16px;}
        .stitle{font-size:17px;font-weight:800;margin-bottom:18px;display:flex;align-items:center;gap:10px;padding-bottom:14px;border-bottom:2px solid #F0EEE9;}
        .snum{width:28px;height:28px;background:#FF3B1E;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;font-weight:800;flex-shrink:0;}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
        .ob{border:1.5px solid #E0DDD7;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;background:white;transition:all 0.15s;font-family:'NanumSquareRound',sans-serif;}
        .ob.on{border-color:#1847FF;background:#EEF2FF;color:#1847FF;}
        .req{color:#FF3B1E;}
        @media(max-width:768px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}}
      `}</style>

      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <a href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span></a>
          <span style={{fontSize:"14px",fontWeight:700,color:"rgba(255,255,255,0.5)"}}>딜러 매물 등록</span>
          <a href="/dealer" style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",fontWeight:700}}>← 대시보드</a>
        </div>

        <div style={{maxWidth:"860px",margin:"0 auto",padding:"24px 32px 80px"}}>
          {/* 스텝바 */}
          <div style={{background:"white",borderRadius:"14px",overflow:"hidden",marginBottom:"20px",display:"flex"}}>
            {STEPS.map((s,i)=>(
              <div key={s} style={{flex:1,textAlign:"center",padding:"14px 8px",fontSize:"13px",fontWeight:step===i?800:600,color:step===i?"#FF3B1E":step>i?"#2D8A52":"#AAA",borderBottom:`3px solid ${step===i?"#FF3B1E":step>i?"#2D8A52":"transparent"}`}}>
                {step>i?"✓ ":""}{s}
              </div>
            ))}
          </div>

          {step === 0 && <>
            {/* 1. 판매자 */}
            <div className="card">
              <div className="stitle"><div className="snum">1</div>판매자 및 위치 정보</div>
              <div className="g2">
                <div><label style={lbl}>이름 <span className="req">*</span></label><input style={inp} type="text" placeholder="이름" value={form.sellerName} onChange={e=>set("sellerName",e.target.value)}/></div>
                <div><label style={lbl}>연락처 <span className="req">*</span></label><input style={inp} type="tel" placeholder="010-0000-0000" value={form.sellerPhone} onChange={e=>set("sellerPhone",e.target.value)}/></div>
                <div><label style={lbl}>사원증 번호</label><input style={inp} placeholder="선택사항" value={form.licenseNumber} onChange={e=>set("licenseNumber",e.target.value)}/></div>
                <div><label style={lbl}>차량 위치 <span className="req">*</span></label>
                  <select style={sel} value={form.region} onChange={e=>set("region",e.target.value)}>{REGIONS.map(r=><option key={r}>{r}</option>)}</select>
                </div>
              </div>
            </div>

            {/* 2. 차량 기본 */}
            <div className="card">
              <div className="stitle"><div className="snum">2</div>차량 기본 정보</div>
              <div style={{display:"flex",gap:"10px",marginBottom:"14px",alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  <label style={lbl}>차량번호 <span className="req">*</span></label>
                  <input style={inp} placeholder="예: 12가3456" value={form.plateNumber} onChange={e=>set("plateNumber",e.target.value)}/>
                </div>
                <button onClick={()=>alert("국토교통부 API 연동 후 사용 가능해요.")}
                  style={{background:"#1847FF",color:"white",border:"none",padding:"10px 18px",borderRadius:"10px",fontSize:"13px",fontWeight:800,height:"42px",display:"flex",alignItems:"center",gap:"6px",flexShrink:0}}>
                  <Search size={14}/> 차량정보 불러오기
                </button>
              </div>
              <div style={{background:"#FFF8EC",border:"1px solid #FFD89A",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",fontSize:"12px",color:"#7A5500",fontWeight:400}}>
                ※ 차량정보 불러오기는 자동입력된 정보의 정확함을 보증하지 않습니다. 차량등록증으로 반드시 확인하세요.
              </div>
              <div className="g3">
                <div><label style={lbl}>제조사 <span className="req">*</span></label><input style={inp} placeholder="예: 현대" value={form.brand} onChange={e=>set("brand",e.target.value)}/></div>
                <div><label style={lbl}>모델명 <span className="req">*</span></label><input style={inp} placeholder="예: 아반떼" value={form.modelName} onChange={e=>set("modelName",e.target.value)}/></div>
                <div><label style={lbl}>등급</label><input style={inp} placeholder="예: 인스퍼레이션" value={form.grade} onChange={e=>set("grade",e.target.value)}/></div>
                <div><label style={lbl}>변속기 <span className="req">*</span></label>
                  <select style={sel} value={form.transmission} onChange={e=>set("transmission",e.target.value)}>{TRANSMISSIONS.map(t=><option key={t}>{t}</option>)}</select>
                </div>
                <div><label style={lbl}>연료 <span className="req">*</span></label>
                  <select style={sel} value={form.fuel} onChange={e=>set("fuel",e.target.value)}>{FUELS.map(f=><option key={f}>{f}</option>)}</select>
                </div>
                <div><label style={lbl}>색상 <span className="req">*</span></label>
                  <select style={sel} value={form.color} onChange={e=>set("color",e.target.value)}>{COLORS.map(c=><option key={c}>{c}</option>)}</select>
                </div>
                <div><label style={lbl}>연식 <span className="req">*</span></label><input style={inp} type="number" placeholder="예: 2021" value={form.year} onChange={e=>set("year",e.target.value)}/></div>
                <div><label style={lbl}>최초등록일</label><input style={inp} placeholder="예: 20210315" value={form.firstRegDate} onChange={e=>set("firstRegDate",e.target.value)}/></div>
                <div><label style={lbl}>주행거리 (km) <span className="req">*</span></label><input style={inp} placeholder="예: 32000" value={form.mileage} onChange={e=>set("mileage",e.target.value)}/></div>
                <div><label style={lbl}>배기량 (cc)</label><input style={inp} placeholder="예: 1598" value={form.displacement} onChange={e=>set("displacement",e.target.value)}/></div>
                <div><label style={lbl}>최대출력 (마력)</label><input style={inp} placeholder="예: 123" value={form.power} onChange={e=>set("power",e.target.value)}/></div>
                <div><label style={lbl}>연비 (km/ℓ)</label><input style={inp} placeholder="예: 14.2" value={form.efficiency} onChange={e=>set("efficiency",e.target.value)}/></div>
                <div><label style={lbl}>소유자 변경 <span className="req">*</span></label>
                  <select style={sel} value={form.owners} onChange={e=>set("owners",e.target.value)}>
                    {["1","2","3","4","5이상"].map(o=><option key={o} value={o}>{o}인</option>)}
                  </select>
                </div>
                <div><label style={lbl}>사고 유무 <span className="req">*</span></label>
                  <select style={sel} value={form.accident} onChange={e=>set("accident",e.target.value)}>
                    {["없음","경미한 사고","사고 있음"].map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. 가격 */}
            <div className="card">
              <div className="stitle"><div className="snum">3</div>가격 정보</div>
              <div className="g2">
                <div>
                  <label style={lbl}>판매가 (만원) <span className="req">*</span></label>
                  <input style={inp} placeholder="예: 1450" value={form.price} onChange={e=>set("price",e.target.value)}/>
                  <div style={{fontSize:"12px",color:"#AAA",marginTop:"5px",fontWeight:400}}>국산차 미입력 시 광고 불가</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"12px",justifyContent:"center"}}>
                  <label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"14px",fontWeight:700}}>
                    <input type="checkbox" checked={form.fixPrice} onChange={e=>set("fixPrice",e.target.checked)} style={{accentColor:"#FF3B1E",width:"16px",height:"16px"}}/>
                    🔒 FIX 정찰가 등록
                  </label>
                  <label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"14px",fontWeight:400,color:"#888"}}>
                    <input type="checkbox" checked={form.negotiable} onChange={e=>set("negotiable",e.target.checked)} style={{width:"16px",height:"16px"}}/>
                    상담가 표시 (협의 가능)
                  </label>
                </div>
              </div>
            </div>

            {/* 4. 사고이력 */}
            <div className="card">
              <div className="stitle"><div className="snum">4</div>사고이력 정보</div>
              <div style={{background:"#FFF0ED",border:"1px solid #FFB8A8",borderRadius:"10px",padding:"11px 14px",marginBottom:"14px",fontSize:"12px",color:"#CC2200",lineHeight:1.7,fontWeight:400}}>
                ※ 허위 기재 시 표시광고의 공정화에 관한 법률에 의해 <strong>1억원 이하 과태료</strong>가 부과될 수 있습니다.
              </div>
              <div className="g2">
                {[["용도변경 이력","usageChange"],["소유자 변경","ownerChange"],["차량번호 변경","plateChange"],["내차 피해","selfDamage"],["상대차 피해","otherDamage"]].map(([l,k])=>(
                  <div key={k}>
                    <label style={lbl}>{l}</label>
                    <select style={sel} value={form[k as keyof typeof form] as string} onChange={e=>set(k,e.target.value)}>
                      {["없음","있음"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <label style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"12px",cursor:"pointer",fontSize:"14px",fontWeight:700}}>
                <input type="checkbox" checked={form.shareAccident} onChange={e=>set("shareAccident",e.target.checked)} style={{accentColor:"#FF3B1E",width:"16px",height:"16px"}}/>
                차량광고에 사고이력 정보 공개
              </label>
            </div>

            {/* 5. 점검기록부 */}
            <div className="card">
              <div className="stitle"><div className="snum">5</div>성능·상태 점검기록부</div>
              <div className="g2">
                {[["엔진 상태","engineStatus"],["변속기 상태","transmissionStatus"],["브레이크 상태","brakeStatus"],["외관 상태","bodyStatus"]].map(([l,k])=>(
                  <div key={k}>
                    <label style={lbl}>{l}</label>
                    <select style={sel} value={form[k as keyof typeof form] as string} onChange={e=>set(k,e.target.value)}>
                      {["양호","정비요","불량"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{background:"#EEF2FF",border:"1px solid #B8C8FF",borderRadius:"10px",padding:"10px 14px",marginTop:"12px",fontSize:"12px",color:"#1847FF",fontWeight:400}}>
                📋 전체 점검기록부는 제휴 성능점검장에서 검사 후 자동 등록됩니다.
              </div>
            </div>

            {/* 6. 옵션 */}
            <div className="card">
              <div className="stitle"><div className="snum">6</div>옵션 사항</div>
              <div style={{background:"#FFF8EC",border:"1px solid #FFD89A",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",fontSize:"12px",color:"#7A5500",fontWeight:400}}>
                ※ 구매자와의 법적분쟁 방지를 위해 실 차량 확인 후 정확히 입력해주세요.
              </div>
              {Object.entries(OPTIONS_LIST).map(([cat, items]) => (
                <div key={cat} style={{marginBottom:"16px"}}>
                  <div style={{fontSize:"13px",fontWeight:800,color:"#555",marginBottom:"8px",padding:"6px 0",borderBottom:"1px solid #F0EEE9"}}>{cat}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                    {items.map(o=>(
                      <button key={o} className={`ob${opts.includes(o)?" on":""}`} onClick={()=>toggleOpt(o)}>{o}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 7. 차량 설명 */}
            <div className="card">
              <div className="stitle"><div className="snum">7</div>차량 설명</div>
              <textarea rows={6} placeholder="차량의 특징, 관리 이력 등을 자유롭게 작성해주세요.&#10;예: 1인 오너, 정기점검 완료, 외관 흠집 없음" value={form.description} onChange={e=>set("description",e.target.value)}
                style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"12px 14px",fontSize:"14px",resize:"vertical",background:"#FAFAF8"}}/>
            </div>

            {/* 8. 목록 문구 */}
            <div className="card">
              <div className="stitle"><div className="snum">8</div>목록 문구 (20자 이내)</div>
              <input style={inp} placeholder="예: 1인소유, 무사고, 교환가능" maxLength={20} value={form.specialNote} onChange={e=>set("specialNote",e.target.value)}/>
              <div style={{fontSize:"12px",color:"#AAA",marginTop:"5px",fontWeight:400}}>{form.specialNote.length}/20자 · 차량 목록에 표시되는 짧은 문구예요</div>
            </div>

            <button onClick={()=>setStep(1)} style={{width:"100%",background:"#FF3B1E",color:"white",border:"none",padding:"16px",borderRadius:"14px",fontSize:"16px",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
              다음 단계 — 차량 사진 등록 <ChevronRight size={18}/>
            </button>
          </>}

          {step === 1 && <>
            <div className="card">
              <div className="stitle"><div className="snum" style={{background:"#1847FF"}}>📸</div>차량 사진 등록 (최대 30장)</div>
              <div style={{background:"#EEF2FF",border:"1px solid #B8C8FF",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",fontSize:"13px",color:"#1847FF",lineHeight:1.75,fontWeight:400}}>
                <strong style={{fontWeight:800}}>권장 촬영 순서:</strong> 정면 → 측면(좌/우) → 후면 → 계기판 → 시트 → 트렁크 → 엔진룸 → 외관 흠집
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleImages} style={{display:"none"}}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"8px",marginBottom:"12px"}}>
                {images.map((img,i)=>(
                  <div key={i} style={{position:"relative",paddingBottom:"100%",borderRadius:"10px",overflow:"hidden",background:"#F0EEE9"}}>
                    <img src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
                    <button onClick={()=>setImages(p=>p.filter((_,idx)=>idx!==i))} style={{position:"absolute",top:"4px",right:"4px",background:"rgba(0,0,0,0.6)",border:"none",borderRadius:"50%",width:"22px",height:"22px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <X size={12} color="white"/>
                    </button>
                  </div>
                ))}
                {images.length < 30 && (
                  <button onClick={()=>fileRef.current?.click()} style={{position:"relative",paddingBottom:"100%",borderRadius:"10px",border:"2px dashed #E0DDD7",background:"#FAFAF8",cursor:"pointer"}}>
                    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"4px"}}>
                      <Camera size={20} color="#AAA"/><span style={{fontSize:"11px",color:"#AAA",fontWeight:700}}>추가</span>
                    </div>
                  </button>
                )}
              </div>
              <div style={{fontSize:"13px",color:"#AAA",fontWeight:400}}>{images.length}/30장 등록됨</div>
            </div>
            <div style={{display:"flex",gap:"10px"}}>
              <button onClick={()=>setStep(0)} style={{flex:1,background:"#F0EEE9",color:"#555",border:"none",padding:"15px",borderRadius:"12px",fontSize:"15px",fontWeight:800}}>← 이전</button>
              <button onClick={()=>setStep(2)} style={{flex:2,background:"#FF3B1E",color:"white",border:"none",padding:"15px",borderRadius:"12px",fontSize:"15px",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                다음 단계 — 최종 확인 <ChevronRight size={16}/>
              </button>
            </div>
          </>}

          {step === 2 && <>
            <div className="card">
              <div className="stitle"><div className="snum" style={{background:"#2D8A52"}}>✓</div>최종 확인</div>
              <div style={{display:"flex",flexDirection:"column",gap:"0"}}>
                {[
                  ["차량명",`${form.brand} ${form.modelName} ${form.grade}`.trim()||"-"],
                  ["연식",form.year?`${form.year}년식`:"-"],
                  ["주행거리",form.mileage?`${parseInt(form.mileage.replace(/,/g,"")).toLocaleString()}km`:"-"],
                  ["연료/변속기",`${form.fuel} / ${form.transmission}`],
                  ["색상",form.color],
                  ["소유자",`${form.owners}인`],
                  ["사고이력",form.accident],
                  ["판매가",form.price?`${parseInt(form.price.replace(/,/g,"")).toLocaleString()}만원`:"-"],
                  ["FIX 정찰가",form.fixPrice?"✅ FIX 등록":"❌ 일반"],
                  ["위치",form.region],
                  ["사진",`${images.length}장`],
                  ["선택 옵션",`${opts.length}개`],
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid #F0EEE9"}}>
                    <span style={{fontSize:"14px",color:"#888",fontWeight:400}}>{k}</span>
                    <span style={{fontSize:"14px",fontWeight:700}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"14px",padding:"14px 18px",marginBottom:"14px",fontSize:"13px",color:"#555",lineHeight:1.75,fontWeight:400}}>
              • 등록된 매물은 관리자 검수 후 24시간 내 게시돼요<br/>
              • 허위매물 등록 시 이용이 제한됩니다
            </div>
            <div style={{display:"flex",gap:"10px"}}>
              <button onClick={()=>setStep(1)} style={{flex:1,background:"#F0EEE9",color:"#555",border:"none",padding:"15px",borderRadius:"12px",fontSize:"15px",fontWeight:800}}>← 이전</button>
              <button onClick={handleSubmit} disabled={submitting} style={{flex:2,background:submitting?"#E0DDD7":"#FF3B1E",color:submitting?"#AAA":"white",border:"none",padding:"15px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:submitting?"default":"pointer"}}>
                {submitting?"등록 중...":"🚀 매물 등록하기"}
              </button>
            </div>
          </>}
        </div>
      </div>
    </>
  );
}
