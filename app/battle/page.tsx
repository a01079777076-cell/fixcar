"use client";
import { useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";

type Car = { name:string; brand:string; price:string; monthly:string; fuel:string; power:string; desc:string; emoji:string; };

const SPORTS: Car[] = [
  {name:"포르쉐 911 GT3",brand:"포르쉐",price:"1억 9,800만",monthly:"140만",fuel:"가솔린",power:"510마력",desc:"자연흡기 수평대향 6기통. 뉘르부르크링을 위한 차.",emoji:"🏎️"},
  {name:"람보르기니 우루스 S",brand:"람보르기니",price:"2억 9,000만",monthly:"210만",fuel:"가솔린",power:"666마력",desc:"슈퍼 SUV. 박스카인데 이 마력.",emoji:"🐂"},
  {name:"페라리 SF90",brand:"페라리",price:"4억 5,000만",monthly:"380만",fuel:"PHEV",power:"1,000마력",desc:"PHEV 슈퍼카. 전기+V8의 끝판왕.",emoji:"🐎"},
  {name:"BMW M3 컴페티션",brand:"BMW",price:"1억 800만",monthly:"80만",fuel:"가솔린",power:"510마력",desc:"세단의 탈을 쓴 레이싱카. 가장 현실적인 드림카.",emoji:"🔵"},
  {name:"메르세데스 AMG GT R",brand:"벤츠",price:"2억 8,000만",monthly:"210만",fuel:"가솔린",power:"577마력",desc:"그린 헬의 야수. 독사라 불리는 AMG.",emoji:"⭐"},
  {name:"테슬라 모델S 플레드",brand:"테슬라",price:"1억 5,500만",monthly:"30만",fuel:"전기",power:"1,020마력",desc:"0-100 1.99초. 가장 빠른 양산차.",emoji:"⚡"},
  {name:"포르쉐 타이칸 터보S",brand:"포르쉐",price:"1억 9,500만",monthly:"50만",fuel:"전기",power:"761마력",desc:"전기차도 포르쉐면 다르다.",emoji:"🔌"},
  {name:"아우디 R8 V10 플러스",brand:"아우디",price:"2억 3,000만",monthly:"160만",fuel:"가솔린",power:"620마력",desc:"마지막 V10 자연흡기 아우디.",emoji:"💎"},
  {name:"맥라렌 765LT",brand:"맥라렌",price:"4억 2,000만",monthly:"350만",fuel:"가솔린",power:"765마력",desc:"롱테일 경량화의 극한.",emoji:"🧡"},
  {name:"닛산 GT-R 니스모",brand:"닛산",price:"1억 9,000만",monthly:"140만",fuel:"가솔린",power:"600마력",desc:"갓질라 최종진화형.",emoji:"👹"},
  {name:"쉐보레 콜벳 Z06 2024",brand:"쉐보레",price:"1억 8,500만",monthly:"130만",fuel:"가솔린",power:"670마력",desc:"미드십 콜벳. 미국이 만든 슈퍼카.",emoji:"🦅"},
  {name:"기아 EV6 GT",brand:"기아",price:"6,900만",monthly:"20만",fuel:"전기",power:"585마력",desc:"국산 전기 괴물. 제로백 3.5초.",emoji:"🇰🇷"},
  {name:"현대 아이오닉5 N",brand:"현대",price:"7,700만",monthly:"20만",fuel:"전기",power:"650마력",desc:"드리프트 모드 탑재 국산 전기.",emoji:"⚡"},
  {name:"BMW M5 CS",brand:"BMW",price:"2억 2,000만",monthly:"160만",fuel:"가솔린",power:"635마력",desc:"M5 중 가장 가벼운 CS. 서킷용 세단.",emoji:"🔵"},
  {name:"포드 머스탱 다크호스",brand:"포드",price:"9,500만",monthly:"70만",fuel:"가솔린",power:"500마력",desc:"V8 5.0 자연흡기 머슬카.",emoji:"🐎"},
  {name:"렉서스 LFA",brand:"렉서스",price:"7억(중고)",monthly:"200만",fuel:"가솔린",power:"560마력",desc:"토요타 슈퍼카. V10 소리가 악기.",emoji:"🎻"},
  {name:"포르쉐 케이맨 GT4 RS",brand:"포르쉐",price:"1억 7,000만",monthly:"120만",fuel:"가솔린",power:"500마력",desc:"911 엔진을 미드십에. 더 날카롭다.",emoji:"🏎️"},
  {name:"알파로메오 줄리아 QV",brand:"알파로메오",price:"1억 3,000만",monthly:"90만",fuel:"가솔린",power:"510마력",desc:"뉘르부르크링 세단 최고 기록.",emoji:"🍀"},
  {name:"BMW M4 CSL",brand:"BMW",price:"1억 8,000만",monthly:"130만",fuel:"가솔린",power:"550마력",desc:"1,000대 한정. M4의 극한.",emoji:"🔵"},
  {name:"캐딜락 CT5-V 블랙윙",brand:"캐딜락",price:"1억 2,000만",monthly:"85만",fuel:"가솔린",power:"668마력",desc:"수동변속기 선택 가능한 슈퍼세단.",emoji:"🎩"},
  {name:"혼다 NSX Type S",brand:"혼다",price:"2억 5,000만",monthly:"180만",fuel:"PHEV",power:"600마력",desc:"혼다 슈퍼카 유종의 미.",emoji:"🔴"},
  {name:"아스톤마틴 발할라",brand:"아스톤마틴",price:"4억(예약)",monthly:"350만",fuel:"PHEV",power:"950마력",desc:"영국 하이퍼카. 미래형 아스톤.",emoji:"🫧"},
  {name:"리막 네베라",brand:"리막",price:"12억",monthly:"800만",fuel:"전기",power:"1,914마력",desc:"세상에서 가장 빠른 전기 하이퍼카.",emoji:"⚡"},
  {name:"부가티 시론",brand:"부가티",price:"30억",monthly:"2,000만",fuel:"가솔린",power:"1,500마력",desc:"쿼드 터보 W16. 인류 공학의 집약.",emoji:"🌀"},
  {name:"폭스바겐 골프 GTI Clubsport",brand:"폭스바겐",price:"6,200만",monthly:"42만",fuel:"가솔린",power:"300마력",desc:"FF 최강 핫해치.",emoji:"🏁"},
  {name:"현대 벨로스터 N",brand:"현대",price:"3,500만(중고)",monthly:"30만",fuel:"가솔린",power:"275마력",desc:"단종됐지만 중고 수요 폭발.",emoji:"🔥"},
  {name:"기아 스팅어 3.3T",brand:"기아",price:"4,500만(중고)",monthly:"40만",fuel:"가솔린",power:"370마력",desc:"한국의 패스트백. 단종이 아쉬운 명차.",emoji:"🇰🇷"},
  {name:"스바루 BRZ tS",brand:"스바루",price:"6,000만",monthly:"42만",fuel:"가솔린",power:"234마력",desc:"순수 FR 스포츠. 저렴한 진정한 드라이빙.",emoji:"⭐"},
  {name:"메르세데스 AMG CLA 45S",brand:"벤츠",price:"9,800만",monthly:"75만",fuel:"가솔린",power:"421마력",desc:"세상에서 가장 강한 양산 4기통.",emoji:"⭐"},
  {name:"아우디 RS3 세단",brand:"아우디",price:"9,200만",monthly:"70만",fuel:"가솔린",power:"400마력",desc:"5기통 400마력. 유일무이한 사운드.",emoji:"💎"},
  {name:"마세라티 MC20",brand:"마세라티",price:"2억 8,000만",monthly:"220만",fuel:"가솔린",power:"630마력",desc:"마세라티의 슈퍼카 컴백.",emoji:"🔱"},
  {name:"인피니티 Q50 레드스포츠",brand:"인피니티",price:"6,500만",monthly:"48만",fuel:"가솔린",power:"400마력",desc:"저평가된 숨은 퍼포먼스 세단.",emoji:"⚡"},
];

const LUXURY: Car[] = [
  {name:"롤스로이스 팬텀",brand:"롤스로이스",price:"5억",monthly:"400만",fuel:"가솔린",power:"571마력",desc:"자동차계의 왕좌. 별이 빛나는 헤드라이너.",emoji:"👻"},
  {name:"롤스로이스 컬리넌",brand:"롤스로이스",price:"4억 8,000만",monthly:"390만",fuel:"가솔린",power:"571마력",desc:"롤스로이스 첫 SUV. 럭셔리의 끝.",emoji:"👑"},
  {name:"벤틀리 플라잉스퍼",brand:"벤틀리",price:"3억 8,000만",monthly:"300만",fuel:"가솔린",power:"542마력",desc:"세상에서 가장 빠른 럭셔리 세단.",emoji:"🦅"},
  {name:"벤틀리 벤테이가 EWB",brand:"벤틀리",price:"3억 6,000만",monthly:"290만",fuel:"가솔린",power:"542마력",desc:"롱 휠베이스 럭셔리 SUV.",emoji:"👑"},
  {name:"G63 AMG 2024",brand:"벤츠",price:"2억 5,000만",monthly:"190만",fuel:"가솔린",power:"585마력",desc:"박스카의 명품. 불변의 아이콘.",emoji:"📦"},
  {name:"마이바흐 GLS 600",brand:"벤츠",price:"3억",monthly:"240만",fuel:"가솔린",power:"558마력",desc:"SUV에 마이바흐. 이동하는 집무실.",emoji:"⭐"},
  {name:"BMW 7시리즈 i7",brand:"BMW",price:"2억",monthly:"65만",fuel:"전기",power:"544마력",desc:"전기 플래그십 세단. 31인치 뒷자리 스크린.",emoji:"🔵"},
  {name:"벤츠 S클래스 마이바흐",brand:"벤츠",price:"2억 8,000만",monthly:"210만",fuel:"가솔린",power:"503마력",desc:"마이바흐 S. 최고의 럭셔리 세단.",emoji:"⭐"},
  {name:"포르쉐 파나메라 터보 E하이브리드",brand:"포르쉐",price:"2억 6,000만",monthly:"180만",fuel:"PHEV",power:"700마력",desc:"4도어 포르쉐 PHEV 최강판.",emoji:"🏎️"},
  {name:"아스톤마틴 DBX707",brand:"아스톤마틴",price:"3억 5,000만",monthly:"280만",fuel:"가솔린",power:"707마력",desc:"영국 슈퍼 SUV. 가장 빠른 아스톤.",emoji:"🫧"},
  {name:"람보르기니 레부엘토",brand:"람보르기니",price:"5억 8,000만",monthly:"480만",fuel:"PHEV",power:"1,015마력",desc:"V12+전기. 아벤타도르의 후계자.",emoji:"🐂"},
  {name:"페라리 퓨로상에",brand:"페라리",price:"4억 5,000만",monthly:"380만",fuel:"가솔린",power:"725마력",desc:"페라리의 첫 실용적인 SUV.",emoji:"🐎"},
  {name:"제네시스 G90 롱휠베이스",brand:"제네시스",price:"1억 8,800만",monthly:"110만",fuel:"가솔린",power:"380마력",desc:"국산 최고 럭셔리. VIP 의전차량.",emoji:"🇰🇷"},
  {name:"렉서스 LC 500",brand:"렉서스",price:"1억 4,000만",monthly:"100만",fuel:"가솔린",power:"477마력",desc:"일본 럭셔리 쿠페. 토요타 기술의 집약.",emoji:"🎻"},
  {name:"링컨 네비게이터 블랙 레이블",brand:"링컨",price:"1억 9,000만",monthly:"145만",fuel:"가솔린",power:"440마력",desc:"미국 대통령 차. 최고급 미국 SUV.",emoji:"🎩"},
  {name:"캐딜락 에스컬레이드 ESV",brand:"캐딜락",price:"1억 8,000만",monthly:"140만",fuel:"가솔린",power:"420마력",desc:"힙합 뮤직비디오의 그 차. 풀사이즈 SUV.",emoji:"🎶"},
  {name:"BMW X7 M60i",brand:"BMW",price:"1억 6,000만",monthly:"115만",fuel:"가솔린",power:"530마력",desc:"7인승인데 530마력. BMW 플래그십 SAV.",emoji:"🔵"},
  {name:"메르세데스 EQS 580",brand:"벤츠",price:"1억 9,000만",monthly:"60만",fuel:"전기",power:"659마력",desc:"전기 S클래스. 1,600mm 하이퍼스크린.",emoji:"⭐"},
  {name:"볼보 XC90 Ultimate",brand:"볼보",price:"1억 2,000만",monthly:"85만",fuel:"가솔린",power:"310마력",desc:"북유럽 안전+럭셔리의 완성.",emoji:"🌿"},
  {name:"도요타 랜드크루저 GR스포츠",brand:"도요타",price:"1억 3,000만",monthly:"95만",fuel:"디젤",power:"309마력",desc:"40년 전통. 사막도 건너는 신뢰성.",emoji:"🌟"},
  {name:"리비안 R1S",brand:"리비안",price:"1억 2,000만",monthly:"30만",fuel:"전기",power:"835마력",desc:"전기 럭셔리 SUV. 아마존이 투자한 차.",emoji:"🌲"},
  {name:"포드 F-150 랩터R",brand:"포드",price:"1억 6,000만",monthly:"120만",fuel:"가솔린",power:"700마력",desc:"오프로드 픽업 최강. V8 슈퍼차저.",emoji:"🦅"},
  {name:"GM 허머 EV",brand:"GM",price:"1억 7,000만",monthly:"40만",fuel:"전기",power:"1,000마력",desc:"전기 오프로드 픽업. 크랩워크 가능.",emoji:"🤖"},
  {name:"마세라티 레반테 트로페오",brand:"마세라티",price:"2억 2,000만",monthly:"170만",fuel:"가솔린",power:"580마력",desc:"이탈리아 SUV. V8 마세라티.",emoji:"🔱"},
  {name:"BMW iX M60",brand:"BMW",price:"1억 7,000만",monthly:"55만",fuel:"전기",power:"619마력",desc:"전기 플래그십 SAV. BMW의 미래.",emoji:"🔵"},
  {name:"현대 팰리세이드 캘리그래피",brand:"현대",price:"5,500만",monthly:"45만",fuel:"가솔린",power:"295마력",desc:"국산 8인승 SUV 끝판. 가성비 럭셔리.",emoji:"🇰🇷"},
  {name:"기아 EV9 GT",brand:"기아",price:"9,500만",monthly:"25만",fuel:"전기",power:"501마력",desc:"전기 대형 7인승 SUV. 국산 전기 끝판.",emoji:"⚡"},
  {name:"제네시스 GV80 쿠페",brand:"제네시스",price:"9,500만",monthly:"70만",fuel:"가솔린",power:"380마력",desc:"국산 쿠페형 대형 SUV.",emoji:"🇰🇷"},
  {name:"랜드로버 레인지로버 PHEV",brand:"랜드로버",price:"1억 7,000만",monthly:"110만",fuel:"PHEV",power:"440마력",desc:"PHEV 플래그십 SUV. 오프로드+럭셔리.",emoji:"🏔️"},
  {name:"볼보 EX90 트윈모터",brand:"볼보",price:"1억 4,000만",monthly:"50만",fuel:"전기",power:"517마력",desc:"북유럽 전기 안전의 집약.",emoji:"🌿"},
  {name:"기아 카니발 하이리무진",brand:"기아",price:"5,800만",monthly:"50만",fuel:"가솔린",power:"290마력",desc:"리무진 못지않은 국산 MPV.",emoji:"🚐"},
  {name:"현대 아이오닉9 AWD",brand:"현대",price:"8,000만",monthly:"25만",fuel:"전기",power:"272마력",desc:"현대 전기 대형 7인승 SUV 2025.",emoji:"🇰🇷"},
];

function shuffle<T>(arr:T[]): T[] {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

export default function BattlePage() {
  const [categ, setCateg] = useState<"sports"|"luxury"|null>(null);
  const [remaining, setRemaining] = useState<Car[]>([]);
  const [round, setRound] = useState(1);
  const [matchIdx, setMatchIdx] = useState(0);
  const [winners, setWinners] = useState<Car[]>([]);
  const [champion, setChampion] = useState<Car|null>(null);
  const [votes, setVotes] = useState<Record<string,number>>({});
  const [totalV, setTotalV] = useState(0);
  const [tab, setTab] = useState<"battle"|"rank">("battle");
  const [doneOnce, setDoneOnce] = useState(false);

  const RNAMES: Record<number,string> = {1:"32강",2:"16강",3:"8강",4:"4강",5:"결승"};

  const start = (c:"sports"|"luxury") => {
    setCateg(c);
    const pool = c==="sports"?SPORTS:LUXURY;
    setRemaining(shuffle(pool).slice(0,32));
    setRound(1);setMatchIdx(0);setWinners([]);setChampion(null);setTab("battle");
  };

  const choose = (car:Car) => {
    setVotes(p=>({...p,[car.name]:(p[car.name]||0)+1}));
    setTotalV(p=>p+1);
    const nw=[...winners,car];
    const ni=matchIdx+1;
    const total=Math.floor(remaining.length/2);
    if(ni>=total){
      if(nw.length===1){setChampion(nw[0]);setDoneOnce(true);}
      else{setRemaining(nw);setRound(r=>r+1);setMatchIdx(0);setWinners([]);}
    } else {setMatchIdx(ni);setWinners(nw);}
  };

  const sortedVotes=Object.entries(votes).sort((a,b)=>b[1]-a[1]);
  const L=remaining[matchIdx*2], R=remaining[matchIdx*2+1];
  const total=Math.floor(remaining.length/2);

  if(!categ) return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#0A0A0A;} a{text-decoration:none;color:inherit;} button{cursor:pointer;font-family:'NanumSquareRound',sans-serif;}`}</style>
      <div style={{minHeight:"100vh",background:"#0A0A0A",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px",gap:"32px"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"64px",marginBottom:"14px"}}>🏆</div>
          <h1 style={{fontFamily:"'Bebas Neue',serif",fontSize:"clamp(40px,8vw,96px)",color:"white",letterSpacing:"3px",lineHeight:1}}>자동차 <span style={{color:"#FF3B1E"}}>지식배틀</span></h1>
          <p style={{fontSize:"15px",color:"rgba(255,255,255,0.4)",marginTop:"10px",fontWeight:400}}>32대 토너먼트 · 랜덤 대진 · 가격·마력·유지비 보고 선택</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",maxWidth:"560px",width:"100%"}}>
          {[{c:"sports" as const,emoji:"🏎️",name:"스포츠카",sub:"32개 고성능 스포츠카",border:"#FF3B1E"},{c:"luxury" as const,emoji:"👑",name:"럭셔리카",sub:"32개 프리미엄·럭셔리카",border:"#1847FF"}].map(o=>(
            <button key={o.c} onClick={()=>start(o.c)} style={{background:`${o.border}15`,border:`2px solid ${o.border}44`,borderRadius:"20px",padding:"28px 20px",cursor:"pointer",color:"white",textAlign:"center"}}>
              <div style={{fontSize:"44px",marginBottom:"10px"}}>{o.emoji}</div>
              <div style={{fontSize:"18px",fontWeight:800,marginBottom:"4px"}}>{o.name}</div>
              <div style={{fontSize:"12px",color:"rgba(255,255,255,0.45)",fontWeight:400}}>{o.sub}</div>
            </button>
          ))}
        </div>
        {doneOnce&&<button onClick={()=>setTab("rank")} style={{background:"#1847FF",color:"white",border:"none",padding:"13px 28px",borderRadius:"12px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>인기도 순위 바로 보기 →</button>}
      </div>
    </>
  );

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#0A0A0A;} a{text-decoration:none;color:inherit;} button{cursor:pointer;font-family:'NanumSquareRound',sans-serif;} .cc{background:#1A1A2E;border:2px solid #2A2A4A;border-radius:18px;padding:20px;cursor:pointer;transition:all 0.2s;flex:1;} .cc:hover{border-color:#FF3B1E;transform:translateY(-3px);} @media(max-width:700px){.bf{flex-direction:column!important;}}`}</style>
      <div style={{minHeight:"100vh",background:"#0A0A0A"}}>
        <div style={{background:"#050510",borderBottom:"1px solid #1A1A3A",padding:"0 28px",height:"60px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>setCateg(null)} style={{fontFamily:"'Bebas Neue',serif",fontSize:"22px",color:"white",background:"none",border:"none"}}><span style={{color:"#FF3B1E"}}>FIX</span>CAR</button>
          <div style={{display:"flex",gap:"6px"}}>
            {(["battle","rank"] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?"rgba(255,255,255,0.1)":"transparent",border:`1px solid ${tab===t?"rgba(255,255,255,0.3)":"transparent"}`,color:tab===t?"white":"rgba(255,255,255,0.35)",padding:"6px 14px",borderRadius:"8px",fontSize:"13px",fontWeight:700}}>
                {t==="battle"?"배틀":"인기도 순위"}
              </button>
            ))}
          </div>
          <button onClick={()=>start(categ)} style={{fontSize:"12px",color:"rgba(255,255,255,0.3)",background:"none",border:"none",fontFamily:"'NanumSquareRound',sans-serif"}}>처음부터 ↺</button>
        </div>

        {tab==="rank"&&(
          <div style={{maxWidth:"680px",margin:"0 auto",padding:"28px 28px 60px"}}>
            <div style={{fontSize:"18px",fontWeight:800,color:"white",marginBottom:"18px"}}>📊 인기도 순위</div>
            {sortedVotes.length===0
              ? <div style={{color:"rgba(255,255,255,0.35)",textAlign:"center",padding:"60px"}}>배틀을 먼저 진행해주세요!</div>
              : sortedVotes.map(([name,cnt],i)=>{
                const pct=totalV>0?Math.round((cnt/totalV)*100):0;
                return (
                  <div key={name} style={{marginBottom:"10px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                      <span style={{fontSize:"13px",fontWeight:i<3?800:600,color:["#FF3B1E","#C0C0C0","#CD7F32"][i]||"rgba(255,255,255,0.55)"}}>{["🥇","🥈","🥉"][i]||`${i+1}위`} {name}</span>
                      <span style={{fontSize:"12px",color:"rgba(255,255,255,0.35)"}}>{cnt}표 ({pct}%)</span>
                    </div>
                    <div style={{height:"5px",background:"#1A1A2E",borderRadius:"3px",overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:i===0?"#FF3B1E":"#1847FF",borderRadius:"3px"}}/>
                    </div>
                  </div>
                );
              })}
            <div style={{marginTop:"20px",display:"flex",gap:"10px",justifyContent:"center"}}>
              <button onClick={()=>start(categ)} style={{background:"#FF3B1E",color:"white",border:"none",padding:"12px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>다시 하기 ↺</button>
              <button onClick={()=>setCateg(null)} style={{background:"rgba(255,255,255,0.08)",color:"white",border:"none",padding:"12px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:700,cursor:"pointer"}}>카테고리 변경</button>
            </div>
          </div>
        )}

        {tab==="battle"&&(
          <div style={{maxWidth:"820px",margin:"0 auto",padding:"22px 24px 60px"}}>
            {champion?(
              <div style={{textAlign:"center",paddingTop:"16px"}}>
                <div style={{fontSize:"60px",marginBottom:"12px"}}>🏆</div>
                <div style={{fontSize:"11px",fontWeight:800,letterSpacing:"3px",color:"#FF3B1E",marginBottom:"8px"}}>CHAMPION</div>
                <h2 style={{fontFamily:"'Bebas Neue',serif",fontSize:"clamp(28px,5vw,56px)",color:"white",marginBottom:"6px"}}>{champion.name}</h2>
                <div style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",marginBottom:"20px",fontWeight:400}}>{champion.desc}</div>
                <div style={{background:"#1A1A2E",border:"2px solid #FF3B1E",borderRadius:"16px",padding:"16px 24px",marginBottom:"20px",display:"inline-flex",gap:"24px",flexWrap:"wrap",justifyContent:"center"}}>
                  {[["💰",champion.price],["⚡",champion.power],["⛽",champion.fuel],["💳",champion.monthly]].map(([k,v])=>(
                    <div key={String(k)} style={{textAlign:"center"}}>
                      <div style={{fontSize:"10px",color:"rgba(255,255,255,0.35)"}}>{k}</div>
                      <div style={{fontSize:"13px",fontWeight:800,color:"white"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
                  <button onClick={()=>setTab("rank")} style={{background:"#1847FF",color:"white",border:"none",padding:"12px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>인기도 순위 →</button>
                  <button onClick={()=>start(categ)} style={{background:"rgba(255,255,255,0.08)",color:"white",border:"none",padding:"12px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:700,cursor:"pointer"}}>다시하기 ↺</button>
                  <button onClick={()=>setCateg(null)} style={{background:"transparent",color:"rgba(255,255,255,0.35)",border:"1px solid rgba(255,255,255,0.15)",padding:"12px 24px",borderRadius:"10px",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>카테고리 변경</button>
                </div>
              </div>
            ):L&&R?(
              <>
                <div style={{textAlign:"center",marginBottom:"16px"}}>
                  <div style={{display:"inline-flex",alignItems:"center",gap:"10px",background:"#1A1A2E",border:"1px solid #2A2A4A",borderRadius:"100px",padding:"8px 20px"}}>
                    <span style={{fontSize:"12px",fontWeight:800,color:"#FF3B1E"}}>{RNAMES[round]||`${remaining.length}강`}</span>
                    <span style={{fontSize:"11px",color:"rgba(255,255,255,0.35)"}}>{matchIdx+1}/{total}</span>
                  </div>
                </div>
                <div style={{height:"3px",background:"#1A1A2E",borderRadius:"2px",marginBottom:"20px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${((matchIdx+1)/total)*100}%`,background:"#FF3B1E"}}/>
                </div>
                <p style={{textAlign:"center",fontSize:"14px",color:"rgba(255,255,255,0.35)",marginBottom:"16px",fontWeight:400}}>딱 하나만 가질 수 있다면?</p>
                <div className="bf" style={{display:"flex",gap:"14px",alignItems:"center"}}>
                  {[L,R].map((car,idx)=>(
                    <div key={car.name} className="cc" onClick={()=>choose(car)}>
                      <div style={{fontSize:"38px",textAlign:"center",marginBottom:"10px"}}>{car.emoji}</div>
                      <div style={{fontSize:"10px",fontWeight:800,color:"#1847FF",letterSpacing:"2px",marginBottom:"3px"}}>{car.brand}</div>
                      <div style={{fontSize:"16px",fontWeight:800,color:"white",marginBottom:"6px",lineHeight:1.2}}>{car.name}</div>
                      <div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",lineHeight:1.6,marginBottom:"12px",fontWeight:400}}>{car.desc}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px",marginBottom:"12px"}}>
                        {[["💰",car.price],["⚡",car.power],["⛽",car.fuel],["💳",car.monthly]].map(([k,v])=>(
                          <div key={String(k)} style={{background:"rgba(255,255,255,0.04)",borderRadius:"7px",padding:"5px 7px"}}>
                            <div style={{fontSize:"9px",color:"rgba(255,255,255,0.25)"}}>{k}</div>
                            <div style={{fontSize:"10px",fontWeight:800,color:"rgba(255,255,255,0.75)"}}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{background:idx===0?"#FF3B1E":"#1847FF",borderRadius:"9px",padding:"10px",textAlign:"center",fontSize:"13px",fontWeight:800,color:"white"}}>이 차 선택!</div>
                    </div>
                  ))}
                </div>
                <div style={{textAlign:"center",marginTop:"12px",fontSize:"11px",color:"rgba(255,255,255,0.2)"}}>남은 {remaining.length}대</div>
              </>
            ):null}
          </div>
        )}
      </div>
    </>
  );
}
