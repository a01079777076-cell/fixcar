// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/dealer/cars/new/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect, useMemo, useRef, useCallback, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
const TRANSMISSIONS  = ["오토","수동","세미오토","CVT","기타"];
const REGIONS        = ["광주","전남","전북","서울","경기","인천","대전","대구","부산","울산","세종","충북","충남","경북","경남","강원","제주"];
const IMPORT_TYPES   = ["국산 차량","공식 수입","병행 수입"];

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
  {name:"외관/내장",items:[
    {label:"선루프",tip:"일반 선루프 (틸트/슬라이딩)"},
    {label:"파노라마 선루프",tip:"전체 루프 유리 개방형"},
    {label:"LED 헤드램프",tip:"HID/LED 전조등"},
    {label:"파워 전동 트렁크",tip:"버튼/발차기로 트렁크 자동 개폐"},
    {label:"고스트 도어 클로징",tip:"문 자동 닫힘 기능"},
    {label:"전동접이 사이드미러",tip:"사이드미러 자동 접기"},
    {label:"알루미늄 휠",tip:"알루미늄 합금 휠"},
    {label:"루프랙",tip:"지붕 캐리어 장착용 레일"},
    {label:"열선 스티어링 휠",tip:"핸들 히팅 기능"},
    {label:"전동 조절 스티어링 휠",tip:"핸들 높이/거리 전동 조절"},
    {label:"패들 시프트",tip:"핸들 뒤 수동 변속 레버"},
    {label:"스티어링 휠 리모컨",tip:"핸들 버튼으로 오디오/전화 조작"},
    {label:"ECM 룸미러",tip:"전자식 자동 방현 룸미러"},
    {label:"하이패스",tip:"하이패스 단말기 내장"},
    {label:"프라이버시 유리",tip:"뒷유리 틴팅 (프라이버시)"},
  ]},
  {name:"안전",items:[
    {label:"에어백(운전석/동승석)",tip:"전면 에어백"},
    {label:"에어백(사이드)",tip:"측면 충돌 시 보호"},
    {label:"에어백(커튼)",tip:"전복/측면 충돌 시 머리 보호"},
    {label:"ABS",tip:"급제동 시 바퀴 잠김 방지"},
    {label:"TCS(미끄럼방지)",tip:"구동력 제어 시스템"},
    {label:"ESC(차체자세제어)",tip:"미끄러짐 방지 전자 제어"},
    {label:"TPMS(타이어공기압)",tip:"타이어 공기압 모니터링"},
    {label:"차선이탈경보(LDWS)",tip:"차선 이탈 시 경고"},
    {label:"차선유지보조(LKA)",tip:"차선 이탈 시 자동 조향"},
    {label:"전자제어 서스펜션",tip:"노면에 따라 댐퍼 자동 조절"},
    {label:"주차감지센서(전방/후방)",tip:"장애물 접근 시 경고음"},
    {label:"후측방 경보 시스템",tip:"사각지대 차량 접근 시 경고"},
    {label:"후방 카메라",tip:"후진 시 후방 영상 표시"},
    {label:"360도 어라운드 뷰",tip:"360도 주변 영상 표시"},
    {label:"전방충돌방지",tip:"전방 충돌 위험 시 자동 제동"},
    {label:"후방교차충돌경고",tip:"후진 시 측방 접근 차량 경고"},
  ]},
  {name:"편의/멀티미디어",items:[
    {label:"크루즈 컨트롤",tip:"정속 주행 장치 (일반/어댑티브)"},
    {label:"어댑티브 크루즈",tip:"앞차 거리에 따라 속도 자동 조절"},
    {label:"헤드업 디스플레이(HUD)",tip:"속도/내비 정보를 전면유리에 표시"},
    {label:"전자식 주차브레이크(EPB)",tip:"전자식 파킹 브레이크"},
    {label:"오토홀드",tip:"정차 시 브레이크 자동 유지"},
    {label:"자동 에어컨",tip:"온도 자동 조절 에어컨"},
    {label:"스마트키",tip:"버튼식 시동 + 무선 잠금해제"},
    {label:"무선도어 잠금장치",tip:"리모컨 키 도어 잠금/해제"},
    {label:"레인센서",tip:"비 감지 자동 와이퍼"},
    {label:"오토 라이트",tip:"조도에 따라 전조등 자동 ON/OFF"},
    {label:"커튼/블라인드",tip:"뒷좌석/후방 커튼/블라인드"},
    {label:"내비게이션",tip:"내장형 네비게이션"},
    {label:"카플레이/안드로이드오토",tip:"스마트폰 미러링 연결"},
    {label:"블루투스",tip:"핸즈프리 통화/음악 재생"},
    {label:"뒷좌석 AV 모니터",tip:"뒷좌석 엔터테인먼트"},
    {label:"USB 단자",tip:"USB 충전/연결 포트"},
    {label:"무선충전",tip:"스마트폰 무선 충전 패드"},
    {label:"프리미엄 사운드",tip:"JBL/하만카돈/BOSE/B&O 등"},
  ]},
  {name:"시트",items:[
    {label:"가죽시트",tip:"천연/인조 가죽 시트"},
    {label:"전동시트(운전석/동승석)",tip:"전동 조절 시트"},
    {label:"전동시트(뒷좌석)",tip:"뒷좌석 전동 조절"},
    {label:"열선시트(앞좌석)",tip:"앞좌석 시트 히팅"},
    {label:"열선시트(뒷좌석)",tip:"뒷좌석 시트 히팅"},
    {label:"메모리시트(운전석)",tip:"시트 위치 기억 기능"},
    {label:"통풍시트(운전석/동승석)",tip:"시트 쿨링 (에어컨 바람)"},
    {label:"통풍시트(뒷좌석)",tip:"뒷좌석 통풍"},
    {label:"마사지 시트",tip:"시트 내장 마사지 기능"},
  ]},
  {name:"주행/성능",items:[
    {label:"터보차저",tip:"엔진 과급기 (출력 향상)"},
    {label:"AWD(사륜구동)",tip:"전륜+후륜 4WD"},
    {label:"에어 서스펜션",tip:"공기압식 서스펜션 (승차감 조절)"},
  ]},
  {name:"기타(애프터마켓)",items:[
    {label:"블랙박스",tip:"전방/후방 블랙박스"},
    {label:"버튼 시동키",tip:"순정 외 시동 버튼 장착"},
    {label:"인치업",tip:"휠 인치 업그레이드"},
    {label:"휠 튜닝",tip:"정품/카피 휠 교체"},
    {label:"ECU 맵핑",tip:"엔진 제어 유닛 튜닝"},
    {label:"배기 튜닝",tip:"배기 시스템 교체/개조"},
    {label:"차고/감쇠력 조절 서스",tip:"애프터 서스펜션 교체"},
    {label:"스포일러",tip:"리어 스포일러 장착"},
    {label:"바디킷",tip:"외관 에어로 파츠"},
    {label:"랩핑",tip:"차량 외관 랩핑"},
    {label:"실내 방음/방청",tip:"방음재/방청 시공"},
    {label:"견인 장치",tip:"트레일러 히치/견인 장치"},
  ]},
];

