"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Search, ChevronDown, AlertCircle, CheckCircle, X } from "lucide-react";

const DOMESTIC_BRANDS: Record<string, string[]> = {
  "현대": [
    "아반떼 CN7","쏘나타 DN8","그랜저 GN7","투싼 NX4","싼타페 MX5","팰리세이드",
    "아이오닉5","아이오닉5 N","아이오닉6","아이오닉9","넥쏘","코나 2세대","베뉴","스타리아",
    "캐스퍼",
    "(단종) 아반떼 AD","(단종) 아반떼 MD","(단종) 아반떼 HD","(단종) 쏘나타 LF",
    "(단종) 그랜저 IG","(단종) 싼타페 TM","(단종) 투싼 TL","(단종) 벨로스터",
    "(단종) 엑센트","(단종) 아슬란","(단종) i30",
  ],
  "기아": [
    "K5 3세대","K8","K9 2세대","스포티지 5세대","쏘렌토 MQ4","모하비","카니발 4세대",
    "셀토스","EV6","EV9","EV3","니로 2세대","레이","모닝 3세대",
    "(단종) K3 2세대","(단종) K5 2세대","(단종) K7","(단종) 스팅어",
    "(단종) 스포티지 QL","(단종) 쏘렌토 UM","(단종) 소울","(단종) 스토닉",
  ],
  "제네시스": [
    "G70","G80 2세대","G90 2세대","GV70","GV80","GV60",
    "(단종) G80 1세대","(단종) GV80 1세대","(단종) EQ900",
  ],
  "KG모빌리티": [
    "토레스","코란도 4세대","G4 렉스턴","무쏘 픽업",
    "(단종) 티볼리","(단종) 코란도 C","(단종) 렉스턴 W","(단종) 체어맨",
  ],
  "르노코리아": [
    "그랑 콜레오스",
    "(단종) QM6","(단종) SM6","(단종) XM3","(단종) SM7","(단종) SM5",
  ],
  "쉐보레": [
    "트레일블레이저","트랙스 2세대","이쿼녹스 3세대","트래버스","타호","콜로라도",
    "(단종) 말리부 9세대","(단종) 캡티바","(단종) 스파크 2세대","(단종) 크루즈",
  ],
};

const IMPORT_BRANDS: Record<string, string[]> = {
  /* ── BMW ── */
  "BMW": [
    "1시리즈 F70 (4세대)","2시리즈 쿠페 G42","2시리즈 액티브투어러 U06","3시리즈 G20/G21","4시리즈 G22/G23/G26","5시리즈 G60/G61","7시리즈 G70",
    "X1 U11","X2 U10","X3 G45","X5 G05","X6 G06","X7 G07","XM G09",
    "i4","i5","i7","iX","iX1",
    "M2 G87","M3 G80","M4 G82/G83","M5 G90","X5 M / X6 M",
    "(단종) 1시리즈 E87","(단종) 1시리즈 F20","(단종) 1시리즈 F40",
    "(단종) 2시리즈 쿠페 F22","(단종) 2시리즈 그란쿠페 F44","(단종) 2시리즈 액티브투어러 F45",
    "(단종) 3시리즈 E36","(단종) 3시리즈 E46","(단종) 3시리즈 E90","(단종) 3시리즈 F30",
    "(단종) 4시리즈 F32/F33","(단종) 5시리즈 E34","(단종) 5시리즈 E39","(단종) 5시리즈 E60",
    "(단종) 5시리즈 F10","(단종) 5시리즈 G30","(단종) 6시리즈 F12/F13","(단종) 6시리즈 GT G32",
    "(단종) 7시리즈 E38","(단종) 7시리즈 E65","(단종) 7시리즈 F01","(단종) 7시리즈 G11",
    "(단종) 8시리즈 G14/G15/G16",
    "(단종) X1 E84","(단종) X1 F48","(단종) X2 F39","(단종) X3 E83","(단종) X3 F25","(단종) X3 G01",
    "(단종) X4 F26","(단종) X4 G02","(단종) X5 E53","(단종) X5 E70","(단종) X5 F15",
    "(단종) X6 E71","(단종) X6 F16","(단종) i3 I01","(단종) iX3 G08",
    "(단종) M8 F91/F92","(단종) X3 M / X4 M F97/F98",
  ],

  /* ── 메르세데스-벤츠 ── */
  "메르세데스-벤츠": [
    "C-클래스 W206","CLA C118","E-클래스 W214","S-클래스 W223","마이바흐 S-클래스 Z223","마이바흐 GLS X167M",
    "SL R232","AMG GT X290/C192","G-클래스 W463a",
    "GLA H247","GLB X247","GLC X254","GLE W167","GLS X167",
    "EQA H243","EQB X243","EQE V295","EQS V297",
    "(단종) A-클래스 W176","(단종) A-클래스 W177","(단종) B-클래스 W246","(단종) B-클래스 W247",
    "(단종) C-클래스 W203","(단종) C-클래스 W204","(단종) C-클래스 W205",
    "(단종) CLA C117","(단종) CLS C219","(단종) CLS C218","(단종) CLS C257",
    "(단종) E-클래스 W210","(단종) E-클래스 W211","(단종) E-클래스 W212","(단종) E-클래스 W213",
    "(단종) S-클래스 W220","(단종) S-클래스 W221","(단종) S-클래스 W222",
    "(단종) SLK/SLC R172","(단종) AMG GT C190",
    "(단종) G-클래스 W463","(단종) GLA X156","(단종) GLC X253",
    "(단종) GLE W166","(단종) GLS X166","(단종) ML-클래스 W164","(단종) ML-클래스 W166",
    "(단종) GL-클래스 X166","(단종) GLK X204","(단종) EQC N293",
  ],

  /* ── 아우디 ── */
  "아우디": [
    "A3 8Y","A5 (신형, A4통합)","A6 C8","A7 4K","A8 D5",
    "Q3 F3","Q4 e-tron","Q5 3세대","Q7 4M","Q8 4M8","Q8 e-tron","e-tron GT",
    "S3/RS3","RS5","RS6 Avant","RS7","RS Q8","RS e-tron GT",
    "(단종) A3 8P","(단종) A3 8V","(단종) A4 B7","(단종) A4 B8","(단종) A4 B9",
    "(단종) A5 8T/8F","(단종) A5 F5","(단종) A6 C6","(단종) A6 C7","(단종) A7 4G",
    "(단종) A8 D4","(단종) TT 8J","(단종) TT 8S","(단종) R8 42","(단종) R8 4S",
    "(단종) Q2 GA","(단종) Q3 8U","(단종) Q5 8R","(단종) Q5 FY","(단종) Q7 4L",
    "(단종) e-tron GE","(단종) S4/RS4",
  ],

  /* ── 폭스바겐 ── */
  "폭스바겐": [
    "골프 Mk8","투아렉 CR","티구안 3세대","T-Roc A11","T-Cross C11",
    "ID.4","ID.7","ID.Buzz",
    "(단종) 골프 Mk6","(단종) 골프 Mk7","(단종) 폴로 6R/6C","(단종) 제타 Mk6",
    "(단종) 파사트 B7","(단종) 파사트 B8","(단종) CC","(단종) 아테온","(단종) 페이톤 3D",
    "(단종) 투아렉 7P","(단종) 티구안 5N","(단종) 티구안 AD1",
    "(단종) 시로코","(단종) 비틀 5C",
  ],

  /* ── 포르쉐 ── */
  "포르쉐": [
    "911 992","718 박스터/카이맨","카이엔 9Y0","마칸 2세대(EV)","파나메라 3세대","타이칸 J1",
    "(단종) 911 997","(단종) 911 991","(단종) 카이엔 9PA","(단종) 카이엔 92A",
    "(단종) 마칸 95B","(단종) 파나메라 970","(단종) 파나메라 971",
  ],

  /* ── MINI ── */
  "MINI": [
    "미니 3도어 4세대","미니 컨트리맨 U25","미니 에이스맨",
    "(단종) 미니 3도어 R56","(단종) 미니 3도어 F56","(단종) 미니 5도어 F55",
    "(단종) 미니 컨버터블 R57","(단종) 미니 컨버터블 F57","(단종) 미니 클럽맨 F54",
    "(단종) 미니 컨트리맨 R60","(단종) 미니 컨트리맨 F60",
  ],

  /* ── 볼보 ── */
  "볼보": [
    "S60 3세대","S90","V60","V90","XC40","XC60 2세대","XC90 2세대",
    "C40 Recharge","EX30","EX90",
    "(단종) S60 Y20","(단종) S80 TS","(단종) V40 MV","(단종) XC60 1세대","(단종) XC90 1세대",
  ],

  /* ── 테슬라 ── */
  "테슬라": [
    "모델 S","모델 3","모델 X","모델 Y",
    "(미출시) 사이버트럭",
  ],

  /* ── 토요타 ── */
  "토요타": [
    "캠리 9세대","GR 수프라 A90","GR86","프리우스 5세대","크라운","알파드",
    "RAV4 XA50","하이랜더 XU70","시에나 XL40","bZ4X","랜드크루저 300","랜드크루저 프라도 J250","C-HR 2세대",
    "(단종) 캠리 XV50","(단종) 캠리 XV70","(단종) 프리우스 XW50",
  ],

  /* ── 렉서스 ── */
  "렉서스": [
    "IS XE30","ES XV70","LS XF50","LC URZ100",
    "NX AZ20","RX AL30","UX MA10","LX J300","GX J260","LBX","RZ",
    "(단종) IS XE20","(단종) ES XV40","(단종) GS S190","(단종) GS L10","(단종) LS XF40",
    "(단종) RC XC10","(단종) NX AZ10","(단종) RX AL10","(단종) RX AL20",
  ],

  /* ── 혼다 ── */
  "혼다": [
    "어코드 11세대","시빅 11세대","CR-V 6세대","HR-V 3세대","파일럿 4세대","ZR-V","e:NY1",
    "(단종) 어코드 8세대","(단종) 어코드 9세대","(단종) 어코드 10세대",
    "(단종) 시빅 10세대","(단종) CR-V 4세대","(단종) CR-V 5세대",
    "(단종) HR-V 2세대","(단종) 오딧세이 5세대",
  ],

  /* ── 랜드로버 ── */
  "랜드로버": [
    "레인지로버 L461","레인지로버 스포츠 3세대","레인지로버 벨라","레인지로버 이보크 L551",
    "디스커버리 L462","디스커버리 스포츠 L550","디펜더 L663",
    "(단종) 레인지로버 L405","(단종) 레인지로버 스포츠 L494","(단종) 레인지로버 이보크 L538",
    "(단종) 디스커버리 L319",
  ],

  /* ── 재규어 ── */
  "재규어": [
    "F-Pace","E-Pace",
    "(단종) XE","(단종) XF 1세대","(단종) XF 2세대","(단종) XJ X351",
    "(단종) F-Type","(단종) I-Pace",
  ],

  /* ── 지프 ── */
  "지프": [
    "랭글러 JL","그랜드 체로키 WL","컴패스 MP","글래디에이터 JT","어벤저",
    "(단종) 랭글러 JK","(단종) 그랜드 체로키 WK2","(단종) 체로키 KL","(단종) 레니게이드 BU",
  ],

  /* ── 포드 ── */
  "포드": [
    "머스탱 7세대","머스탱 Mach-E","익스플로러 6세대","브롱코 스포츠","레인저 4세대",
    "(단종) 토러스","(단종) 머스탱 6세대","(단종) 익스플로러 5세대","(단종) 에코스포츠","(단종) 쿠가(이스케이프)",
  ],

  /* ── 링컨 ── */
  "링컨": [
    "에비에이터","노틸러스","코세어",
    "(단종) 컨티넨탈","(단종) MKZ",
  ],

  /* ── 폴스타 ── */
  "폴스타": [
    "폴스타 2","폴스타 3","폴스타 4",
  ],

  /* ── 마세라티 ── */
  "마세라티": [
    "그레칼레","MC20","그란투리스모","그란카브리오",
    "(단종) 기블리 M157","(단종) 콰트로포르테 M156","(단종) 레반떼",
  ],

  /* ── 벤틀리 ── */
  "벤틀리": [
    "컨티넨탈 GT 3세대","플라잉스퍼 3세대","벤테이가",
    "(단종) 컨티넨탈 GT 2세대","(단종) 플라잉스퍼 2세대","(단종) 뮬산",
  ],

  /* ── 롤스로이스 ── */
  "롤스로이스": [
    "고스트 2세대","팬텀 8세대","컬리넌","스펙터",
    "(단종) 고스트 1세대","(단종) 팬텀 7세대","(단종) 레이스","(단종) 던",
  ],

  /* ── 페라리 ── */
  "페라리": [
    "296 GTB/GTS","SF90 Stradale/Spider","Roma","Purosangue","12Cilindri",
    "(단종) 488 GTB/Spider/Pista","(단종) F8 Tributo/Spider","(단종) 812 Superfast/GTS","(단종) 포르토피노 M",
  ],

  /* ── 람보르기니 ── */
  "람보르기니": [
    "우루스","레부엘토","테메라리오",
    "(단종) 우라칸","(단종) 아벤타도르",
  ],

  /* ── 푸조 ── */
  "푸조": [
    "308 3세대","508 2세대","408","2008","3008 3세대","5008 3세대",
    "(단종) 208","(단종) 308 2세대","(단종) 508 1세대","(단종) 3008 1세대","(단종) 3008 2세대","(단종) 5008 2세대",
  ],

  /* ── 시트로엥 ── */
  "시트로엥": [
    "C4","C3 에어크로스",
    "(단종) C5 에어크로스","(단종) 베를링고",
  ],

  /* ── DS ── */
  "DS": [
    "DS7 2세대","DS4",
    "(단종) DS7 1세대",
  ],

  /* ── BYD ── */
  "BYD": [
    "아토 3","씰",
    "(출시예정) 돌핀",
  ],

  /* ── 캐딜락 ── */
  "캐딜락": [
    "CT4","CT5","XT4","XT6","에스컬레이드","리릭","셀레스틱",
    "(단종) CT6","(단종) XT5",
  ],

  /* ── GMC ── */
  "GMC": [
    "시에라","유콘","허머 EV",
  ],

  /* ── 맥라렌 ── */
  "맥라렌": [
    "GT","750S","아르투라",
    "(단종) 720S","(단종) 765LT",
  ],

  /* ── 애스턴마틴 ── */
  "애스턴마틴": [
    "DB12","뱅퀴시","DBX","밴티지",
    "(단종) DB11",
  ],

  /* ── 알파로메오 ── */
  "알파로메오": [
    "줄리아","스텔비오","토날레",
    "(단종) 줄리에타",
  ],

  /* ── 로터스 ── */
  "로터스": [
    "에미라","엘레트레","에메야",
  ],

  /* ── 스마트 ── */
  "스마트": [
    "#1","#3",
  ],

  /* ── 닛산/인피니티 (한국 철수) ── */
  "닛산/인피니티": [
    "(철수) 닛산 큐브","(철수) 닛산 쥬크","(철수) 닛산 370Z","(철수) 닛산 무라노",
    "(철수) 닛산 맥시마","(철수) 닛산 리프","(철수) 닛산 알티마",
    "(철수) 인피니티 Q50","(철수) 인피니티 Q60","(철수) 인피니티 Q70",
    "(철수) 인피니티 QX50","(철수) 인피니티 QX60","(철수) 인피니티 QX80",
  ],

  /* ── 스바루 (한국 철수) ── */
  "스바루": [
    "(철수) 아웃백","(철수) 포레스터","(철수) XV(크로스트렉)","(철수) WRX","(철수) 레보그","(철수) BRZ",
  ],

  /* ── 크라이슬러/닷지 ── */
  "크라이슬러/닷지": [
    "(철수) 크라이슬러 300C","(철수) 크라이슬러 퍼시피카",
    "(철수) 닷지 챌린저","(철수) 닷지 차저","(철수) 닷지 듀랑고",
  ],

  /* ── 피아트 (한국 철수) ── */
  "피아트": [
    "(철수) 500","(철수) 500X",
  ],
};

