"use client";

import { useState, useRef } from "react";
import {
  Car, Camera, CheckCircle, ChevronRight, ArrowLeft,
  Upload, X, Plus, Lock, Shield, DollarSign
} from "lucide-react";

const BRANDS = ["현대","기아","제네시스","쉐보레","르노","KG모빌리티","BMW","벤츠","아우디","폭스바겐","토요타","혼다"];
const FUELS = ["가솔린","디젤","전기","하이브리드","LPG","수소"];
const TRANSMISSIONS = ["자동","수동","CVT","DCT"];
const REGIONS = ["광주 동구","광주 서구","광주 남구","광주 북구","광주 광산구","전남 나주","전남 화순","전남 담양"];
const OPTIONS_LIST = ["후방카메라","전방카메라","열선시트","통풍시트","스마트크루즈","애플카플레이","안드로이드오토","파노라마 선루프","HDA","BSD","원격 주차보조","LED 헤드램프","전동 트렁크","열선 핸들","HUD"];
const TAGS_LIST = ["무사고","초보 추천","1인 오너","가성비","가족용","주차 쉬움","연비 좋음","넓은 트렁크","스포티","전기차"];

export default function DealerNewCarPage() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", brand: "", year: "", mileage: "", fuel: "가솔린",
    color: "", region: "", price: "", cc: "", power: "",
    efficiency: "", transmission: "자동", owners: "1",
    accident: false, options: [] as string[], tags: [] as string[],
  });

  const update = (k: string, v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleItem = (key: "options"|"tags", val: string) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(i=>i!==val) : [...prev[key], val]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "fixcar/cars");
        const res = await fetch("/api/upload", { method:"POST", body:formData });
        const data = await res.json();
        if (data.success) {
          setImages(prev => [...prev, data.data.url]);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("이미지 업로드에 실패했어요");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerId: 1, // 실제 딜러 ID로 교체 필요
          name: `${form.brand} ${form.name}`,
          brand: form.brand,
          year: parseInt(form.year),
          mileage: parseInt(form.mileage),
          fuel: form.fuel,
          color: form.color,
          region: form.region,
          price: parseInt(form.price),
          cc: parseInt(form.cc || "0"),
          power: parseInt(form.power || "0"),
          efficiency: form.efficiency || "0",
          transmission: form.transmission,
          owners: parseInt(form.owners),
          accident: form.accident,
          tags: form.tags,
          options: form.options,
          images,
        }),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else alert(data.error || "등록에 실패했어요");
    } catch (error) {
      console.error("Submit error:", error);
      alert("등록 중 오류가 발생했어요");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
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
          <h1 style={{ fontSize:"36px", fontWeight:800, letterSpacing:"-1px", marginBottom:"12px", animation:"fadeUp 0.5s 0.1s both" }}>매물 등록 완료! 🎉</h1>
          <p style={{ fontSize:"16px", color:"#888", lineHeight:1.8, marginBottom:"32px", fontWeight:400, animation:"fadeUp 0.5s 0.2s both" }}>
            <strong style={{ color:"#1A1A1A", fontWeight:800 }}>{form.brand} {form.name}</strong>이<br />픽스카에 등록됐어요!
          </p>
          <div style={{ display:"flex", gap:"12px", animation:"fadeUp 0.5s 0.3s both" }}>
            <a href="/dealer" style={{ flex:1 }}><button style={{ width:"100%", background:"#1847FF", color:"white", border:"none", padding:"15px", borderRadius:"12px", fontSize:"15px", fontWeight:800, cursor:"pointer" }}>딜러 대시보드</button></a>
            <a href="/cars" style={{ flex:1 }}><button style={{ width:"100%", background:"white", border:"2px solid #E0DDD7", padding:"13px", borderRadius:"12px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>매물 보기</button></a>
          </div>
        </div>
      </div>
    </>
  );

  const STEPS = ["기본 정보", "상세 정보", "사진 등록", "태그·옵션"];
  const inputStyle = { width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"12px 14px", fontSize:"14px", outline:"none", background:"#FAFAF8", fontFamily:"'NanumSquareRound',sans-serif" };
  const labelStyle = { fontSize:"14px", fontWeight:800 as const, display:"block" as const, marginBottom:"7px" };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input, select { font-family:'NanumSquareRound',sans-serif; }
        input:focus, select:focus { border-color:#FF3B1E !important; background:white !important; }
        .tag-btn { transition:all 0.15s; cursor:pointer; border:1.5px solid; border-radius:100px; padding:7px 16px; font-size:13px; font-weight:700; }
        .tag-btn:hover { transform:translateY(-1px); }
        .btn-red { background:#FF3B1E; color:white; border:none; border-radius:14px; font-size:15px; font-weight:800; padding:16px; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; width:100%; }
        .btn-red:hover { background:#D42E14; }
        .btn-red:disabled { background:#E0DDD7; color:#AAA; cursor:default; }
        .img-slot { width:100%; aspect-ratio:4/3; border-radius:12px; overflow:hidden; position:relative; }
        @media(max-width:768px) { .page-wrap { padding:16px !important; } .form-grid { grid-template-columns:1fr !important; } }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        {/* 헤더 */}
        <div style={{ background:"#1A1A1A", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"24px", letterSpacing:"3px" }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span><span style={{ color:"white" }}>CAR</span>
          </a>
          <a href="/dealer" style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"14px", fontWeight:700, color:"rgba(255,255,255,0.5)" }}>
            <ArrowLeft size={16}/> 대시보드로
          </a>
        </div>

        {/* 스텝 */}
        <div style={{ background:"white", borderBottom:"1px solid #ECEAE4", padding:"0 32px" }}>
          <div style={{ maxWidth:"800px", margin:"0 auto", display:"flex", alignItems:"center", padding:"14px 0" }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display:"flex", alignItems:"center", flex:i<STEPS.length-1?1:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:step>i+1?"#2D8A52":step===i+1?"#1847FF":"#E0DDD7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:800, color:"white", transition:"all 0.3s", flexShrink:0 }}>
                    {step>i+1 ? <CheckCircle size={14}/> : i+1}
                  </div>
                  <span style={{ fontSize:"13px", fontWeight:step===i+1?800:600, color:step>=i+1?"#1A1A1A":"#AAA", whiteSpace:"nowrap" }}>{s}</span>
                </div>
                {i<STEPS.length-1 && <div style={{ flex:1, height:"1px", background:step>i+1?"#2D8A52":"#E0DDD7", margin:"0 10px", transition:"background 0.3s" }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="page-wrap" style={{ maxWidth:"800px", margin:"0 auto", padding:"28px 32px 80px" }}>

          {/* STEP 1 — 기본 정보 */}
          {step===1 && (
            <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
              <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"24px", display:"flex", alignItems:"center", gap:"10px" }}>
                <Car size={20} color="#1847FF"/> 차량 기본 정보
              </div>
              <div className="form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div>
                  <label style={labelStyle}>브랜드 <span style={{ color:"#FF3B1E" }}>*</span></label>
                  <select style={inputStyle} value={form.brand} onChange={e=>update("brand",e.target.value)}>
                    <option value="">선택해주세요</option>
                    {BRANDS.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>모델명 <span style={{ color:"#FF3B1E" }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="예: 아반떼 CN7 1.6 스마트" value={form.name} onChange={e=>update("name",e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>연식 <span style={{ color:"#FF3B1E" }}>*</span></label>
                  <select style={inputStyle} value={form.year} onChange={e=>update("year",e.target.value)}>
                    <option value="">선택</option>
                    {Array.from({length:15},(_,i)=>2024-i).map(y=><option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>주행거리 (km) <span style={{ color:"#FF3B1E" }}>*</span></label>
                  <input style={inputStyle} type="number" placeholder="예: 45000" value={form.mileage} onChange={e=>update("mileage",e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>연료 <span style={{ color:"#FF3B1E" }}>*</span></label>
                  <select style={inputStyle} value={form.fuel} onChange={e=>update("fuel",e.target.value)}>
                    {FUELS.map(f=><option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>색상</label>
                  <input style={inputStyle} type="text" placeholder="예: 흰색" value={form.color} onChange={e=>update("color",e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>위치 <span style={{ color:"#FF3B1E" }}>*</span></label>
                  <select style={inputStyle} value={form.region} onChange={e=>update("region",e.target.value)}>
                    <option value="">선택</option>
                    {REGIONS.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>FIX 가격 (만원) <span style={{ color:"#FF3B1E" }}>*</span></label>
                  <input style={inputStyle} type="number" placeholder="예: 1450" value={form.price} onChange={e=>update("price",e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>소유자 수</label>
                  <select style={inputStyle} value={form.owners} onChange={e=>update("owners",e.target.value)}>
                    {["1","2","3","4+"].map(n=><option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>사고이력</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                    {[["무사고",false],["사고있음",true]].map(([l,v])=>(
                      <div key={String(l)} onClick={()=>update("accident",v as boolean)} style={{ padding:"11px", borderRadius:"10px", border:`2px solid ${form.accident===v?"#FF3B1E":"#E0DDD7"}`, background:form.accident===v?"#FFF0ED":"#F8F6F2", cursor:"pointer", textAlign:"center", fontSize:"14px", fontWeight:form.accident===v?800:600, color:form.accident===v?"#FF3B1E":"#555", transition:"all 0.15s" }}>{l as string}</div>
                    ))}
                  </div>
                </div>
              </div>
              <button className="btn-red" style={{ marginTop:"24px" }} disabled={!form.brand||!form.name||!form.year||!form.mileage||!form.region||!form.price} onClick={()=>setStep(2)}>
                다음 — 상세 정보 <ChevronRight size={16}/>
              </button>
            </div>
          )}

          {/* STEP 2 — 상세 정보 */}
          {step===2 && (
            <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
              <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"24px", display:"flex", alignItems:"center", gap:"10px" }}>
                <Shield size={20} color="#1847FF"/> 차량 상세 정보
              </div>
              <div className="form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div>
                  <label style={labelStyle}>배기량 (cc)</label>
                  <input style={inputStyle} type="number" placeholder="예: 1598 (전기차는 0)" value={form.cc} onChange={e=>update("cc",e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>최대출력 (마력)</label>
                  <input style={inputStyle} type="number" placeholder="예: 123" value={form.power} onChange={e=>update("power",e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>연비 (km/L 또는 km/kWh)</label>
                  <input style={inputStyle} type="text" placeholder="예: 15.2" value={form.efficiency} onChange={e=>update("efficiency",e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>변속기</label>
                  <select style={inputStyle} value={form.transmission} onChange={e=>update("transmission",e.target.value)}>
                    {TRANSMISSIONS.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop:"20px", background:"#EEF2FF", border:"1px solid #B8C8FF", borderRadius:"12px", padding:"14px 18px", display:"flex", gap:"10px" }}>
                <Lock size={18} color="#1847FF" style={{ flexShrink:0 }}/>
                <div style={{ fontSize:"13px", color:"#1847FF", lineHeight:1.6, fontWeight:400 }}>
                  <strong style={{ fontWeight:800 }}>FIX 가격이란?</strong> 등록한 가격이 최종 판매가예요. 구매자와 가격 협상 없이 고정 가격으로 판매돼요.
                </div>
              </div>
              <div style={{ display:"flex", gap:"12px", marginTop:"24px" }}>
                <button onClick={()=>setStep(1)} style={{ background:"white", border:"2px solid #E0DDD7", borderRadius:"12px", padding:"14px 24px", fontSize:"14px", fontWeight:700, display:"flex", alignItems:"center", gap:"8px", cursor:"pointer" }}>
                  <ArrowLeft size={15}/> 이전
                </button>
                <button className="btn-red" style={{ flex:1 }} onClick={()=>setStep(3)}>
                  다음 — 사진 등록 <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — 사진 등록 */}
          {step===3 && (
            <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
              <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"8px", display:"flex", alignItems:"center", gap:"10px" }}>
                <Camera size={20} color="#1847FF"/> 차량 사진 등록
              </div>
              <div style={{ fontSize:"14px", color:"#888", marginBottom:"24px", fontWeight:400 }}>
                외관·실내·엔진룸 사진을 올려주세요. 사진이 많을수록 문의가 늘어요!
              </div>

              {/* 업로드 영역 */}
              <div onClick={()=>fileRef.current?.click()} style={{ border:"2px dashed #E0DDD7", borderRadius:"16px", padding:"40px", textAlign:"center", cursor:"pointer", background:"#F8F6F2", marginBottom:"20px", transition:"all 0.15s" }}>
                <Upload size={36} color="#AAA" style={{ margin:"0 auto 12px" }} />
                <div style={{ fontSize:"16px", fontWeight:800, color:"#555", marginBottom:"6px" }}>
                  {uploading ? "업로드 중..." : "클릭해서 사진 추가"}
                </div>
                <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>JPG, PNG · 최대 10MB · 여러 장 선택 가능</div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display:"none" }} />
              </div>

              {/* 업로드된 이미지 */}
              {images.length > 0 && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginBottom:"20px" }}>
                  {images.map((url, i) => (
                    <div key={i} className="img-slot">
                      <img src={url} alt={`차량 ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      {i===0 && <div style={{ position:"absolute", top:8, left:8, background:"#1847FF", color:"white", padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>대표사진</div>}
                      <button onClick={()=>setImages(prev=>prev.filter((_,idx)=>idx!==i))} style={{ position:"absolute", top:8, right:8, width:"28px", height:"28px", background:"rgba(0,0,0,0.6)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <X size={14} color="white"/>
                      </button>
                    </div>
                  ))}
                  <div onClick={()=>fileRef.current?.click()} style={{ aspectRatio:"4/3", borderRadius:"12px", border:"2px dashed #E0DDD7", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"#F8F6F2", padding:"20px" }}>
                    <Plus size={24} color="#AAA"/>
                    <div style={{ fontSize:"12px", color:"#AAA", marginTop:"6px", fontWeight:400 }}>추가</div>
                  </div>
                </div>
              )}

              <div style={{ display:"flex", gap:"12px" }}>
                <button onClick={()=>setStep(2)} style={{ background:"white", border:"2px solid #E0DDD7", borderRadius:"12px", padding:"14px 24px", fontSize:"14px", fontWeight:700, display:"flex", alignItems:"center", gap:"8px", cursor:"pointer" }}>
                  <ArrowLeft size={15}/> 이전
                </button>
                <button className="btn-red" style={{ flex:1 }} onClick={()=>setStep(4)}>
                  다음 — 태그·옵션 <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — 태그·옵션 */}
          {step===4 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
              <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"6px" }}>차량 태그 선택</div>
                <div style={{ fontSize:"14px", color:"#888", marginBottom:"18px", fontWeight:400 }}>매물 목록에서 강조 표시돼요</div>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  {TAGS_LIST.map(tag => (
                    <button key={tag} className="tag-btn" onClick={()=>toggleItem("tags",tag)} style={{ borderColor:form.tags.includes(tag)?"#FF3B1E":"#E0DDD7", background:form.tags.includes(tag)?"#FFF0ED":"#F8F6F2", color:form.tags.includes(tag)?"#FF3B1E":"#555" }}>
                      {form.tags.includes(tag)?"✓ ":""}{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"6px" }}>주요 옵션 선택</div>
                <div style={{ fontSize:"14px", color:"#888", marginBottom:"18px", fontWeight:400 }}>탑재된 옵션을 선택해주세요</div>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  {OPTIONS_LIST.map(opt => (
                    <button key={opt} className="tag-btn" onClick={()=>toggleItem("options",opt)} style={{ borderColor:form.options.includes(opt)?"#1847FF":"#E0DDD7", background:form.options.includes(opt)?"#EEF2FF":"#F8F6F2", color:form.options.includes(opt)?"#1847FF":"#555" }}>
                      {form.options.includes(opt)?"✓ ":""}{opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 최종 확인 */}
              <div style={{ background:"#1A1A1A", borderRadius:"20px", padding:"24px 28px" }}>
                <div style={{ fontSize:"15px", fontWeight:800, color:"white", marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" }}>
                  <DollarSign size={18} color="#FF3B1E"/> 등록 정보 최종 확인
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                  {[
                    ["차량명", `${form.brand} ${form.name}`],
                    ["연식", `${form.year}년식`],
                    ["주행거리", `${parseInt(form.mileage||"0").toLocaleString()}km`],
                    ["FIX 가격", `${parseInt(form.price||"0").toLocaleString()}만원`],
                    ["연료", form.fuel],
                    ["위치", form.region],
                    ["사진", `${images.length}장`],
                    ["사고이력", form.accident?"있음":"무사고"],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background:"rgba(255,255,255,0.06)", borderRadius:"8px" }}>
                      <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:400 }}>{k}</span>
                      <span style={{ fontSize:"12px", fontWeight:800, color:"white" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", gap:"12px" }}>
                <button onClick={()=>setStep(3)} style={{ background:"white", border:"2px solid #E0DDD7", borderRadius:"12px", padding:"14px 24px", fontSize:"14px", fontWeight:700, display:"flex", alignItems:"center", gap:"8px", cursor:"pointer" }}>
                  <ArrowLeft size={15}/> 이전
                </button>
                <button className="btn-red" style={{ flex:1 }} disabled={submitting} onClick={handleSubmit}>
                  {submitting ? "등록 중..." : <><CheckCircle size={16}/> 매물 등록 완료</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
