const { useState, useRef, useEffect, useMemo } = React;
const { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } = Recharts;



const PASSWORD = "teg2026";
const ACCENT   = "#FE1D55";
const GOLD     = "#D4A017";
const TEAL     = "#4ECDC4";
const PURPLE   = "#A78BFA";
const DARK     = "#0A0A0F";
const CARD     = "#111118";
const BORDER   = "#1E1E2E";
const GBGS_COL = "#E01483";
const AM_COL   = "#ED5739";
const COLORS   = ["#FF5C1A","#D4A017","#4ECDC4","#A78BFA","#F59E0B","#34D399","#F87171","#60A5FA","#FB923C","#A3E635"];
const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const URL_KEY  = "teg_sheets_url";
const DATA_KEY = "teg_local_v10";

function getUrl() { try{return localStorage.getItem(URL_KEY)||"";}catch{return "";} }
function saveUrl(u) { try{localStorage.setItem(URL_KEY,u);}catch{} }
function getLocal() { try{const d=localStorage.getItem(DATA_KEY);return d?JSON.parse(d):null;}catch{return null;} }
function saveLocal(d) { try{localStorage.setItem(DATA_KEY,JSON.stringify(d));}catch{} }

// ── Brand detection ───────────────────────────────────────────────────────────
function isGBGS(store="", name="") {
  const s=(store+" "+name).toLowerCase();
  return s.includes("gbgs")||s.includes("great big game");
}
// For combo stores: same store name but item starts with GBGS
function getRowBrand(store="", name="") {
  const n=(name||"").toLowerCase(), s=(store||"").toLowerCase();
  if(n.includes("gbgs")||n.includes("great big game")||
     s.includes("gbgs")||s.includes("great big game")) return "gbgs";
  if(n.includes("adventure mining")||s.includes("adventure mining")||
     n.startsWith("am -")||n.startsWith("am-")||s.includes("adventure mining")) return "am";
  // "AM" alone is too ambiguous — only match if store explicitly says it
  if(s==="am"||s.startsWith("am ")||s.endsWith(" am")) return "am";
  return "teg";
}

// ── Name normalization ────────────────────────────────────────────────────────
function normalizeName(raw="") {
  return raw
    .replace(/^(teg|gbgs)\s*[-–]\s*/i, "")        // strip TEG - / GBGS -
    .replace(/\s*[-/(|]\s*(xs|s|m|l|xl|xxl|2xl|3xl|small|medium|large|x-?large|extra\s*large|one\s*size|os)\s*[)\s]*$/i, "")
    .replace(/\s+\d+\.\s*(xs|s|m|l|xl|xxl|2xl|3xl|small|medium|large)$/i, "") // "Tee 1.s" / "Tee 2.m"
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim()
    .replace(/\w\S*/g, w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase());
}

// ── Parse store from filename ─────────────────────────────────────────────────
function parseFilename(filename) {
  const name = filename.replace(/\.csv$/i,"");
  // Split on underscores only — dates use dashes so "2025-04-01" stays as one part
  const parts = name.split("_");
  // Find first part that looks like a full date (2025-04-01) or just a year (2025)
  const dateIdx = parts.findIndex(p => /^\d{4}(-\d{2}(-\d{2})?)?$/.test(p));
  const skip = new Set(["product","mix","sales","export","report","revel","resova","gbgs","teg","data","the","escape","game","keys","00","bookings","booking"]);
  let city = null;
  if (dateIdx > 0) {
    const cityParts = parts
      .slice(0, dateIdx)
      .filter(p => !skip.has(p.toLowerCase()) && p.length > 1 && !/^\d+$/.test(p));
    if (cityParts.length > 0) {
      city = cityParts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
    }
  }
  const dates = [...name.matchAll(/(\d{4})[_-](\d{2})[_-](\d{2})/g)].map(m=>`${m[1]}-${m[2]}-${m[3]}`);
  return { city, dateFrom: dates[0]||null, dateTo: dates[1]||null };
}

// Normalize store name: strip prefixes, replace hyphens with spaces, title case
function normalizeStore(raw="") {
  const ABBREVS = {
    "dc":"DC","nyc":"NYC","ny":"NY","la":"LA","sf":"SF","nj":"NJ","sc":"SC",
    "nc":"NC","tx":"TX","ca":"CA","fl":"FL","ga":"GA","tn":"TN","co":"CO",
    "va":"VA","md":"MD","pa":"PA","oh":"OH","il":"IL","mn":"MN","mo":"MO",
    "at":"AT","us":"US","uk":"UK","ie":"IE","nv":"NV","az":"AZ","wa":"WA",
    "or":"OR","ut":"UT","nm":"NM","ok":"OK","ar":"AR","ms":"MS","al":"AL",
    "wh":"WH",
  };
  return raw
    .replace(/^the escape (game|keys)\s*[-–]\s*/i,"")
    .replace(/^teg\s*[-–]\s*/i,"")
    .replace(/^gbgs\s*[-–]\s*/i,"")
    .replace(/^great big game show\s*[-–]?\s*/i,"")
    .replace(/^adventure mining\s*[-–]?\s*/i,"")
    .replace(/^am\s*[-–]\s*/i,"")
    .replace(/[-–]+/g," ")
    .replace(/\s+/g," ")
    .trim()
    .replace(/\b\w+/g, w => ABBREVS[w.toLowerCase()] || (w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()));
}
async function sheetsCall(baseUrl, params={}) {
  const url=baseUrl+"?"+new URLSearchParams(params).toString();
  const res=await fetch(url);
  const text=await res.text();
  if(text.trim().startsWith("<")) throw new Error("Apps Script returned HTML — check: Execute as Me, Access Anyone");
  const json=JSON.parse(text);
  if(!json.ok) throw new Error(json.error||"Apps Script error");
  return json;
}
async function ping(url) { return sheetsCall(url,{action:"ping"}); }
async function loadFromSheets(url) { const r=await sheetsCall(url,{action:"load"}); return r.data; }
async function saveToSheets(url, data) {
  const slim=slimify(data);
  const encoded=encodeURIComponent(JSON.stringify(slim));
  if((url+"?action=save&payload="+encoded).length<=5000)
    return sheetsCall(url,{action:"save",payload:encoded});
  await sheetsCall(url,{action:"save",payload:encodeURIComponent(JSON.stringify(slimify({...data,revelRows:[],resovaRows:[]})))});
  for(let i=0;i<slim.rr.length;i+=10)
    await sheetsCall(url,{action:"append",payload:encodeURIComponent(JSON.stringify({rr:slim.rr.slice(i,i+10),sr:[],ts:slim.ts}))});
  for(let i=0;i<slim.sr.length;i+=10)
    await sheetsCall(url,{action:"append",payload:encodeURIComponent(JSON.stringify({rr:[],sr:slim.sr.slice(i,i+10),ts:slim.ts}))});
  return{ok:true};
}
function slimify(d) {
  return{
    ts:d.savedAt,
    rr:(d.revelRows||[]).map(r=>[r.date||"",r.name||"",r.category||"",+(r.units||0),+(r.revenue||0),r.store||"",r.brand||"teg"]),
    sr:(d.resovaRows||[]).map(r=>[r.date||"",r.item||"",+(r.qty||0),+(r.revenue||0),r.store||"",r.brand||"teg"]),
  };
}
function expand(slim) {
  if(!slim)return null;
  return{
    savedAt:slim.ts,
    // Apply normalizeStore on load so hyphens/prefixes get cleaned even on old saved data
    revelRows: (slim.rr||[]).map(r=>({date:r[0],name:r[1],category:r[2],units:r[3],revenue:r[4],store:normalizeStore(r[5]||""),brand:r[6]||"teg"})),
    resovaRows:(slim.sr||[]).map(r=>({date:r[0],item:r[1],qty:r[2],revenue:r[3],store:normalizeStore(r[4]||""),brand:r[5]||"teg"})),
  };
}

// ── CSV parsing ───────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines=text.replace(/^\uFEFF/,"").replace(/\uFEFF/g,"").trim().split(/\r?\n/);
  if(lines.length<2)return[];
  const headers=lines[0].split(",").map(h=>h.trim().replace(/^\uFEFF/,"").replace(/^"|"$/g,"").toLowerCase());
  return lines.slice(1).map(line=>{
    const vals=[];let cur="",q=false;
    for(const ch of line){if(ch==='"')q=!q;else if(ch===","&&!q){vals.push(cur.trim());cur="";}else cur+=ch;}
    vals.push(cur.trim());
    return Object.fromEntries(headers.map((h,i)=>[h,(vals[i]||"").replace(/^"|"$/g,"").trim()]));
  }).filter(r=>Object.values(r).some(v=>v));
}
function fieldFind(h,...c){return h.find(x=>c.some(y=>x.includes(y)))||null;}
function detectType(headers){
  const h=headers.join(" ").toLowerCase();
  return["inventory item","sale net total","payment status","gratuity"].filter(k=>h.includes(k)).length>=1?"resova":"revel";
}

function csvToRevelRows(rows, store) {
  const h=Object.keys(rows[0]);
  const f={
    name:     fieldFind(h,"product name","item name","product","name","description","menu item"),
    qty:      fieldFind(h,"quantity","qty","units","count"),
    price:    fieldFind(h,"unit price","price","cost","rate"),
    total:    fieldFind(h,"total sales inc item discounts","total sales inc","total inc","subtotal","total","revenue","amount","sales","net"),
    date:     fieldFind(h,"date","created","time","order date","transaction date","closed"),
    category: fieldFind(h,"category","department","class","group","type"),
    storeCol: fieldFind(h,"establishment","store","location","site","outlet"),
  };
  return rows
    .filter(row=>{
      const rawName=(f.name?row[f.name]||"":"").toLowerCase();
      if(rawName.includes("gift")) return false;
      return true;
    })
    .map(row=>{
    const rawName = f.name?row[f.name]||"Unknown":"Unknown";
    const rawStore = f.storeCol?row[f.storeCol]||"":"";
    const brand   = getRowBrand(rawStore, rawName); // detect brand from RAW store+name BEFORE any cleaning
    const name    = normalizeName(rawName);
    const units=parseFloat(f.qty?row[f.qty]:1)||1;
    const rev  =parseFloat(f.total?row[f.total]:f.price?(parseFloat(row[f.price]||0)*units):0)||0;
    const cat  =f.category?row[f.category]||"":"";
    // Store priority: CSV store column → filename city → "Unknown"
    const rowStore=normalizeStore(rawStore)||normalizeStore(store||"")||"Unknown";
    let date="";
    if(f.date&&row[f.date]){const d=new Date(row[f.date]);if(!isNaN(d))date=d.toISOString().slice(0,10);}
    return{date,name,category:cat,units,revenue:+rev.toFixed(2),store:rowStore,brand};
  });
}

function csvToResovaRows(rows, store) {
  const h=Object.keys(rows[0]);
  const f={
    item:   fieldFind(h,"inventory item","item","room","experience","activity","service","product"),
    date:   fieldFind(h,"date","sale date","created","start date","session date"),
    total:  fieldFind(h,"sale net total","subtotal","total","amount","price","paid","revenue","net total"),
    status: fieldFind(h,"payment status","status","state"),
    qty:    fieldFind(h,"quantity","qty","sales","guests","players","people"),
    storeCol:fieldFind(h,"store","location","establishment","site","venue","outlet"),
  };
  // Remove last row if it's a grand total row (item is blank or says "total")
  const cleanRows = rows.filter((r,i)=>{
    if(i===rows.length-1){
      const item=(f.item?r[f.item]:"").toLowerCase().trim();
      if(!item||item.includes("total")||item.includes("grand")) return false;
    }
    return true;
  });
  return cleanRows
    .filter(r=>{
      if(f.status&&["cancelled","canceled","refunded","void"].includes((r[f.status]||"").toLowerCase()))return false;
      const item=(f.item?r[f.item]:"").toLowerCase();
      if(item.includes("gift")) return false;
      return true;
    })
    .map(row=>{
      const rawItem=f.item?row[f.item]||"Experience":"Experience";
      const rawStore=f.storeCol?row[f.storeCol]||"":"";
      const brand  = getRowBrand(rawStore, rawItem); // detect brand from RAW store+name BEFORE any cleaning
      const item   = normalizeName(rawItem);
      const qty=parseFloat(f.qty?row[f.qty]:1)||1;
      const rev=parseFloat(f.total?row[f.total]:0)||0;
      // Store priority: CSV store column → filename city → "Unknown"
      const rowStore=normalizeStore(rawStore)||normalizeStore(store||"")||"Unknown";
      let date="";
      if(f.date&&row[f.date]){const d=new Date(row[f.date]);if(!isNaN(d))date=d.toISOString().slice(0,10);}
      return{date,item,qty,revenue:+rev.toFixed(2),store:rowStore,brand};
    });
}