/* ═══ 성능점검 데이터 ═══ */
const PANEL_1RANK = ["후드","프론트 펜더(좌)","프론트 펜더(우)","프론트 도어(좌)","프론트 도어(우)","리어 도어(좌)","리어 도어(우)","트렁크리드"];
const PANEL_2RANK = ["라디에이터 서포트(볼트체결부품)","쿼터 패널(리어펜더)(좌)","쿼터 패널(리어펜더)(우)","루프 패널","사이드실 패널(좌)","사이드실 패널(우)"];
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
function PhotoGuideSvg({ type }: { type: "front34"|"rear34"|"front"|"rear"|"interior" }) {
  const bc="#D6E4F0",lc="#90A8C0",ac="#FF3B1E";
  if(type==="interior") return (
    <svg width={140} height={105} viewBox="0 0 140 105" fill="none">
      <rect x="15" y="20" width="110" height="65" rx="10" fill={bc} stroke={lc} strokeWidth="1.5"/>
      <rect x="30" y="30" width="80" height="35" rx="6" fill="#B8D4E8" stroke={lc} strokeWidth="1"/>
      <circle cx="45" cy="72" r="10" fill="#AAC0D0" stroke={lc} strokeWidth="1.5"/>
      <circle cx="95" cy="72" r="10" fill="#AAC0D0" stroke={lc} strokeWidth="1.5"/>
      <rect x="60" y="68" width="20" height="12" rx="3" fill="#AAC0D0" stroke={lc} strokeWidth="1"/>
      <text x="70" y="50" textAnchor="middle" fontSize="9" fill={lc} fontWeight="bold">INTERIOR</text>
      <path d="M70 8 L70 20" stroke={ac} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6"/>
      <circle cx="70" cy="5" r="4" fill={ac} opacity="0.6"/>
    </svg>
  );
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
  { key:"main1", label:"① 전면 좌측 각도",  guide:"전면에서 왼쪽을 쳐다보는 각도",   svgType:"front34" as const },
  { key:"main2", label:"② 후면 우측 각도",  guide:"후면에서 오른쪽을 쳐다보는 각도", svgType:"rear34"  as const },
  { key:"main3", label:"③ 정면",            guide:"정 가운데 정면에서 촬영",          svgType:"front"   as const },
  { key:"main4", label:"④ 후면",            guide:"정 가운데 후면에서 촬영",          svgType:"rear"    as const },
  { key:"main5", label:"⑤ 실내 메인",       guide:"운전석에서 대시보드 방향 촬영",    svgType:"interior" as const },
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
  /* 한 행에서 하나만 체크 (라디오 동작) */
  const handleCheck = (item: string, col: keyof DamageRow, checked: boolean) => {
    if (checked) {
      /* 먼저 같은 행의 다른 체크 모두 해제 */
      for (const c of DAMAGE_COLS) {
        if (c !== col && data[item]?.[c as keyof DamageRow]) {
          onChange(item, c as keyof DamageRow, false);
        }
      }
    }
    onChange(item, col, checked);
  };
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
                      onChange={e=>handleCheck(item,col as keyof DamageRow,e.target.checked)}
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
function DealerCarsNewInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;
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
  const [transmission,  setTransmission]  = useState("오토");
  const [cc,            setCc]            = useState("");
  const [owners,        setOwners]        = useState("1");
  const [accident,      setAccident]      = useState(false);
  const [plateNumber,   setPlateNumber]   = useState("");
  const [importType,    setImportType]    = useState("국산 차량");
  const [warranty,      setWarranty]      = useState("없음");

  /* ── Step 2: 판매 정보 ── */
  const [price,       setPrice]       = useState("");
  const [region,      setRegion]      = useState("광주");
  const [description, setDescription] = useState("");
  const [descTemplate,setDescTemplate]= useState<"직접"|"일반"|"딜러">("직접");
  const [options,     setOptions]     = useState<string[]>([]);
  const [tags]                        = useState<string[]>([]);
  const [contactPhone,setContactPhone]= useState("");
  const [contactLand, setContactLand] = useState("");
  const [saleType,    setSaleType]    = useState<"일반차량"|"리스승계차량"|"렌트차량">("일반차량");
  const [tradeType,   setTradeType]   = useState<"직접매도"|"매매알선">("직접매도");
  const [seizure,     setSeizure]     = useState<"없음"|"있음">("없음");
  const [mortgage,    setMortgage]    = useState<"없음"|"있음">("없음");
  const [accidentPublic, setAccidentPublic] = useState<"공개"|"비공개">("비공개");

  /* 리스 관련 */
  const [leaseType,     setLeaseType]     = useState("운용리스");
  const [leaseCompany,  setLeaseCompany]  = useState("");
  const [leaseStart,    setLeaseStart]    = useState("");
  const [leaseEnd,      setLeaseEnd]      = useState("");
  const [leaseMonthly,  setLeaseMonthly]  = useState("");
  const [leaseDeposit,  setLeaseDeposit]  = useState("");
  const [leaseResidual, setLeaseResidual] = useState("");
  const [leaseRemain,   setLeaseRemain]   = useState("");
  const [leaseSettlement,setLeaseSettlement]= useState("");
  const [leaseSettleType,setLeaseSettleType]= useState<"인수금"|"승계지원금">("인수금");
  const [leaseIncludes, setLeaseIncludes] = useState<string[]>([]);
  const [leaseAfter,    setLeaseAfter]    = useState<string[]>([]);
  const [leaseCarPrice, setLeaseCarPrice] = useState("");

  /* 렌트 관련 */
  const [rentCompany,   setRentCompany]   = useState("");
  const [rentStart,     setRentStart]     = useState("");
  const [rentEnd,       setRentEnd]       = useState("");
  const [rentMonthly,   setRentMonthly]   = useState("");
  const [rentDeposit,   setRentDeposit]   = useState("");
  const [rentResidual,  setRentResidual]  = useState("");
  const [rentSettlement,setRentSettlement]= useState("");
  const [rentSettleType,setRentSettleType]= useState<"인수금"|"승계지원금">("인수금");
  const [rentIncludes,  setRentIncludes]  = useState<string[]>([]);
  const [rentAfter,     setRentAfter]     = useState<string[]>([]);
  const [rentCarPrice,  setRentCarPrice]  = useState("");

  /* 고정멘트 */
  const [savedComment,  setSavedComment]  = useState("");
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  /* ── Step 3: 사진 ── */
  const [mainPhotos,     setMainPhotos]     = useState<Record<string,string>>({});
  const [photoPositions, setPhotoPositions] = useState<Record<string,number>>({});
  const [detailPhotos,   setDetailPhotos]   = useState<string[]>([]);
  const [uploadingSlot,  setUploadingSlot]  = useState<string|null>(null);
  const [uploadingDetail,setUploadingDetail]= useState(false);

  /* ── Step 4: 성능점검 ── */
  const [inspectionNo,    setInspectionNo]    = useState("");
  const [recordNo1,       setRecordNo1]       = useState("");
  const [recordNo2,       setRecordNo2]       = useState("");
  const [recordNo3,       setRecordNo3]       = useState("");
  const [skipInspection,  setSkipInspection]  = useState(false);
  const [inspCenter,      setInspCenter]      = useState(""); /* 성능점검장 */

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
  const [damage2, setDamage2] = useState<Record<string,DamageRow>>(() => initDamageMap(PANEL_2RANK));
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

  /* 누락 항목 추가: 매연, 조향, 제동, 고전원, 수동변속기, 보유상태, 검사/보증, 특기사항 */
  const [exhaustSmoke,    setExhaustSmoke]    = useState(""); /* 매연(%) - 디젤 */
  const [steeringHose,    setSteeringHose]    = useState<GoodBad>(""); /* 파워고압호스 */
  const [tieRodBallJoint, setTieRodBallJoint] = useState<GoodBad>(""); /* 타이로드엔드 및 볼조인트 */
  const [brakeMasterLeak, setBrakeMasterLeak] = useState<OilState>(""); /* 마스터실린더 오일누유 */
  /* 고전원 전기장치 (전기차/하이브리드) */
  const [evChargeInsul,   setEvChargeInsul]   = useState<GoodBad>(""); /* 충전구 절연상태 */
  const [evBatteryIso,    setEvBatteryIso]    = useState<GoodBad>(""); /* 구동축전지 격리상태 */
  const [evHighVoltWire,  setEvHighVoltWire]  = useState<GoodBad>(""); /* 고전원전기배선 상태 */
  /* 수동변속기 */
  const [mtGearShift,     setMtGearShift]     = useState<GoodBad>(""); /* 기어변속장치 */
  const [mtOilLevel,      setMtOilLevel]      = useState<GoodBad>(""); /* M/T 오일유량 및 상태 */
  const [mtRunning,       setMtRunning]       = useState<GoodBad>(""); /* M/T 작동상태 */
  /* 보유상태 */
  const [hasManual,       setHasManual]       = useState<"있음"|"없음"|"">("");
  const [hasTriangle,     setHasTriangle]     = useState<"있음"|"없음"|"">("");
  const [hasJack,         setHasJack]         = useState<"있음"|"없음"|"">("");
  const [hasSpanner,      setHasSpanner]      = useState<"있음"|"없음"|"">("");
  /* 검사유효기간, 보증유형 */
  const [inspExpiry,      setInspExpiry]      = useState(""); /* 검사유효기간 */
  const [warrantyType,    setWarrantyType]    = useState<"자가보증"|"보험사보증"|"">("");
  /* 특기사항 */
  const [specialNote,     setSpecialNote]     = useState(""); /* 점검자 의견 */

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
  /* ── 임시저장 (localStorage) ── */
  const DRAFT_KEY = "fixcar_car_draft";
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);

  /* 마운트 시 임시저장 확인 + 딜러 연락처 로드 */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setShowDraftPrompt(true);
      const sc = localStorage.getItem("fixcar_saved_comment");
      if (sc) setSavedComment(sc);
    } catch {}
    setDraftLoaded(true);
    /* 수정 모드: 기존 매물 데이터 로드 */
    if (editId) {
      fetch(`/api/admin/cars/${editId}`).then(r=>r.json()).then(d=>{
        if(d.error)return;
        if(d.brand)setSelectedBrand(d.brand);
        if(d.name){
          const parts=d.name.split(" ");
          if(parts[0])setSelectedModel(parts[0]);
          if(parts.length>1)setGrade(parts.slice(1).join(" "));
        }
        if(d.year)setYear(d.year);
        if(d.mileage!==undefined)setMileage(String(d.mileage));
        if(d.fuel)setFuel(d.fuel);
        if(d.color)setColor(d.color);
        if(d.transmission)setTransmission(d.transmission);
        if(d.cc!==undefined)setCc(String(d.cc));
        if(d.owners!==undefined)setOwners(String(d.owners));
        if(d.accident!==undefined)setAccident(d.accident);
        if(d.plateNumber)setPlateNumber(d.plateNumber);
        if(d.price!==undefined)setPrice(String(d.price));
        if(d.region)setRegion(d.region);
        if(d.description)setDescription(d.description.split("[성능점검데이터]")[0].trim());
        if(d.options)setOptions(d.options);
        if(d.images&&d.images.length>0){
          const mp:Record<string,string>={};
          const slots=MAIN_SLOTS_DATA.map(s=>s.key);
          d.images.forEach((img:string,i:number)=>{
            if(i<slots.length)mp[slots[i]]=img;
            else setDetailPhotos(prev=>[...prev,img]);
          });
          setMainPhotos(mp);
        }
        setShowDraftPrompt(false);
      }).catch(()=>{});
    }
    /* 딜러 프로필에서 연락처 자동 로드 */
    fetch("/api/dealer/profile").then(r=>r.json()).then(d=>{
      const p = d?.data || d;
      if (p?.shopPhone && !contactPhone) setContactPhone(p.shopPhone);
      if (p?.phoneLand && !contactLand) setContactLand(p.phoneLand || "");
    }).catch(()=>{});
  }, []);

  /* 임시저장 불러오기 */
  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      const d = JSON.parse(saved);
      if (d.selectedBrand !== undefined) setSelectedBrand(d.selectedBrand);
      if (d.selectedBase !== undefined) setSelectedBase(d.selectedBase);
      if (d.selectedModel !== undefined) setSelectedModel(d.selectedModel);
      if (d.grade !== undefined) setGrade(d.grade);
      if (d.year !== undefined) setYear(d.year);
      if (d.mileage !== undefined) setMileage(d.mileage);
      if (d.fuel !== undefined) setFuel(d.fuel);
      if (d.color !== undefined) setColor(d.color);
      if (d.transmission !== undefined) setTransmission(d.transmission);
      if (d.cc !== undefined) setCc(d.cc);
      if (d.owners !== undefined) setOwners(d.owners);
      if (d.plateNumber !== undefined) setPlateNumber(d.plateNumber);
      if (d.price !== undefined) setPrice(d.price);
      if (d.region !== undefined) setRegion(d.region);
      if (d.description !== undefined) setDescription(d.description);
      if (d.options !== undefined) setOptions(d.options);
      if (d.saleType !== undefined) setSaleType(d.saleType);
      if (d.accident !== undefined) setAccident(d.accident);
      if (d.importType !== undefined) setImportType(d.importType);
      if (d.interiorColor !== undefined) setInteriorColor(d.interiorColor);
      /* step은 마지막에 (다른 state가 세팅된 후) */
      setTimeout(() => { if (d.step !== undefined) setStep(d.step); }, 100);
    } catch {}
    setShowDraftPrompt(false);
  };

  const discardDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setShowDraftPrompt(false);
  };

  /* 자동 임시저장 (5초마다) */
  useEffect(() => {
    if (!draftLoaded || submitted) return;
    const timer = setInterval(() => {
      try {
        const draft = {
          selectedBrand, selectedBase, selectedModel, grade, year, mileage, fuel,
          color, transmission, cc, owners, plateNumber, price, region,
          description, options, saleType, step, accident, importType, interiorColor,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {}
    }, 5000);
    return () => clearInterval(timer);
  }, [draftLoaded, submitted, selectedBrand, selectedBase, selectedModel, grade, year, mileage, fuel, color, transmission, cc, owners, plateNumber, price, region, description, options, saleType, step, accident]);

  /* 등록 완료 시 임시저장 삭제 */
  useEffect(() => {
    if (submitted) {
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
    }
  }, [submitted]);

  /* 페이지 이탈 경고 */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (submitted) return;
      if (selectedBrand || plateNumber || price) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [submitted, selectedBrand, plateNumber, price]);

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

  /* ── 이미지 리사이징 (4.5MB 제한 대응) ── */
  const resizeImage = (file: File, maxWidth = 1920, maxHeight = 1440, quality = 0.85): Promise<File> => {
    return new Promise((resolve) => {
      if (file.size <= 4 * 1024 * 1024) { resolve(file); return; } /* 4MB 이하면 그대로 */
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
        if (h > maxHeight) { w = Math.round(w * maxHeight / h); h = maxHeight; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
        }, "image/jpeg", quality);
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  /* ── 사진 업로드 ── */
  const handleMainUpload=async(slotKey:string)=>{
    const inp=document.createElement("input");inp.type="file";inp.accept="image/*";
    inp.onchange=async(e)=>{
      let file=(e.target as HTMLInputElement).files?.[0]; if(!file)return;
      setUploadingSlot(slotKey);
      try{
        file = await resizeImage(file);
        const fd=new FormData();fd.append("file",file);
        const res=await fetch("/api/upload",{method:"POST",body:fd});
        if(!res.ok){alert("업로드 서버 오류 ("+res.status+")\n사진 용량이 너무 큽니다. 다른 사진을 시도해주세요.");setUploadingSlot(null);return;}
        const d=await res.json();
        if(d.success&&d.url){
          setMainPhotos(prev=>({...prev,[slotKey]:d.url}));
        } else {
          alert("업로드 실패: "+(d.error||"Cloudinary 환경변수를 확인해주세요."));
        }
      }catch(err){
        alert("업로드 중 네트워크 오류가 발생했습니다.");
      }
      setUploadingSlot(null);
    };inp.click();
  };

  /* 메인사진 5장 한번에 업로드 (파일명 숫자로 슬롯 매칭) */
  const [bulkUploading, setBulkUploading] = useState(false);
  const handleBulkMainUpload = async () => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*"; inp.multiple = true;
    inp.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
      setBulkUploading(true);
      const slots = MAIN_SLOTS_DATA.map(s => s.key);
      /* 파일명에서 숫자 추출하여 슬롯 매칭: "1.jpg"→main1, "2_front.jpg"→main2 */
      const fileArr = Array.from(files);
      for (const file of fileArr) {
        const numMatch = file.name.match(/^(\d)/);
        const slotIdx = numMatch ? Number(numMatch[1]) - 1 : -1;
        if (slotIdx < 0 || slotIdx >= slots.length) continue;
        setUploadingSlot(slots[slotIdx]);
        try {
          const resized = await resizeImage(file);
          const fd = new FormData(); fd.append("file", resized);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          if (!res.ok) continue;
          const d = await res.json();
          if (d.success && d.url) setMainPhotos(prev => ({ ...prev, [slots[slotIdx]]: d.url }));
        } catch {}
      }
      setUploadingSlot(null);
      setBulkUploading(false);
    };
    inp.click();
  };
  const handleDetailUpload=async()=>{
    if(detailPhotos.length>=20){alert("최대 20장");return;}
    const inp=document.createElement("input");inp.type="file";inp.accept="image/*";inp.multiple=true;
    inp.onchange=async(e)=>{
      const files=(e.target as HTMLInputElement).files; if(!files)return;
      setUploadingDetail(true);
      let uploadCount=0;
      for(let file of Array.from(files).slice(0,20-detailPhotos.length)){
        file = await resizeImage(file);
        const fd=new FormData();fd.append("file",file);
        try{const res=await fetch("/api/upload",{method:"POST",body:fd});if(!res.ok)continue;const d=await res.json();if(d.success&&d.url){setDetailPhotos(prev=>[...prev,d.url]);uploadCount++;}}catch{}
      }
      if(uploadCount===0&&files.length>0)alert("사진 업로드에 실패했습니다.");
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
    if(s===3){const mc=Object.keys(mainPhotos).length;if(mc<5){errs.push(`메인 사진 ${mc}/5장 — 실외 4장 + 실내 1장 모두 필수`);fields.add("photos");}}
    setErrorFields(fields); return errs;
  };

  const nextStep=()=>{const errs=validate(step);if(errs.length>0){setErrors(errs);return;}setErrors([]);setErrorFields(new Set());setStep(step+1);window.scrollTo({top:0,behavior:"smooth"});};

  /* ── 최종 제출 ── */
  const handleSubmit=async()=>{
    const errs=validate(3);
    if(errs.length>0){setErrors(errs);return;}
    setSaving(true);
    try{
      const finalGrade=grade==="직접입력"?customGrade:grade;
      const carName=`${selectedModel}${finalGrade?` ${finalGrade}`:""}`;
      const orderedImages=[...MAIN_SLOTS_DATA.map(s=>{
        const url=mainPhotos[s.key]; if(!url)return "";
        const pos=photoPositions[s.key]; return pos?`${url}#${pos}`:url;
      }).filter(Boolean),...detailPhotos];

      const inspectionData = skipInspection ? null : {
        inspectionNo, recordNo:`${recordNo1}-${recordNo2}-${recordNo3}`, inspCenter,
        inspExpiry, warrantyType,
        overall:{ odomState,odomKm,odomDriveState,vinState,exhaustCO,exhaustHC,exhaustSmoke,tuning,tuningTypes,specialHistory,specialTypes,purposeChange,purposeTypes,colorState,colorChange,recall },
        damage:{ panel1:damage1, panel2:damage2, panelA:damageA, panelB:damageB, panelC:damageC },
        detail:{ selfDiagEngine,selfDiagTrans,engineRunning,oilLeakCover,oilLeakHead,oilLeakBlock,oilLevel,coolLeakHead,coolLeakPump,coolLeakRad,coolLevel,atOilLeak,atOilLevel,atRunning,mtGearShift,mtOilLevel,mtRunning,clutch,cvJoint,driveShaft,differential,steeringPump,steeringGear,steeringJoint,steeringHose,tieRodBallJoint,brakeOilLeak,brakeMasterLeak,brakeLevel,brakeBooster,generator,starter,wiperMotor,blowerMotor,radFanMotor,windowMotor,fuelLeak,evChargeInsul,evBatteryIso,evHighVoltWire },
        extra:{ exteriorState,interiorState,polishState,wheelState,tireState,glassState },
        accessories:{ hasManual,hasTriangle,hasJack,hasSpanner },
        photos:{ front:inspFrontPhoto, rear:inspRearPhoto },
        signature:{ inspDate,inspectorName,informerName },
        specialNote,
      };

      const finalDesc = [description, inspectionData ? `\n\n[성능점검데이터]\n${JSON.stringify(inspectionData)}` : ""].join("");

      const res=await fetch(isEditMode?`/api/admin/cars/${editId}`:"/api/dealer/cars",{
        method:isEditMode?"PATCH":"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name:carName,brand:selectedBrand,year,mileage:Number(mileage),fuel,
          color:color==="기타"?customColor:color,region,price:Number(price),cc:Number(cc)||0,
          transmission,owners:Number(owners),accident,tags,options,images:orderedImages,
          description:finalDesc,
          inspected:!skipInspection&&!!inspectorName,
        }),
      });
      const data=await res.json();
      if(data.success)setSubmitted(true);
      else alert((isEditMode?"수정":"등록")+" 실패: "+(data.error||"다시 시도해주세요"));
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
    { key:"cc",        label:"배기량",            required:fuel!=="전기",  value: fuel==="전기" ? "전기차 ⚡" : cc ? `${Number(cc).toLocaleString()}cc` : "" },
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
            return optBtn(`${icon} ${f}`, fuel===f, ()=>{setFuel(f);setGrade("");setActiveField("grade");if(f==="전기")setCc("0");}, cnt>0?`${cnt}개 등급`:"");
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
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14}}>
            {COLORS_DATA.map(c=>(
              <button key={c.name} onClick={()=>setColor(c.name)} style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                padding:"8px 4px",borderRadius:10,cursor:"pointer",
                border:color===c.name?"2px solid #FF3B1E":"2px solid transparent",
                background:color===c.name?"#FFF5F3":"transparent",
              }}>
                <div style={{width:36,height:36,borderRadius:"50%",background:c.hex,border:c.hex==="#FFFFFF"?"1px solid #DDD":"1px solid rgba(0,0,0,0.1)",boxShadow:color===c.name?"0 0 0 2px #FF3B1E":"none"}}/>
                <span style={{fontSize:10,fontWeight:color===c.name?800:600,color:color===c.name?"#FF3B1E":"#555",fontFamily:"'NanumSquareRound',sans-serif",textAlign:"center",lineHeight:1.2,wordBreak:"keep-all"}}>{c.name}</span>
              </button>
            ))}
          </div>
          <div style={{marginTop:20,borderTop:"1px solid #EEE",paddingTop:16}}>
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
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14}}>
            {INTERIOR_COLORS_DATA.map(c=>(
              <button key={c.name} onClick={()=>setInteriorColor(c.name)} style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                padding:"8px 4px",borderRadius:10,cursor:"pointer",
                border:interiorColor===c.name?"2px solid #FF3B1E":"2px solid transparent",
                background:interiorColor===c.name?"#FFF5F3":"transparent",
              }}>
                <div style={{width:36,height:36,borderRadius:"50%",background:c.name==="기타"?"linear-gradient(135deg,#EEE,#CCC)":c.hex,border:c.hex==="#FFFFF0"||c.hex==="#F5F5F5"?"1px solid #DDD":"1px solid rgba(0,0,0,0.1)",boxShadow:interiorColor===c.name?"0 0 0 2px #FF3B1E":"none"}}/>
                <span style={{fontSize:10,fontWeight:interiorColor===c.name?800:600,color:interiorColor===c.name?"#FF3B1E":"#555",fontFamily:"'NanumSquareRound',sans-serif"}}>{c.name}</span>
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
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            <button onClick={()=>setOwners("1")} style={{flex:1,padding:"16px",borderRadius:12,border:owners==="1"?"2px solid #FF3B1E":"1.5px solid #E8E5E0",background:owners==="1"?"#FFF5F3":"white",fontSize:15,fontWeight:owners==="1"?800:500,color:owners==="1"?"#FF3B1E":"#555",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>1인 소유</button>
            <button onClick={()=>{if(owners==="1")setOwners("2");}} style={{flex:1,padding:"16px",borderRadius:12,border:owners!=="1"?"2px solid #FF3B1E":"1.5px solid #E8E5E0",background:owners!=="1"?"#FFF5F3":"white",fontSize:15,fontWeight:owners!=="1"?800:500,color:owners!=="1"?"#FF3B1E":"#555",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>2인 이상</button>
          </div>
          {owners!=="1"&&(
            <select value={owners} onChange={e=>setOwners(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7"}}>
              {Array.from({length:49},(_,i)=>String(i+2)).map(o=><option key={o} value={o}>{o}인 소유</option>)}
            </select>
          )}
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
      <h2 style={{fontSize:28,fontWeight:700,marginBottom:10}}>{isEditMode?"매물 수정 완료!":"매물 등록 완료!"}</h2>
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
      .opt-wrap{position:relative;display:inline-block;}
      .opt-wrap .opt-tip{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%) translateY(4px);background:#333;color:white;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:600;white-space:nowrap;pointer-events:none;opacity:0;transition:all 0.15s;z-index:100;font-family:'NanumSquareRound',sans-serif;}
      .opt-wrap .opt-tip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#333;}
      .opt-wrap:hover .opt-tip{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto;}
      .opt-wrap button:hover{background:#F0F6FF!important;border-color:#0066FF!important;}
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

          {/* ═══ 임시저장 복구 프롬프트 ═══ */}
          {showDraftPrompt && (
            <div style={{background:"#EEF5FF",border:"2px solid #0066FF",borderRadius:16,padding:"20px 24px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:"#0066FF",marginBottom:4}}>📋 임시저장된 차량 정보가 있습니다</div>
                <div style={{fontSize:12,color:"#888"}}>이전에 작성하던 내용을 불러올까요?</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={loadDraft} style={{padding:"10px 20px",background:"#0066FF",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>불러오기</button>
                <button onClick={discardDraft} style={{padding:"10px 20px",background:"white",color:"#888",border:"1px solid #DDD",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>새로 작성</button>
              </div>
            </div>
          )}

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
            <div>
              {/* ── 연락처 (딜러 프로필에서 자동 적용) ── */}
              <div style={{background:"#EEF5FF",borderRadius:14,padding:"14px 18px",marginBottom:16,border:"1px solid #DDEEFF"}}>
                <div style={{fontSize:13,color:"#0066FF",fontWeight:700}}>📞 연락처는 딜러 프로필에 등록된 정보가 자동 적용됩니다. <a href="/dealer/profile" style={{textDecoration:"underline"}}>프로필 수정 →</a></div>
              </div>

              {/* ── 판매가 & 판매구분 ── */}
              <div style={{background:"white",borderRadius:20,padding:"28px 26px",marginBottom:16}}>
                <h2 style={{fontSize:18,fontWeight:800,marginBottom:20}}>💰 차량 판매가</h2>
                <div style={{marginBottom:16}}>
                  <label style={labelS}>판매구분</label>
                  <div style={{display:"flex",gap:8}}>
                    {(["일반차량","리스승계차량","렌트차량"] as const).map(t=>(
                      <label key={t} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer",padding:"10px 16px",borderRadius:10,border:saleType===t?"2px solid #FF3B1E":"1px solid #E0DDD7",background:saleType===t?"#FFF5F3":"white"}}>
                        <input type="radio" checked={saleType===t} onChange={()=>setSaleType(t)} style={{accentColor:"#FF3B1E",width:14,height:14}}/>
                        <span style={{fontWeight:saleType===t?700:500,color:saleType===t?"#FF3B1E":"#555"}}>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:12}}>
                  <div>
                    <label style={labelS}>판매가(만원) <span style={{color:"#FF3B1E"}}>*</span></label>
                    <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="예: 2500" style={{...inputS,border:errBorder("price")}}/>
                  </div>
                  <div>
                    <label style={labelS}>지역</label>
                    <select value={region} onChange={e=>setRegion(e.target.value)} style={inputS}>{REGIONS.map(r=><option key={r}>{r}</option>)}</select>
                  </div>
                </div>
                <div style={{fontSize:11,color:"#FF3B1E",lineHeight:1.6}}>
                  * 중고차 시세를 참고하여 적절한 판매 가격을 제시해 보세요.<br/>
                  * 할부/리스 차량은 선납금, 잔여 개월 수 등을 고려하여 실판매가로 입력해 주세요.
                </div>

                {/* ── 리스승계 상세 ── */}
                {saleType==="리스승계차량"&&(
                  <div style={{marginTop:20,border:"1px solid #E0DDD7",borderRadius:14,padding:"20px",background:"#FAFAF8"}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:16}}>📋 리스 승계 정보</div>
                    <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:12,alignItems:"center",fontSize:13}}>
                      <span style={{fontWeight:700}}>리스 종류</span>
                      <select value={leaseType} onChange={e=>setLeaseType(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7"}}>
                        <option>운용리스</option><option>금융리스</option>
                      </select>
                      <span style={{fontWeight:700}}>리스사</span>
                      <select value={leaseCompany} onChange={e=>setLeaseCompany(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7"}}>
                        <option value="">선택</option>
                        {["현대캐피탈","KB캐피탈","신한캐피탈","하나캐피탈","우리캐피탈","롯데캐피탈","BNK캐피탈","JB우리캐피탈","기타"].map(c=><option key={c}>{c}</option>)}
                      </select>
                      <span style={{fontWeight:700}}>리스기간</span>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <input type="month" value={leaseStart} onChange={e=>setLeaseStart(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/>
                        <span>~</span>
                        <input type="month" value={leaseEnd} onChange={e=>setLeaseEnd(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/>
                      </div>
                      <span style={{fontWeight:700}}>월리스료</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={leaseMonthly} onChange={e=>setLeaseMonthly(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                      <span style={{fontWeight:700}}>보증금</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={leaseDeposit} onChange={e=>setLeaseDeposit(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                      <span style={{fontWeight:700}}>잔존 가치</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={leaseResidual} onChange={e=>setLeaseResidual(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                      <span style={{fontWeight:700}}>미회수 원금</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={leaseRemain} onChange={e=>setLeaseRemain(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                      <span style={{fontWeight:700}}>인수 시 정산금</span>
                      <div>
                        <div style={{display:"flex",gap:8,marginBottom:8}}>
                          {(["인수금","승계지원금"] as const).map(t=>(
                            <label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                              <input type="radio" checked={leaseSettleType===t} onChange={()=>setLeaseSettleType(t)} style={{accentColor:"#FF3B1E"}}/>{t}
                            </label>
                          ))}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={leaseSettlement} onChange={e=>setLeaseSettlement(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                      </div>
                      <span style={{fontWeight:700}}>월리스료 포함</span>
                      <div style={{display:"flex",gap:10}}>
                        {["자동차 세금","보험료","정비 서비스"].map(t=>(
                          <label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                            <input type="checkbox" checked={leaseIncludes.includes(t)} onChange={e=>setLeaseIncludes(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#0066FF"}}/>{t}
                          </label>
                        ))}
                      </div>
                      <span style={{fontWeight:700}}>만기 후 처리</span>
                      <div style={{display:"flex",gap:10}}>
                        {["구매","반납"].map(t=>(
                          <label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                            <input type="checkbox" checked={leaseAfter.includes(t)} onChange={e=>setLeaseAfter(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#0066FF"}}/>{t}
                          </label>
                        ))}
                      </div>
                      <span style={{fontWeight:700}}>차량가격</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={leaseCarPrice} onChange={e=>setLeaseCarPrice(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                    </div>
                  </div>
                )}

                {/* ── 렌트 상세 ── */}
                {saleType==="렌트차량"&&(
                  <div style={{marginTop:20,border:"1px solid #E0DDD7",borderRadius:14,padding:"20px",background:"#FAFAF8"}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:16}}>📋 렌트 정보</div>
                    <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:12,alignItems:"center",fontSize:13}}>
                      <span style={{fontWeight:700}}>렌트사</span>
                      <select value={rentCompany} onChange={e=>setRentCompany(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7"}}>
                        <option value="">선택</option>
                        {["롯데렌탈","SK렌터카","현대캐피탈","쏘카","AJ렌터카","제주렌터카","기타"].map(c=><option key={c}>{c}</option>)}
                      </select>
                      <span style={{fontWeight:700}}>렌트 기간</span>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <input type="month" value={rentStart} onChange={e=>setRentStart(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/>
                        <span>~</span>
                        <input type="month" value={rentEnd} onChange={e=>setRentEnd(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/>
                      </div>
                      <span style={{fontWeight:700}}>월렌트료</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={rentMonthly} onChange={e=>setRentMonthly(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                      <span style={{fontWeight:700}}>보증금</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={rentDeposit} onChange={e=>setRentDeposit(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                      <span style={{fontWeight:700}}>잔존 가치</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={rentResidual} onChange={e=>setRentResidual(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                      <span style={{fontWeight:700}}>인수 시 정산금</span>
                      <div>
                        <div style={{display:"flex",gap:8,marginBottom:8}}>
                          {(["인수금","승계지원금"] as const).map(t=>(
                            <label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                              <input type="radio" checked={rentSettleType===t} onChange={()=>setRentSettleType(t)} style={{accentColor:"#FF3B1E"}}/>{t}
                            </label>
                          ))}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={rentSettlement} onChange={e=>setRentSettlement(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                      </div>
                      <span style={{fontWeight:700}}>월렌트료 포함</span>
                      <div style={{display:"flex",gap:10}}>
                        {["자동차 세금","보험료","정비 서비스"].map(t=>(
                          <label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                            <input type="checkbox" checked={rentIncludes.includes(t)} onChange={e=>setRentIncludes(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#0066FF"}}/>{t}
                          </label>
                        ))}
                      </div>
                      <span style={{fontWeight:700}}>만기 후 처리</span>
                      <div style={{display:"flex",gap:10}}>
                        {["구매","반납"].map(t=>(
                          <label key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer"}}>
                            <input type="checkbox" checked={rentAfter.includes(t)} onChange={e=>setRentAfter(prev=>e.target.checked?[...prev,t]:prev.filter(x=>x!==t))} style={{accentColor:"#0066FF"}}/>{t}
                          </label>
                        ))}
                      </div>
                      <span style={{fontWeight:700}}>차량가격</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" value={rentCarPrice} onChange={e=>setRentCarPrice(e.target.value)} placeholder="0" style={{...inputS,border:"1.5px solid #E0DDD7",flex:1}}/><span>만원</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── 설명글 ── */}
              <div style={{background:"white",borderRadius:20,padding:"28px 26px",marginBottom:16}}>
                <h2 style={{fontSize:18,fontWeight:800,marginBottom:4}}>📝 설명글</h2>
                <div style={{fontSize:12,color:"#AAA",marginBottom:14}}>* 판매차량의 상태, 판매 사유 등에 대해 자세히 입력해 주시면 더 많은 구매자가 관심을 가질 수 있습니다.</div>
                <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
                  {([["직접","직접입력"],["일반","일반형 샘플"],["딜러","딜러형 샘플"]] as const).map(([k,l])=>(
                    <label key={k} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer",padding:"8px 14px",borderRadius:10,border:descTemplate===k?"2px solid #FF3B1E":"1px solid #E0DDD7",background:descTemplate===k?"#FFF5F3":"white"}}>
                      <input type="radio" checked={descTemplate===k} onChange={()=>{
                        setDescTemplate(k);
                        if(k==="일반") setDescription(`설명글은 인사말 / 차량상태 / 차주정보 등을 입력하시면 됩니다.
----------------------인사말---------------------------------
인사말을 입력해 보세요.
안녕하세요. 광주에 사는 홍길동입니다.
제가 판매할 차량은 주행거리가 00,000km인 0000년 0월식 차종 등급 입니다.
----------------------차량설명---------------------------------
사고여부, 차량옵션, 관리상태 등을 입력해 보세요.
▶차량설명
-사고여부 : 무사고 차량입니다.
-차    종 :
-연    식 :
-색    상 : 인기있는 검정색입니다.
-주행거리 : 00,000km
-내 / 외관 : 실내와 실외가 깨끗합니다. 생활 스크레치는 있지만 연식대비 양이 적습니다.
-관리상태 : 모든 정비를 마친 상태입니다.
▶옵션사항
-외관사양 :
-내장사양 :
-안전사양 :
-편의사양 :
-튜닝정보 :
----------------------차주정보---------------------------------
차량을 운행했던 차주정보 등을 입력해 보세요.
▶차주정보
-운행자정보 : 1인 소유, 비흡자
-운행용도 : 출퇴근용으로 사용하여 주행거리가 짧습니다.
-구입방법 : 신차로 구매하여 운행하던 차량입니다.
-판매이유 : 이번에 신차를 구매하면서 판매하게 되었습니다.
----------------------기타---------------------------------
문의/판매 방법 등을 입력해 보세요.
▶문의방법
-연락주시면 친절하고 상세하게 설명을 드리도록 하겠습니다.
-전화가 부재중일시 문자를 남겨주시면 확인후 전화드리겠습니다.
-가격은 절충이 가능합니다.`);
                        if(k==="딜러") setDescription(`설명글은 인사말 / 차량상태 / 차주정보 등을 입력하시면 됩니다.
----------------------인사말---------------------------------
인사말을 입력해 보세요.
안녕하세요. 중고차 전문딜러 픽스카 홍길동 실장입니다.
차량에 관심을 가져주셔서 대단히 감사합니다.
현재 고객님께서 보시고있는 차량은 100% 실매물임을 이름을 걸고 약속드립니다.
----------------------차량설명---------------------------------
사고여부, 차량옵션, 관리상태 등을 입력해 보세요.
▶차량설명
-사고여부 : 무사고 차량입니다.
-차    종 :
-연    식 :
-색    상 : 인기있는 검정색입니다.
-주행거리 : 00,000km
-내 / 외관 : 실내와 실외가 깨끗합니다. 생활 스크레치는 있지만 연식대비 양이 적습니다.
-관리상태 : 모든 정비를 마친 상태입니다.
▶옵션사항
-외관사양 :
-내장사양 :
-안전사양 :
-편의사양 :
-튜닝정보 :
▶차량의 특징
-역동적인 바디라인을 강조한 디자인입니다.
----------------------차주정보---------------------------------
차량을 운행했던 차주정보 등을 입력해 보세요.
▶차주정보
-운행자정보 : 1인 소유, 비흡자
-운행용도 : 출퇴근용으로 사용하여 주행거리가 짧습니다.
-구입방법 : 신차로 구매하여 운행하던 차량입니다.
-판매이유 : 이번에 신차를 구매하면서 판매하게 되었습니다.
----------------------기타---------------------------------
문의/판매 방법 등을 입력해 보세요.
▶문의방법
-연락주시면 친절하고 상세하게 설명을 드리도록 하겠습니다.
-전화가 부재중일시 문자를 남겨주시면 확인후 전화드리겠습니다.
-차량 시승도 가능하며 정비업소에서 차량상태 확인도 가능합니다.
-현재 타고 계신 차량과 교환도 가능하며, 대출을 통한 차량구매도 가능합니다.
-가격은 절충이 가능합니다.
----------------------판매자 소개---------------------------------
-오시는 길 :`);
                        if(k==="직접") setDescription("");
                      }} style={{accentColor:"#FF3B1E",width:14,height:14}}/>
                      <span style={{fontWeight:descTemplate===k?700:500,color:descTemplate===k?"#FF3B1E":"#555"}}>{l}</span>
                    </label>
                  ))}
                  {/* 고정멘트 버튼 */}
                  <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
                    {savedComment && (
                      <button onClick={()=>setDescription(savedComment)} style={{padding:"8px 14px",borderRadius:10,border:"1px solid #0066FF",background:"#EEF5FF",color:"#0066FF",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>📋 고정멘트 불러오기</button>
                    )}
                    <button onClick={()=>setShowSaveConfirm(true)} style={{padding:"8px 14px",borderRadius:10,border:"1px solid #E0DDD7",background:"white",color:"#666",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>💾 고정멘트 저장</button>
                  </div>
                </div>
                {/* 고정멘트 저장 확인 */}
                {showSaveConfirm && (
                  <div style={{background:"#FFF8E8",border:"1px solid #FFD6A8",borderRadius:12,padding:"14px 18px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#8B6914"}}>현재 내용으로 고정멘트를 저장합니다. 기존 저장본은 삭제됩니다. 진행하시겠습니까?</div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>{try{localStorage.setItem("fixcar_saved_comment",description);setSavedComment(description);}catch{}setShowSaveConfirm(false);alert("고정멘트가 저장되었습니다.");}} style={{padding:"8px 16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>예</button>
                      <button onClick={()=>setShowSaveConfirm(false)} style={{padding:"8px 16px",background:"white",color:"#888",border:"1px solid #DDD",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>아니오</button>
                    </div>
                  </div>
                )}
                <textarea rows={14} value={description} onChange={e=>setDescription(e.target.value)} placeholder={"설명글은 인사말 / 차량상태 / 차주정보 등을 입력하시면 됩니다.\n\n자유롭게 작성해 주세요."} maxLength={5000} style={{...inputS,border:"1.5px solid #E0DDD7",resize:"vertical",minHeight:300,lineHeight:1.8}}/>
                <div style={{fontSize:11,color:"#AAA",textAlign:"right",marginTop:4}}>{description.length}/5,000자</div>
              </div>

              {/* ── 매매유형 & 압류/저당 ── */}
              <div style={{background:"white",borderRadius:20,padding:"28px 26px",marginBottom:16}}>
                <h2 style={{fontSize:18,fontWeight:800,marginBottom:20}}>📋 매매유형 선택</h2>
                <div style={{marginBottom:20}}>
                  <label style={labelS}>매매유형</label>
                  <div style={{display:"flex",gap:8}}>
                    {(["직접매도","매매알선"] as const).map(t=>(
                      <label key={t} style={{display:"flex",alignItems:"center",gap:6,fontSize:14,cursor:"pointer",padding:"12px 20px",borderRadius:10,border:tradeType===t?"2px solid #FF3B1E":"1px solid #E0DDD7",background:tradeType===t?"#FFF5F3":"white"}}>
                        <input type="radio" checked={tradeType===t} onChange={()=>setTradeType(t)} style={{accentColor:"#FF3B1E",width:15,height:15}}/>
                        <span style={{fontWeight:tradeType===t?800:500,color:tradeType===t?"#FF3B1E":"#555"}}>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom:20}}>
                  <label style={{...labelS,marginBottom:10}}>압류 / 저당 입력</label>
                  <div style={{fontSize:11,color:"#FF3B1E",marginBottom:12,lineHeight:1.6}}>* 판매차량의 자동차등록원부에 기재되어 있는 압류/저당 정보를 입력해 주세요.<br/>* 압류/저당 정보를 허위로 입력할 경우 관련법에 따라 처벌받을 수 있으며, 해당 정보를 제재하지 아니한 경우 과태료처분을 받을 수 있습니다.</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div style={{border:"1px solid #E8E5E0",borderRadius:12,padding:"14px 18px"}}>
                      <div style={{fontSize:13,fontWeight:800,marginBottom:10}}>압류</div>
                      <div style={{display:"flex",gap:12}}>
                        {(["없음","있음"] as const).map(v=>(
                          <label key={v} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer"}}>
                            <input type="radio" checked={seizure===v} onChange={()=>setSeizure(v)} style={{accentColor:"#FF3B1E",width:14,height:14}}/>
                            <span style={{fontWeight:seizure===v?700:400}}>{v}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div style={{border:"1px solid #E8E5E0",borderRadius:12,padding:"14px 18px"}}>
                      <div style={{fontSize:13,fontWeight:800,marginBottom:10}}>저당</div>
                      <div style={{display:"flex",gap:12}}>
                        {(["없음","있음"] as const).map(v=>(
                          <label key={v} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer"}}>
                            <input type="radio" checked={mortgage===v} onChange={()=>setMortgage(v)} style={{accentColor:"#FF3B1E",width:14,height:14}}/>
                            <span style={{fontWeight:mortgage===v?700:400}}>{v}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 사고이력 공개 ── */}
              <div style={{background:"white",borderRadius:20,padding:"28px 26px",marginBottom:16}}>
                <h2 style={{fontSize:18,fontWeight:800,marginBottom:4}}>🔍 사고이력 공개</h2>
                <div style={{fontSize:12,color:"#FF3B1E",marginBottom:16}}>사고이력은 구매자가 가장 궁금한 사항입니다. 정보 공개로 매물의 신뢰도를 올려보세요!</div>
                <div style={{background:"#F8F6F3",borderRadius:14,padding:"16px 20px",marginBottom:16}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,fontSize:13}}>
                    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #E8E5E0"}}><span style={{color:"#888"}}>자동차 일반 사양</span><span style={{fontWeight:700}}>{selectedBrand} {selectedModel || "-"}, {year}년식</span></div>
                    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #E8E5E0"}}><span style={{color:"#888"}}>자동차 용도변경 이력</span><span style={{fontWeight:700}}>-</span></div>
                    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #E8E5E0"}}><span style={{color:"#888"}}>자동차 특수사고 이력</span><span style={{fontWeight:700}}>전손 0 / 도난 0 / 침수 0</span></div>
                    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{color:"#888"}}>보험사고 이력</span><span style={{fontWeight:700}}>-</span></div>
                  </div>
                </div>
                <div style={{fontSize:11,color:"#888",lineHeight:1.8,marginBottom:14}}>
                  사고이력공개 서비스는 보험개발원에서 보유하고 있는 1996년 이후의 자동차보험 사고자료 등을 기초로 제공되는 온라인 서비스입니다.<br/>
                  보험사에 보험사고발생 사실이 신고되지 않았거나 보험사고처리가 되지 않은 사항은 제공되지 않습니다.
                </div>
                <div style={{display:"flex",gap:12}}>
                  {(["공개","비공개"] as const).map(v=>(
                    <label key={v} style={{display:"flex",alignItems:"center",gap:6,fontSize:14,cursor:"pointer",padding:"12px 20px",borderRadius:10,border:accidentPublic===v?"2px solid #FF3B1E":"1px solid #E0DDD7",background:accidentPublic===v?"#FFF5F3":"white",flex:1,justifyContent:"center"}}>
                      <input type="radio" checked={accidentPublic===v} onChange={()=>setAccidentPublic(v)} style={{accentColor:"#FF3B1E",width:15,height:15}}/>
                      <span style={{fontWeight:accidentPublic===v?800:500,color:accidentPublic===v?"#FF3B1E":"#555"}}>{v==="공개"?"사고이력을 공개하겠습니다.":"사고이력을 공개하지 않습니다."}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── 옵션 선택 ── */}
              <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
                <h2 style={{fontSize:18,fontWeight:800,marginBottom:6}}>⚙️ 옵션 선택</h2>
                <div style={{fontSize:12,color:"#AAA",marginBottom:16}}>차량에 해당하는 옵션을 선택해주세요. 옵션 위에 마우스를 올리면 설명이 나옵니다.</div>
                {OPTION_CATS.map(cat=>(
                  <div key={cat.name} style={{marginBottom:14}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#0066FF",marginBottom:8,padding:"6px 0",borderBottom:"1px solid #EEF5FF"}}>{cat.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {cat.items.map(item=>(
                        <div key={item.label} className="opt-wrap">
                          <div className="opt-tip">{item.tip}</div>
                          <button onClick={()=>toggleOption(item.label)} style={{padding:"8px 14px",borderRadius:8,fontSize:12,fontWeight:options.includes(item.label)?800:500,border:options.includes(item.label)?"2px solid #0066FF":"1px solid #E0DDD7",background:options.includes(item.label)?"#EEF5FF":"white",color:options.includes(item.label)?"#0066FF":"#666",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",transition:"all 0.15s"}}>
                            {options.includes(item.label)&&<Check size={10} style={{marginRight:4}}/>}{item.label}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{fontSize:11,color:"#AAA",marginTop:8}}>선택된 옵션: {options.length}개</div>
              </div>
            </div>
          )}

          {/* ══ STEP 3: 사진 ══ */}
          {step===3&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:6}}>📷 사진 업로드</h2>
              <p style={{fontSize:13,color:"#AAA",marginBottom:20}}>메인 사진 5장 필수 (실외 4장 + 실내 1장)! 디테일 사진 최대 20장.</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:14,fontWeight:800,color:"#FF3B1E"}}>📌 메인 사진 (5장 필수)</div>
                <button onClick={handleBulkMainUpload} disabled={bulkUploading} style={{padding:"8px 16px",background:"#0066FF",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:bulkUploading?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                  {bulkUploading?"업로드 중...":"📁 5장 한번에 올리기"}
                </button>
              </div>
              <div style={{fontSize:11,color:"#888",marginBottom:4}}>파일명 앞 숫자로 배치: <strong>1</strong>.jpg→①번, <strong>2</strong>.jpg→②번 ... <strong>5</strong>.jpg→⑤번. 해당 번호 없으면 공란.</div>
              <div style={{fontSize:11,color:"#0066FF",marginBottom:12,background:"#EEF5FF",padding:"8px 12px",borderRadius:8}}>💡 ①번(실외 메인)과 ⑤번(실내 메인) 사진이 전체 매물 목록에서 대표 사진 2장으로 노출됩니다.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
                {MAIN_SLOTS_DATA.map(slot=>{
                  const url=mainPhotos[slot.key]; const isUp=uploadingSlot===slot.key;
                  return(
                    <div key={slot.key} style={{border:url?"2px solid #0066FF":errorFields.has("photos")?"2px dashed #E24B4A":"2px dashed #FFB8A8",borderRadius:14,overflow:"hidden",background:url?"white":"#FFF8F6"}}>
                      {url?(
                        <div style={{position:"relative"}}>
                          <div style={{position:"relative",cursor:"crosshair"}} onClick={(e)=>{
                            const rect=(e.currentTarget as HTMLElement).getBoundingClientRect();
                            const yPct=Math.round(((e.clientY-rect.top)/rect.height)*100);
                            setPhotoPositions(prev=>({...prev,[slot.key]:Math.max(10,Math.min(90,yPct))}));
                          }}>
                            <img src={url} alt={slot.label} style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",objectPosition:`center ${photoPositions[slot.key]||50}%`,display:"block"}}/>
                            {/* 매물에서 잘릴 영역 어둡게 표시 */}
                            {photoPositions[slot.key]!==undefined&&<>
                              <div style={{position:"absolute",top:0,left:0,right:0,height:`${Math.max(0,(photoPositions[slot.key]||50)-25)}%`,background:"rgba(0,0,0,0.45)",pointerEvents:"none",transition:"height 0.15s"}}/>
                              <div style={{position:"absolute",bottom:0,left:0,right:0,height:`${Math.max(0,100-(photoPositions[slot.key]||50)-25)}%`,background:"rgba(0,0,0,0.45)",pointerEvents:"none",transition:"height 0.15s"}}/>
                              <div style={{position:"absolute",left:0,right:0,top:`${(photoPositions[slot.key]||50)-25}%`,height:"50%",border:"2px solid #2D8A52",pointerEvents:"none",transition:"top 0.15s"}}>
                                <div style={{position:"absolute",top:4,left:8,background:"#2D8A52",color:"white",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:4}}>✓ 보이는 영역</div>
                              </div>
                            </>}
                          </div>
                          <div style={{position:"absolute",top:0,left:0,right:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.5),transparent)",padding:"8px 12px",zIndex:2}}><span style={{fontSize:11,fontWeight:800,color:"white"}}>{slot.label}</span></div>
                          <div style={{position:"absolute",top:6,right:6,display:"flex",gap:4,zIndex:2}}>
                            <button onClick={()=>handleMainUpload(slot.key)} style={{width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>↺</button>
                            <button onClick={()=>{setMainPhotos(prev=>{const n={...prev};delete n[slot.key];return n;});setPhotoPositions(prev=>{const n={...prev};delete n[slot.key];return n;});}} style={{width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={12}/></button>
                          </div>
                          <div style={{background:"#1A1A1A",padding:"5px 10px",fontSize:10,color:"#AAA",textAlign:"center"}}>📌 사진을 클릭하여 매물에 보일 위치를 조정하세요</div>
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
              <div style={{fontSize:14,fontWeight:800,marginBottom:10}}>🔍 디테일 사진 (최대 20장) <span style={{fontSize:11,color:"#AAA",fontWeight:500}}>←→ 순서 변경</span></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                {detailPhotos.map((url,i)=>(
                  <div key={i} style={{position:"relative",borderRadius:10,overflow:"hidden",aspectRatio:"1"}}>
                    <img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",top:4,left:4,background:"rgba(0,0,0,0.5)",color:"white",fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:4}}>디테일{i+1}</div>
                    <div style={{position:"absolute",top:4,right:4,display:"flex",gap:2}}>
                      {i>0&&<button onClick={()=>setDetailPhotos(prev=>{const a=[...prev];[a[i-1],a[i]]=[a[i],a[i-1]];return a;})} style={{width:20,height:20,borderRadius:4,background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>}
                      {i<detailPhotos.length-1&&<button onClick={()=>setDetailPhotos(prev=>{const a=[...prev];[a[i],a[i+1]]=[a[i+1],a[i]];return a;})} style={{width:20,height:20,borderRadius:4,background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>→</button>}
                      <button onClick={()=>setDetailPhotos(prev=>prev.filter((_,j)=>j!==i))} style={{width:20,height:20,borderRadius:4,background:"rgba(220,50,50,0.8)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={10}/></button>
                    </div>
                  </div>
                ))}
                {detailPhotos.length<20&&(
                  <button onClick={handleDetailUpload} disabled={uploadingDetail} style={{aspectRatio:"1",border:"2px dashed #DDEEFF",borderRadius:10,background:"#F0F6FF",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,fontSize:11,color:"#0066FF",fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif"}}>
                    <Upload size={18} color="#0066FF"/>{uploadingDetail?"업로드중...":"추가"}
                  </button>
                )}
              </div>
              <div style={{fontSize:12,color:"#AAA",textAlign:"center"}}>메인 {Object.keys(mainPhotos).length}/5장 · 디테일 {detailPhotos.length}/20장</div>
              <div style={{fontSize:11,color:"#C4A060",textAlign:"center",marginTop:8,background:"#FFF8E8",padding:"8px 14px",borderRadius:8}}>⚠️ 4.5MB 이상 고용량 사진은 자동 용량 축소되어 화질에 변화가 생길 수 있습니다.</div>

              {/* ═══ 매물 등록 미리보기 ═══ */}
              {Object.keys(mainPhotos).length > 0 && (
                <div style={{marginTop:20,background:"#F8F7F4",borderRadius:16,padding:"20px 22px"}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#888",marginBottom:12}}>👁️ 전체매물에서 보여질 예시</div>
                  <div style={{background:"white",borderRadius:14,padding:"14px 16px",display:"flex",gap:14,alignItems:"flex-start",border:"1px solid #E8E6E1"}}>
                    {/* 사진 2장 */}
                    <div style={{display:"flex",gap:3,flexShrink:0}}>
                      <div style={{width:140,height:100,borderRadius:10,overflow:"hidden",background:"#F0EEE9"}}>
                        {mainPhotos.main1?<img src={mainPhotos.main1.split("#")[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:`center ${photoPositions.main1||50}%`}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#CCC",fontSize:11}}>📷 실외</div>}
                      </div>
                      <div style={{width:140,height:100,borderRadius:10,overflow:"hidden",background:"#F0EEE9"}}>
                        {mainPhotos.main5?<img src={mainPhotos.main5.split("#")[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:`center ${photoPositions.main5||50}%`}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#CCC",fontSize:11}}>📷 실내</div>}
                      </div>
                    </div>
                    {/* 정보 */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>{selectedBrand||"브랜드"} {selectedModel||selectedBase||"모델명"}{grade?` ${grade}`:""}</div>
                      <div style={{fontSize:12,color:"#AAA",marginBottom:6}}>{year||"00"}년식 · {mileage?Number(mileage).toLocaleString():"0"}km · {fuel||"연료"} · {region||"지역"}</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                        {!accident&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"#EAF6EF",color:"#2D8A52"}}>무사고</span>}
                        {fuel==="전기"&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"#EEF5FF",color:"#0066FF"}}>전기차</span>}
                        {Number(mileage)<30000&&Number(mileage)>0&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"#F0F6FF",color:"#0066FF"}}>저주행</span>}
                      </div>
                    </div>
                    {/* 가격 */}
                    <div style={{fontSize:20,fontWeight:800,color:"#FF3B1E",flexShrink:0}}>{price?Number(price).toLocaleString():"0"}<span style={{fontSize:11,color:"#AAA"}}>만원</span></div>
                  </div>
                </div>
              )}
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
                    {/* 성능상태점검장 선택 */}
                    <div style={{marginBottom:14}}>
                      <label style={labelS}>성능 상태점검장 선택</label>
                      <select value={inspCenter} onChange={e=>setInspCenter(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7",background:"white"}}>
                        <option value="">성능 상태점검장 선택</option>
                        <option value="빛고을">빛고을 (빛고을오토자동차공업사)</option>
                        <option value="서광주">서광주</option>
                        <option value="엠플러스">엠플러스</option>
                        <option value="웰퓨처">웰퓨처</option>
                        <option value="카존">카존</option>
                        <option value="하나카">하나카</option>
                        <option value="광주성능정비">(주)광주성능정비</option>
                        <option value="자동차성능점검인협동조합">자동차성능점검인협동조합</option>
                        <option value="완성자동차공업사">완성자동차공업사</option>
                        <option value="기타">기타 (직접입력)</option>
                      </select>
                      <div style={{fontSize:11,color:"#0066FF",marginTop:6}}>💡 픽스카 제휴 성능장에서 검수를 받으면 성능점검기록부가 자동으로 연동됩니다. (성능 점검일로부터 4개월이 경과한 것은 가져오기 불가)</div>
                    </div>
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
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:12,color:"#888",minWidth:90}}>매연 (디젤)</span>
                          <input type="number" step="0.1" value={exhaustSmoke} onChange={e=>setExhaustSmoke(e.target.value)} placeholder="0.0" style={{...inputS,width:80,padding:"8px 10px"}}/>
                          <span style={{fontSize:12,color:"#888"}}>%</span>
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
                    <DamageTable title="외판 부위" rank="2랭크" items={PANEL_2RANK} data={damage2} onChange={updateDamage(setDamage2)}/>
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
                    {goodBadRow("파워 고압호스",steeringHose,setSteeringHose)}
                    {goodBadRow("타이로드엔드 및 볼 조인트",tieRodBallJoint,setTieRodBallJoint)}
                    {sectionTitle("제동")}
                    {oilRow("마스터 실린더 오일 누유",brakeMasterLeak,setBrakeMasterLeak)}
                    {oilRow("브레이크 오일 누유",brakeOilLeak,setBrakeOilLeak)}
                    {oilRow("브레이크 오일 유량",brakeLevel,setBrakeLevel)}
                    {goodBadRow("배력장치 상태",brakeBooster,setBrakeBooster)}
                    {sectionTitle("전기")}
                    {goodBadRow("발전기 출력",generator,setGenerator)}
                    {goodBadRow("시동모터",starter,setStarter)}
                    {goodBadRow("와이퍼 모터기능",wiperMotor,setWiperMotor)}
                    {goodBadRow("실내송풍 모터",blowerMotor,setBlowerMotor)}
                    {goodBadRow("라디에이터 팬 모터",radFanMotor,setRadFanMotor)}
                    {goodBadRow("윈도우 모터",windowMotor,setWindowMotor)}
                    {/* 고전원 전기장치 (전기차/하이브리드) */}
                    {(fuel==="전기"||fuel==="하이브리드")&&<>
                      {sectionTitle("⚡ 고전원 전기장치 (전기차/하이브리드)")}
                      {goodBadRow("충전구 절연 상태",evChargeInsul,setEvChargeInsul)}
                      {goodBadRow("구동축전지 격리 상태",evBatteryIso,setEvBatteryIso)}
                      {goodBadRow("고전원전기배선 상태",evHighVoltWire,setEvHighVoltWire)}
                    </>}
                    {sectionTitle("연료")}
                    <div style={{display:"flex",alignItems:"center",padding:"10px 0",gap:16}}>
                      <div style={{minWidth:160,fontSize:13,color:"#444"}}>연료누출(LP가스 포함)</div>
                      <RG value={fuelLeak} options={["없음","있음"]} onChange={v=>setFuelLeak(v as "없음"|"있음")}/>
                    </div>
                    {/* 수동변속기 (M/T 선택 시) */}
                    {transmission==="수동"&&<>
                      {sectionTitle("🔧 수동변속기 (M/T)")}
                      {goodBadRow("기어변속장치",mtGearShift,setMtGearShift)}
                      {oilRow("오일유량 및 상태",mtOilLevel,setMtOilLevel)}
                      {goodBadRow("작동상태(이상음,진동)",mtRunning,setMtRunning)}
                    </>}
                  </div>

                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:14}}>🏎️ 자동차 기타정보</div>
                    {([ ["외장",exteriorState,setExteriorState], ["내장",interiorState,setInteriorState], ["광택",polishState,setPolishState], ["휠",wheelState,setWheelState], ["타이어",tireState,setTireState], ["유리",glassState,setGlassState] ] as [string,GoodBad,(v:GoodBad)=>void][]).map(([label, val, setter])=>(
                      <div key={label} style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F0F4FF",gap:16}}>
                        <div style={{minWidth:100,fontSize:13,fontWeight:700,color:"#444"}}>{label}</div>
                        <RG value={val} options={["양호","불량"]} onChange={v=>setter(v as GoodBad)}/>
                      </div>
                    ))}
                    {/* 보유상태 */}
                    <div style={{marginTop:14,borderTop:"2px solid #E8EEFF",paddingTop:14}}>
                      <div style={{fontSize:13,fontWeight:800,color:"#0066FF",marginBottom:10}}>📦 부속품 보유상태</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        {([["사용설명서",hasManual,setHasManual],["안전삼각대",hasTriangle,setHasTriangle],["잭",hasJack,setHasJack],["스패너",hasSpanner,setHasSpanner]] as [string,string,(v:"있음"|"없음")=>void][]).map(([label,val,setter])=>(
                          <div key={label} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0"}}>
                            <span style={{fontSize:13,color:"#444",minWidth:80}}>{label}</span>
                            <RG value={val} options={["있음","없음"]} onChange={v=>setter(v as "있음"|"없음")}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 검사유효기간 + 보증유형 + 특기사항 */}
                  <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:14}}>📝 기본 정보 (추가)</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                      <div>
                        <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>검사유효기간</label>
                        <input type="date" value={inspExpiry} onChange={e=>setInspExpiry(e.target.value)} style={{...inputS,border:"1.5px solid #E0DDD7"}}/>
                      </div>
                      <div>
                        <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>보증유형</label>
                        <div style={{display:"flex",gap:8,marginTop:6}}>
                          {(["자가보증","보험사보증"] as const).map(v=>(
                            <label key={v} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer",padding:"10px 16px",borderRadius:10,border:warrantyType===v?"2px solid #0066FF":"1px solid #E0DDD7",background:warrantyType===v?"#EEF5FF":"white"}}>
                              <input type="radio" checked={warrantyType===v} onChange={()=>setWarrantyType(v)} style={{accentColor:"#0066FF",width:14,height:14}}/>
                              <span style={{fontWeight:warrantyType===v?700:500}}>{v}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>⑮ 특기사항 및 점검자 의견</label>
                      <textarea rows={4} value={specialNote} onChange={e=>setSpecialNote(e.target.value)} placeholder="점검 시 특이사항, 점검자의 의견 등을 자유롭게 기재하세요." style={{...inputS,border:"1.5px solid #E0DDD7",resize:"none",lineHeight:1.8}}/>
                    </div>
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
            {step>1&&<button onClick={()=>{setStep(step-1);setErrors([]);setErrorFields(new Set());window.scrollTo({top:0,behavior:"smooth"});}} style={{padding:"16px 24px",background:"white",border:"1.5px solid #E0DDD7",borderRadius:14,fontSize:15,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}><ChevronLeft size={16} style={{verticalAlign:"middle"}}/> 이전</button>}
            {step<4
              ?<button onClick={nextStep} style={{flex:1,padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>다음 (옵션선택) <ChevronRight size={16}/></button>
              :<button onClick={handleSubmit} disabled={saving||(!skipInspection&&!agreeWarning)} style={{flex:1,padding:"16px",background:saving?"#CCC":(!skipInspection&&!agreeWarning)?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:saving||(!skipInspection&&!agreeWarning)?"not-allowed":"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>{saving?(isEditMode?"수정 중...":"등록 중..."):(!skipInspection&&!agreeWarning)?"허위기재 확인 필수":(isEditMode?"매물 수정하기":"매물 등록하기")}</button>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default function DealerCarsNewPage() {
  return <Suspense fallback={<div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div>}><DealerCarsNewInner/></Suspense>;
}
