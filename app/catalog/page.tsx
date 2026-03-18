"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Search, ChevronDown, AlertCircle, CheckCircle, X } from "lucide-react";

const DOMESTIC_BRANDS: Record<string, string[]> = {
  "현대": ["아반떼","쏘나타","그랜저","투싼","싼타페","팰리세이드","아이오닉5","아이오닉6","넥쏘","코나","베뉴","스타리아","포터"],
  "기아": ["K3","K5","K8","K9","스포티지","쏘렌토","모하비","카니발","EV6","EV9","니로","레이","봉고"],
  "제네시스": ["G70","G80","G90","GV70","GV80","GV90"],
  "KG모빌리티": ["티볼리","코란도","렉스턴","무쏘","토레스","토레스EVX"],
  "르노코리아": ["QM6","QM5","SM6","XM3","조에"],
  "쉐보레": ["트레일블레이저","트랙스","이쿼녹스","말리부","스파크","볼트EV","타호"],
};

const IMPORT_BRANDS: Record<string, string[]> = {
  "BMW": ["1시리즈","2시리즈","3시리즈","4시리즈","5시리즈","7시리즈","X1","X3","X5","X7","i4","iX","M3","M5"],
  "메르세데스-벤츠": ["A클래스","C클래스","E클래스","S클래스","GLA","GLB","GLC","GLE","GLS","EQA","EQB","EQC","EQS"],
  "아우디": ["A3","A4","A6","A8","Q3","Q5","Q7","Q8","e-tron","RS6"],
  "폭스바겐": ["골프","파사트","티구안","투아렉","ID.4","ID.3"],
  "볼보": ["S60","S90","V60","XC40","XC60","XC90","EX40","EX90"],
  "포르쉐": ["카이엔","마칸","타이칸","파나메라","718","911"],
  "렉서스": ["ES","LS","NX","RX","UX","LX","LC","IS"],
  "토요타": ["캠리","아발론","RAV4","하이랜더","프리우스","C-HR","크라운","bZ4X"],
  "혼다": ["어코드","CR-V","HR-V","ZR-V","파일럿","오딧세이","시빅"],
  "테슬라": ["모델3","모델Y","모델S","모델X","사이버트럭"],
  "지프": ["랭글러","체로키","그랜드체로키","컴패스","레니게이드","글래디에이터"],
  "랜드로버": ["디스커버리","디펜더","레인지로버","레인지로버 스포츠","레인지로버 이보크"],
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
    tax:{annualTax:183700,insuranceType:"소형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"준중형"},
  },
  "쏘나타": {
    grades:[{name:"스마트",price:2780,engine:"2.0 MPI",power:160,torque:20.0,efficiency:"12.8"},{name:"더 엣지",price:3380,engine:"1.6 T-GDi",power:180,torque:27.0,efficiency:"11.8"},{name:"하이브리드",price:3240,engine:"2.0 HEV",power:152,torque:19.3,efficiency:"20.1"}],
    specs:{displacement:1999,fuelType:"가솔린/하이브리드",transmission:"8단AT",drive:"FF",zero100:"8.5초",topSpeed:220,curbWeight:1505,length:4900,width:1860,height:1445,wheelbase:2840},
    tax:{annualTax:230200,insuranceType:"중형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"중형"},
  },
  "그랜저": {
    grades:[{name:"프리미엄",price:3964,engine:"2.5 GDi",power:198,torque:25.3,efficiency:"11.4"},{name:"캘리그래피",price:4855,engine:"3.5 GDi",power:300,torque:36.2,efficiency:"9.8"},{name:"하이브리드",price:4250,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"17.8"}],
    specs:{displacement:2497,fuelType:"가솔린/하이브리드",transmission:"8단AT",drive:"FF/AWD",zero100:"7.0초",topSpeed:230,curbWeight:1680,length:5035,width:1880,height:1470,wheelbase:2895},
    tax:{annualTax:286500,insuranceType:"대형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"대형"},
  },
  "투싼": {
    grades:[{name:"스마트",price:2699,engine:"2.0 MPI",power:156,torque:19.6,efficiency:"12.2"},{name:"인스퍼레이션",price:3260,engine:"1.6 T-GDi",power:180,torque:27.0,efficiency:"13.0"},{name:"하이브리드",price:3199,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"16.2"}],
    specs:{displacement:1598,fuelType:"가솔린/하이브리드/디젤",transmission:"8단AT/7DCT",drive:"FF/AWD",zero100:"8.5초",topSpeed:205,curbWeight:1610,length:4630,width:1865,height:1665,wheelbase:2755},
    tax:{annualTax:183700,insuranceType:"중형 RV",surcharge:false},
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
    tax:{annualTax:433650,insuranceType:"대형 RV",surcharge:false},
    info:{bodyType:"SUV",seats:8,segment:"SUV/RV"},
  },
  "K3": {
    grades:[{name:"트렌디",price:1831,engine:"1.6 MPI",power:123,torque:15.7,efficiency:"14.3"},{name:"프레스티지",price:2050,engine:"1.6 MPI",power:123,torque:15.7,efficiency:"14.3"},{name:"GT",price:2350,engine:"1.6 T-GDi",power:204,torque:27.0,efficiency:"12.5"}],
    specs:{displacement:1598,fuelType:"가솔린",transmission:"IVT/7DCT",drive:"FF",zero100:"7.9초",topSpeed:205,curbWeight:1320,length:4640,width:1800,height:1440,wheelbase:2700},
    tax:{annualTax:183700,insuranceType:"소형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"준중형"},
  },
  "K5": {
    grades:[{name:"트렌디",price:2610,engine:"1.6 T-GDi",power:180,torque:27.0,efficiency:"13.2"},{name:"시그니처",price:3240,engine:"2.0 T-GDi",power:248,torque:36.0,efficiency:"11.2"},{name:"하이브리드",price:3045,engine:"2.0 HEV",power:152,torque:19.3,efficiency:"20.3"}],
    specs:{displacement:1591,fuelType:"가솔린/하이브리드",transmission:"8단AT",drive:"FF/AWD",zero100:"7.5초",topSpeed:230,curbWeight:1490,length:4905,width:1860,height:1445,wheelbase:2850},
    tax:{annualTax:182400,insuranceType:"중형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"중형"},
  },
  "쏘렌토": {
    grades:[{name:"트렌디",price:3368,engine:"2.0 T-GDi",power:237,torque:35.7,efficiency:"11.5"},{name:"시그니처",price:4150,engine:"1.6 T-HEV",power:230,torque:35.0,efficiency:"16.0"},{name:"PHEV",price:4790,engine:"1.6 T-PHEV",power:265,torque:35.0,efficiency:"54.7km"}],
    specs:{displacement:1999,fuelType:"가솔린/하이브리드/PHEV",transmission:"8단AT",drive:"FF/AWD",zero100:"7.0초",topSpeed:210,curbWeight:1840,length:4810,width:1900,height:1700,wheelbase:2815},
    tax:{annualTax:229800,insuranceType:"중형 RV",surcharge:false},
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
    tax:{annualTax:286500,insuranceType:"대형 승용",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"대형"},
  },
  "3시리즈": {
    grades:[{name:"320i",price:5290,engine:"2.0 터보",power:184,torque:30.6,efficiency:"12.5"},{name:"330i",price:6090,engine:"2.0 터보",power:258,torque:40.8,efficiency:"11.6"},{name:"M340i",price:8120,engine:"3.0 직6 터보",power:387,torque:51.0,efficiency:"10.1"}],
    specs:{displacement:1998,fuelType:"가솔린",transmission:"8단AT",drive:"RWD/AWD",zero100:"5.8초",topSpeed:250,curbWeight:1540,length:4715,width:1825,height:1435,wheelbase:2850},
    tax:{annualTax:229800,insuranceType:"중형 승용(수입)",surcharge:false},
    info:{bodyType:"세단",seats:5,segment:"수입차"},
  },
  "C클래스": {
    grades:[{name:"C 200",price:6100,engine:"1.5 터보+마일드HEV",power:204,torque:30.0,efficiency:"13.2"},{name:"C 300",price:7200,engine:"2.0 터보",power:258,torque:40.0,efficiency:"11.8"},{name:"AMG C 43",price:9800,engine:"2.0 터보+전기모터",power:408,torque:50.0,efficiency:"10.5"}],
    specs:{displacement:1497,fuelType:"가솔린/마일드HEV",transmission:"9단AT",drive:"RWD/AWD",zero100:"6.1초",topSpeed:250,curbWeight:1640,length:4751,width:1820,height:1438,wheelbase:2865},
    tax:{annualTax:171600,insuranceType:"중형 승용(수입)",surcharge:false},
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
                  <div style={{fontSize:"16px",fontWeight:800}}>좌측에서 차량을 선택해주세요</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