// ── Xola XLSX parser ─────────────────────────────────────────────────────────
function xlsxToXolaRows(workbook, store) {
  const ws = workbook.Sheets["Reservations"];
  if (!ws) return [];
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
  if (raw.length < 3) return [];
  const result = [];
  for (let i = 2; i < raw.length; i++) {
    const row = raw[i];
    if (!row || !row.some(v => v != null)) continue;
    const product    = (row[2] || "").toString();
    const arrivalDate= row[3] || "";
    const baseAmount = parseFloat(row[100]) || 0;
    const coupon     = parseFloat(row[106]) || 0;
    const adjustment = parseFloat(row[107]) || 0;
    const payStatus  = (row[110] || "").toString().toLowerCase();
    const status     = (row[112] || "").toString().toLowerCase();
    if (/cancelled|canceled|refunded|void/.test(payStatus)) continue;
    if (/cancelled|canceled|refunded|void/.test(status)) continue;
    if (!product) continue;
    const revenue = +(baseAmount + coupon + adjustment).toFixed(2);
    const rawName = product.replace(/^\|\s*/, "").trim() || "Unknown";
    if (/gift/i.test(rawName)) continue;
    const rawStore = store || "";
    const brand = getRowBrand(rawStore, rawName);
    const name = normalizeName(rawName);
    const rowStore = normalizeStore(rawStore) || "Unknown";
    let date = "";
    if (arrivalDate) { const d = new Date(arrivalDate); if (!isNaN(d)) date = d.toISOString().slice(0,10); }
    result.push({ date, name, category: "Experience", units: 1, revenue, store: rowStore, brand });
  }
  return result;
}
// ── Aggregate ─────────────────────────────────────────────────────────────────
function aggregate(revelRows, resovaRows, stores, dateFrom, dateTo) {
  const inRange=d=>{if(!d)return true;if(dateFrom&&d<dateFrom)return false;if(dateTo&&d>dateTo)return false;return true;};
  const inStore=s=>!stores.length||stores.includes(s);
  const rr=revelRows.filter(r=>inRange(r.date)&&inStore(r.store));
  const sr=resovaRows.filter(r=>inRange(r.date)&&inStore(r.store));

  // Both Revel and Resova are product sales — combine into one view
  const byMonth={},byProduct={},byStore={};

  rr.forEach(r=>{
    const month=r.date?MONTHS[parseInt(r.date.slice(5,7))-1]:"Unknown";
    if(!byMonth[month])    byMonth[month]    ={month,revenue:0,units:0,transactions:0};
    if(!byProduct[r.name]) byProduct[r.name] ={name:r.name,category:r.category||"",units:0,revenue:0};
    if(!byStore[r.store])  byStore[r.store]  ={store:r.store,revenue:0,units:0};
    byMonth[month].revenue+=r.revenue; byMonth[month].units+=r.units; byMonth[month].transactions++;
    byProduct[r.name].units+=r.units;  byProduct[r.name].revenue+=r.revenue;
    byStore[r.store].revenue+=r.revenue; byStore[r.store].units+=r.units;
  });

  // Resova items are also product sales
  sr.forEach(r=>{
    const month=r.date?MONTHS[parseInt(r.date.slice(5,7))-1]:"Unknown";
    const units=r.qty||1;
    if(!byMonth[month])    byMonth[month]    ={month,revenue:0,units:0,transactions:0};
    if(!byProduct[r.item]) byProduct[r.item] ={name:r.item,category:"",units:0,revenue:0};
    if(!byStore[r.store])  byStore[r.store]  ={store:r.store,revenue:0,units:0};
    byMonth[month].revenue+=r.revenue; byMonth[month].units+=units; byMonth[month].transactions++;
    byProduct[r.item].units+=units;    byProduct[r.item].revenue+=r.revenue;
    byStore[r.store].revenue+=r.revenue; byStore[r.store].units+=units;
  });

  const totalRevenue=+([...rr,...sr].reduce((s,r)=>s+r.revenue,0)).toFixed(2);
  const totalUnits=Math.round(rr.reduce((s,r)=>s+r.units,0)+sr.reduce((s,r)=>s+(r.qty||1),0));
  const topItems=Object.values(byProduct).map(p=>({...p,revenue:+p.revenue.toFixed(2)})).sort((a,b)=>b.revenue-a.revenue);

  return{
    totalRevenue,
    totalUnits,
    avgUnitPrice: totalUnits?+(totalRevenue/totalUnits).toFixed(2):0,
    topItem:      topItems[0]?.name||null,
    monthlyRevenue:MONTHS.filter(m=>byMonth[m]).map(m=>({...byMonth[m],revenue:+byMonth[m].revenue.toFixed(2)})),
    topItems,
    byStore:Object.values(byStore).map(s=>({...s,revenue:+s.revenue.toFixed(2)})).sort((a,b)=>b.revenue-a.revenue),
  };
}

function mockData(){
  const tegStores=["Nashville","Atlanta","Chicago","Denver","Austin"];
  const gbgsStores=["GBGS New York","GBGS Dallas"];
  const items=["Escape Room T-Shirt","Logo Hoodie","Puzzle Book","Keychain Set","Tote Bag","Mug","Cap","Sticker Pack"];
  const gbgsItems=["Icons Tee","Wheel Tee","Game Show Hat"];
  const revelRows=[],resovaRows=[];
  [...tegStores,...gbgsStores].forEach(store=>{
    const its=store.startsWith("GBGS")?gbgsItems:items;
    MONTHS.forEach((_,mi)=>{
      its.forEach(name=>{
        const units=Math.round(1+Math.random()*6);
        revelRows.push({date:`2025-${String(mi+1).padStart(2,"0")}-15`,name,category:"Merchandise",units,revenue:+(units*(10+Math.random()*20)).toFixed(2),store});
      });
      resovaRows.push({date:`2025-${String(mi+1).padStart(2,"0")}-15`,item:"Escape Room Classic",qty:Math.round(5+Math.random()*15),revenue:+(200+Math.random()*400).toFixed(2),store});
    });
  });
  return{revelRows,resovaRows,savedAt:null,isDemo:true};
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Tip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(<div style={{background:"#1A1A2E",border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 14px",fontFamily:"'DM Mono',monospace",fontSize:12}}>
    <div style={{color:"#666",marginBottom:4}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{color:p.color||ACCENT}}>{p.name}: {typeof p.value==="number"&&p.name?.toLowerCase().match(/rev|total|price/)?`$${Number(p.value).toLocaleString()}`:Number(p.value).toLocaleString()}</div>)}
  </div>);
};

function KPI({label,value,sub,color=ACCENT,icon}){
  return(<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"18px 22px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:color}}/>
    <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>{label}</div>
    <div style={{fontSize:24,fontFamily:"'Bebas Neue',sans-serif",color:"#fff",letterSpacing:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:"#444",marginTop:3}}>{sub}</div>}
    {icon&&<div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",fontSize:22,opacity:0.08}}>{icon}</div>}
  </div>);
}

