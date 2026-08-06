import { useState, useRef, useEffect, useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import * as XLSX from 'xlsx'

const PASSWORD = "teg2026"
const ACCENT = "#FE1D55"
const GOLD = "#D4A017"
const TEAL = "#4ECDC4"
const PURPLE = "#A78BFA"
const DARK = "#0A0A0F"
const CARD = "#111118"
const BORDER = "#1E1E2E"
const COLORS = ["#FF5C1A","#D4A017","#4ECDC4","#A78BFA","#F59E0B","#34D399","#F87171","#60A5FA","#FB923C","#A3E635"]
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzQywPoDzjjFCHm2Kwi1LpKK6TxB0s-vJeHRxcwxbUujiIWOxL7n6aqe4CWHx9GkOAgiQ/exec"

const XOLA_PRICE_REF = {
  "winner shirt":25,"wheel shirt":25,"icon shirt":25,"chip shirt":25,"the heist":25,"ruins":25,"winner winner shirt":25,
  "xs shirt":25,"s shirt":25,"m shirt":25,"l shirt":25,"xl shirt":25,"2xl shirt":25,"3xl shirt":25,"4xl shirt":25,
  "winner winner shirt 8.4xl":12.5,
  "gbgs chip hat":20,"cosmo hat":20,"blue hat":20,"green hat":20,"red hat":20,"black hat":20,
  "gbgs wheel pin":7,"gbgs chip pin":7,"gbgs camera pin":7,"gbgs pencil pin":7,"cosmic crisis pin":7,"the depths pin":7,
  "the heist pin":7,"playground pin":7,"ruins pin":7,"special ops pin":7,"prison break pin":7,"gold rush pin":7,"heist pin":7,
  "shoe charm pack 1":18,"shoe charm pack 2":18,
  "cosmo plushie":22,
  "gbgs keychain":10,"keychain":5,
  "unlocked activation code vol 1":10,"unlocked activation code vol 2":10,"unlocked activation code vol 3":10,
  "efig board game":29.99,"escape from iron gate":29.99,
  "red cosmo bottle":14,"cosmo bottle":14,"gbgs chip bottle":14,
  "gbgs magnet":5,"gbgs wheel magnet":5,"gbgs chip magnet":5,
  "beige beanie":16,"black beanie":16,
  "gbgs blue medium pencil":10,"gbgs red medium pencil":10,
  "coke":2.99,"dasani water":2.99,"water":2.99
}

function getItemPrice(name) {
  const key = name.toLowerCase().trim()
  if (XOLA_PRICE_REF[key]) return XOLA_PRICE_REF[key]
  if (/shirt/i.test(name)) return 25
  if (/old.*shirt|shirt.*old/i.test(name)) return 12.5
  if (/hat|beanie/i.test(name)) return 20
  if (/plushie/i.test(name)) return 22
  if (/keychain/i.test(name)) return 5
  if (/pin pack|charm/i.test(name)) return 18
  if (/pin/i.test(name)) return 7
  if (/unlock/i.test(name)) return 10
  if (/bottle/i.test(name)) return 14
  if (/magnet/i.test(name)) return 5
  if (/pencil/i.test(name)) return 10
  if (/coke|water|drink|beverage/i.test(name)) return 2.99
  if (/efig|iron gate/i.test(name)) return 29.99
  return null
}

function getRowBrand(store = "", name = "") {
  const n = (name||"").toLowerCase(), s = (store||"").toLowerCase()
  if (n.includes("gbgs")||n.includes("great big game")||s.includes("gbgs")||s.includes("great big game")) return "gbgs"
  if (n.includes("adventure mining")||n.includes("gem hunt")||s.includes("adventure mining")||n.startsWith("am -")||n.startsWith("am-")) return "am"
  if (s==="am"||s.startsWith("am ")||s.endsWith(" am")) return "am"
  return "teg"
}

function normalizeName(raw = "") {
  return raw
    .replace(/^(teg|gbgs)\s*[-–]\s*/i,"")
    .replace(/\s*[-/(|]\s*(xs|s|m|l|xl|xxl|2xl|3xl|small|medium|large|x-?large|extra\s*large|one\s*size|os)\s*[)\s]*$/i,"")
    .replace(/\s+\d+\.\s*(xs|s|m|l|xl|xxl|2xl|3xl|4xl|small|medium|large)$/i,"")
    .replace(/\s*\d+\.\s*4xl\s*$/i,"")
    .replace(/\s*\([^)]*\)\s*$/,"")
    .trim()
    .replace(/\w\S*/g, w => w.charAt(0).toUpperCase()+w.slice(1).toLowerCase())
}

function parseFilename(filename) {
  const base = filename.replace(/\.(csv|xlsx|xls)$/i,"")
  if (/^xola_/i.test(base)) {
    const dates2 = [...base.matchAll(/(\d{4})[_-](\d{2})[_-](\d{2})/g)].map(m=>`${m[1]}-${m[2]}-${m[3]}`)
    return { city: null, dateFrom: dates2[0]||null, dateTo: dates2[1]||null }
  }
  const base2 = base.replace(/_?\(\d+\)\s*$/,"").replace(/_\d+$/,"").replace(/\d+$/,"")
  const parts = base2.split("_")
  const dateIdx = parts.findIndex(p => /^\d{4}(-\d{2}(-\d{2})?)?$/.test(p))
  const skip = new Set(["product","mix","sales","export","report","revel","resova","gbgs","teg","data","the","escape","game","keys","00","bookings","booking"])
  let city = null
  const citySource = dateIdx > 0 ? parts.slice(0, dateIdx) : parts
  const cityParts = citySource.filter(p => !skip.has(p.toLowerCase()) && p.length > 1 && !/^\d+$/.test(p))
  if (cityParts.length > 0) city = cityParts.map(p => p.charAt(0).toUpperCase()+p.slice(1).toLowerCase()).join(" ")
  const dates = [...base.matchAll(/(\d{4})[_-](\d{2})[_-](\d{2})/g)].map(m=>`${m[1]}-${m[2]}-${m[3]}`)
  return { city, dateFrom: dates[0]||null, dateTo: dates[1]||null }
}

function normalizeStore(raw = "") {
  const ABBREVS = {
    "dc":"DC","nyc":"NYC","ny":"NY","la":"LA","sf":"SF","nj":"NJ","sc":"SC","nc":"NC","tx":"TX","ca":"CA",
    "fl":"FL","ga":"GA","tn":"TN","co":"CO","va":"VA","md":"MD","pa":"PA","oh":"OH","il":"IL","mn":"MN",
    "mo":"MO","at":"AT","us":"US","uk":"UK","ie":"IE","nv":"NV","az":"AZ","wa":"WA","or":"OR","ut":"UT",
    "nm":"NM","ok":"OK","ar":"AR","ms":"MS","al":"AL","wh":"WH"
  }
  if (/san\s*francisco/i.test(raw) && /fisherman|wha/i.test(raw)) raw = "San Francisco Wharf"
  raw = raw
    .replace(/^the escape (game|keys)\s*[-–:]?\s*/i,"")
    .replace(/^teg\s*[-–:]?\s*/i,"")
    .replace(/^gbgs\s*[-–:]?\s*/i,"")
    .replace(/^great big game show\s*[-–:]?\s*/i,"")
    .replace(/^adventure mining\s*[-–:]?\s*/i,"")
    .replace(/^am\s*[-–:]\s*/i,"")
    .replace(/[-–]+/g," ").replace(/\s+/g," ").trim()
  const ALIASES = {
    "dedham ma":"Dedham","orange":"Orange","orange ca":"Orange","las vegas area":"Las Vegas Area 15",
    "nashville":"Nashville Downtown","crocker park westlake oh":"Crocker Park","crocker park westlake":"Crocker Park",
    "seattle sc":"Seattle SC","seattle southcenter":"Seattle SC","seattle downtown":"Seattle DT",
    "seattle reinvent":"Seattle DT","seattle dt":"Seattle DT","sunrise blvd fl":"Sunrise","sunrise blvd":"Sunrise",
    "las vegas area 15":"Las Vegas Area 15","the colony.":"The Colony",
  }
  const lower = raw.toLowerCase()
  if (ALIASES[lower]) return ALIASES[lower]
  let result = raw.replace(/\b\w+/g, w => ABBREVS[w.toLowerCase()]||w.charAt(0).toUpperCase()+w.slice(1).toLowerCase())
  result = result.replace(/\bUtc\b/g,"UTC").replace(/\bMoa\b/g,"MOA")
  return result
}

const delay = () => new Promise(res => setTimeout(res, 1500))

async function sheetsCall(baseUrl, params = {}) {
  const action = params.action || ""
  if (action === "save" || action === "append") {
    const res2 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params).toString()
    })
    const text2 = await res2.text()
    if (text2.trim().startsWith("<")) throw new Error("Apps Script returned HTML — check: Execute as Me, Access Anyone")
    const json2 = JSON.parse(text2)
    if (!json2.ok) throw new Error(json2.error || "Apps Script error")
    return json2
  }
  const url = baseUrl + "?" + new URLSearchParams(params).toString()
  const res = await fetch(url)
  const text = await res.text()
  if (text.trim().startsWith("<")) throw new Error("Apps Script returned HTML — check: Execute as Me, Access Anyone")
  const json = JSON.parse(text)
  if (!json.ok) throw new Error(json.error || "Apps Script error")
  return json
}

async function loadFromSheets(url, onProgress) {
  let page = 0, allRR = [], allSR = [], totalPages = 1
  do {
    const r = await sheetsCall(url, { action: "load", page: String(page) })
    allRR = [...allRR, ...(r.data.rr || [])]
    allSR = [...allSR, ...(r.data.sr || [])]
    totalPages = r.totalPages || 1
    if (onProgress) onProgress(page + 1, totalPages)
    page++
  } while (page < totalPages)
  return { rr: allRR, sr: allSR, ts: new Date().toISOString() }
}

