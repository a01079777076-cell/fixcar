"use client";
import { useState, useMemo, useRef } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Upload, X, Check, Shield } from "lucide-react";
import { BRAND_MODELS, CAR_GRADES } from "@/data/catalog_data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const brands = BRAND_MODELS as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gradeData = CAR_GRADES as any;

function getBaseModels(brand: string): { base: string; variants: { name: string; status: string }[] }[] {
  const models = brands[brand]?.models || [];
  const groups: Record<string, { name: string; status: string }[]> = {};
  for (const m of models) {
    const parts = m.name.split(" ");
    let base = parts[0];
    if (parts.length >= 3 && ["더","올","뉴","디"].includes(parts[0])) base = parts.slice(0,2).join(" ");
    if (!groups[base]) groups[base] = [];
    groups[base].push({ name: m.name, status: m.status || "" });
  }
  return Object.entries(groups).map(([base, variants]) => ({ base, variants }));
}

function detectFuelFromEngine(engine: string): string {
  if (!engine) return "가솔린";
  const e = engine.toLowerCase();
  if (e.includes("ev")||e.includes("모터")||e.includes("전기")||e.includes("kwh")) return "전기";
  if (e.includes("hev")||e.includes("하이브리드")||e.includes("phev")) return "하이브리드";
  if (e.includes("crdi")||e.includes("디젤")||e.includes("diesel")) return "디젤";
  if (e.includes("lpg")||e.includes("lpi")) return "LPG";
  if (e.includes("수소")||e.includes("fcev")) return "수소";
  return "가솔린";
}

const FUEL_TYPES     = ["가솔린","디젤","LPG","하이브리드","전기","수소"];
const COLORS         = ["흰색","검정","은색","회색","파랑","빨강","노랑","초록","베이지","갈색","기타"];
const TRANSMISSIONS  = ["자동","수동"];
const REGIONS        = ["광주","전남","전북","서울","경기","인천","대전","대구","부산","울산","세종","충북","충남","경북","경남","강원","제주"];
const OPTION_CATS    = [
  {name:"안전",items:["에어백(6개이상)","ABS","ESC","후방카메라","전방충돌방지","차선이탈경보","사각지대감지","어라운드뷰"]},
  {name:"편의",items:["스마트키","오토홀드","열선시트","통풍시트","전동시트","헤드업디스플레이","무선충전","파워트렁크"]},
  {name:"멀티미디어",items:["내비게이션","카플레이/AA","블루투스","USB충전","JBL/하만카돈/BOSE","후석모니터"]},
  {name:"외관",items:["LED헤드램프","선루프","파노라마선루프","루프랙","18인치이상휠","프라이버시유리"]},
  {name:"성능",items:["터보차저","AWD(사륜)","에어서스펜션","어댑티브크루즈","전자제어서스펜션","패들시프트"]},
];

/* ═══ 성능점검 데이터 ═══ */
/* 외판 1·2랭크 */
const PANEL_1RANK = ["후드","프론트 헨더(좌)","프론트 헨더(우)","프론트 도어(좌)","프론트 도어(우)","리어 도어(좌)","리어 도어(우)","트렁크리드","라디에이터 서포트(볼트체결부품)","루프 패널","쿼터 패널(리어펜더)(좌)","쿼터 패널(리어펜더)(우)","사이드실 패널(좌)","사이드실 패널(우)"];
const PANEL_ARANK = ["프론트 패널","크로스 멤버","인사이드 패널(좌)","인사이드 패널(우)","리어 패널","트렁크 플로어"];
const PANEL_BRANK = ["프론트 사이드 멤버(좌)","프론트 사이드 멤버(우)","리어 사이드 멤버(좌)","리어 사이드 멤버(우)","프론트 휠하우스(좌)","프론트 휠하우스(우)","리어 휠하우스(좌)","리어 휠하우스(우)","필러 패널A(좌)","필러 패널A(우)","필러 패널B(좌)","필러 패널B(우)","필러 패널C(좌)","필러 패널C(우)","패키지트레이","대쉬 패널"];
const PANEL_CRANK = ["플로어 패널(바닥)"];
const DAMAGE_COLS = ["교환","판금/용접","부식","흠집","요철","손상"];

type DamageRow = { 교환:boolean; "판금/용접":boolean; 부식:boolean; 흠집:boolean; 요철:boolean; 손상:boolean; };
function emptyDamage(): DamageRow { return {교환:false,"판금/용접":false,부식:false,흠집:false,요철:false,손상:false}; }
function initDamageMap(items: string[]): Record<string, DamageRow> {
  return Object.fromEntries(items.map(i => [i, emptyDamage()]));
}

/* 세부사항 항목 */
type GoodBad = "양호"|"불량"|"";
type OilState = "없음"|"미세누유"|"누유"|"";
type OilLevel = "적정"|"부족"|"과다"|"";

/* ═══ SVG 가이드 ═══ */
function PhotoGuideSvg({ type }: { type: "front34"|"rear34"|"front"|"rear" }) {
  const bc="#D6E4F0",lc="#90A8C0",ac="#FF3B1E";
  if(type==="front34") return (
    <svg width={140} height={105} viewBox="0 0 140 105" fill="none">
      <rect x="25" y="42" width="90" height="36" rx="8" fill={bc} stroke={lc} strokeWidth="1.5"/>
      <path d="M40 42 L50 24 L95 24 L105 42" fill={bc} stroke={lc} strokeWidth="1.5"/>
      <path d="M52 41 L57 28 L90 28 L98 41" fill="#B8D4E8" stroke={lc} strokeWidth="1"/>
      <rect x="27" y="48" width="14" height="6" rx="3" fill="#FFF3B0" stroke={lc} strokeWidth="1"/>
      <rect x="99" y="48" width="14" height="6" rx="3" fill="#FFF3B0" stroke={lc} strokeWidth="1"/>
      <circle cx="48" cy="78" r="11" fill="#555" stroke="#333" strokeWidth="1.5"/><circle cx="48" cy="78" r="4" fill="#888"/>
      <circle cx="102" cy="78" r="11" fill="#555" stroke="#333" strokeWidth="1.5"/><circle cx="102" cy="78" r="4" fill="#888"/>
      <path d="M15 15 L35 35" stroke={ac} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6"/>
      <circle cx="12" cy="12" r="4" fill={ac} opacity="0.6"/>
    </svg>
  );
  if(type==="rear34") return (
    <svg width={140} height={105} viewBox="0 0 140 105" fill="none">
      <rect x="25" y="42" width="90" height="36" rx="8" fill={bc} stroke={lc} strokeWidth="1.5"/>
      <path d="M35 42 L45 24 L90 24 L100 42" fill={bc} stroke={lc} strokeWidth="1.5"/>
      <path d="M42 41 L50 28 L85 28 L93 41" fill="#B8D4E8" stroke={lc} strokeWidth="1"/>
      <rect x="27" y="50" width="14" height="5" rx="2" fill="#FF6B6B" stroke={lc} strokeWidth="1"/>
      <rect x="99" y="50" width="14" height="5" rx="2" fill="#FF6B6B" stroke={lc} strokeWidth="1"/>
      <circle cx="42" cy="78" r="11" fill="#555" stroke="#333" strokeWidth="1.5"/><circle cx="42" cy="78" r="4" fill="#888"/>
      <circle cx="96" cy="78" r="11" fill="#555" stroke="#333" strokeWidth="1.5"/><circle cx="96" cy="78" r="4" fill="#888"/>
      <path d="M125 15 L105 35" stroke={ac} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6"/>
      <circle cx="128" cy="12" r="4" fill={ac} opacity="0.6"/>
    </svg>
  );
  if(type==="front") return (
    <svg width={140} height={105} viewBox="0 0 140 105" fill="none">
      <rect x="20" y="40" width="100" height="38" rx="10" fill={bc} stroke={lc} strokeWidth="1.5"/>
      <path d="M35 40 L45 22 L95 22 L105 40" fill={bc} stroke={lc} strokeWidth="1.5"/>
      <path d="M48 39 L53 26 L87 26 L92 39" fill="#B8D4E8" stroke={lc} strokeWidth="1"/>
      <rect x="40" y="58" width="60" height="10" rx="4" fill="#AAC0D0" stroke={lc} strokeWidth="1"/>
      <rect x="22" y="48" width="16" height="8" rx="4" fill="#FFF3B0" stroke={lc} strokeWidth="1"/>
      <rect x="102" y="48" width="16" height="8" rx="4" fill="#FFF3B0" stroke={lc} strokeWidth="1"/>
      <ellipse cx="35" cy="78" rx="13" ry="11" fill="#555" stroke="#333" strokeWidth="1.5"/>
      <ellipse cx="105" cy="78" rx="13" ry="11" fill="#555" stroke="#333" strokeWidth="1.5"/>
      <path d="M70 8 L70 22" stroke={ac} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6"/>
      <circle cx="70" cy="5" r="4" fill={ac} opacity="0.6"/>
    </svg>
  );
  return (
    <svg width={140} height={105} viewBox="0 0 140 105" fill="none">
      <rect x="20" y="40" width="100" height="38" rx="10" fill={bc} stroke={lc} strokeWidth="1.5"/>
      <path d="M35 40 L45 22 L95 22 L105 40" fill={bc} stroke={lc} strokeWidth="1.5"/>
      <path d="M48 39 L53 26 L87 26 L92 39" fill="#B8D4E8" stroke={lc} strokeWidth="1"/>
      <rect x="22" y="48" width="16" height="7" rx="3" fill="#FF6B6B" stroke={lc} strokeWidth="1"/>
      <rect x="102" y="48" width="16" height="7" rx="3" fill="#FF6B6B" stroke={lc} strokeWidth="1"/>
      <rect x="48" y="58" width="44" height="12" rx="3" fill="white" stroke={lc} strokeWidth="1"/>
      <text x="70" y="67" textAnchor="middle" fontSize="7" fill={lc} fontWeight="bold">00가0000</text>
      <ellipse cx="35" cy="78" rx="13" ry="11" fill="#555" stroke="#333" strokeWidth="1.5"/>
      <ellipse cx="105" cy="78" rx="13" ry="11" fill="#555" stroke="#333" strokeWidth="1.5"/>
      <path d="M70 8 L70 22" stroke={ac} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6"/>
      <circle cx="70" cy="5" r="4" fill={ac} opacity="0.6"/>
    </svg>
  );
}

