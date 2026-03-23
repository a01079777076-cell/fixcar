"use client";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Upload, X, Check } from "lucide-react";
import { BRAND_MODELS } from "@/data/catalog_data";

/* ═══ 브랜드→모델 매핑 (카탈로그 기반) ═══ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const brands = BRAND_MODELS as any;

function getBaseModels(brand: string): { base: string; variants: { name: string; status: string }[] }[] {
  const models = brands[brand]?.models || [];
  const groups: Record<string, { name: string; status: string }[]> = {};

  for (const m of models) {
    /* 기본 모델명 추출: "그랜저 GN7" → "그랜저", "아반떼 CN7" → "아반떼" */
    const parts = m.name.split(" ");
    let base = parts[0];
    /* 2단어 기본명 처리: "더 뉴", "올 뉴" 등 */
    if (parts.length >= 3 && ["더","올","뉴","디"].includes(parts[0])) {
      base = parts.slice(0, 2).join(" ");
    }
    if (!groups[base]) groups[base] = [];
    groups[base].push({ name: m.name, status: m.status || "" });
  }

  return Object.entries(groups).map(([base, variants]) => ({ base, variants }));
}

const FUEL_TYPES = ["가솔린","디젤","LPG","하이브리드","전기","수소"];
const COLORS = ["흰색","검정","은색","회색","파랑","빨강","노랑","초록","베이지","갈색","기타"];
const TRANSMISSIONS = ["자동","수동"];
const REGIONS = ["광주","전남","전북","서울","경기","인천","대전","대구","부산","울산","세종","충북","충남","경북","경남","강원","제주"];

const OPTION_CATEGORIES = [
  { name:"안전", items:["에어백(6개이상)","ABS","ESC","후방카메라","전방충돌방지","차선이탈경보","사각지대감지","어라운드뷰"] },
  { name:"편의", items:["스마트키","오토홀드","열선시트","통풍시트","전동시트","헤드업디스플레이","무선충전","파워트렁크"] },
  { name:"멀티미디어", items:["내비게이션","카플레이/AA","블루투스","USB충전","JBL/하만카돈/BOSE","후석모니터"] },
  { name:"외관", items:["LED헤드램프","선루프","파노라마선루프","루프랙","18인치이상휠","프라이버시유리"] },
  { name:"성능", items:["터보차저","AWD(사륜)","에어서스펜션","어댑티브크루즈","전자제어서스펜션","패들시프트"] },
];

