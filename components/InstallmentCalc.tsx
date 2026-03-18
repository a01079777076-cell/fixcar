"use client";
import { useState } from "react";
import { Calculator } from "lucide-react";

export default function InstallmentCalc({ defaultPrice }: { defaultPrice?: number }) {
  const [price, setPrice] = useState(String(defaultPrice || 1500));
  const [deposit, setDeposit] = useState("300");
  const [months, setMonths] = useState("36");
  const [rate, setRate] = useState("5.5");

  const p = parseInt(price) || 0;
  const d = parseInt(deposit) || 0;
  const m = parseInt(months) || 36;
  const r = parseFloat(rate) || 5.5;

  const principal = (p - d) * 10000;
  const monthlyRate = r / 100 / 12;
  const monthly = monthlyRate > 0
    ? Math.round(principal * monthlyRate * Math.pow(1+monthlyRate,m) / (Math.pow(1+monthlyRate,m)-1))
    : Math.round(principal / m);
  const total = monthly * m;
  const interest = total - principal;

  return (
    <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
      <div style={{fontSize:"16px",fontWeight:800,marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px"}}>
        <Calculator size={18} color="#1847FF"/> 할부 계산기
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
        {[
          {label:"차량 가격 (만원)",val:price,set:setPrice,ph:"1500"},
          {label:"계약금·선납금 (만원)",val:deposit,set:setDeposit,ph:"300"},
          {label:"할부 기간 (개월)",val:months,set:setMonths,ph:"36",opts:["12","24","36","48","60"]},
          {label:"금리 (%)",val:rate,set:setRate,ph:"5.5"},
        ].map(f=>(
          <div key={f.label}>
            <label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"5px",color:"#888"}}>{f.label}</label>
            {f.opts ? (
              <select value={f.val} onChange={e=>f.set(e.target.value)} style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"8px",padding:"9px 12px",fontSize:"14px",fontFamily:"'NanumSquareRound',sans-serif",background:"#FAFAF8"}}>
                {f.opts.map(o=><option key={o} value={o}>{o}개월</option>)}
              </select>
            ) : (
              <input type="number" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"8px",padding:"9px 12px",fontSize:"14px",fontFamily:"'NanumSquareRound',sans-serif",background:"#FAFAF8",outline:"none"}}/>
            )}
          </div>
        ))}
      </div>
      <div style={{background:"#EEF2FF",borderRadius:"12px",padding:"14px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
          <div>
            <div style={{fontSize:"12px",color:"#888",fontWeight:400,marginBottom:"3px"}}>월 납입금</div>
            <div style={{fontSize:"22px",fontWeight:800,color:"#1847FF"}}>{monthly.toLocaleString()}<span style={{fontSize:"12px",color:"#AAA"}}>원</span></div>
          </div>
          <div>
            <div style={{fontSize:"12px",color:"#888",fontWeight:400,marginBottom:"3px"}}>총 납입금</div>
            <div style={{fontSize:"18px",fontWeight:800}}>{Math.round(total/10000).toLocaleString()}<span style={{fontSize:"12px",color:"#AAA"}}>만원</span></div>
          </div>
          <div>
            <div style={{fontSize:"12px",color:"#888",fontWeight:400,marginBottom:"3px"}}>총 이자</div>
            <div style={{fontSize:"16px",fontWeight:800,color:"#E24B4A"}}>{Math.round(interest/10000).toLocaleString()}<span style={{fontSize:"12px",color:"#AAA"}}>만원</span></div>
          </div>
          <div>
            <div style={{fontSize:"12px",color:"#888",fontWeight:400,marginBottom:"3px"}}>실구매금액</div>
            <div style={{fontSize:"16px",fontWeight:800}}>{(p-d).toLocaleString()}<span style={{fontSize:"12px",color:"#AAA"}}>만원</span></div>
          </div>
        </div>
      </div>
      <div style={{fontSize:"11px",color:"#AAA",marginTop:"10px",fontWeight:400}}>※ 실제 할부 금리·조건은 금융사에 따라 다를 수 있어요.</div>
    </div>
  );
}
