// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/dealer/cars/new/page.tsx
// ═══════════════════════════════════════════════════
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
const COLORS_DATA = [
  {name:"검정색",hex:"#1A1A1A"},{name:"흰색",hex:"#FFFFFF"},{name:"갈대색",hex:"#C4A775"},{name:"청색",hex:"#1E4D8C"},{name:"빨간색",hex:"#CC2222"},{name:"자주색",hex:"#8B1A5C"},
  {name:"검정투톤",hex:"#333333"},{name:"진주색",hex:"#E8DDD0"},{name:"연금색",hex:"#C5B883"},{name:"하늘색",hex:"#87CEEB"},{name:"주황색",hex:"#E87030"},{name:"보라색",hex:"#6B3FA0"},
  {name:"쥐색",hex:"#6E6E6E"},{name:"흰색투톤",hex:"#F0ECE4"},{name:"갈색",hex:"#7B5B3A"},{name:"명은색",hex:"#C0C0C0"},{name:"담녹색",hex:"#6B8E6B"},{name:"분홍색",hex:"#E8A0B0"},
  {name:"은색",hex:"#C0C0C0"},{name:"진주투톤",hex:"#D8CFC0"},{name:"갈색투톤",hex:"#8B6E4E"},{name:"금색",hex:"#CFB53B"},{name:"녹색",hex:"#2E7D32"},{name:"노란색",hex:"#E8D020"},
  {name:"은회색",hex:"#A0A0A0"},{name:"은색투톤",hex:"#B0B0B0"},{name:"은하색",hex:"#9CA8B8"},{name:"금색투톤",hex:"#B8A040"},{name:"청옥색",hex:"#008B8B"},{name:"연두색",hex:"#8BC34A"},
];
const INTERIOR_COLORS_DATA = [
  {name:"블랙",hex:"#1A1A1A"},{name:"아이보리",hex:"#FFFFF0"},{name:"베이지",hex:"#D4C5A0"},{name:"그레이",hex:"#808080"},
  {name:"브라운",hex:"#6B4226"},{name:"레드",hex:"#CC2222"},{name:"네이비",hex:"#1B2A4A"},{name:"화이트",hex:"#F5F5F5"},{name:"기타",hex:"transparent"},
];
const COLORS = COLORS_DATA.map(c=>c.name);
const INTERIOR_COLORS = INTERIOR_COLORS_DATA.map(c=>c.name);
const TRANSMISSIONS  = ["자동","수동"];
const REGIONS        = ["광주","전남","전북","서울","경기","인천","대전","대구","부산","울산","세종","충북","충남","경북","경남","강원","제주"];
const IMPORT_TYPES   = ["해당없음","공식 수입","병행 수입"];

/* ═══ 세부모델 출시연도 매핑 (신형→구형 정렬용) ═══ */
const MODEL_YEARS: Record<string, string> = {
  /* 현대 */
  "아반떼 CN7":"2020~현재","아반떼 AD":"2015~2020","아반떼 MD":"2010~2015","아반떼 HD":"2006~2010","아반떼 XD":"2000~2006",
  "쏘나타 DN8":"2019~현재","쏘나타 MX5":"2024~현재","쏘나타 LF":"2014~2019","쏘나타 YF":"2009~2014","쏘나타 NF":"2004~2009","쏘나타 EF":"1998~2004",
  "그랜저 GN7":"2022~현재","그랜저 IG":"2016~2022","그랜저 HG":"2011~2016","그랜저 TG":"2005~2011","그랜저 XG":"1998~2005",
  "투싼 NX4":"2021~현재","투싼 TL":"2015~2021","투싼 ix":"2009~2015","투싼 JM":"2004~2009",
  "싼타페 MX5":"2023~현재","싼타페 TM":"2018~2023","싼타페 DM":"2012~2018","싼타페 CM":"2005~2012",
  "팰리세이드":"2018~현재","코나 2세대":"2023~현재","코나 OS":"2017~2023","베뉴":"2019~현재",
  "아이오닉5":"2021~현재","아이오닉5 N":"2024~현재","아이오닉6":"2022~현재","아이오닉9":"2025~현재",
  "스타리아":"2021~현재","캐스퍼":"2021~현재","캐스퍼 AX1":"2021~현재","넥쏘":"2018~현재",
  "벨로스터":"2018~2022","i30 PD":"2017~2022","i30 GD":"2011~2017","i30 FD":"2007~2011",
  "엑센트":"2010~2019","액센트 HC":"2017~2019","액센트 RB":"2010~2017",
  "베르나 MC":"2005~2010","베르나 LC":"1999~2005","아슬란":"2014~2019",
  "아토스 MX":"1997~2003","클릭/겟츠 TB":"2002~2008","i10 PA":"2007~2013","i10 BA":"2013~2019",
  "쏘나타 트랜스폼 YF":"2012~2014",
  /* 기아 */
  "K3 BD":"2018~현재","K3 YD":"2012~2018","세라토":"2003~2008",
  "K5 DL3":"2019~현재","K5 JF":"2015~2019","K5 TF":"2010~2015","K5 MG":"2005~2010",
  "K8":"2021~현재","K8 GL3":"2021~현재",
  "K9 RJ":"2022~현재","K9 KH":"2012~2018",
  "쏘렌토 MQ4":"2020~현재","쏘렌토 UM":"2014~2020","쏘렌토 R XM":"2009~2014","쏘렌토 BL":"2002~2009",
  "스포티지 NQ5":"2021~현재","스포티지 QL":"2015~2021","스포티지 R SL":"2010~2015","스포티지 KM":"2004~2010",
  "카니발 KA4":"2020~현재","카니발 YP":"2014~2020","카니발 VQ":"2005~2014",
  "모닝 JA":"2017~현재","모닝 TA":"2011~2017","모닝 SA":"2004~2011",
  "레이":"2011~현재","스팅어":"2017~2023","EV6":"2021~현재","EV9":"2023~현재","EV3":"2024~현재",
  "니로 SG2":"2022~현재","니로 DE":"2016~2022","셀토스":"2019~현재",
  /* 제네시스 */
  "G70":"2017~현재","G80 RG3":"2020~현재","G80":"2016~2020","G90 RS4":"2022~현재","G90 HI":"2016~2022",
  "GV60":"2022~현재","GV70":"2021~현재","GV80":"2020~현재","GV80 쿠페":"2023~현재",
  /* KG모빌리티(쌍용) */
  "토레스":"2022~현재","토레스 EVX":"2024~현재","액티언 스포츠":"2006~2018","티볼리":"2015~현재","티볼리 에어":"2016~현재",
  "코란도":"2019~현재","코란도 C":"2011~2019","렉스턴":"2017~현재","렉스턴 스포츠":"2018~현재",
  /* 르노코리아 */
  "QM6":"2016~현재","SM6":"2016~2024","XM3":"2020~현재","아르카나":"2023~현재","그랑 콜레오스":"2024~현재",
  /* 쉐보레 */
  "트랙스 크로스":"2023~현재","트랙스":"2013~2023","이쿼녹스":"2023~현재","트래버스":"2019~현재",
  "말리부":"2016~2024","스파크":"2009~2022","볼트 EV":"2017~2023","볼트 EUV":"2021~2023",
  "트레일블레이저":"2020~현재","콜로라도":"2016~현재",
  /* 수입차 주요 모델 */
  "3시리즈 G20":"2018~현재","5시리즈 G60":"2023~현재","5시리즈 G30":"2016~2023","X3 G01":"2017~현재","X5 G05":"2018~현재",
  "E클래스 W214":"2023~현재","E클래스 W213":"2016~2023","C클래스 W206":"2021~현재","C클래스 W205":"2014~2021",
  "GLC X254":"2022~현재","GLC X253":"2015~2022","GLE W167":"2018~현재",
  "A4 B9":"2015~현재","A6 C8":"2018~현재","Q5 FY":"2016~현재","Q7 4M":"2015~현재",
  "모델 Y":"2020~현재","모델 3":"2017~현재","모델 X":"2015~현재","모델 S":"2012~현재",
  "캠리 XV70":"2017~현재","RAV4 XA50":"2018~현재","프리우스":"2022~현재",
  "시빅":"2021~현재","CR-V":"2022~현재","어코드":"2022~현재",
  "골프 8":"2019~현재","골프 7":"2012~2019","티구안 AD":"2016~현재","ID.4":"2020~현재",
};

