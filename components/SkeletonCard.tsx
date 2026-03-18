"use client";

export function SkeletonCard() {
  return (
    <div style={{background:"white",borderRadius:"18px",overflow:"hidden"}}>
      <div style={{height:"200px",background:"#F0EEE9",animation:"pulse 1.5s ease-in-out infinite"}}/>
      <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:"10px"}}>
        <div style={{height:"20px",background:"#F0EEE9",borderRadius:"6px",width:"70%",animation:"pulse 1.5s ease-in-out infinite"}}/>
        <div style={{height:"14px",background:"#F0EEE9",borderRadius:"6px",width:"50%",animation:"pulse 1.5s ease-in-out infinite"}}/>
        <div style={{display:"flex",gap:"6px"}}>
          <div style={{height:"24px",background:"#F0EEE9",borderRadius:"100px",width:"60px",animation:"pulse 1.5s ease-in-out infinite"}}/>
          <div style={{height:"24px",background:"#F0EEE9",borderRadius:"100px",width:"60px",animation:"pulse 1.5s ease-in-out infinite"}}/>
        </div>
        <div style={{height:"1px",background:"#F0EEE9",margin:"4px 0"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{height:"28px",background:"#F0EEE9",borderRadius:"6px",width:"40%",animation:"pulse 1.5s ease-in-out infinite"}}/>
          <div style={{height:"38px",background:"#F0EEE9",borderRadius:"10px",width:"80px",animation:"pulse 1.5s ease-in-out infinite"}}/>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"20px"}}>
      {Array.from({length:count}).map((_,i)=><SkeletonCard key={i}/>)}
    </div>
  );
}