// ── Store Picker ──────────────────────────────────────────────────────────────
function StorePicker({allStores,selected,onChange,accent=ACCENT}){
  const[open,setOpen]=useState(false);
  const[storeSearch,setStoreSearch]=useState("");
  const[dragIdx,setDragIdx]=useState(null);
  const[customOrder,setCustomOrder]=useState([]);
  const ref=useRef();
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);
  useEffect(()=>{
    setCustomOrder(prev=>{
      const existing=prev.filter(s=>allStores.includes(s));
      const newOnes=allStores.filter(s=>!existing.includes(s)).sort();
      return [...existing,...newOnes];
    });
  },[allStores]);

  const label=selected.length===0?"All Stores":selected.length===1?selected[0]:`${selected.length} Stores`;
  const toggle=s=>onChange(selected.includes(s)?selected.filter(x=>x!==s):[...selected,s]);
  // Show selected first, then rest in custom order
  const sorted=[...selected,...customOrder.filter(s=>!selected.includes(s))];
  const filtered=storeSearch?sorted.filter(s=>s.toLowerCase().includes(storeSearch.toLowerCase())):sorted;

  const onDragStart=i=>setDragIdx(i);
  const onDragOver=(e,i)=>{
    e.preventDefault();
    if(dragIdx===null||dragIdx===i)return;
    const next=[...customOrder];
    const[moved]=next.splice(dragIdx,1);
    next.splice(i,0,moved);
    setCustomOrder(next);
    setDragIdx(i);
  };

  return(<div ref={ref} style={{position:"relative"}}>
    <button onClick={()=>setOpen(o=>!o)} style={{padding:"7px 13px",borderRadius:7,background:selected.length?`${accent}22`:"transparent",border:`1px solid ${selected.length?accent:BORDER}`,color:selected.length?accent:"#666",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
      🏪 {label} {open?"▲":"▼"}
    </button>
    {open&&<div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:8,zIndex:100,minWidth:240,maxHeight:380,display:"flex",flexDirection:"column",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
      <div style={{padding:"0 0 6px",borderBottom:`1px solid ${BORDER}`,marginBottom:4,flexShrink:0}}>
        <input value={storeSearch} onChange={e=>setStoreSearch(e.target.value)} placeholder="Search stores…"
          style={{width:"100%",background:DARK,border:`1px solid ${BORDER}`,borderRadius:5,color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:10,padding:"6px 8px",outline:"none",marginBottom:6}}/>
        <div style={{display:"flex",justifyContent:"space-between",padding:"0 2px"}}>
          <button onClick={()=>onChange([])} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Clear</button>
          {!storeSearch&&<span style={{fontSize:9,color:"#333",alignSelf:"center"}}>⠿ drag to reorder</span>}
          <button onClick={()=>onChange([...allStores])} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Select All</button>
        </div>
      </div>
      <div style={{overflowY:"auto",flex:1}}>
        {selected.length>0&&!storeSearch&&<div style={{fontSize:9,color:accent,padding:"4px 10px 2px",letterSpacing:1,textTransform:"uppercase",opacity:0.7}}>Selected</div>}
        {filtered.map((store)=>{
          const orderIdx=customOrder.indexOf(store);
          return(
          <div key={store} draggable={!storeSearch} onDragStart={()=>onDragStart(orderIdx)} onDragOver={e=>onDragOver(e,orderIdx)} onDragEnd={()=>setDragIdx(null)}
            onClick={()=>toggle(store)}
            style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:6,cursor:"pointer",background:selected.includes(store)?`${accent}15`:"transparent",opacity:dragIdx===orderIdx?0.4:1}}>
            {!storeSearch&&<span style={{color:"#2A2A3A",fontSize:12,cursor:"grab",userSelect:"none"}}>⠿</span>}
            <div style={{width:14,height:14,borderRadius:3,border:`1px solid ${selected.includes(store)?accent:BORDER}`,background:selected.includes(store)?accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",flexShrink:0}}>{selected.includes(store)?"✓":""}</div>
            <span style={{fontSize:11,color:selected.includes(store)?"#fff":"#888"}}>{store}</span>
          </div>
        );})}
      </div>
    </div>}
  </div>);
}

// ── Date Range ────────────────────────────────────────────────────────────────
function DateRange({revelRows,resovaRows,dateFrom,dateTo,onChange}){
  const all=[...(revelRows||[]),...(resovaRows||[])].map(r=>r.date).filter(Boolean).sort();
  const min=all[0]?.slice(0,7)||"";const max=all[all.length-1]?.slice(0,7)||"";
  return(<div style={{display:"flex",alignItems:"center",gap:8,background:CARD,border:`1px solid ${BORDER}`,borderRadius:7,padding:"6px 12px"}}>
    <span style={{fontSize:10,color:"#555"}}>📅</span>
    <input type="month" value={dateFrom?.slice(0,7)||""} min={min} max={max} onChange={e=>onChange(e.target.value?e.target.value+"-01":"",dateTo)}
      style={{background:"transparent",border:"none",color:dateFrom?"#888":"#444",fontFamily:"'DM Mono',monospace",fontSize:11,padding:"2px 4px",outline:"none"}}/>
    <span style={{color:"#333"}}>→</span>
    <input type="month" value={dateTo?.slice(0,7)||""} min={min} max={max} onChange={e=>onChange(dateFrom,e.target.value?e.target.value+"-31":"")}
      style={{background:"transparent",border:"none",color:dateTo?"#888":"#444",fontFamily:"'DM Mono',monospace",fontSize:11,padding:"2px 4px",outline:"none"}}/>
    <button onClick={()=>onChange("","")} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>ALL</button>
  </div>);
}

// ── Brand Dashboard (shared by TEG and GBGS tabs) ─────────────────────────────
function BrandDashboard({data,accent,allStores,label}){
  const[selStores,setSelStores]=useState([]);
  const[subtab,setSubtab]=useState("overview");
  const[dateFrom,setDateFrom]=useState("");
  const[dateTo,setDateTo]=useState("");

  const agg=useMemo(()=>aggregate(data.revelRows||[],data.resovaRows||[],selStores,dateFrom,dateTo),[data,selStores,dateFrom,dateTo]);
  const SUBTABS=[{id:"overview",label:"OVERVIEW"},{id:"products",label:"PRODUCTS"},{id:"search",label:"PRODUCT SEARCH"},{id:"compare",label:"COMPARE"},{id:"stores",label:"BY STORE"},{id:"storedetail",label:"DETAILED BY STORE"},{id:"trends",label:"TRENDS"}];
  const[selectedStore,setSelectedStore]=useState(null);
  const[storeDetailSort,setStoreDetailSort]=useState({col:"revenue",dir:"desc"});
  const[productsSort,setProductsSort]=useState({col:"revenue",dir:"desc"});
  const[searchStoreSort,setSearchStoreSort]=useState({col:"revenue",dir:"desc"});
  const[searchTerms,setSearchTerms]=useState([]);
  const[searchInput,setSearchInput]=useState("");
  const[searchStores,setSearchStores]=useState([]);
  const[searchFrom,setSearchFrom]=useState("");
  const[searchTo,setSearchTo]=useState("");
  const[selectedProducts,setSelectedProducts]=useState([]);
  const[compareFrom,setCompareFrom]=useState("");
  const[compareTo,setCompareTo]=useState("");
  const[showCompare,setShowCompare]=useState(false);
  const[cmpProducts,setCmpProducts]=useState([]);
  const[cmpInput,setCmpInput]=useState("");
  const[cmpStores,setCmpStores]=useState([]);
  const[cmpA,setCmpA]=useState({from:"",to:""});
  const[cmpB,setCmpB]=useState({from:"",to:""});
  const[cmpSelProducts,setCmpSelProducts]=useState([]);

  const noData=!agg.totalRevenue&&!agg.totalUnits;

  return(<div>
    {/* Sub-filter bar */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
      <div style={{display:"flex",gap:0,borderBottom:`1px solid ${BORDER}`}}>
        {SUBTABS.map(t=><button key={t.id} onClick={()=>setSubtab(t.id)} style={{padding:"7px 14px",background:"transparent",border:"none",borderBottom:`2px solid ${subtab===t.id?accent:"transparent"}`,color:subtab===t.id?accent:"#555",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1,cursor:"pointer",marginBottom:-1}}>{t.label}</button>)}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        {allStores.length>1&&<StorePicker allStores={allStores} selected={selStores} onChange={setSelStores} accent={accent}/>}
        <DateRange revelRows={data.revelRows} resovaRows={data.resovaRows} dateFrom={dateFrom} dateTo={dateTo} onChange={(f,t)=>{setDateFrom(f);setDateTo(t);}}/>
      </div>
    </div>

    {noData&&<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:36,textAlign:"center"}}>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:"#333",marginBottom:10}}>NO {label} DATA</div>
      <div style={{color:"#555",fontSize:11}}>Upload CSV files to get started</div>
    </div>}

    {!noData&&<>
      {/* OVERVIEW */}
      {subtab==="overview"&&<div className="fu">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
          <KPI label="Merch Revenue" value={`$${(agg.totalRevenue/1000).toFixed(1)}K`} sub={`${agg.totalUnits.toLocaleString()} units sold`} color={accent} icon="💰"/>
          <KPI label="Units Sold" value={agg.totalUnits.toLocaleString()} sub={`$${agg.avgUnitPrice} avg`} color={GOLD} icon="📦"/>
          <KPI label="Avg Unit Price" value={`$${agg.avgUnitPrice}`} sub="per item" color={TEAL} icon="🏷"/>
          <KPI label="Top Seller" value={agg.topItem||"—"} sub={agg.topItems[0]?`$${agg.topItems[0].revenue.toLocaleString()} revenue`:""} color={PURPLE} icon="⭐"/>
        </div>

        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20,marginBottom:14}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Monthly Revenue</div>
          <ResponsiveContainer width="100%" height={210}><BarChart data={agg.monthlyRevenue}><CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A"/><XAxis dataKey="month" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`}/><Tooltip content={<Tip/>}/><Bar dataKey="revenue" fill={accent} radius={[3,3,0,0]} name="Revenue"/></BarChart></ResponsiveContainer>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Top by Revenue</div>
            <ResponsiveContainer width="100%" height={230}><PieChart><Pie data={agg.topItems.slice(0,8)} dataKey="revenue" nameKey="name" cx="50%" cy="45%" outerRadius={78} paddingAngle={3}>{agg.topItems.slice(0,8).map((_,i)=><Cell key={i} fill={COLORS[i%10]}/>)}</Pie><Tooltip content={<Tip/>}/><Legend formatter={v=><span style={{color:"#666",fontSize:9}}>{v.length>20?v.slice(0,20)+"…":v}</span>}/></PieChart></ResponsiveContainer>
          </div>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Top by Units Sold</div>
            <ResponsiveContainer width="100%" height={230}><PieChart><Pie data={[...agg.topItems].sort((a,b)=>b.units-a.units).slice(0,8)} dataKey="units" nameKey="name" cx="50%" cy="45%" outerRadius={78} paddingAngle={3}>{[...agg.topItems].sort((a,b)=>b.units-a.units).slice(0,8).map((_,i)=><Cell key={i} fill={COLORS[i%10]}/>)}</Pie><Tooltip content={<Tip/>}/><Legend formatter={v=><span style={{color:"#666",fontSize:9}}>{v.length>20?v.slice(0,20)+"…":v}</span>}/></PieChart></ResponsiveContainer>
          </div>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Revenue by Category</div>
            <ResponsiveContainer width="100%" height={230}>{(()=>{
              const byCat={};
              agg.topItems.forEach(item=>{const cat=item.category||"Other";if(!byCat[cat])byCat[cat]={name:cat,revenue:0,units:0};byCat[cat].revenue+=item.revenue;byCat[cat].units+=item.units;});
              const catData=Object.values(byCat).sort((a,b)=>b.revenue-a.revenue).slice(0,8);
              return(<PieChart><Pie data={catData} dataKey="revenue" nameKey="name" cx="50%" cy="45%" outerRadius={78} paddingAngle={3}>{catData.map((_,i)=><Cell key={i} fill={COLORS[i%10]}/>)}</Pie><Tooltip content={<Tip/>}/><Legend formatter={v=><span style={{color:"#666",fontSize:9}}>{v.length>20?v.slice(0,20)+"…":v}</span>}/></PieChart>);
            })()}</ResponsiveContainer>
          </div>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Revenue by Store</div>
            <ResponsiveContainer width="100%" height={230}><PieChart><Pie data={agg.byStore.slice(0,8)} dataKey="revenue" nameKey="store" cx="50%" cy="45%" outerRadius={78} paddingAngle={3}>{agg.byStore.slice(0,8).map((_,i)=><Cell key={i} fill={COLORS[i%10]}/>)}</Pie><Tooltip content={<Tip/>}/><Legend formatter={v=><span style={{color:"#666",fontSize:9}}>{v.length>20?v.slice(0,20)+"…":v}</span>}/></PieChart></ResponsiveContainer>
          </div>
        </div>
      </div>}

      {/* PRODUCTS */}
      {subtab==="products"&&<div className="fu">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Top by Revenue</div>
            <ResponsiveContainer width="100%" height={280}><BarChart data={agg.topItems.slice(0,10)} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A" horizontal={false}/><XAxis type="number" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/><YAxis dataKey="name" type="category" width={140} tick={{fill:"#888",fontSize:9}} axisLine={false} tickLine={false}/><Tooltip content={<Tip/>}/><Bar dataKey="revenue" fill={GOLD} radius={[0,3,3,0]} name="Revenue"/></BarChart></ResponsiveContainer>
          </div>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Top by Units</div>
            <ResponsiveContainer width="100%" height={280}><BarChart data={agg.topItems.slice(0,10)} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A" horizontal={false}/><XAxis type="number" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/><YAxis dataKey="name" type="category" width={140} tick={{fill:"#888",fontSize:9}} axisLine={false} tickLine={false}/><Tooltip content={<Tip/>}/><Bar dataKey="units" fill={TEAL} radius={[0,3,3,0]} name="Units"/></BarChart></ResponsiveContainer>
          </div>
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>All Products ({agg.topItems.length})</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{borderBottom:`1px solid ${BORDER}`}}>
                {[
                  {label:"#",      col:null},
                  {label:"Product",col:"name"},
                  {label:"Category",col:"category"},
                  {label:"Units",  col:"units"},
                  {label:"Revenue",col:"revenue"},
                  {label:"Avg Price",col:"avg"},
                  {label:"Share",  col:"share"},
                ].map(({label,col})=>(
                  <th key={label} onClick={()=>{if(!col)return;setProductsSort(s=>s.col===col?{col,dir:s.dir==="asc"?"desc":"asc"}:{col,dir:col==="name"||col==="category"?"asc":"desc"});}}
                    style={{textAlign:"left",padding:"7px 10px",color:productsSort.col===col?accent:"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase",cursor:col?"pointer":"default",userSelect:"none",whiteSpace:"nowrap"}}>
                    {label}{col&&(productsSort.col===col?(productsSort.dir==="asc"?" ▲":" ▼"):" ↕")}
                  </th>
                ))}
              </tr></thead>
              <tbody>{[...agg.topItems].sort((a,b)=>{
                const {col,dir}=productsSort;
                const mul=dir==="asc"?1:-1;
                if(col==="name")    return mul*a.name.localeCompare(b.name);
                if(col==="category")return mul*(a.category||"").localeCompare(b.category||"");
                if(col==="units")   return mul*(a.units-b.units);
                if(col==="revenue") return mul*(a.revenue-b.revenue);
                if(col==="avg")     return mul*((a.units?a.revenue/a.units:0)-(b.units?b.revenue/b.units:0));
                if(col==="share")   return mul*(a.revenue-b.revenue);
                return 0;
              }).map((item,i)=>(
                <tr key={item.name}>
                  <td style={{padding:"8px 10px",color:"#333"}}>{i+1}</td>
                  <td style={{padding:"8px 10px",color:"#ddd"}}>{item.name}</td>
                  <td style={{padding:"8px 10px",color:"#555",fontSize:10}}>{item.category||"—"}</td>
                  <td style={{padding:"8px 10px",color:TEAL}}>{item.units}</td>
                  <td style={{padding:"8px 10px",color:accent}}>${item.revenue.toLocaleString()}</td>
                  <td style={{padding:"8px 10px",color:GOLD}}>${item.units?(item.revenue/item.units).toFixed(2):"—"}</td>
                  <td style={{padding:"8px 10px",minWidth:100}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:3,background:BORDER,borderRadius:2}}><div style={{width:`${Math.round(item.revenue/agg.totalRevenue*100)}%`,height:"100%",background:COLORS[i%10],borderRadius:2}}/></div><span style={{color:"#444",fontSize:10,minWidth:24}}>{Math.round(item.revenue/agg.totalRevenue*100)}%</span></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>}

      {/* PRODUCT SEARCH */}
      {subtab==="search"&&<div className="fu">
        {/* Search tag input */}
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:8}}>
            <div style={{flex:1,minWidth:200,display:"flex",gap:0,background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,overflow:"hidden"}}>
              <input value={searchInput}
                onChange={e=>setSearchInput(e.target.value)}
                onKeyDown={e=>{
                  if((e.key==="Enter"||e.key===",")&&searchInput.trim()){
                    e.preventDefault();
                    const t=searchInput.trim().replace(/,$/,"");
                    if(t&&!searchTerms.includes(t)){setSearchTerms(p=>[...p,t]);setSelectedProducts([]);}
                    setSearchInput("");
                  }
                }}
                placeholder={searchTerms.length?"Add another term… (Enter to add)":"Type a product name and press Enter…"}
                style={{flex:1,padding:"10px 14px",background:"transparent",border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:12,outline:"none"}}/>
              {searchInput.trim()&&<button onClick={()=>{const t=searchInput.trim();if(t&&!searchTerms.includes(t)){setSearchTerms(p=>[...p,t]);setSelectedProducts([]);}setSearchInput("");}}
                style={{padding:"10px 14px",background:accent,border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"}}>+ ADD</button>}
            </div>
            <StorePicker allStores={[...new Set([...(data.revelRows||[]).map(r=>r.store),...(data.resovaRows||[]).map(r=>r.store)].filter(Boolean))].sort()} selected={searchStores} onChange={setSearchStores} accent={accent}/>
            <DateRange revelRows={data.revelRows} resovaRows={data.resovaRows} dateFrom={searchFrom} dateTo={searchTo} onChange={(f,t)=>{setSearchFrom(f);setSearchTo(t);}}/>
          </div>
          {/* Search term tags */}
          {searchTerms.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {searchTerms.map(t=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:6,background:`${accent}22`,border:`1px solid ${accent}55`,borderRadius:20,padding:"4px 10px 4px 12px"}}>
                <span style={{fontSize:11,color:accent}}>{t}</span>
                <button onClick={()=>{setSearchTerms(p=>p.filter(x=>x!==t));setSelectedProducts([]);}} style={{background:"none",border:"none",color:accent,cursor:"pointer",fontSize:13,lineHeight:1,padding:0}}>×</button>
              </div>
            ))}
            <button onClick={()=>{setSearchTerms([]);setSelectedProducts([]);setSearchInput("");}} style={{fontSize:10,color:"#555",background:"none",border:`1px solid ${BORDER}`,borderRadius:20,padding:"4px 10px",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Clear all</button>
          </div>}
        </div>

        {(()=>{
          if(!searchTerms.length) return <div style={{color:"#444",fontSize:12,padding:20,textAlign:"center"}}>Type a product name above and press Enter to search</div>;
          const inRange=d=>{if(!d)return true;if(searchFrom&&d<searchFrom)return false;if(searchTo&&d>searchTo)return false;return true;};
          const inStore=s=>!searchStores.length||searchStores.includes(s);
          // Match rows against ANY search term
          const matchesAny=(name)=>searchTerms.some(t=>name.toLowerCase().includes(t.toLowerCase()));
          const allMatchRevel=(data.revelRows||[]).filter(r=>matchesAny(r.name)&&inRange(r.date)&&inStore(r.store));
          const allMatchResova=(data.resovaRows||[]).filter(r=>matchesAny(r.item)&&inRange(r.date)&&inStore(r.store));
          // All unique product names matching
          const allProductNames=[...new Set([...allMatchRevel.map(r=>r.name),...allMatchResova.map(r=>r.item)])].sort();
          if(!allProductNames.length) return <div style={{color:"#444",fontSize:12,padding:20,textAlign:"center"}}>No products found matching your search terms</div>;
          // If no selection yet, default to all
          const activeProd=selectedProducts.length>0?selectedProducts:allProductNames;
          // Filter to selected products only
          const matchRevel=allMatchRevel.filter(r=>activeProd.includes(r.name));
          const matchResova=allMatchResova.filter(r=>activeProd.includes(r.item));
          // Aggregate
          const byMonth={};
          [...matchRevel,...matchResova.map(r=>({...r,name:r.item,units:r.qty||1}))].forEach(r=>{
            const month=r.date?MONTHS[parseInt(r.date.slice(5,7))-1]:"?";
            if(!byMonth[month])byMonth[month]={month,revenue:0,units:0};
            byMonth[month].revenue+=r.revenue; byMonth[month].units+=r.units||1;
          });
          const monthData=MONTHS.filter(m=>byMonth[m]).map(m=>({...byMonth[m],revenue:+byMonth[m].revenue.toFixed(2)}));
          const byStore={};
          [...matchRevel,...matchResova.map(r=>({...r,name:r.item,units:r.qty||1}))].forEach(r=>{
            if(!byStore[r.store])byStore[r.store]={store:r.store,revenue:0,units:0};
            byStore[r.store].revenue+=r.revenue; byStore[r.store].units+=r.units||1;
          });
          const storeData=Object.values(byStore).sort((a,b)=>b.revenue-a.revenue);
          const totalRev=+([...matchRevel,...matchResova].reduce((s,r)=>s+r.revenue,0)).toFixed(2);
          const totalUnits=Math.round(matchRevel.reduce((s,r)=>s+r.units,0)+matchResova.reduce((s,r)=>s+(r.qty||1),0));
          // Compare period calculation
          const inCompare=d=>{if(!d||!compareFrom||!compareTo)return false;return d>=compareFrom&&d<=compareTo;};
          const cmpRevel=allMatchRevel.filter(r=>activeProd.includes(r.name)&&inCompare(r.date));
          const cmpResova=allMatchResova.filter(r=>activeProd.includes(r.item)&&inCompare(r.date));
          const cmpRev=+([...cmpRevel,...cmpResova].reduce((s,r)=>s+r.revenue,0)).toFixed(2);
          const cmpUnits=Math.round(cmpRevel.reduce((s,r)=>s+r.units,0)+cmpResova.reduce((s,r)=>s+(r.qty||1),0));
          const hasCompare=showCompare&&compareFrom&&compareTo&&(cmpRev>0||cmpUnits>0);
          const pct=(curr,prev)=>{
            if(!prev) return null;
            const d=((curr-prev)/prev*100);
            return {val:Math.abs(d).toFixed(1), up:d>=0};
          };
          const revPct=hasCompare?pct(totalRev,cmpRev):null;
          const unitPct=hasCompare?pct(totalUnits,cmpUnits):null;

          return(<>
            {/* Compare toggle */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <button onClick={()=>setShowCompare(p=>!p)}
                style={{padding:"6px 14px",borderRadius:6,background:showCompare?`${accent}22`:"transparent",border:`1px solid ${showCompare?accent:BORDER}`,color:showCompare?accent:"#555",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>
                {showCompare?"▼ HIDE COMPARE":"⇄ COMPARE TO ANOTHER PERIOD"}
              </button>
              {showCompare&&<DateRange revelRows={data.revelRows} resovaRows={data.resovaRows} dateFrom={compareFrom} dateTo={compareTo} onChange={(f,t)=>{setCompareFrom(f);setCompareTo(t);}}/>}
              {hasCompare&&<span style={{fontSize:10,color:"#555"}}>vs {compareFrom?.slice(0,7)} → {compareTo?.slice(0,7)}</span>}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:16}}>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"18px 22px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:accent}}/>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Total Revenue</div>
                <div style={{fontSize:24,fontFamily:"'Bebas Neue'",color:"#fff",letterSpacing:1}}>${totalRev.toLocaleString()}</div>
                {hasCompare&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                  <span style={{fontSize:11,color:revPct?.up?"#34D399":"#ef4444"}}>{revPct?.up?"▲":"▼"} {revPct?.val}%</span>
                  <span style={{fontSize:10,color:"#444"}}>vs ${cmpRev.toLocaleString()}</span>
                </div>}
              </div>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"18px 22px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:GOLD}}/>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Units Sold</div>
                <div style={{fontSize:24,fontFamily:"'Bebas Neue'",color:"#fff",letterSpacing:1}}>{totalUnits.toLocaleString()}</div>
                {hasCompare&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                  <span style={{fontSize:11,color:unitPct?.up?"#34D399":"#ef4444"}}>{unitPct?.up?"▲":"▼"} {unitPct?.val}%</span>
                  <span style={{fontSize:10,color:"#444"}}>vs {cmpUnits.toLocaleString()}</span>
                </div>}
              </div>
              <KPI label="Stores Selling" value={storeData.length} color={TEAL} icon="🏪"/>
            </div>

            {/* Product selector — checkboxes */}
            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase"}}>Matching Products — {activeProd.length} of {allProductNames.length} selected</div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setSelectedProducts([])} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Select All</button>
                  <button onClick={()=>setSelectedProducts(allProductNames.filter(n=>!selectedProducts.includes(n)||true).map(()=>"__none__"))} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}} onClick={()=>setSelectedProducts(["__none__"])}>Clear All</button>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {allProductNames.map(n=>{
                  const active=selectedProducts.length===0||selectedProducts.includes(n);
                  return(<button key={n} onClick={()=>{
                    if(selectedProducts.length===0){
                      // First click deselects one, keeping all others
                      setSelectedProducts(allProductNames.filter(x=>x!==n));
                    } else if(selectedProducts.includes(n)){
                      const next=selectedProducts.filter(x=>x!==n);
                      setSelectedProducts(next.length?next:[]);
                    } else {
                      setSelectedProducts([...selectedProducts,n]);
                    }
                  }} style={{fontSize:11,color:active?"#fff":"#444",background:active?`${accent}33`:DARK,border:`1px solid ${active?accent:BORDER}`,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontFamily:"'DM Mono',monospace",transition:"all .15s"}}>{n}</button>);
                })}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Sales Over Time</div>
                <ResponsiveContainer width="100%" height={210}><BarChart data={monthData}><CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A"/><XAxis dataKey="month" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/><Tooltip content={<Tip/>}/><Bar dataKey="revenue" fill={accent} radius={[3,3,0,0]} name="Revenue"/></BarChart></ResponsiveContainer>
              </div>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Units Over Time</div>
                <ResponsiveContainer width="100%" height={210}><BarChart data={monthData}><CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A"/><XAxis dataKey="month" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><Tooltip content={<Tip/>}/><Bar dataKey="units" fill={GOLD} radius={[3,3,0,0]} name="Units"/></BarChart></ResponsiveContainer>
              </div>
            </div>
            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>Sales by Store</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:`1px solid ${BORDER}`}}>
                  {[{label:"Store",col:"store"},{label:"Units",col:"units"},{label:"Revenue",col:"revenue"},{label:"Avg/Unit",col:"avg"}].map(({label,col})=>(
                    <th key={label} onClick={()=>setSearchStoreSort(s=>s.col===col?{col,dir:s.dir==="asc"?"desc":"asc"}:{col,dir:col==="store"?"asc":"desc"})}
                      style={{textAlign:"left",padding:"7px 10px",color:searchStoreSort.col===col?accent:"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>
                      {label}{searchStoreSort.col===col?(searchStoreSort.dir==="asc"?" ▲":" ▼"):" ↕"}
                    </th>
                  ))}
                </tr></thead>
                <tbody>{[...storeData].sort((a,b)=>{
                  const {col,dir}=searchStoreSort;
                  const mul=dir==="asc"?1:-1;
                  if(col==="store")  return mul*a.store.localeCompare(b.store);
                  if(col==="units")  return mul*(a.units-b.units);
                  if(col==="revenue")return mul*(a.revenue-b.revenue);
                  if(col==="avg")    return mul*((a.units?a.revenue/a.units:0)-(b.units?b.revenue/b.units:0));
                  return 0;
                }).map(s=>(
                  <tr key={s.store}>
                    <td style={{padding:"8px 10px",color:"#ddd"}}>{s.store}</td>
                    <td style={{padding:"8px 10px",color:TEAL}}>{s.units}</td>
                    <td style={{padding:"8px 10px",color:accent}}>${s.revenue.toLocaleString()}</td>
                    <td style={{padding:"8px 10px",color:GOLD}}>${s.units?(s.revenue/s.units).toFixed(2):"—"}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>);
        })()}
      </div>}

      {/* BY STORE */}
      {subtab==="stores"&&<div className="fu">
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20,marginBottom:14}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Revenue by Store</div>
          <ResponsiveContainer width="100%" height={Math.max(200,agg.byStore.length*34)}><BarChart data={agg.byStore} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A" horizontal={false}/><XAxis type="number" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(1)}K`}/><YAxis dataKey="store" type="category" width={120} tick={{fill:"#888",fontSize:9}} axisLine={false} tickLine={false}/><Tooltip content={<Tip/>}/><Bar dataKey="revenue" name="Revenue" radius={[0,3,3,0]}>{agg.byStore.map((_,i)=><Cell key={i} fill={COLORS[i%10]}/>)}</Bar></BarChart></ResponsiveContainer>
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>All Stores ({agg.byStore.length})</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{borderBottom:`1px solid ${BORDER}`}}>{["#","Store","Units","Revenue","Sales","Avg/Unit","Share"].map(h=><th key={h} style={{textAlign:"left",padding:"7px 10px",color:"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{agg.byStore.map((s,i)=>(
              <tr key={s.store}>
                <td style={{padding:"8px 10px",color:"#333"}}>{i+1}</td>
                <td style={{padding:"8px 10px",color:"#ddd"}}>{s.store}</td>
                <td style={{padding:"8px 10px",color:TEAL}}>{s.units}</td>
                <td style={{padding:"8px 10px",color:accent}}>${s.revenue.toLocaleString()}</td>
                <td style={{padding:"8px 10px",color:"#555"}}>{s.sales||"—"}</td>
                <td style={{padding:"8px 10px",color:GOLD}}>${s.units?(s.revenue/s.units).toFixed(2):"—"}</td>
                <td style={{padding:"8px 10px",minWidth:100}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:3,background:BORDER,borderRadius:2}}><div style={{width:`${Math.round(s.revenue/agg.totalRevenue*100)}%`,height:"100%",background:COLORS[i%10],borderRadius:2}}/></div><span style={{color:"#444",fontSize:10}}>{Math.round(s.revenue/agg.totalRevenue*100)}%</span></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>}

      {/* DETAILED BY STORE */}
      {subtab==="storedetail"&&<div className="fu">
        {/* Store selector — alphabetical 6-column grid, multi-select */}
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase"}}>
              Select Stores {selectedStore&&selectedStore.length>0?`— ${selectedStore.length} selected`:""}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setSelectedStore(agg.byStore.map(s=>s.store))}
                style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Select All</button>
              <button onClick={()=>setSelectedStore(null)}
                style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Clear</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:4}}>
            {[...agg.byStore].sort((a,b)=>a.store.localeCompare(b.store)).map(s=>{
              const isSelected=Array.isArray(selectedStore)&&selectedStore.includes(s.store);
              const toggle=()=>{
                if(!selectedStore||!Array.isArray(selectedStore)){
                  setSelectedStore([s.store]);
                } else if(isSelected){
                  const next=selectedStore.filter(x=>x!==s.store);
                  setSelectedStore(next.length?next:null);
                } else {
                  setSelectedStore([...selectedStore,s.store]);
                }
              };
              return(
                <button key={s.store} onClick={toggle} style={{
                  padding:"9px 12px",borderRadius:7,
                  background:isSelected?`${accent}22`:CARD,
                  border:`1px solid ${isSelected?accent:BORDER}`,
                  color:isSelected?accent:"#777",
                  fontFamily:"'DM Mono',monospace",fontSize:10,
                  cursor:"pointer",textAlign:"left",transition:"all .15s",
                  display:"flex",alignItems:"center",gap:6,
                }}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:isSelected?accent:"#2A2A3A",flexShrink:0}}/>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.store}</span>
                </button>
              );
            })}
          </div>
        </div>

        {(!selectedStore||!selectedStore.length)&&<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:36,textAlign:"center",color:"#444",fontSize:12}}>
          Select one or more stores above to see their product breakdown
        </div>}

        {selectedStore&&selectedStore.length>0&&(()=>{
          const inRange=d=>{if(!d)return true;if(dateFrom&&d<dateFrom)return false;if(dateTo&&d>dateTo)return false;return true;};
          const storeRevel=(data.revelRows||[]).filter(r=>selectedStore.includes(r.store)&&inRange(r.date));
          const storeResova=(data.resovaRows||[]).filter(r=>selectedStore.includes(r.store)&&inRange(r.date));

          const byProduct={};
          storeRevel.forEach(r=>{
            if(!byProduct[r.name])byProduct[r.name]={name:r.name,units:0,revenue:0};
            byProduct[r.name].units+=r.units; byProduct[r.name].revenue+=r.revenue;
          });
          storeResova.forEach(r=>{
            if(!byProduct[r.item])byProduct[r.item]={name:r.item,units:0,revenue:0};
            byProduct[r.item].units+=r.qty||1; byProduct[r.item].revenue+=r.revenue;
          });
          const items=Object.values(byProduct).map(p=>({...p,revenue:+p.revenue.toFixed(2)})).sort((a,b)=>b.revenue-a.revenue);
          const totalRev=+items.reduce((s,i)=>s+i.revenue,0).toFixed(2);
          const totalUnits=items.reduce((s,i)=>s+i.units,0);

          const byMonth={};
          [...storeRevel,...storeResova.map(r=>({...r,name:r.item,units:r.qty||1}))].forEach(r=>{
            const month=r.date?MONTHS[parseInt(r.date.slice(5,7))-1]:"?";
            if(!byMonth[month])byMonth[month]={month,revenue:0,units:0};
            byMonth[month].revenue+=r.revenue; byMonth[month].units+=r.units||1;
          });
          const monthData=MONTHS.filter(m=>byMonth[m]).map(m=>({...byMonth[m],revenue:+byMonth[m].revenue.toFixed(2)}));
          const title=selectedStore.length===1?selectedStore[0]:`${selectedStore.length} Stores Combined`;

          return(<>
            <div style={{background:CARD,border:`1px solid ${accent}33`,borderRadius:10,padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#fff",letterSpacing:2}}>{title}</div>
              <div style={{display:"flex",gap:20}}>
                <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>Revenue</div><div style={{fontSize:16,color:accent,fontFamily:"'Bebas Neue'"}}>${totalRev.toLocaleString()}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>Units</div><div style={{fontSize:16,color:GOLD,fontFamily:"'Bebas Neue'"}}>{totalUnits.toLocaleString()}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>Products</div><div style={{fontSize:16,color:TEAL,fontFamily:"'Bebas Neue'"}}>{items.length}</div></div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Monthly Revenue</div>
                {monthData.length===0?<div style={{color:"#333",fontSize:11}}>No data in range</div>:(()=>{
                  const maxRev=Math.max(...monthData.map(m=>m.revenue),1);
                  return(<div style={{display:"flex",alignItems:"flex-end",gap:6,height:160,paddingBottom:20,position:"relative"}}>
                    {monthData.map((m,i)=>(
                      <div key={m.month} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%",justifyContent:"flex-end"}}>
                        <div style={{fontSize:9,color:accent}}>${m.revenue>=1000?(m.revenue/1000).toFixed(1)+"K":m.revenue}</div>
                        <div style={{width:"100%",background:accent,borderRadius:"3px 3px 0 0",height:`${Math.max(4,Math.round(m.revenue/maxRev*120))}px`,opacity:0.85}}/>
                        <div style={{fontSize:9,color:"#555",whiteSpace:"nowrap"}}>{m.month}</div>
                      </div>
                    ))}
                  </div>);
                })()}
              </div>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Top Products</div>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <PieChart width={200} height={200}>
                    <Pie data={items.slice(0,7)} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={90} paddingAngle={2}>
                      {items.slice(0,7).map((_,i)=><Cell key={i} fill={COLORS[i%10]}/>)}
                    </Pie>
                    <Tooltip content={<Tip/>}/>
                  </PieChart>
                  <div style={{display:"flex",flexDirection:"column",gap:6,flex:1,minWidth:0}}>
                    {items.slice(0,7).map((item,i)=>(
                      <div key={item.name} style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:COLORS[i%10],flexShrink:0}}/>
                        <span style={{fontSize:10,color:"#888",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{item.name}</span>
                        <span style={{fontSize:10,color:COLORS[i%10],flexShrink:0}}>${item.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>All Products ({items.length})</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:`1px solid ${BORDER}`}}>
                  {[
                    {label:"#",    col:null},
                    {label:"Product", col:"name"},
                    {label:"Units",   col:"units"},
                    {label:"Revenue", col:"revenue"},
                    {label:"Avg/Unit",col:"avg"},
                    {label:"Share",   col:"share"},
                  ].map(({label,col})=>(
                    <th key={label} onClick={()=>{
                      if(!col)return;
                      setStoreDetailSort(s=>s.col===col?{col,dir:s.dir==="asc"?"desc":"asc"}:{col,dir:col==="name"?"asc":"desc"});
                    }} style={{textAlign:"left",padding:"7px 10px",color:storeDetailSort.col===col?accent:"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase",cursor:col?"pointer":"default",userSelect:"none",whiteSpace:"nowrap"}}>
                      {label}{col&&(storeDetailSort.col===col?(storeDetailSort.dir==="asc"?" ▲":" ▼"):" ↕")}
                    </th>
                  ))}
                </tr></thead>
                <tbody>{[...items].sort((a,b)=>{
                  const {col,dir}=storeDetailSort;
                  const mul=dir==="asc"?1:-1;
                  if(col==="name")   return mul*a.name.localeCompare(b.name);
                  if(col==="units")  return mul*(a.units-b.units);
                  if(col==="revenue")return mul*(a.revenue-b.revenue);
                  if(col==="avg")    return mul*((a.units?a.revenue/a.units:0)-(b.units?b.revenue/b.units:0));
                  if(col==="share")  return mul*(a.revenue-b.revenue);
                  return 0;
                }).map((item,i)=>(
                  <tr key={item.name}>
                    <td style={{padding:"8px 10px",color:"#333"}}>{i+1}</td>
                    <td style={{padding:"8px 10px",color:"#ddd"}}>{item.name}</td>
                    <td style={{padding:"8px 10px",color:TEAL}}>{item.units}</td>
                    <td style={{padding:"8px 10px",color:accent}}>${item.revenue.toLocaleString()}</td>
                    <td style={{padding:"8px 10px",color:GOLD}}>${item.units?(item.revenue/item.units).toFixed(2):"—"}</td>
                    <td style={{padding:"8px 10px",minWidth:110}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:3,background:BORDER,borderRadius:2}}><div style={{width:`${totalRev?Math.round(item.revenue/totalRev*100):0}%`,height:"100%",background:COLORS[i%10],borderRadius:2}}/></div><span style={{color:"#444",fontSize:10}}>{totalRev?Math.round(item.revenue/totalRev*100):0}%</span></div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>);
        })()}
      </div>}


      {/* COMPARE */}
      {subtab==="compare"&&<div className="fu">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:16}}>

          {/* Step 1: Products */}
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:16}}>
            <div style={{fontSize:10,color:accent,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>① Products</div>
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              <input value={cmpInput} onChange={e=>setCmpInput(e.target.value)}
                onKeyDown={e=>{if((e.key==="Enter"||e.key===",")&&cmpInput.trim()){e.preventDefault();const t=cmpInput.trim();if(!cmpProducts.includes(t)){setCmpProducts(p=>[...p,t]);setCmpSelProducts([]);}setCmpInput("");}}}
                placeholder="Search products… (Enter to add)"
                style={{flex:1,padding:"7px 10px",borderRadius:6,background:DARK,border:`1px solid ${BORDER}`,color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:11,outline:"none"}}/>
              {cmpInput.trim()&&<button onClick={()=>{const t=cmpInput.trim();if(!cmpProducts.includes(t)){setCmpProducts(p=>[...p,t]);setCmpSelProducts([]);}setCmpInput("");}}
                style={{padding:"7px 12px",borderRadius:6,background:accent,border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>+</button>}
            </div>
            {cmpProducts.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
              {cmpProducts.map(t=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:4,background:`${accent}22`,border:`1px solid ${accent}44`,borderRadius:20,padding:"3px 10px 3px 12px"}}>
                  <span style={{fontSize:10,color:accent}}>{t}</span>
                  <button onClick={()=>{setCmpProducts(p=>p.filter(x=>x!==t));setCmpSelProducts([]);}} style={{background:"none",border:"none",color:accent,cursor:"pointer",fontSize:12,lineHeight:1,padding:0}}>×</button>
                </div>
              ))}
            </div>}
            {/* Product checkboxes */}
            {(()=>{
              if(!cmpProducts.length) return null;
              const matchesAny=name=>cmpProducts.some(t=>name.toLowerCase().includes(t.toLowerCase()));
              const inCmpStore=s=>!cmpStores.length||cmpStores.includes(s);
              const allNames=[...new Set([
                ...(data.revelRows||[]).filter(r=>matchesAny(r.name)&&inCmpStore(r.store)).map(r=>r.name),
                ...(data.resovaRows||[]).filter(r=>matchesAny(r.item)&&inCmpStore(r.store)).map(r=>r.item),
              ])].sort();
              if(!allNames.length) return <div style={{fontSize:11,color:"#444"}}>No matches found</div>;
              const active=cmpSelProducts.length>0?cmpSelProducts:allNames;
              return(<div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {allNames.map(n=>{
                  const sel=cmpSelProducts.length===0||cmpSelProducts.includes(n);
                  return(<button key={n} onClick={()=>{
                    if(cmpSelProducts.length===0)setCmpSelProducts(allNames.filter(x=>x!==n));
                    else if(cmpSelProducts.includes(n)){const next=cmpSelProducts.filter(x=>x!==n);setCmpSelProducts(next.length?next:[]);}
                    else setCmpSelProducts([...cmpSelProducts,n]);
                  }} style={{fontSize:10,color:sel?"#fff":"#444",background:sel?`${accent}33`:DARK,border:`1px solid ${sel?accent:BORDER}`,borderRadius:5,padding:"4px 10px",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>{n}</button>);
                })}
              </div>);
            })()}
          </div>

          {/* Step 2: Stores */}
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:16}}>
            <div style={{fontSize:10,color:GOLD,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>② Stores</div>
            <StorePicker allStores={[...new Set([...(data.revelRows||[]).map(r=>r.store),...(data.resovaRows||[]).map(r=>r.store)].filter(Boolean))].sort()} selected={cmpStores} onChange={setCmpStores} accent={accent}/>
            <div style={{fontSize:10,color:"#444",marginTop:8}}>{cmpStores.length===0?"All stores":"Filtering to "+cmpStores.length+" store(s)"}</div>
          </div>

          {/* Step 3: Date ranges */}
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:16}}>
            <div style={{fontSize:10,color:TEAL,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>③ Date Ranges</div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:10,color:accent,marginBottom:4}}>Period A</div>
              <DateRange revelRows={data.revelRows} resovaRows={data.resovaRows} dateFrom={cmpA.from} dateTo={cmpA.to} onChange={(f,t)=>setCmpA({from:f,to:t})}/>
            </div>
            <div>
              <div style={{fontSize:10,color:"#888",marginBottom:4}}>Period B (compare against)</div>
              <DateRange revelRows={data.revelRows} resovaRows={data.resovaRows} dateFrom={cmpB.from} dateTo={cmpB.to} onChange={(f,t)=>setCmpB({from:f,to:t})}/>
            </div>
          </div>
        </div>

        {/* Results */}
        {(()=>{
          if(!cmpProducts.length) return <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:36,textAlign:"center",color:"#444",fontSize:12}}>Add products above to start comparing</div>;
          const matchesAny=name=>cmpProducts.some(t=>name.toLowerCase().includes(t.toLowerCase()));
          const inStore=s=>!cmpStores.length||cmpStores.includes(s);
          const allNames=[...new Set([
            ...(data.revelRows||[]).filter(r=>matchesAny(r.name)&&inStore(r.store)).map(r=>r.name),
            ...(data.resovaRows||[]).filter(r=>matchesAny(r.item)&&inStore(r.store)).map(r=>r.item),
          ])].sort();
          const active=cmpSelProducts.length>0?cmpSelProducts:allNames;
          const inPeriod=(d,from,to)=>{if(!d)return true;if(from&&d<from)return false;if(to&&d>to)return false;return true;};
          const calcPeriod=(from,to)=>{
            const rr=(data.revelRows||[]).filter(r=>active.includes(r.name)&&inStore(r.store)&&inPeriod(r.date,from||"0000",to||"9999"));
            const sr=(data.resovaRows||[]).filter(r=>active.includes(r.item)&&inStore(r.store)&&inPeriod(r.date,from||"0000",to||"9999"));
            const rev=+([...rr,...sr].reduce((s,r)=>s+r.revenue,0)).toFixed(2);
            const units=Math.round(rr.reduce((s,r)=>s+r.units,0)+sr.reduce((s,r)=>s+(r.qty||1),0));
            const byProd={};
            rr.forEach(r=>{if(!byProd[r.name])byProd[r.name]={name:r.name,units:0,revenue:0};byProd[r.name].units+=r.units;byProd[r.name].revenue+=r.revenue;});
            sr.forEach(r=>{if(!byProd[r.item])byProd[r.item]={name:r.item,units:0,revenue:0};byProd[r.item].units+=r.qty||1;byProd[r.item].revenue+=r.revenue;});
            // Monthly breakdown
            const byMonth={};
            [...rr,...sr.map(r=>({...r,name:r.item,units:r.qty||1}))].forEach(r=>{
              const m=r.date?MONTHS[parseInt(r.date.slice(5,7))-1]:"?";
              if(!byMonth[m])byMonth[m]={month:m,revenue:0,units:0};
              byMonth[m].revenue+=r.revenue; byMonth[m].units+=r.units||1;
            });
            const monthly=MONTHS.filter(m=>byMonth[m]).map(m=>({...byMonth[m],revenue:+byMonth[m].revenue.toFixed(2)}));
            return{rev,units,byProd,monthly};
          };
          const a=calcPeriod(cmpA.from||"",cmpA.to||"9999");
          const b=calcPeriod(cmpB.from||"",cmpB.to||"9999");
          const hasA=cmpA.from||cmpA.to;
          const hasB=cmpB.from||cmpB.to;
          const pct=(curr,prev)=>{if(!prev)return null;const d=(curr-prev)/prev*100;return{val:Math.abs(d).toFixed(1),up:d>=0};};
          const revPct=pct(a.rev,b.rev);
          const unitPct=pct(a.units,b.units);
          const allProds=[...new Set([...Object.keys(a.byProd),...Object.keys(b.byProd)])].sort((x,y)=>((a.byProd[y]?.revenue||0)+(b.byProd[y]?.revenue||0))-((a.byProd[x]?.revenue||0)+(b.byProd[x]?.revenue||0)));

          return(<>
            {/* Summary KPIs */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              {[["REVENUE","rev","💰",accent],[" UNITS SOLD","units","📦",GOLD]].map(([lbl,key,ico,col])=>(
                <div key={lbl} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"18px 22px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:col}}/>
                  <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{lbl.trim()}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div>
                      <div style={{fontSize:10,color:accent,marginBottom:3}}>Period A {cmpA.from?`(${cmpA.from.slice(0,7)}→${(cmpA.to||"").slice(0,7)||"…"})`:""}</div>
                      <div style={{fontSize:22,fontFamily:"'Bebas Neue'",color:"#fff"}}>{key==="rev"?`$${a[key].toLocaleString()}`:a[key].toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:"#888",marginBottom:3}}>Period B {cmpB.from?`(${cmpB.from.slice(0,7)}→${(cmpB.to||"").slice(0,7)||"…"})`:""}</div>
                      <div style={{fontSize:22,fontFamily:"'Bebas Neue'",color:"#888"}}>{key==="rev"?`$${b[key].toLocaleString()}`:b[key].toLocaleString()}</div>
                    </div>
                  </div>
                  {hasA&&hasB&&(key==="rev"?revPct:unitPct)&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:13,color:(key==="rev"?revPct:unitPct)?.up?"#34D399":"#ef4444",fontFamily:"'Bebas Neue'"}}>
                      {(key==="rev"?revPct:unitPct)?.up?"▲":"▼"} {(key==="rev"?revPct:unitPct)?.val}%
                    </span>
                    <span style={{fontSize:10,color:"#444"}}>vs Period B</span>
                  </div>}
                </div>
              ))}
            </div>

            {/* Monthly trend chart — Period A vs Period B */}
            {(a.monthly.length>0||b.monthly.length>0)&&<div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20,marginBottom:14}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Revenue Over Time — Period A vs Period B</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A"/>
                  <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(1)}K`}/>
                  <Tooltip content={<Tip/>}/>
                  {a.monthly.length>0&&<Line data={a.monthly} type="monotone" dataKey="revenue" stroke={accent} strokeWidth={2} dot={{fill:accent,r:3}} name="Period A Revenue"/>}
                  {b.monthly.length>0&&<Line data={b.monthly} type="monotone" dataKey="revenue" stroke="#888" strokeWidth={2} dot={{fill:"#888",r:3}} name="Period B Revenue" strokeDasharray="5 5"/>}
                </LineChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:16,marginTop:8,justifyContent:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:2,background:accent}}/><span style={{fontSize:10,color:"#666"}}>Period A</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:2,background:"#888",borderTop:"2px dashed #888"}}/><span style={{fontSize:10,color:"#666"}}>Period B</span></div>
              </div>
            </div>}

            {/* Per-product breakdown */}
            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Product Breakdown — Period A vs Period B</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:`1px solid ${BORDER}`}}>
                  {["Product","A Units","B Units","Unit Δ%","A Revenue","B Revenue","Rev Δ%"].map(h=><th key={h} style={{textAlign:"left",padding:"7px 10px",color:"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}
                </tr></thead>
                <tbody>{allProds.map(name=>{
                  const pa=a.byProd[name]||{units:0,revenue:0};
                  const pb=b.byProd[name]||{units:0,revenue:0};
                  const up=pct(pa.units,pb.units);
                  const rp=pct(pa.revenue,pb.revenue);
                  return(<tr key={name}>
                    <td style={{padding:"8px 10px",color:"#ddd"}}>{name}</td>
                    <td style={{padding:"8px 10px",color:TEAL}}>{pa.units}</td>
                    <td style={{padding:"8px 10px",color:"#555"}}>{pb.units}</td>
                    <td style={{padding:"8px 10px",color:up?(up.up?"#34D399":"#ef4444"):"#444"}}>{up?(up.up?"▲":"▼")+" "+up.val+"%":"—"}</td>
                    <td style={{padding:"8px 10px",color:accent}}>${pa.revenue.toLocaleString()}</td>
                    <td style={{padding:"8px 10px",color:"#555"}}>${pb.revenue.toLocaleString()}</td>
                    <td style={{padding:"8px 10px",color:rp?(rp.up?"#34D399":"#ef4444"):"#444"}}>{rp?(rp.up?"▲":"▼")+" "+rp.val+"%":"—"}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>
          </>);
        })()}
      </div>}

      {/* TRENDS */}
      {subtab==="trends"&&<div className="fu">
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20,marginBottom:14}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Revenue &amp; Units Over Time</div>
          <ResponsiveContainer width="100%" height={240}><LineChart data={agg.monthlyRevenue}><CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A"/><XAxis dataKey="month" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis yAxisId="l" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(1)}K`}/><YAxis yAxisId="r" orientation="right" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><Tooltip content={<Tip/>}/><Line yAxisId="l" type="monotone" dataKey="revenue" stroke={accent} strokeWidth={2} dot={{fill:accent,r:3}} name="Revenue"/><Line yAxisId="r" type="monotone" dataKey="units" stroke={GOLD} strokeWidth={2} dot={{fill:GOLD,r:3}} name="Units"/></LineChart></ResponsiveContainer>
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Monthly Transactions</div>
          <ResponsiveContainer width="100%" height={170}><BarChart data={agg.monthlyRevenue}><CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A"/><XAxis dataKey="month" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/><Tooltip content={<Tip/>}/><Bar dataKey="transactions" fill={TEAL} radius={[3,3,0,0]} name="Transactions"/></BarChart></ResponsiveContainer>
        </div>
      </div>}
    </>}
  </div>);
}