async function saveToSheets(url, data) {
  const slim = slimify(data)
  const CHUNK = 150
  await sheetsCall(url, { action: "save", payload: encodeURIComponent(JSON.stringify({ ts: slim.ts, rr: [], sr: [] })) })
  for (let i = 0; i < slim.rr.length; i += CHUNK) {
    await sheetsCall(url, { action: "append", payload: encodeURIComponent(JSON.stringify({ rr: slim.rr.slice(i, i+CHUNK), sr: [], ts: slim.ts })) })
    if (i + CHUNK < slim.rr.length) await delay()
  }
  for (let i = 0; i < slim.sr.length; i += CHUNK) {
    await sheetsCall(url, { action: "append", payload: encodeURIComponent(JSON.stringify({ rr: [], sr: slim.sr.slice(i, i+CHUNK), ts: slim.ts })) })
    if (i + CHUNK < slim.sr.length) await delay()
  }
  return { ok: true }
}

async function appendToSheets(url, newRR, newSR, ts) {
  const CHUNK = 150
  for (let i = 0; i < newRR.length; i += CHUNK) {
    await sheetsCall(url, { action: "append", payload: encodeURIComponent(JSON.stringify({ rr: newRR.slice(i, i+CHUNK), sr: [], ts })) })
    if (i + CHUNK < newRR.length) await delay()
  }
  for (let i = 0; i < newSR.length; i += CHUNK) {
    await sheetsCall(url, { action: "append", payload: encodeURIComponent(JSON.stringify({ rr: [], sr: newSR.slice(i, i+CHUNK), ts })) })
    if (i + CHUNK < newSR.length) await delay()
  }
  return { ok: true }
}

function slimify(d) {
  return {
    ts: d.savedAt,
    rr: (d.revelRows||[]).map(r => [r.date||"",r.name||"",r.category||"",+(r.units||0),+(r.revenue||0),r.store||"",r.brand||"teg",+(r.gross||r.revenue||0),+(r.discount||0)]),
    sr: (d.resovaRows||[]).map(r => [r.date||"",r.item||"",+(r.qty||0),+(r.revenue||0),r.store||"",r.brand||"teg",+(r.gross||r.revenue||0),+(r.discount||0)])
  }
}

function expand(slim) {
  if (!slim) return null
  return {
    savedAt: slim.ts,
    revelRows: (slim.rr||[]).map(r => ({ date:r[0],name:r[1],category:r[2],units:r[3],revenue:r[4],store:normalizeStore(r[5]||""),brand:r[6]||"teg",gross:r[7]||r[4],discount:r[8]||0 })),
    resovaRows: (slim.sr||[]).map(r => ({ date:r[0],item:r[1],qty:r[2],revenue:r[3],store:normalizeStore(r[4]||""),brand:r[5]||"teg",gross:r[6]||r[3],discount:r[7]||0 }))
  }
}

function parseCSV(text) {
  const lines = text.replace(/^\uFEFF/,"").replace(/\uFEFF/g,"").trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0].split(",").map(h => h.trim().replace(/^\uFEFF/,"").replace(/^"|"$/g,"").toLowerCase())
  return lines.slice(1).map(line => {
    const vals = []; let cur = "", q = false
    for (const ch of line) {
      if (ch==='"') q=!q
      else if (ch===","&&!q) { vals.push(cur.trim()); cur="" }
      else cur+=ch
    }
    vals.push(cur.trim())
    return Object.fromEntries(headers.map((h,i) => [h,(vals[i]||"").replace(/^"|"$/g,"").trim()]))
  }).filter(r => Object.values(r).some(v=>v))
}

function fieldFind(h, ...c) {
  return h.find(x => c.some(y => x.toLowerCase().includes(y.toLowerCase()))) || null
}

function parseDate(val) {
  if (!val) return ""
  const s = String(val).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0,10)
  const dmy = s.match(/^(\d{1,2})[\s-]([A-Za-z]+)[\s-](\d{4})/)
  if (dmy) {
    const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
    const mi = months.indexOf(dmy[2].toLowerCase().slice(0,3))
    if (mi>=0) return `${dmy[3]}-${String(mi+1).padStart(2,"0")}-${String(dmy[1]).padStart(2,"0")}`
  }
  const d = new Date(val)
  if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
  return ""
}

function csvToRevelRows(rows, store, fallbackDate="") {
  const h = Object.keys(rows[0])
  const f = {
    name: fieldFind(h,"product name","item name","product","name","description","menu item"),
    qty: fieldFind(h,"quantity","qty","units","count"),
    price: fieldFind(h,"unit price","price","cost","rate"),
    total: h.find(x=>x==="total sales inc item discounts")||h.find(x=>x.includes("total sales inc item discounts"))||h.find(x=>x.includes("total sales inc")||x.includes("total inc"))||h.find(x=>x==="total sales")||fieldFind(h,"subtotal","revenue","amount","net"),
    grossCol: h.find(x=>x==="total sales")||null,
    discountCol: h.find(x=>x==="item discounts")||h.find(x=>x.includes("item discount"))||null,
    date: fieldFind(h,"date","created","time","order date","transaction date","closed"),
    category: fieldFind(h,"category","department","class","group","type"),
    storeCol: fieldFind(h,"establishment","store","location","site","outlet")
  }
  return rows.filter(row => {
    const rawName = (f.name ? row[f.name]||"" : "").toLowerCase()
    if (/gift|trivia showdown|holiday edition|single contestant|private studio|4for100|4 for 100|4 for \$100|launch|great big game show|the original|reservation id|replacement pin|replacement name tag|omitb|teg combo pass|special items|omitb walkin|omitb walk in|cash|prison break xola booking|private sale add on|apple pay split payment/i.test(rawName)) return false
    return true
  }).map(row => {
    const rawName = f.name ? row[f.name]||"Unknown" : "Unknown"
    const rawStore = f.storeCol ? row[f.storeCol]||"" : ""
    const brand = getRowBrand(rawStore, rawName)
    const name = normalizeName(rawName)
    const units = parseFloat(f.qty ? row[f.qty] : 1)||1
    const rev = parseFloat(f.total ? row[f.total] : f.price ? parseFloat(row[f.price]||0)*units : 0)||0
    const cat = f.category ? row[f.category]||"" : ""
    let rowStore = normalizeStore(rawStore)||normalizeStore(store||"")||"Unknown"
    if (brand==="gbgs") {
      if (/san francisco/i.test(rowStore)) rowStore="San Francisco"
      if (/^seattle$/i.test(rowStore)) rowStore="Seattle SC"
    }
    let date = f.date&&row[f.date] ? parseDate(row[f.date]) : ""
    if (!date&&fallbackDate) date=parseDate(fallbackDate)||""
    const grossAmt = f.grossCol ? parseFloat(row[f.grossCol])||0 : rev
    const discountAmt = f.discountCol ? parseFloat(row[f.discountCol])||0 : +(grossAmt-rev).toFixed(2)
    return { date, name, category:cat, units, revenue:+rev.toFixed(2), gross:+grossAmt.toFixed(2), discount:+Math.abs(discountAmt).toFixed(2), store:rowStore, brand }
  })
}

function csvToResovaRows(rows, store, filenameBrand=null) {
  const h = Object.keys(rows[0])
  const hl = h.map(x=>x.toLowerCase().trim())
  const fi = candidates => {
    for (const c of candidates) { const idx=hl.findIndex(x=>x.includes(c.toLowerCase())); if (idx>=0) return h[idx] }
    return null
  }
  const f = {
    item: fi(["inventory item","item","room","experience","activity","service","product"]),
    date: fi(["date","sale date","created","start date","session date"]),
    subtotal: fi(["subtotal"]),
    discount: fi(["discount codes value","discount amount","discount value","coupon amount"]),
    coupon: fi(["discount code","coupon code","promo code","voucher code"]),
    total: fi(["booking net total","net total","sale net total","actual revenue","total","amount","paid","revenue"]),
    status: fi(["payment status","status","state"]),
    qty: fi(["quantity","qty","sales","guests","players","people"]),
    storeCol: fi(["store","location","establishment","site","venue","outlet"])
  }
  const cleanRows = rows.filter((r,i) => {
    if (i===rows.length-1) { const item=(f.item?r[f.item]:"").toLowerCase().trim(); if (!item||item.includes("total")||item.includes("grand")) return false }
    return true
  })
  return cleanRows.filter(r => {
    if (f.status&&["cancelled","canceled","refunded","void"].includes((r[f.status]||"").toLowerCase())) return false
    const item=(f.item?r[f.item]:"").toLowerCase()
    if (/gift card|single.?player|private experience|private studio|trivia showdown|holiday edition|single contestant|4for100|4 for 100|4 for \$100|launch|great big game show|the original|reservation id|replacement pin|replacement name tag|omitb|teg combo pass|special items|omitb walkin|omitb walk in|cash|prison break xola booking|private sale add on|apple pay split payment/i.test(item)) return false
    if (!item.trim()) return false
    return true
  }).map(row => {
    const rawItem = f.item ? row[f.item]||"" : ""
    const rawStore = f.storeCol ? row[f.storeCol]||"" : ""
    const brand = filenameBrand||getRowBrand(rawItem,rawItem)
    const item = normalizeName(rawItem.replace(/^TEG\s*[-–]\s*/i,"").replace(/^GBGS\s*[-–]\s*/i,"").replace(/^AM\s*[-–]\s*/i,""))
    const qty = parseFloat(f.qty?row[f.qty]:1)||1
    const gross = parseFloat(f.subtotal?row[f.subtotal]:0)||0
    const rev = parseFloat(f.total?row[f.total]:0)||0
    const discountAmt = +(Math.max(0,gross-rev)).toFixed(2)
    let rowStore = normalizeStore(rawStore)||normalizeStore(store||"")||"Unknown"
    if (brand==="gbgs") {
      if (/san francisco/i.test(rowStore)) rowStore="San Francisco"
      if (/^seattle$/i.test(rowStore)) rowStore="Seattle SC"
    }
    const date = f.date&&row[f.date] ? parseDate(row[f.date]) : ""
    return { date, item, qty, revenue:+rev.toFixed(2), gross:+gross.toFixed(2), discount:+discountAmt.toFixed(2), couponCode:discountAmt>0?"Discount Applied":"", store:rowStore, brand }
  })
}

