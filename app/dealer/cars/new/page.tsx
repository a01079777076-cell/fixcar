"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Upload, X, AlertCircle } from "lucide-react";
import RoleGuard from "@/components/RoleGuard";

/* 국산 브랜드 + 모델 (카탈로그 연동) */
const BRANDS: Record<string, string[]> = {
  "현대":["아반떼","쏘나타","그랜저","투싼","싼타페","팰리세이드","코나","베뉴","캐스퍼","아이오닉5","아이오닉6","스타리아","포터"],
  "기아":["K3","K5","K8","K9","셀토스","스포티지","쏘렌토","카니발","모닝","레이","EV6","EV9","니로"],
  "제네시스":["G70","G80","G90","GV60","GV70","GV80"],
  "쉐보레":["스파크","말리부","트레일블레이저","이쿼녹스","트래버스","콜로라도","타호"],
  "르노":["SM6","XM3","QM6","마스터","아르카나"],
  "KG모빌리티":["티볼리","코란도","렉스턴","토레스","액티언"],
  "BMW":["1시리즈","3시리즈","5시리즈","7시리즈","X1","X3","X5","X7","iX","i4"],
  "벤츠":["A클래스","C클래스","E클래스","S클래스","GLA","GLC","GLE","GLS","EQE","EQS"],
  "아우디":["A3","A4","A6","A8","Q3","Q5","Q7","Q8","e-tron"],
  "폭스바겐":["골프","티구안","투아렉","ID.4","아테온"],
  "볼보":["S60","S90","XC40","XC60","XC90","EX30","EX90"],
  "테슬라":["모델3","모델Y","모델S","모델X"],
  "토요타":["캠리","프리우스","RAV4","하이랜더","랜드크루저"],
  "렉서스":["ES","IS","LS","NX","RX","UX","LC"],
  "혼다":["시빅","어코드","CR-V","HR-V"],
  "포르쉐":["911","카이엔","마칸","파나메라","타이칸"],
  "기타":["직접입력"],
};

const FUEL_TYPES = ["가솔린","디젤","LPG","전기","하이브리드(가솔린)","하이브리드(디젤)","플러그인하이브리드"];
const TRANSMISSIONS = ["자동","수동","CVT","DCT"];
const COLORS = ["흰색","검정","은색","회색","빨강","파랑","초록","노랑","갈색","베이지","기타"];
const OWNERS = ["1인","2인","3인","4인","5인","6인","7인","8인","9인","9인 이상"];
const currentYear = new Date().getFullYear();

