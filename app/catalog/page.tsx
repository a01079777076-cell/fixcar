"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { BRAND_MODELS, CAR_SPECS, CAR_GRADES, CAR_TAX, CAR_ISSUES, CAR_HISTORY, DOMESTIC_BRANDS, IMPORT_BRANDS } from "@/data/catalog_data";

type BrandKey = keyof typeof BRAND_MODELS;
type SpecKey = keyof typeof CAR_SPECS;

/* 헤더 통계 — 실제 데이터 기반 자동 계산 */
const BRAND_COUNT = DOMESTIC_BRANDS.length + IMPORT_BRANDS.length;
const MODEL_COUNT = Object.values(BRAND_MODELS).reduce((sum, b) => sum + (b?.models?.length || 0), 0);

/* 기본 모델 단위 정보(TAX/ISSUES/HISTORY) 폴백 조회.
   - 정식 트림명으로 정확 매칭 실패 시: 공백 무시 + '최장 접두' 매칭으로 기본 모델 데이터를 찾음
   - 예: "아이오닉 5 NE" → "아이오닉5", "아이오닉 5 N NE" → "아이오닉5 N"(더 긴 키 우선), "팰리세이드 LX2" → "팰리세이드"
   - SPEC/GRADES(트림별 수치)에는 적용하지 않음 — 잘못된 스펙 노출 방지
   - 매칭 없으면 null(기존 '준비중' 동작 유지) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lookupBase(table: Record<string, any>, model: string): any {
  if (!model) return null;
  if (table[model] !== undefined) return table[model];
  const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();
  /* 키를 공백 무시 형태로 색인 */
  const byNorm: Record<string, string> = {};
  for (const k of Object.keys(table)) byNorm[norm(k)] = k;
  /* 모델명을 단어(토큰) 단위로 뒤에서부터 하나씩 떼며 '정확' 매칭 (트림 경계 보존) */
  const tokens = model.split(/\s+/);
  for (let n = tokens.length; n >= 1; n--) {
    const cand = norm(tokens.slice(0, n).join(" "));
    if (cand.length >= 2 && byNorm[cand] !== undefined) return table[byNorm[cand]];
  }
  return null;
}