function getModelStartYear(name: string): number {
  const range = MODEL_YEARS[name];
  if (!range) return 0;
  const match = range.match(/^(\d{4})/);
  return match ? parseInt(match[1]) : 0;
}

const OPTION_CATS    = [
  {name:"안전",items:[
    {label:"에어백(운전석)",tip:"운전석 전면 에어백"},
    {label:"에어백(동승석)",tip:"동승석 전면 에어백"},
    {label:"에어백(사이드)",tip:"측면 충돌 시 보호"},
    {label:"에어백(커튼)",tip:"전복/측면 충돌 시 머리 보호"},
    {label:"ABS",tip:"급제동 시 바퀴 잠김 방지"},
    {label:"ESC(차체자세제어)",tip:"미끄러짐 방지 전자 제어"},
    {label:"후방카메라",tip:"후진 시 후방 영상 표시"},
    {label:"전방충돌방지",tip:"전방 충돌 위험 시 자동 제동"},
    {label:"차선이탈경보",tip:"차선 이탈 시 경고음/진동"},
    {label:"차선유지보조",tip:"차선 이탈 시 자동 조향"},
    {label:"사각지대감지",tip:"사각지대 차량 접근 시 경고"},
    {label:"어라운드뷰",tip:"360도 주변 영상 표시"},
    {label:"후방교차충돌경고",tip:"후진 시 측방 접근 차량 경고"},
  ]},
  {name:"편의",items:[
    {label:"스마트키",tip:"버튼식 시동 + 무선 잠금해제"},
    {label:"오토홀드",tip:"정차 시 브레이크 자동 유지"},
    {label:"열선시트(앞)",tip:"앞좌석 시트 히팅"},
    {label:"열선시트(뒤)",tip:"뒷좌석 시트 히팅"},
    {label:"통풍시트",tip:"시트 쿨링 (에어컨 바람)"},
    {label:"전동시트(운전석)",tip:"전동 조절 시트"},
    {label:"헤드업디스플레이",tip:"속도/내비 정보를 전면유리에 표시"},
    {label:"무선충전",tip:"스마트폰 무선 충전 패드"},
    {label:"파워트렁크",tip:"버튼/발차기로 트렁크 자동 개폐"},
    {label:"전동접이식미러",tip:"사이드미러 자동 접기"},
    {label:"오토라이트",tip:"조도에 따라 전조등 자동 ON/OFF"},
  ]},
  {name:"멀티미디어",items:[
    {label:"내비게이션",tip:"내장형 네비게이션 시스템"},
    {label:"카플레이/안드로이드오토",tip:"스마트폰 미러링 연결"},
    {label:"블루투스",tip:"핸즈프리 통화/음악 재생"},
    {label:"USB충전",tip:"USB 충전 포트"},
    {label:"프리미엄사운드",tip:"JBL/하만카돈/BOSE/B&O 등"},
    {label:"후석모니터",tip:"뒷좌석 엔터테인먼트 모니터"},
  ]},
  {name:"외관",items:[
    {label:"LED헤드램프",tip:"LED 전조등"},
    {label:"선루프",tip:"일반 선루프"},
    {label:"파노라마선루프",tip:"전체 루프 개방형 선루프"},
    {label:"루프랙",tip:"지붕 캐리어 장착용 레일"},
    {label:"18인치이상휠",tip:"18인치 이상 대형 휠"},
    {label:"프라이버시유리",tip:"뒷유리 틴팅 (프라이버시)"},
  ]},
  {name:"주행/성능",items:[
    {label:"터보차저",tip:"엔진 과급기 (출력 향상)"},
    {label:"AWD(사륜구동)",tip:"전륜+후륜 상시/온디맨드 4WD"},
    {label:"에어서스펜션",tip:"공기압식 서스펜션 (승차감 조절)"},
    {label:"어댑티브크루즈",tip:"앞차 거리에 따라 속도 자동 조절"},
    {label:"전자제어서스펜션",tip:"노면에 따라 댐퍼 자동 조절"},
    {label:"패들시프트",tip:"핸들 뒤 수동 변속 레버"},
  ]},
];