function DealerCarNewContent() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* 차량 정보 */
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [grade, setGrade] = useState("");
  const [year, setYear] = useState(String(currentYear));
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("자동");
  const [color, setColor] = useState("");
  const [owners, setOwners] = useState("1인");
  const [plateNumber, setPlateNumber] = useState("");

  /* 판매 정보 */
  const [price, setPrice] = useState("");
  const [listingNote, setListingNote] = useState("");
  const [description, setDescription] = useState("");
  const [accident, setAccident] = useState(false);
  const [accidentDetail, setAccidentDetail] = useState("");

  /* 이미지 */
  const [images, setImages] = useState<string[]>([]);

  const models = brand && brand !== "기타" ? (BRANDS[brand] || []) : [];

  /* 스텝 1 검증 */
  const validateStep1 = (): string[] => {
    const errs: string[] = [];
    if (!brand) errs.push("제조사를 선택해주세요");
    if (!model && !customModel) errs.push("모델명을 선택해주세요");
    if (!year) errs.push("연식을 선택해주세요");
    if (Number(year) > currentYear) errs.push(`연식은 ${currentYear}년까지만 선택 가능합니다`);
    if (!mileage) errs.push("주행거리를 입력해주세요");
    if (!fuel) errs.push("연료를 선택해주세요");
    if (!color) errs.push("색상을 선택해주세요");
    return errs;
  };

  /* 스텝 2 검증 */
  const validateStep2 = (): string[] => {
    const errs: string[] = [];
    if (!price || Number(price) < 100) errs.push("판매가는 100만원 이상이어야 합니다");
    if (listingNote.length > 30) errs.push("목록 문구는 30자 이내로 입력해주세요");
    if (description.length > 3000) errs.push("차량 설명은 3000자 이내로 입력해주세요");
    return errs;
  };

  const goNext = () => {
    let errs: string[] = [];
    if (step === 1) errs = validateStep1();
    if (step === 2) errs = validateStep2();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setStep(p => p + 1);
  };

  const handleSubmit = async () => {
    const errs = [...validateStep1(), ...validateStep2()];
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setSubmitting(true);

    try {
      const finalModel = model === "직접입력" ? customModel : model;
      const res = await fetch("/api/dealer/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${brand} ${finalModel} ${grade}`.trim(),
          brand,
          year: Number(year),
          mileage: Number(mileage),
          price: Number(price),
          fuel,
          transmission,
          color,
          region: "광주",
          accident,
          images,
          tags: [accident ? "사고이력" : "무사고", `${owners} 소유`],
        }),
      });
      const data = await res.json();
      if (data.success) { setSubmitted(true); }
      else { setErrors([data.error || "등록 실패"]); }
    } catch (e) { setErrors(["네트워크 오류: " + String(e)]); }
    setSubmitting(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "fixcar");
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "fixcar"}/image/upload`, {
          method: "POST", body: formData,
        });
        const data = await res.json();
        if (data.secure_url) setImages(prev => [...prev, data.secure_url]);
      } catch { /* skip */ }
    }
  };

  if (submitted) return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ fontSize:60, marginBottom:20 }}>✅</div>
      <h2 style={{ fontSize:24, fontWeight:800, marginBottom:10 }}>매물 등록 완료!</h2>
      <p style={{ fontSize:15, color:"#888", fontWeight:400, marginBottom:28 }}>관리자 검수 후 게시됩니다.</p>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <Link href="/dealer/cars"><button style={{ padding:"14px 28px", background:"#0066FF", color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:800, cursor:"pointer" }}>내 매물 관리</button></Link>
        <button onClick={()=>{setSubmitted(false);setStep(1);}} style={{ padding:"14px 28px", background:"#F0F6FF", color:"#0066FF", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer" }}>추가 등록</button>
      </div>
    </div>
  );

  const S = {label:{fontSize:13,fontWeight:800 as const,display:"block" as const,marginBottom:6,color:"#1A1A1A"},
    input:{width:"100%",padding:"13px 16px",border:"1.5px solid #DDEEFF",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif",background:"white"},
    select:{width:"100%",padding:"13px 16px",border:"1.5px solid #DDEEFF",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif",background:"white",cursor:"pointer" as const},
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#0066FF!important;}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0F6FF" }}>
        {/* 헤더 */}
        <div style={{ background:"white", borderBottom:"1.5px solid #DDEEFF", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/dealer" style={{ display:"flex", alignItems:"center", gap:8, fontWeight:700, color:"#888", fontSize:14 }}>
            <ChevronLeft size={18}/> 대시보드
          </Link>
          <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:22, letterSpacing:2 }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span><span style={{ color:"#1A1A1A" }}>CAR</span>
            <span style={{ fontSize:11, fontWeight:800, color:"#0066FF", marginLeft:8 }}>새 매물 등록</span>
          </div>
          <div style={{ width:80 }} />
        </div>

        <div style={{ maxWidth:700, margin:"0 auto", padding:"28px 20px 80px" }}>
          {/* 스텝 인디케이터 */}
          <div style={{ display:"flex", gap:8, marginBottom:28 }}>
            {["차량 정보","판매 정보","사진 등록"].map((label,i)=>(
              <div key={label} style={{ flex:1, textAlign:"center" }}>
                <div style={{ height:4, borderRadius:2, background: step>i?"#0066FF":step===i+1?"#0066FF":"#DDEEFF", marginBottom:8, transition:"all 0.3s" }} />
                <span style={{ fontSize:12, fontWeight:step===i+1?800:400, color:step===i+1?"#0066FF":"#AAA" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* 에러 표시 */}
          {errors.length > 0 && (
            <div style={{ background:"#FFF0ED", border:"1px solid #FFB8A8", borderRadius:14, padding:"14px 18px", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <AlertCircle size={16} color="#FF3B1E"/>
                <span style={{ fontSize:14, fontWeight:800, color:"#FF3B1E" }}>필수 항목을 확인해주세요</span>
              </div>
              {errors.map((err,i)=>(<div key={i} style={{ fontSize:13, color:"#CC3322", fontWeight:400, paddingLeft:24 }}>• {err}</div>))}
            </div>
          )}

          {/* ═══ STEP 1: 차량 정보 ═══ */}
          {step===1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"white", borderRadius:18, padding:"24px 22px" }}>
                <h3 style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>차량 기본 정보</h3>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label style={S.label}>제조사 <span style={{color:"#FF3B1E"}}>*</span></label>
                    <select value={brand} onChange={e=>{setBrand(e.target.value);setModel("");}} style={S.select}>
                      <option value="">선택</option>
                      {Object.keys(BRANDS).map(b=><option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>모델명 <span style={{color:"#FF3B1E"}}>*</span></label>
                    {models.length > 0 ? (
                      <select value={model} onChange={e=>setModel(e.target.value)} style={S.select}>
                        <option value="">선택</option>
                        {models.map(m=><option key={m} value={m}>{m}</option>)}
                      </select>
                    ) : (
                      <input type="text" value={customModel} onChange={e=>setCustomModel(e.target.value)} placeholder="모델명 직접입력" style={S.input} />
                    )}
                  </div>
                </div>

                <div style={{ marginTop:14 }}>
                  <label style={S.label}>등급/트림</label>
                  <input type="text" value={grade} onChange={e=>setGrade(e.target.value)} placeholder="예: 프리미엄, 인스퍼레이션" style={S.input} />
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginTop:14 }}>
                  <div>
                    <label style={S.label}>연식 <span style={{color:"#FF3B1E"}}>*</span></label>
                    <select value={year} onChange={e=>{if(Number(e.target.value)>currentYear){alert(`${currentYear}년까지만 선택 가능합니다`);return;}setYear(e.target.value);}} style={S.select}>
                      {Array.from({length:currentYear-1950+1},(_,i)=>currentYear-i).map(y=>(
                        <option key={y} value={y}>{y}년</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>주행거리 <span style={{color:"#FF3B1E"}}>*</span></label>
                    <input type="number" value={mileage} onChange={e=>setMileage(e.target.value)} placeholder="km" style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>소유자 변경</label>
                    <select value={owners} onChange={e=>setOwners(e.target.value)} style={S.select}>
                      {OWNERS.map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginTop:14 }}>
                  <div>
                    <label style={S.label}>연료 <span style={{color:"#FF3B1E"}}>*</span></label>
                    <select value={fuel} onChange={e=>setFuel(e.target.value)} style={S.select}>
                      <option value="">선택</option>
                      {FUEL_TYPES.map(f=><option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>변속기</label>
                    <select value={transmission} onChange={e=>setTransmission(e.target.value)} style={S.select}>
                      {TRANSMISSIONS.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>색상 <span style={{color:"#FF3B1E"}}>*</span></label>
                    <select value={color} onChange={e=>setColor(e.target.value)} style={S.select}>
                      <option value="">선택</option>
                      {COLORS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop:14 }}>
                  <label style={S.label}>차량번호</label>
                  <input type="text" value={plateNumber} onChange={e=>setPlateNumber(e.target.value)} placeholder="예: 12가1234" style={S.input} />
                </div>
              </div>

              {/* 사고이력 */}
              <div style={{ background:"white", borderRadius:18, padding:"24px 22px" }}>
                <h3 style={{ fontSize:18, fontWeight:800, marginBottom:16 }}>사고이력 정보</h3>
                <p style={{ fontSize:12, color:"#888", fontWeight:400, marginBottom:14 }}>사고이력은 무조건 공개됩니다. 허위 기재 시 즉시 삭제 및 이용 제한됩니다.</p>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>setAccident(false)} style={{ flex:1, padding:"14px", borderRadius:12, border: !accident?"2px solid #0066FF":"1.5px solid #DDEEFF", background:!accident?"#EEF5FF":"white", color:!accident?"#0066FF":"#888", fontSize:14, fontWeight:800 }}>무사고</button>
                  <button onClick={()=>setAccident(true)} style={{ flex:1, padding:"14px", borderRadius:12, border: accident?"2px solid #FF3B1E":"1.5px solid #DDEEFF", background:accident?"#FFF0ED":"white", color:accident?"#FF3B1E":"#888", fontSize:14, fontWeight:800 }}>사고이력 있음</button>
                </div>
                {accident && (
                  <textarea rows={3} value={accidentDetail} onChange={e=>setAccidentDetail(e.target.value)} placeholder="사고 내역을 상세히 기재해주세요" style={{ ...S.input, marginTop:14, resize:"none" as const }} />
                )}
              </div>

              <button onClick={goNext} style={{ width:"100%", padding:"18px", background:"#0066FF", color:"white", border:"none", borderRadius:14, fontSize:16, fontWeight:800 }}>
                다음 단계 <ChevronRight size={16} style={{verticalAlign:"middle"}} />
              </button>
            </div>
          )}

          {/* ═══ STEP 2: 판매 정보 ═══ */}
          {step===2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"white", borderRadius:18, padding:"24px 22px" }}>
                <h3 style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>판매 정보</h3>

                <div>
                  <label style={S.label}>판매가 (만원) <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="예: 1500" style={S.input} />
                  {price && Number(price) < 100 && <p style={{ fontSize:12, color:"#FF3B1E", marginTop:6 }}>⚠️ 100만원 이상부터 등록 가능합니다</p>}
                </div>

                <div style={{ marginTop:14 }}>
                  <label style={S.label}>목록 문구 (30자 이내)</label>
                  <input type="text" value={listingNote} onChange={e=>{if(e.target.value.length<=30)setListingNote(e.target.value)}} placeholder="매물 리스트에 표시될 한줄 문구" style={S.input} />
                  <div style={{ fontSize:11, color: listingNote.length>25?"#FF3B1E":"#CCC", textAlign:"right", marginTop:4 }}>{listingNote.length}/30</div>
                </div>

                <div style={{ marginTop:14 }}>
                  <label style={S.label}>차량 설명 (최대 3000자)</label>
                  <textarea rows={8} value={description} onChange={e=>{if(e.target.value.length<=3000)setDescription(e.target.value)}} placeholder="차량 상태, 옵션, 특이사항 등을 자세히 적어주세요" style={{ ...S.input, resize:"none" as const }} />
                  <div style={{ fontSize:11, color: description.length>2800?"#FF3B1E":"#CCC", textAlign:"right", marginTop:4 }}>{description.length}/3000</div>
                </div>
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <button onClick={()=>{setStep(1);setErrors([]);}} style={{ flex:1, padding:"18px", background:"white", color:"#888", border:"1.5px solid #DDEEFF", borderRadius:14, fontSize:16, fontWeight:700 }}>
                  <ChevronLeft size={16} style={{verticalAlign:"middle"}} /> 이전
                </button>
                <button onClick={goNext} style={{ flex:2, padding:"18px", background:"#0066FF", color:"white", border:"none", borderRadius:14, fontSize:16, fontWeight:800 }}>
                  다음 단계 <ChevronRight size={16} style={{verticalAlign:"middle"}} />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: 사진 등록 ═══ */}
          {step===3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"white", borderRadius:18, padding:"24px 22px" }}>
                <h3 style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>차량 사진 등록</h3>
                <p style={{ fontSize:13, color:"#888", fontWeight:400, marginBottom:20 }}>최소 1장 ~ 최대 20장까지 등록 가능합니다</p>

                {/* 업로드 영역 */}
                <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:160, border:"2px dashed #DDEEFF", borderRadius:16, cursor:"pointer", background:"#F8FBFF" }}>
                  <Upload size={32} color="#0066FF" style={{ marginBottom:8 }} />
                  <span style={{ fontSize:14, fontWeight:700, color:"#0066FF" }}>사진 추가하기</span>
                  <span style={{ fontSize:12, color:"#AAA", marginTop:4 }}>클릭하여 사진을 선택하세요</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display:"none" }} />
                </label>

                {/* 미리보기 */}
                {images.length > 0 && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginTop:16 }}>
                    {images.map((img, i) => (
                      <div key={i} style={{ position:"relative", borderRadius:10, overflow:"hidden", aspectRatio:"4/3" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))} style={{ position:"absolute", top:4, right:4, width:24, height:24, borderRadius:"50%", background:"rgba(0,0,0,0.6)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                          <X size={14} color="white" />
                        </button>
                        {i===0 && <span style={{ position:"absolute", bottom:4, left:4, background:"#0066FF", color:"white", padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:800 }}>대표</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 등록 요약 */}
              <div style={{ background:"white", borderRadius:18, padding:"20px 22px" }}>
                <h3 style={{ fontSize:16, fontWeight:800, marginBottom:14 }}>등록 요약</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:13 }}>
                  {[
                    ["차량", `${brand} ${model||customModel} ${grade}`],
                    ["연식", `${year}년`],
                    ["주행거리", `${Number(mileage).toLocaleString()}km`],
                    ["판매가", `${Number(price).toLocaleString()}만원`],
                    ["연료", fuel],
                    ["사고", accident?"있음":"무사고"],
                    ["사진", `${images.length}장`],
                  ].map(([k,v])=>(
                    <div key={k as string} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #F0EEE9" }}>
                      <span style={{ color:"#AAA" }}>{k}</span>
                      <span style={{ fontWeight:700 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <button onClick={()=>{setStep(2);setErrors([]);}} style={{ flex:1, padding:"18px", background:"white", color:"#888", border:"1.5px solid #DDEEFF", borderRadius:14, fontSize:16, fontWeight:700 }}>
                  <ChevronLeft size={16} style={{verticalAlign:"middle"}} /> 이전
                </button>
                <button onClick={handleSubmit} disabled={submitting} style={{ flex:2, padding:"18px", background:submitting?"#CCC":"#FF3B1E", color:"white", border:"none", borderRadius:14, fontSize:16, fontWeight:800 }}>
                  {submitting ? "등록 중..." : "🚗 매물 등록하기"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function DealerCarNewPage() {
  return (
    <RoleGuard allowedRoles={["DEALER","ADMIN"]}>
      <DealerCarNewContent />
    </RoleGuard>
  );
}