export default function CatalogPage() {
  const [tab, setTab] = useState<"domestic"|"import">("domestic");
  const [brand, setBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const brands = tab === "domestic" ? DOMESTIC_BRANDS : IMPORT_BRANDS;
const models = brand ? (BRAND_MODELS[brand as BrandKey]?.models || []) : [];
  const mobileStep: "brand" | "model" | "detail" = !brand ? "brand" : !selectedModel ? "model" : "detail";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spec = selectedModel ? (CAR_SPECS as any)[selectedModel] : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grades = selectedModel ? ((CAR_GRADES as any)[selectedModel] || []) as {grade:string;price:number;engine:string;power:string;torque:string;efficiency:string}[] : [];
  const taxInfo = lookupBase(CAR_TAX, selectedModel);
  const issueInfo = lookupBase(CAR_ISSUES, selectedModel);
  const historyInfo = (lookupBase(CAR_HISTORY, selectedModel) || null) as {generation:string;period:string;code:string;note:string}[] | null;
  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        .brand-btn{transition:all 0.15s;cursor:pointer;} .brand-btn:hover{background:#FFF0ED!important;}
        .model-btn{transition:all 0.15s;cursor:pointer;} .model-btn:hover{background:#EEF2FF!important;}
        .mobile-back{display:none;}
        @media(max-width:1024px){
          .catalog-grid{grid-template-columns:1fr!important;}
          .col-brand,.col-model,.col-detail{display:none;}
          .step-brand .col-brand{display:block!important;}
          .step-model .col-model{display:block!important;}
          .step-detail .col-detail{display:block!important;}
          .sidebar{position:static!important;max-height:none!important;overflow-y:visible!important;}
          .mobile-back{display:flex!important;}
        }
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 헤더 */}
        <div style={{background:"#1A1A1A",padding:"36px 24px 28px"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:4,color:"#1847FF",marginBottom:6}}>CATALOG</div>
            <h1 style={{fontSize:28,fontWeight:800,color:"white",marginBottom:4}}>차량 카탈로그</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{BRAND_COUNT}개 브랜드 · {MODEL_COUNT}개 모델 · 스펙·가격·고질병 전부</p>
          </div>
        </div>

        <div style={{maxWidth:1280,margin:"0 auto",padding:"20px 16px 120px"}}>
          {/* 국산/수입 탭 */}
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {(["domestic","import"] as const).map(t=>(
              <button key={t} onClick={()=>{setTab(t);setBrand("");setSelectedModel("");}} style={{
                padding:"10px 24px",borderRadius:12,border:"none",fontSize:14,fontWeight:tab===t?800:600,
                background:tab===t?"#1A1A1A":"white",color:tab===t?"white":"#888",cursor:"pointer",
                fontFamily:"'NanumSquareRound',sans-serif",
              }}>{t==="domestic"?"🇰🇷 국산차":"🌍 수입차"}</button>
            ))}
          </div>

          <div className={`catalog-grid step-${mobileStep}`} style={{display:"grid",gridTemplateColumns:"220px 220px 1fr",gap:16,alignItems:"start"}}>
            {/* 1열: 브랜드 */}
            <div className="sidebar col-brand" style={{background:"white",borderRadius:18,padding:"16px 14px",position:"sticky",top:80,maxHeight:"calc(100vh - 100px)",overflowY:"auto"}}>
              <div style={{fontSize:13,fontWeight:800,marginBottom:12,color:"#888"}}>{tab==="domestic"?"국산":"수입"} 브랜드</div>
              {brands.map(b=>(
                <button key={b} className="brand-btn" onClick={()=>{setBrand(b);setSelectedModel("");}} style={{
                  display:"block",width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:10,
                  border:"none",background:brand===b?"#FFF0ED":"transparent",
                  fontSize:14,fontWeight:brand===b?800:500,color:brand===b?"#FF3B1E":"#555",
                  fontFamily:"'NanumSquareRound',sans-serif",marginBottom:2,
                }}>
                  {b}
                  <span style={{float:"right",fontSize:11,color:"#CCC"}}>{(BRAND_MODELS[b as BrandKey]?.models||[]).length}</span>
                </button>
              ))}
            </div>

            {/* 2열: 모델 */}
            <div className="sidebar col-model" style={{background:"white",borderRadius:18,padding:"16px 14px",position:"sticky",top:80,maxHeight:"calc(100vh - 100px)",overflowY:"auto"}}>
              <button
                className="mobile-back"
                onClick={()=>setBrand("")}
                style={{
                  alignItems:"center",gap:6,padding:"6px 4px",marginBottom:10,
                  background:"transparent",border:"none",fontSize:13,fontWeight:700,color:"#888",
                  cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                }}
              >← 브랜드 목록</button>
              {brand ? (
                <>
                  <div style={{fontSize:13,fontWeight:800,marginBottom:12,color:"#888"}}>{brand} 모델</div>
                  {models.map(m=>(
                    <button key={m.name} className="model-btn" onClick={()=>setSelectedModel(m.name)} style={{
                      display:"block",width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:10,
                      border:"none",background:selectedModel===m.name?"#EEF2FF":"transparent",
                      fontSize:13,fontWeight:selectedModel===m.name?800:500,color:selectedModel===m.name?"#1847FF":"#555",
                      fontFamily:"'NanumSquareRound',sans-serif",marginBottom:2,
                    }}>
                      {m.name}
                      <span style={{float:"right",fontSize:10,color:m.status==="현행"?"#00C471":"#CCC"}}>{m.status}</span>
                    </button>
                  ))}
                </>
              ) : (
                <div style={{textAlign:"center",padding:"40px 10px",color:"#CCC"}}>
                  <div style={{fontSize:28,marginBottom:8}}>👈</div>
                  <div style={{fontSize:13}}>브랜드를 선택해주세요</div>
                </div>
              )}
            </div>

            {/* 3열: 상세 정보 */}
            <div className="col-detail">
              <button
                className="mobile-back"
                onClick={()=>setSelectedModel("")}
                style={{
                  alignItems:"center",gap:6,padding:"6px 4px",marginBottom:10,
                  background:"transparent",border:"none",fontSize:13,fontWeight:700,color:"#888",
                  cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                }}
              >← {brand} 모델 목록</button>
              {selectedModel && spec ? (
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  {/* 차량명 + 세그먼트 */}
                  <div style={{background:"white",borderRadius:18,padding:"24px 26px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                      <div>
                        <div style={{fontSize:12,color:"#1847FF",fontWeight:700,marginBottom:4}}>{brand}</div>
                        <h2 style={{fontSize:26,fontWeight:800,letterSpacing:-1,marginBottom:6}}>{selectedModel}</h2>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {[spec.segment,spec.bodyType,`${spec.seats}인승`,spec.drivetrain].filter(Boolean).map(t=>(
                            <span key={t as string} style={{background:"#F8F7F4",padding:"4px 12px",borderRadius:100,fontSize:12,fontWeight:600,color:"#888"}}>{t as string}</span>
                          ))}
                        </div>
                      </div>
                      {grades.length>0&&(
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:11,color:"#AAA"}}>출고가</div>
                          <div style={{fontSize:22,fontWeight:800,color:"#FF3B1E"}}>{grades[0].price?.toLocaleString()}~{grades[grades.length-1].price?.toLocaleString()}<span style={{fontSize:13,color:"#AAA"}}>만원</span></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 스펙 */}
                  <div style={{background:"white",borderRadius:18,padding:"22px 26px"}}>
                    <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>📐 차량 제원</h3>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0}}>
                      {[
                        ["배기량",spec.cc?`${Number(spec.cc).toLocaleString()}cc`:"전기"],
                        ["연료",spec.fuel],
                        ["변속기",spec.transmission],
                        ["구동",spec.drivetrain],
                        ["제로백",spec.zeroToHundred],
                        ["최고속도",spec.topSpeed?`${spec.topSpeed}km/h`:"-"],
                        ["공차중량",spec.weight?`${Number(spec.weight).toLocaleString()}kg`:"-"],
                        ["전장",spec.length?`${Number(spec.length).toLocaleString()}mm`:"-"],
                        ["전폭",spec.width?`${Number(spec.width).toLocaleString()}mm`:"-"],
                        ["전고",spec.height?`${Number(spec.height).toLocaleString()}mm`:"-"],
                        ["휠베이스",spec.wheelbase?`${Number(spec.wheelbase).toLocaleString()}mm`:"-"],
                        ["좌석",spec.seats?`${spec.seats}인승`:"-"],
                      ].map(([k,v])=>(
                        <div key={k as string} style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",borderBottom:"1px solid #F0EEE9"}}>
                          <span style={{fontSize:13,color:"#888"}}>{k}</span>
                          <span style={{fontSize:13,fontWeight:700}}>{v as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 등급별 가격 */}
                  {grades.length>0&&(
                    <div style={{background:"white",borderRadius:18,padding:"22px 26px"}}>
                      <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>💰 등급별 가격</h3>
                      <div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                          <thead>
                            <tr style={{background:"#F8F7F4"}}>
                              {["등급","가격","엔진","출력","토크","연비"].map(h=>(
                                <th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:800,color:"#888",fontSize:12}}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {grades.map((g,i)=>(
                              <tr key={i} style={{borderBottom:"1px solid #F0EEE9"}}>
                                <td style={{padding:"10px 12px",fontWeight:700}}>{g.grade}</td>
                                <td style={{padding:"10px 12px",color:"#FF3B1E",fontWeight:800}}>{g.price?.toLocaleString()}만원</td>
                                <td style={{padding:"10px 12px",color:"#666"}}>{g.engine}</td>
                                <td style={{padding:"10px 12px"}}>{g.power}PS</td>
                                <td style={{padding:"10px 12px"}}>{g.torque}kg·m</td>
                                <td style={{padding:"10px 12px",color:"#00C471",fontWeight:700}}>{g.efficiency}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 세금/보험 */}
                  {taxInfo&&(
                    <div style={{background:"white",borderRadius:18,padding:"22px 26px"}}>
                      <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>🧾 세금·보험</h3>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                        <div style={{background:"#F8F7F4",borderRadius:12,padding:"16px",textAlign:"center"}}>
                          <div style={{fontSize:11,color:"#AAA",marginBottom:4}}>연간 자동차세</div>
                          <div style={{fontSize:18,fontWeight:800,color:"#1847FF"}}>{Number(taxInfo.annualTax).toLocaleString()}<span style={{fontSize:11,color:"#888"}}>원</span></div>
                        </div>
                        <div style={{background:"#F8F7F4",borderRadius:12,padding:"16px",textAlign:"center"}}>
                          <div style={{fontSize:11,color:"#AAA",marginBottom:4}}>보험 분류</div>
                          <div style={{fontSize:14,fontWeight:700}}>{taxInfo.insuranceClass}</div>
                        </div>
                        <div style={{background:"#F8F7F4",borderRadius:12,padding:"16px",textAlign:"center"}}>
                          <div style={{fontSize:11,color:"#AAA",marginBottom:4}}>고성능 할증</div>
                          <div style={{fontSize:14,fontWeight:700,color:taxInfo.performanceSurcharge==="X"?"#00C471":"#FF3B1E"}}>{taxInfo.performanceSurcharge==="X"?"없음":"있음"}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 고질병 */}
                  {issueInfo&&(
                    <div style={{background:"white",borderRadius:18,padding:"22px 26px"}}>
                      <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>⚠️ 고질병·주의사항</h3>
                      {issueInfo.knownIssues&&(
                        <div style={{marginBottom:14}}>
                          <div style={{fontSize:13,fontWeight:800,color:"#FF3B1E",marginBottom:6}}>알려진 고질병</div>
                          <div style={{fontSize:13,color:"#555",lineHeight:1.8,background:"#FFF8F6",borderRadius:10,padding:"12px 16px",border:"1px solid #FFE0D6"}}>
                            {issueInfo.knownIssues.split(" / ").map((item:string,i:number)=>(
                              <div key={i}>• {item}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {issueInfo.fuelNotes&&(
                        <div style={{marginBottom:14}}>
                          <div style={{fontSize:13,fontWeight:800,color:"#E8A020",marginBottom:6}}>연료별 주의사항</div>
                          <div style={{fontSize:13,color:"#555",lineHeight:1.8,background:"#FFF8EC",borderRadius:10,padding:"12px 16px",border:"1px solid #FFE4B5"}}>
                            {issueInfo.fuelNotes.split(" / ").map((item:string,i:number)=>(
                              <div key={i}>• {item}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {issueInfo.yearIssues&&(
                        <div>
                          <div style={{fontSize:13,fontWeight:800,color:"#1847FF",marginBottom:6}}>연도별 이슈</div>
                          <div style={{fontSize:13,color:"#555",lineHeight:1.8,background:"#EEF2FF",borderRadius:10,padding:"12px 16px",border:"1px solid #B8C8FF"}}>
                            {issueInfo.yearIssues.split(" / ").map((item:string,i:number)=>(
                              <div key={i}>• {item}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 세대 히스토리 */}
                  {historyInfo&&historyInfo.length>0&&(
                    <div style={{background:"white",borderRadius:18,padding:"22px 26px"}}>
                      <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>📜 세대 히스토리</h3>
                      {historyInfo.map((h,i)=>(
                        <div key={i} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:i<historyInfo.length-1?"1px solid #F0EEE9":"none"}}>
                          <div style={{width:8,height:8,borderRadius:"50%",background:i===0?"#FF3B1E":"#E0DDD7",marginTop:6,flexShrink:0}}/>
                          <div>
                            <div style={{fontSize:14,fontWeight:800}}>{h.generation} <span style={{fontSize:12,fontWeight:400,color:"#AAA"}}>{h.code}</span></div>
                            <div style={{fontSize:12,color:"#888"}}>{h.period}</div>
                            {h.note&&<div style={{fontSize:12,color:"#AAA",marginTop:2}}>{h.note}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : selectedModel ? (
                <div style={{background:"white",borderRadius:18,padding:"60px 24px",textAlign:"center"}}>
                  <div style={{fontSize:40,marginBottom:12}}>😅</div>
                  <div style={{fontSize:16,fontWeight:800,marginBottom:6}}>죄송합니다</div>
                  <p style={{fontSize:14,color:"#AAA"}}>아직 정보를 모으고 있어요! 조금만 기다려주세요</p>
                </div>
              ) : (
                <div style={{background:"white",borderRadius:18,padding:"80px 24px",textAlign:"center"}}>
                  <div style={{fontSize:48,marginBottom:16}}>📚</div>
                  <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>차량을 선택해주세요</div>
                  <p style={{fontSize:14,color:"#AAA"}}>좌측에서 브랜드 → 모델을 선택하면<br/>스펙·가격·고질병 정보가 표시됩니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
