// 📁 저장 경로: app/dealer/transactions/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Receipt, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";

export default function DealerTransactionsPage() {
  const [tab, setTab] = useState<"all"|"pending"|"completed"|"cancelled">("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dealer/transactions").then(r => r.json()).then(d => {
      setTransactions(Array.isArray(d?.data) ? d.data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter(t => tab === "all" || t.status?.toLowerCase().includes(tab));

  const statusMap: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    DEPOSIT_PAID: { label: "계약금 결제", color: "#E8A020", bg: "#FFF8E0", icon: <Clock size={14}/> },
    BALANCE_PENDING: { label: "잔금 대기", color: "#0066FF", bg: "#EEF5FF", icon: <DollarSign size={14}/> },
    COMPLETED: { label: "거래 완료", color: "#2D8A52", bg: "#EAF6EF", icon: <CheckCircle size={14}/> },
    CANCELLED: { label: "취소", color: "#E24B4A", bg: "#FFF0ED", icon: <XCircle size={14}/> },
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F6FF"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"28px 24px 100px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <h1 style={{fontSize:24,fontWeight:800}}>💰 거래 관리</h1>
              <p style={{fontSize:13,color:"#888",marginTop:4}}>진행 중인 거래와 완료된 거래를 확인하세요</p>
            </div>
            <Link href="/dealer" style={{fontSize:13,fontWeight:700,color:"#888",textDecoration:"none"}}>← 대시보드</Link>
          </div>

          {/* 탭 */}
          <div style={{display:"flex",gap:6,marginBottom:20}}>
            {([["all","전체"],["pending","진행중"],["completed","완료"],["cancelled","취소"]] as const).map(([v,l])=>(
              <button key={v} onClick={()=>setTab(v)} style={{padding:"8px 18px",borderRadius:100,border:tab===v?"2px solid #0066FF":"1px solid #DDEEFF",background:tab===v?"#EEF5FF":"white",color:tab===v?"#0066FF":"#888",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>{l}</button>
            ))}
          </div>

          {loading ? (
            <div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>
          ) : filtered.length === 0 ? (
            <div style={{background:"white",borderRadius:18,padding:60,textAlign:"center",border:"1px solid #DDEEFF"}}>
              <Receipt size={40} color="#CCC" style={{marginBottom:12}}/>
              <div style={{fontSize:16,fontWeight:700,color:"#AAA"}}>거래 내역이 없습니다</div>
              <div style={{fontSize:13,color:"#CCC",marginTop:8}}>매물이 판매되면 여기에 표시됩니다.</div>
            </div>
          ) : filtered.map(t => {
            const s = statusMap[t.status] || statusMap.DEPOSIT_PAID;
            return (
              <div key={t.id} style={{background:"white",borderRadius:16,padding:"20px",marginBottom:10,border:"1px solid #DDEEFF",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>{t.car?.name || "차량"}</div>
                  <div style={{fontSize:12,color:"#888"}}>구매자: {t.user?.name || "—"} · {t.depositDate?.slice(0,10)}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:18,fontWeight:800,color:"#0066FF"}}>{t.amount?.toLocaleString()}만원</div>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:100,background:s.bg,color:s.color,marginTop:4}}>
                    {s.icon} {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