const MAIN_SLOTS_DATA = [
  { key:"main1", label:"① 전면 3/4",  guide:"왼쪽 앞 대각선에서 촬영",   svgType:"front34" as const },
  { key:"main2", label:"② 후면 3/4",  guide:"오른쪽 뒤 대각선에서 촬영", svgType:"rear34"  as const },
  { key:"main3", label:"③ 전면",       guide:"차량 앞에서 정면 촬영",      svgType:"front"   as const },
  { key:"main4", label:"④ 후면",       guide:"차량 뒤에서 정면 촬영",      svgType:"rear"    as const },
];

/* ═══ 간단 라디오 버튼 컴포넌트 ═══ */
function RG({ value, options, onChange }: { value:string; options:string[]; onChange:(v:string)=>void }) {
  return (
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      {options.map(o=>(
        <label key={o} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer",fontWeight:value===o?700:400}}>
          <input type="radio" checked={value===o} onChange={()=>onChange(o)} style={{accentColor:"#0066FF",width:14,height:14}}/>
          {o}
        </label>
      ))}
    </div>
  );
}

/* ═══ 손상 체크박스 테이블 ═══ */
function DamageTable({ title, rank, items, data, onChange }:{
  title:string; rank:string; items:string[];
  data:Record<string,DamageRow>;
  onChange:(item:string,col:keyof DamageRow,v:boolean)=>void;
}) {
  return (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:800,color:"#333",background:"#F0F4FF",padding:"8px 12px",borderRadius:"8px 8px 0 0",borderBottom:"1px solid #DDEEFF",display:"flex",gap:8,alignItems:"center"}}>
        <span style={{background:"#0066FF",color:"white",fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:4}}>{rank}</span>
        {title}
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:"#F8F9FF"}}>
              <th style={{textAlign:"left",padding:"8px 10px",borderBottom:"1px solid #E8EEFF",fontWeight:700,minWidth:140}}>부위</th>
              {DAMAGE_COLS.map(c=>(
                <th key={c} style={{textAlign:"center",padding:"8px 6px",borderBottom:"1px solid #E8EEFF",fontWeight:700,minWidth:52,color:c==="교환"?"#FF3B1E":c==="판금/용접"?"#E8A020":"#555"}}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item,i)=>(
              <tr key={item} style={{background:i%2===0?"white":"#FAFBFF"}}>
                <td style={{padding:"7px 10px",borderBottom:"1px solid #F0F4FF",fontSize:12,color:"#444"}}>{item}</td>
                {DAMAGE_COLS.map(col=>(
                  <td key={col} style={{textAlign:"center",padding:"7px 4px",borderBottom:"1px solid #F0F4FF"}}>
                    <input type="checkbox" checked={data[item]?.[col as keyof DamageRow]||false}
                      onChange={e=>onChange(item,col as keyof DamageRow,e.target.checked)}
                      style={{width:14,height:14,accentColor:col==="교환"?"#FF3B1E":"#0066FF",cursor:"pointer"}}/>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══ 메인 컴포넌트 ═══ */
export default function DealerCarsNewPage() {
  const router = useRouter();
  const [step,      setStep]      = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [errors,    setErrors]    = useState<string[]>([]);
  const [errorFields,setErrorFields] = useState<Set<string>>(new Set());

  /* ── Step 1: 차량 정보 ── */
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBase,  setSelectedBase]  = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [grade,         setGrade]         = useState("");
  const [customGrade,   setCustomGrade]   = useState("");
  const [year,          setYear]          = useState(new Date().getFullYear());
  const [mileage,       setMileage]       = useState("");
  const [fuel,          setFuel]          = useState("가솔린");
  const [color,         setColor]         = useState("");
  const [customColor,   setCustomColor]   = useState("");
  const [transmission,  setTransmission]  = useState("자동");
  const [cc,            setCc]            = useState("");
  const [owners,        setOwners]        = useState("1");
  const [accident,      setAccident]      = useState(false);
  const [plateNumber,   setPlateNumber]   = useState("");

  /* ── Step 2: 판매 정보 ── */
  const [price,       setPrice]       = useState("");
  const [region,      setRegion]      = useState("광주");
  const [description, setDescription] = useState("");
  const [options,     setOptions]     = useState<string[]>([]);
  const [tags]                        = useState<string[]>([]);

  /* ── Step 3: 사진 ── */
  const [mainPhotos,     setMainPhotos]     = useState<Record<string,string>>({});
  const [detailPhotos,   setDetailPhotos]   = useState<string[]>([]);
  const [uploadingSlot,  setUploadingSlot]  = useState<string|null>(null);
  const [uploadingDetail,setUploadingDetail]= useState(false);

  /* ── Step 4: 성능점검 ── */
  const [inspectionNo,    setInspectionNo]    = useState("");
  const [recordNo1,       setRecordNo1]       = useState("");
  const [recordNo2,       setRecordNo2]       = useState("");
  const [recordNo3,       setRecordNo3]       = useState("");
  const [skipInspection,  setSkipInspection]  = useState(false); /* 나중에 입력 */

  /* 종합상태 */
  const [odomState,    setOdomState]    = useState<"양호"|"불량"|"">("");
  const [odomKm,       setOdomKm]       = useState("");
  const [odomDriveState, setOdomDriveState] = useState<"없음"|"보통"|"불량"|"">("");
  const [vinState,     setVinState]     = useState<"양호"|"불량"|"">("");
  const [exhaustCO,    setExhaustCO]    = useState("");
  const [exhaustHC,    setExhaustHC]    = useState("");
  const [tuning,       setTuning]       = useState<"없음"|"있음"|"">("");
  const [tuningTypes,  setTuningTypes]  = useState<string[]>([]);
  const [specialHistory,setSpecialHistory] = useState<"없음"|"있음"|"">("");
  const [specialTypes, setSpecialTypes] = useState<string[]>([]);
  const [purposeChange,setPurposeChange] = useState<"없음"|"있음"|"">("");
  const [purposeTypes, setPurposeTypes] = useState<string[]>([]);
  const [colorState,   setColorState]   = useState<"무채색"|"유채색"|"">("");
  const [colorChange,  setColorChange]  = useState(false);
  const [recall,       setRecall]       = useState<"해당없음"|"해당"|"">("");

  /* 손상 이력 */
  const [damage1, setDamage1] = useState<Record<string,DamageRow>>(() => initDamageMap(PANEL_1RANK));
  const [damageA, setDamageA] = useState<Record<string,DamageRow>>(() => initDamageMap(PANEL_ARANK));
  const [damageB, setDamageB] = useState<Record<string,DamageRow>>(() => initDamageMap(PANEL_BRANK));
  const [damageC, setDamageC] = useState<Record<string,DamageRow>>(() => initDamageMap(PANEL_CRANK));

  const updateDamage = (setter: React.Dispatch<React.SetStateAction<Record<string,DamageRow>>>) =>
    (item:string, col:keyof DamageRow, v:boolean) =>
      setter(prev => ({...prev, [item]:{...prev[item],[col]:v}}));

  /* 세부사항 */
  const [selfDiagEngine,  setSelfDiagEngine]  = useState<GoodBad>("");
  const [selfDiagTrans,   setSelfDiagTrans]   = useState<GoodBad>("");
  const [engineRunning,   setEngineRunning]   = useState<GoodBad>("");
  const [oilLeakCover,    setOilLeakCover]    = useState<OilState>("");
  const [oilLeakHead,     setOilLeakHead]     = useState<OilState>("");
  const [oilLeakBlock,    setOilLeakBlock]    = useState<OilState>("");
  const [oilLevel,        setOilLevel]        = useState<OilLevel>("");
  const [coolLeakHead,    setCoolLeakHead]    = useState<OilState>("");
  const [coolLeakPump,    setCoolLeakPump]    = useState<OilState>("");
  const [coolLeakRad,     setCoolLeakRad]     = useState<OilState>("");
  const [coolLevel,       setCoolLevel]       = useState<OilLevel>("");
  const [atOilLeak,       setAtOilLeak]       = useState<OilState>("");
  const [atOilLevel,      setAtOilLevel]      = useState<OilLevel>("");
  const [atRunning,       setAtRunning]       = useState<GoodBad>("");
  const [clutch,          setClutch]          = useState<GoodBad>("");
  const [cvJoint,         setCvJoint]         = useState<GoodBad>("");
  const [driveShaft,      setDriveShaft]      = useState<GoodBad>("");
  const [differential,    setDifferential]    = useState<GoodBad>("");
  const [steeringPump,    setSteeringPump]    = useState<GoodBad>("");
  const [steeringGear,    setSteeringGear]    = useState<GoodBad>("");
  const [steeringJoint,   setSteeringJoint]   = useState<GoodBad>("");
  const [brakeOilLeak,    setBrakeOilLeak]    = useState<OilState>("");
  const [brakeLevel,      setBrakeLevel]      = useState<OilState>("");
  const [brakeBooster,    setBrakeBooster]    = useState<GoodBad>("");
  const [generator,       setGenerator]       = useState<GoodBad>("");
  const [starter,         setStarter]         = useState<GoodBad>("");
  const [wiperMotor,      setWiperMotor]      = useState<GoodBad>("");
  const [blowerMotor,     setBlowerMotor]     = useState<GoodBad>("");
  const [radFanMotor,     setRadFanMotor]     = useState<GoodBad>("");
  const [windowMotor,     setWindowMotor]     = useState<GoodBad>("");
  const [fuelLeak,        setFuelLeak]        = useState<"없음"|"있음"|"">("");

  /* 기타정보 */
  const [exteriorState,   setExteriorState]   = useState<GoodBad>("");
  const [interiorState,   setInteriorState]   = useState<GoodBad>("");
  const [polishState,     setPolishState]     = useState<GoodBad>("");
  const [wheelState,      setWheelState]      = useState<GoodBad>("");
  const [tireState,       setTireState]       = useState<GoodBad>("");
  const [glassState,      setGlassState]      = useState<GoodBad>("");

  /* 점검 사진 */
  const [inspFrontPhoto,  setInspFrontPhoto]  = useState("");
  const [inspRearPhoto,   setInspRearPhoto]   = useState("");
  const [uploadingInsp,   setUploadingInsp]   = useState<"front"|"rear"|null>(null);

  /* 서명 */
  const [inspDate,        setInspDate]        = useState(new Date().toISOString().slice(0,10));
  const [inspectorName,   setInspectorName]   = useState("");
  const [informerName,    setInformerName]    = useState("");

  /* ── 브랜드/모델 메모 ── */
  const brandList = useMemo(() => Object.keys(brands).sort((a,b)=>{
    const o=["현대","기아","제네시스","KG모빌리티","르노코리아","쉐보레"];
    const ai=o.indexOf(a),bi=o.indexOf(b);
    if(ai>=0&&bi>=0)return ai-bi; if(ai>=0)return -1; if(bi>=0)return 1; return a.localeCompare(b);
  }),[]);

  const baseModels   = useMemo(()=>selectedBrand?getBaseModels(selectedBrand):[]               ,[selectedBrand]);
  const modelVariants= useMemo(()=>{ if(!selectedBase)return []; const g=baseModels.find(g=>g.base===selectedBase); return g?.variants||[]; },[selectedBase,baseModels]);
  const allModelGrades = useMemo(()=>{
    if(!selectedModel)return [];
    const g=gradeData[selectedModel];
    if(!g||!Array.isArray(g))return [];
    return g.map((i:{grade:string;price:number;engine:string})=>({...i,fuelType:detectFuelFromEngine(i.engine)}));
  },[selectedModel]);
  const availableFuels = useMemo(()=>{
    if(allModelGrades.length===0)return FUEL_TYPES;
    const f=[...new Set(allModelGrades.map((g:{fuelType:string})=>g.fuelType))];
    return f.length>0?f:FUEL_TYPES;
  },[allModelGrades]);
  const filteredGrades = useMemo(()=>{
    if(allModelGrades.length===0)return [];
    const f=allModelGrades.filter((g:{fuelType:string})=>g.fuelType===fuel);
    return f.length>0?f:allModelGrades;
  },[allModelGrades,fuel]);

  const handleModelSelect=(model:string)=>{
    setSelectedModel(model); setGrade("");
    const g=gradeData[model];
    if(g&&Array.isArray(g)&&g.length>0)setFuel(detectFuelFromEngine(g[0].engine));
  };
  const handleBrandChange=(brand:string)=>{setSelectedBrand(brand);setSelectedBase("");setSelectedModel("");setGrade("");};
  const handleBaseChange=(base:string)=>{setSelectedBase(base);setSelectedModel("");setGrade(""); const g=baseModels.find(g=>g.base===base); if(g&&g.variants.length===1)handleModelSelect(g.variants[0].name);};
  const toggleOption=(opt:string)=>setOptions(prev=>prev.includes(opt)?prev.filter(o=>o!==opt):[...prev,opt]);

  /* ── 사진 업로드 ── */
  const handleMainUpload=async(slotKey:string)=>{
    const inp=document.createElement("input");inp.type="file";inp.accept="image/*";
    inp.onchange=async(e)=>{
      const file=(e.target as HTMLInputElement).files?.[0]; if(!file)return;
      setUploadingSlot(slotKey);
      const fd=new FormData();fd.append("file",file);
      try{ const res=await fetch("/api/upload",{method:"POST",body:fd}); const d=await res.json();
        if(d.success&&d.url)setMainPhotos(prev=>({...prev,[slotKey]:d.url}));
        else alert("업로드 실패: "+(d.error||"Cloudinary 환경변수 확인")); }catch{alert("업로드 중 오류");}
      setUploadingSlot(null);
    };inp.click();
  };
  const handleDetailUpload=async()=>{
    if(detailPhotos.length>=20){alert("최대 20장");return;}
    const inp=document.createElement("input");inp.type="file";inp.accept="image/*";inp.multiple=true;
    inp.onchange=async(e)=>{
      const files=(e.target as HTMLInputElement).files; if(!files)return;
      setUploadingDetail(true);
      for(const file of Array.from(files).slice(0,20-detailPhotos.length)){
        const fd=new FormData();fd.append("file",file);
        try{const res=await fetch("/api/upload",{method:"POST",body:fd});const d=await res.json();if(d.success&&d.url)setDetailPhotos(prev=>[...prev,d.url]);}catch{}
      }
      setUploadingDetail(false);
    };inp.click();
  };
  const handleInspPhoto=async(side:"front"|"rear")=>{
    const inp=document.createElement("input");inp.type="file";inp.accept="image/*";
    inp.onchange=async(e)=>{
      const file=(e.target as HTMLInputElement).files?.[0]; if(!file)return;
      setUploadingInsp(side);
      const fd=new FormData();fd.append("file",file);
      try{const res=await fetch("/api/upload",{method:"POST",body:fd});const d=await res.json();
        if(d.success&&d.url){if(side==="front")setInspFrontPhoto(d.url);else setInspRearPhoto(d.url);}
      }catch{}
      setUploadingInsp(null);
    };inp.click();
  };

  /* ── 유효성 검사 ── */
  const validate=(s:number):string[]=>{
    const errs:string[]=[]; const fields=new Set<string>();
    if(s===1){
      if(!selectedBrand){errs.push("제조사를 선택해주세요");fields.add("brand");}
      if(!selectedModel){errs.push("모델을 선택해주세요");fields.add("model");}
      if(!mileage||Number(mileage)<0){errs.push("주행거리를 입력해주세요");fields.add("mileage");}
      if(!color&&!customColor){errs.push("색상을 선택해주세요");fields.add("color");}
      if(!plateNumber){errs.push("차량번호를 입력해주세요");fields.add("plate");}
    }
    if(s===2){if(!price||Number(price)<100){errs.push("판매가 100만원 이상 입력해주세요");fields.add("price");}}
    if(s===3){const mc=Object.keys(mainPhotos).length;if(mc<4){errs.push(`메인 사진 ${mc}/4장 — 4장 모두 필수`);fields.add("photos");}}
    setErrorFields(fields); return errs;
  };

  const nextStep=()=>{const errs=validate(step);if(errs.length>0){setErrors(errs);return;}setErrors([]);setErrorFields(new Set());setStep(step+1);};

  /* ── 최종 제출 ── */
  const handleSubmit=async()=>{
    const errs=validate(3);
    if(errs.length>0){setErrors(errs);return;}
    setSaving(true);
    try{
      const finalGrade=grade==="직접입력"?customGrade:grade;
      const carName=`${selectedModel}${finalGrade?` ${finalGrade}`:""}`;
      const orderedImages=[...MAIN_SLOTS_DATA.map(s=>mainPhotos[s.key]).filter(Boolean),...detailPhotos];

      /* 성능점검 데이터 직렬화 */
      const inspectionData = skipInspection ? null : {
        inspectionNo, recordNo:`${recordNo1}-${recordNo2}-${recordNo3}`,
        overall:{ odomState,odomKm,odomDriveState,vinState,exhaustCO,exhaustHC,tuning,tuningTypes,specialHistory,specialTypes,purposeChange,purposeTypes,colorState,colorChange,recall },
        damage:{ panel1:damage1, panelA:damageA, panelB:damageB, panelC:damageC },
        detail:{ selfDiagEngine,selfDiagTrans,engineRunning,oilLeakCover,oilLeakHead,oilLeakBlock,oilLevel,coolLeakHead,coolLeakPump,coolLeakRad,coolLevel,atOilLeak,atOilLevel,atRunning,clutch,cvJoint,driveShaft,differential,steeringPump,steeringGear,steeringJoint,brakeOilLeak,brakeLevel,brakeBooster,generator,starter,wiperMotor,blowerMotor,radFanMotor,windowMotor,fuelLeak },
        extra:{ exteriorState,interiorState,polishState,wheelState,tireState,glassState },
        photos:{ front:inspFrontPhoto, rear:inspRearPhoto },
        signature:{ inspDate,inspectorName,informerName },
      };

      const finalDesc = [description, inspectionData ? `\n\n[성능점검데이터]\n${JSON.stringify(inspectionData)}` : ""].join("");

      const res=await fetch("/api/dealer/cars",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name:carName,brand:selectedBrand,year,mileage:Number(mileage),fuel,
          color:color==="기타"?customColor:color,region,price:Number(price),cc:Number(cc)||0,
          transmission,owners:Number(owners),accident,tags,options,images:orderedImages,
          description:finalDesc,
          inspected:!skipInspection&&!!inspectorName,
        }),
      });
      const data=await res.json();
      if(data.success)setSubmitted(true);
      else alert("등록 실패: "+(data.error||"다시 시도해주세요"));
    }catch{alert("네트워크 오류");}
    setSaving(false);
  };

  const errBorder=(field:string)=>errorFields.has(field)?"2px solid #E24B4A":"1.5px solid #E0DDD7";
  const inputS:React.CSSProperties={width:"100%",padding:"13px 16px",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif",background:"white"};
  const labelS:React.CSSProperties={fontSize:13,fontWeight:800,display:"block",marginBottom:6};
  const sectionTitle=(t:string)=>(
    <div style={{fontSize:14,fontWeight:800,color:"#0066FF",background:"#EEF5FF",padding:"10px 14px",borderRadius:10,marginBottom:12,marginTop:20}}>{t}</div>
  );
  const goodBadRow=(label:string,val:GoodBad,set:(v:GoodBad)=>void)=>(
    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
      <div style={{minWidth:160,fontSize:13,color:"#444"}}>{label}</div>
      <RG value={val} options={["양호","불량"]} onChange={v=>set(v as GoodBad)}/>
    </div>
  );
  const oilRow=(label:string,val:OilState,set:(v:OilState)=>void)=>(
    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
      <div style={{minWidth:160,fontSize:13,color:"#444"}}>{label}</div>
      <RG value={val} options={["없음","미세누유","누유"]} onChange={v=>set(v as OilState)}/>
    </div>
  );

  const STEP_LABELS = ["차량 정보","판매 정보","사진 업로드","성능점검"];

  if(submitted) return (
    <><Navbar/><div style={{textAlign:"center",padding:"80px 20px",fontFamily:"'NanumSquareRound',sans-serif"}}>
      <div style={{fontSize:60,marginBottom:20}}>✅</div>
      <h2 style={{fontSize:28,fontWeight:700,marginBottom:10}}>매물 등록 완료!</h2>
      <p style={{fontSize:16,color:"#888",fontWeight:400,marginBottom:28}}>관리자 검수 후 게시됩니다.</p>
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        <Link href="/dealer"><button style={{padding:"14px 28px",background:"#0066FF",color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>내 매물 관리</button></Link>
        <button onClick={()=>{setSubmitted(false);setStep(1);}} style={{padding:"14px 28px",background:"#F0F6FF",color:"#0066FF",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>추가 등록</button>
      </div>
    </div></>
  );

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F4FF;} select:focus,input:focus,textarea:focus{outline:none;border-color:#0066FF!important;} input[type=checkbox],input[type=radio]{cursor:pointer;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F4FF"}}>
        {/* 헤더 */}
        <div style={{background:"white",borderBottom:"1px solid #DDEEFF",padding:"16px 24px"}}>
          <div style={{maxWidth:780,margin:"0 auto"}}>
            <Link href="/dealer" style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:13,color:"#888",marginBottom:8,textDecoration:"none"}}><ChevronLeft size={14}/>딜러 대시보드</Link>
            <h1 style={{fontSize:22,fontWeight:800}}>차량 광고 등록</h1>
            <div style={{display:"flex",gap:6,marginTop:12}}>
              {STEP_LABELS.map((s,i)=>(
                <div key={i} style={{flex:1,textAlign:"center"}}>
                  <div style={{height:4,borderRadius:2,background:step>i+1?"#0066FF":step===i+1?"#0066FF":"#E0E8F0",marginBottom:4,opacity:step>i+1?0.4:1}}/>
                  <span style={{fontSize:10,fontWeight:step===i+1?800:500,color:step===i+1?"#0066FF":"#AAA"}}>{i+1}. {s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:780,margin:"0 auto",padding:"24px 16px 120px"}}>

          {/* ══ STEP 1: 차량 정보 ══ */}
          {step===1&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:20}}>🚗 차량 정보</h2>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div>
                  <label style={labelS}>제조사 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={selectedBrand} onChange={e=>handleBrandChange(e.target.value)} style={{...inputS,border:errBorder("brand")}}>
                    <option value="">선택</option>
                    <optgroup label="🇰🇷 국산">{brandList.filter(b=>brands[b].category==="국산").map(b=><option key={b} value={b}>{b}</option>)}</optgroup>
                    <optgroup label="🌍 수입">{brandList.filter(b=>brands[b].category==="수입").map(b=><option key={b} value={b}>{b}</option>)}</optgroup>
                  </select>
                </div>
                <div>
                  <label style={labelS}>모델명 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={selectedBase} onChange={e=>handleBaseChange(e.target.value)} style={{...inputS,border:errBorder("model")}} disabled={!selectedBrand}>
                    <option value="">선택</option>
                    {baseModels.map(g=><option key={g.base} value={g.base}>{g.base} ({g.variants.length})</option>)}
                  </select>
                </div>
              </div>
              {selectedBase&&modelVariants.length>1&&(
                <div style={{marginBottom:16}}>
                  <label style={labelS}>세대/상세 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={selectedModel} onChange={e=>handleModelSelect(e.target.value)} style={{...inputS,border:errBorder("model")}}>
                    <option value="">선택</option>
                    {[...modelVariants].sort((a,b)=>{if(a.status==="현행"&&b.status!=="현행")return -1;if(a.status!=="현행"&&b.status==="현행")return 1;return 0;}).map(v=>(
                      <option key={v.name} value={v.name}>{v.name} {v.status==="현행"?"✦ 현행":"(단종)"}</option>
                    ))}
                  </select>
                </div>
              )}
              {selectedModel&&<div style={{background:"#EEF5FF",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:14,fontWeight:700,color:"#0066FF"}}>✓ {selectedBrand} {selectedModel}</div>}
              <div style={{marginBottom:16}}>
                <label style={labelS}>연료 <span style={{color:"#FF3B1E"}}>*</span></label>
                {allModelGrades.length>0?(
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {availableFuels.map((f:string)=>{
                      const cnt=allModelGrades.filter((g:{fuelType:string})=>g.fuelType===f).length;
                      return <button key={f} onClick={()=>{setFuel(f);setGrade("");}} style={{padding:"10px 16px",borderRadius:10,fontSize:14,fontWeight:fuel===f?800:500,border:fuel===f?"2px solid #0066FF":"1.5px solid #E0DDD7",background:fuel===f?"#EEF5FF":"white",color:fuel===f?"#0066FF":"#888",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                        {f==="전기"?"⚡":f==="하이브리드"?"🔋":f==="디젤"?"🛢️":f==="LPG"?"🔥":f==="수소"?"💧":"⛽"} {f} <span style={{fontSize:11,color:fuel===f?"#0066FF":"#CCC"}}>({cnt})</span>
                      </button>;
                    })}
                  </div>
                ):(
                  <select value={fuel} onChange={e=>setFuel(e.target.value)} style={inputS}>{FUEL_TYPES.map(f=><option key={f}>{f}</option>)}</select>
                )}
              </div>
              <div style={{marginBottom:16}}>
                <label style={labelS}>등급/트림</label>
                <select value={grade} onChange={e=>setGrade(e.target.value)} style={inputS}>
                  <option value="">선택 (없으면 비워두세요)</option>
                  {filteredGrades.length>0&&<optgroup label={`📋 ${fuel} 등급`}>{filteredGrades.map((g:{grade:string;price:number;engine:string})=><option key={g.grade} value={g.grade}>{g.grade} ({g.price?.toLocaleString()}만 · {g.engine})</option>)}</optgroup>}
                  <option value="직접입력">✎ 직접 입력</option>
                </select>
                {grade==="직접입력"&&<input value={customGrade} onChange={e=>setCustomGrade(e.target.value)} placeholder="등급/트림 직접 입력" style={{...inputS,border:"1.5px solid #E0DDD7",marginTop:8}}/>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div><label style={labelS}>연식 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={year} onChange={e=>setYear(Number(e.target.value))} style={inputS}>
                    {Array.from({length:new Date().getFullYear()-1989},(_,i)=>new Date().getFullYear()-i).map(y=><option key={y} value={y}>{y}년</option>)}
                  </select>
                </div>
                <div><label style={labelS}>주행거리(km) <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input type="number" value={mileage} onChange={e=>setMileage(e.target.value)} placeholder="예: 35000" style={{...inputS,border:errBorder("mileage")}}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div><label style={labelS}>변속기</label><select value={transmission} onChange={e=>setTransmission(e.target.value)} style={inputS}>{TRANSMISSIONS.map(t=><option key={t}>{t}</option>)}</select></div>
                <div><label style={labelS}>색상 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={color} onChange={e=>setColor(e.target.value)} style={{...inputS,border:errBorder("color")}}><option value="">선택</option>{COLORS.map(c=><option key={c} value={c}>{c}</option>)}</select>
                  {color==="기타"&&<input value={customColor} onChange={e=>setCustomColor(e.target.value)} placeholder="색상 직접 입력" style={{...inputS,border:"1.5px solid #E0DDD7",marginTop:8}}/>}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div><label style={labelS}>배기량(cc)</label><input type="number" value={cc} onChange={e=>setCc(e.target.value)} placeholder="예: 1998" style={inputS}/></div>
                <div><label style={labelS}>소유자 수</label><select value={owners} onChange={e=>setOwners(e.target.value)} style={inputS}>{["1","2","3","4","5","6","7","8","9이상"].map(o=><option key={o} value={o}>{o}인</option>)}</select></div>
              </div>
              <div style={{marginBottom:16}}>
                <label style={labelS}>차량번호 <span style={{color:"#FF3B1E"}}>*</span></label>
                <div style={{display:"flex",gap:8}}>
                  <input value={plateNumber} onChange={e=>setPlateNumber(e.target.value)} placeholder="12가1234" style={{...inputS,flex:1,border:errBorder("plate")}}/>
                  <button onClick={()=>alert("국토교통부 차량 조회 기능은 준비 중입니다.")} style={{padding:"13px 18px",background:"#1847FF",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:800,whiteSpace:"nowrap",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>🏛️ 국토부 조회</button>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <label style={labelS}>사고이력</label>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setAccident(false)} style={{flex:1,padding:"12px",borderRadius:10,border:!accident?"2px solid #2D8A52":"1.5px solid #E0DDD7",background:!accident?"#EAF6EF":"white",color:!accident?"#2D8A52":"#888",fontWeight:!accident?800:500,fontSize:14,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>무사고</button>
                  <button onClick={()=>setAccident(true)} style={{flex:1,padding:"12px",borderRadius:10,border:accident?"2px solid #E24B4A":"1.5px solid #E0DDD7",background:accident?"#FFF0ED":"white",color:accident?"#E24B4A":"#888",fontWeight:accident?800:500,fontSize:14,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>사고 있음</button>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2: 판매 정보 ══ */}
          {step===2&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:20}}>💰 판매 정보</h2>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div><label style={labelS}>판매가(만원) <span style={{color:"#FF3B1E"}}>*</span></label><input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="예: 2500" style={{...inputS,border:errBorder("price")}}/></div>
                <div><label style={labelS}>지역</label><select value={region} onChange={e=>setRegion(e.target.value)} style={inputS}>{REGIONS.map(r=><option key={r}>{r}</option>)}</select></div>
              </div>
              <div style={{marginBottom:16}}><label style={labelS}>차량 설명</label><textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)} placeholder="차량 상태, 특이사항 등 (최대 3000자)" maxLength={3000} style={{...inputS,border:"1.5px solid #E0DDD7",resize:"none"}}/></div>
              <div style={{marginBottom:16}}>
                <label style={labelS}>옵션 선택</label>
                {OPTION_CATS.map(cat=>(
                  <div key={cat.name} style={{marginBottom:12}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#0066FF",marginBottom:6}}>{cat.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {cat.items.map(item=>(
                        <button key={item} onClick={()=>toggleOption(item)} style={{padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:options.includes(item)?800:500,border:options.includes(item)?"2px solid #0066FF":"1px solid #E0DDD7",background:options.includes(item)?"#EEF5FF":"white",color:options.includes(item)?"#0066FF":"#888",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                          {options.includes(item)&&<Check size={10} style={{marginRight:3}}/>}{item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ STEP 3: 사진 ══ */}
          {step===3&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:6}}>📷 사진 업로드</h2>
              <p style={{fontSize:13,color:"#AAA",marginBottom:20}}>메인 사진 4장 필수! 디테일 사진 최대 20장.</p>
              <div style={{fontSize:14,fontWeight:800,marginBottom:10,color:"#FF3B1E"}}>📌 메인 사진 (4장 필수)</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
                {MAIN_SLOTS_DATA.map(slot=>{
                  const url=mainPhotos[slot.key]; const isUp=uploadingSlot===slot.key;
                  return(
                    <div key={slot.key} style={{border:url?"2px solid #0066FF":errorFields.has("photos")?"2px dashed #E24B4A":"2px dashed #FFB8A8",borderRadius:14,overflow:"hidden",background:url?"white":"#FFF8F6"}}>
                      {url?(
                        <div style={{position:"relative"}}>
                          <img src={url} alt={slot.label} style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",display:"block"}}/>
                          <div style={{position:"absolute",top:0,left:0,right:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.5),transparent)",padding:"8px 12px"}}><span style={{fontSize:11,fontWeight:800,color:"white"}}>{slot.label}</span></div>
                          <div style={{position:"absolute",top:6,right:6,display:"flex",gap:4}}>
                            <button onClick={()=>handleMainUpload(slot.key)} style={{width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>↺</button>
                            <button onClick={()=>setMainPhotos(prev=>{const n={...prev};delete n[slot.key];return n;})} style={{width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={12}/></button>
                          </div>
                        </div>
                      ):(
                        <button onClick={()=>handleMainUpload(slot.key)} disabled={isUp} style={{width:"100%",aspectRatio:"4/3",border:"none",background:"transparent",cursor:isUp?"wait":"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,fontFamily:"'NanumSquareRound',sans-serif",padding:"8px"}}>
                          {isUp?<div style={{fontSize:13,fontWeight:700,color:"#FF3B1E"}}>업로드 중...</div>:<>
                            <PhotoGuideSvg type={slot.svgType}/>
                            <div style={{fontSize:12,fontWeight:800,color:"#FF3B1E",marginTop:2}}>{slot.label}</div>
                          </>}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{fontSize:14,fontWeight:800,marginBottom:10}}>🔍 디테일 사진 (최대 20장)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                {detailPhotos.map((url,i)=>(
                  <div key={i} style={{position:"relative",borderRadius:10,overflow:"hidden",aspectRatio:"1"}}>
                    <img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <button onClick={()=>setDetailPhotos(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:4,right:4,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={10}/></button>
                  </div>
                ))}
                {detailPhotos.length<20&&(
                  <button onClick={handleDetailUpload} disabled={uploadingDetail} style={{aspectRatio:"1",border:"2px dashed #DDEEFF",borderRadius:10,background:"#F0F6FF",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,fontSize:11,color:"#0066FF",fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif"}}>
                    <Upload size={18} color="#0066FF"/>{uploadingDetail?"업로드중...":"추가"}
                  </button>
                )}
              </div>
              <div style={{fontSize:12,color:"#AAA",textAlign:"center"}}>메인 {Object.keys(mainPhotos).length}/4장 · 디테일 {detailPhotos.length}/20장</div>
            </div>
          )}

          {/* ══ STEP 4: 성능점검 ══ */}
          {step===4&&(
            <div>
              {/* 나중에 입력 선택지 */}
              <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>🔧 성능점검 기록부</div>
                  <div style={{fontSize:12,color:"#AAA"}}>자동차관리법 제58조에 따른 성능·상태 점검 정보</div>
                </div>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                  <input type="checkbox" checked={skipInspection} onChange={e=>setSkipInspection(e.target.checked)} style={{width:16,height:16,accentColor:"#AAA"}}/>
                  <span style={{fontSize:12,color:"#888",fontWeight:600}}>나중에 입력</span>
                </label>
              </div>

              {!skipInspection&&(
                <>
                  {/* ── 제시번호 & 기록부 번호 ── */}
                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:14}}>📋 기록부 번호</div>
                    <div style={{marginBottom:14}}>
                      <label style={labelS}>제시번호</label>
                      <input value={inspectionNo} onChange={e=>setInspectionNo(e.target.value)} placeholder="예) 2012070722" style={{...inputS,border:"1.5px solid #E0DDD7"}}/>
                      <div style={{fontSize:11,color:"#AAA",marginTop:4}}>⚠️ 매매회원이 중요 정보 미기재 또는 허위 기재 시 법적 제재를 받을 수 있습니다.</div>
                    </div>
                    <label style={labelS}>중고자동차 성능·상태 점검기록부</label>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,color:"#888",flexShrink:0}}>제</span>
                      <input value={recordNo1} onChange={e=>setRecordNo1(e.target.value)} placeholder="22" maxLength={4} style={{...inputS,width:70,textAlign:"center"}}/>
                      <span style={{color:"#888"}}>-</span>
                      <input value={recordNo2} onChange={e=>setRecordNo2(e.target.value)} placeholder="00" maxLength={4} style={{...inputS,width:70,textAlign:"center"}}/>
                      <span style={{color:"#888"}}>-</span>
                      <input value={recordNo3} onChange={e=>setRecordNo3(e.target.value)} placeholder="016852" maxLength={10} style={{...inputS,width:110,textAlign:"center"}}/>
                      <span style={{fontSize:13,color:"#888",flexShrink:0}}>호</span>
                    </div>
                  </div>

                  {/* ── 자동차 종합상태 ── */}
                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:14}}>🚘 자동차 종합상태</div>

                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700,color:"#444"}}>주행거리 계기상태</div>
                      <RG value={odomState} options={["양호","불량"]} onChange={v=>setOdomState(v as "양호"|"불량")}/>
                    </div>
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16,flexWrap:"wrap"}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700}}>주행거리 상태</div>
                      <RG value={odomDriveState} options={["없음","보통","불량"]} onChange={v=>setOdomDriveState(v as "없음"|"보통"|"불량")}/>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <input type="number" value={odomKm} onChange={e=>setOdomKm(e.target.value)} placeholder="주행거리" style={{...inputS,width:120,padding:"8px 12px"}}/>
                        <span style={{fontSize:13,color:"#888"}}>km</span>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700}}>차대번호 표기</div>
                      <RG value={vinState} options={["양호","불량"]} onChange={v=>setVinState(v as "양호"|"불량")}/>
                    </div>
                    <div style={{padding:"12px 0",borderBottom:"1px solid #F0F4FF"}}>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>배출가스</div>
                      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:12,color:"#888",minWidth:90}}>일산화탄소(CO)</span>
                          <input type="number" step="0.01" value={exhaustCO} onChange={e=>setExhaustCO(e.target.value)} placeholder="0.00" style={{...inputS,width:80,padding:"8px 10px"}}/>
                          <span style={{fontSize:12,color:"#888"}}>%</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:12,color:"#888",minWidth:90}}>탄화수소(HC)</span>
                          <input type="number" value={exhaustHC} onChange={e=>setExhaustHC(e.target.value)} placeholder="0" style={{...inputS,width:80,padding:"8px 10px"}}/>
                          <span style={{fontSize:12,color:"#888"}}>ppm</span>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16,flexWrap:"wrap"}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700,paddingTop:2}}>튜닝</div>
                      <div>
                        <RG value={tuning} options={["없음","있음"]} onChange={v=>setTuning(v as "없음"|"있음")}/>
                        {tuning==="있음"&&(
                          <div style={{display:"flex",gap:10,marginTop:8}}>
                            {["구조","장치"].map(t=>(
                              <label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                                <input type="checkbox" checked={tuningTypes.includes(t)} onChange={e=>setTuningTypes(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#FF3B1E"}}/>
                                {t}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16,flexWrap:"wrap"}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700,paddingTop:2}}>특별이력</div>
                      <div>
                        <RG value={specialHistory} options={["없음","있음"]} onChange={v=>setSpecialHistory(v as "없음"|"있음")}/>
                        {specialHistory==="있음"&&(
                          <div style={{display:"flex",gap:10,marginTop:8}}>
                            {["침수","화재"].map(t=>(
                              <label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                                <input type="checkbox" checked={specialTypes.includes(t)} onChange={e=>setSpecialTypes(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#FF3B1E"}}/>
                                {t}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16,flexWrap:"wrap"}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700,paddingTop:2}}>용도변경</div>
                      <div>
                        <RG value={purposeChange} options={["없음","있음"]} onChange={v=>setPurposeChange(v as "없음"|"있음")}/>
                        {purposeChange==="있음"&&(
                          <div style={{display:"flex",gap:10,marginTop:8}}>
                            {["렌트","영업용"].map(t=>(
                              <label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                                <input type="checkbox" checked={purposeTypes.includes(t)} onChange={e=>setPurposeTypes(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#FF3B1E"}}/>
                                {t}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16,flexWrap:"wrap"}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700}}>색상</div>
                      <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                        <RG value={colorState} options={["무채색","유채색"]} onChange={v=>setColorState(v as "무채색"|"유채색")}/>
                        <label style={{display:"flex",alignItems:"center",gap:5,fontSize:12,cursor:"pointer"}}>
                          <input type="checkbox" checked={colorChange} onChange={e=>setColorChange(e.target.checked)} style={{accentColor:"#FF3B1E"}}/>색상변경
                        </label>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",gap:16}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700}}>리콜대상</div>
                      <RG value={recall} options={["해당없음","해당"]} onChange={v=>setRecall(v as "해당없음"|"해당")}/>
                    </div>
                  </div>

                  {/* ── 사고·교환·수리 이력 ── */}
                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>💥 사고·교환·수리 등 이력</div>
                    <div style={{fontSize:11,color:"#AAA",marginBottom:14}}>해당 부위에 체크 표시하세요</div>
                    <DamageTable title="외판 부위" rank="1랭크" items={PANEL_1RANK} data={damage1} onChange={updateDamage(setDamage1)}/>
                    <DamageTable title="주요 골격 (A)" rank="A랭크" items={PANEL_ARANK} data={damageA} onChange={updateDamage(setDamageA)}/>
                    <DamageTable title="주요 골격 (B)" rank="B랭크" items={PANEL_BRANK} data={damageB} onChange={updateDamage(setDamageB)}/>
                    <DamageTable title="주요 골격 (C)" rank="C랭크" items={PANEL_CRANK} data={damageC} onChange={updateDamage(setDamageC)}/>
                  </div>

                  {/* ── 자동차 세부사항 ── */}
                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:14}}>🔩 자동차 세부사항</div>

                    {sectionTitle("자가 진단")}
                    {goodBadRow("원동기",selfDiagEngine,setSelfDiagEngine)}
                    {goodBadRow("변속기",selfDiagTrans,setSelfDiagTrans)}

                    {sectionTitle("원동기")}
                    {goodBadRow("작동상태(공회전)",engineRunning,setEngineRunning)}
                    {oilRow("실린더 커버(로커암 커버)",oilLeakCover,setOilLeakCover)}
                    {oilRow("실린더 헤드 / 개스킷",oilLeakHead,setOilLeakHead)}
                    {oilRow("실린더 블록 / 오일팬",oilLeakBlock,setOilLeakBlock)}
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
                      <div style={{minWidth:160,fontSize:13,color:"#444"}}>오일유량</div>
                      <RG value={oilLevel} options={["적정","부족"]} onChange={v=>setOilLevel(v as OilLevel)}/>
                    </div>
                    {oilRow("냉각수 누수 (실린더 헤드)",coolLeakHead,setCoolLeakHead)}
                    {oilRow("냉각수 누수 (워터펌프)",coolLeakPump,setCoolLeakPump)}
                    {oilRow("냉각수 누수 (라디에이터)",coolLeakRad,setCoolLeakRad)}
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
                      <div style={{minWidth:160,fontSize:13,color:"#444"}}>냉각수 수량</div>
                      <RG value={coolLevel} options={["적정","부족"]} onChange={v=>setCoolLevel(v as OilLevel)}/>
                    </div>

                    {sectionTitle("변속기 (자동)")}
                    {oilRow("오일누유",atOilLeak,setAtOilLeak)}
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
                      <div style={{minWidth:160,fontSize:13,color:"#444"}}>오일유량 및 상태</div>
                      <RG value={atOilLevel} options={["적정","부족","과다"]} onChange={v=>setAtOilLevel(v as OilLevel)}/>
                    </div>
                    {goodBadRow("작동상태(공회전)",atRunning,setAtRunning)}

                    {sectionTitle("동력전달")}
                    {goodBadRow("클러치 어셈블리",clutch,setClutch)}
                    {goodBadRow("등속조인트",cvJoint,setCvJoint)}
                    {goodBadRow("추진축 및 베어링",driveShaft,setDriveShaft)}
                    {goodBadRow("디퍼렌셜 기어",differential,setDifferential)}

                    {sectionTitle("조향")}
                    {goodBadRow("스티어링 펌프",steeringPump,setSteeringPump)}
                    {goodBadRow("스티어링 기어(MDPS포함)",steeringGear,setSteeringGear)}
                    {goodBadRow("스티어링 조인트",steeringJoint,setSteeringJoint)}

                    {sectionTitle("제동")}
                    {oilRow("브레이크 마스터 실린더 오일 누유",brakeOilLeak,setBrakeOilLeak)}
                    {oilRow("브레이크 오일 누유",brakeLevel,setBrakeLevel)}
                    {goodBadRow("배력장치 상태",brakeBooster,setBrakeBooster)}

                    {sectionTitle("전기")}
                    {goodBadRow("발전기 출력",generator,setGenerator)}
                    {goodBadRow("시동모터",starter,setStarter)}
                    {goodBadRow("와이퍼 모터기능",wiperMotor,setWiperMotor)}
                    {goodBadRow("실내송풍 모터",blowerMotor,setBlowerMotor)}
                    {goodBadRow("라디에이터 팬 모터",radFanMotor,setRadFanMotor)}
                    {goodBadRow("윈도우 모터",windowMotor,setWindowMotor)}

                    {sectionTitle("연료")}
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",gap:16}}>
                      <div style={{minWidth:160,fontSize:13,color:"#444"}}>연료누출(LP가스 포함)</div>
                      <RG value={fuelLeak} options={["없음","있음"]} onChange={v=>setFuelLeak(v as "없음"|"있음")}/>
                    </div>
                  </div>

                  {/* ── 자동차 기타정보 ── */}
                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:14}}>🏎️ 자동차 기타정보</div>
                    {[
                      ["외장",exteriorState,setExteriorState],
                      ["내장",interiorState,setInteriorState],
                      ["광택",polishState,setPolishState],
                      ["휠",wheelState,setWheelState],
                      ["타이어",tireState,setTireState],
                      ["유리",glassState,setGlassState],
                    ].map(([label, val, setter])=>(
                      <div key={label as string} style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
                        <div style={{minWidth:100,fontSize:13,fontWeight:700,color:"#444"}}>{label as string}</div>
                        <RG value={val as GoodBad} options={["양호","불량"]} onChange={v=>(setter as (v:GoodBad)=>void)(v as GoodBad)}/>
                      </div>
                    ))}
                  </div>

                  {/* ── 점검 장면 촬영 사진 ── */}
                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>📷 점검 장면 촬영 사진</div>
                    <div style={{fontSize:11,color:"#AAA",marginBottom:14}}>점검장 일부(상호 또는 건물 등)를 배경으로 차량 번호판 및 차량 전체가 식별 가능한 사진을 등록해주세요.</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {(["front","rear"] as const).map(side=>{
                        const url=side==="front"?inspFrontPhoto:inspRearPhoto;
                        const isUp=uploadingInsp===side;
                        return(
                          <div key={side} style={{border:"2px dashed #DDEEFF",borderRadius:14,overflow:"hidden",background:"#F5F8FF"}}>
                            {url?(
                              <div style={{position:"relative"}}>
                                <img src={url} alt={side} style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",display:"block"}}/>
                                <div style={{position:"absolute",top:0,left:0,right:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.5),transparent)",padding:"8px 12px"}}>
                                  <span style={{fontSize:11,fontWeight:800,color:"white"}}>{side==="front"?"앞면":"뒷면"}</span>
                                </div>
                                <div style={{position:"absolute",top:6,right:6,display:"flex",gap:4}}>
                                  <button onClick={()=>handleInspPhoto(side)} style={{width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>↺</button>
                                  <button onClick={()=>{if(side==="front")setInspFrontPhoto("");else setInspRearPhoto("");}} style={{width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={12}/></button>
                                </div>
                              </div>
                            ):(
                              <button onClick={()=>handleInspPhoto(side)} disabled={isUp} style={{width:"100%",aspectRatio:"4/3",border:"none",background:"transparent",cursor:isUp?"wait":"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}>
                                {isUp?<div style={{fontSize:13,color:"#0066FF",fontWeight:700}}>업로드 중...</div>:<>
                                  <Upload size={28} color="#0066FF"/>
                                  <div style={{fontSize:13,fontWeight:800,color:"#0066FF"}}>{side==="front"?"앞면":"뒷면"}</div>
                                  <div style={{fontSize:11,color:"#AAA"}}>+ 사진 등록하기</div>
                                </>}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── 서명 ── */}
                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
                      <Shield size={16} color="#0066FF"/> 서명
                    </div>
                    <div style={{fontSize:11,color:"#AAA",marginBottom:14}}>자동차관리법 제58조 및 같은 법 시행규칙 제120조에 따라 중고자동차 성능·상태를 점검하였음을 확인합니다.</div>
                    <div style={{marginBottom:12}}>
                      <label style={labelS}>점검일</label>
                      <input type="date" value={inspDate} onChange={e=>setInspDate(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7"}}/>
                    </div>
                    <div style={{marginBottom:12}}>
                      <label style={labelS}>중고자동차 성능·상태 점검자 <span style={{color:"#FF3B1E"}}>*</span></label>
                      <input value={inspectorName} onChange={e=>setInspectorName(e.target.value)} placeholder="점검자 성명" style={{...inputS,border:"1.5px solid #E0DDD7"}}/>
                    </div>
                    <div>
                      <label style={labelS}>중고자동차 성능·상태 고지자</label>
                      <input value={informerName} onChange={e=>setInformerName(e.target.value)} placeholder="고지자 성명 (자동차매매업소)" style={{...inputS,border:"1.5px solid #E0DDD7"}}/>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 에러 */}
          {errors.length>0&&(
            <div style={{background:"#FFF0ED",border:"1px solid #FFB8A8",borderRadius:12,padding:"14px 18px",marginTop:16}}>
              {errors.map((e,i)=><div key={i} style={{fontSize:13,color:"#E24B4A",fontWeight:600}}>• {e}</div>)}
            </div>
          )}

          {/* 하단 버튼 */}
          <div style={{display:"flex",gap:10,marginTop:12}}>
            {step>1&&<button onClick={()=>{setStep(step-1);setErrors([]);setErrorFields(new Set());}} style={{padding:"16px 24px",background:"white",border:"1.5px solid #E0DDD7",borderRadius:14,fontSize:15,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}><ChevronLeft size={16} style={{verticalAlign:"middle"}}/> 이전</button>}
            {step<4
              ?<button onClick={nextStep} style={{flex:1,padding:"16px",background:"#0066FF",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>다음 <ChevronRight size={16}/></button>
              :<button onClick={handleSubmit} disabled={saving} style={{flex:1,padding:"16px",background:saving?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>{saving?"등록 중...":"매물 등록하기"}</button>
            }
          </div>
        </div>
      </div>
    </>
  );
}