/* ═══ 성능점검 데이터 ═══ */
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
  const [activeField, setActiveField] = useState<string>("plate"); /* 현재 선택된 필드 */
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBase,  setSelectedBase]  = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [grade,         setGrade]         = useState("");
  const [customGrade,   setCustomGrade]   = useState("");
  const [year,          setYear]          = useState(new Date().getFullYear());
  const [yearMonth,     setYearMonth]     = useState(String(new Date().getMonth()+1).padStart(2,"0"));
  const [mileage,       setMileage]       = useState("");
  const [fuel,          setFuel]          = useState("가솔린");
  const [color,         setColor]         = useState("");
  const [customColor,   setCustomColor]   = useState("");
  const [interiorColor, setInteriorColor] = useState("");
  const [transmission,  setTransmission]  = useState("자동");
  const [cc,            setCc]            = useState("");
  const [owners,        setOwners]        = useState("1");
  const [accident,      setAccident]      = useState(false);
  const [plateNumber,   setPlateNumber]   = useState("");
  const [importType,    setImportType]    = useState("해당없음");
  const [warranty,      setWarranty]      = useState("없음");

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
  const [skipInspection,  setSkipInspection]  = useState(false);

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

  const [damage1, setDamage1] = useState<Record<string,DamageRow>>(() => initDamageMap(PANEL_1RANK));
  const [damageA, setDamageA] = useState<Record<string,DamageRow>>(() => initDamageMap(PANEL_ARANK));
  const [damageB, setDamageB] = useState<Record<string,DamageRow>>(() => initDamageMap(PANEL_BRANK));
  const [damageC, setDamageC] = useState<Record<string,DamageRow>>(() => initDamageMap(PANEL_CRANK));

  const updateDamage = (setter: React.Dispatch<React.SetStateAction<Record<string,DamageRow>>>) =>
    (item:string, col:keyof DamageRow, v:boolean) =>
      setter(prev => ({...prev, [item]:{...prev[item],[col]:v}}));

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

  const [exteriorState,   setExteriorState]   = useState<GoodBad>("");
  const [interiorState,   setInteriorState]   = useState<GoodBad>("");
  const [polishState,     setPolishState]     = useState<GoodBad>("");
  const [wheelState,      setWheelState]      = useState<GoodBad>("");
  const [tireState,       setTireState]       = useState<GoodBad>("");
  const [glassState,      setGlassState]      = useState<GoodBad>("");

  const [inspFrontPhoto,  setInspFrontPhoto]  = useState("");
  const [inspRearPhoto,   setInspRearPhoto]   = useState("");
  const [uploadingInsp,   setUploadingInsp]   = useState<"front"|"rear"|null>(null);

  const [inspDate,        setInspDate]        = useState(new Date().toISOString().slice(0,10));
  const [inspectorName,   setInspectorName]   = useState("");
  const [informerName,    setInformerName]    = useState("");
  const [agreeWarning,    setAgreeWarning]    = useState(false);

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
  const handleBrandChange=(brand:string)=>{setSelectedBrand(brand);setSelectedBase("");setSelectedModel("");setGrade("");setActiveField("model");};
  const handleBaseChange=(base:string)=>{setSelectedBase(base);setSelectedModel("");setGrade(""); const g=baseModels.find(g=>g.base===base); if(g&&g.variants.length===1){handleModelSelect(g.variants[0].name);setActiveField("submodel");}else{setActiveField("submodel");}};
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

  /* ═══ Step 1 필드 정의 ═══ */
  type FieldDef = { key:string; label:string; required:boolean; value:string; };
  const step1Fields: FieldDef[] = [
    { key:"plate",     label:"차량번호",          required:true,  value: plateNumber || "" },
    { key:"brand",     label:"제조사",            required:true,  value: selectedBrand || "" },
    { key:"model",     label:"모델",              required:true,  value: selectedBase || "" },
    { key:"submodel",  label:"세부모델",          required:true,  value: selectedModel || "" },
    { key:"fuel",      label:"연료",              required:false, value: fuel },
    { key:"grade",     label:"등급",              required:true,  value: grade==="직접입력" ? customGrade : grade },
    { key:"import",    label:"수입구분",          required:false, value: importType },
    { key:"warranty",  label:"제조사보증",        required:false, value: warranty },
    { key:"year",      label:"연식(최초등록일)",  required:true,  value: `${year}년 ${yearMonth}월` },
    { key:"cc",        label:"배기량",            required:true,  value: fuel==="전기" ? "전기차 ⚡" : cc ? `${Number(cc).toLocaleString()}cc` : "" },
    { key:"trans",     label:"변속기",            required:true,  value: transmission },
    { key:"color",     label:"색상",              required:true,  value: color==="기타" ? customColor : color },
    { key:"interior",  label:"내장 시트 색상",    required:true,  value: interiorColor },
    { key:"mileage",   label:"주행거리",          required:true,  value: mileage ? `${Number(mileage).toLocaleString()}km` : "" },
    { key:"owners",    label:"소유자 수",         required:false, value: `${owners}인` },
    { key:"accident",  label:"사고이력",          required:false, value: accident ? "사고 있음" : "무사고" },
  ];

  /* ═══ Step 1 오른쪽 패널 렌더링 ═══ */
  const renderRightPanel = () => {
    const panelStyle: React.CSSProperties = { padding:"24px 20px" };
    const panelTitle = (t:string, desc?:string) => (
      <div style={{marginBottom:20}}>
        <div style={{fontSize:16,fontWeight:800,color:"#222",marginBottom:desc?4:0}}>{t}</div>
        {desc && <div style={{fontSize:12,color:"#AAA"}}>{desc}</div>}
      </div>
    );
    const optBtn = (label:string, selected:boolean, onClick:()=>void, sub?:string) => (
      <button key={label} onClick={onClick} style={{
        display:"block", width:"100%", textAlign:"left",
        padding:"14px 18px", marginBottom:8, borderRadius:12,
        border: selected ? "2px solid #FF3B1E" : "1.5px solid #E8E5E0",
        background: selected ? "#FFF5F3" : "white",
        cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif",
        transition:"all 0.15s",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:18,height:18,borderRadius:"50%",border:selected?"2px solid #FF3B1E":"2px solid #CCC",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {selected && <div style={{width:10,height:10,borderRadius:"50%",background:"#FF3B1E"}}/>}
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:selected?800:500,color:selected?"#FF3B1E":"#444"}}>{label}</div>
            {sub && <div style={{fontSize:11,color:"#AAA",marginTop:2}}>{sub}</div>}
          </div>
        </div>
      </button>
    );

    switch(activeField) {
      case "plate":
        return <div style={panelStyle}>
          {panelTitle("차량번호 입력","차량번호를 입력하면 자동으로 차량 정보를 불러옵니다.")}
          <input value={plateNumber} onChange={e=>setPlateNumber(e.target.value)} placeholder="예) 12가1234" style={{...inputS,border:errBorder("plate"),fontSize:18,fontWeight:700,letterSpacing:2,marginBottom:12}}/>
          <button onClick={()=>alert("국토교통부 차량 조회 기능은 준비 중입니다.")} style={{width:"100%",padding:"14px",background:"#1847FF",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>🏛️ 국토부 자동 조회</button>
          <div style={{fontSize:11,color:"#AAA",marginTop:8,lineHeight:1.6}}>• 현재 차량등록은 가능하며,<br/>• 실 차주는 중복등록 삭제/금지를 요청할 수 있습니다.</div>
        </div>;

      case "brand":
        return <div style={panelStyle}>
          {panelTitle("제조사 선택")}
          <div style={{fontSize:12,fontWeight:700,color:"#FF3B1E",marginBottom:10}}>🇰🇷 국산</div>
          {brandList.filter(b=>brands[b].category==="국산").map(b=>optBtn(b, selectedBrand===b, ()=>handleBrandChange(b)))}
          <div style={{fontSize:12,fontWeight:700,color:"#0066FF",marginBottom:10,marginTop:16}}>🌍 수입</div>
          {brandList.filter(b=>brands[b].category==="수입").map(b=>optBtn(b, selectedBrand===b, ()=>handleBrandChange(b)))}
        </div>;

      case "model":
        return <div style={panelStyle}>
          {panelTitle("모델 선택", selectedBrand ? `${selectedBrand}의 모델` : "제조사를 먼저 선택해주세요")}
          {!selectedBrand ? <div style={{color:"#AAA",fontSize:14,textAlign:"center",padding:40}}>← 제조사를 먼저 선택해주세요</div> :
            baseModels.map(g=>optBtn(`${g.base}`, selectedBase===g.base, ()=>handleBaseChange(g.base), `${g.variants.length}개 세대`))
          }
        </div>;

      case "submodel":
        return <div style={panelStyle}>
          {panelTitle("세부모델 선택", selectedBase ? `${selectedBrand} ${selectedBase}` : "모델을 먼저 선택해주세요")}
          {!selectedBase ? <div style={{color:"#AAA",fontSize:14,textAlign:"center",padding:40}}>← 모델을 먼저 선택해주세요</div> :
            modelVariants.length<=1 ? <div style={{color:"#2D8A52",fontSize:14,textAlign:"center",padding:40}}>✓ {selectedModel || selectedBase} 자동 선택됨</div> :
            [...modelVariants].sort((a,b)=>{
              /* 현행 먼저, 그다음 출시연도 내림차순 (신형→구형) */
              if(a.status==="현행"&&b.status!=="현행") return -1;
              if(a.status!=="현행"&&b.status==="현행") return 1;
              const ya = getModelStartYear(a.name);
              const yb = getModelStartYear(b.name);
              if(ya!==yb) return yb - ya; /* 신형 먼저 */
              return a.name.localeCompare(b.name);
            }).map(v=>{
              const yearRange = MODEL_YEARS[v.name] || "";
              return optBtn(
                v.name,
                selectedModel===v.name,
                ()=>{handleModelSelect(v.name);setActiveField("fuel");},
                `${v.status==="현행"?"✦ 현행":"단종"}${yearRange?` · ${yearRange}`:""}`
              );
            })
          }
          {selectedBase && modelVariants.length>1 && (
            <div style={{fontSize:11,color:"#AAA",marginTop:12,lineHeight:1.6}}>
              • 선택하신 세부모델이 실제 차량정보와 다를 경우 차량이 삭제될 수 있습니다.<br/>
              • 등록 차량이 위 리스트에 없다면? 가장 유사한 모델을 선택해주세요.
            </div>
          )}
        </div>;

      case "fuel":
        return <div style={panelStyle}>
          {panelTitle("연료 선택")}
          {(allModelGrades.length>0 ? availableFuels : FUEL_TYPES).map((f:string)=>{
            const cnt = allModelGrades.filter((g:{fuelType:string})=>g.fuelType===f).length;
            const icon = f==="전기"?"⚡":f==="하이브리드"?"🔋":f==="디젤"?"🛢️":f==="LPG"?"🔥":f==="수소"?"💧":"⛽";
            return optBtn(`${icon} ${f}`, fuel===f, ()=>{setFuel(f);setGrade("");}, cnt>0?`${cnt}개 등급`:"");
          })}
        </div>;

      case "grade":
        return <div style={panelStyle}>
          {panelTitle("등급 선택", selectedModel ? `${selectedModel} · ${fuel}` : "모델/연료를 먼저 선택해주세요")}
          {filteredGrades.length>0 ? <>
            {filteredGrades.map((g:{grade:string;price:number;engine:string})=>
              optBtn(g.grade, grade===g.grade, ()=>setGrade(g.grade), `${g.price?.toLocaleString()}만원 · ${g.engine}`)
            )}
            <div style={{borderTop:"1px solid #EEE",marginTop:12,paddingTop:12}}>
              {optBtn("✎ 직접 입력", grade==="직접입력", ()=>setGrade("직접입력"))}
              {grade==="직접입력" && <input value={customGrade} onChange={e=>setCustomGrade(e.target.value)} placeholder="등급 직접 입력" style={{...inputS,border:"1.5px solid #E0DDD7",marginTop:8}}/>}
            </div>
          </> : <div style={{color:"#AAA",fontSize:13,textAlign:"center",padding:40}}>
            등급 데이터가 없습니다. 직접 입력해주세요.
            {optBtn("✎ 직접 입력", grade==="직접입력", ()=>setGrade("직접입력"))}
            {grade==="직접입력" && <input value={customGrade} onChange={e=>setCustomGrade(e.target.value)} placeholder="등급 직접 입력" style={{...inputS,border:"1.5px solid #E0DDD7",marginTop:8}}/>}
          </div>}
          <div style={{fontSize:11,color:"#AAA",marginTop:16,lineHeight:1.6}}>
            • 선택하신 등급이 실제 차량정보와 다를 경우 차량이 삭제될 수 있습니다.<br/>
            • 등록 차량이 위 리스트에 없다면? 직접 입력을 선택해주세요.
          </div>
        </div>;

      case "import":
        return <div style={panelStyle}>
          {panelTitle("수입구분")}
          {IMPORT_TYPES.map(t=>optBtn(t, importType===t, ()=>setImportType(t)))}
        </div>;

      case "warranty":
        return <div style={panelStyle}>
          {panelTitle("제조사보증","제조사 보증 잔여 여부")}
          {["없음","보증기간 내","연장보증"].map(t=>optBtn(t, warranty===t, ()=>setWarranty(t)))}
        </div>;

      case "year":
        return <div style={panelStyle}>
          {panelTitle("연식 (최초등록일)")}
          <div style={{display:"flex",gap:12,marginBottom:16}}>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:6,display:"block"}}>연도</label>
              <select value={year} onChange={e=>setYear(Number(e.target.value))} style={{...inputS,border:"1.5px solid #E0DDD7"}}>
                {Array.from({length:new Date().getFullYear()-1989},(_,i)=>new Date().getFullYear()-i).map(y=><option key={y} value={y}>{y}년</option>)}
              </select>
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:6,display:"block"}}>월</label>
              <select value={yearMonth} onChange={e=>setYearMonth(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7"}}>
                {Array.from({length:12},(_,i)=>String(i+1).padStart(2,"0")).map(m=><option key={m} value={m}>{m}월</option>)}
              </select>
            </div>
          </div>
          {/* 형식연도 설명 */}
          <div style={{background:"#F8F6F3",borderRadius:12,padding:"16px 18px",marginTop:12}}>
            <div style={{fontSize:14,fontWeight:800,color:"#333",marginBottom:10}}>형식연도란?</div>
            <p style={{fontSize:12,color:"#666",lineHeight:1.8,marginBottom:12}}>
              <strong>연식</strong>은 본인 명의 등록일을 말하며, <strong>형식연도</strong>는 제조사의 신형/구형 모델 구분을 위해 부여한 연식입니다.
            </p>
            <p style={{fontSize:12,color:"#666",lineHeight:1.8,marginBottom:12}}>
              예를 들어 2014년 말에 출시된 신형 모델이 &quot;2015년형 모델&quot;로 판매되는 경우를 말합니다.
            </p>
            <div style={{background:"white",borderRadius:10,padding:"14px",border:"1px solid #E8E5E0"}}>
              <div style={{fontSize:11,color:"#AAA",marginBottom:6}}>예시</div>
              <div style={{fontSize:13,color:"#333",lineHeight:1.8}}>
                <span style={{fontWeight:700,color:"#FF3B1E"}}>A</span> 최초등록일 = <strong>연식</strong> (예: 2021년 05월)<br/>
                <span style={{fontWeight:700,color:"#0066FF"}}>B</span> 형식 및 연식의 연도 = <strong>형식연도</strong> (예: 2021년)
              </div>
            </div>
            <p style={{fontSize:11,color:"#AAA",marginTop:10,lineHeight:1.6}}>
              연식과 형식연도가 다를 경우 함께 표기됩니다.<br/>예) 11월 10월식 (12년형)
            </p>
          </div>
        </div>;

      case "cc":
        return <div style={panelStyle}>
          {panelTitle("배기량 (cc)")}
          {fuel==="전기" ? (
            <div style={{background:"#EEF5FF",borderRadius:12,padding:"20px",textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:8}}>⚡</div>
              <div style={{fontSize:15,fontWeight:800,color:"#0066FF",marginBottom:4}}>전기차</div>
              <div style={{fontSize:12,color:"#888"}}>전기차는 배기량이 없습니다. 자동으로 0cc로 설정됩니다.</div>
            </div>
          ) : (
            <>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" value={cc} onChange={e=>setCc(e.target.value)} placeholder="예: 1998" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1,fontSize:18,fontWeight:700}}/>
                <span style={{fontSize:15,color:"#888",fontWeight:700}}>cc</span>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:8,marginTop:14,cursor:"pointer",padding:"12px 16px",borderRadius:10,border:fuel==="전기"?"2px solid #0066FF":"1px solid #E0DDD7",background:fuel==="전기"?"#EEF5FF":"white"}}>
                <input type="checkbox" checked={fuel==="전기"} onChange={e=>{if(e.target.checked){setFuel("전기");setCc("0");}}} style={{width:16,height:16,accentColor:"#0066FF"}}/>
                <span style={{fontSize:13,fontWeight:700}}>⚡ 전기차입니다</span>
              </label>
            </>
          )}
        </div>;

      case "trans":
        return <div style={panelStyle}>
          {panelTitle("변속기")}
          {TRANSMISSIONS.map(t=>optBtn(t, transmission===t, ()=>setTransmission(t)))}
        </div>;

      case "color":
        return <div style={panelStyle}>
          {panelTitle("기본 색상 선택","1개를 선택해 주세요.")}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
            {COLORS_DATA.map(c=>(
              <button key={c.name} onClick={()=>setColor(c.name)} style={{
                width:80,height:40,borderRadius:8,border:color===c.name?"3px solid #FF3B1E":"1px solid #DDD",
                background:c.hex,cursor:"pointer",position:"relative",
                boxShadow:color===c.name?"0 0 0 1px #FF3B1E":"none",
              }}>
                <span style={{position:"absolute",bottom:-18,left:0,right:0,textAlign:"center",fontSize:10,fontWeight:color===c.name?800:500,color:color===c.name?"#FF3B1E":"#888"}}>{c.name}</span>
              </button>
            ))}
          </div>
          <div style={{marginTop:30,borderTop:"1px solid #EEE",paddingTop:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:8}}>제조사 출시 색상 (선택입력사항)</div>
            <div style={{display:"flex",gap:8}}>
              <input value={customColor} onChange={e=>setCustomColor(e.target.value)} placeholder="직접입력" style={{...inputS,flex:1,border:"1.5px solid #E0DDD7"}}/>
              <button onClick={()=>{if(customColor)setColor("기타");}} style={{padding:"13px 20px",background:"#FF3B1E",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>확인</button>
            </div>
          </div>
        </div>;

      case "interior":
        return <div style={panelStyle}>
          {panelTitle("내장 시트 색상","1개를 선택해 주세요.")}
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {INTERIOR_COLORS_DATA.map(c=>(
              <button key={c.name} onClick={()=>setInteriorColor(c.name)} style={{
                width:80,height:40,borderRadius:8,
                border:interiorColor===c.name?"3px solid #FF3B1E":"1px solid #DDD",
                background:c.name==="기타"?"linear-gradient(135deg,#EEE,#CCC)":c.hex,
                cursor:"pointer",position:"relative",
                boxShadow:interiorColor===c.name?"0 0 0 1px #FF3B1E":"none",
              }}>
                <span style={{position:"absolute",bottom:-18,left:0,right:0,textAlign:"center",fontSize:10,fontWeight:interiorColor===c.name?800:500,color:interiorColor===c.name?"#FF3B1E":"#888"}}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>;

      case "mileage":
        return <div style={panelStyle}>
          {panelTitle("주행거리")}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <input type="number" value={mileage} onChange={e=>setMileage(e.target.value)} placeholder="예: 35000" style={{...inputS,border:errBorder("mileage"),flex:1,fontSize:18,fontWeight:700}}/>
            <span style={{fontSize:15,color:"#888",fontWeight:700}}>km</span>
          </div>
        </div>;

      case "owners":
        return <div style={panelStyle}>
          {panelTitle("소유자 수")}
          {["1","2","3","4","5","6","7","8","9이상"].map(o=>optBtn(`${o}인`, owners===o, ()=>setOwners(o)))}
        </div>;

      case "accident":
        return <div style={panelStyle}>
          {panelTitle("사고이력")}
          {optBtn("무사고", !accident, ()=>setAccident(false))}
          {optBtn("사고 있음", accident, ()=>setAccident(true))}
        </div>;

      default:
        return <div style={{...panelStyle,display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
          <div style={{textAlign:"center",color:"#CCC"}}>
            <div style={{fontSize:40,marginBottom:12}}>👈</div>
            <div style={{fontSize:14}}>왼쪽에서 항목을 선택해주세요</div>
          </div>
        </div>;
    }
  };

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
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F4FF;} select:focus,input:focus,textarea:focus{outline:none;border-color:#0066FF!important;} input[type=checkbox],input[type=radio]{cursor:pointer;}
      .opt-tooltip-wrap button:hover+.opt-tip,.opt-tooltip-wrap:hover .opt-tip{opacity:1;transform:translateY(0);pointer-events:auto;}
      .opt-tooltip-wrap button:hover{background:#F0F6FF!important;border-color:#0066FF!important;}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F4FF"}}>
        {/* 헤더 */}
        <div style={{background:"white",borderBottom:"1px solid #DDEEFF",padding:"16px 24px"}}>
          <div style={{maxWidth:960,margin:"0 auto"}}>
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

        <div style={{maxWidth:960,margin:"0 auto",padding:"24px 16px 120px"}}>

          {/* ══ STEP 1: 차량 정보 (엔카 스타일 2패널) ══ */}
          {step===1&&(
            <div>
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:16}}>🚗 차량정보를 선택하세요</h2>
              <div style={{display:"flex",gap:0,borderRadius:16,overflow:"hidden",border:"1px solid #E0DDD7",background:"white",minHeight:500}}>
                {/* ── 왼쪽: 필드 목록 ── */}
                <div style={{width:340,flexShrink:0,borderRight:"1px solid #E8E5E0",overflowY:"auto",maxHeight:680}}>
                  {step1Fields.map((f)=>{
                    const isActive = activeField === f.key;
                    const hasValue = !!f.value;
                    const hasError = errorFields.has(f.key);
                    return (
                      <button
                        key={f.key}
                        onClick={()=>setActiveField(f.key)}
                        style={{
                          display:"flex", alignItems:"center", justifyContent:"space-between",
                          width:"100%", padding:"15px 18px",
                          border:"none", borderBottom:"1px solid #F0EEE9", borderLeft: isActive ? "3px solid #FF3B1E" : "3px solid transparent",
                          background: isActive ? "#FFF8F6" : "white",
                          cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif",
                          transition:"all 0.15s",
                        }}
                      >
                        <div style={{display:"flex",alignItems:"center",gap:4}}>
                          {f.required && <span style={{color:"#FF3B1E",fontSize:13,fontWeight:800}}>*</span>}
                          <span style={{fontSize:14,fontWeight: isActive ? 800 : hasError ? 700 : 500, color: hasError ? "#E24B4A" : isActive ? "#FF3B1E" : "#444"}}>{f.label}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          {hasValue && <span style={{fontSize:13,color:"#222",fontWeight:600,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.value}</span>}
                          <ChevronRight size={14} color={isActive?"#FF3B1E":"#CCC"}/>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {/* ── 오른쪽: 선택/입력 패널 ── */}
                <div style={{flex:1,overflowY:"auto",maxHeight:680,background:"#FAFAFA"}}>
                  {renderRightPanel()}
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
              <div style={{marginBottom:20}}>
                <label style={labelS}>차량 설명</label>
                <textarea rows={10} value={description} onChange={e=>setDescription(e.target.value)} placeholder={"차량 상태, 특이사항, 장점 등을 자유롭게 작성해주세요.\n\n예시)\n- 1인 소유, 비흡연 차량\n- 순정 상태 유지\n- 소모품 최근 교체 (타이어, 브레이크패드)\n- 실내외 깨끗한 상태\n- 추가 옵션: 블랙박스, 하이패스 등"} maxLength={5000} style={{...inputS,border:"1.5px solid #E0DDD7",resize:"vertical",minHeight:240,lineHeight:1.8}}/>
                <div style={{fontSize:11,color:"#AAA",textAlign:"right",marginTop:4}}>{description.length}/5,000자</div>
              </div>
              <div style={{marginBottom:16}}>
                <label style={labelS}>옵션 선택</label>
                {OPTION_CATS.map(cat=>(
                  <div key={cat.name} style={{marginBottom:14}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#0066FF",marginBottom:8}}>{cat.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {cat.items.map(item=>(
                        <div key={item.label} style={{position:"relative"}} className="opt-tooltip-wrap">
                          <button onClick={()=>toggleOption(item.label)} title={item.tip} style={{padding:"8px 14px",borderRadius:8,fontSize:12,fontWeight:options.includes(item.label)?800:500,border:options.includes(item.label)?"2px solid #0066FF":"1px solid #E0DDD7",background:options.includes(item.label)?"#EEF5FF":"white",color:options.includes(item.label)?"#0066FF":"#666",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",transition:"all 0.15s"}}>
                            {options.includes(item.label)&&<Check size={10} style={{marginRight:4}}/>}{item.label}
                          </button>
                        </div>
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
                        {tuning==="있음"&&<div style={{display:"flex",gap:10,marginTop:8}}>{["구조","장치"].map(t=>(<label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={tuningTypes.includes(t)} onChange={e=>setTuningTypes(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#FF3B1E"}}/>{t}</label>))}</div>}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16,flexWrap:"wrap"}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700,paddingTop:2}}>특별이력</div>
                      <div>
                        <RG value={specialHistory} options={["없음","있음"]} onChange={v=>setSpecialHistory(v as "없음"|"있음")}/>
                        {specialHistory==="있음"&&<div style={{display:"flex",gap:10,marginTop:8}}>{["침수","화재"].map(t=>(<label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={specialTypes.includes(t)} onChange={e=>setSpecialTypes(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#FF3B1E"}}/>{t}</label>))}</div>}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16,flexWrap:"wrap"}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700,paddingTop:2}}>용도변경</div>
                      <div>
                        <RG value={purposeChange} options={["없음","있음"]} onChange={v=>setPurposeChange(v as "없음"|"있음")}/>
                        {purposeChange==="있음"&&<div style={{display:"flex",gap:10,marginTop:8}}>{["렌트","영업용"].map(t=>(<label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={purposeTypes.includes(t)} onChange={e=>setPurposeTypes(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#FF3B1E"}}/>{t}</label>))}</div>}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16,flexWrap:"wrap"}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700}}>색상</div>
                      <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                        <RG value={colorState} options={["무채색","유채색"]} onChange={v=>setColorState(v as "무채색"|"유채색")}/>
                        <label style={{display:"flex",alignItems:"center",gap:5,fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={colorChange} onChange={e=>setColorChange(e.target.checked)} style={{accentColor:"#FF3B1E"}}/>색상변경</label>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",gap:16}}>
                      <div style={{minWidth:160,fontSize:13,fontWeight:700}}>리콜대상</div>
                      <RG value={recall} options={["해당없음","해당"]} onChange={v=>setRecall(v as "해당없음"|"해당")}/>
                    </div>
                  </div>

                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>💥 사고·교환·수리 등 이력</div>
                    <div style={{fontSize:11,color:"#AAA",marginBottom:14}}>해당 부위에 체크 표시하세요</div>
                    <DamageTable title="외판 부위" rank="1랭크" items={PANEL_1RANK} data={damage1} onChange={updateDamage(setDamage1)}/>
                    <DamageTable title="주요 골격 (A)" rank="A랭크" items={PANEL_ARANK} data={damageA} onChange={updateDamage(setDamageA)}/>
                    <DamageTable title="주요 골격 (B)" rank="B랭크" items={PANEL_BRANK} data={damageB} onChange={updateDamage(setDamageB)}/>
                    <DamageTable title="주요 골격 (C)" rank="C랭크" items={PANEL_CRANK} data={damageC} onChange={updateDamage(setDamageC)}/>
                  </div>

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

                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:14}}>🏎️ 자동차 기타정보</div>
                    {([ ["외장",exteriorState,setExteriorState], ["내장",interiorState,setInteriorState], ["광택",polishState,setPolishState], ["휠",wheelState,setWheelState], ["타이어",tireState,setTireState], ["유리",glassState,setGlassState] ] as [string,GoodBad,(v:GoodBad)=>void][]).map(([label, val, setter])=>(
                      <div key={label} style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
                        <div style={{minWidth:100,fontSize:13,fontWeight:700,color:"#444"}}>{label}</div>
                        <RG value={val} options={["양호","불량"]} onChange={v=>setter(v as GoodBad)}/>
                      </div>
                    ))}
                  </div>

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

          {/* 허위기재 경고 (Step 4에서 표시) */}
          {step===4 && !skipInspection && (
            <div style={{background:"#FFF8F0",border:"1px solid #FFD6A8",borderRadius:14,padding:"18px 20px",marginTop:16}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <span style={{fontSize:20,flexShrink:0}}>⚠️</span>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#C47A00",marginBottom:6}}>허위기재 주의사항</div>
                  <p style={{fontSize:12,color:"#8B6914",lineHeight:1.8,marginBottom:12}}>
                    자동차관리법 제58조에 따라 중고자동차 성능·상태를 허위로 기재하거나 중요 정보를 누락할 경우 <strong>법적 제재</strong>를 받을 수 있습니다.
                    사고이력, 침수이력, 주행거리 등을 사실과 다르게 기재 시 매물 삭제 및 딜러 자격이 영구 정지됩니다.
                  </p>
                  <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                    <input type="checkbox" checked={agreeWarning} onChange={e=>setAgreeWarning(e.target.checked)} style={{width:18,height:18,accentColor:"#FF3B1E",flexShrink:0}}/>
                    <span style={{fontSize:13,fontWeight:700,color:"#333"}}>위 내용을 확인하였으며, 모든 정보를 사실대로 기재하였음을 확인합니다.</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 에러 */}
          {errors.length>0&&(
            <div style={{background:"#FFF0ED",border:"1px solid #FFB8A8",borderRadius:12,padding:"14px 18px",marginTop:16}}>
              {errors.map((e,i)=><div key={i} style={{fontSize:13,color:"#E24B4A",fontWeight:600}}>• {e}</div>)}
            </div>
          )}

          {/* 하단 안내문 */}
          <div style={{marginTop:20,padding:"18px 20px",background:"#F5F3F0",borderRadius:12,borderTop:"3px solid #E0DDD7"}}>
            <p style={{fontSize:11,color:"#888",lineHeight:2,wordBreak:"keep-all"}}>
              · 차량 기본/옵션 정보는 차량등록 후 1회(대당이용권 차량은 48시간 이내 1회)에 한하여 함께 수정하실 수 있습니다.<br/>
              &nbsp;&nbsp;(단, 차량번호,제조사/모델, 연식/형식연도 등은 수정 불가)<br/>
              · 기타 정보는 등록 완료 후 마이페이지 &gt; 판매차량 &gt; 판매차량관리 메뉴에서 자유롭게 수정 또는 추가 하실 수 있습니다.<br/>
              · <strong>픽스카는 실제 차량정보와 다르게 입력하는 경우에 차량등록을 제한</strong>할 수 있으며, 관련법에 따라 처벌받을 수 있습니다.
            </p>
            <p style={{fontSize:10,color:"#AAA",marginTop:8,lineHeight:1.6}}>
              <span style={{textDecoration:"underline"}}>자동차관리법 58조, 80조</span> / <span style={{textDecoration:"underline"}}>자동차관리법 시행규칙 120조</span>
            </p>
          </div>

          {/* 하단 버튼 */}
          <div style={{display:"flex",gap:10,marginTop:12}}>
            {step>1&&<button onClick={()=>{setStep(step-1);setErrors([]);setErrorFields(new Set());}} style={{padding:"16px 24px",background:"white",border:"1.5px solid #E0DDD7",borderRadius:14,fontSize:15,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}><ChevronLeft size={16} style={{verticalAlign:"middle"}}/> 이전</button>}
            {step<4
              ?<button onClick={nextStep} style={{flex:1,padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>다음 (옵션선택) <ChevronRight size={16}/></button>
              :<button onClick={handleSubmit} disabled={saving||(!skipInspection&&!agreeWarning)} style={{flex:1,padding:"16px",background:saving?"#CCC":(!skipInspection&&!agreeWarning)?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:saving||(!skipInspection&&!agreeWarning)?"not-allowed":"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>{saving?"등록 중...":(!skipInspection&&!agreeWarning)?"허위기재 확인 필수":"매물 등록하기"}</button>
            }
          </div>
        </div>
      </div>
    </>
  );
}