const SEGMENTS = ["전체","경차","소형","준중형","중형","대형","SUV/RV","전기차","수입차"];

const CAR_SPECS: Record<string, {
  grades:{name:string;price:number;engine:string;power:number;torque:number;efficiency:string}[];
  specs:{displacement:number;fuelType:string;transmission:string;drive:string;zero100:string;topSpeed:number;curbWeight:number;length:number;width:number;height:number;wheelbase:number};
  tax:{annualTax:number;insuranceType:string;surcharge:boolean};
  info:{bodyType:string;seats:number;segment:string};
}> = {
  "아반떼": {
    grades:[{name:"스마트",price:2015,engine:"1.6 MPI",power:123,torque:15.7,efficiency:"14.2"},{name:"프리미엄",price:2199,engine:"1.6 MPI",power:123,torque:15.7,efficiency:"14.2"},{name:"인스퍼레이션",price:2399,engine:"1.6 T-GDi",power:203,torque:27.0,efficiency:"12.2"},{name:"N Line",price:2550,engine:"1.6 T-GDi",power:203,torque:27.0,efficiency:"12.2"}],
    specs:{displacement:1598,fuelType:"가솔린",transmission:"IVT/7DCT",drive:"FF",zero100:"7.7초",topSpeed:210,curbWeight:1340,length:4650,width:1825,height:1415,wheelbase:2720},
    tax:{annualTax:291200,insuranceType:"소형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"준중형"},
  },
  "쏘나타": {
    grades:[{name:"스마트",price:2780,engine:"2.0 MPI",power:160,torque:20.0,efficiency:"12.8"},{name:"더 엣지",price:3380,engine:"1.6 T-GDi",power:180,torque:27.0,efficiency:"11.8"},{name:"하이브리드",price:3240,engine:"2.0 HEV",power:152,torque:19.3,efficiency:"20.1"}],
    specs:{displacement:1999,fuelType:"가솔린/하이브리드",transmission:"8단AT",drive:"FF",zero100:"8.5초",topSpeed:220,curbWeight:1505,length:4900,width:1860,height:1445,wheelbase:2840},
    tax:{annualTax:519700,insuranceType:"중형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"중형"},
  },
  "그랜저": {
    grades:[{name:"프리미엄",price:3964,engine:"2.5 GDi",power:198,torque:25.3,efficiency:"11.4"},{name:"캘리그래피",price:4855,engine:"3.5 GDi",power:300,torque:36.2,efficiency:"9.8"},{name:"하이브리드",price:4250,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"17.8"}],
    specs:{displacement:2497,fuelType:"가솔린/하이브리드",transmission:"8단AT",drive:"FF/AWD",zero100:"7.0초",topSpeed:230,curbWeight:1680,length:5035,width:1880,height:1470,wheelbase:2895},
    tax:{annualTax:649200,insuranceType:"대형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"대형"},
  },
  "투싼": {
    grades:[{name:"스마트",price:2699,engine:"2.0 MPI",power:156,torque:19.6,efficiency:"12.2"},{name:"인스퍼레이션",price:3260,engine:"1.6 T-GDi",power:180,torque:27.0,efficiency:"13.0"},{name:"하이브리드",price:3199,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"16.2"}],
    specs:{displacement:1598,fuelType:"가솔린/하이브리드/디젤",transmission:"8단AT/7DCT",drive:"FF/AWD",zero100:"8.5초",topSpeed:205,curbWeight:1610,length:4630,width:1865,height:1665,wheelbase:2755},
    tax:{annualTax:291200,insuranceType:"중형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:5,segment:"SUV/RV"},
  },
  "아이오닉5": {
    grades:[{name:"스탠다드 2WD",price:4990,engine:"전기 58kWh",power:170,torque:35.0,efficiency:"5.1km/kWh"},{name:"롱레인지 2WD",price:5400,engine:"전기 77.4kWh",power:217,torque:35.0,efficiency:"6.1km/kWh"},{name:"롱레인지 AWD",price:5820,engine:"전기 77.4kWh",power:325,torque:60.5,efficiency:"5.1km/kWh"}],
    specs:{displacement:0,fuelType:"전기",transmission:"단속기",drive:"RR/AWD",zero100:"5.1초",topSpeed:185,curbWeight:2100,length:4635,width:1890,height:1605,wheelbase:3000},
    tax:{annualTax:130000,insuranceType:"중형 승용(전기)",surcharge:false},
    info:{bodyType:"SUV",seats:5,segment:"전기차"},
  },
  "팰리세이드": {
    grades:[{name:"프리미엄",price:4230,engine:"3.8 GDi V6",power:295,torque:36.2,efficiency:"8.4"},{name:"캘리그래피",price:5150,engine:"3.8 GDi V6",power:295,torque:36.2,efficiency:"8.4"},{name:"디젤",price:4380,engine:"2.2 CRDi",power:202,torque:45.0,efficiency:"13.0"}],
    specs:{displacement:3778,fuelType:"가솔린/디젤",transmission:"8단AT",drive:"FF/AWD",zero100:"7.5초",topSpeed:210,curbWeight:2185,length:4995,width:1975,height:1750,wheelbase:2900},
    tax:{annualTax:982300,insuranceType:"대형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:8,segment:"SUV/RV"},
  },
  "K3": {
    grades:[{name:"트렌디",price:1831,engine:"1.6 MPI",power:123,torque:15.7,efficiency:"14.3"},{name:"프레스티지",price:2050,engine:"1.6 MPI",power:123,torque:15.7,efficiency:"14.3"},{name:"GT",price:2350,engine:"1.6 T-GDi",power:204,torque:27.0,efficiency:"12.5"}],
    specs:{displacement:1598,fuelType:"가솔린",transmission:"IVT/7DCT",drive:"FF",zero100:"7.9초",topSpeed:205,curbWeight:1320,length:4640,width:1800,height:1440,wheelbase:2700},
    tax:{annualTax:291200,insuranceType:"소형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"준중형"},
  },
  "K5": {
    grades:[{name:"트렌디",price:2610,engine:"1.6 T-GDi",power:180,torque:27.0,efficiency:"13.2"},{name:"시그니처",price:3240,engine:"2.0 T-GDi",power:248,torque:36.0,efficiency:"11.2"},{name:"하이브리드",price:3045,engine:"2.0 HEV",power:152,torque:19.3,efficiency:"20.3"}],
    specs:{displacement:1591,fuelType:"가솔린/하이브리드",transmission:"8단AT",drive:"FF/AWD",zero100:"7.5초",topSpeed:230,curbWeight:1490,length:4905,width:1860,height:1445,wheelbase:2850},
    tax:{annualTax:291200,insuranceType:"중형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"중형"},
  },
  "쏘렌토": {
    grades:[{name:"트렌디",price:3368,engine:"2.0 T-GDi",power:237,torque:35.7,efficiency:"11.5"},{name:"시그니처",price:4150,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"16.0"},{name:"PHEV",price:4790,engine:"1.6 T-PHEV",power:265,torque:35.0,efficiency:"54.7km"}],
    specs:{displacement:1999,fuelType:"가솔린/하이브리드/PHEV",transmission:"8단AT",drive:"FF/AWD",zero100:"7.0초",topSpeed:210,curbWeight:1840,length:4810,width:1900,height:1700,wheelbase:2815},
    tax:{annualTax:519700,insuranceType:"중형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:7,segment:"SUV/RV"},
  },
  "EV6": {
    grades:[{name:"스탠다드 2WD",price:5192,engine:"전기 58kWh",power:170,torque:35.0,efficiency:"5.0km/kWh"},{name:"롱레인지 AWD",price:6010,engine:"전기 77.4kWh",power:325,torque:60.5,efficiency:"5.0km/kWh"},{name:"GT",price:6900,engine:"전기 77.4kWh",power:585,torque:75.0,efficiency:"4.5km/kWh"}],
    specs:{displacement:0,fuelType:"전기",transmission:"단속기",drive:"RR/AWD",zero100:"3.5초",topSpeed:260,curbWeight:2055,length:4695,width:1880,height:1550,wheelbase:2900},
    tax:{annualTax:130000,insuranceType:"중형 승용(전기)",surcharge:false},
    info:{bodyType:"CUV",seats:5,segment:"전기차"},
  },
  "G80": {
    grades:[{name:"2.5T 프리미엄",price:6130,engine:"2.5 T-GDi",power:304,torque:43.0,efficiency:"10.0"},{name:"3.5T 시그니처",price:8150,engine:"3.5 T-GDi",power:380,torque:54.0,efficiency:"8.8"},{name:"전동화",price:8380,engine:"전기 87.2kWh",power:369,torque:70.0,efficiency:"4.5km/kWh"}],
    specs:{displacement:2497,fuelType:"가솔린/전기",transmission:"8단AT",drive:"RWD/AWD",zero100:"5.9초",topSpeed:240,curbWeight:1920,length:5015,width:1925,height:1465,wheelbase:3010},
    tax:{annualTax:649200,insuranceType:"대형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"대형"},
  },
  "3시리즈": {
    grades:[{name:"320i",price:5290,engine:"2.0 터보",power:184,torque:30.6,efficiency:"12.5"},{name:"330i",price:6090,engine:"2.0 터보",power:258,torque:40.8,efficiency:"11.6"},{name:"M340i",price:8120,engine:"3.0 직6 터보",power:387,torque:51.0,efficiency:"10.1"}],
    specs:{displacement:1998,fuelType:"가솔린",transmission:"8단AT",drive:"RWD/AWD",zero100:"5.8초",topSpeed:250,curbWeight:1540,length:4715,width:1825,height:1435,wheelbase:2850},
    tax:{annualTax:519700,insuranceType:"중형 승용(수입)",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"수입차"},
  },
  "아이오닉6": {
    grades:[{name:"스탠다드 2WD",price:4985,engine:"전기 53kWh",power:151,torque:25.0,efficiency:"6.3km/kWh"},{name:"롱레인지 2WD",price:5436,engine:"전기 77.4kWh",power:229,torque:35.0,efficiency:"6.4km/kWh"},{name:"롱레인지 AWD",price:5880,engine:"전기 77.4kWh",power:325,torque:60.5,efficiency:"5.5km/kWh"}],
    specs:{displacement:0,fuelType:"전기",transmission:"단속기",drive:"RWD/AWD",zero100:"5.1초",topSpeed:185,curbWeight:2010,length:4855,width:1880,height:1495,wheelbase:2950},
    tax:{annualTax:130000,insuranceType:"중형 승용(전기)",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"전기차"},
  },
  "그랜저 GN7": {
    grades:[{name:"2.5 프리미엄",price:3964,engine:"2.5 GDi",power:198,torque:25.3,efficiency:"11.4"},{name:"3.5 캘리그래피",price:4855,engine:"3.5 GDi",power:300,torque:36.2,efficiency:"9.8"},{name:"1.6T HEV",price:4250,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"17.8"}],
    specs:{displacement:2497,fuelType:"가솔린/하이브리드",transmission:"8단AT",drive:"FF/AWD",zero100:"7.0초",topSpeed:230,curbWeight:1680,length:5035,width:1880,height:1470,wheelbase:2895},
    tax:{annualTax:649200,insuranceType:"대형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"대형"},
  },
  "싼타페 MX5": {
    grades:[{name:"2.5T 프리미엄",price:3524,engine:"2.5 T-GDi",power:277,torque:43.0,efficiency:"11.0"},{name:"1.6T HEV 시그니처",price:4385,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"16.3"},{name:"디젤 프리미엄",price:3498,engine:"2.2 CRDi",power:202,torque:45.0,efficiency:"14.5"}],
    specs:{displacement:2497,fuelType:"가솔린/하이브리드/디젤",transmission:"8단AT",drive:"FF/AWD",zero100:"7.5초",topSpeed:220,curbWeight:1835,length:4830,width:1900,height:1780,wheelbase:2815},
    tax:{annualTax:649200,insuranceType:"중형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:7,segment:"SUV/RV"},
  },
  "GV70": {
    grades:[{name:"2.5T 프리미엄",price:5910,engine:"2.5 T-GDi",power:304,torque:43.0,efficiency:"9.8"},{name:"3.5T 시그니처",price:7130,engine:"3.5 T-GDi",power:380,torque:54.0,efficiency:"8.2"},{name:"Electrified",price:7690,engine:"전기 77.4kWh",power:360,torque:60.5,efficiency:"4.7km/kWh"}],
    specs:{displacement:2497,fuelType:"가솔린/전기",transmission:"8단AT/단속기",drive:"AWD",zero100:"4.5초",topSpeed:235,curbWeight:2005,length:4715,width:1910,height:1630,wheelbase:2875},
    tax:{annualTax:649200,insuranceType:"대형 SUV",surcharge:false},
    info:{bodyType:"SUV",seats:5,segment:"SUV/RV"},
  },
  "GV60": {
    grades:[{name:"스탠다드 2WD",price:5990,engine:"전기 77.4kWh",power:229,torque:35.0,efficiency:"5.6km/kWh"},{name:"퍼포먼스 AWD",price:7290,engine:"전기 77.4kWh",power:429,torque:70.0,efficiency:"4.9km/kWh"},{name:"Magma",price:9800,engine:"전기 77.4kWh",power:584,torque:75.0,efficiency:"4.5km/kWh"}],
    specs:{displacement:0,fuelType:"전기",transmission:"단속기",drive:"RWD/AWD",zero100:"4.0초",topSpeed:235,curbWeight:2205,length:4515,width:1890,height:1580,wheelbase:2900},
    tax:{annualTax:130000,insuranceType:"중형 SUV(전기)",surcharge:false},
    info:{bodyType:"SUV",seats:5,segment:"전기차"},
  },
  "K8": {
    grades:[{name:"2.5 프레스티지",price:3556,engine:"2.5 GDi",power:198,torque:25.3,efficiency:"11.2"},{name:"3.5 시그니처",price:4290,engine:"3.5 GDi",power:300,torque:36.2,efficiency:"9.5"},{name:"1.6T HEV",price:3820,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"17.0"}],
    specs:{displacement:2497,fuelType:"가솔린/하이브리드",transmission:"8단AT",drive:"FF",zero100:"7.5초",topSpeed:225,curbWeight:1640,length:5015,width:1875,height:1455,wheelbase:2895},
    tax:{annualTax:649200,insuranceType:"대형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"대형"},
  },
  "K9 2세대": {
    grades:[{name:"3.3T 프레스티지",price:6820,engine:"3.3 T-GDi",power:370,torque:52.0,efficiency:"9.2"},{name:"3.8 시그니처",price:6330,engine:"3.8 GDi",power:315,torque:40.0,efficiency:"9.6"}],
    specs:{displacement:3342,fuelType:"가솔린",transmission:"8단AT",drive:"RWD/AWD",zero100:"5.9초",topSpeed:250,curbWeight:2070,length:5165,width:1925,height:1490,wheelbase:3045},
    tax:{annualTax:867800,insuranceType:"대형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"대형"},
  },
  "토레스": {
    grades:[{name:"트렌디",price:2695,engine:"1.5T 가솔린",power:170,torque:28.6,efficiency:"11.0"},{name:"프리미엄",price:2995,engine:"1.5T 가솔린",power:170,torque:28.6,efficiency:"11.0"},{name:"EVX",price:4490,engine:"전기 73.4kWh",power:152,torque:33.6,efficiency:"5.3km/kWh"}],
    specs:{displacement:1497,fuelType:"가솔린/전기",transmission:"8단AT/단속기",drive:"FF/AWD",zero100:"9.0초",topSpeed:185,curbWeight:1670,length:4700,width:1890,height:1720,wheelbase:2680},
    tax:{annualTax:291200,insuranceType:"중형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:5,segment:"SUV/RV"},
  },
  "트레일블레이저": {
    grades:[{name:"LS",price:2290,engine:"1.3T 가솔린",power:155,torque:24.0,efficiency:"12.5"},{name:"RS",price:2890,engine:"1.3T 가솔린",power:155,torque:24.0,efficiency:"12.5"},{name:"ACTIV",price:2690,engine:"1.3T 가솔린",power:155,torque:24.0,efficiency:"11.8"}],
    specs:{displacement:1294,fuelType:"가솔린",transmission:"9단AT",drive:"FF/AWD",zero100:"9.5초",topSpeed:195,curbWeight:1440,length:4411,width:1811,height:1643,wheelbase:2640},
    tax:{annualTax:214200,insuranceType:"소형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:5,segment:"SUV/RV"},
  },
  "모하비": {
    grades:[{name:"프레스티지",price:4908,engine:"3.0 디젤 V6",power:262,torque:56.0,efficiency:"10.1"},{name:"마스터즈",price:5340,engine:"3.0 디젤 V6",power:262,torque:56.0,efficiency:"10.1"}],
    specs:{displacement:2999,fuelType:"디젤",transmission:"8단AT",drive:"4WD",zero100:"9.0초",topSpeed:200,curbWeight:2265,length:4930,width:1920,height:1825,wheelbase:2895},
    tax:{annualTax:779700,insuranceType:"대형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:7,segment:"SUV/RV"},
  },
  "셀토스": {
    grades:[{name:"트렌디",price:2219,engine:"1.6 MPI",power:123,torque:15.3,efficiency:"13.5"},{name:"프레스티지",price:2580,engine:"1.6 T-GDi",power:177,torque:27.0,efficiency:"13.2"},{name:"시그니처",price:2890,engine:"1.6 T-GDi",power:177,torque:27.0,efficiency:"13.2"}],
    specs:{displacement:1591,fuelType:"가솔린",transmission:"IVT/7DCT",drive:"FF/AWD",zero100:"8.9초",topSpeed:200,curbWeight:1395,length:4370,width:1800,height:1620,wheelbase:2630},
    tax:{annualTax:291200,insuranceType:"소형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:5,segment:"SUV/RV"},
  },
  "EV9": {
    grades:[{name:"스탠다드 RWD",price:7390,engine:"전기 76.1kWh",power:150,torque:35.0,efficiency:"4.5km/kWh"},{name:"롱레인지 AWD",price:8390,engine:"전기 99.8kWh",power:385,torque:60.0,efficiency:"4.7km/kWh"},{name:"GT-Line AWD",price:8990,engine:"전기 99.8kWh",power:385,torque:60.0,efficiency:"4.5km/kWh"}],
    specs:{displacement:0,fuelType:"전기",transmission:"단속기",drive:"RWD/AWD",zero100:"5.3초",topSpeed:200,curbWeight:2630,length:5010,width:1980,height:1755,wheelbase:3100},
    tax:{annualTax:130000,insuranceType:"대형 SUV(전기)",surcharge:false},
    info:{bodyType:"SUV",seats:7,segment:"전기차"},
  },
  "레이": {
    grades:[{name:"LX",price:1543,engine:"1.0 MPI",power:63,torque:9.3,efficiency:"13.0"},{name:"RV",price:1680,engine:"1.0 MPI",power:63,torque:9.3,efficiency:"13.0"},{name:"EV",price:2990,engine:"전기 35.2kWh",power:90,torque:18.0,efficiency:"5.0km/kWh"}],
    specs:{displacement:998,fuelType:"가솔린/전기",transmission:"5단AT/단속기",drive:"FF",zero100:"14.5초",topSpeed:155,curbWeight:940,length:3595,width:1595,height:1700,wheelbase:2520},
    tax:{annualTax:104000,insuranceType:"경차",surcharge:false},
    info:{bodyType:"박스카",seats:4,segment:"경차"},
  },
  "모닝 3세대": {
    grades:[{name:"트렌디",price:1266,engine:"1.0 MPI",power:75,torque:9.6,efficiency:"14.5"},{name:"프레스티지",price:1440,engine:"1.0 MPI",power:75,torque:9.6,efficiency:"14.5"}],
    specs:{displacement:998,fuelType:"가솔린",transmission:"5단AT",drive:"FF",zero100:"13.5초",topSpeed:155,curbWeight:960,length:3595,width:1595,height:1480,wheelbase:2385},
    tax:{annualTax:104000,insuranceType:"경차",surcharge:false},
    info:{bodyType:"해치백",seats:5,segment:"경차"},
  },
  "캐스퍼": {
    grades:[{name:"스마트",price:1615,engine:"1.0 T-GDi",power:100,torque:17.0,efficiency:"14.0"},{name:"인스퍼레이션",price:1987,engine:"1.0 T-GDi",power:100,torque:17.0,efficiency:"14.0"}],
    specs:{displacement:998,fuelType:"가솔린",transmission:"IVT",drive:"FF",zero100:"13.0초",topSpeed:165,curbWeight:1000,length:3595,width:1595,height:1575,wheelbase:2400},
    tax:{annualTax:104000,insuranceType:"경형 SUV",surcharge:false},
    info:{bodyType:"경형 SUV",seats:4,segment:"경차"},
  },
  "카니발 4세대": {
    grades:[{name:"프레스티지",price:3607,engine:"2.2 디젤",power:202,torque:45.0,efficiency:"11.5"},{name:"시그니처",price:4480,engine:"3.5 가솔린",power:290,torque:35.5,efficiency:"9.2"},{name:"하이리무진",price:5250,engine:"3.5 가솔린",power:290,torque:35.5,efficiency:"9.2"}],
    specs:{displacement:2151,fuelType:"가솔린/디젤",transmission:"8단AT",drive:"FF",zero100:"9.5초",topSpeed:200,curbWeight:2055,length:5155,width:1995,height:1775,wheelbase:3090},
    tax:{annualTax:559000,insuranceType:"대형 MPV",surcharge:false},
    info:{bodyType:"MPV",seats:11,segment:"SUV/RV"},
  },
  "G70": {
    grades:[{name:"2.0T 프리미엄",price:4410,engine:"2.0 T-GDi",power:252,torque:36.0,efficiency:"11.2"},{name:"3.3T 스포츠",price:5880,engine:"3.3 T-GDi",power:370,torque:52.0,efficiency:"9.0"},{name:"슈팅브레이크",price:5100,engine:"2.0 T-GDi",power:252,torque:36.0,efficiency:"11.0"}],
    specs:{displacement:1998,fuelType:"가솔린",transmission:"8단AT",drive:"RWD/AWD",zero100:"5.1초",topSpeed:250,curbWeight:1650,length:4685,width:1850,height:1400,wheelbase:2835},
    tax:{annualTax:519700,insuranceType:"중형 승용",surcharge:false},
    info:{bodyType:"세단/왜건",seats:5,segment:"중형"},
  },
  "G90 2세대": {
    grades:[{name:"3.5T AWD",price:16420,engine:"3.5 T-GDi",power:380,torque:54.0,efficiency:"8.8"},{name:"롱휠베이스 3.5T",price:18800,engine:"3.5 T-GDi",power:380,torque:54.0,efficiency:"8.5"}],
    specs:{displacement:3470,fuelType:"가솔린",transmission:"8단AT",drive:"AWD",zero100:"5.5초",topSpeed:250,curbWeight:2310,length:5455,width:1975,height:1490,wheelbase:3275},
    tax:{annualTax:1037000,insuranceType:"대형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"대형"},
  },
  "스포티지 5세대": {
    grades:[{name:"트렌디",price:2680,engine:"2.0 MPI",power:156,torque:19.6,efficiency:"12.0"},{name:"프레스티지",price:2990,engine:"1.6 T-GDi",power:180,torque:27.0,efficiency:"13.0"},{name:"하이브리드",price:3190,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"16.8"}],
    specs:{displacement:1591,fuelType:"가솔린/하이브리드",transmission:"7DCT/6단AT",drive:"FF/AWD",zero100:"8.5초",topSpeed:210,curbWeight:1580,length:4515,width:1865,height:1660,wheelbase:2680},
    tax:{annualTax:291200,insuranceType:"중형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:5,segment:"SUV/RV"},
  },
  "니로 2세대": {
    grades:[{name:"HEV 트렌디",price:2720,engine:"1.6 HEV",power:141,torque:17.0,efficiency:"20.8"},{name:"PHEV 프레스티지",price:3420,engine:"1.6 PHEV",power:183,torque:17.0,efficiency:"76.5km/ℓ"},{name:"EV 시그니처",price:4790,engine:"전기 64.8kWh",power:204,torque:25.5,efficiency:"5.9km/kWh"}],
    specs:{displacement:1580,fuelType:"하이브리드/PHEV/전기",transmission:"6DCT/단속기",drive:"FF",zero100:"7.8초",topSpeed:167,curbWeight:1430,length:4420,width:1825,height:1570,wheelbase:2720},
    tax:{annualTax:291200,insuranceType:"소형 RV",surcharge:false},
    info:{bodyType:"크로스오버",seats:5,segment:"전기차"},
  },
  "C클래스": {
    grades:[{name:"C 200",price:6100,engine:"1.5 터보+마일드HEV",power:204,torque:30.0,efficiency:"13.2"},{name:"C 300",price:7200,engine:"2.0 터보",power:258,torque:40.0,efficiency:"11.8"},{name:"AMG C 43",price:9800,engine:"2.0 터보+전기모터",power:408,torque:50.0,efficiency:"10.5"}],
    specs:{displacement:1497,fuelType:"가솔린/마일드HEV",transmission:"9단AT",drive:"RWD/AWD",zero100:"6.1초",topSpeed:250,curbWeight:1640,length:4751,width:1820,height:1438,wheelbase:2865},
    tax:{annualTax:291200,insuranceType:"중형 승용(수입)",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"수입차"},
  },
  "모델Y": {
    grades:[{name:"스탠다드 RWD",price:5699,engine:"전기",power:255,torque:42.0,efficiency:"6.1km/kWh"},{name:"롱레인지 AWD",price:6999,engine:"전기",power:358,torque:53.0,efficiency:"5.6km/kWh"},{name:"퍼포먼스",price:7999,engine:"전기",power:430,torque:66.0,efficiency:"5.2km/kWh"}],
    specs:{displacement:0,fuelType:"전기",transmission:"단속기",drive:"RWD/AWD",zero100:"3.7초",topSpeed:250,curbWeight:1979,length:4751,width:1921,height:1624,wheelbase:2890},
    tax:{annualTax:130000,insuranceType:"중형 SUV(전기·수입)",surcharge:false},
    info:{bodyType:"SUV",seats:5,segment:"전기차"},
  },
};

const ALL_MODELS = Object.values({...DOMESTIC_BRANDS,...IMPORT_BRANDS}).flat();


const GENERATION_HISTORY: Record<string, {gen:string;period:string;code:string;note:string}[]> = {
  "아반떼 CN7": [
    {gen:"7세대 (현재)",period:"2020~현재",code:"CN7",note:"N Line / 아반떼 N 포함"},
    {gen:"6세대",period:"2015~2020",code:"AD",note:"단종"},
    {gen:"5세대",period:"2010~2015",code:"MD",note:"쿠페 파생, 단종"},
    {gen:"4세대",period:"2006~2013",code:"HD",note:"단종"},
    {gen:"3세대",period:"2000~2006",code:"XD",note:"단종"},
  ],
  "쏘나타 DN8": [
    {gen:"8세대 (현재)",period:"2019~현재",code:"DN8",note:"하이브리드 포함"},
    {gen:"7세대",period:"2014~2019",code:"LF",note:"단종"},
    {gen:"6세대",period:"2009~2014",code:"YF",note:"단종"},
    {gen:"5세대",period:"2004~2009",code:"NF",note:"트랜스폼 포함, 단종"},
    {gen:"4세대",period:"1998~2004",code:"EF",note:"단종"},
  ],
  "그랜저 GN7": [
    {gen:"7세대 (현재)",period:"2022~현재",code:"GN7",note:"하이브리드 포함"},
    {gen:"6세대",period:"2016~2022",code:"IG",note:"단종"},
    {gen:"5세대",period:"2011~2016",code:"HG",note:"단종"},
    {gen:"4세대",period:"2005~2011",code:"TG",note:"아제라(수출명), 단종"},
    {gen:"3세대",period:"1998~2005",code:"XG",note:"단종"},
    {gen:"1~2세대",period:"1986~1998",code:"LX/LX2",note:"각그랜저·뉴그랜저, 단종"},
  ],
  "투싼 NX4": [
    {gen:"4세대 (현재)",period:"2020~현재",code:"NX4",note:"HEV 포함"},
    {gen:"3세대",period:"2015~2020",code:"TL",note:"올뉴 투싼, 단종"},
    {gen:"2세대",period:"2009~2015",code:"LM",note:"투싼 ix, 단종"},
    {gen:"1세대",period:"2004~2009",code:"JM",note:"단종"},
  ],
  "싼타페 MX5": [
    {gen:"5세대 (현재)",period:"2023~현재",code:"MX5",note:"HEV 포함"},
    {gen:"4세대",period:"2018~2023",code:"TM",note:"단종"},
    {gen:"3세대",period:"2012~2017",code:"DM",note:"단종"},
    {gen:"2세대",period:"2006~2012",code:"CM",note:"단종"},
    {gen:"1세대",period:"2000~2006",code:"SM",note:"단종"},
  ],
  "K5 3세대": [
    {gen:"3세대 (현재)",period:"2019~현재",code:"DL3",note:"HEV 포함"},
    {gen:"2세대",period:"2015~2019",code:"JF",note:"단종"},
    {gen:"1세대",period:"2010~2015",code:"TF",note:"단종"},
    {gen:"전신: 로체",period:"2005~2010",code:"MG",note:"단종"},
    {gen:"전신: 옵티마",period:"2000~2005",code:"MS",note:"단종"},
  ],
  "쏘렌토 MQ4": [
    {gen:"4세대 (현재)",period:"2020~현재",code:"MQ4",note:"HEV/PHEV 포함"},
    {gen:"3세대",period:"2014~2020",code:"UM",note:"올뉴 쏘렌토, 단종"},
    {gen:"2세대",period:"2009~2014",code:"XM",note:"쏘렌토 R, 단종"},
    {gen:"1세대",period:"2002~2009",code:"BL",note:"단종"},
  ],
  "스포티지 5세대": [
    {gen:"5세대 (현재)",period:"2021~현재",code:"NQ5",note:"HEV 포함"},
    {gen:"4세대",period:"2015~2021",code:"QL",note:"단종"},
    {gen:"3세대",period:"2010~2015",code:"SL",note:"스포티지 R, 단종"},
    {gen:"2세대",period:"2004~2010",code:"KM",note:"단종"},
  ],
  "G80 2세대": [
    {gen:"2세대 (현재)",period:"2020~현재",code:"RG3",note:"Electrified G80 포함"},
    {gen:"1세대",period:"2016~2020",code:"DH F/L",note:"단종"},
    {gen:"전신: 제네시스 DH",period:"2013~2016",code:"DH",note:"단종"},
  ],
  "카니발 4세대": [
    {gen:"4세대 (현재)",period:"2020~현재",code:"KA4",note:""},
    {gen:"3세대",period:"2014~2020",code:"YP",note:"단종"},
    {gen:"2세대",period:"2005~2014",code:"VQ",note:"단종"},
    {gen:"1세대",period:"1998~2005",code:"KV",note:"단종"},
  ],
};


const CAR_ISSUES: Record<string, {issues:string[];fuelIssues?:string[];yearIssues?:{year:string;issue:string}[]}> = {
  "아반떼 CN7": {
    issues:["1.6T DCT 변속 시 미세 떨림 (콜드스타트)","내비 디스플레이 터치 반응 간헐적 오류","뒷좌석 바람소리 (고속도로)"],
    fuelIssues:["T-GDi 터보: DPF 카본 누적 → 주기적 엔진 청소 권장","MPI 자연흡기: 상대적으로 고질병 적음"],
    yearIssues:[{year:"2020~2021년식",issue:"DCT 소프트웨어 버그 (리콜 완료 여부 확인 필요)"},{year:"2022년식~",issue:"개선 후 출고, 상대적으로 안정적"}],
  },
  "쏘나타 DN8": {
    issues:["8단 자동변속기 저속 변속 충격 (초기 모델)","원격 스마트 주차 시스템 오작동","후방 카메라 영상 끊김"],
    fuelIssues:["2.0 HEV: 하이브리드 배터리 냉각 효율 주의 (폭염 시)","1.6T: 터보랙 체감 가능"],
    yearIssues:[{year:"2019~2020년식",issue:"변속기 충격 이슈 → 소프트웨어 업데이트 권장"},{year:"2021년식~",issue:"대부분 수정 완료"}],
  },
  "그랜저 GN7": {
    issues:["ADAS(차선보조) 오작동 간헐적 발생","전동 트렁크 닫힘 불량","공조기 소음 (블로어 모터)"],
    fuelIssues:["3.5 GDi V6: 연비 불량 (도심 7~8km/ℓ)","1.6 T-HEV: 배터리 충전 전략 이슈"],
    yearIssues:[{year:"2022년식(초기)",issue:"AWD 구동계 진동 (소수 보고)"},{year:"2023년식~",issue:"AWD 개선 완료"}],
  },
  "투싼 NX4": {
    issues:["1.6 T-HEV 전자식 AWD 연결 지연 (코너링 시)","파노라마 선루프 소음","스마트 크루즈 간헐 해제"],
    fuelIssues:["디젤 2.0: DPF 재생 빈도 높음 (도심 단거리 위주 시)","하이브리드: 연비 광고값과 실연비 차이 있음 (도심)"],
    yearIssues:[{year:"2020~2021년식",issue:"전자 제어 유닛 소프트웨어 이슈 (업데이트 필요)"}],
  },
  "K5 3세대": {
    issues:["8단AT 저속 변속 충격 (공통)","스마트 주차 보조 오인식","앞유리 성에 제거 느림"],
    fuelIssues:["2.0 T-GDi AWD: 연료 직분사 카본 누적 빠름 (인젝터 청소 권장)","HEV: 실연비 광고 대비 낮을 수 있음"],
    yearIssues:[{year:"2020~2021년식",issue:"8단 TCU 이슈 (리콜 확인)"}],
  },
  "쏘렌토 MQ4": {
    issues:["PHEV 충전 포트 락 오작동","3열 접이 레버 위치 불편","HEV 회생 제동 충격"],
    fuelIssues:["PHEV: 배터리 잔량 낮을 때 연비 급감","디젤: DPF 빈도 도심 주행 시 잦음"],
    yearIssues:[{year:"2020~2022년식",issue:"PHEV 충전 시스템 소프트웨어 버그"}],
  },
  "3시리즈": {
    issues:["B48 엔진 냉각수 호스 누수 (10만km 이상)","전자 파킹 브레이크 경고등","iDrive 소프트웨어 응답 느림"],
    fuelIssues:["2.0 터보: 고RPM 오일 소모량 확인 권장","디젤: 요소수 소모 빠름"],
    yearIssues:[{year:"2019~2021년식",issue:"냉각수 호스 리콜 대상 여부 확인"}],
  },
  "모델Y": {
    issues:["패널 갭 불균일 (조립 품질 편차)","열펌프 한국 겨울 효율 저하","도어 씰 소음"],
    fuelIssues:["전기: 한겨울 주행가능거리 20~30% 감소","고속 충전 반복 시 배터리 열화 가속"],
    yearIssues:[{year:"2022~2023년식",issue:"패널갭·마감 이슈 (초기 대비 개선 중)"}],
  },
  "싼타페 MX5": {
    issues:["후방 카메라 눈/비 오염 시 시야 차단","공조기 소음 간헐 발생","파노라마 선루프 우수음"],
    fuelIssues:["2.5T 가솔린: 엔진 오일 소모 확인 권장","HEV: 실연비 17km 달성 어려움 (도심)"],
    yearIssues:[{year:"2023년식(초기)",issue:"ADAS 오작동 간헐 보고 → 업데이트 확인"}],
  },
  "아이오닉5": {
    issues:["급속 충전 후 주행가능거리 표시 오류","겨울 히트펌프 효율 저하","후방 범퍼 도장 얇음"],
    fuelIssues:["전기: 겨울 주행거리 20~30% 감소","AWD: RR 대비 주행거리 감소"],
    yearIssues:[{year:"2021~2022년식",issue:"배터리 냉각 소프트웨어 개선 필요 (업데이트 확인)"}],
  },
  "EV6": {
    issues:["충전 포트 동결 (영하 날씨)","사이드 미러 진동 (고속)","GT-Line 브레이크 먼지 많음"],
    fuelIssues:["전기 일반: 겨울 항속거리 감소","GT: 고성능 주행 시 배터리 온도 관리 필요"],
    yearIssues:[{year:"2021~2022년식",issue:"충전 소프트웨어 버그 (OTA 업데이트로 해결)"}],
  },
  "카니발 4세대": {
    issues:["3열 접이식 시트 이물질 끼임","파워슬라이딩 도어 소음","디젤 DPF 경고등 (단거리 반복 시)"],
    fuelIssues:["디젤: 단거리 반복 시 DPF 재생 빈도 높음","3.5 가솔린: 연비 실연비 8~9km/ℓ 수준"],
    yearIssues:[{year:"2020~2021년식",issue:"파워슬라이딩 도어 초기 불량 간헐 보고"}],
  },
};

export default function CatalogPage() {
  const [brandType, setBrandType] = useState<"domestic"|"import">("domestic");
  const [selectedBrand, setSelectedBrand] = useState("현대");
  const [selectedModel, setSelectedModel] = useState("아반떼");
  const [segment, setSegment] = useState("전체");
  const [search, setSearch] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ wrongInfo:"", correctInfo:"" });
  const [reportSent, setReportSent] = useState(false);

  const brandList = brandType === "domestic" ? DOMESTIC_BRANDS : IMPORT_BRANDS;
  const models = (brandList[selectedBrand] || []).filter(m => {
    if (search && !m.includes(search)) return false;
    if (segment === "전체") return true;
    const spec = CAR_SPECS[m];
    if (!spec) return true;
    return spec.info.segment === segment;
  });

  const car = CAR_SPECS[selectedModel];

  const handleBrand = (b: string) => {
    setSelectedBrand(b);
    const firstModel = (brandList[b] || [])[0];
    if (firstModel) setSelectedModel(firstModel);
  };

  const handleReport = async () => {
    if (!reportForm.wrongInfo || !reportForm.correctInfo) { alert("내용을 입력해주세요"); return; }
    await fetch("/api/catalog/report", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ carModel:selectedModel, ...reportForm }),
    });
    setReportSent(true);
    setShowReport(false);
    setReportForm({ wrongInfo:"", correctInfo:"" });
    setTimeout(() => setReportSent(false), 5000);
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        input,textarea{font-family:'NanumSquareRound',sans-serif;}
        input:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;}
        .mbtn{transition:all 0.15s;cursor:pointer;border:none;width:100%;text-align:left;}
        .mbtn:hover{background:#F0EEE9!important;}
        .spec-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0EEE9;align-items:center;}
        @media(max-width:1024px){.layout{grid-template-columns:1fr!important;}.sidebar{display:none!important;}}
      `}</style>

      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar />
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"1200px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>CAR CATALOG</div>
            <h1 style={{fontSize:"clamp(24px,4vw,44px)",fontWeight:800,color:"white",letterSpacing:"-1px",marginBottom:"6px"}}>차량 카탈로그 백과사전</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",fontWeight:400}}>국산·수입 전 차종 · 등급별 출고가 · 마력 · 연비 · 자동차세 · 보험 정보</p>
          </div>
        </div>

        <div style={{maxWidth:"1200px",margin:"0 auto",padding:"24px 32px 80px"}}>
          {reportSent && (
            <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"12px",padding:"14px 18px",marginBottom:"16px",display:"flex",alignItems:"center",gap:"10px"}}>
              <CheckCircle size={18} color="#2D8A52"/>
              <span style={{fontSize:"14px",fontWeight:700,color:"#2D8A52"}}>정정 신고가 접수됐어요! 관리자 검토 후 반영할게요.</span>
            </div>
          )}

          <div className="layout" style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:"20px",alignItems:"start"}}>

            {/* 사이드바 */}
            <div className="sidebar" style={{background:"white",borderRadius:"18px",overflow:"hidden",position:"sticky",top:"84px"}}>
              {/* 국산/수입 탭 */}
              <div style={{display:"flex",borderBottom:"2px solid #F0EEE9"}}>
                {(["domestic","import"] as const).map(t=>(
                  <button key={t} onClick={()=>{setBrandType(t);const firstBrand=Object.keys(t==="domestic"?DOMESTIC_BRANDS:IMPORT_BRANDS)[0];setSelectedBrand(firstBrand);const firstModel=(t==="domestic"?DOMESTIC_BRANDS:IMPORT_BRANDS)[firstBrand][0];setSelectedModel(firstModel);}}
                    style={{flex:1,padding:"12px",border:"none",background:"transparent",fontSize:"14px",fontWeight:brandType===t?800:600,color:brandType===t?"#FF3B1E":"#AAA",borderBottom:`3px solid ${brandType===t?"#FF3B1E":"transparent"}`,marginBottom:"-2px",cursor:"pointer"}}>
                    {t==="domestic"?"🇰🇷 국산차":"🌍 수입차"}
                  </button>
                ))}
              </div>

              {/* 세그먼트 필터 */}
              <div style={{padding:"10px",borderBottom:"1px solid #F0EEE9",display:"flex",flexWrap:"wrap",gap:"4px"}}>
                {SEGMENTS.map(s=>(
                  <button key={s} onClick={()=>setSegment(s)} style={{padding:"4px 10px",borderRadius:"100px",border:`1.5px solid ${segment===s?"#1A1A1A":"#E0DDD7"}`,background:segment===s?"#1A1A1A":"transparent",color:segment===s?"white":"#555",fontSize:"11px",fontWeight:700,cursor:"pointer"}}>
                    {s}
                  </button>
                ))}
              </div>

              {/* 검색 */}
              <div style={{padding:"10px 12px",borderBottom:"1px solid #F0EEE9"}}>
                <div style={{position:"relative"}}>
                  <Search size={13} color="#AAA" style={{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)"}}/>
                  <input type="text" placeholder="차종 검색" value={search} onChange={e=>setSearch(e.target.value)}
                    style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"8px",padding:"8px 10px 8px 28px",fontSize:"13px",background:"#FAFAF8"}}/>
                </div>
              </div>

              {/* 브랜드 목록 */}
              <div style={{maxHeight:"400px",overflowY:"auto"}}>
                {Object.keys(brandList).map(brand=>(
                  <div key={brand}>
                    <button onClick={()=>handleBrand(brand)} style={{width:"100%",padding:"10px 14px",border:"none",textAlign:"left",fontSize:"13px",fontWeight:800,background:selectedBrand===brand?"#EEF2FF":"transparent",color:selectedBrand===brand?"#1847FF":"#555",display:"flex",justifyContent:"space-between",cursor:"pointer"}}>
                      {brand} <span style={{fontSize:"11px",fontWeight:400,color:"#AAA"}}>{(brandList[brand]||[]).length}개</span>
                    </button>
                    {selectedBrand===brand && models.map(model=>(
                      <button key={model} className="mbtn" onClick={()=>setSelectedModel(model)}
                        style={{padding:"8px 22px",background:selectedModel===model?"#EEF2FF":"#F8F6F2",fontSize:"12px",fontWeight:selectedModel===model?800:600,color:selectedModel===model?"#1847FF":"#777",borderBottom:"1px solid #F0EEE9"}}>
                        {model}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>

              {/* 헤더 */}
              {car ? (
                <>
                  <div style={{background:"white",borderRadius:"18px",padding:"24px 28px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"10px"}}>
                      <div>
                        <div style={{fontSize:"12px",fontWeight:800,color:"#FF3B1E",letterSpacing:"2px",marginBottom:"6px"}}>{selectedBrand} · {car.info.bodyType} · {car.info.seats}인승</div>
                        <h2 style={{fontSize:"28px",fontWeight:800,letterSpacing:"-1px",marginBottom:"6px"}}>{selectedModel}</h2>
                        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                          <span style={{background:"#EEF2FF",color:"#1847FF",padding:"4px 12px",borderRadius:"100px",fontSize:"12px",fontWeight:800}}>{car.info.segment}</span>
                          <span style={{background:"#F0EEE9",color:"#555",padding:"4px 12px",borderRadius:"100px",fontSize:"12px",fontWeight:700}}>{car.specs.fuelType}</span>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:"12px",color:"#AAA",fontWeight:400,marginBottom:"3px"}}>출고가 (시작가)</div>
                        <div style={{fontSize:"28px",fontWeight:800,color:"#FF3B1E",letterSpacing:"-1px"}}>{car.grades[0].price.toLocaleString()}<span style={{fontSize:"13px",color:"#AAA",fontWeight:700}}>만원~</span></div>
                      </div>
                    </div>
                  </div>

                  {/* 등급별 출고가 */}
                  <div style={{background:"white",borderRadius:"18px",padding:"22px 28px"}}>
                    <div style={{fontSize:"15px",fontWeight:800,marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
                      <div style={{width:"8px",height:"8px",background:"#FF3B1E",borderRadius:"50%"}}/> 등급별 출고가
                    </div>
                    {car.grades.map((g,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<car.grades.length-1?"1px solid #F0EEE9":"none"}}>
                        <div>
                          <div style={{fontSize:"15px",fontWeight:800}}>{g.name}</div>
                          <div style={{fontSize:"12px",color:"#AAA",fontWeight:400,marginTop:"2px"}}>{g.engine} · {g.power}마력 · {g.torque}kg·m · {g.efficiency}{car.specs.fuelType==="전기"?"":"/ℓ"}</div>
                        </div>
                        <div style={{fontSize:"20px",fontWeight:800,color:"#FF3B1E"}}>{g.price.toLocaleString()}<span style={{fontSize:"12px",color:"#AAA"}}>만~</span></div>
                      </div>
                    ))}
                  </div>

                  {/* 주요 스펙 */}
                  <div style={{background:"white",borderRadius:"18px",padding:"22px 28px"}}>
                    <div style={{fontSize:"15px",fontWeight:800,marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
                      <div style={{width:"8px",height:"8px",background:"#1847FF",borderRadius:"50%"}}/> 주요 스펙
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0"}}>
                      {[
                        ["배기량",car.specs.displacement?`${car.specs.displacement.toLocaleString()}cc`:"해당없음(전기)"],
                        ["구동방식",car.specs.drive],
                        ["변속기",car.specs.transmission],
                        ["제로백",car.specs.zero100],
                        ["최고속도",`${car.specs.topSpeed}km/h`],
                        ["공차중량",`${car.specs.curbWeight.toLocaleString()}kg`],
                        ["전장",`${car.specs.length}mm`],
                        ["전폭",`${car.specs.width}mm`],
                        ["전고",`${car.specs.height}mm`],
                        ["휠베이스",`${car.specs.wheelbase}mm`],
                      ].map(([l,v])=>(
                        <div key={l as string} className="spec-row" style={{paddingRight:"16px"}}>
                          <span style={{fontSize:"13px",color:"#888",fontWeight:400}}>{l}</span>
                          <span style={{fontSize:"13px",fontWeight:800}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 자동차세 + 보험 */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
                    <div style={{background:"white",borderRadius:"18px",padding:"20px 22px"}}>
                      <div style={{fontSize:"15px",fontWeight:800,marginBottom:"10px"}}>💰 연간 자동차세</div>
                      <div style={{fontSize:"28px",fontWeight:800,color:"#1847FF",marginBottom:"4px"}}>{car.tax.annualTax.toLocaleString()}원</div>
                      <div style={{fontSize:"12px",color:"#AAA",fontWeight:400,lineHeight:1.65}}>
                        {car.specs.fuelType==="전기"?"전기차 정액 13만원":"배기량 기준 산정"}
                      </div>
                    </div>
                    <div style={{background:"white",borderRadius:"18px",padding:"20px 22px"}}>
                      <div style={{fontSize:"15px",fontWeight:800,marginBottom:"10px"}}>🛡️ 보험 종류</div>
                      <div style={{fontSize:"15px",fontWeight:800,marginBottom:"4px"}}>{car.tax.insuranceType}</div>
                      <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>
                        {car.tax.surcharge?"⚠️ 고성능 할증 대상":"일반 보험료 적용"}
                      </div>
                    </div>
                  </div>

                  {/* 용어 설명 */}
                  <div style={{background:"#EEF2FF",border:"1px solid #B8C8FF",borderRadius:"18px",padding:"20px 24px"}}>
                    <div style={{fontSize:"15px",fontWeight:800,marginBottom:"14px",color:"#1847FF"}}>📖 용어 설명</div>
                    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                      {[
                        ["IVT (무단변속기)","기어 단수 없이 무한히 변속비가 변하는 방식. 연비가 좋고 부드럽지만 스포티한 느낌은 적어요."],
                        ["DCT (이중접속변속기)","두 개의 클러치가 번갈아 작동해 변속이 빠르고 연비도 좋아요. K3·아반떼의 1.6T에 주로 쓰여요."],
                        ["T-GDi","터보(Turbo) + 직분사(GDi) 엔진. 작은 배기량에서도 높은 출력을 내는 다운사이징 엔진이에요."],
                        ["HEV (하이브리드)","엔진+전기모터 조합. 전기만으로는 못 달리지만 연비가 크게 향상돼요. 충전 불필요."],
                        ["PHEV (플러그인 하이브리드)","충전 가능한 하이브리드. 단거리는 전기로만, 장거리는 엔진과 병행해요."],
                        ["FF/RWD/AWD","FF=앞바퀴굴림(연비좋음), RWD=뒷바퀴굴림(스포티), AWD=네바퀴굴림(안정적, 연비낮음)."],
                        ["공차중량","연료·냉각수 포함하고 승객·화물 없는 차량 무게예요. 무거울수록 연비·가속에 불리해요."],
                        ["E-GMP","현대·기아 전기차 전용 플랫폼. 아이오닉5·EV6에 적용돼 700V 초급속 충전을 지원해요."],
                      ].map(([term, def]) => (
                        <div key={term as string} style={{fontSize:"13px",lineHeight:1.7}}>
                          <span style={{fontWeight:800,color:"#1847FF"}}>{term}</span>
                          <span style={{color:"#555",fontWeight:400}}> — {def}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 고질병·주의사항 */}
                  {CAR_ISSUES[selectedModel] && (
                    <div style={{background:"white",borderRadius:"18px",padding:"22px 28px"}}>
                      <div style={{fontSize:"15px",fontWeight:800,marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
                        <div style={{width:"8px",height:"8px",background:"#E24B4A",borderRadius:"50%"}}/> 고질병·주의사항
                      </div>
                      <div style={{background:"#FFF0ED",border:"1px solid #FFB8A8",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",fontSize:"12px",color:"#CC2200",fontWeight:400}}>
                        ⚠️ 개인 경험 기반 정보예요. 모든 차량에 해당하지 않을 수 있어요.
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                        <div>
                          <div style={{fontSize:"13px",fontWeight:800,marginBottom:"6px"}}>차량 고질병</div>
                          {CAR_ISSUES[selectedModel].issues.map((issue,i)=>(
                            <div key={i} style={{fontSize:"13px",color:"#555",padding:"5px 0",borderBottom:"1px solid #F0EEE9",fontWeight:400}}>• {issue}</div>
                          ))}
                        </div>
                        {CAR_ISSUES[selectedModel].fuelIssues && (
                          <div>
                            <div style={{fontSize:"13px",fontWeight:800,marginBottom:"6px"}}>연료별 주의사항</div>
                            {CAR_ISSUES[selectedModel].fuelIssues?.map((fi,i)=>(
                              <div key={i} style={{fontSize:"13px",color:"#555",padding:"5px 0",borderBottom:"1px solid #F0EEE9",fontWeight:400}}>• {fi}</div>
                            ))}
                          </div>
                        )}
                        {CAR_ISSUES[selectedModel].yearIssues && (
                          <div>
                            <div style={{fontSize:"13px",fontWeight:800,marginBottom:"6px"}}>연도별 이슈</div>
                            {CAR_ISSUES[selectedModel].yearIssues?.map((yi,i)=>(
                              <div key={i} style={{display:"flex",gap:"8px",padding:"5px 0",borderBottom:"1px solid #F0EEE9",fontSize:"13px"}}>
                                <span style={{fontWeight:800,color:"#FF3B1E",flexShrink:0}}>{yi.year}</span>
                                <span style={{color:"#555",fontWeight:400}}>{yi.issue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 세대 히스토리 */}
                  {GENERATION_HISTORY[selectedModel] && (
                    <div style={{background:"white",borderRadius:"18px",padding:"22px 28px"}}>
                      <div style={{fontSize:"15px",fontWeight:800,marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
                        <div style={{width:"8px",height:"8px",background:"#E8A020",borderRadius:"50%"}}/> 세대 히스토리
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:"0"}}>
                        {GENERATION_HISTORY[selectedModel].map((h,i)=>(
                          <div key={i} style={{display:"flex",gap:"14px",padding:"10px 0",borderBottom:i<GENERATION_HISTORY[selectedModel].length-1?"1px solid #F0EEE9":"none",alignItems:"flex-start"}}>
                            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:i===0?"#FF3B1E":"#E0DDD7",flexShrink:0,marginTop:"4px"}}/>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                                <span style={{fontSize:"14px",fontWeight:i===0?800:600,color:i===0?"#1A1A1A":"#888"}}>{h.gen}</span>
                                <span style={{background:"#F0EEE9",color:"#888",padding:"2px 8px",borderRadius:"100px",fontSize:"11px",fontWeight:700}}>{h.code}</span>
                              </div>
                              <div style={{fontSize:"12px",color:"#AAA",marginTop:"2px",fontWeight:400}}>{h.period}{h.note?" · "+h.note:""}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 정보 수정 요청 - 하단 */}
                  <div style={{background:"white",borderRadius:"18px",padding:"20px 24px"}}>
                    <div style={{fontSize:"13px",color:"#AAA",textAlign:"center",marginBottom:"12px",fontWeight:400,lineHeight:1.65}}>
                      관리자도 사람이에요, AI도 기계에요. 사람과 기계는 다 실수해요 (데헷) 😅<br/>
                      잘못된 정보를 발견하시면 알려주세요!
                    </div>
                    <button onClick={()=>setShowReport(!showReport)}
                      style={{background:"#F8F6F2",border:"1.5px solid #E0DDD7",padding:"11px 18px",borderRadius:"10px",fontSize:"13px",fontWeight:700,color:"#555",display:"flex",alignItems:"center",gap:"6px",width:"100%",justifyContent:"center",cursor:"pointer"}}>
                      <AlertCircle size={14}/> 앗, 정보가 틀렸어요! 수정 요청하기
                    </button>
                    {showReport && (
                      <div style={{marginTop:"14px"}}>
                        <div style={{background:"#FFF8EC",border:"1px solid #FFD89A",borderRadius:"10px",padding:"10px 14px",marginBottom:"12px",fontSize:"12px",color:"#7A5500",lineHeight:1.65,fontWeight:400}}>
                          ⚠️ 스팸성 신고는 수정요청이 거부될 수 있으며, 누적 불량접수 3회 이상 시 수정요청이 제한돼요.
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                          <div>
                            <label style={{fontSize:"13px",fontWeight:800,display:"block",marginBottom:"5px"}}>틀린 내용 <span style={{color:"#FF3B1E"}}>*</span></label>
                            <textarea rows={2} placeholder="어떤 정보가 틀렸나요?" value={reportForm.wrongInfo} onChange={e=>setReportForm(p=>({...p,wrongInfo:e.target.value}))}
                              style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"10px 14px",fontSize:"14px",resize:"none",background:"#FAFAF8"}}/>
                          </div>
                          <div>
                            <label style={{fontSize:"13px",fontWeight:800,display:"block",marginBottom:"5px"}}>정확한 내용 <span style={{color:"#FF3B1E"}}>*</span></label>
                            <textarea rows={2} placeholder="올바른 정보를 입력해주세요" value={reportForm.correctInfo} onChange={e=>setReportForm(p=>({...p,correctInfo:e.target.value}))}
                              style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"10px 14px",fontSize:"14px",resize:"none",background:"#FAFAF8"}}/>
                          </div>
                          <button onClick={handleReport} style={{background:"#1847FF",color:"white",border:"none",padding:"12px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>접수하기</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 픽스카 매물 */}
                  <div style={{background:"#FF3B1E",borderRadius:"18px",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:"15px",fontWeight:800,color:"white",marginBottom:"3px"}}>{selectedModel} 중고차 보기</div>
                      <div style={{fontSize:"13px",color:"rgba(255,255,255,0.7)",fontWeight:400}}>FIX 정찰가 매물 바로 확인</div>
                    </div>
                    <a href="/cars"><button style={{background:"white",color:"#FF3B1E",border:"none",padding:"11px 20px",borderRadius:"100px",fontSize:"13px",fontWeight:800,cursor:"pointer"}}>매물 보기 →</button></a>
                  </div>
                </>
              ) : (
                <div style={{background:"white",borderRadius:"18px",padding:"60px",textAlign:"center",color:"#AAA"}}>
                  <div style={{fontSize:"32px",marginBottom:"14px"}}>📚</div>
                  <div style={{fontSize:"16px",fontWeight:800}}>죄송합니다 😅 아직 정보를 모으고 있어요! 나중에 확인해주세요!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
