"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Search, ChevronDown, AlertCircle, CheckCircle, X } from "lucide-react";

const CAR_DB: Record<string, Record<string, {
  grades: { name: string; price: number; engine: string; power: number; torque: number; efficiency: string; }[];
  specs: { displacement: number; fuelType: string; transmission: string; drive: string; zero100: string; topSpeed: number; curbWeight: number; length: number; width: number; height: number; wheelbase: number; };
  tax: { annualTax: number; insuranceType: string; surcharge: boolean; };
  info: { bodyType: string; seats: number; segment: string; };
}>> = {
  "현대": {
    "아반떼 CN7": {
      grades: [
        { name: "스마트", price: 2015, engine: "1.6 MPI", power: 123, torque: 15.7, efficiency: "14.2" },
        { name: "프리미엄", price: 2199, engine: "1.6 MPI", power: 123, torque: 15.7, efficiency: "14.2" },
        { name: "인스퍼레이션", price: 2399, engine: "1.6 T-GDi", power: 203, torque: 27.0, efficiency: "12.2" },
        { name: "N Line", price: 2550, engine: "1.6 T-GDi", power: 203, torque: 27.0, efficiency: "12.2" },
      ],
      specs: { displacement: 1598, fuelType: "가솔린", transmission: "자동 IVT/7DCT", drive: "FF", zero100: "7.7초", topSpeed: 210, curbWeight: 1340, length: 4650, width: 1825, height: 1415, wheelbase: 2720 },
      tax: { annualTax: 183700, insuranceType: "소형 승용", surcharge: false },
      info: { bodyType: "세단", seats: 5, segment: "C세그먼트 (준중형)" },
    },
    "쏘나타 DN8": {
      grades: [
        { name: "스마트", price: 2780, engine: "2.0 MPI", power: 160, torque: 20.0, efficiency: "12.8" },
        { name: "프리미엄", price: 3020, engine: "2.0 MPI", power: 160, torque: 20.0, efficiency: "12.8" },
        { name: "더 엣지", price: 3380, engine: "1.6 T-GDi", power: 180, torque: 27.0, efficiency: "11.8" },
        { name: "하이브리드", price: 3240, engine: "2.0 HEV", power: 152, torque: 19.3, efficiency: "20.1" },
      ],
      specs: { displacement: 1999, fuelType: "가솔린/하이브리드", transmission: "자동 8단/6단", drive: "FF", zero100: "8.5초", topSpeed: 220, curbWeight: 1505, length: 4900, width: 1860, height: 1445, wheelbase: 2840 },
      tax: { annualTax: 230200, insuranceType: "중형 승용", surcharge: false },
      info: { bodyType: "세단", seats: 5, segment: "D세그먼트 (중형)" },
    },
    "투싼 NX4": {
      grades: [
        { name: "스마트", price: 2699, engine: "2.0 MPI", power: 156, torque: 19.6, efficiency: "12.2" },
        { name: "프리미엄", price: 2960, engine: "1.6 T-GDi", power: 180, torque: 27.0, efficiency: "13.0" },
        { name: "인스퍼레이션", price: 3260, engine: "1.6 T-GDi", power: 180, torque: 27.0, efficiency: "13.0" },
        { name: "하이브리드", price: 3199, engine: "1.6 T-HEV", power: 230, torque: 35.0, efficiency: "16.2" },
      ],
      specs: { displacement: 1598, fuelType: "가솔린/하이브리드/디젤", transmission: "자동 8단/7DCT", drive: "FF/AWD", zero100: "8.5초", topSpeed: 205, curbWeight: 1610, length: 4630, width: 1865, height: 1665, wheelbase: 2755 },
      tax: { annualTax: 183700, insuranceType: "중형 RV", surcharge: false },
      info: { bodyType: "SUV", seats: 5, segment: "C세그먼트 SUV (소형 SUV)" },
    },
    "아이오닉 5": {
      grades: [
        { name: "스탠다드 2WD", price: 4990, engine: "전기 58kWh", power: 170, torque: 35.0, efficiency: "5.1km/kWh" },
        { name: "롱레인지 2WD", price: 5400, engine: "전기 77.4kWh", power: 217, torque: 35.0, efficiency: "6.1km/kWh" },
        { name: "롱레인지 AWD", price: 5820, engine: "전기 77.4kWh", power: 325, torque: 60.5, efficiency: "5.1km/kWh" },
      ],
      specs: { displacement: 0, fuelType: "전기", transmission: "단속기", drive: "RR/AWD", zero100: "5.1초", topSpeed: 185, curbWeight: 2100, length: 4635, width: 1890, height: 1605, wheelbase: 3000 },
      tax: { annualTax: 130000, insuranceType: "중형 승용 (전기)", surcharge: false },
      info: { bodyType: "SUV", seats: 5, segment: "E세그먼트 (전기 SUV)" },
    },
    "팰리세이드": {
      grades: [
        { name: "프리미엄", price: 4230, engine: "3.8 GDi V6", power: 295, torque: 36.2, efficiency: "8.4" },
        { name: "캘리그래피", price: 5150, engine: "3.8 GDi V6", power: 295, torque: 36.2, efficiency: "8.4" },
        { name: "디젤 프리미엄", price: 4380, engine: "2.2 CRDi", power: 202, torque: 45.0, efficiency: "13.0" },
      ],
      specs: { displacement: 3778, fuelType: "가솔린/디젤", transmission: "자동 8단", drive: "FF/AWD", zero100: "7.5초", topSpeed: 210, curbWeight: 2185, length: 4995, width: 1975, height: 1750, wheelbase: 2900 },
      tax: { annualTax: 433650, insuranceType: "대형 RV", surcharge: false },
      info: { bodyType: "SUV", seats: 8, segment: "E세그먼트 SUV (대형 SUV)" },
    },
  },
  "기아": {
    "K3": {
      grades: [
        { name: "트렌디", price: 1831, engine: "1.6 MPI", power: 123, torque: 15.7, efficiency: "14.3" },
        { name: "프레스티지", price: 2050, engine: "1.6 MPI", power: 123, torque: 15.7, efficiency: "14.3" },
        { name: "GT", price: 2350, engine: "1.6 T-GDi", power: 204, torque: 27.0, efficiency: "12.5" },
      ],
      specs: { displacement: 1598, fuelType: "가솔린", transmission: "자동 IVT/7DCT", drive: "FF", zero100: "7.9초", topSpeed: 205, curbWeight: 1320, length: 4640, width: 1800, height: 1440, wheelbase: 2700 },
      tax: { annualTax: 183700, insuranceType: "소형 승용", surcharge: false },
      info: { bodyType: "세단", seats: 5, segment: "C세그먼트 (준중형)" },
    },
    "K5": {
      grades: [
        { name: "트렌디", price: 2610, engine: "1.6 T-GDi", power: 180, torque: 27.0, efficiency: "13.2" },
        { name: "프레스티지", price: 2890, engine: "1.6 T-GDi", power: 180, torque: 27.0, efficiency: "13.2" },
        { name: "시그니처", price: 3240, engine: "2.0 T-GDi", power: 248, torque: 36.0, efficiency: "11.2" },
        { name: "하이브리드", price: 3045, engine: "2.0 HEV", power: 152, torque: 19.3, efficiency: "20.3" },
      ],
      specs: { displacement: 1591, fuelType: "가솔린/하이브리드", transmission: "자동 8단", drive: "FF/AWD", zero100: "7.5초", topSpeed: 230, curbWeight: 1490, length: 4905, width: 1860, height: 1445, wheelbase: 2850 },
      tax: { annualTax: 182400, insuranceType: "중형 승용", surcharge: false },
      info: { bodyType: "세단", seats: 5, segment: "D세그먼트 (중형)" },
    },
    "쏘렌토 MQ4": {
      grades: [
        { name: "트렌디", price: 3368, engine: "2.0 T-GDi", power: 237, torque: 35.7, efficiency: "11.5" },
        { name: "프레스티지", price: 3720, engine: "2.0 T-GDi", power: 237, torque: 35.7, efficiency: "11.5" },
        { name: "시그니처", price: 4150, engine: "1.6 T-HEV", power: 230, torque: 35.0, efficiency: "16.0" },
        { name: "PHEV", price: 4790, engine: "1.6 T-PHEV", power: 265, torque: 35.0, efficiency: "54.7km/ℓ" },
      ],
      specs: { displacement: 1999, fuelType: "가솔린/하이브리드/PHEV/디젤", transmission: "자동 8단", drive: "FF/AWD", zero100: "7.0초", topSpeed: 210, curbWeight: 1840, length: 4810, width: 1900, height: 1700, wheelbase: 2815 },
      tax: { annualTax: 229800, insuranceType: "중형 RV", surcharge: false },
      info: { bodyType: "SUV", seats: 7, segment: "D세그먼트 SUV (중형 SUV)" },
    },
    "EV6": {
      grades: [
        { name: "스탠다드 2WD", price: 5192, engine: "전기 58kWh", power: 170, torque: 35.0, efficiency: "5.0km/kWh" },
        { name: "롱레인지 2WD", price: 5567, engine: "전기 77.4kWh", power: 229, torque: 35.0, efficiency: "6.0km/kWh" },
        { name: "롱레인지 AWD", price: 6010, engine: "전기 77.4kWh", power: 325, torque: 60.5, efficiency: "5.0km/kWh" },
        { name: "GT", price: 6900, engine: "전기 77.4kWh", power: 585, torque: 75.0, efficiency: "4.5km/kWh" },
      ],
      specs: { displacement: 0, fuelType: "전기", transmission: "단속기", drive: "RR/AWD", zero100: "3.5초", topSpeed: 260, curbWeight: 2055, length: 4695, width: 1880, height: 1550, wheelbase: 2900 },
      tax: { annualTax: 130000, insuranceType: "중형 승용 (전기)", surcharge: false },
      info: { bodyType: "크로스오버", seats: 5, segment: "E세그먼트 (전기 CUV)" },
    },
  },
  "제네시스": {
    "G80": {
      grades: [
        { name: "2.5T 프리미엄", price: 6130, engine: "2.5 T-GDi", power: 304, torque: 43.0, efficiency: "10.0" },
        { name: "2.5T 시그니처", price: 7040, engine: "2.5 T-GDi", power: 304, torque: 43.0, efficiency: "10.0" },
        { name: "3.5T 프리미엄", price: 7660, engine: "3.5 T-GDi", power: 380, torque: 54.0, efficiency: "8.8" },
        { name: "전동화 시그니처", price: 8380, engine: "전기 87.2kWh", power: 369, torque: 70.0, efficiency: "4.5km/kWh" },
      ],
      specs: { displacement: 2497, fuelType: "가솔린/전기", transmission: "자동 8단", drive: "RWD/AWD", zero100: "5.9초", topSpeed: 240, curbWeight: 1920, length: 5015, width: 1925, height: 1465, wheelbase: 3010 },
      tax: { annualTax: 286500, insuranceType: "대형 승용", surcharge: false },
      info: { bodyType: "세단", seats: 5, segment: "E세그먼트 (대형)" },
    },
    "GV80": {
      grades: [
        { name: "2.5T 프리미엄", price: 7330, engine: "2.5 T-GDi", power: 304, torque: 43.0, efficiency: "9.5" },
        { name: "2.5T 시그니처", price: 8290, engine: "2.5 T-GDi", power: 304, torque: 43.0, efficiency: "9.5" },
        { name: "3.5T 시그니처", price: 9200, engine: "3.5 T-GDi", power: 380, torque: 54.0, efficiency: "8.2" },
      ],
      specs: { displacement: 2497, fuelType: "가솔린/디젤", transmission: "자동 8단", drive: "AWD", zero100: "6.2초", topSpeed: 235, curbWeight: 2200, length: 4945, width: 1975, height: 1715, wheelbase: 2955 },
      tax: { annualTax: 286500, insuranceType: "대형 RV", surcharge: false },
      info: { bodyType: "SUV", seats: 5, segment: "F세그먼트 SUV (럭셔리 SUV)" },
    },
  },
  "BMW": {
    "3시리즈 (G20)": {
      grades: [
        { name: "320i", price: 5290, engine: "2.0 터보", power: 184, torque: 30.6, efficiency: "12.5" },
        { name: "330i", price: 6090, engine: "2.0 터보", power: 258, torque: 40.8, efficiency: "11.6" },
        { name: "M340i xDrive", price: 8120, engine: "3.0 터보 직6", power: 387, torque: 51.0, efficiency: "10.1" },
      ],
      specs: { displacement: 1998, fuelType: "가솔린", transmission: "자동 8단", drive: "RWD/AWD", zero100: "5.8초", topSpeed: 250, curbWeight: 1540, length: 4715, width: 1825, height: 1435, wheelbase: 2850 },
      tax: { annualTax: 229800, insuranceType: "중형 승용 (수입)", surcharge: false },
      info: { bodyType: "세단", seats: 5, segment: "D세그먼트 (준대형 수입)" },
    },
    "5시리즈 (G30)": {
      grades: [
        { name: "520i", price: 7290, engine: "2.0 터보", power: 184, torque: 30.6, efficiency: "12.0" },
        { name: "530i", price: 8370, engine: "2.0 터보", power: 258, torque: 40.8, efficiency: "11.3" },
        { name: "540i xDrive", price: 9900, engine: "3.0 터보 직6", power: 340, torque: 45.0, efficiency: "10.2" },
      ],
      specs: { displacement: 1998, fuelType: "가솔린", transmission: "자동 8단", drive: "RWD/AWD", zero100: "6.1초", topSpeed: 250, curbWeight: 1680, length: 4965, width: 1870, height: 1480, wheelbase: 2975 },
      tax: { annualTax: 229800, insuranceType: "대형 승용 (수입)", surcharge: false },
      info: { bodyType: "세단", seats: 5, segment: "E세그먼트 (대형 수입)" },
    },
  },
  "메르세데스-벤츠": {
    "C클래스 (W206)": {
      grades: [
        { name: "C 200", price: 6100, engine: "1.5 터보+마일드하이브리드", power: 204, torque: 30.0, efficiency: "13.2" },
        { name: "C 300", price: 7200, engine: "2.0 터보", power: 258, torque: 40.0, efficiency: "11.8" },
        { name: "AMG C 43", price: 9800, engine: "2.0 터보+전기모터", power: 408, torque: 50.0, efficiency: "10.5" },
      ],
      specs: { displacement: 1497, fuelType: "가솔린/마일드하이브리드", transmission: "자동 9단", drive: "RWD/AWD", zero100: "6.1초", topSpeed: 250, curbWeight: 1640, length: 4751, width: 1820, height: 1438, wheelbase: 2865 },
      tax: { annualTax: 171600, insuranceType: "중형 승용 (수입)", surcharge: false },
      info: { bodyType: "세단", seats: 5, segment: "D세그먼트 (수입 중형)" },
    },
  },
};

