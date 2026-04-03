// 📁 저장 경로: app/clean/page.tsx
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Shield, AlertTriangle, Ban, UserX, Building2, Fingerprint, Flag } from "lucide-react";

const TABS = ["규정 전체","광고 제한","이용 정지","상사 제한","개인정보 도용","허위 신고자"] as const;

export default function CleanFixcarPage() {
  const [tab, setTab] = useState<typeof TABS[number]>("규정 전체");

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 히어로 */}
        <div style={{background:"linear-gradient(135deg,#0A1628,#1A2A4A)",padding:"48px 24px",textAlign:"center"}}>
          <Shield size={40} color="#2D8A52" style={{marginBottom:12}}/>
          <h1 style={{fontSize:28,fontWeight:800,color:"white",marginBottom:8}}>클린픽스카 규정</h1>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.5)",lineHeight:1.8}}>허위매물로 신고된 매물과 판매자는 클린픽스카 정책에 따라<br/>픽스카 이용이 엄격히 제한됩니다.</p>
        </div>

        <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px 100px"}}>
          {/* 탭 */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:24}}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"10px 18px",borderRadius:100,border:tab===t?"2px solid #FF3B1E":"1px solid #E0DDD7",background:tab===t?"#FFF0ED":"white",color:tab===t?"#FF3B1E":"#888",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>{t}</button>
            ))}
          </div>

          {/* ═══ 광고 제한 ═══ */}
          {(tab==="규정 전체"||tab==="광고 제한")&&(
            <div style={{background:"white",borderRadius:18,padding:"28px 24px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <AlertTriangle size={22} color="#E8A020"/>
                <h2 style={{fontSize:20,fontWeight:800}}>광고 제한</h2>
              </div>

              <div style={{marginBottom:20}}>
                <h3 style={{fontSize:15,fontWeight:800,color:"#0066FF",marginBottom:12,padding:"8px 14px",background:"#EEF5FF",borderRadius:8}}>회원 공통</h3>
                <div style={{fontSize:14,color:"#555",lineHeight:2.2,paddingLeft:4}}>
                  1) 매매 부적합 차량을 등록한 경우 (주행·거래 불가 차량, 차량번호, 부품 등)<br/>
                  2) 감가 사유 없이 현저히 낮은 금액으로 광고하는 경우<br/>
                  3) 차량 가격을 실판매 가격이 아닌 월 납입금, 부가세 제외 금액으로 등록한 경우<br/>
                  4) 등록한 차량 정보가 실제 정보와 상이한 경우 (모델/등급, 옵션, 주행거리, 차량가격, 렌트/리스정보, 사진, 성능, 설명글 등)<br/>
                  5) 등록차량 외 다른 차량 정보를 입력하거나 안내 또는 판매 시도하는 경우<br/>
                  6) 과도하게 수정한 사진을 등록하거나 차량 사진이 아닌 이미지 또는 상호가 노출된 경우<br/>
                  7) 차량 번호판을 가리거나 편집하여 등록한 경우 (번호판 노출 사진 1장 필수)<br/>
                  8) 사진 또는 문구 입력 영역에 연락처·홍보성 내용을 등록한 경우<br/>
                  9) 차량이 판매되었으나 삭제하지 않은 모든 차량<br/>
                  10) 픽스카 워터마크 손상 사진을 등록한 경우<br/>
                  11) 계절에 맞지 않는 사진을 등록한 경우<br/>
                  12) 종사원증 없이 조합에 제시된 차량을 등록한 경우<br/>
                  13) 허위매물로 신고가 접수되어 관리자에 의해 확인된 경우<br/>
                  14) 차주 동의 없이 차량을 등록한 경우<br/>
                  15) 개인 정보를 실제와 다르게 입력한 회원의 등록된 모든 차량<br/>
                  16) 픽스카를 사칭하거나 픽스카 서비스를 도용하는 경우<br/>
                  17) 관계법령, 이용약관, 관리자 안내에 반하여 사이트에 등록된 차량<br/>
                  18) 사이트 이용정지 시 등록되어 있는 모든 차량<br/>
                  19) 관리자의 검열을 통한 사진 및 차량, 명의자 확인 서류 요청에 따르지 않는 등 픽스카 매물 등록 기준에 부합하지 않다고 판단될 경우
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <h3 style={{fontSize:15,fontWeight:800,color:"#2D8A52",marginBottom:12,padding:"8px 14px",background:"#EAF6EF",borderRadius:8}}>개인회원</h3>
                <div style={{fontSize:14,color:"#555",lineHeight:2.2,paddingLeft:4}}>
                  1) 1년(최초 광고등록일로부터 기산)에 최대 4회까지 등록 가능<br/>
                  2) 소유 기간 6개월의 본인 명의 또는 관리자에 의해 확인된 가족 명의 차량이 아닌 경우<br/>
                  3) 타인 명의 계정을 사용하여 여러 차량의 등록을 시도하거나 등록한 경우
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <h3 style={{fontSize:15,fontWeight:800,color:"#FF3B1E",marginBottom:12,padding:"8px 14px",background:"#FFF0ED",borderRadius:8}}>딜러회원(매매회원)</h3>
                <div style={{fontSize:14,color:"#555",lineHeight:2.2,paddingLeft:4}}>
                  1) 소속 조합에 정상 제시되지 않은 차량<br/>
                  2) 딜러 회원이 소속된 단지 차량이 아닌 타 단지에 등록된 차량<br/>
                  3) 딜러 회원이 개인 ID를 생성하여 등록한 개인 위장 매물
                </div>
              </div>

              <div style={{background:"#FFF8F6",borderRadius:14,padding:"18px 20px",border:"1px solid #FFE4DE"}}>
                <div style={{fontSize:14,fontWeight:800,color:"#E24B4A",marginBottom:10}}>⚠️ 조치내용</div>
                <div style={{fontSize:13,color:"#CC6633",lineHeight:2}}>
                  1) 광고 등록비 등 일체의 비용은 환불되지 않습니다.<br/>
                  2) 서비스 불량 이용자로 공개될 수 있으며, 서비스 이용이 제한될 수 있습니다.<br/>
                  3) 내용 확인을 위하여 차량 관련 서류 일체를 확인하거나 요청할 수 있으며, 서류 제출을 거부하는 경우 서비스 이용이 제한됩니다.<br/>
                  4) 허위매물 등록 시 이용 제한 기준에 따라 처리됩니다.<br/>
                  <span style={{fontSize:12,color:"#AAA"}}>※ 허위매물 신고 접수 후 7일 이내 관리자 요청 서류를 통한 소명 가능, 기간 이후 신고 삭제 불가</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══ 사이트 이용 정지 ═══ */}
          {(tab==="규정 전체"||tab==="이용 정지")&&(
            <div style={{background:"white",borderRadius:18,padding:"28px 24px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <Ban size={22} color="#E24B4A"/>
                <h2 style={{fontSize:20,fontWeight:800}}>사이트 이용 정지</h2>
              </div>

              <div style={{marginBottom:20}}>
                <h3 style={{fontSize:15,fontWeight:800,color:"#E8A020",marginBottom:12,padding:"8px 14px",background:"#FFF8E0",borderRadius:8}}>1년 이용 정지</h3>
                <div style={{fontSize:14,color:"#555",lineHeight:2.2,paddingLeft:4}}>
                  1) 관리자에 의해 허위매물 등록자로 확인된 경우 신고 횟수에 상관없이 1년 이용정지<br/>
                  2) 허위매물 신고 5회 받을 시 1년 이용정지<br/>
                  3) 자동 업데이트, 차량등록 프로그램 등 픽스카의 사전동의 없는 프로그램 사용 (또는 사용을 시도한 경우 포함) 적발 시 허위매물 신고와 상관없이 1년 이용정지<br/>
                  4) 회원 광고 차량 구매 문의에 과도한 매입 광고를 한 경우 1년 이용정지<br/>
                  5) 타인의 개인정보(연락처, 성명 등)를 도용하여 사용하는 경우 1년 이용정지
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <h3 style={{fontSize:15,fontWeight:800,color:"#E24B4A",marginBottom:12,padding:"8px 14px",background:"#FFF0ED",borderRadius:8}}>영구 이용 정지</h3>
                <div style={{fontSize:14,color:"#555",lineHeight:2.2,paddingLeft:4}}>
                  1) 기존 이용 정지자가 다른 계정을 사용하여 차량 등록을 시도하거나 등록한 경우 신고 횟수와 상관없이 기존 계정과 타 계정 모두 영구 이용정지<br/>
                  2) 기존 이용 정지자의 정보를 입력(또는 사용)을 시도하거나 입력(또는 사용) 한 경우 영구 이용정지<br/>
                  3) 명백한 사기행위, 공서양속에 반하는 행위를 한 이용자의 경우 영구 이용정지<br/>
                  4) 이용정지 2회 누적 시 영구 이용정지<br/>
                  5) 허위매물 신고 누적 횟수가 4회인 경우, 환불 처리는 가능하나 해당 계정은 영구 이용정지 조치됨
                </div>
              </div>

              <div style={{background:"#FFF0ED",borderRadius:14,padding:"16px 20px",border:"1px solid #FFD4CC"}}>
                <div style={{fontSize:13,color:"#CC6633",lineHeight:1.8}}>
                  ※ 이용정지 시 해당 계정과 연관되어 있는 정보를 사용한 계정도 동일 처리<br/>
                  ※ 이용정지 시 로그인, 차량등록 제한 및 등록차량 삭제, 등록비 등 일체 비용 환불 불가
                </div>
              </div>
            </div>
          )}

          {/* ═══ 상사 제한 ═══ */}
          {(tab==="규정 전체"||tab==="상사 제한")&&(
            <div style={{background:"white",borderRadius:18,padding:"28px 24px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <Building2 size={22} color="#E8A020"/>
                <h2 style={{fontSize:20,fontWeight:800}}>상사 제한</h2>
              </div>
              <div style={{fontSize:14,color:"#555",lineHeight:2.2}}>
                동일 상사에 소속된 딜러 회원 중 이용 정지자가 3명 이상 발생한 경우 아래와 같이 처리됩니다.<br/><br/>
                1) 해당 상사에서 보유한 모든 차량, 픽스카 광고등록 제한<br/>
                2) 해당 상사에 소속된 모든 회원, 픽스카 이용 제한
              </div>
              <div style={{background:"#FFF8E0",borderRadius:14,padding:"14px 18px",marginTop:16,border:"1px solid #FFE8A0"}}>
                <div style={{fontSize:12,color:"#C4A060"}}>※ 명백한 사기행위, 공서양속에 반하는 행위를 한 상사 직원 확인 시 정지자 수 상관없이 상사 제한 가능</div>
              </div>
            </div>
          )}

          {/* ═══ 개인정보 도용 ═══ */}
          {(tab==="규정 전체"||tab==="개인정보 도용")&&(
            <div style={{background:"white",borderRadius:18,padding:"28px 24px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <Fingerprint size={22} color="#E24B4A"/>
                <h2 style={{fontSize:20,fontWeight:800}}>개인정보 도용</h2>
              </div>
              <div style={{fontSize:14,color:"#555",lineHeight:2.2}}>
                타인의 개인정보를 도용하여 계정을 생성하거나 불법적인 행위를 한 경우 신고 횟수와 상관없이 픽스카 서비스 이용이 <strong style={{color:"#E24B4A"}}>영구적으로 제한</strong>될 수 있으며, <strong style={{color:"#E24B4A"}}>형사고발 등의 법적조치</strong>가 취해질 수 있습니다.
              </div>
              <div style={{background:"#FFF0ED",borderRadius:14,padding:"14px 18px",marginTop:16,border:"1px solid #FFD4CC"}}>
                <div style={{fontSize:12,color:"#CC6633"}}>※ 2023년 3월 14일 개정된 개인정보 보호법 제71조에 의거, 5년 이하의 징역 또는 5천만원 이하의 벌금 부과</div>
              </div>
            </div>
          )}

          {/* ═══ 허위 신고자 이용제한 ═══ */}
          {(tab==="규정 전체"||tab==="허위 신고자")&&(
            <div style={{background:"white",borderRadius:18,padding:"28px 24px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <Flag size={22} color="#0066FF"/>
                <h2 style={{fontSize:20,fontWeight:800}}>허위 신고자 이용제한</h2>
              </div>
              <div style={{fontSize:15,fontWeight:800,color:"#555",marginBottom:12}}>허위 신고 기준</div>
              <div style={{fontSize:14,color:"#555",lineHeight:2.2}}>
                1) 신고 내용에 의미 없는 내용으로만 작성하여 신고한 경우<br/>
                2) 신고내용이 사실과 다른 경우<br/>
                3) 허위매물 허위 신고가 5건 누적되는 경우 1년 이용정지<br/>
                4) 보복성으로 허위 신고를 한 경우 허위 신고 횟수에 상관없이 1년 이용정지<br/>
                5) 관리자가 악의적인 허위 신고라고 판단하는 경우 신고 횟수와 상관없이 1년 이용정지
              </div>
            </div>
          )}

          {/* 허위매물 신고 CTA */}
          <div style={{background:"linear-gradient(135deg,#FF3B1E,#E8301C)",borderRadius:18,padding:"32px 24px",textAlign:"center"}}>
            <h3 style={{fontSize:20,fontWeight:800,color:"white",marginBottom:8}}>허위매물을 발견하셨나요?</h3>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.7)",marginBottom:20}}>신고해주시면 관리자가 확인 후 조치하겠습니다.</p>
            <a href="/contact">
              <button style={{padding:"14px 40px",background:"white",color:"#FF3B1E",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>허위매물 신고하기</button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
