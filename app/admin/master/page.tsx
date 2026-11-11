// 📁 저장 경로: app/admin/master/page.tsx
// 운영자 통합관리 — 매물·딜러·상사·소속점·회원·전체 DB 한 화면 관리
"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Shield, RefreshCw, Search, X, ChevronLeft, ChevronRight, Database, Car, Store, Users, LayoutDashboard, Trash2, Save, Activity } from "lucide-react";

/* ───────── 타입 ───────── */
interface FieldMeta { name:string; kind:string; type:string; isList:boolean; isRequired:boolean; isId:boolean; isUpdatedAt:boolean; enumValues?:string[]; hidden?:boolean; readOnly?:boolean; }
interface ModelMeta { name:string; label:string; idField:string; fields:FieldMeta[]; count:number|null; }
interface DealerRow {
  id:number; shopName:string; complexName:string|null; shopPhone:string|null; shopAddr:string|null;
  verified:boolean; rating:number; dealCount:number; createdAt:string;
  user:{ id:number; name:string; email:string; phone:string|null; role:string } | null;
  _count:{ reviews:number };
  cars:{ total:number; available:number; reviewing:number; reserved:number; sold:number; soldAmount:number };
}
interface Overview {
  models:ModelMeta[];
  carStatus:Record<string,number>;
  dealers:DealerRow[];
  complexes:{ complex:string; dealers:number; total:number; available:number; sold:number }[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

/* ───────── 상수 ───────── */
const CAR_STATUS: Record<string,{label:string;color:string;bg:string}> = {
  AVAILABLE:{label:"판매중",color:"#2D8A52",bg:"#EAF6EF"},
  REVIEWING:{label:"검수대기",color:"#E8A020",bg:"#FFF8E0"},
  RESERVED:{label:"예약중",color:"#0066FF",bg:"#EEF5FF"},
  SOLD:{label:"판매완료",color:"#888",bg:"#F0EEE9"},
};
const ROLE_LABEL: Record<string,string> = { USER:"일반", DEALER:"딜러", ADMIN:"관리자" };

/* 전용 탭 컬럼 프리셋 */
const PRESET_COLUMNS: Record<string,string[]> = {
  Car:    ["id","name","brand","year","mileage","price","status","dealer","region","views","createdAt"],
  Dealer: ["id","shopName","complexName","user","shopPhone","verified","rating","_count","dealCount","createdAt"],
  User:   ["id","name","nickname","email","phone","role","provider","dealer","createdAt"],
};

const TABS = [
  { id:"dashboard", label:"전체 현황", icon:LayoutDashboard },
  { id:"Car",       label:"전체 매물", icon:Car },
  { id:"Dealer",    label:"딜러·상사", icon:Store },
  { id:"User",      label:"회원",     icon:Users },
  { id:"db",        label:"전체 DB",  icon:Database },
  { id:"health",    label:"서버 상태", icon:Activity },
] as const;

/* ───────── 유틸 ───────── */
const fmtDate = (v:string) => { const d = new Date(v); return isNaN(d.getTime()) ? v : `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`; };
const won = (n:number) => `${n.toLocaleString()}만원`;

function cellText(key:string, v:unknown): string {
  if (v === null || v === undefined) return "";
  if (key === "dealer" && typeof v === "object") { const d = v as Row; return d.shopName ? `${d.shopName}${d.complexName?` · ${d.complexName}`:""}` : ""; }
  if (key === "user" && typeof v === "object") { const u = v as Row; return `${u.name||""}${u.email?` (${u.email})`:""}`; }
  if (key === "car" && typeof v === "object") return (v as Row).name || "";
  if (key === "_count" && typeof v === "object") return Object.entries(v as Row).map(([k,n])=>`${k} ${n}`).join(" · ");
  if (Array.isArray(v)) return v.length > 3 ? `[${v.length}개]` : v.join(", ");
  if (typeof v === "boolean") return v ? "✓" : "—";
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return fmtDate(v);
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

async function api<T>(url:string, init?:RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers:{ "Content-Type":"application/json", ...(init?.headers||{}) } });
  const d = await res.json().catch(()=>({ success:false, error:"응답 오류" }));
  if (!res.ok || !d.success) throw new Error(d.error || `요청 실패 (${res.status})`);
  return d.data as T;
}

/* ═════════════════════════ 페이지 ═════════════════════════ */
export default function AdminMasterPage() {
  const [tab, setTab] = useState<string>("dashboard");
  const [overview, setOverview] = useState<Overview|null>(null);
  const [ovError, setOvError] = useState("");
  const [dbModel, setDbModel] = useState("Car");
  const [toast, setToast] = useState("");
  /* 대시보드 → 매물탭 필터 연동 */
  const [presetFilter, setPresetFilter] = useState<Record<string,string>>({});

  const loadOverview = useCallback(() => {
    api<Overview>("/api/admin/master")
      .then(d => { setOverview(d); setOvError(""); })
      .catch(e => setOvError(e.message));
  }, []);
  useEffect(() => { loadOverview(); }, [loadOverview]);

  const notify = (msg:string) => { setToast(msg); setTimeout(()=>setToast(""), 2500); };

  const openCarsOf = (filters:Record<string,string>) => { setPresetFilter(filters); setTab("Car"); };

  const activeModel = tab === "db" ? dbModel : tab;
  const modelMeta = overview?.models.find(m => m.name === activeModel);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F8F7F4;color:#1A1A1A;}
        button,input,select,textarea{font-family:'NanumSquareRound',sans-serif;}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;}
        .m-table{width:100%;border-collapse:collapse;font-size:12px;}
        .m-table th{position:sticky;top:0;background:#FAFAF8;text-align:left;padding:10px 12px;font-weight:800;color:#666;border-bottom:1.5px solid #E8E6E1;white-space:nowrap;cursor:pointer;user-select:none;}
        .m-table td{padding:9px 12px;border-bottom:1px solid #F0EEE9;white-space:nowrap;max-width:260px;overflow:hidden;text-overflow:ellipsis;}
        .m-table tbody tr{cursor:pointer;} .m-table tbody tr:hover td{background:#FFF8F6;}
        .m-card{background:white;border-radius:16px;padding:18px 20px;border:1px solid #EEECE7;}
        .m-btn{border:none;border-radius:10px;padding:9px 14px;font-size:12px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:6px;}
        .m-input{border:1.5px solid #E0DDD7;border-radius:10px;padding:9px 12px;font-size:13px;background:white;}
        .m-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
        @media(max-width:900px){.m-grid4{grid-template-columns:repeat(2,1fr);}}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F8F7F4"}}>
        {/* 헤더 */}
        <div style={{background:"#0A0A0A",padding:"16px 24px"}}>
          <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",gap:10}}>
            <Shield size={18} color="#FF3B1E"/>
            <span style={{fontSize:17,fontWeight:800,color:"white"}}>운영자 통합관리</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>모든 데이터 조회·수정·삭제</span>
            <a href="/admin" style={{marginLeft:"auto",fontSize:12,color:"rgba(255,255,255,0.6)",textDecoration:"none"}}>← 기존 관리자 패널</a>
          </div>
        </div>

        <div style={{maxWidth:1400,margin:"0 auto",padding:"16px 16px 80px"}}>
          {/* 탭 */}
          <div style={{display:"flex",gap:6,marginBottom:18,overflowX:"auto",alignItems:"center"}}>
            {TABS.map(t => { const Icon = t.icon; const on = tab===t.id; return (
              <button key={t.id} onClick={()=>{ setTab(t.id); if (t.id!=="Car") setPresetFilter({}); }} className="m-btn" style={{padding:"11px 18px",fontSize:13,background:on?"white":"transparent",color:on?"#FF3B1E":"#888",boxShadow:on?"0 2px 8px rgba(0,0,0,0.06)":"none",whiteSpace:"nowrap"}}>
                <Icon size={15}/>{t.label}
              </button>
            ); })}
            <button onClick={loadOverview} className="m-btn" style={{marginLeft:"auto",background:"white",color:"#666",border:"1px solid #E8E6E1"}}><RefreshCw size={13}/>새로고침</button>
          </div>

          {/* 서버 상태는 DB가 죽어 있어도 볼 수 있어야 하므로 overview와 무관하게 표시 */}
          {tab==="health" && <ServerHealth onNotify={notify}/>}

          {tab!=="health" && ovError && <div className="m-card" style={{color:"#E24B4A",marginBottom:12}}>⚠️ {ovError}</div>}
          {tab!=="health" && !overview && !ovError && <div style={{textAlign:"center",padding:80,color:"#BBB"}}>불러오는 중…</div>}

          {overview && tab==="dashboard" && <Dashboard ov={overview} onOpenCars={openCarsOf} onOpenDealer={()=>setTab("Dealer")}/>}

          {overview && tab==="db" && (
            <div className="m-card" style={{marginBottom:12,display:"flex",gap:8,flexWrap:"wrap"}}>
              {overview.models.map(m => (
                <button key={m.name} onClick={()=>setDbModel(m.name)} className="m-btn" style={{background:dbModel===m.name?"#1A1A1A":"#F4F3EF",color:dbModel===m.name?"white":"#555"}}>
                  {m.label} <span style={{opacity:0.6,fontWeight:600}}>{m.count ?? "?"}</span>
                </button>
              ))}
            </div>
          )}

          {overview && tab!=="dashboard" && tab!=="health" && modelMeta && (
            <DataTable
              key={`${activeModel}-${JSON.stringify(presetFilter)}`}
              model={modelMeta}
              columns={tab==="db" ? undefined : PRESET_COLUMNS[activeModel]}
              initialFilters={tab==="Car" ? presetFilter : {}}
              dealers={overview.dealers}
              onChanged={(msg)=>{ notify(msg); loadOverview(); }}
              onError={(msg)=>notify(`⚠️ ${msg}`)}
            />
          )}
        </div>
      </div>

      {toast && <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"#1A1A1A",color:"white",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700,zIndex:2000,boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>{toast}</div>}
    </>
  );
}

/* ═════════════════════════ 전체 현황 ═════════════════════════ */
function Dashboard({ ov, onOpenCars, onOpenDealer }:{ ov:Overview; onOpenCars:(f:Record<string,string>)=>void; onOpenDealer:()=>void }) {
  const [q, setQ] = useState("");
  const totalCars = Object.values(ov.carStatus).reduce((a,b)=>a+b,0);
  const soldAmount = ov.dealers.reduce((s,d)=>s+d.cars.soldAmount,0);
  const count = (n:string) => ov.models.find(m=>m.name===n)?.count ?? 0;

  const dealers = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return ov.dealers;
    return ov.dealers.filter(d => [d.shopName,d.complexName,d.user?.name,d.user?.email,d.shopPhone].some(v => (v||"").toLowerCase().includes(k)));
  }, [ov.dealers, q]);

  return (
    <>
      {/* 요약 카드 */}
      <div className="m-grid4" style={{marginBottom:14}}>
        {[
          { label:"전체 매물", value:`${totalCars}대`, color:"#1A1A1A", onClick:()=>onOpenCars({}) },
          { label:"판매중", value:`${ov.carStatus.AVAILABLE||0}대`, color:"#2D8A52", onClick:()=>onOpenCars({"f.status":"AVAILABLE"}) },
          { label:"검수대기 · 예약중", value:`${ov.carStatus.REVIEWING||0} · ${ov.carStatus.RESERVED||0}대`, color:"#E8A020", onClick:()=>onOpenCars({"f.status":"REVIEWING"}) },
          { label:"판매완료", value:`${ov.carStatus.SOLD||0}대`, sub: soldAmount ? `누적 ${won(soldAmount)}` : "", color:"#FF3B1E", onClick:()=>onOpenCars({"f.status":"SOLD"}) },
          { label:"딜러·상사", value:`${ov.dealers.length}곳`, sub:`인증 ${ov.dealers.filter(d=>d.verified).length}곳`, color:"#0066FF", onClick:onOpenDealer },
          { label:"소속 단지", value:`${ov.complexes.filter(c=>c.complex!=="(소속 없음)").length}곳`, color:"#9B30FF" },
          { label:"회원", value:`${count("User")}명`, color:"#1A1A1A" },
          { label:"문의 · 구매", value:`${count("Inquiry")} · ${count("Purchase")}건`, color:"#1A1A1A" },
        ].map(c => (
          <div key={c.label} className="m-card" onClick={c.onClick} style={{cursor:c.onClick?"pointer":"default"}}>
            <div style={{fontSize:12,color:"#999",marginBottom:6}}>{c.label}</div>
            <div style={{fontSize:22,fontWeight:800,color:c.color}}>{c.value}</div>
            {c.sub && <div style={{fontSize:11,color:"#AAA",marginTop:4}}>{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* 소속점(단지)별 */}
      <div className="m-card" style={{marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:800,marginBottom:12}}>🏢 소속 단지별 현황</div>
        {ov.complexes.length===0 ? <div style={{color:"#BBB",fontSize:13}}>등록된 상사가 없습니다</div> : (
          <div style={{overflowX:"auto"}}>
            <table className="m-table"><thead><tr><th>소속 단지</th><th>상사 수</th><th>등록 매물</th><th>판매중</th><th>판매완료</th></tr></thead>
              <tbody>{ov.complexes.map(c=>(
                <tr key={c.complex} style={{cursor:"default"}}><td style={{fontWeight:800}}>{c.complex}</td><td>{c.dealers}</td><td>{c.total}</td><td style={{color:"#2D8A52"}}>{c.available}</td><td style={{color:"#FF3B1E",fontWeight:800}}>{c.sold}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* 상사별 판매 현황 */}
      <div className="m-card">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
          <div style={{fontSize:15,fontWeight:800}}>🏪 상사별 매물 · 판매 현황</div>
          <span style={{fontSize:11,color:"#AAA"}}>행을 누르면 그 상사의 매물 목록으로 이동</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="상사명·단지·딜러·연락처 검색" className="m-input" style={{marginLeft:"auto",minWidth:220}}/>
        </div>
        {dealers.length===0 ? <div style={{color:"#BBB",fontSize:13,padding:"20px 0"}}>{ov.dealers.length===0?"등록된 딜러·상사가 없습니다":"검색 결과 없음"}</div> : (
          <div style={{overflowX:"auto"}}>
            <table className="m-table">
              <thead><tr><th>ID</th><th>상사명</th><th>소속 단지</th><th>딜러(계정)</th><th>연락처</th><th>인증</th><th>등록 매물</th><th>판매중</th><th>검수대기</th><th>예약</th><th>판매완료</th><th>판매액</th><th>평점(리뷰)</th><th>가입일</th></tr></thead>
              <tbody>{dealers.map(d=>(
                <tr key={d.id} onClick={()=>onOpenCars({"f.dealerId":String(d.id)})}>
                  <td>{d.id}</td>
                  <td style={{fontWeight:800}}>{d.shopName}</td>
                  <td>{d.complexName||<span style={{color:"#CCC"}}>—</span>}</td>
                  <td>{d.user ? `${d.user.name} (${d.user.email})` : "—"}{d.user && d.user.role!=="DEALER" && d.user.role!=="ADMIN" && <span style={{marginLeft:6,fontSize:10,color:"#E8A020",fontWeight:800}}>승인전</span>}</td>
                  <td>{d.shopPhone||d.user?.phone||""}</td>
                  <td>{d.verified?<span style={{color:"#2D8A52",fontWeight:800}}>인증</span>:<span style={{color:"#CCC"}}>미인증</span>}</td>
                  <td style={{fontWeight:800}}>{d.cars.total}</td>
                  <td style={{color:"#2D8A52"}}>{d.cars.available}</td>
                  <td style={{color:"#E8A020"}}>{d.cars.reviewing}</td>
                  <td style={{color:"#0066FF"}}>{d.cars.reserved}</td>
                  <td style={{color:"#FF3B1E",fontWeight:800}}>{d.cars.sold}</td>
                  <td>{d.cars.soldAmount?won(d.cars.soldAmount):""}</td>
                  <td>{d._count.reviews?`${d.rating.toFixed(1)} (${d._count.reviews})`:<span style={{color:"#CCC"}}>—</span>}</td>
                  <td>{fmtDate(d.createdAt)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* ═════════════════════════ 범용 데이터 테이블 ═════════════════════════ */
function DataTable({ model, columns, initialFilters, dealers, onChanged, onError }:{
  model:ModelMeta; columns?:string[]; initialFilters:Record<string,string>; dealers:DealerRow[];
  onChanged:(msg:string)=>void; onError:(msg:string)=>void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(50);
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const [sort, setSort] = useState(model.idField);
  const [dir, setDir] = useState<"asc"|"desc">("desc");
  const [filters, setFilters] = useState<Record<string,string>>(initialFilters);
  const [editing, setEditing] = useState<Row|null>(null);
  /* 부모 리렌더 때마다 목록이 다시 불려오지 않도록 콜백은 ref로 보관 */
  const onErrorRef = useRef(onError);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  const visibleFields = model.fields.filter(f => !f.hidden);
  const cols = columns ?? visibleFields.map(f => f.name).slice(0, 12);
  const enumFields = visibleFields.filter(f => f.kind==="enum" || f.type==="Boolean");

  /* 현재 조회 조건 → 쿼리스트링. 완료된 조건과 다르면 로딩 중 */
  const query = useMemo(() => {
    const sp = new URLSearchParams({ page:String(page), size:String(size), sort, dir });
    if (q) sp.set("q", q);
    Object.entries(filters).forEach(([k,v]) => v && sp.set(k, v));
    return sp.toString();
  }, [page, size, sort, dir, q, filters]);
  const [loadedQuery, setLoadedQuery] = useState<string|null>(null);
  const loading = loadedQuery !== query;

  const load = useCallback(() => {
    api<{rows:Row[];total:number}>(`/api/admin/master/${model.name}?${query}`)
      .then(d => { setRows(d.rows); setTotal(d.total); })
      .catch(e => onErrorRef.current(e.message))
      .finally(() => setLoadedQuery(query));
  }, [model.name, query]);
  useEffect(() => { load(); }, [load]);

  const toggleSort = (c:string) => {
    if (!visibleFields.some(f=>f.name===c && !f.isList)) return;
    if (sort===c) setDir(dir==="asc"?"desc":"asc"); else { setSort(c); setDir("desc"); }
    setPage(1);
  };

  /* 매물 판매상태 즉시 변경 */
  const quickStatus = async (row:Row, status:string) => {
    try {
      await api(`/api/admin/master/Car/${row.id}`, { method:"PATCH", body:JSON.stringify({ status }) });
      setRows(rs => rs.map(r => r.id===row.id ? { ...r, status } : r));
      onChanged(`#${row.id} → ${CAR_STATUS[status]?.label||status}`);
    } catch (e) { onError((e as Error).message); }
  };

  const pages = Math.max(1, Math.ceil(total/size));
  const label = (n:string) => ({ dealer:"상사", user:"계정", _count:"관련 수", car:"매물" } as Record<string,string>)[n] || n;
  const dealerName = (id:string) => dealers.find(d=>String(d.id)===id)?.shopName;

  return (
    <div className="m-card" style={{padding:0,overflow:"hidden"}}>
      {/* 툴바 */}
      <div style={{padding:"14px 16px",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",borderBottom:"1px solid #F0EEE9"}}>
        <div style={{fontSize:15,fontWeight:800,marginRight:6}}>{model.label} <span style={{fontSize:12,color:"#AAA",fontWeight:600}}>{total.toLocaleString()}건</span></div>
        <form onSubmit={e=>{e.preventDefault(); setQ(qInput.trim()); setPage(1);}} style={{display:"flex",gap:6}}>
          <input value={qInput} onChange={e=>setQInput(e.target.value)} placeholder="검색 (문자 필드 · ID)" className="m-input" style={{minWidth:200}}/>
          <button className="m-btn" style={{background:"#1A1A1A",color:"white"}}><Search size={13}/>검색</button>
        </form>
        {enumFields.map(f => (
          <select key={f.name} value={filters[`f.${f.name}`]||""} onChange={e=>{ setFilters(p=>({ ...p, [`f.${f.name}`]:e.target.value })); setPage(1); }} className="m-input" style={{padding:"8px 10px"}}>
            <option value="">{f.name}: 전체</option>
            {(f.type==="Boolean" ? ["true","false"] : f.enumValues||[]).map(v => (
              <option key={v} value={v}>{model.name==="Car"&&f.name==="status" ? CAR_STATUS[v]?.label||v : model.name==="User"&&f.name==="role" ? ROLE_LABEL[v]||v : v}</option>
            ))}
          </select>
        ))}
        {model.name==="Car" && (
          <select value={filters["f.dealerId"]||""} onChange={e=>{ setFilters(p=>({ ...p, "f.dealerId":e.target.value })); setPage(1); }} className="m-input" style={{padding:"8px 10px",maxWidth:200}}>
            <option value="">상사: 전체</option>
            {dealers.map(d => <option key={d.id} value={String(d.id)}>{d.shopName}</option>)}
          </select>
        )}
        {(Object.values(filters).some(Boolean) || q) && (
          <button onClick={()=>{ setFilters({}); setQ(""); setQInput(""); setPage(1); }} className="m-btn" style={{background:"#F4F3EF",color:"#888"}}><X size={12}/>필터 해제</button>
        )}
        {filters["f.dealerId"] && <span style={{fontSize:12,color:"#0066FF",fontWeight:800}}>· {dealerName(filters["f.dealerId"])}</span>}
      </div>

      {/* 테이블 */}
      <div style={{overflow:"auto",maxHeight:"68vh"}}>
        <table className="m-table">
          <thead><tr>
            {cols.map(c => <th key={c} onClick={()=>toggleSort(c)}>{label(c)}{sort===c ? (dir==="asc"?" ▲":" ▼") : ""}</th>)}
            {model.name==="Car" && <th style={{cursor:"default"}}>판매상태 변경</th>}
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={String(r[model.idField])} onClick={()=>setEditing(r)}>
                {cols.map(c => {
                  if (model.name==="Car" && c==="status") { const s = CAR_STATUS[r.status]; return <td key={c}><span style={{background:s?.bg,color:s?.color,padding:"3px 9px",borderRadius:100,fontWeight:800,fontSize:11}}>{s?.label||r.status}</span></td>; }
                  if (model.name==="Car" && c==="price") return <td key={c} style={{fontWeight:800}}>{won(r.price)}</td>;
                  if (model.name==="User" && c==="role") return <td key={c} style={{fontWeight:800,color:r.role==="ADMIN"?"#FF3B1E":r.role==="DEALER"?"#0066FF":"#888"}}>{ROLE_LABEL[r.role]||r.role}</td>;
                  return <td key={c} title={cellText(c, r[c])}>{cellText(c, r[c])}</td>;
                })}
                {model.name==="Car" && (
                  <td onClick={e=>e.stopPropagation()}>
                    <select value={r.status} onChange={e=>quickStatus(r, e.target.value)} className="m-input" style={{padding:"5px 8px",fontSize:12}}>
                      {Object.entries(CAR_STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </td>
                )}
              </tr>
            ))}
            {!loading && rows.length===0 && <tr><td colSpan={cols.length+1} style={{textAlign:"center",padding:50,color:"#BBB",cursor:"default"}}>데이터가 없습니다</td></tr>}
          </tbody>
        </table>
        {loading && <div style={{textAlign:"center",padding:16,color:"#BBB",fontSize:12}}>불러오는 중…</div>}
      </div>

      {/* 페이지 */}
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,padding:"12px",borderTop:"1px solid #F0EEE9"}}>
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="m-btn" style={{background:"#F4F3EF",color:page<=1?"#CCC":"#555"}}><ChevronLeft size={14}/></button>
        <span style={{fontSize:12,color:"#888",fontWeight:700}}>{page} / {pages}</span>
        <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)} className="m-btn" style={{background:"#F4F3EF",color:page>=pages?"#CCC":"#555"}}><ChevronRight size={14}/></button>
      </div>

      {editing && (
        <EditModal
          model={model} row={editing}
          onClose={()=>setEditing(null)}
          onSaved={(updated)=>{ setRows(rs=>rs.map(r=>r[model.idField]===updated[model.idField]?{...r,...updated}:r)); setEditing(null); onChanged(`${model.label} #${updated[model.idField]} 저장됨`); }}
          onDeleted={(id)=>{ setRows(rs=>rs.filter(r=>r[model.idField]!==id)); setTotal(t=>t-1); setEditing(null); onChanged(`${model.label} #${id} 삭제됨`); }}
        />
      )}
    </div>
  );
}

/* ═════════════════════════ 수정 모달 ═════════════════════════ */
function toInput(f:FieldMeta, v:unknown): string {
  if (v === null || v === undefined) return "";
  if (f.isList) return Array.isArray(v) ? v.join(", ") : String(v);
  if (f.type === "DateTime") { const d = new Date(String(v)); return isNaN(d.getTime()) ? "" : new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16); }
  if (f.type === "Json") return JSON.stringify(v, null, 2);
  return String(v);
}

function EditModal({ model, row, onClose, onSaved, onDeleted }:{
  model:ModelMeta; row:Row; onClose:()=>void; onSaved:(r:Row)=>void; onDeleted:(id:unknown)=>void;
}) {
  const fields = model.fields.filter(f => !f.hidden);
  const id = row[model.idField];
  const [form, setForm] = useState<Record<string,string>>(() => Object.fromEntries(fields.map(f => [f.name, toInput(f, row[f.name])])));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [confirmDel, setConfirmDel] = useState("");

  /* 바뀐 필드만 전송 */
  const changed = fields.filter(f => !f.readOnly && form[f.name] !== toInput(f, row[f.name]));

  const save = async () => {
    if (changed.length===0) { onClose(); return; }
    setSaving(true); setErr("");
    try {
      const body: Record<string,unknown> = {};
      for (const f of changed) {
        const v = form[f.name];
        body[f.name] = f.type==="DateTime" && v ? new Date(v).toISOString() : v;
      }
      const updated = await api<Row>(`/api/admin/master/${model.name}/${id}`, { method:"PATCH", body:JSON.stringify(body) });
      onSaved(updated);
    } catch (e) { setErr((e as Error).message); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    setSaving(true); setErr("");
    try { await api(`/api/admin/master/${model.name}/${id}`, { method:"DELETE" }); onDeleted(id); }
    catch (e) { setErr((e as Error).message); }
    finally { setSaving(false); }
  };

  const Input = ({ f }:{ f:FieldMeta }) => {
    const v = form[f.name];
    const set = (val:string) => setForm(p => ({ ...p, [f.name]:val }));
    const base = { className:"m-input", style:{ width:"100%", background:f.readOnly?"#F8F7F4":"white", color:f.readOnly?"#999":"#1A1A1A" }, disabled:f.readOnly };
    if (f.kind==="enum") return <select {...base} value={v} onChange={e=>set(e.target.value)}>{!f.isRequired&&<option value="">(없음)</option>}{f.enumValues?.map(x=><option key={x} value={x}>{x}</option>)}</select>;
    if (f.type==="Boolean") return <select {...base} value={v} onChange={e=>set(e.target.value)}><option value="true">true</option><option value="false">false</option></select>;
    if (f.type==="DateTime") return <input {...base} type="datetime-local" value={v} onChange={e=>set(e.target.value)}/>;
    if (f.type==="Int"||f.type==="Float") return <input {...base} type="number" step={f.type==="Float"?"any":"1"} value={v} onChange={e=>set(e.target.value)}/>;
    if (f.type==="Json" || f.isList || v.length>80 || /desc|content|message|reply|description|body/i.test(f.name)) return <textarea {...base} rows={f.isList?2:4} value={v} onChange={e=>set(e.target.value)} style={{...base.style,resize:"vertical",lineHeight:1.5}}/>;
    return <input {...base} value={v} onChange={e=>set(e.target.value)}/>;
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:20,width:"100%",maxWidth:720,maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #F0EEE9",display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontSize:16,fontWeight:800}}>{model.label} #{String(id)} 수정</div>
          {changed.length>0 && <span style={{fontSize:11,color:"#FF3B1E",fontWeight:800}}>변경 {changed.length}개</span>}
          <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer"}}><X size={18}/></button>
        </div>

        <div style={{padding:"16px 20px",overflowY:"auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {fields.map(f => {
            const wide = f.type==="Json" || f.isList || /desc|content|message|reply|description|body/i.test(f.name);
            return (
              <label key={f.name} style={{gridColumn:wide?"1 / -1":"auto",display:"block"}}>
                <div style={{fontSize:11,fontWeight:800,color:changed.includes(f)?"#FF3B1E":"#888",marginBottom:4}}>
                  {f.name} <span style={{fontWeight:600,color:"#BBB"}}>{f.type}{f.isList?"[]":""}{f.isRequired?"":"?"}{f.readOnly?" · 수정불가":""}{f.isList?" · 쉼표로 구분":""}</span>
                </div>
                {Input({ f })}
              </label>
            );
          })}
        </div>

        {err && <div style={{margin:"0 20px",padding:"10px 14px",background:"#FFF0ED",color:"#E24B4A",borderRadius:10,fontSize:12,fontWeight:700}}>⚠️ {err}</div>}

        <div style={{padding:"14px 20px",borderTop:"1px solid #F0EEE9",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input value={confirmDel} onChange={e=>setConfirmDel(e.target.value)} placeholder='삭제하려면 "삭제" 입력' className="m-input" style={{width:150,fontSize:12}}/>
          <button onClick={remove} disabled={confirmDel!=="삭제"||saving} className="m-btn" style={{background:confirmDel==="삭제"?"#E24B4A":"#F4F3EF",color:confirmDel==="삭제"?"white":"#CCC"}}><Trash2 size={13}/>삭제</button>
          <button onClick={onClose} className="m-btn" style={{marginLeft:"auto",background:"#F4F3EF",color:"#666"}}>취소</button>
          <button onClick={save} disabled={saving} className="m-btn" style={{background:"#FF3B1E",color:"white"}}><Save size={13}/>{saving?"저장 중…":"저장"}</button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════ 서버 상태 ═════════════════════════ */
interface Health {
  checkedAt: string;
  db: { ok:boolean; provider?:string; providerNote?:string; sizeBytes?:number; limitMB:number; pingMs?:number; connections?:number; maxConnections?:number; tables?:{name:string;bytes:number;rows:number}[]; error?:string };
  traffic: { ok:boolean; liveNow?:number; liveWindowMin?:number; today?:number; yesterday?:number; daily?:{date:string;count:number}[]; hourly?:number[]; visitRowsTotal?:number; error?:string };
  server: { region:string; env?:string; commit:string; node:string };
  cloudinary: { configured:boolean; plan?:string; creditsUsed?:number; creditsLimit?:number; storageBytes?:number; bandwidthBytes?:number; transformations?:number; lastUpdated?:string; error?:string };
}

const mb = (b:number) => b >= 1024**3 ? `${(b/1024**3).toFixed(2)}GB` : `${(b/1024**2).toFixed(1)}MB`;
/* 사용률 → 상태 (70% 주의, 90% 위험) */
const level = (pct:number) => pct >= 90 ? { c:"#E24B4A", bg:"#FFF0ED", t:"위험" } : pct >= 70 ? { c:"#E8A020", bg:"#FFF8E0", t:"주의" } : { c:"#2D8A52", bg:"#EAF6EF", t:"정상" };
const REGION_NAME: Record<string,string> = { icn1:"서울", hnd1:"도쿄", kix1:"오사카", sin1:"싱가포르", iad1:"미국 동부", sfo1:"미국 서부", pdx1:"미국 서부", fra1:"프랑크푸르트", local:"로컬" };

function Meter({ label, used, limit, unit, sub }:{ label:string; used:number; limit:number; unit:(n:number)=>string; sub?:string }) {
  const pct = limit > 0 ? Math.min(100, (used/limit)*100) : 0;
  const lv = level(pct);
  return (
    <div className="m-card">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:12,color:"#999"}}>{label}</span>
        <span style={{fontSize:11,fontWeight:800,color:lv.c,background:lv.bg,padding:"2px 8px",borderRadius:100}}>{lv.t} {pct.toFixed(pct<10?1:0)}%</span>
      </div>
      <div style={{fontSize:20,fontWeight:800}}>{unit(used)} <span style={{fontSize:12,color:"#AAA",fontWeight:600}}>/ {unit(limit)}</span></div>
      <div style={{height:8,background:"#F0EEE9",borderRadius:100,marginTop:10,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:lv.c,borderRadius:100,transition:"width .4s"}}/></div>
      {sub && <div style={{fontSize:11,color:"#AAA",marginTop:6}}>{sub}</div>}
    </div>
  );
}

function Bars({ data, labels, color }:{ data:number[]; labels:string[]; color:string }) {
  const max = Math.max(1, ...data);
  return (
    <div>
      <div style={{display:"flex",alignItems:"flex-end",gap:3,height:90}}>
        {data.map((v,i)=>(
          <div key={i} title={`${labels[i]}: ${v}`} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%"}}>
            {v>0 && <div style={{fontSize:9,color:"#999",marginBottom:2}}>{v}</div>}
            <div style={{width:"100%",height:`${(v/max)*70}px`,minHeight:v>0?3:1,background:v>0?color:"#EEE",borderRadius:"3px 3px 0 0"}}/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:3,marginTop:4}}>
        {labels.map((l,i)=><div key={i} style={{flex:1,textAlign:"center",fontSize:9,color:"#BBB",overflow:"hidden",whiteSpace:"nowrap"}}>{l}</div>)}
      </div>
    </div>
  );
}

function ServerHealth({ onNotify }:{ onNotify:(m:string)=>void }) {
  const [h, setH] = useState<Health|null>(null);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);
  const [cleaning, setCleaning] = useState(false);

  /* 30초마다 자동 새로고침 (탭이 보이지 않으면 다음 주기로 미룸) */
  useEffect(() => {
    let alive = true;
    api<Health>("/api/admin/master/health")
      .then(d => { if (alive) { setH(d); setErr(""); } })
      .catch(e => { if (alive) setErr(e.message); });
    const t = setTimeout(() => setTick(x => x + 1), document.visibilityState === "visible" ? 30000 : 60000);
    return () => { alive = false; clearTimeout(t); };
  }, [tick]);

  const cleanup = async () => {
    if (!confirm("90일이 지난 방문 로그를 삭제할까요? (방문 통계의 오래된 기록이 사라집니다)")) return;
    setCleaning(true);
    try {
      const r = await api<{deleted:number;before:string}>("/api/admin/master/health", { method:"POST", body:JSON.stringify({ action:"cleanup-visitors", days:90 }) });
      onNotify(`방문 로그 ${r.deleted}건 정리 (${r.before} 이전)`); setTick(x=>x+1);
    } catch (e) { onNotify(`⚠️ ${(e as Error).message}`); }
    finally { setCleaning(false); }
  };

  if (err && !h) return <div className="m-card" style={{color:"#E24B4A"}}>⚠️ {err}</div>;
  if (!h) return <div style={{textAlign:"center",padding:80,color:"#BBB"}}>서버 상태 확인 중…</div>;

  const { db, traffic, server, cloudinary } = h;
  const dbPct = db.ok && db.sizeBytes ? (db.sizeBytes/(db.limitMB*1024*1024))*100 : 0;
  const connPct = db.ok && db.maxConnections ? ((db.connections||0)/db.maxConnections)*100 : 0;
  const cldPct = cloudinary.creditsLimit ? ((cloudinary.creditsUsed||0)/cloudinary.creditsLimit)*100 : 0;

  /* 종합 판정 */
  const alerts: string[] = [];
  if (!db.ok) alerts.push("DB에 연결할 수 없습니다 — DB 서버(플랜·크레딧·일시정지) 상태를 확인하세요");
  if (dbPct >= 70) alerts.push(`DB 용량 ${dbPct.toFixed(0)}% — 방문 로그 정리 또는 상위 플랜 검토`);
  if (connPct >= 70) alerts.push(`DB 연결 ${connPct.toFixed(0)}% — 동시 접속 증가, 연결 풀(pooler) 또는 상위 플랜 검토`);
  if (db.ok && (db.pingMs||0) >= 50) alerts.push(`DB 응답 ${db.pingMs}ms — 서버(${REGION_NAME[server.region]||server.region})와 DB 위치가 멀거나 DB 부하가 높음`);
  if (cldPct >= 70) alerts.push(`사진(Cloudinary) 크레딧 ${cldPct.toFixed(0)}% — 이번 달 한도 임박`);
  const overall = !db.ok || dbPct>=90 || connPct>=90 || cldPct>=90 ? level(95) : alerts.length ? level(75) : level(0);

  const daily = traffic.daily || [];
  const hourly = traffic.hourly || [];
  const weekSum = daily.reduce((s,d)=>s+d.count,0);

  return (
    <>
      {/* 종합 */}
      <div className="m-card" style={{marginBottom:14,borderLeft:`5px solid ${overall.c}`,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{fontSize:28}}>{overall.t==="정상"?"🟢":overall.t==="주의"?"🟡":"🔴"}</div>
        <div style={{flex:1,minWidth:220}}>
          <div style={{fontSize:16,fontWeight:800,color:overall.c}}>서버 상태: {overall.t}</div>
          {alerts.length===0
            ? <div style={{fontSize:12,color:"#888",marginTop:2}}>모든 지표가 여유 있습니다. 지금 플랜으로 충분해요.</div>
            : alerts.map(a=><div key={a} style={{fontSize:12,color:"#555",marginTop:3}}>· {a}</div>)}
        </div>
        <div style={{fontSize:11,color:"#AAA",textAlign:"right"}}>
          확인 {new Date(h.checkedAt).toLocaleTimeString("ko-KR")} · 30초마다 자동 갱신<br/>
          서버 위치 <b style={{color:"#555"}}>{REGION_NAME[server.region]||server.region}</b>{server.commit&&` · 배포 ${server.commit}`}
        </div>
      </div>

      {/* 접속자 */}
      <div className="m-grid4" style={{marginBottom:14}}>
        <div className="m-card" style={{background:"#1A1A1A",color:"white"}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,.5)",display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:"#2D8A52",display:"inline-block"}}/>지금 접속 중</div>
          <div style={{fontSize:30,fontWeight:800,marginTop:4}}>{traffic.ok ? traffic.liveNow : "—"}<span style={{fontSize:14,fontWeight:600}}>명</span></div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:2}}>최근 {traffic.liveWindowMin||5}분 내 활동한 브라우저</div>
        </div>
        <div className="m-card"><div style={{fontSize:12,color:"#999"}}>오늘 방문자</div><div style={{fontSize:24,fontWeight:800,marginTop:4}}>{traffic.ok?traffic.today:"—"}<span style={{fontSize:13}}>명</span></div><div style={{fontSize:11,color:"#AAA"}}>어제 {traffic.ok?traffic.yesterday:"—"}명</div></div>
        <div className="m-card"><div style={{fontSize:12,color:"#999"}}>최근 7일 방문자</div><div style={{fontSize:24,fontWeight:800,marginTop:4}}>{traffic.ok?weekSum:"—"}<span style={{fontSize:13}}>명</span></div><div style={{fontSize:11,color:"#AAA"}}>하루 평균 {traffic.ok?Math.round(weekSum/7):"—"}명</div></div>
        <div className="m-card"><div style={{fontSize:12,color:"#999"}}>DB 응답 속도</div><div style={{fontSize:24,fontWeight:800,marginTop:4,color:db.ok?((db.pingMs||0)<20?"#2D8A52":(db.pingMs||0)<50?"#E8A020":"#E24B4A"):"#E24B4A"}}>{db.ok?`${db.pingMs}ms`:"연결 실패"}</div><div style={{fontSize:11,color:"#AAA"}}>서버와 DB가 같은 지역이면 1~5ms</div></div>
      </div>

      {traffic.ok && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:12,marginBottom:14}}>
          <div className="m-card"><div style={{fontSize:13,fontWeight:800,marginBottom:10}}>📅 최근 7일 방문자</div>
            <Bars data={daily.map(d=>d.count)} labels={daily.map(d=>d.date.slice(5))} color="#1847FF"/></div>
          <div className="m-card"><div style={{fontSize:13,fontWeight:800,marginBottom:10}}>🕐 오늘 시간대별 방문 (한국시간)</div>
            <Bars data={hourly} labels={hourly.map((_,i)=>i%3===0?`${i}시`:"")} color="#FF3B1E"/></div>
        </div>
      )}

      {/* 자원 사용량 */}
      <div style={{fontSize:14,fontWeight:800,margin:"4px 0 10px"}}>💾 자원 사용량 <span style={{fontSize:11,color:"#AAA",fontWeight:600}}>70% 주의 · 90% 위험</span></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,marginBottom:14}}>
        {db.ok
          ? <Meter label={`DB 용량 (${db.provider})`} used={db.sizeBytes||0} limit={db.limitMB*1024*1024} unit={mb} sub={db.providerNote}/>
          : <div className="m-card" style={{color:"#E24B4A"}}><div style={{fontSize:12,color:"#999"}}>DB ({db.provider})</div><div style={{fontWeight:800,marginTop:6}}>⚠️ {db.error}</div></div>}
        {db.ok && <Meter label="DB 동시 연결" used={db.connections||0} limit={db.maxConnections||0} unit={n=>`${n}개`} sub="연결이 꽉 차면 사이트 오류 발생"/>}
        {cloudinary.configured && !cloudinary.error && cloudinary.creditsLimit
          ? <Meter label={`사진 크레딧 (Cloudinary ${cloudinary.plan||""})`} used={cloudinary.creditsUsed||0} limit={cloudinary.creditsLimit} unit={n=>n.toFixed(1)} sub={`저장 ${mb(cloudinary.storageBytes||0)} · 전송 ${mb(cloudinary.bandwidthBytes||0)} · 변환 ${(cloudinary.transformations||0).toLocaleString()}회`}/>
          : <div className="m-card"><div style={{fontSize:12,color:"#999"}}>사진 (Cloudinary)</div><div style={{fontSize:12,color:"#888",marginTop:6,lineHeight:1.6}}>{cloudinary.error ? `⚠️ ${cloudinary.error}` : <>사용량을 보려면 Vercel 환경변수에<br/><code>CLOUDINARY_API_KEY</code>, <code>CLOUDINARY_API_SECRET</code> 추가</>}</div></div>}
      </div>

      {/* 테이블별 용량 */}
      {db.ok && db.tables && (
        <div className="m-card" style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
            <div style={{fontSize:13,fontWeight:800}}>🗂 테이블별 용량</div>
            <span style={{fontSize:11,color:"#AAA"}}>방문 로그 {(traffic.visitRowsTotal||0).toLocaleString()}건</span>
            <button onClick={cleanup} disabled={cleaning} className="m-btn" style={{marginLeft:"auto",background:"#F4F3EF",color:"#555"}}><Trash2 size={12}/>{cleaning?"정리 중…":"90일 지난 방문 로그 정리"}</button>
          </div>
          <div style={{overflowX:"auto"}}>
            <table className="m-table"><thead><tr><th>테이블</th><th>용량</th><th>행 수(추정)</th><th style={{width:"40%"}}>비중</th></tr></thead>
              <tbody>{db.tables.map(t=>(
                <tr key={t.name} style={{cursor:"default"}}><td style={{fontWeight:700}}>{t.name}</td><td>{mb(t.bytes)}</td><td>{t.rows.toLocaleString()}</td>
                  <td><div style={{height:6,background:"#F0EEE9",borderRadius:100}}><div style={{width:`${(t.bytes/(db.sizeBytes||1))*100}%`,height:"100%",background:"#1847FF",borderRadius:100}}/></div></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* 비용 판단 가이드 */}
      <div className="m-card" style={{background:"#FAFAF8"}}>
        <div style={{fontSize:13,fontWeight:800,marginBottom:8}}>💡 유료 전환·상위 플랜 판단 기준</div>
        <div style={{fontSize:12,color:"#666",lineHeight:1.9}}>
          · DB 용량·연결이 <b>70%</b>를 넘으면 정리 또는 상위 플랜 준비, <b>90%</b>면 즉시 조치<br/>
          · DB 응답이 계속 <b>50ms 이상</b>이면 서버와 DB를 같은 지역(서울)으로 이전 검토<br/>
          · 딜러 유료 과금·결제를 시작하면 Vercel은 <b>Pro</b>로 전환 (Hobby는 비상업 용도)<br/>
          · 실제 청구 금액: <a href="https://railway.com/account/usage" target="_blank" rel="noreferrer" style={{color:"#1847FF"}}>Railway 사용량</a> · <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" style={{color:"#1847FF"}}>Vercel 대시보드</a> · <a href="https://console.cloudinary.com" target="_blank" rel="noreferrer" style={{color:"#1847FF"}}>Cloudinary 콘솔</a>
        </div>
      </div>
    </>
  );
}