export default function DealerCarsNewPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  /* 차량 정보 */
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBase, setSelectedBase] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [grade, setGrade] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState("가솔린");
  const [color, setColor] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [transmission, setTransmission] = useState("자동");
  const [cc, setCc] = useState("");
  const [owners, setOwners] = useState("1");
  const [accident, setAccident] = useState(false);
  const [plateNumber, setPlateNumber] = useState("");

  /* 판매 정보 */
  const [price, setPrice] = useState("");
  const [region, setRegion] = useState("광주");
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  /* 사진 (카테고리별) */
  const PHOTO_SLOTS = [
    { key:"main", label:"① 메인 사진", desc:"정면 또는 전측면 (대표 사진)", required:true },
    { key:"rear_angle", label:"② 후면 대각선", desc:"뒷쪽 45도 각도" },
    { key:"front", label:"③ 전면", desc:"정면 앞모습" },
    { key:"rear", label:"④ 후면", desc:"정면 뒷모습" },
    { key:"exterior1", label:"⑤ 외부 디테일 1", desc:"휠, 옵션 등" },
    { key:"exterior2", label:"⑥ 외부 디테일 2", desc:"추가 외부 사진" },
    { key:"interior1", label:"⑦ 실내 디테일 1", desc:"운전석, 계기판" },
    { key:"interior2", label:"⑧ 실내 디테일 2", desc:"뒷좌석, 트렁크 등" },
  ] as const;
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [uploadingSlot, setUploadingSlot] = useState<string|null>(null);

  /* 브랜드 목록 */
  const brandList = useMemo(() => Object.keys(brands).sort((a, b) => {
    const order = ["현대","기아","제네시스","KG모빌리티","르노코리아","쉐보레"];
    const ai = order.indexOf(a), bi = order.indexOf(b);
    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;
    return a.localeCompare(b);
  }), []);

  /* 기본 모델 목록 */
  const baseModels = useMemo(() => selectedBrand ? getBaseModels(selectedBrand) : [], [selectedBrand]);

  /* 세대/상세 모델 목록 */
  const modelVariants = useMemo(() => {
    if (!selectedBase) return [];
    const group = baseModels.find(g => g.base === selectedBase);
    return group?.variants || [];
  }, [selectedBase, baseModels]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedBase("");
    setSelectedModel("");
  };

  const handleBaseChange = (base: string) => {
    setSelectedBase(base);
    setSelectedModel("");
    /* 세대가 1개뿐이면 자동 선택 */
    const group = baseModels.find(g => g.base === base);
    if (group && group.variants.length === 1) {
      setSelectedModel(group.variants[0].name);
    }
  };

  const toggleOption = (opt: string) => {
    setOptions(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  };

  const handleSlotUpload = async (slotKey: string) => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploadingSlot(slotKey);
      const fd = new FormData(); fd.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.success && data.url) {
          setPhotos(prev => ({ ...prev, [slotKey]: data.url }));
        } else {
          alert("업로드 실패: " + (data.error || "Cloudinary 환경변수를 확인해주세요"));
        }
      } catch (err) {
        alert("업로드 중 오류가 발생했어요. 네트워크를 확인해주세요.");
      }
      setUploadingSlot(null);
    };
    input.click();
  };

  const validate = (s: number): string[] => {
    const errs: string[] = [];
    if (s === 1) {
      if (!selectedBrand) errs.push("제조사를 선택해주세요");
      if (!selectedModel) errs.push("모델을 선택해주세요");
      if (!mileage || Number(mileage) < 0) errs.push("주행거리를 입력해주세요");
      if (!color && !customColor) errs.push("색상을 선택해주세요");
      if (!plateNumber) errs.push("차량번호를 입력해주세요");
    }
    if (s === 2) {
      if (!price || Number(price) < 100) errs.push("판매가 100만원 이상 입력해주세요");
    }
    return errs;
  };

  const nextStep = () => {
    const errs = validate(step);
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const carName = `${selectedModel}${grade ? ` ${grade}` : ""}`;
      /* photos 객체를 순서대로 배열로 변환 */
      const orderedImages = PHOTO_SLOTS.map(s => photos[s.key]).filter(Boolean);
      const res = await fetch("/api/dealer/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: carName,
          brand: selectedBrand,
          year, mileage: Number(mileage), fuel,
          color: color === "기타" ? customColor : color,
          region, price: Number(price),
          cc: Number(cc) || 0,
          transmission, owners: Number(owners),
          accident, tags, options, images: orderedImages,
          description,
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else alert("등록 실패: " + (data.error || "다시 시도해주세요"));
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = { width:"100%", padding:"13px 16px", border:"1.5px solid #E0DDD7", borderRadius:10, fontSize:15, fontFamily:"'NanumSquareRound',sans-serif", background:"white" };
  const labelStyle: React.CSSProperties = { fontSize:13, fontWeight:800, display:"block", marginBottom:6 };

  /* 성공 화면 */
  if (submitted) return (
    <>
      <Navbar/>
      <div style={{ textAlign:"center", padding:"80px 20px", fontFamily:"'NanumSquareRound',sans-serif" }}>
        <div style={{ fontSize:60, marginBottom:20 }}>✅</div>
        <h2 style={{ fontSize:28, fontWeight:700, marginBottom:10, letterSpacing:"-0.5px" }}>매물 등록 완료!</h2>
        <p style={{ fontSize:16, color:"#888", fontWeight:400, marginBottom:28 }}>관리자 검수 후 게시됩니다.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <Link href="/dealer"><button style={{ padding:"14px 28px", background:"#0066FF", color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif" }}>내 매물 관리</button></Link>
          <button onClick={()=>{setSubmitted(false);setStep(1);}} style={{ padding:"14px 28px", background:"#F0F6FF", color:"#0066FF", border:"none", borderRadius:12, fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif" }}>추가 등록</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F4FF;} select:focus,input:focus,textarea:focus{outline:none;border-color:#0066FF!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F4FF"}}>
        <div style={{background:"white",borderBottom:"1px solid #DDEEFF",padding:"16px 24px"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <Link href="/dealer" style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:13,color:"#888",marginBottom:8,textDecoration:"none"}}><ChevronLeft size={14}/>딜러 대시보드</Link>
            <h1 style={{fontSize:22,fontWeight:800}}>차량 광고 등록</h1>
            {/* 스텝 표시 */}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              {["차량 정보","판매 정보","사진 업로드"].map((s,i)=>(
                <div key={i} style={{flex:1,textAlign:"center"}}>
                  <div style={{height:4,borderRadius:2,background:step>i?"#0066FF":step===i+1?"#0066FF":"#E0E8F0",marginBottom:4,opacity:step>i?0.4:1}}/>
                  <span style={{fontSize:11,fontWeight:step===i+1?800:500,color:step===i+1?"#0066FF":"#AAA"}}>{i+1}. {s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px 100px"}}>
          {errors.length>0&&(
            <div style={{background:"#FFF0ED",border:"1px solid #FFB8A8",borderRadius:12,padding:"14px 18px",marginBottom:16}}>
              {errors.map((e,i)=><div key={i} style={{fontSize:13,color:"#E24B4A",fontWeight:600}}>• {e}</div>)}
            </div>
          )}

          {/* ═══ STEP 1: 차량 정보 ═══ */}
          {step===1&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:20}}>🚗 차량 정보</h2>

              {/* 제조사 → 기본모델 → 세대 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div>
                  <label style={labelStyle}>제조사 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={selectedBrand} onChange={e=>handleBrandChange(e.target.value)} style={inputStyle}>
                    <option value="">선택</option>
                    <optgroup label="🇰🇷 국산">
                      {brandList.filter(b=>brands[b].category==="국산").map(b=><option key={b} value={b}>{b}</option>)}
                    </optgroup>
                    <optgroup label="🌍 수입">
                      {brandList.filter(b=>brands[b].category==="수입").map(b=><option key={b} value={b}>{b}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>모델명 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={selectedBase} onChange={e=>handleBaseChange(e.target.value)} style={inputStyle} disabled={!selectedBrand}>
                    <option value="">선택</option>
                    {baseModels.map(g=><option key={g.base} value={g.base}>{g.base} ({g.variants.length})</option>)}
                  </select>
                </div>
              </div>

              {/* 세대/상세 선택 (세대가 2개 이상일 때만) */}
              {selectedBase && modelVariants.length > 1 && (
                <div style={{marginBottom:16}}>
                  <label style={labelStyle}>세대/상세 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {modelVariants.map(v=>(
                      <button key={v.name} onClick={()=>setSelectedModel(v.name)} style={{
                        padding:"10px 16px",borderRadius:10,fontSize:13,fontWeight:selectedModel===v.name?800:500,
                        border:selectedModel===v.name?"2px solid #0066FF":"1.5px solid #E0DDD7",
                        background:selectedModel===v.name?"#EEF5FF":"white",
                        color:selectedModel===v.name?"#0066FF":"#555",cursor:"pointer",
                        fontFamily:"'NanumSquareRound',sans-serif",
                      }}>
                        {v.name}
                        <span style={{fontSize:10,color:v.status==="현행"?"#2D8A52":"#CCC",marginLeft:6}}>{v.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 선택된 모델 표시 */}
              {selectedModel && (
                <div style={{background:"#EEF5FF",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:14,fontWeight:700,color:"#0066FF"}}>
                  ✓ {selectedBrand} {selectedModel}
                </div>
              )}

              {/* 등급/트림 */}
              <div style={{marginBottom:16}}>
                <label style={labelStyle}>등급/트림</label>
                <input value={grade} onChange={e=>setGrade(e.target.value)} placeholder="예: 프리미엄, 인스퍼레이션" style={inputStyle}/>
              </div>

              {/* 연식 + 주행거리 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div>
                  <label style={labelStyle}>연식 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={year} onChange={e=>setYear(Number(e.target.value))} style={inputStyle}>
                    {Array.from({length:new Date().getFullYear()-1989},(_,i)=>new Date().getFullYear()-i).map(y=><option key={y} value={y}>{y}년</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>주행거리(km) <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input type="number" value={mileage} onChange={e=>setMileage(e.target.value)} placeholder="예: 35000" style={inputStyle}/>
                </div>
              </div>

              {/* 연료 + 변속기 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div>
                  <label style={labelStyle}>연료</label>
                  <select value={fuel} onChange={e=>setFuel(e.target.value)} style={inputStyle}>
                    {FUEL_TYPES.map(f=><option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>변속기</label>
                  <select value={transmission} onChange={e=>setTransmission(e.target.value)} style={inputStyle}>
                    {TRANSMISSIONS.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* 색상 */}
              <div style={{marginBottom:16}}>
                <label style={labelStyle}>색상 <span style={{color:"#FF3B1E"}}>*</span></label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {COLORS.map(c=>(
                    <button key={c} onClick={()=>setColor(c)} style={{
                      padding:"8px 14px",borderRadius:100,fontSize:12,fontWeight:color===c?800:500,
                      border:color===c?"2px solid #0066FF":"1.5px solid #E0DDD7",
                      background:color===c?"#EEF5FF":"white",color:color===c?"#0066FF":"#888",
                      cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                    }}>{c}</button>
                  ))}
                </div>
                {color==="기타"&&<input value={customColor} onChange={e=>setCustomColor(e.target.value)} placeholder="색상 직접 입력" style={{...inputStyle,marginTop:8}}/>}
              </div>

              {/* 배기량 + 소유자 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div>
                  <label style={labelStyle}>배기량(cc)</label>
                  <input type="number" value={cc} onChange={e=>setCc(e.target.value)} placeholder="예: 1998" style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>소유자 수</label>
                  <select value={owners} onChange={e=>setOwners(e.target.value)} style={inputStyle}>
                    {["1","2","3","4","5","6","7","8","9이상"].map(o=><option key={o} value={o}>{o}인</option>)}
                  </select>
                </div>
              </div>

              {/* 차량번호 + 사고이력 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div>
                  <label style={labelStyle}>차량번호 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input value={plateNumber} onChange={e=>setPlateNumber(e.target.value)} placeholder="12가1234" style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>사고이력</label>
                  <div style={{display:"flex",gap:8,marginTop:6}}>
                    <button onClick={()=>setAccident(false)} style={{flex:1,padding:"12px",borderRadius:10,border:!accident?"2px solid #2D8A52":"1.5px solid #E0DDD7",background:!accident?"#EAF6EF":"white",color:!accident?"#2D8A52":"#888",fontWeight:!accident?800:500,fontSize:14,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>무사고</button>
                    <button onClick={()=>setAccident(true)} style={{flex:1,padding:"12px",borderRadius:10,border:accident?"2px solid #E24B4A":"1.5px solid #E0DDD7",background:accident?"#FFF0ED":"white",color:accident?"#E24B4A":"#888",fontWeight:accident?800:500,fontSize:14,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>사고 있음</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ STEP 2: 판매 정보 ═══ */}
          {step===2&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:20}}>💰 판매 정보</h2>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div>
                  <label style={labelStyle}>판매가(만원) <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="예: 2500" style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>지역</label>
                  <select value={region} onChange={e=>setRegion(e.target.value)} style={inputStyle}>
                    {REGIONS.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div style={{marginBottom:16}}>
                <label style={labelStyle}>차량 설명</label>
                <textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)} placeholder="차량 상태, 특이사항 등을 자유롭게 적어주세요 (최대 3000자)" maxLength={3000} style={{...inputStyle,resize:"none"}}/>
              </div>

              {/* 옵션 */}
              <div style={{marginBottom:16}}>
                <label style={labelStyle}>옵션 선택</label>
                {OPTION_CATEGORIES.map(cat=>(
                  <div key={cat.name} style={{marginBottom:12}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#0066FF",marginBottom:6}}>{cat.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {cat.items.map(item=>(
                        <button key={item} onClick={()=>toggleOption(item)} style={{
                          padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:options.includes(item)?800:500,
                          border:options.includes(item)?"2px solid #0066FF":"1px solid #E0DDD7",
                          background:options.includes(item)?"#EEF5FF":"white",color:options.includes(item)?"#0066FF":"#888",
                          cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                        }}>{options.includes(item)&&<Check size={10} style={{marginRight:3}}/>}{item}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ STEP 3: 사진 ═══ */}
          {step===3&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:6}}>📷 사진 업로드</h2>
              <p style={{fontSize:13,color:"#AAA",marginBottom:20}}>순서대로 사진을 등록해주세요. 메인 사진은 필수!</p>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {PHOTO_SLOTS.map((slot) => {
                  const url = photos[slot.key];
                  const isUploading = uploadingSlot === slot.key;
                  return (
                    <div key={slot.key} style={{
                      border: url ? "2px solid #0066FF" : slot.required ? "2px dashed #FFB8A8" : "2px dashed #DDEEFF",
                      borderRadius: 14, overflow: "hidden", background: url ? "white" : "#F8FAFF",
                    }}>
                      {url ? (
                        <div style={{ position: "relative" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={slot.label} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)", padding: "8px 12px" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "white" }}>{slot.label}</span>
                          </div>
                          <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 4 }}>
                            <button onClick={() => handleSlotUpload(slot.key)} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>↺</button>
                            <button onClick={() => setPhotos(prev => { const n = { ...prev }; delete n[slot.key]; return n; })} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => handleSlotUpload(slot.key)} disabled={isUploading} style={{
                          width: "100%", aspectRatio: "4/3", border: "none", background: "transparent",
                          cursor: isUploading ? "wait" : "pointer", display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center", gap: 6, padding: 16,
                          fontFamily: "'NanumSquareRound',sans-serif",
                        }}>
                          {isUploading ? (
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0066FF" }}>업로드 중...</div>
                          ) : (
                            <>
                              <Upload size={22} color={slot.required ? "#FF3B1E" : "#0066FF"} />
                              <div style={{ fontSize: 12, fontWeight: 800, color: slot.required ? "#FF3B1E" : "#0066FF" }}>{slot.label}</div>
                              <div style={{ fontSize: 10, color: "#AAA" }}>{slot.desc}</div>
                              {slot.required && <div style={{ fontSize: 9, color: "#FF3B1E", fontWeight: 700, marginTop: 2 }}>필수</div>}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 업로드 현황 */}
              <div style={{ marginTop: 16, fontSize: 13, color: "#888", textAlign: "center" }}>
                {Object.keys(photos).length} / {PHOTO_SLOTS.length}장 등록됨
                {!photos.main && <span style={{ color: "#FF3B1E", fontWeight: 700, marginLeft: 8 }}>⚠️ 메인 사진 필수</span>}
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div style={{display:"flex",gap:10,marginTop:20}}>
            {step>1&&(
              <button onClick={()=>setStep(step-1)} style={{padding:"16px 24px",background:"white",border:"1.5px solid #E0DDD7",borderRadius:14,fontSize:15,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                <ChevronLeft size={16} style={{verticalAlign:"middle"}}/> 이전
              </button>
            )}
            {step<3?(
              <button onClick={nextStep} style={{flex:1,padding:"16px",background:"#0066FF",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                다음 <ChevronRight size={16}/>
              </button>
            ):(
              <button onClick={handleSubmit} disabled={saving} style={{flex:1,padding:"16px",background:saving?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                {saving?"등록 중...":"매물 등록하기"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
