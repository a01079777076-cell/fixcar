"use client";
import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default function DealerTransactionsPage() {
  const [txs] = useState([
    {id:1,car:"2021 아반떼 CN7 1.6 MPI",buyer:"김○○",amount:1450,deposit:145,status:"DEPOSIT_PAID",date:"2026-03-18"},
    {id:2,car:"2020 기아 K5 2.0 MPI",buyer:"이○○",amount:1980,deposit:198,status:"COMPLETED",date:"2026-03-15"},
    {id:3,car:"2019 현대 투싼 1.6T",buyer:"박○○",amount:2100,deposit:210,status:"BALANCE_PENDING",date:"2026-03-10"},
  ]);

  const STATUS_MAP: Record<string,{label:string;color:string;bg:string}> = {
    DEPOSIT_PAID:{label:"계약금 납부",color:"#E8A020",bg:"#FFF8EC"},
    BALANCE_PENDING:{label:"잔금 대기",color:"#1847FF",bg:"#EEF2FF"},
    COMPLETED:{label:"거래 완료",color:"#2D8A52",bg:"#EAF6EF"},
    CANCELLED:{label:"취소",color:"#E24B4A",bg:"#FCEBEB"},
  };

  const NAV = [["대시보드","/dealer"],["매물","/dealer/cars"],["문의","/dealer/inquiries"],["거래","/dealer/transactions"],["분석","/dealer/analytics"]];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0F6FF"}}>
        <div style={{background:"white",borderBottom:"1.5px solid #DDEEFF",padding:"0 32px",height:"68px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,100,255,0.06)"}}>
          <Link href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px",display:"flex",alignItems:"center",gap:"8px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"#1A1A1A"}}>CAR</span><span style={{fontSize:"11px",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:800,color:"#0066FF",background:"#EEF5FF",padding:"3px 10px",borderRadius:"100px",marginLeft:"4px"}}>DEALER</span></Link>
          <div style={{display:"flex",gap:"4px"}}>{NAV.map(([l,h])=>(<Link key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/dealer/transactions"?"#0066FF":"#888",padding:"7px 12px",borderRadius:"9px",background:h==="/dealer/transactions"?"#EEF5FF":"transparent"}}>{l}</Link>))}</div>
          <Link href="/dealer"><button style={{background:"#F0F6FF",color:"#0066FF",border:"1.5px solid #DDEEFF",padding:"7px 16px",borderRadius:"100px",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>← 대시보드</button></Link>
        </div>
        <div style={{maxWidth:"900px",margin:"0 auto",padding:"24px 28px 60px"}}>
          <h1 style={{fontSize:"22px",fontWeight:800,marginBottom:"6px",color:"#0066FF"}}>거래 내역</h1>
          <p style={{fontSize:"14px",color:"#888",fontWeight:400,marginBottom:"20px"}}>계약금 납부 완료 건부터 표시돼요</p>

          {/* 요약 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"20px"}}>
            {[{l:"이번달 거래",v:`${txs.length}건`,c:"#0066FF"},{l:"총 거래금액",v:`${txs.reduce((s,t)=>s+t.amount,0).toLocaleString()}만원`,c:"#0099CC"},{l:"완료 건수",v:`${txs.filter(t=>t.status==="COMPLETED").length}건`,c:"#2D8A52"}].map(k=>(
              <div key={k.l} style={{background:"white",border:"1.5px solid #DDEEFF",borderRadius:"14px",padding:"16px 18px"}}>
                <div style={{fontSize:"12px",color:"#888",fontWeight:400,marginBottom:"6px"}}>{k.l}</div>
                <div style={{fontSize:"22px",fontWeight:800,color:k.c}}>{k.v}</div>
              </div>
            ))}
          </div>

          <div style={{background:"white",border:"1.5px solid #DDEEFF",borderRadius:"16px",overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid #F0EEE9",fontSize:"14px",fontWeight:800,color:"#0066FF",display:"flex",alignItems:"center",gap:"8px"}}><DollarSign size={16}/> 거래 목록</div>
            {txs.map((tx,i)=>{
              const s = STATUS_MAP[tx.status];
              return (
                <div key={tx.id} style={{padding:"16px 18px",borderBottom:i<txs.length-1?"1px solid #F0EEE9":"none",display:"flex",alignItems:"center",gap:"14px",flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"15px",fontWeight:800,marginBottom:"3px"}}>{tx.car}</div>
                    <div style={{fontSize:"12px",color:"#888",fontWeight:400}}>구매자: {tx.buyer} · {tx.date}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"18px",fontWeight:800,color:"#0066FF"}}>{tx.amount.toLocaleString()}<span style={{fontSize:"12px",color:"#AAA"}}>만원</span></div>
                    <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>계약금 {tx.deposit.toLocaleString()}만원</div>
                  </div>
                  <span style={{background:s.bg,color:s.color,padding:"5px 12px",borderRadius:"100px",fontSize:"12px",fontWeight:800,flexShrink:0}}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