const SEGMENTS_INFO: Record<string, string> = {
  "C세그먼트 (준중형)": "경형(800cc이하)·소형(1600cc이하) 다음 단계. 자동차세 최저 구간, 보험료 저렴.",
  "D세그먼트 (중형)": "가장 인기있는 세그먼트. 자동차세 중간 구간.",
  "E세그먼트 (대형)": "대형 세단. 자동차세 높음, 보험료도 높아짐.",
  "C세그먼트 SUV (소형 SUV)": "도심형 소형 SUV. 자동차세는 배기량 기준.",
  "D세그먼트 SUV (중형 SUV)": "가족용 중형 SUV. 7인승 이상 시 보험 할인 가능.",
  "E세그먼트 SUV (대형 SUV)": "대형 SUV. 자동차세·보험료 모두 높음.",
  "F세그먼트 SUV (럭셔리 SUV)": "최고급 SUV. 자동차세·보험료 최고 구간.",
  "E세그먼트 (전기 SUV)": "전기차는 배기량 0 → 연간 자동차세 13만원 정액.",
  "E세그먼트 (대형 프리미엄)": "대형 세단. 수입차는 보험료 할증 가능.",
  "E세그먼트 (대형 CUV)": "전기 크로스오버. 자동차세 13만원 정액.",
  "D세그먼트 (준대형 수입)": "수입 중형. 부품비 비싸 보험료 높을 수 있음.",
  "E세그먼트 (대형 수입)": "수입 대형. 보험료·수리비 국산 대비 높음.",
  "D세그먼트 (수입 중형)": "수입 중형. 보험료·수리비 국산 대비 높음.",
};

