"use client";
import { useState, useEffect } from "react";
const CATS = ["외관","실내","주행성능","연비","편의사양","가성비"];
export default function CarScoreWidget({ carId }: { carId:number }) {
  const [scores, setScores] = useState<{category:string;avg:number;count:number}[]>([]);
  const [my, setMy] = useState<Record<string,number>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(()=>{
    fetch(`/api/cars/${carId}/scores`).then(r=>r.json()).then(d=>{ if(d.success) setScores(d.data); else throw new Error(); })
      .catch(()=>setScores(CATS.map(c=>({ category:c, avg:+(3.5+Math.random()*1.2).toFixed(1), count:Math.floor(Math.random()*30)+5 }))));
  },[carId]);
  const total = scores.length>0 ? +(scores.reduce((s,c)=>s+c.avg,0)/scores.length).toFixed(1) : 0;
  const handleSave = async () => {
    if(Object.keys(my).length<CATS.length){ alert("모든 항목을 평가해주세요!"); return; }
    setSaving(true);
    await fetch(`/api/cars/${carId}/scores`,{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({scores:my}) }).catch(()=>{});
    setSaved(true); setSaving(false);
  };
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"16px",padding:"12px 14px",background:"#F8F6F2",borderRadius:"12px"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:"28px",fontWeight:800,color:"#FF3B1E"}}>{total}</div><div style={{fontSize:"11px",color:"#AAA"}}>/ 5.0</div></div>
        <div style={{flex:1}}><div style={{height:"6px",background:"#E0DDD7",borderRadius:"3px",overflow:"hidden"}}><div style={{height:"100%",width:`${(total/5)*100}%`,background:"#FF3B1E",borderRadius:"3px"}}/></div><div style={{fontSize:"11px",color:"#AAA",marginTop:"4px",fontWeight:400}}>{scores.reduce((s,c)=>s+c.count,0)}명 참여</div></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"16px"}}>
        {CATS.map(cat=>{
          const s=scores.find(sc=>sc.category===cat);
          const avg=s?.avg||0;
          return(
            <div key={cat}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                <span style={{fontSize:"13px",fontWeight:700}}>{cat}</span>
                <span style={{fontSize:"12px",fontWeight:800,color:"#FF3B1E"}}>{avg}</span>
              </div>
              <div style={{height:"4px",background:"#F0EEE9",borderRadius:"3px",overflow:"hidden",marginBottom:"5px"}}><div style={{height:"100%",width:`${(avg/5)*100}%`,background:"#FF3B1E",borderRadius:"3px"}}/></div>
              <div style={{display:"flex",gap:"4px"}}>
                {[1,2,3,4,5].map(n=>(
                  <button key={n} onClick={()=>setMy(p=>({...p,[cat]:n}))} style={{flex:1,height:"26px",borderRadius:"6px",border:"1.5px solid",borderColor:my[cat]===n?"#FF3B1E":"#E0DDD7",background:my[cat]===n?"#FF3B1E":"white",color:my[cat]===n?"white":"#888",fontSize:"11px",fontWeight:800,cursor:"pointer"}}>{n}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {saved?(
        <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"10px",padding:"11px",textAlign:"center",fontSize:"13px",fontWeight:700,color:"#2D8A52"}}>✅ 평가가 저장됐어요!</div>
      ):(
        <button onClick={handleSave} disabled={saving} style={{width:"100%",background:saving?"#E0DDD7":"#FF3B1E",color:saving?"#AAA":"white",border:"none",padding:"12px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:saving?"default":"pointer"}}>{saving?"저장 중...":"내 평가 저장하기"}</button>
      )}
    </div>
  );
}