// ── Modals ────────────────────────────────────────────────────────────────────
function PasswordGate({onUnlock}){
  const[pw,setPw]=useState(""),[err,setErr]=useState(false),[shake,setShake]=useState(false);
  const submit=()=>{if(pw===PASSWORD)onUnlock();else{setErr(true);setShake(true);setTimeout(()=>setShake(false),500);}};
  return(<div style={{minHeight:"100vh",background:DARK,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Mono',monospace"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap');*{box-sizing:border-box}@keyframes shake{0%,100%{transform:translateX(0)}25%,75%{transform:translateX(-8px)}50%{transform:translateX(8px)}}@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}.fu{animation:up .3s ease}`}</style>
    <div style={{animation:shake?"shake .4s":"up .5s",background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"48px 52px",textAlign:"center",maxWidth:360,width:"90%"}}>
      <div style={{fontSize:13,letterSpacing:5,marginBottom:6,textTransform:"uppercase"}}>
        <span style={{color:"#FE1D55"}}>TEG</span>
        <span style={{color:"#555"}}> / </span>
        <span style={{color:"#B39DDB"}}>GBGS</span>
        <span style={{color:"#555"}}> / </span>
        <span style={{color:"#F5E17A"}}>AM</span>
      </div>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:40,color:"#fff",letterSpacing:2,marginBottom:28}}>MERCH DASHBOARD</div>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter password" autoFocus
        style={{width:"100%",padding:"11px 14px",borderRadius:8,background:DARK,border:`1px solid ${err?"#ef4444":BORDER}`,color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:14,outline:"none",marginBottom:6}}/>
      {err&&<div style={{color:"#ef4444",fontSize:11,marginBottom:8}}>Incorrect password</div>}
      <button onClick={submit} style={{width:"100%",padding:"11px",borderRadius:8,background:ACCENT,border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:13,cursor:"pointer",marginTop:4}}>SIGN IN</button>
    </div>
  </div>);
}

function SetupModal({onConnect,onSkip}){
  const[url,setUrl]=useState(getUrl()),[status,setStatus]=useState(null),[msg,setMsg]=useState("");
  const test=async()=>{if(!url)return;setStatus("testing");setMsg("");try{await ping(url);setStatus("ok");setMsg("✓ Connected!");}catch(e){setStatus("err");setMsg("✗ "+e.message);}};
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,fontFamily:"'DM Mono',monospace",padding:16}}>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:36,maxWidth:520,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:26,color:"#fff",marginBottom:20}}>CONNECT GOOGLE SHEETS</div>
      <div style={{background:DARK,border:"1px solid #1A2A1A",borderRadius:10,padding:16,marginBottom:18}}>
        {["Open your Google Sheet → Extensions → Apps Script","Paste the Code.gs file → Save","Deploy → New Deployment → Web App","Execute as: Me  |  Who has access: Anyone","Copy the Web App URL → paste below"].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:6,alignItems:"flex-start"}}>
            <div style={{width:18,height:18,borderRadius:"50%",background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",flexShrink:0,marginTop:1}}>{i+1}</div>
            <div style={{fontSize:11,color:"#555",lineHeight:1.5}}>{s}</div>
          </div>
        ))}
      </div>
      <input value={url} onChange={e=>{setUrl(e.target.value);setStatus(null);setMsg("");}} placeholder="https://script.google.com/macros/s/XXXXXXXX/exec"
        style={{width:"100%",padding:"11px 13px",borderRadius:8,background:DARK,border:`1px solid ${BORDER}`,color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:11,outline:"none",marginBottom:8}}/>
      <div style={{display:"flex",gap:10,marginBottom:18,alignItems:"center"}}>
        <button onClick={test} disabled={!url||status==="testing"} style={{padding:"7px 14px",borderRadius:6,background:"transparent",border:`1px solid ${BORDER}`,color:"#666",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>{status==="testing"?"TESTING…":"TEST CONNECTION"}</button>
        {msg&&<div style={{fontSize:11,color:status==="ok"?"#34D399":"#ef4444",flex:1}}>{msg}</div>}
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onSkip} style={{flex:1,padding:"10px",borderRadius:8,background:"transparent",border:`1px solid ${BORDER}`,color:"#555",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"}}>SKIP — USE DEMO</button>
        <button onClick={()=>{saveUrl(url);onConnect(url);}} disabled={!url} style={{flex:2,padding:"10px",borderRadius:8,background:url?ACCENT:"#1A0A00",border:"none",color:url?"#fff":"#5A3A00",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:url?"pointer":"default"}}>SAVE & CONNECT →</button>
      </div>
    </div>
  </div>);
}

function UploadModal({sheetsUrl,existingData,onSave,onClose}){
  const[files,setFiles]=useState([]),[status,setStatus]=useState(null),[error,setError]=useState(null),[drag,setDrag]=useState(false);
  const ref=useRef();
  const readFiles=fileList=>{
    setError(null);
    Array.from(fileList).forEach(file=>{
      if(file.name.endsWith(".xlsx")||file.name.endsWith(".xls")){
        const reader=new FileReader();
        reader.onload=e=>{
          const data=new Uint8Array(e.target.result);
          const workbook=XLSX.read(data,{type:"array"});
          const{city}=parseFilename(file.name);
          setFiles(prev=>[...prev.filter(f=>f.name!==file.name),{name:file.name,workbook,type:"xola",city,rows:[]}]);
        };
        reader.readAsArrayBuffer(file);
      } else if(file.name.endsWith(".csv")){
        const reader=new FileReader();
        reader.onload=e=>{
          const rows=parseCSV(e.target.result);
          const type=rows.length?detectType(Object.keys(rows[0])):"revel";
          const{city,dateFrom,dateTo}=parseFilename(file.name);
          setFiles(prev=>[...prev.filter(f=>f.name!==file.name),{name:file.name,rows,type,city,dateFrom,dateTo}]);
        };
        reader.readAsText(file);
      }
    });
  };
  const upload=async()=>{
    try{
      setError(null);setStatus("processing");
      const ts=new Date().toISOString();

      // Always fetch the latest saved data from Sheets before appending
      // so we never accidentally overwrite data saved by another upload
      let base=existingData;
      if(sheetsUrl){
        try{
          setStatus("loading");
          const slim=await loadFromSheets(sheetsUrl);
          if(slim) base=expand(slim);
        }catch(e){ /* fall back to existingData if fetch fails */ }
      }

      let revelRows=[...(base?.revelRows||[])];
      let resovaRows=[...(base?.resovaRows||[])];
      files.forEach(f=>{
        const store=f.city||"";
        if(f.type==="revel")  revelRows=[...revelRows,...csvToRevelRows(f.rows,store)];
        if(f.type==="resova") resovaRows=[...resovaRows,...csvToResovaRows(f.rows,store)];
        if(f.type==="xola")   revelRows=[...revelRows,...xlsxToXolaRows(f.workbook,store)];
      });
      if(!revelRows.length&&!resovaRows.length)throw new Error("No data found in uploaded files");
      const newData={revelRows,resovaRows,savedAt:ts,isDemo:false};
      setStatus("saving");
      if(sheetsUrl)await saveToSheets(sheetsUrl,newData);
      saveLocal(newData);
      onSave(newData);
    }catch(e){setStatus(null);setError(e.message);}
  };
  const typeColor=t=>t==="revel"?ACCENT:t==="xola"?"#34D399":GOLD;
  const typeLabel=t=>t==="revel"?"Revel":t==="xola"?"Xola":"Resova";
  const busy=!!status;
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:16}}>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:36,maxWidth:540,width:"100%",maxHeight:"90vh",overflowY:"auto",fontFamily:"'DM Mono',monospace"}}>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:26,color:"#fff",marginBottom:4}}>ADD DATA</div>
      <div style={{color:"#555",fontSize:11,marginBottom:4}}>New uploads <span style={{color:"#34D399"}}>add to</span> existing data — nothing is overwritten</div>
      <div style={{fontSize:10,color:"#333",marginBottom:14}}>Supports Revel (CSV), Resova (CSV), Xola (XLSX) · {(existingData?.revelRows?.length||0)+(existingData?.resovaRows?.length||0)} rows currently stored</div>
      <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);readFiles(e.dataTransfer.files);}} onClick={()=>!busy&&ref.current.click()}
        style={{border:`2px dashed ${drag?ACCENT:BORDER}`,borderRadius:10,padding:"24px 20px",cursor:"pointer",textAlign:"center",transition:"all .2s",background:drag?`${ACCENT}08`:"transparent",marginBottom:12}}>
        <div style={{fontSize:24,marginBottom:6}}>📂</div>
        <div style={{color:"#888",fontSize:12}}>Drop files here or click to browse</div>
        <div style={{color:"#3A3A4A",fontSize:11,marginTop:3}}>Revel &amp; Resova (CSV) · Xola (XLSX)</div>
      </div>
      <input ref={ref} type="file" accept=".csv,.xlsx,.xls" multiple style={{display:"none"}} onChange={e=>readFiles(e.target.files)}/>
      {files.length>0&&<div style={{marginBottom:12}}>{files.map(f=>(
        <div key={f.name} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",background:DARK,borderRadius:8,marginBottom:6,border:`1px solid ${typeColor(f.type)}33`}}>
          <span style={{fontSize:14}}>{f.type==="xola"?"📊":"📄"}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:"#ccc",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
            <div style={{display:"flex",gap:8,marginTop:2,flexWrap:"wrap"}}>
              <span style={{fontSize:9,color:typeColor(f.type),letterSpacing:1,textTransform:"uppercase"}}>{typeLabel(f.type)}{f.type!=="xola"?` · ${f.rows.length} rows`:""}</span>
              {f.city?<span style={{fontSize:9,color:"#34D399"}}>📍 {f.city}</span>:<span style={{fontSize:9,color:"#666"}}>⚠ Store not detected — check filename</span>}
              {f.dateFrom&&<span style={{fontSize:9,color:"#444"}}>{f.dateFrom} → {f.dateTo||"?"}</span>}
            </div>
          </div>
          {f.type!=="xola"&&<button onClick={()=>setFiles(p=>p.map(x=>x.name===f.name?{...x,type:x.type==="revel"?"resova":"revel"}:x))} style={{padding:"3px 8px",borderRadius:5,background:"transparent",border:`1px solid ${BORDER}`,color:"#555",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>⇄</button>}
          <button onClick={()=>setFiles(p=>p.filter(x=>x.name!==f.name))} style={{padding:"3px 8px",borderRadius:5,background:"transparent",border:"1px solid #2A0A0A",color:"#ef4444",cursor:"pointer",fontSize:10}}>✕</button>
        </div>
      ))}</div>}
      {error&&<div style={{color:"#ef4444",fontSize:11,marginBottom:12,padding:"9px 13px",background:"#140606",borderRadius:6}}>⚠ {error}</div>}
      <div style={{display:"flex",gap:10}}>
        <button onClick={onClose} disabled={busy} style={{flex:1,padding:"10px",borderRadius:8,background:"transparent",border:`1px solid ${BORDER}`,color:"#555",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"}}>CANCEL</button>
        <button onClick={upload} disabled={busy||!files.length} style={{flex:2,padding:"10px",borderRadius:8,background:busy||!files.length?"#111":ACCENT,border:"none",color:busy||!files.length?"#333":"#fff",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:busy?"wait":"pointer"}}>
          {status==="loading"?"FETCHING LATEST…":status==="processing"?"PROCESSING…":status==="saving"?"SAVING…":"ADD TO DASHBOARD →"}
        </button>
      </div>
    </div>
  </div>);
}

function ManageModal({sheetsUrl,data,onUpdate,onClose}){
  const[status,setStatus]=useState(null);
  const clearSource=async src=>{
    if(!window.confirm(`Remove all ${src==="revel"?"Revel":"Resova"} data?`))return;
    setStatus("saving");
    const nd={...data,[`${src}Rows`]:[],savedAt:new Date().toISOString()};
    if(sheetsUrl)await saveToSheets(sheetsUrl,nd).catch(()=>{});
    saveLocal(nd);onUpdate(nd);setStatus(null);
  };
  const clearAll=async()=>{
    if(!window.confirm("Clear ALL data?"))return;
    setStatus("saving");
    const empty={revelRows:[],resovaRows:[],savedAt:new Date().toISOString(),isDemo:false};
    if(sheetsUrl)await saveToSheets(sheetsUrl,empty).catch(()=>{});
    saveLocal(null);onUpdate(null);setStatus(null);onClose();
  };
  const rc=data?.revelRows?.length||0,sc=data?.resovaRows?.length||0;
  const rd=data?.revelRows?.filter(r=>r.date).map(r=>r.date).sort()||[];
  const sd=data?.resovaRows?.filter(r=>r.date).map(r=>r.date).sort()||[];
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,fontFamily:"'DM Mono',monospace"}}>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:36,maxWidth:460,width:"100%"}}>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:26,color:"#fff",marginBottom:16}}>MANAGE DATA</div>
      {[["revel","Revel Sales",rc,rd,ACCENT],[" resova","Resova Sales",sc,sd,GOLD]].map(([src,lbl,count,dates,col])=>(
        <div key={src} style={{background:DARK,border:`1px solid ${count?col+"33":BORDER}`,borderRadius:10,padding:14,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:11,color:count?col:"#444",letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>{count?`✓ ${lbl}`:`○ No ${lbl}`}</div>
              {count>0&&<div style={{fontSize:10,color:"#444"}}>{count} rows · {dates[0]} → {dates[dates.length-1]}</div>}
            </div>
            {count>0&&<button onClick={()=>clearSource(src.trim())} disabled={!!status} style={{padding:"5px 10px",borderRadius:6,background:"transparent",border:"1px solid #2A0A0A",color:"#ef4444",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>CLEAR</button>}
          </div>
        </div>
      ))}
      <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:14,marginTop:14,display:"flex",gap:10}}>
        <button onClick={clearAll} disabled={!!status} style={{flex:1,padding:"9px",borderRadius:8,background:"transparent",border:"1px solid #2A0A0A",color:"#ef4444",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>CLEAR ALL</button>
        <button onClick={()=>{if(!window.confirm("Disconnect?"))return;saveUrl("");window.location.reload();}} style={{flex:1,padding:"9px",borderRadius:8,background:"transparent",border:`1px solid ${BORDER}`,color:"#555",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>DISCONNECT</button>
      </div>
      {status&&<div style={{color:"#888",fontSize:11,marginTop:10}}>Saving…</div>}
      <button onClick={onClose} style={{width:"100%",padding:"10px",borderRadius:8,background:"transparent",border:`1px solid ${BORDER}`,color:"#666",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer",marginTop:12}}>CLOSE</button>
    </div>
  </div>);
}

// ── Main App ──────────────────────────────────────────────────────────────────
function App(){
  const[auth,setAuth]=useState(false);
  const[sheetsUrl,setSheetsUrl]=useState(getUrl);
  const[showSetup,setShowSetup]=useState(false);
  const[showUpload,setShowUpload]=useState(false);
  const[showManage,setShowManage]=useState(false);
  const[rawData,setRawData]=useState(null);
  const[loading,setLoading]=useState(false);
  const[loadErr,setLoadErr]=useState(null);
  const[brand,setBrand]=useState("teg"); // "teg" | "gbgs"

  useEffect(()=>{
    if(!auth)return;
    const local=getLocal();
    if(local){setRawData(local);return;}
    const url=getUrl();
    if(!url){setShowSetup(true);return;}
    fetchData(url);
  },[auth]);

  const fetchData=async url=>{
    setLoading(true);setLoadErr(null);
    try{const slim=await loadFromSheets(url);if(slim){const d=expand(slim);setRawData(d);saveLocal(d);}else setShowUpload(true);}
    catch(e){setLoadErr(e.message);}
    setLoading(false);
  };

  // Split raw data by brand
  const tegData=useMemo(()=>({
    revelRows: (rawData?.revelRows||[]).filter(r=>(r.brand||getRowBrand(r.store,r.name))==="teg"),
    resovaRows:(rawData?.resovaRows||[]).filter(r=>(r.brand||getRowBrand(r.store,r.item))==="teg"),
  }),[rawData]);

  const gbgsData=useMemo(()=>({
    revelRows: (rawData?.revelRows||[]).filter(r=>(r.brand||getRowBrand(r.store,r.name))==="gbgs"),
    resovaRows:(rawData?.resovaRows||[]).filter(r=>(r.brand||getRowBrand(r.store,r.item))==="gbgs"),
  }),[rawData]);

  const amData=useMemo(()=>({
    revelRows: (rawData?.revelRows||[]).filter(r=>(r.brand||getRowBrand(r.store,r.name))==="am"),
    resovaRows:(rawData?.resovaRows||[]).filter(r=>(r.brand||getRowBrand(r.store,r.item))==="am"),
  }),[rawData]);

  const tegStores =useMemo(()=>[...new Set(tegData.revelRows.map(r=>r.store).filter(Boolean))],[tegData]);
  const gbgsStores=useMemo(()=>[...new Set(gbgsData.revelRows.map(r=>r.store).filter(Boolean))],[gbgsData]);
  const amStores  =useMemo(()=>[...new Set(amData.revelRows.map(r=>r.store).filter(Boolean))],[amData]);

  const hasGBGS=gbgsData.revelRows.length>0||gbgsData.resovaRows.length>0;
  const hasAM  =amData.revelRows.length>0||amData.resovaRows.length>0;

  if(!auth)return <PasswordGate onUnlock={()=>setAuth(true)}/>;

  return(<div style={{minHeight:"100vh",background:DARK,fontFamily:"'DM Mono',monospace",color:"#fff"}}>
    <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#222;border-radius:2px}tr:hover td{background:#13131F!important}input[type=month]{color-scheme:dark}`}</style>
    {showSetup&&<SetupModal onConnect={url=>{setSheetsUrl(url);setShowSetup(false);fetchData(url);}} onSkip={()=>{setShowSetup(false);setRawData(mockData());}}/>}
    {showUpload&&<UploadModal sheetsUrl={sheetsUrl} existingData={rawData} onSave={d=>{setRawData(d);setShowUpload(false);}} onClose={()=>setShowUpload(false)}/>}
    {showManage&&<ManageModal sheetsUrl={sheetsUrl} data={rawData} onUpdate={d=>setRawData(d)} onClose={()=>setShowManage(false)}/>}

    {/* Header */}
    <div style={{background:CARD,borderBottom:`1px solid ${BORDER}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:0}}>
        {/* Brand tabs in header */}
        <div style={{fontFamily:"'Bebas Neue'",fontSize:20,letterSpacing:3,marginRight:20}}>
          <span style={{color:brand==="teg"?ACCENT:"#555",cursor:"pointer"}} onClick={()=>setBrand("teg")}>TEG</span>
          {hasGBGS&&<><span style={{color:"#333",margin:"0 8px"}}>|</span><span style={{color:brand==="gbgs"?GBGS_COL:"#555",cursor:"pointer"}} onClick={()=>setBrand("gbgs")}>GBGS</span></>}
          {hasAM&&<><span style={{color:"#333",margin:"0 8px"}}>|</span><span style={{color:brand==="am"?AM_COL:"#555",cursor:"pointer"}} onClick={()=>setBrand("am")}>AM</span></>}
          <span style={{color:"#333",marginLeft:6,fontSize:12,fontFamily:"'DM Mono',monospace",letterSpacing:1}}> MERCH</span>
        </div>
        {rawData?.isDemo&&<span style={{fontSize:9,color:GOLD,border:`1px solid ${GOLD}44`,padding:"2px 7px",borderRadius:4}}>DEMO</span>}
        {rawData&&!rawData.isDemo&&<span style={{fontSize:9,color:"#34D399",border:"1px solid #34D39944",padding:"2px 7px",borderRadius:4}}>● LIVE</span>}
        {rawData?.savedAt&&!rawData.isDemo&&<span style={{fontSize:9,color:"#333",marginLeft:8}}>{(rawData.revelRows?.length||0)+(rawData.resovaRows?.length||0)} rows</span>}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {sheetsUrl&&<button onClick={()=>fetchData(sheetsUrl)} disabled={loading} style={{padding:"5px 10px",borderRadius:6,background:"transparent",border:`1px solid ${BORDER}`,color:"#555",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>↻</button>}
        {sheetsUrl&&<button onClick={()=>setShowManage(true)} style={{padding:"5px 10px",borderRadius:6,background:"transparent",border:`1px solid ${BORDER}`,color:"#555",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>⚙</button>}
        <button onClick={()=>sheetsUrl?setShowUpload(true):setShowSetup(true)} style={{padding:"5px 14px",borderRadius:6,background:brand==="gbgs"?GBGS_COL:brand==="am"?AM_COL:ACCENT,border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>
          {sheetsUrl?"+ ADD DATA":"⚙ SETUP"}
        </button>
      </div>
    </div>

    {loading&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"calc(100vh - 58px)",flexDirection:"column",gap:14}}><div style={{width:30,height:30,border:"3px solid #1A1A1A",borderTopColor:ACCENT,borderRadius:"50%",animation:"spin 1s linear infinite"}}/><div style={{fontSize:11,color:"#444"}}>Loading…</div></div>}
    {!loading&&loadErr&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"calc(100vh - 58px)",flexDirection:"column",gap:14,padding:24}}><div style={{fontSize:12,color:"#ef4444",textAlign:"center",maxWidth:440,lineHeight:1.6}}>{loadErr}</div><div style={{display:"flex",gap:10}}><button onClick={()=>setShowSetup(true)} style={{padding:"9px 18px",borderRadius:8,background:"transparent",border:`1px solid ${BORDER}`,color:"#666",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"}}>RECONFIGURE</button><button onClick={()=>{setLoadErr(null);setRawData(mockData());}} style={{padding:"9px 18px",borderRadius:8,background:ACCENT,border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"}}>USE DEMO</button></div></div>}
    {!loading&&!loadErr&&!rawData&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"calc(100vh - 58px)",flexDirection:"column",gap:14}}><div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:"#222"}}>NO DATA YET</div><button onClick={()=>sheetsUrl?setShowUpload(true):setShowSetup(true)} style={{padding:"11px 26px",borderRadius:8,background:ACCENT,border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:12,cursor:"pointer"}}>{sheetsUrl?"ADD FIRST CSV":"GET STARTED"}</button></div>}

    {!loading&&!loadErr&&rawData&&<div style={{padding:"18px 24px"}}>
      {brand==="teg"&&<BrandDashboard data={tegData} accent={ACCENT} allStores={tegStores} label="TEG"/>}
      {brand==="gbgs"&&<BrandDashboard data={gbgsData} accent={GBGS_COL} allStores={gbgsStores} label="GBGS"/>}
      {brand==="am"&&<BrandDashboard data={amData} accent={AM_COL} allStores={amStores} label="AM"/>}
    </div>}
  </div>);
}
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