export default function CatalogPage() {
  const [selectedBrand, setSelectedBrand] = useState("현대");
  const [selectedModel, setSelectedModel] = useState("아반떼 CN7");
  const [search, setSearch] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ wrongInfo: "", correctInfo: "", phone: "" });
  const [reportSent, setReportSent] = useState(false);

  const brands = Object.keys(CAR_DB);
  const models = Object.keys(CAR_DB[selectedBrand] || {}).filter(m => m.includes(search));
  const car = CAR_DB[selectedBrand]?.[selectedModel];

  const handleBrand = (b: string) => {
    setSelectedBrand(b);
    const firstModel = Object.keys(CAR_DB[b])[0];
    setSelectedModel(firstModel);
  };

  const handleReport = async () => {
    if (!reportForm.wrongInfo || !reportForm.correctInfo) { alert("내용을 입력해주세요"); return; }
    await fetch("/api/catalog/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carModel: selectedModel, ...reportForm }),
    });
    setReportSent(true);
    setShowReport(false);
    setReportForm({ wrongInfo: "", correctInfo: "" });
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
        input,select,textarea{font-family:'NanumSquareRound',sans-serif;}
        input:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;}
        .model-btn{transition:all 0.15s;cursor:pointer;border:none;width:100%;text-align:left;}
        .model-btn:hover{background:#F0EEE9!important;}
        .brand-tab{transition:all 0.15s;cursor:pointer;border:none;}
        .brand-tab:hover{background:#F0EEE9!important;}
        .spec-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0EEE9;align-items:center;}
        @media(max-width:1024px){.layout{grid-template-columns:1fr!important;}.sidebar{display:none!important;}}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar />
        <div style={{ background:"#1A1A1A", padding:"44px 52px 36px" }}>
          <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"10px" }}>CAR CATALOG</div>
            <h1 style={{ fontSize:"clamp(24px,4vw,44px)", fontWeight:800, color:"white", letterSpacing:"-1px", marginBottom:"6px" }}>차량 카탈로그 백과사전</h1>
            <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.4)", fontWeight:400 }}>출고가 · 등급별 스펙 · 마력 · 연비 · 제로백 · 자동차세 · 보험 정보 전체</p>
          </div>
        </div>

        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"24px 32px 80px" }}>
          {reportSent && (
            <div style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", borderRadius:"12px", padding:"14px 18px", marginBottom:"16px", display:"flex", alignItems:"center", gap:"10px" }}>
              <CheckCircle size={18} color="#2D8A52" />
              <span style={{ fontSize:"14px", fontWeight:700, color:"#2D8A52" }}>정정 신고가 접수됐어요! 관리자 검토 후 반영할게요.</span>
            </div>
          )}

          <div className="layout" style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:"20px", alignItems:"start" }}>

            {/* 사이드바 */}
            <div className="sidebar" style={{ background:"white", borderRadius:"18px", overflow:"hidden", position:"sticky", top:"84px" }}>
              {/* 검색 */}
              <div style={{ padding:"12px 14px", borderBottom:"1px solid #F0EEE9" }}>
                <div style={{ position:"relative" }}>
                  <Search size={13} color="#AAA" style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)" }} />
                  <input type="text" placeholder="차종 검색" value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"8px", padding:"8px 10px 8px 28px", fontSize:"13px", background:"#FAFAF8" }} />
                </div>
              </div>
              {/* 브랜드 탭 */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", padding:"10px 12px", borderBottom:"1px solid #F0EEE9" }}>
                {brands.map(b => (
                  <button key={b} className="brand-tab" onClick={() => handleBrand(b)}
                    style={{ padding:"5px 12px", borderRadius:"100px", border:`2px solid ${selectedBrand===b?"#1A1A1A":"#E0DDD7"}`, background:selectedBrand===b?"#1A1A1A":"white", color:selectedBrand===b?"white":"#555", fontSize:"12px", fontWeight:700 }}>
                    {b}
                  </button>
                ))}
              </div>
              {/* 모델 목록 */}
              {models.map(model => (
                <button key={model} className="model-btn" onClick={() => setSelectedModel(model)}
                  style={{ padding:"11px 16px", background:selectedModel===model?"#EEF2FF":"transparent", fontSize:"13px", fontWeight:selectedModel===model?800:600, color:selectedModel===model?"#1847FF":"#555", borderBottom:"1px solid #F0EEE9" }}>
                  {model}
                </button>
              ))}
            </div>

            {/* 메인 콘텐츠 */}
            {car && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

                {/* 헤더 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"24px 28px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"12px" }}>
                    <div>
                      <div style={{ fontSize:"12px", fontWeight:800, color:"#FF3B1E", letterSpacing:"2px", marginBottom:"6px" }}>{selectedBrand} · {car.info.bodyType} · {car.info.seats}인승</div>
                      <h2 style={{ fontSize:"28px", fontWeight:800, letterSpacing:"-1px", marginBottom:"6px" }}>{selectedModel}</h2>
                      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                        <span style={{ background:"#EEF2FF", color:"#1847FF", padding:"4px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>{car.info.segment}</span>
                        <span style={{ background:"#F0EEE9", color:"#555", padding:"4px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:700 }}>{car.specs.fuelType}</span>
                        {car.tax.surcharge && <span style={{ background:"#FFF0ED", color:"#FF3B1E", padding:"4px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>⚠️ 보험 할증 대상</span>}
                      </div>
                    </div>

                  </div>
                </div>



                {/* 등급별 출고가 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"22px 28px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:"8px", height:"8px", background:"#FF3B1E", borderRadius:"50%" }} /> 등급별 출고가
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
                    {car.grades.map((grade, i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i<car.grades.length-1?"1px solid #F0EEE9":"none" }}>
                        <div>
                          <div style={{ fontSize:"15px", fontWeight:800 }}>{grade.name}</div>
                          <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400, marginTop:"2px" }}>{grade.engine} · {grade.power}마력 · 토크 {grade.torque}kg·m · 연비 {grade.efficiency}{car.specs.fuelType==="전기"?"":"km/ℓ"}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:"20px", fontWeight:800, color:"#FF3B1E" }}>{grade.price.toLocaleString()}<span style={{ fontSize:"13px", color:"#AAA", fontWeight:700 }}>만원~</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 주요 스펙 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"22px 28px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:"8px", height:"8px", background:"#1847FF", borderRadius:"50%" }} /> 주요 스펙
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0" }}>
                    {[
                      ["배기량", car.specs.displacement ? `${car.specs.displacement.toLocaleString()}cc` : "해당없음 (전기)"],
                      ["연료", car.specs.fuelType],
                      ["변속기", car.specs.transmission],
                      ["구동방식", car.specs.drive],
                      ["제로백 (0→100km/h)", car.specs.zero100],
                      ["최고속도", `${car.specs.topSpeed}km/h`],
                      ["공차중량", `${car.specs.curbWeight.toLocaleString()}kg`],
                      ["전장×전폭×전고", `${car.specs.length}×${car.specs.width}×${car.specs.height}mm`],
                      ["휠베이스", `${car.specs.wheelbase}mm`],
                      ["승차인원", `${car.info.seats}인승`],
                    ].map(([label, value]) => (
                      <div key={label as string} className="spec-row" style={{ paddingRight:"20px" }}>
                        <span style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{label}</span>
                        <span style={{ fontSize:"13px", fontWeight:800 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 자동차세 + 보험 + 차종 정보 */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
                  <div style={{ background:"white", borderRadius:"18px", padding:"20px 22px" }}>
                    <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"14px" }}>💰 자동차세</div>
                    <div style={{ fontSize:"28px", fontWeight:800, color:"#1847FF", marginBottom:"6px" }}>{car.tax.annualTax.toLocaleString()}원<span style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>/년</span></div>
                    <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400, lineHeight:1.65 }}>
                      {car.specs.fuelType === "전기" ? "전기차는 배기량 관계없이 연간 13만원 정액" : `배기량 ${car.specs.displacement.toLocaleString()}cc 기준 산정`}
                    </div>
                  </div>
                  <div style={{ background:"white", borderRadius:"18px", padding:"20px 22px" }}>
                    <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"14px" }}>🛡️ 보험 정보</div>
                    <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"8px" }}>{car.tax.insuranceType}</div>
                    <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400, lineHeight:1.65 }}>
                      {car.tax.surcharge ? "⚠️ 고성능차 보험료 할증 대상" : "일반 보험료 적용 (할증 없음)"}
                    </div>
                  </div>
                </div>

                {/* 세그먼트 설명 */}
                <div style={{ background:"#EEF2FF", border:"1px solid #B8C8FF", borderRadius:"16px", padding:"16px 20px" }}>
                  <div style={{ fontSize:"14px", fontWeight:800, color:"#1847FF", marginBottom:"6px" }}>📌 {car.info.segment} 이란?</div>
                  <div style={{ fontSize:"13px", color:"#444", lineHeight:1.7, fontWeight:400 }}>
                    {SEGMENTS_INFO[car.info.segment] || "국제 차량 분류 기준에 따른 세그먼트입니다."}
                  </div>
                </div>

                {/* 정보 수정 요청 - 하단 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"20px 24px" }}>
                  <button onClick={() => setShowReport(!showReport)}
                    style={{ background:"#F8F6F2", border:"1.5px solid #E0DDD7", padding:"11px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:700, color:"#555", display:"flex", alignItems:"center", gap:"6px", width:"100%", justifyContent:"center" }}>
                    <AlertCircle size={14} /> 앗, 정보가 틀렸어요! 수정 요청하기
                  </button>
                  {showReport && (
                    <div style={{ marginTop:"14px" }}>
                      <div style={{ background:"#FFF8EC", border:"1px solid #FFD89A", borderRadius:"10px", padding:"10px 14px", marginBottom:"12px", fontSize:"12px", color:"#7A5500", lineHeight:1.65, fontWeight:400 }}>
                        ⚠️ 스팸성 또는 정상적이지 않은 정정신고는 <strong style={{ fontWeight:800 }}>수정요청이 거부</strong>될 수 있으며, 누적 불량접수 3회 이상 시 더 이상 정보수정요청을 하실 수 없게 됩니다.
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                        <div>
                          <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>틀린 내용 <span style={{ color:"#FF3B1E" }}>*</span></label>
                          <textarea rows={2} placeholder="어떤 정보가 틀렸나요?" value={reportForm.wrongInfo} onChange={e => setReportForm(p => ({ ...p, wrongInfo: e.target.value }))}
                            style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", resize:"none", background:"#FAFAF8" }} />
                        </div>
                        <div>
                          <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>정확한 내용 <span style={{ color:"#FF3B1E" }}>*</span></label>
                          <textarea rows={2} placeholder="올바른 정보를 입력해주세요" value={reportForm.correctInfo} onChange={e => setReportForm(p => ({ ...p, correctInfo: e.target.value }))}
                            style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", resize:"none", background:"#FAFAF8" }} />
                        </div>
                        <div>
                          <label style={{ fontSize:"13px", fontWeight:800, display:"block", marginBottom:"5px" }}>연락처 (답변 받을 연락처)</label>
                          <input type="tel" placeholder="010-0000-0000" value={reportForm.phone || ""} onChange={e => setReportForm(p => ({ ...p, phone: e.target.value }))}
                            style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", background:"#FAFAF8" }} />
                        </div>
                        <button onClick={handleReport} style={{ background:"#1847FF", color:"white", border:"none", padding:"12px", borderRadius:"10px", fontSize:"14px", fontWeight:800 }}>접수하기</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 픽스카 매물 */}
                <div style={{ background:"#FF3B1E", borderRadius:"18px", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:800, color:"white", marginBottom:"3px" }}>{selectedBrand} {selectedModel} 중고차 보기</div>
                    <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.7)", fontWeight:400 }}>FIX 정찰가 매물 바로 확인</div>
                  </div>
                  <a href="/cars"><button style={{ background:"white", color:"#FF3B1E", border:"none", padding:"11px 20px", borderRadius:"100px", fontSize:"13px", fontWeight:800, cursor:"pointer" }}>매물 보기 →</button></a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