function xlsxToXolaRows(workbook, store) {
  const ws = workbook.Sheets["Reservations"]
  if (!ws) return []
  const raw = XLSX.utils.sheet_to_json(ws, { header:1, defval:null })
  if (raw.length<3) return []
  if (!store) {
    const details = workbook.Sheets["Report Details"]
    if (details) {
      const detailRows = XLSX.utils.sheet_to_json(details, { header:1, defval:null })
      for (const row of detailRows) {
        if (row[0]&&String(row[0]).toLowerCase().includes("company")&&row[1]) {
          store = String(row[1]).replace(/^the escape (game|keys)\s*/i,"").replace(/[()]/g," ").replace(/\s+/g," ").trim()
          break
        }
      }
    }
  }
  const h0=raw[0]||[], h1=raw[1]||[]
  const headers = h0.map((v,i)=>(h1[i]||v||"").toString().trim())
  const colIdx = name => headers.findIndex(h=>h.toLowerCase()===name.toLowerCase())
  const PRODUCT_COL=colIdx("Product"), PURCHASE_COL=colIdx("Purchase Date"), BASE_COL=colIdx("Base Amount")
  const COUPON_COL=colIdx("Coupon Amount"), ADJ_COL=colIdx("Adjustments"), REV_COL=colIdx("Revenue")
  const PAY_COL=colIdx("Payment Status"), STATUS_COL=colIdx("Status")
  const guestsIdx=colIdx("Guests")>=0?colIdx("Guests"):colIdx("Total Demographics")
  const merchCols=[]
  for (let i=guestsIdx+1;i<BASE_COL;i++) {
    const name=headers[i]
    if (name&&!/^(total|taxes|sales tax|add-on|coupon|adjust|revenue|payment|source|status|guest|check|purchase|bought|tag|make|private|amount|confirm|quantity|demographic)/i.test(name)) {
      merchCols.push({idx:i,name})
    }
  }
  const result=[]
  for (let i=2;i<raw.length;i++) {
    const row=raw[i]
    if (!row||!row.some(v=>v!=null)) continue
    const product=(row[PRODUCT_COL]||"").toString()
    const payStatus=(row[PAY_COL]||"").toString().toLowerCase()
    const status=(row[STATUS_COL]||"").toString().toLowerCase()
    if (!/merch/i.test(product)) continue
    if (/cancelled|canceled|refunded|void/.test(payStatus)) continue
    if (/cancelled|canceled|refunded|void/.test(status)) continue
    const base=parseFloat(row[BASE_COL])||0, coupon=parseFloat(row[COUPON_COL])||0, adj=parseFloat(row[ADJ_COL])||0
    const revRaw=REV_COL>=0?parseFloat(row[REV_COL])||0:null
    const revenue=revRaw!==null?+revRaw.toFixed(2):+(base+coupon+adj).toFixed(2)
    const xolaGross=+base.toFixed(2), xolaDiscount=+Math.abs(coupon+adj).toFixed(2)
    const dateStr=parseDate((row[PURCHASE_COL]||"").toString().trim())
    const brand=getRowBrand(product,product)
    const rowStore=normalizeStore(store||"")||"Unknown"
    const itemsInRow=merchCols.filter(c=>{const qty=parseFloat(row[c.idx]);return qty&&qty>0})
    const isShirtRow=/shirt/i.test(product)
    const productClean=normalizeName(product.replace(/^merch:\s*/i,"").replace(/^(gbgs|teg|am|adventure mining|great big game show)\s+shirt\s*[-–]\s*/i,"").replace(/^(gbgs|teg|am|adventure mining|great big game show)\s*[-–]\s*/i,"").replace(/^shirt\s*[-–]\s*/i,"").trim())
    if (itemsInRow.length===0) {
      if (/gift/i.test(productClean)) continue
      result.push({date:dateStr,name:productClean,category:isShirtRow?"Apparel":"Merch",units:1,revenue,gross:xolaGross,discount:xolaDiscount,store:rowStore,brand})
    } else {
      const itemNames=itemsInRow.map(c=>({col:c,qty:parseFloat(row[c.idx])||0,name:isShirtRow?productClean:normalizeName(c.name)}))
      const weightedTotal=itemNames.reduce((s,item)=>{const price=getItemPrice(item.name)||1;return s+price*item.qty},0)
      for (const item of itemNames) {
        if (/gift/i.test(item.name)) continue
        const price=getItemPrice(item.name)||1, weight=price*item.qty/weightedTotal
        result.push({date:dateStr,name:item.name,category:isShirtRow?"Apparel":"Merch",units:item.qty,revenue:+(revenue*weight).toFixed(2),gross:+(xolaGross*weight).toFixed(2),discount:+(xolaDiscount*weight).toFixed(2),store:rowStore,brand})
      }
    }
  }
  return result
}

