"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Bell, Plus, Trash2, Save } from "lucide-react";

const BRANDS = ["전체","현대","기아","제네시스","쉐보레","르노","KG모빌리티","BMW","벤츠","아우디","테슬라","토요타","기타"];
const FUELS = ["전체","가솔린","디젤","전기","하이브리드","LPG"];

interface Alert { id?:number; brand:string; minPrice:string; maxPrice:string; minYear:string; fuel:string; active:boolean; }

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(!d?.user?.id){router.push("/login");return;}
      fetch("/api/alerts").then(r=>r.json()).then(data=>{
        const arr = Array.isArray(data)?data:data.data||[];
        setAlerts(arr.map((a:any)=>({id:a.id,brand:a.brand||"전체",minPrice:String(a.minPrice||""),maxPrice:String(a.maxPrice||""),minYear:String(a.minYear||""),fuel:a.fuel||"전체",active:a.active!==false})));
        setLoading(false);
      }).catch(()=>setLoading(false));
    }).catch(()=>router.push("/login"));
  },[router]);

  const addAlert = () => setAlerts([...alerts,{brand:"전체",minPrice:"",maxPrice:"",minYear:"",fuel:"전체",active:true}]);
  const removeAlert = (idx:number) => { if(confirm("이 알림을 삭제할까요?")) setAlerts(alerts.filter((_,i)=>i!==idx)); };
  const updateAlert = (idx:number,field:string,value:string|boolean) => { const n=[...alerts]; (n[idx] as any)[field]=value; setAlerts(n); };

  const saveAlerts = async () => {
    setSaving(true);
    try {
      await fetch("/api/alerts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({alerts})});
      alert("알림 설정이 저장되었습니다!");
    } catch { alert("저장 실패"); }
    setSaving(false);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} select:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"28px 20px 100px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><Bell size={22} color="#E8A020"/><h1 style={{fontSize:24,fontWeight:800}}>매물 알림 설정</h1></div>
            <button onClick={addAlert} style={{padding:"10px 18px",background:"#FF3B1E",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:800,display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}><Plus size={14}/> 알림 추가</button>
          </div>
          <p style={{fontSize:13,color:"#AAA",marginBottom:20}}>조건에 맞는 새 매물이 등록되면 알려드려요!</p>

          {loading?<div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>:
          alerts.length===0?(
            <div style={{background:"white",borderRadius:20,padding:"60px 24px",textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:16}}>🔔</div>
              <h3 style={{fontSize:18,fontWeight:800,marginBottom:8}}>알림이 없어요</h3>
              <p style={{fontSize:13,color:"#AAA",marginBottom:16}}>원하는 조건을 설정하면 새 매물이 올라올 때 알려드려요</p>
              <button onClick={addAlert} style={{padding:"14px 28px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>첫 알림 만들기</button>
            </div>
          ):(
            <>
              {alerts.map((a,i)=>(
                <div key={i} style={{background:"white",borderRadius:18,padding:"22px 24px",marginBottom:12,border:a.active?"2px solid #E8A020":"1px solid #E8E6E1"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <span style={{fontSize:14,fontWeight:800}}>알림 #{i+1}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:12,color:a.active?"#2D8A52":"#CCC"}}><input type="checkbox" checked={a.active} onChange={e=>updateAlert(i,"active",e.target.checked)} style={{accentColor:"#2D8A52"}}/>{a.active?"활성":"비활성"}</label>
                      <button onClick={()=>removeAlert(i)} style={{border:"none",background:"#FFF0ED",padding:"5px 8px",borderRadius:6,cursor:"pointer"}}><Trash2 size={14} color="#E24B4A"/></button>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><div style={{fontSize:11,fontWeight:700,color:"#888",marginBottom:4}}>브랜드</div><select value={a.brand} onChange={e=>updateAlert(i,"brand",e.target.value)} style={{width:"100%",padding:"10px",border:"1px solid #E0DDD7",borderRadius:8,fontSize:13,fontFamily:"'NanumSquareRound',sans-serif"}}>{BRANDS.map(b=><option key={b}>{b}</option>)}</select></div>
                    <div><div style={{fontSize:11,fontWeight:700,color:"#888",marginBottom:4}}>연료</div><select value={a.fuel} onChange={e=>updateAlert(i,"fuel",e.target.value)} style={{width:"100%",padding:"10px",border:"1px solid #E0DDD7",borderRadius:8,fontSize:13,fontFamily:"'NanumSquareRound',sans-serif"}}>{FUELS.map(f=><option key={f}>{f}</option>)}</select></div>
                    <div><div style={{fontSize:11,fontWeight:700,color:"#888",marginBottom:4}}>최소 가격(만원)</div><input type="number" value={a.minPrice} onChange={e=>updateAlert(i,"minPrice",e.target.value)} placeholder="예: 1000" style={{width:"100%",padding:"10px",border:"1px solid #E0DDD7",borderRadius:8,fontSize:13,fontFamily:"'NanumSquareRound',sans-serif"}}/></div>
                    <div><div style={{fontSize:11,fontWeight:700,color:"#888",marginBottom:4}}>최대 가격(만원)</div><input type="number" value={a.maxPrice} onChange={e=>updateAlert(i,"maxPrice",e.target.value)} placeholder="예: 3000" style={{width:"100%",padding:"10px",border:"1px solid #E0DDD7",borderRadius:8,fontSize:13,fontFamily:"'NanumSquareRound',sans-serif"}}/></div>
                  </div>
                </div>
              ))}
              <button onClick={saveAlerts} disabled={saving} style={{width:"100%",padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif",marginTop:8}}><Save size={18}/>{saving?"저장 중...":"알림 설정 저장"}</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