function aggregate(revelRows, resovaRows, stores, dateFrom, dateTo) {
  const inRange = d => { if (!d) return true; if (dateFrom&&d<dateFrom) return false; if (dateTo&&d>dateTo) return false; return true }
  const inStore = s => !stores.length||stores.includes(s)
  const rr=revelRows.filter(r=>inRange(r.date)&&inStore(r.store))
  const sr=resovaRows.filter(r=>inRange(r.date)&&inStore(r.store))
  const byMonth={}, byProduct={}, byStore={}
  const toMonthKey = d => {
    if (!d) return null
    const s=String(d).trim()
    if (/^\d{4}-\d{2}/.test(s)) return s.slice(0,7)
    const dmy=s.match(/^(\d{1,2})-([A-Za-z]+)-(\d{4})/)
    if (dmy) { const mi=MONTHS.findIndex(m=>m.toLowerCase()===dmy[2].toLowerCase().slice(0,3)); return mi>=0?`${dmy[3]}-${String(mi+1).padStart(2,"0")}`:null }
    const dt=new Date(d)
    if (!isNaN(dt)) return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`
    return null
  }
  rr.forEach(r => {
    const mk=toMonthKey(r.date)||"Unknown"
    const label=mk!=="Unknown"?`${MONTHS[parseInt(mk.slice(5,7))-1]} ${mk.slice(0,4)}`:mk
    if (!byMonth[mk]) byMonth[mk]={month:label,key:mk,revenue:0,units:0,transactions:0,gross:0,discount:0}
    if (!byProduct[r.name]) byProduct[r.name]={name:r.name,category:r.category||"",units:0,revenue:0,gross:0,discount:0}
    if (!byStore[r.store]) byStore[r.store]={store:r.store,revenue:0,units:0,gross:0,discount:0}
    byMonth[mk].revenue+=r.revenue; byMonth[mk].gross+=(r.gross||r.revenue||0); byMonth[mk].discount+=(r.discount||0); byMonth[mk].units+=r.units; byMonth[mk].transactions++
    byProduct[r.name].units+=r.units; byProduct[r.name].revenue+=r.revenue; byProduct[r.name].gross+=(r.gross||r.revenue||0); byProduct[r.name].discount+=(r.discount||0)
    byStore[r.store].revenue+=r.revenue; byStore[r.store].gross+=(r.gross||r.revenue||0); byStore[r.store].discount+=(r.discount||0); byStore[r.store].units+=r.units
  })
  sr.forEach(r => {
    const mk=toMonthKey(r.date)||"Unknown"
    const label=mk!=="Unknown"?`${MONTHS[parseInt(mk.slice(5,7))-1]} ${mk.slice(0,4)}`:mk
    const units=r.qty||1
    if (!byMonth[mk]) byMonth[mk]={month:label,key:mk,revenue:0,units:0,transactions:0,gross:0,discount:0}
    if (!byProduct[r.item]) byProduct[r.item]={name:r.item,category:"",units:0,revenue:0,gross:0,discount:0}
    if (!byStore[r.store]) byStore[r.store]={store:r.store,revenue:0,units:0,gross:0,discount:0}
    byMonth[mk].revenue+=r.revenue; byMonth[mk].gross+=(r.gross||r.revenue||0); byMonth[mk].discount+=(r.discount||0); byMonth[mk].units+=units; byMonth[mk].transactions++
    byProduct[r.item].units+=units; byProduct[r.item].revenue+=r.revenue; byProduct[r.item].gross+=(r.gross||r.revenue||0); byProduct[r.item].discount+=(r.discount||0)
    byStore[r.store].revenue+=r.revenue; byStore[r.store].gross+=(r.gross||r.revenue||0); byStore[r.store].discount+=(r.discount||0); byStore[r.store].units+=units
  })
  const totalRevenue=+[...rr,...sr].reduce((s,r)=>s+r.revenue,0).toFixed(2)
  const totalGross=+[...rr,...sr].reduce((s,r)=>s+(r.gross||r.revenue||0),0).toFixed(2)
  const totalDiscount=+(totalGross-totalRevenue).toFixed(2)
  const totalUnits=Math.round(rr.reduce((s,r)=>s+r.units,0)+sr.reduce((s,r)=>s+(r.qty||1),0))
  const topItems=Object.values(byProduct).map(p=>({...p,revenue:+p.revenue.toFixed(2)})).sort((a,b)=>b.revenue-a.revenue)
  return {
    totalRevenue, totalGross, totalDiscount, totalUnits,
    avgUnitPrice: totalUnits?+(totalRevenue/totalUnits).toFixed(2):0,
    topItem: topItems[0]?.name||null,
    monthlyRevenue: Object.values(byMonth).sort((a,b)=>a.key.localeCompare(b.key)).map(m=>{const g=+(m.gross||m.revenue).toFixed(2);const r=+m.revenue.toFixed(2);return{...m,revenue:r,gross:g,discount:+(g-r).toFixed(2)}}),
    topItems,
    byStore: Object.values(byStore).map(s=>({...s,revenue:+s.revenue.toFixed(2)})).sort((a,b)=>b.revenue-a.revenue)
  }
}

function KPI({ label, value, sub, color=ACCENT, icon }) {
  return (
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"18px 22px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:color}}/>
      <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>{label}</div>
      <div style={{fontSize:24,fontFamily:"'Bebas Neue',sans-serif",color:"#fff",letterSpacing:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:"#444",marginTop:3}}>{sub}</div>}
      {icon&&<div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",fontSize:22,opacity:0.08}}>{icon}</div>}
    </div>
  )
}

function Tip({ active, payload, label }) {
  if (!active||!payload?.length) return null
  const grossEntry=payload.find(p=>(p.name||"").toLowerCase()==="gross")
  const grossVal=grossEntry?Number(grossEntry.value):0
  return (
    <div style={{background:"#1A1A2E",border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 14px",fontFamily:"'DM Mono',monospace",fontSize:12}}>
      <div style={{color:"#666",marginBottom:4}}>{label}</div>
      {payload.map((p,i)=>{
        const isDiscount=(p.name||"").toLowerCase().includes("discount")
        const fmt=typeof p.value==="number"&&p.name?.toLowerCase().match(/rev|total|price|gross|actual|discount/)?`$${Number(p.value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`:Number(p.value).toLocaleString()
        const discPct=isDiscount&&grossVal>0?` (${(Number(p.value)/grossVal*100).toFixed(1)}%)`:"" 
        return <div key={i} style={{color:p.color||ACCENT}}>{p.name}: {fmt}{discPct}</div>
      })}
    </div>
  )
}

function StorePicker({ allStores, selected, onChange, accent=ACCENT }) {
  const [open,setOpen]=useState(false)
  const [storeSearch,setStoreSearch]=useState("")
  const [dragIdx,setDragIdx]=useState(null)
  const [customOrder,setCustomOrder]=useState([])
  const ref=useRef()
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)}
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h)
  },[])
  useEffect(()=>{
    setCustomOrder(prev=>{
      const existing=prev.filter(s=>allStores.includes(s))
      const newOnes=allStores.filter(s=>!existing.includes(s)).sort()
      return [...existing,...newOnes]
    })
  },[allStores])
  const label=selected.length===0?"All Stores":selected.length===1?selected[0]:`${selected.length} Stores`
  const toggle=s=>onChange(selected.includes(s)?selected.filter(x=>x!==s):[...selected,s])
  const sorted=[...selected,...customOrder.filter(s=>!selected.includes(s))]
  const filtered=storeSearch?sorted.filter(s=>s.toLowerCase().includes(storeSearch.toLowerCase())):sorted
  const onDragStart=i=>setDragIdx(i)
  const onDragOver=(e,i)=>{e.preventDefault();if(dragIdx===null||dragIdx===i)return;const next=[...customOrder];const[moved]=next.splice(dragIdx,1);next.splice(i,0,moved);setCustomOrder(next);setDragIdx(i)}
  return (
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{padding:"7px 13px",borderRadius:7,background:selected.length?`${accent}22`:"transparent",border:`1px solid ${selected.length?accent:BORDER}`,color:selected.length?accent:"#666",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
        🏪 {label} {open?"▲":"▼"}
      </button>
      {open&&(
        <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:8,zIndex:100,minWidth:240,maxHeight:380,display:"flex",flexDirection:"column",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
          <div style={{padding:"0 0 6px",borderBottom:`1px solid ${BORDER}`,marginBottom:4,flexShrink:0}}>
            <input value={storeSearch} onChange={e=>setStoreSearch(e.target.value)} placeholder="Search stores…" style={{width:"100%",background:DARK,border:`1px solid ${BORDER}`,borderRadius:5,color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:10,padding:"6px 8px",outline:"none",marginBottom:6}}/>
            <div style={{display:"flex",justifyContent:"space-between",padding:"0 2px"}}>
              <button onClick={()=>onChange([])} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Clear</button>
              {!storeSearch&&<span style={{fontSize:9,color:"#333",alignSelf:"center"}}>⠿ drag to reorder</span>}
              <button onClick={()=>onChange([...allStores])} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Select All</button>
            </div>
          </div>
          <div style={{overflowY:"auto",flex:1}}>
            {selected.length>0&&!storeSearch&&<div style={{fontSize:9,color:accent,padding:"4px 10px 2px",letterSpacing:1,textTransform:"uppercase",opacity:0.7}}>Selected</div>}
            {filtered.map(store=>{
              const orderIdx=customOrder.indexOf(store)
              return (
                <div key={store} draggable={!storeSearch} onDragStart={()=>onDragStart(orderIdx)} onDragOver={e=>onDragOver(e,orderIdx)} onDragEnd={()=>setDragIdx(null)} onClick={()=>toggle(store)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:6,cursor:"pointer",background:selected.includes(store)?`${accent}15`:"transparent",opacity:dragIdx===orderIdx?0.4:1}}>
                  {!storeSearch&&<span style={{color:"#2A2A3A",fontSize:12,cursor:"grab",userSelect:"none"}}>⠿</span>}
                  <div style={{width:14,height:14,borderRadius:3,border:`1px solid ${selected.includes(store)?accent:BORDER}`,background:selected.includes(store)?accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",flexShrink:0}}>{selected.includes(store)?"✓":""}</div>
                  <span style={{fontSize:11,color:selected.includes(store)?"#fff":"#888"}}>{store}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function DateRange({ revelRows, resovaRows, dateFrom, dateTo, onChange }) {
  const all=[...revelRows||[],...resovaRows||[]].map(r=>r.date).filter(Boolean).sort()
  const min=all[0]?.slice(0,7)||""
  const max=all[all.length-1]?.slice(0,7)||""
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,background:CARD,border:`1px solid ${BORDER}`,borderRadius:7,padding:"6px 12px"}}>
      <span style={{fontSize:10,color:"#555"}}>📅</span>
      <input type="month" value={dateFrom?.slice(0,7)||""} min={min} max={max} onChange={e=>onChange(e.target.value?e.target.value+"-01":"",dateTo)} style={{background:"transparent",border:"none",color:dateFrom?"#888":"#444",fontFamily:"'DM Mono',monospace",fontSize:11,padding:"2px 4px",outline:"none"}}/>
      <span style={{color:"#333"}}>→</span>
      <input type="month" value={dateTo?.slice(0,7)||""} min={min} max={max} onChange={e=>onChange(dateFrom,e.target.value?e.target.value+"-31":"")} style={{background:"transparent",border:"none",color:dateTo?"#888":"#444",fontFamily:"'DM Mono',monospace",fontSize:11,padding:"2px 4px",outline:"none"}}/>
      <button onClick={()=>onChange("","")} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>ALL</button>
    </div>
  )
}

function AddDataModal({ data, onSave, onClose, url }) {
  const [files,setFiles]=useState([])
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState("")
  const [progress,setProgress]=useState("")

  const processFile = async (file) => {
    const name=file.name
    const { city, dateFrom:df, dateTo:dt } = parseFilename(name)
    const isXola=/^xola_/i.test(name)
    const isXlsx=/\.(xlsx|xls)$/i.test(name)

    if (isXola && isXlsx) {
      const ab=await file.arrayBuffer()
      const wb=XLSX.read(ab)
      const rows=xlsxToXolaRows(wb, city)
      return { revelRows: rows, resovaRows: [], detected: "xola", store: city||"Unknown", rowCount: rows.length }
    }
    const text=await file.text()
    const rows=parseCSV(text)
    if (!rows.length) return null
    const headers=Object.keys(rows[0])
    const type=detectType(headers)
    const filenameBrand=name.toLowerCase().includes("gbgs")?"gbgs":name.toLowerCase().includes("adventure mining")||name.toLowerCase().startsWith("am_")?"am":null
    if (type==="resova") {
      const resovaRows=csvToResovaRows(rows, city||"", filenameBrand)
      return { revelRows:[], resovaRows, detected:"resova", store:city||resovaRows[0]?.store||"Unknown", rowCount:resovaRows.length }
    } else {
      const revelRows=csvToRevelRows(rows, city||"", df||"")
      return { revelRows, resovaRows:[], detected:"revel", store:city||revelRows[0]?.store||"Unknown", rowCount:revelRows.length }
    }
  }

  const detectType = headers => {
    const h=headers.join(" ").toLowerCase()
    return ["inventory item","sale net total","payment status","gratuity"].filter(k=>h.includes(k)).length>=1?"resova":"revel"
  }

  const handleFiles = async (fileList) => {
    const results=[]
    for (const file of fileList) {
      try {
        const result=await processFile(file)
        if (result) results.push({ file, ...result, status:"ready" })
        else results.push({ file, status:"error", error:"No data found" })
      } catch(e) {
        results.push({ file, status:"error", error:e.message })
      }
    }
    setFiles(results)
  }

  const handleDrop = e => { e.preventDefault(); handleFiles([...e.dataTransfer.files]) }
  const handleInput = e => handleFiles([...e.target.files])

  const handleSave = async () => {
    setSaving(true); setError("")
    try {
      const newRR=[...files.filter(f=>f.status==="ready").flatMap(f=>f.revelRows||[])]
      const newSR=[...files.filter(f=>f.status==="ready").flatMap(f=>f.resovaRows||[])]
      const existingRR=data?.revelRows||[]
      const existingSR=data?.resovaRows||[]
      const dedup=(rows,existing,keyFn)=>{
        const seen=new Set(existing.map(keyFn))
        return rows.filter(r=>!seen.has(keyFn(r)))
      }
      const rrKey=r=>`${r.date}|${r.name}|${r.store}|${r.units}|${r.revenue}`
      const srKey=r=>`${r.date}|${r.item}|${r.store}|${r.qty}|${r.revenue}`
      const uniqueRR=dedup(newRR,existingRR,rrKey)
      const uniqueSR=dedup(newSR,existingSR,srKey)
      const ts=new Date().toISOString()
      setProgress(`Saving ${uniqueRR.length+uniqueSR.length} rows...`)
      await appendToSheets(url, uniqueRR, uniqueSR, ts)
      const merged={
        revelRows:[...existingRR,...uniqueRR],
        resovaRows:[...existingSR,...uniqueSR],
        savedAt:ts
      }
      onSave(merged)
    } catch(e) {
      setError(e.message)
    } finally {
      setSaving(false); setProgress("")
    }
  }

  const readyCount=files.filter(f=>f.status==="ready").length
  const totalRows=files.filter(f=>f.status==="ready").reduce((s,f)=>s+(f.rowCount||0),0)

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:28,width:560,maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:26,color:"#fff",letterSpacing:2}}>ADD DATA</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#555",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{fontSize:11,color:"#555",marginBottom:16}}>New uploads <span style={{color:ACCENT}}>add to</span> existing data — nothing is overwritten<br/>Supports Revel (CSV), Resova (CSV), Xola (XLSX) · {((data?.revelRows?.length||0)+(data?.resovaRows?.length||0)).toLocaleString()} rows currently stored</div>
        <div onDrop={handleDrop} onDragOver={e=>e.preventDefault()} onClick={()=>document.getElementById("file-input").click()}
          style={{border:`2px dashed ${BORDER}`,borderRadius:10,padding:"32px 20px",textAlign:"center",cursor:"pointer",marginBottom:16,transition:"border-color .2s"}}>
          <div style={{fontSize:32,marginBottom:8}}>📁</div>
          <div style={{color:"#666",fontSize:12}}>Drop files here or click to browse</div>
          <div style={{color:"#333",fontSize:10,marginTop:4}}>Revel & Resova (CSV) · Xola (XLSX)</div>
          <input id="file-input" type="file" multiple accept=".csv,.xlsx,.xls" onChange={handleInput} style={{display:"none"}}/>
        </div>
        {files.length>0&&(
          <div style={{marginBottom:16}}>
            {files.map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:DARK,borderRadius:8,marginBottom:6,border:`1px solid ${f.status==="error"?"#ef444444":BORDER}`}}>
                <div style={{fontSize:18}}>{f.detected==="xola"?"🟦":f.detected==="resova"?"🟩":"🟥"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,color:"#ddd",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.file.name}</div>
                  {f.status==="ready"&&<div style={{fontSize:10,color:"#555"}}>{f.detected?.toUpperCase()} · {f.store} · {f.rowCount} rows</div>}
                  {f.status==="error"&&<div style={{fontSize:10,color:"#ef4444"}}>⚠ {f.error}</div>}
                </div>
                <button onClick={()=>setFiles(files.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:16}}>✕</button>
              </div>
            ))}
          </div>
        )}
        {error&&<div style={{color:"#ef4444",fontSize:11,marginBottom:12,padding:"8px 12px",background:"#ef444411",borderRadius:6}}>⚠ {error}</div>}
        {progress&&<div style={{color:TEAL,fontSize:11,marginBottom:12}}>{progress}</div>}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"9px 20px",borderRadius:7,background:"transparent",border:`1px solid ${BORDER}`,color:"#555",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"}}>CANCEL</button>
          <button onClick={handleSave} disabled={readyCount===0||saving}
            style={{padding:"9px 24px",borderRadius:7,background:readyCount>0?ACCENT:"#333",border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:readyCount>0?"pointer":"default",opacity:saving?0.7:1}}>
            {saving?"SAVING…":`ADD TO DASHBOARD →`}
          </button>
        </div>
      </div>
    </div>
  )
}

function BrandDashboard({ data, accent, allStores, label }) {
  const [selStores,setSelStores]=useState([])
  const [sortStoreCol,setSortStoreCol]=useState("revenue")
  const [sortStoreDir,setSortStoreDir]=useState("desc")
  const [subtab,setSubtab]=useState("overview")
  const [ovChartMode,setOvChartMode]=useState("bar")
  const [dateFrom,setDateFrom]=useState("")
  const [dateTo,setDateTo]=useState("")
  const [selectedStore,setSelectedStore]=useState(null)
  const [storeDetailSort,setStoreDetailSort]=useState({col:"revenue",dir:"desc"})
  const [storeDetailChartMode,setStoreDetailChartMode]=useState("revenue")
  const [productsSort,setProductsSort]=useState({col:"revenue",dir:"desc"})
  const [searchStoreSort,setSearchStoreSort]=useState({col:"revenue",dir:"desc"})
  const [searchTerms,setSearchTerms]=useState([])
  const [searchInput,setSearchInput]=useState("")
  const [searchStores,setSearchStores]=useState([])
  const [searchFrom,setSearchFrom]=useState("")
  const [searchTo,setSearchTo]=useState("")
  const [selectedProducts,setSelectedProducts]=useState([])
  const [compareFrom,setCompareFrom]=useState("")
  const [compareTo,setCompareTo]=useState("")
  const [showCompare,setShowCompare]=useState(false)
  const [cmpProducts,setCmpProducts]=useState([])
  const [cmpInput,setCmpInput]=useState("")
  const [cmpStores,setCmpStores]=useState([])
  const [cmpA,setCmpA]=useState({from:"",to:""})
  const [cmpB,setCmpB]=useState({from:"",to:""})
  const [cmpSelProducts,setCmpSelProducts]=useState([])

  const agg=useMemo(()=>aggregate(data.revelRows||[],data.resovaRows||[],selStores,dateFrom,dateTo),[data,selStores,dateFrom,dateTo])
  const SUBTABS=[{id:"overview",label:"OVERVIEW"},{id:"products",label:"PRODUCTS"},{id:"search",label:"PRODUCT SEARCH"},{id:"compare",label:"COMPARE"},{id:"stores",label:"BY STORE"},{id:"storedetail",label:"DETAILED BY STORE"},{id:"trends",label:"TRENDS"}]
  const noData=!agg.totalRevenue&&!agg.totalUnits

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:0,borderBottom:`1px solid ${BORDER}`}}>
          {SUBTABS.map(t=>(
            <button key={t.id} onClick={()=>setSubtab(t.id)} style={{padding:"7px 14px",background:"transparent",border:"none",borderBottom:`2px solid ${subtab===t.id?accent:"transparent"}`,color:subtab===t.id?accent:"#555",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1,cursor:"pointer",marginBottom:-1}}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {allStores.length>1&&<StorePicker allStores={allStores} selected={selStores} onChange={setSelStores} accent={accent}/>}
          <DateRange revelRows={data.revelRows} resovaRows={data.resovaRows} dateFrom={dateFrom} dateTo={dateTo} onChange={(f,t)=>{setDateFrom(f);setDateTo(t)}}/>
        </div>
      </div>

      {noData&&(
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:36,textAlign:"center"}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:"#333",marginBottom:10}}>NO {label} DATA</div>
          <div style={{color:"#555",fontSize:11}}>Upload CSV files to get started</div>
        </div>
      )}

      {!noData&&(
        <>
          {subtab==="overview"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
                <KPI label="Gross Revenue" value={`$${((agg.totalGross||agg.totalRevenue)/1e3).toFixed(1)}K`} sub="before discounts" color="#22C55E" icon="💵"/>
                <KPI label="Actual Revenue" value={`$${(agg.totalRevenue/1e3).toFixed(1)}K`} sub={`${agg.totalUnits.toLocaleString()} units sold`} color={accent} icon="💰"/>
                <KPI label="Total Discounted" value={`$${((agg.totalDiscount||0)/1e3).toFixed(1)}K`} sub={agg.totalGross?`${((agg.totalDiscount||0)/agg.totalGross*100).toFixed(1)}% of gross`:"0% of gross"} color="#F59E0B" icon="🏷"/>
                <KPI label="Units Sold" value={agg.totalUnits.toLocaleString()} sub={`$${agg.avgUnitPrice} avg`} color={GOLD} icon="📦"/>
                <KPI label="Avg Unit Price" value={`$${agg.avgUnitPrice}`} sub="per item" color={TEAL} icon="🏷"/>
                <KPI label="Stores" value={agg.byStore.length} sub={`${agg.byStore.length} locations`} color={PURPLE} icon="🏪"/>
                <KPI label="Discount Rate" value={agg.totalGross?`${((agg.totalDiscount||0)/agg.totalGross*100).toFixed(1)}%`:"0%"} sub="of gross revenue discounted" color="#F59E0B" icon="🏷"/>
              </div>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase"}}>Monthly Revenue</div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>setOvChartMode("bar")} style={{padding:"3px 10px",borderRadius:5,background:ovChartMode==="bar"?accent+"33":"transparent",border:`1px solid ${ovChartMode==="bar"?accent:"#1E1E2E"}`,color:ovChartMode==="bar"?accent:"#555",fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>BAR</button>
                    <button onClick={()=>setOvChartMode("line")} style={{padding:"3px 10px",borderRadius:5,background:ovChartMode==="line"?accent+"33":"transparent",border:`1px solid ${ovChartMode==="line"?accent:"#1E1E2E"}`,color:ovChartMode==="line"?accent:"#555",fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>LINE</button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  {ovChartMode==="bar"?(
                    <BarChart data={agg.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A"/>
                      <XAxis dataKey="month" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`}/>
                      <Tooltip content={<Tip/>}/>
                      <Legend formatter={v=><span style={{color:"#888",fontSize:10}}>{v}</span>}/>
                      <Bar dataKey="gross" fill="#22C55E" radius={[0,0,0,0]} name="Gross" opacity={0.5}/>
                      <Bar dataKey="revenue" fill={accent} radius={[0,0,0,0]} name="Actual"/>
                      <Bar dataKey="discount" fill="#F59E0B" radius={[3,3,0,0]} name="Discounted"/>
                    </BarChart>
                  ):(
                    <LineChart data={agg.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A"/>
                      <XAxis dataKey="month" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`}/>
                      <Tooltip content={<Tip/>}/>
                      <Legend formatter={v=><span style={{color:"#888",fontSize:10}}>{v}</span>}/>
                      <Line type="monotone" dataKey="gross" stroke="#22C55E" strokeWidth={2} strokeDasharray="5 3" dot={{r:3}} name="Gross"/>
                      <Line type="monotone" dataKey="revenue" stroke={accent} strokeWidth={2.5} dot={{r:3}} name="Actual"/>
                      <Line type="monotone" dataKey="discount" stroke="#F59E0B" strokeWidth={2} dot={{r:3}} name="Discounted"/>
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                  <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Top by Revenue</div>
                  <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                      <Pie data={agg.topItems.slice(0,8)} dataKey="revenue" nameKey="name" cx="50%" cy="45%" outerRadius={78} paddingAngle={3}>
                        {agg.topItems.slice(0,8).map((_,i)=><Cell key={i} fill={COLORS[i%10]}/>)}
                      </Pie>
                      <Tooltip content={<Tip/>}/>
                      <Legend formatter={v=><span style={{color:"#666",fontSize:9}}>{v.length>20?v.slice(0,20)+"…":v}</span>}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                  <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Top Stores by Revenue</div>
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={agg.byStore.slice(0,10)} layout="vertical" margin={{left:10,right:30}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A" horizontal={false}/>
                      <XAxis type="number" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`}/>
                      <YAxis type="category" dataKey="store" tick={{fill:"#888",fontSize:9}} axisLine={false} tickLine={false} width={80}/>
                      <Tooltip content={<Tip/>}/>
                      <Bar dataKey="revenue" fill={accent} radius={[0,3,3,0]} name="Revenue"/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {subtab==="stores"&&(
            <div>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20,marginBottom:14}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Revenue by Store</div>
                <ResponsiveContainer width="100%" height={Math.max(200,agg.byStore.length*34)}>
                  <BarChart data={agg.byStore} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A" horizontal={false}/>
                    <XAxis type="number" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1e3).toFixed(1)}K`}/>
                    <YAxis dataKey="store" type="category" width={120} tick={{fill:"#888",fontSize:9}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<Tip/>}/>
                    <Bar dataKey="revenue" name="Revenue" radius={[0,3,3,0]}>
                      {agg.byStore.map((_,i)=><Cell key={i} fill={COLORS[i%10]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>All Stores ({agg.byStore.length})</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:`1px solid ${BORDER}`}}>
                      <th style={{padding:"7px 10px",color:"#444",fontSize:9,textTransform:"uppercase"}}>#</th>
                      {[["store","Store"],["units","Units"],["gross","Gross"],["revenue","Actual Rev"],["discPct","Disc %"],["avg","Avg/Unit"],["share","Share"]].map(([col,lbl])=>(
                        <th key={col} onClick={()=>{if(sortStoreCol===col){setSortStoreDir(d=>d==="asc"?"desc":"asc")}else{setSortStoreCol(col);setSortStoreDir("desc")}}}
                          style={{textAlign:"left",padding:"7px 10px",color:sortStoreCol===col?"#fff":"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>
                          {lbl}{sortStoreCol===col?(sortStoreDir==="asc"?" ↑":" ↓"):" ↕"}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...agg.byStore].sort((a,b)=>{
                      const mul=sortStoreDir==="asc"?1:-1
                      if(sortStoreCol==="store") return mul*a.store.localeCompare(b.store)
                      if(sortStoreCol==="units") return mul*(a.units-b.units)
                      if(sortStoreCol==="gross") return mul*((a.gross||a.revenue)-(b.gross||b.revenue))
                      if(sortStoreCol==="revenue") return mul*(a.revenue-b.revenue)
                      if(sortStoreCol==="discPct"){const ap=a.gross>0?(a.gross-a.revenue)/a.gross:0;const bp=b.gross>0?(b.gross-b.revenue)/b.gross:0;return mul*(ap-bp)}
                      if(sortStoreCol==="avg") return mul*((a.units?a.revenue/a.units:0)-(b.units?b.revenue/b.units:0))
                      return 0
                    }).map((s,i)=>(
                      <tr key={s.store}>
                        <td style={{padding:"8px 10px",color:"#333"}}>{i+1}</td>
                        <td style={{padding:"8px 10px",color:"#ddd"}}>{s.store}</td>
                        <td style={{padding:"8px 10px",color:TEAL}}>{s.units}</td>
                        <td style={{padding:"8px 10px",color:"#22C55E"}}>${(s.gross||s.revenue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                        <td style={{padding:"8px 10px",color:"#F97316"}}>${s.revenue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                        <td style={{padding:"8px 10px",color:(s.gross&&s.gross>s.revenue)?"#F59E0B":"#444",fontSize:10}}>{s.gross&&s.gross>0?((s.gross-s.revenue)/s.gross*100).toFixed(1)+"%":"0%"}</td>
                        <td style={{padding:"8px 10px",color:GOLD}}>${s.units?(s.revenue/s.units).toFixed(2):"—"}</td>
                        <td style={{padding:"8px 10px",minWidth:100}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <div style={{flex:1,height:3,background:BORDER,borderRadius:2}}>
                              <div style={{width:`${Math.round(s.revenue/agg.totalRevenue*100)}%`,height:"100%",background:COLORS[i%10],borderRadius:2}}/>
                            </div>
                            <span style={{color:"#444",fontSize:10}}>{Math.round(s.revenue/agg.totalRevenue*100)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {subtab==="storedetail"&&(
            <div>
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase"}}>Select Stores {selectedStore&&selectedStore.length>0?`— ${selectedStore.length} selected`:""}</div>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>setSelectedStore(agg.byStore.map(s=>s.store))} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Select All</button>
                    <button onClick={()=>setSelectedStore(null)} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Clear</button>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:4}}>
                  {[...agg.byStore].sort((a,b)=>a.store.localeCompare(b.store)).map(s=>{
                    const isSelected=Array.isArray(selectedStore)&&selectedStore.includes(s.store)
                    const toggle=()=>{
                      if(!selectedStore||!Array.isArray(selectedStore)) setSelectedStore([s.store])
                      else if(isSelected){const next=selectedStore.filter(x=>x!==s.store);setSelectedStore(next.length?next:null)}
                      else setSelectedStore([...selectedStore,s.store])
                    }
                    return (
                      <button key={s.store} onClick={toggle} style={{padding:"9px 12px",borderRadius:7,background:isSelected?`${accent}22`:CARD,border:`1px solid ${isSelected?accent:BORDER}`,color:isSelected?accent:"#777",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer",textAlign:"left",transition:"all .15s",display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:isSelected?accent:"#2A2A3A",flexShrink:0}}/>
                        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.store}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              {(!selectedStore||!selectedStore.length)&&(
                <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:36,textAlign:"center",color:"#444",fontSize:12}}>Select one or more stores above to see their product breakdown</div>
              )}
              {selectedStore&&selectedStore.length>0&&(()=>{
                const inRange=d=>{if(!d)return true;if(dateFrom&&d<dateFrom)return false;if(dateTo&&d>dateTo)return false;return true}
                const storeRevel=(data.revelRows||[]).filter(r=>selectedStore.includes(r.store)&&inRange(r.date))
                const storeResova=(data.resovaRows||[]).filter(r=>selectedStore.includes(r.store)&&inRange(r.date))
                const byProduct={}
                storeRevel.forEach(r=>{if(!byProduct[r.name])byProduct[r.name]={name:r.name,units:0,revenue:0};byProduct[r.name].units+=r.units;byProduct[r.name].revenue+=r.revenue})
                storeResova.forEach(r=>{if(!byProduct[r.item])byProduct[r.item]={name:r.item,units:0,revenue:0};byProduct[r.item].units+=r.qty||1;byProduct[r.item].revenue+=r.revenue})
                const items=Object.values(byProduct).map(p=>({...p,revenue:+p.revenue.toFixed(2)})).sort((a,b)=>b.revenue-a.revenue)
                const totalRev=+items.reduce((s,i)=>s+i.revenue,0).toFixed(2)
                const totalGrossStore=+[...storeRevel,...storeResova].reduce((s,r)=>s+(r.gross||r.revenue||0),0).toFixed(2)
                const totalUnits=items.reduce((s,i)=>s+i.units,0)
                const title=selectedStore.length===1?selectedStore[0]:`${selectedStore.length} Stores Combined`
                return (
                  <>
                    <div style={{background:CARD,border:`1px solid ${accent}33`,borderRadius:10,padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                      <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#fff",letterSpacing:2}}>{title}</div>
                      <div style={{display:"flex",gap:20}}>
                        <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>Gross</div><div style={{fontSize:16,color:"#22C55E",fontFamily:"'Bebas Neue'"}}>${totalGrossStore.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>Actual</div><div style={{fontSize:16,color:"#F97316",fontFamily:"'Bebas Neue'"}}>${totalRev.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>Units</div><div style={{fontSize:16,color:GOLD,fontFamily:"'Bebas Neue'"}}>{totalUnits.toLocaleString()}</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>Products</div><div style={{fontSize:16,color:TEAL,fontFamily:"'Bebas Neue'"}}>{items.length}</div></div>
                      </div>
                    </div>
                    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                      <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>All Products ({items.length})</div>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                        <thead>
                          <tr style={{borderBottom:`1px solid ${BORDER}`}}>
                            {[{label:"#",col:null},{label:"Product",col:"name"},{label:"Units",col:"units"},{label:"Revenue",col:"revenue"},{label:"Avg/Unit",col:"avg"},{label:"Share",col:"share"}].map(({label:l,col})=>(
                              <th key={l} onClick={()=>{if(!col)return;setStoreDetailSort(s=>s.col===col?{col,dir:s.dir==="asc"?"desc":"asc"}:{col,dir:col==="name"?"asc":"desc"})}} style={{textAlign:"left",padding:"7px 10px",color:storeDetailSort.col===col?accent:"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase",cursor:col?"pointer":"default",userSelect:"none",whiteSpace:"nowrap"}}>
                                {l}{col&&(storeDetailSort.col===col?storeDetailSort.dir==="asc"?" ▲":" ▼":" ↕")}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[...items].sort((a,b)=>{const{col,dir}=storeDetailSort;const mul=dir==="asc"?1:-1;if(col==="name")return mul*a.name.localeCompare(b.name);if(col==="units")return mul*(a.units-b.units);if(col==="revenue")return mul*(a.revenue-b.revenue);if(col==="avg")return mul*((a.units?a.revenue/a.units:0)-(b.units?b.revenue/b.units:0));return 0}).map((item,i)=>(
                            <tr key={item.name}>
                              <td style={{padding:"8px 10px",color:"#333"}}>{i+1}</td>
                              <td style={{padding:"8px 10px",color:"#ddd"}}>{item.name}</td>
                              <td style={{padding:"8px 10px",color:TEAL}}>{item.units}</td>
                              <td style={{padding:"8px 10px",color:accent}}>${item.revenue.toLocaleString()}</td>
                              <td style={{padding:"8px 10px",color:GOLD}}>${item.units?(item.revenue/item.units).toFixed(2):"—"}</td>
                              <td style={{padding:"8px 10px",minWidth:110}}>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  <div style={{flex:1,height:3,background:BORDER,borderRadius:2}}>
                                    <div style={{width:`${totalRev?Math.round(item.revenue/totalRev*100):0}%`,height:"100%",background:COLORS[i%10],borderRadius:2}}/>
                                  </div>
                                  <span style={{color:"#444",fontSize:10}}>{totalRev?Math.round(item.revenue/totalRev*100):0}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )
              })()}
            </div>
          )}

          {subtab==="products"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                  <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Top by Revenue</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={agg.topItems.slice(0,10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A" horizontal={false}/>
                      <XAxis type="number" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
                      <YAxis dataKey="name" type="category" width={140} tick={{fill:"#888",fontSize:9}} axisLine={false} tickLine={false}/>
                      <Tooltip content={<Tip/>}/>
                      <Bar dataKey="revenue" fill={GOLD} radius={[0,3,3,0]} name="Revenue"/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                  <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Top by Units</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={agg.topItems.slice(0,10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A" horizontal={false}/>
                      <XAxis type="number" tick={{fill:"#555",fontSize:9}} axisLine={false} tickLine={false}/>
                      <YAxis dataKey="name" type="category" width={140} tick={{fill:"#888",fontSize:9}} axisLine={false} tickLine={false}/>
                      <Tooltip content={<Tip/>}/>
                      <Bar dataKey="units" fill={TEAL} radius={[0,3,3,0]} name="Units"/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>All Products ({agg.topItems.length})</div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead>
                      <tr style={{borderBottom:`1px solid ${BORDER}`}}>
                        {[{label:"#",col:null},{label:"Product",col:"name"},{label:"Units",col:"units"},{label:"Gross",col:"gross"},{label:"Actual Rev",col:"revenue"},{label:"Disc %",col:"discPct"},{label:"Avg Price",col:"avg"},{label:"Share",col:"share"}].map(({label:l,col})=>(
                          <th key={l} onClick={()=>{if(!col)return;setProductsSort(s=>s.col===col?{col,dir:s.dir==="asc"?"desc":"asc"}:{col,dir:col==="name"?"asc":"desc"})}} style={{textAlign:"left",padding:"7px 10px",color:productsSort.col===col?accent:"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase",cursor:col?"pointer":"default",userSelect:"none",whiteSpace:"nowrap"}}>
                            {l}{col&&(productsSort.col===col?productsSort.dir==="asc"?" ▲":" ▼":" ↕")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...agg.topItems].sort((a,b)=>{const{col,dir}=productsSort;const mul=dir==="asc"?1:-1;if(col==="name")return mul*a.name.localeCompare(b.name);if(col==="units")return mul*(a.units-b.units);if(col==="revenue")return mul*(a.revenue-b.revenue);if(col==="avg")return mul*((a.units?a.revenue/a.units:0)-(b.units?b.revenue/b.units:0));return 0}).map((item,i)=>(
                        <tr key={item.name}>
                          <td style={{padding:"8px 10px",color:"#333"}}>{i+1}</td>
                          <td style={{padding:"8px 10px",color:"#ddd"}}>{item.name}</td>
                          <td style={{padding:"8px 10px",color:TEAL}}>{item.units}</td>
                          <td style={{padding:"8px 10px",color:"#22C55E"}}>${(item.gross||item.revenue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td style={{padding:"8px 10px",color:accent}}>${item.revenue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td style={{padding:"8px 10px",color:item.gross&&item.discount?"#F59E0B":"#444",fontSize:10}}>{item.gross&&item.gross>0?((item.discount||0)/item.gross*100).toFixed(1)+"%":"0%"}</td>
                          <td style={{padding:"8px 10px",color:GOLD}}>${item.units?(item.revenue/item.units).toFixed(2):"—"}</td>
                          <td style={{padding:"8px 10px",minWidth:100}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <div style={{flex:1,height:3,background:BORDER,borderRadius:2}}>
                                <div style={{width:`${Math.round(item.revenue/agg.totalRevenue*100)}%`,height:"100%",background:COLORS[i%10],borderRadius:2}}/>
                              </div>
                              <span style={{color:"#444",fontSize:10,minWidth:24}}>{Math.round(item.revenue/agg.totalRevenue*100)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {subtab==="trends"&&(
            <div>
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:20}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Revenue Trend</div>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={agg.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2A"/>
                    <XAxis dataKey="month" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`}/>
                    <Tooltip content={<Tip/>}/>
                    <Legend formatter={v=><span style={{color:"#888",fontSize:10}}>{v}</span>}/>
                    <Line type="monotone" dataKey="gross" stroke="#22C55E" strokeWidth={2} strokeDasharray="5 3" dot={{r:3}} name="Gross"/>
                    <Line type="monotone" dataKey="revenue" stroke={accent} strokeWidth={2.5} dot={{r:3}} name="Actual"/>
                    <Line type="monotone" dataKey="discount" stroke="#F59E0B" strokeWidth={2} dot={{r:3}} name="Discounted"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {subtab==="search"&&(
            <div>
              <div style={{marginBottom:12}}>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:8}}>
                  <div style={{flex:1,minWidth:200,display:"flex",gap:0,background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,overflow:"hidden"}}>
                    <input value={searchInput} onChange={e=>setSearchInput(e.target.value)}
                      onKeyDown={e=>{if((e.key==="Enter"||e.key===",")&&searchInput.trim()){e.preventDefault();const t=searchInput.trim().replace(/,$/,"");if(t&&!searchTerms.includes(t)){setSearchTerms(p=>[...p,t]);setSelectedProducts([])}setSearchInput("")}}}
                      placeholder={searchTerms.length?"Add another term… (Enter to add)":"Type a product name and press Enter…"}
                      style={{flex:1,padding:"10px 14px",background:"transparent",border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:12,outline:"none"}}/>
                    {searchInput.trim()&&<button onClick={()=>{const t=searchInput.trim();if(t&&!searchTerms.includes(t)){setSearchTerms(p=>[...p,t]);setSelectedProducts([])}setSearchInput("")}} style={{padding:"10px 14px",background:accent,border:"none",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"}}>+ ADD</button>}
                  </div>
                  <StorePicker allStores={[...new Set([...(data.revelRows||[]).map(r=>r.store),...(data.resovaRows||[]).map(r=>r.store)].filter(Boolean))].sort()} selected={searchStores} onChange={setSearchStores} accent={accent}/>
                  <DateRange revelRows={data.revelRows} resovaRows={data.resovaRows} dateFrom={searchFrom} dateTo={searchTo} onChange={(f,t)=>{setSearchFrom(f);setSearchTo(t)}}/>
                </div>
                {searchTerms.length>0&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {searchTerms.map(t=>(
                      <div key={t} style={{display:"flex",alignItems:"center",gap:6,background:`${accent}22`,border:`1px solid ${accent}55`,borderRadius:20,padding:"4px 10px 4px 12px"}}>
                        <span style={{fontSize:11,color:accent}}>{t}</span>
                        <button onClick={()=>{setSearchTerms(p=>p.filter(x=>x!==t));setSelectedProducts([])}} style={{background:"none",border:"none",color:accent,cursor:"pointer",fontSize:13,lineHeight:1,padding:0}}>×</button>
                      </div>
                    ))}
                    <button onClick={()=>{setSearchTerms([]);setSelectedProducts([]);setSearchInput("")}} style={{fontSize:10,color:"#555",background:"none",border:`1px solid ${BORDER}`,borderRadius:20,padding:"4px 10px",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Clear all</button>
                  </div>
                )}
              </div>
              {!searchTerms.length&&<div style={{color:"#444",fontSize:12,padding:20,textAlign:"center"}}>Type a product name above and press Enter to search</div>}
              {searchTerms.length>0&&(()=>{
                const inRange=d=>{if(!d)return true;if(searchFrom&&d<searchFrom)return false;if(searchTo&&d>searchTo)return false;return true}
                const inStore=s=>!searchStores.length||searchStores.includes(s)
                const matchesAny=name=>searchTerms.some(t=>name.toLowerCase().includes(t.toLowerCase()))
                const allMatchRevel=(data.revelRows||[]).filter(r=>matchesAny(r.name)&&inRange(r.date)&&inStore(r.store))
                const allMatchResova=(data.resovaRows||[]).filter(r=>matchesAny(r.item)&&inRange(r.date)&&inStore(r.store))
                const allProductNames=[...new Set([...allMatchRevel.map(r=>r.name),...allMatchResova.map(r=>r.item)])].sort()
                if (!allProductNames.length) return <div style={{color:"#444",fontSize:12,padding:20,textAlign:"center"}}>No products found</div>
                const activeProd=selectedProducts.length>0?selectedProducts:allProductNames
                const matchRevel=allMatchRevel.filter(r=>activeProd.includes(r.name))
                const matchResova=allMatchResova.filter(r=>activeProd.includes(r.item))
                const totalRev=+[...matchRevel,...matchResova].reduce((s,r)=>s+r.revenue,0).toFixed(2)
                const totalUnits=Math.round(matchRevel.reduce((s,r)=>s+r.units,0)+matchResova.reduce((s,r)=>s+(r.qty||1),0))
                return (
                  <>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:16}}>
                      <KPI label="Actual Revenue" value={`$${totalRev.toLocaleString()}`} color={accent}/>
                      <KPI label="Units Sold" value={totalUnits.toLocaleString()} color={GOLD}/>
                      <KPI label="Avg/Unit" value={totalUnits?`$${(totalRev/totalUnits).toFixed(2)}`:"—"} color={PURPLE}/>
                    </div>
                    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase"}}>Matching Products — {activeProd.length} of {allProductNames.length} selected</div>
                        <button onClick={()=>setSelectedProducts([])} style={{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Select All</button>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {allProductNames.map(n=>{
                          const active=selectedProducts.length===0||selectedProducts.includes(n)
                          return <button key={n} onClick={()=>{if(selectedProducts.length===0){setSelectedProducts(allProductNames.filter(x=>x!==n))}else if(selectedProducts.includes(n)){const next=selectedProducts.filter(x=>x!==n);setSelectedProducts(next.length?next:[])}else{setSelectedProducts([...selectedProducts,n])}}} style={{fontSize:11,color:active?"#fff":"#444",background:active?`${accent}33`:DARK,border:`1px solid ${active?accent:BORDER}`,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontFamily:"'DM Mono',monospace",transition:"all .15s"}}>{n}</button>
                        })}
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function App() {
  const [auth,setAuth]=useState(false)
  const [pw,setPw]=useState("")
  const [pwErr,setPwErr]=useState(false)
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(true)
  const [loadErr,setLoadErr]=useState("")
  const [tab,setTab]=useState("teg")
  const [showAdd,setShowAdd]=useState(false)

  useEffect(()=>{
    const stored=sessionStorage.getItem("teg_auth")
    if (stored==="1") setAuth(true)
  },[])

  useEffect(()=>{
    if (!auth) return
    setLoading(true)
    loadFromSheets(SHEETS_URL, (pg, total) => {
      setLoadErr(`Loading page ${pg} of ${total}…`)
    }).then(raw=>{
      setLoadErr("")
      setData(expand(raw)||{revelRows:[],resovaRows:[],savedAt:null})
      setLoading(false)
    }).catch(e=>{
      setLoadErr(e.message)
      setLoading(false)
    })
  },[auth])

  const handleLogin = () => {
    if (pw===PASSWORD) { setAuth(true); sessionStorage.setItem("teg_auth","1") }
    else setPwErr(true)
  }

  if (!auth) return (
    <div style={{minHeight:"100vh",background:DARK,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:40,width:320,textAlign:"center"}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"#fff",letterSpacing:4,marginBottom:6}}>TEG <span style={{color:ACCENT}}>|</span> GBGS</div>
        <div style={{fontSize:10,color:"#555",letterSpacing:3,marginBottom:28}}>MERCH DASHBOARD</div>
        <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setPwErr(false)}} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
          placeholder="Enter password" style={{width:"100%",padding:"11px 14px",background:DARK,border:`1px solid ${pwErr?"#ef4444":BORDER}`,borderRadius:8,color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:13,outline:"none",marginBottom:12,boxSizing:"border-box"}}/>
        {pwErr&&<div style={{color:"#ef4444",fontSize:11,marginBottom:10}}>Incorrect password</div>}
        <button onClick={handleLogin} style={{width:"100%",padding:"11px",background:ACCENT,border:"none",borderRadius:8,color:"#fff",fontFamily:"'Bebas Neue'",fontSize:16,letterSpacing:2,cursor:"pointer"}}>ENTER</button>
      </div>
    </div>
  )

  const tegData={ revelRows:(data?.revelRows||[]).filter(r=>r.brand==="teg"), resovaRows:(data?.resovaRows||[]).filter(r=>r.brand==="teg") }
  const gbgsData={ revelRows:(data?.revelRows||[]).filter(r=>r.brand==="gbgs"), resovaRows:(data?.resovaRows||[]).filter(r=>r.brand==="gbgs") }
  const amData={ revelRows:(data?.revelRows||[]).filter(r=>r.brand==="am"), resovaRows:(data?.resovaRows||[]).filter(r=>r.brand==="am") }
  const tegStores=[...new Set([...tegData.revelRows.map(r=>r.store),...tegData.resovaRows.map(r=>r.store)])].sort()
  const gbgsStores=[...new Set([...gbgsData.revelRows.map(r=>r.store),...gbgsData.resovaRows.map(r=>r.store)])].sort()
  const amStores=[...new Set([...amData.revelRows.map(r=>r.store),...amData.resovaRows.map(r=>r.store)])].sort()
  const totalRows=(data?.revelRows?.length||0)+(data?.resovaRows?.length||0)

  return (
    <div style={{minHeight:"100vh",background:DARK,color:"#fff",fontFamily:"'DM Mono',monospace"}}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:`1px solid ${BORDER}`,position:"sticky",top:0,background:DARK,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontFamily:"'Bebas Neue'",fontSize:22,color:ACCENT,letterSpacing:3}}>TEG</span>
          <span style={{color:BORDER}}>|</span>
          <span style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#fff",letterSpacing:3}}>GBGS</span>
          <span style={{fontSize:9,color:"#555",letterSpacing:2,marginLeft:4}}>MERCH</span>
          {!loading&&!loadErr&&<span style={{fontSize:9,color:"#22C55E",background:"#22C55E15",border:"1px solid #22C55E33",borderRadius:20,padding:"2px 8px",letterSpacing:1}}>● LIVE</span>}
          {totalRows>0&&<span style={{fontSize:9,color:"#333"}}>{totalRows.toLocaleString()} rows</span>}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{display:"flex",gap:0,background:"#0D0D15",borderRadius:8,padding:3}}>
            {[["teg","TEG",ACCENT],["gbgs","GBGS","#E01483"],["am","AM","#ED5739"]].map(([id,lbl,col])=>(
              <button key={id} onClick={()=>setTab(id)} style={{padding:"5px 16px",borderRadius:6,background:tab===id?col+"22":"transparent",border:`1px solid ${tab===id?col:"transparent"}`,color:tab===id?col:"#555",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:1}}>
                {lbl}
              </button>
            ))}
          </div>
          <button onClick={()=>setShowAdd(true)} style={{padding:"7px 16px",borderRadius:7,background:ACCENT,border:"none",color:"#fff",fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:2,cursor:"pointer"}}>+ ADD DATA</button>
        </div>
      </div>

      <div style={{padding:"24px 28px"}}>
        {loading&&<div style={{textAlign:"center",padding:60,color:"#555"}}>Loading data…</div>}
        {loadErr&&(
          <div style={{textAlign:"center",padding:60}}>
            <div style={{color:"#ef4444",marginBottom:16}}>{loadErr}</div>
            <button onClick={()=>setShowAdd(true)} style={{padding:"8px 20px",borderRadius:7,background:"transparent",border:`1px solid ${BORDER}`,color:"#555",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"}}>RECONFIGURE</button>
          </div>
        )}
        {!loading&&!loadErr&&data&&(
          <>
            {tab==="teg"&&<BrandDashboard data={tegData} accent={ACCENT} allStores={tegStores} label="TEG"/>}
            {tab==="gbgs"&&<BrandDashboard data={gbgsData} accent="#E01483" allStores={gbgsStores} label="GBGS"/>}
            {tab==="am"&&<BrandDashboard data={amData} accent="#ED5739" allStores={amStores} label="AM"/>}
          </>
        )}
      </div>

      {showAdd&&<AddDataModal data={data} url={SHEETS_URL} onSave={newData=>{setData(newData);setShowAdd(false)}} onClose={()=>setShowAdd(false)}/>}
    </div>
  )
}