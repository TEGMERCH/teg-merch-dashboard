var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const { useState, useRef, useEffect, useMemo } = React;
const { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } = Recharts;
const PASSWORD = "teg2026";
const ACCENT = "#FE1D55";
const GOLD = "#D4A017";
const TEAL = "#4ECDC4";
const PURPLE = "#A78BFA";
const DARK = "#0A0A0F";
const CARD = "#111118";
const BORDER = "#1E1E2E";
const GBGS_COL = "#E01483";
const AM_COL = "#ED5739";
const COLORS = ["#FF5C1A", "#D4A017", "#4ECDC4", "#A78BFA", "#F59E0B", "#34D399", "#F87171", "#60A5FA", "#FB923C", "#A3E635"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const URL_KEY = "teg_sheets_url";
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbw-nv9rEdAMiYyLpxQRoFj7xqN1QmWO3kctUPWWIVyvNMUKGpmoQ8xYQeHT9MOjQSZd-Q/exec";
const DATA_KEY = "teg_local_v10";
function getUrl() {
  return SHEETS_URL;
}
function saveUrl(u) {
}
function getLocal() {
  return null;
}
function saveLocal(d) {
  return true;
}
const XOLA_PRICE_REF = {
  // Shirts
  "winner shirt": 25,
  "wheel shirt": 25,
  "icon shirt": 25,
  "chip shirt": 25,
  "the heist": 25,
  "ruins": 25,
  "winner winner shirt": 25,
  "xs shirt": 25,
  "s shirt": 25,
  "m shirt": 25,
  "l shirt": 25,
  "xl shirt": 25,
  "2xl shirt": 25,
  "3xl shirt": 25,
  "4xl shirt": 25,
  // Old shirts
  "winner winner shirt 8.4xl": 12.5,
  // Hats
  "gbgs chip hat": 20,
  "cosmo hat": 20,
  "blue hat": 20,
  "green hat": 20,
  "red hat": 20,
  "black hat": 20,
  // Pins
  "gbgs wheel pin": 7,
  "gbgs chip pin": 7,
  "gbgs camera pin": 7,
  "gbgs pencil pin": 7,
  "cosmic crisis pin": 7,
  "the depths pin": 7,
  "the heist pin": 7,
  "playground pin": 7,
  "ruins pin": 7,
  "special ops pin": 7,
  "prison break pin": 7,
  "gold rush pin": 7,
  "heist pin": 7,
  // Pin packs / shoe charms
  "shoe charm pack 1": 18,
  "shoe charm pack 2": 18,
  // Plushies
  "cosmo plushie": 22,
  // Plushie keychains / regular keychains
  "gbgs keychain": 10,
  "keychain": 5,
  // Unlockeds
  "unlocked activation code vol 1": 10,
  "unlocked activation code vol 2": 10,
  "unlocked activation code vol 3": 10,
  // EFIG / Escape From Iron Gate
  "efig board game": 29.99,
  "escape from iron gate": 29.99,
  // Bottles
  "red cosmo bottle": 14,
  "cosmo bottle": 14,
  "gbgs chip bottle": 14,
  // Magnets
  "gbgs magnet": 5,
  "gbgs wheel magnet": 5,
  "gbgs chip magnet": 5,
  // Beanies
  "beige beanie": 16,
  "black beanie": 16,
  // Pencils
  "gbgs blue medium pencil": 10,
  "gbgs red medium pencil": 10,
  // Drinks
  "coke": 2.99,
  "dasani water": 2.99,
  "water": 2.99
};
function getItemPrice(name) {
  const key = name.toLowerCase().trim();
  if (XOLA_PRICE_REF[key]) return XOLA_PRICE_REF[key];
  if (/shirt/i.test(name)) return 25;
  if (/old.*shirt|shirt.*old/i.test(name)) return 12.5;
  if (/hat|beanie/i.test(name)) return 20;
  if (/plushie/i.test(name)) return 22;
  if (/keychain/i.test(name)) return 5;
  if (/pin pack|charm/i.test(name)) return 18;
  if (/pin/i.test(name)) return 7;
  if (/unlock/i.test(name)) return 10;
  if (/bottle/i.test(name)) return 14;
  if (/magnet/i.test(name)) return 5;
  if (/pencil/i.test(name)) return 10;
  if (/coke|water|drink|beverage/i.test(name)) return 2.99;
  if (/efig|iron gate/i.test(name)) return 29.99;
  return null;
}
function isGBGS(store = "", name = "") {
  const s = (store + " " + name).toLowerCase();
  return s.includes("gbgs") || s.includes("great big game");
}
function getRowBrand(store = "", name = "") {
  const n = (name || "").toLowerCase(), s = (store || "").toLowerCase();
  if (n.includes("gbgs") || n.includes("great big game") || s.includes("gbgs") || s.includes("great big game")) return "gbgs";
  if (n.includes("adventure mining") || n.includes("gem hunt") || s.includes("adventure mining") || n.startsWith("am -") || n.startsWith("am-") || s.includes("adventure mining")) return "am";
  if (s === "am" || s.startsWith("am ") || s.endsWith(" am")) return "am";
  return "teg";
}
function normalizeName(raw = "") {
  return raw.replace(/^(teg|gbgs)\s*[-–]\s*/i, "").replace(/\s*[-/(|]\s*(xs|s|m|l|xl|xxl|2xl|3xl|small|medium|large|x-?large|extra\s*large|one\s*size|os)\s*[)\s]*$/i, "").replace(/\s+\d+\.\s*(xs|s|m|l|xl|xxl|2xl|3xl|small|medium|large)$/i, "").replace(/\s*\([^)]*\)\s*$/, "").trim().replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
function parseFilename(filename) {
  const base = filename.replace(/\.(csv|xlsx|xls)$/i, "");
  if (/^xola_/i.test(base)) {
    const dates2 = [...base.matchAll(/(\d{4})[_-](\d{2})[_-](\d{2})/g)].map((m) => `${m[1]}-${m[2]}-${m[3]}`);
    return { city: null, dateFrom: dates2[0] || null, dateTo: dates2[1] || null };
  }
  // Strip trailing file-number suffixes: _2, _3, (2), Seattle_Downtown3 -> Seattle_Downtown
  const base2 = base
    .replace(/_?\(\d+\)\s*$/, "")
    .replace(/_\d+$/, "")
    .replace(/\d+$/, "");
  const parts = base2.split("_");
  const dateIdx = parts.findIndex((p) => /^\d{4}(-\d{2}(-\d{2})?)?$/.test(p));
  const skip = /* @__PURE__ */ new Set(["product", "mix", "sales", "export", "report", "revel", "resova", "gbgs", "teg", "data", "the", "escape", "game", "keys", "00", "bookings", "booking"]);
  let city = null;
  const citySource = dateIdx > 0 ? parts.slice(0, dateIdx) : parts;
  const cityParts = citySource.filter((p) => !skip.has(p.toLowerCase()) && p.length > 1 && !/^\d+$/.test(p));
  if (cityParts.length > 0) {
    city = cityParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
  }
  const dates = [...base.matchAll(/(\d{4})[_-](\d{2})[_-](\d{2})/g)].map((m) => `${m[1]}-${m[2]}-${m[3]}`);
  return { city, dateFrom: dates[0] || null, dateTo: dates[1] || null };
}
function normalizeStore(raw = "") {
  const ABBREVS = {
    "dc": "DC", "nyc": "NYC", "ny": "NY", "la": "LA", "sf": "SF",
    "nj": "NJ", "sc": "SC", "nc": "NC", "tx": "TX", "ca": "CA",
    "fl": "FL", "ga": "GA", "tn": "TN", "co": "CO", "va": "VA",
    "md": "MD", "pa": "PA", "oh": "OH", "il": "IL", "mn": "MN",
    "mo": "MO", "at": "AT", "us": "US", "uk": "UK", "ie": "IE",
    "nv": "NV", "az": "AZ", "wa": "WA", "or": "OR", "ut": "UT",
    "nm": "NM", "ok": "OK", "ar": "AR", "ms": "MS", "al": "AL", "wh": "WH"
  };

  // TEG: San Francisco Fisherman's Wharf → "San Francisco Wharf" (keep distinct from plain SF)
  // GBGS: San Francisco Fisherman's Wharf → "San Francisco" (single GBGS SF store)
  // We handle GBGS SF in csvToResovaRows via filenameBrand; here we just map the raw name
  // For TEG: preserve "Wharf" as distinct store
  if (/san\s*francisco/i.test(raw) && /fisherman|wha/i.test(raw)) {
    raw = "San Francisco Wharf";
  }

  // Strip brand prefixes
  raw = raw
    .replace(/^the escape (game|keys)\s*[-–:]?\s*/i, "")
    .replace(/^teg\s*[-–:]?\s*/i, "")
    .replace(/^gbgs\s*[-–:]?\s*/i, "")
    .replace(/^great big game show\s*[-–:]?\s*/i, "")
    .replace(/^adventure mining\s*[-–:]?\s*/i, "")
    .replace(/^am\s*[-–:]\s*/i, "");

  // Merge aliases
  raw = raw
    .replace(/[-–]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Store aliases — normalize to canonical name
  const ALIASES = {
    "dedham ma": "Dedham",
    "orange": "Orange",
    "orange ca": "Orange",
    "las vegas area": "Las Vegas Area 15",
    "nashville": "Nashville Downtown",
    "crocker park westlake oh": "Crocker Park",
    "crocker park westlake": "Crocker Park",
    "seattle": "Seattle SC",
    "seattle sc": "Seattle SC",
    "sunrise blvd fl": "Sunrise",
    "sunrise blvd": "Sunrise",
    "las vegas area 15": "Las Vegas Area 15",
    "the colony.": "The Colony",
  };
  const lower = raw.toLowerCase();
  if (ALIASES[lower]) return ALIASES[lower];

  let result = raw.replace(/\b\w+/g, (w) => ABBREVS[w.toLowerCase()] || w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  result = result.replace(/\bUtc\b/g, "UTC");
  result = result.replace(/\bMoa\b/g, "MOA");
  return result;
}
async function sheetsCall(baseUrl, params = {}) {
  const action = params.action || "";
  if (action === "save" || action === "append") {
    const res2 = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params).toString()
    });
    const text2 = await res2.text();
    if (text2.trim().startsWith("<")) throw new Error("Apps Script returned HTML \u2014 check: Execute as Me, Access Anyone");
    const json2 = JSON.parse(text2);
    if (!json2.ok) throw new Error(json2.error || "Apps Script error");
    return json2;
  }
  const url = baseUrl + "?" + new URLSearchParams(params).toString();
  const res = await fetch(url);
  const text = await res.text();
  if (text.trim().startsWith("<")) throw new Error("Apps Script returned HTML \u2014 check: Execute as Me, Access Anyone");
  const json = JSON.parse(text);
  if (!json.ok) throw new Error(json.error || "Apps Script error");
  return json;
}
async function ping(url) {
  return sheetsCall(url, { action: "ping" });
}
async function loadFromSheets(url) {
  const r = await sheetsCall(url, { action: "load" });
  return r.data;
}
async function saveToSheets(url, data) {
  const slim = slimify(data);
  const CHUNK = 200;
  await sheetsCall(url, { action: "save", payload: encodeURIComponent(JSON.stringify({ ts: slim.ts, rr: [], sr: [] })) });
  for (let i = 0; i < slim.rr.length; i += CHUNK)
    await sheetsCall(url, { action: "append", payload: encodeURIComponent(JSON.stringify({ rr: slim.rr.slice(i, i + CHUNK), sr: [], ts: slim.ts })) });
  for (let i = 0; i < slim.sr.length; i += CHUNK)
    await sheetsCall(url, { action: "append", payload: encodeURIComponent(JSON.stringify({ rr: [], sr: slim.sr.slice(i, i + CHUNK), ts: slim.ts })) });
  return { ok: true };
}
async function appendToSheets(url, newRR, newSR, ts) {
  const CHUNK = 200;
  for (let i = 0; i < newRR.length; i += CHUNK)
    await sheetsCall(url, { action: "append", payload: encodeURIComponent(JSON.stringify({ rr: newRR.slice(i, i + CHUNK), sr: [], ts })) });
  for (let i = 0; i < newSR.length; i += CHUNK)
    await sheetsCall(url, { action: "append", payload: encodeURIComponent(JSON.stringify({ rr: [], sr: newSR.slice(i, i + CHUNK), ts })) });
  return { ok: true };
}
function slimify(d) {
  return {
    ts: d.savedAt,
    rr: (d.revelRows || []).map((r) => [r.date || "", r.name || "", r.category || "", +(r.units || 0), +(r.revenue || 0), r.store || "", r.brand || "teg", +(r.gross||r.revenue||0), +(r.discount||0)]),
    sr: (d.resovaRows || []).map((r) => [r.date || "", r.item || "", +(r.qty || 0), +(r.revenue || 0), r.store || "", r.brand || "teg", +(r.gross||r.revenue||0), +(r.discount||0)])
  };
}
function expand(slim) {
  if (!slim) return null;
  return {
    savedAt: slim.ts,
    // Apply normalizeStore on load so hyphens/prefixes get cleaned even on old saved data
    revelRows: (slim.rr || []).map((r) => ({ date: r[0], name: r[1], category: r[2], units: r[3], revenue: r[4], store: normalizeStore(r[5] || ""), brand: r[6] || "teg", gross: r[7]||r[4], discount: r[8]||0 })),
    resovaRows: (slim.sr || []).map((r) => ({ date: r[0], item: r[1], qty: r[2], revenue: r[3], store: normalizeStore(r[4] || ""), brand: r[5] || "teg", gross: r[6]||r[3], discount: r[7]||0 }))
  };
}
function parseCSV(text) {
  const lines = text.replace(/^\uFEFF/, "").replace(/\uFEFF/g, "").trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^\uFEFF/, "").replace(/^"|"$/g, "").toLowerCase());
  return lines.slice(1).map((line) => {
    const vals = [];
    let cur = "", q = false;
    for (const ch of line) {
      if (ch === '"') q = !q;
      else if (ch === "," && !q) {
        vals.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    vals.push(cur.trim());
    return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || "").replace(/^"|"$/g, "").trim()]));
  }).filter((r) => Object.values(r).some((v) => v));
}
function fieldFind(h, ...c) {
  return h.find((x) => c.some((y) => x.toLowerCase().includes(y.toLowerCase()))) || null;
}
function detectType(headers) {
  const h = headers.join(" ").toLowerCase();
  return ["inventory item", "sale net total", "payment status", "gratuity"].filter((k) => h.includes(k)).length >= 1 ? "resova" : "revel";
}
function parseDate(val) {
  if (!val) return "";
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const dmy = s.match(/^(\d{1,2})[\s-]([A-Za-z]+)[\s-](\d{4})/);
  if (dmy) {
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const mi = months.indexOf(dmy[2].toLowerCase().slice(0, 3));
    if (mi >= 0) return `${dmy[3]}-${String(mi + 1).padStart(2, "0")}-${String(dmy[1]).padStart(2, "0")}`;
  }
  const d = new Date(val);
  if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return "";
}
function csvToRevelRows(rows, store, fallbackDate = "") {
  const h = Object.keys(rows[0]);
  const f = {
    name: fieldFind(h, "product name", "item name", "product", "name", "description", "menu item"),
    qty: fieldFind(h, "quantity", "qty", "units", "count"),
    price: fieldFind(h, "unit price", "price", "cost", "rate"),
    total: h.find((x) => x === "total sales inc item discounts") || h.find((x) => x.includes("total sales inc item discounts")) || h.find((x) => x.includes("total sales inc") || x.includes("total inc")) || h.find((x) => x === "total sales") || fieldFind(h, "subtotal", "revenue", "amount", "net"),
    grossCol: h.find((x) => x === "total sales") || null,
    discountCol: h.find((x) => x === "item discounts") || h.find((x) => x.includes("item discount")) || null,
    date: fieldFind(h, "date", "created", "time", "order date", "transaction date", "closed"),
    category: fieldFind(h, "category", "department", "class", "group", "type"),
    storeCol: fieldFind(h, "establishment", "store", "location", "site", "outlet")
  };
  return rows.filter((row) => {
    const rawName = (f.name ? row[f.name] || "" : "").toLowerCase();
    if (/gift|trivia showdown|holiday edition|single contestant|private studio|4for100|4 for 100|4 for \$100|launch|great big game show|the original|reservation id|replacement pin|replacement name tag|omitb|teg combo pass|special items|omitb walkin|omitb walk in|cash/i.test(rawName)) return false;
    return true;
  }).map((row) => {
    const rawName = f.name ? row[f.name] || "Unknown" : "Unknown";
    const rawStore = f.storeCol ? row[f.storeCol] || "" : "";
    const brand = getRowBrand(rawStore, rawName);
    const name = normalizeName(rawName);
    const units = parseFloat(f.qty ? row[f.qty] : 1) || 1;
    const rev = parseFloat(f.total ? row[f.total] : f.price ? parseFloat(row[f.price] || 0) * units : 0) || 0;
    const cat = f.category ? row[f.category] || "" : "";
    let rowStore = normalizeStore(rawStore) || normalizeStore(store || "") || "Unknown";
    // GBGS store normalizations
    if (brand === "gbgs") {
      if (/san francisco/i.test(rowStore)) rowStore = "San Francisco";
      if (/^seattle$/i.test(rowStore)) rowStore = "Seattle SC";
    }
    let date = f.date && row[f.date] ? parseDate(row[f.date]) : "";
    if (!date && fallbackDate) date = parseDate(fallbackDate) || "";
    const grossAmt = f.grossCol ? parseFloat(row[f.grossCol]) || 0 : rev;
    const discountAmt = f.discountCol ? parseFloat(row[f.discountCol]) || 0 : +(grossAmt - rev).toFixed(2);
    return { date, name, category: cat, units, revenue: +rev.toFixed(2), gross: +grossAmt.toFixed(2), discount: +Math.abs(discountAmt).toFixed(2), store: rowStore, brand };
  });
}
function csvToResovaRows(rows, store, filenameBrand=null) {
  const h = Object.keys(rows[0]);
  const hl = h.map(x => x.toLowerCase().trim());
  const fi = (candidates) => {
    for (const c of candidates) {
      const idx = hl.findIndex(x => x.includes(c.toLowerCase()));
      if (idx >= 0) return h[idx];
    }
    return null;
  };
  const f = {
    item:      fi(["inventory item", "item", "room", "experience", "activity", "service", "product"]),
    date:      fi(["date", "sale date", "created", "start date", "session date"]),
    subtotal:  fi(["subtotal"]),
    discount:  fi(["discount codes value", "discount amount", "discount value", "coupon amount"]),
    coupon:    fi(["discount code", "coupon code", "promo code", "voucher code"]),
    total:     fi(["booking net total", "net total", "sale net total", "actual revenue", "total", "amount", "paid", "revenue"]),
    status:    fi(["payment status", "status", "state"]),
    qty:       fi(["quantity", "qty", "sales", "guests", "players", "people"]),
    storeCol:  fi(["store", "location", "establishment", "site", "venue", "outlet"])
  };
  const cleanRows = rows.filter((r, i) => {
    if (i === rows.length - 1) {
      const item = (f.item ? r[f.item] : "").toLowerCase().trim();
      if (!item || item.includes("total") || item.includes("grand")) return false;
    }
    return true;
  });
  return cleanRows.filter((r) => {
    if (f.status && ["cancelled", "canceled", "refunded", "void"].includes((r[f.status] || "").toLowerCase())) return false;
    const item = (f.item ? r[f.item] : "").toLowerCase();
    if (/gift card|single.?player|private experience|private studio|trivia showdown|holiday edition|single contestant|4for100|4 for 100|4 for \$100|launch|great big game show|the original|reservation id|replacement pin|replacement name tag|omitb|teg combo pass|special items|omitb walkin|omitb walk in|cash/i.test(item)) return false;
    if (!item.trim()) return false;
    return true;
  }).map((row) => {
    const rawItem = f.item ? row[f.item] || "" : "";
    const rawStore = f.storeCol ? row[f.storeCol] || "" : "";
    const brand = filenameBrand || getRowBrand(rawItem, rawItem);
    const item = normalizeName(rawItem
      .replace(/^TEG\s*[-–]\s*/i, "")
      .replace(/^GBGS\s*[-–]\s*/i, "")
      .replace(/^AM\s*[-–]\s*/i, "")
    );
    const qty = parseFloat(f.qty ? row[f.qty] : 1) || 1;
    const gross = parseFloat(f.subtotal ? row[f.subtotal] : 0) || 0;
    const rev = parseFloat(f.total ? row[f.total] : 0) || 0;
    const discountAmt = +(Math.max(0, gross - rev)).toFixed(2);
    const couponCode = f.coupon ? (row[f.coupon] || "").trim() : (discountAmt > 0 ? "Discount Applied" : "");
    let rowStore = normalizeStore(rawStore) || normalizeStore(store || "") || "Unknown";
    // GBGS store normalizations
    if (brand === "gbgs") {
      if (/san francisco/i.test(rowStore)) rowStore = "San Francisco";
      if (/^seattle$/i.test(rowStore)) rowStore = "Seattle SC";
    }
    const date = f.date && row[f.date] ? parseDate(row[f.date]) : "";
    return { date, item, qty, revenue: +rev.toFixed(2), gross: +gross.toFixed(2), discount: +discountAmt.toFixed(2), couponCode, store: rowStore, brand };
  });
}


function xlsxToXolaRows(workbook, store) {
  const ws = workbook.Sheets["Reservations"];
  if (!ws) return [];
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
  if (raw.length < 3) return [];
  if (!store) {
    const details = workbook.Sheets["Report Details"];
    if (details) {
      const detailRows = XLSX.utils.sheet_to_json(details, { header: 1, defval: null });
      for (const row of detailRows) {
        if (row[0] && String(row[0]).toLowerCase().includes("company") && row[1]) {
          store = String(row[1]).replace(/^the escape (game|keys)\s*/i, "").replace(/\s*\(.*\)\s*$/, "").trim();
          break;
        }
      }
    }
  }
  const h0 = raw[0] || [], h1 = raw[1] || [];
  const headers = h0.map((v, i) => (h1[i] || v || "").toString().trim());
  const colIdx = (name) => headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
  const PRODUCT_COL = colIdx("Product");
  const PURCHASE_COL = colIdx("Purchase Date");
  const BASE_COL = colIdx("Base Amount");
  const COUPON_COL = colIdx("Coupon Amount");
  const ADJ_COL = colIdx("Adjustments");
  const REV_COL = colIdx("Revenue");
  const PAY_COL = colIdx("Payment Status");
  const STATUS_COL = colIdx("Status");
  const guestsIdx = colIdx("Guests");
  const baseIdx = BASE_COL;
  const merchCols = [];
  for (let i = guestsIdx + 1; i < baseIdx; i++) {
    const name = headers[i];
    if (name && !/^(total|taxes|sales tax|add-on|coupon|adjust|revenue|payment|source|status|guest|check|purchase|bought|tag|make|private|amount|confirm|quantity)/i.test(name)) {
      merchCols.push({ idx: i, name });
    }
  }
  const result = [];
  for (let i = 2; i < raw.length; i++) {
    const row = raw[i];
    if (!row || !row.some((v) => v != null)) continue;
    const product = (row[PRODUCT_COL] || "").toString();
    const payStatus = (row[PAY_COL] || "").toString().toLowerCase();
    const status = (row[STATUS_COL] || "").toString().toLowerCase();
    if (!/merch/i.test(product)) continue;
    if (/cancelled|canceled|refunded|void/.test(payStatus)) continue;
    if (/cancelled|canceled|refunded|void/.test(status)) continue;
    const base = parseFloat(row[BASE_COL]) || 0;
    const coupon = parseFloat(row[COUPON_COL]) || 0;
    const adj = parseFloat(row[ADJ_COL]) || 0;
    const revRaw = REV_COL >= 0 ? parseFloat(row[REV_COL]) || 0 : null;
    const revenue = revRaw !== null ? +revRaw.toFixed(2) : +(base + coupon + adj).toFixed(2);
    const xolaGross = +base.toFixed(2);
    const xolaDiscount = +Math.abs(coupon + adj).toFixed(2);
    const dateStr = parseDate((row[PURCHASE_COL] || "").toString().trim());
    const rawStore = store || "";
    const brand = getRowBrand(product, product);
    const rowStore = normalizeStore(rawStore) || "Unknown";
    const itemsInRow = merchCols.filter((c) => {
      const qty = parseFloat(row[c.idx]);
      return qty && qty > 0;
    });
    const isShirtRow = /shirt/i.test(product);
    const productClean = normalizeName(
      product.replace(/^merch:\s*/i, "").replace(/^(gbgs|teg|am|adventure mining|great big game show)\s+shirt\s*[-–]\s*/i, "").replace(/^(gbgs|teg|am|adventure mining|great big game show)\s*[-–]\s*/i, "").replace(/^shirt\s*[-–]\s*/i, "").trim()
    );
    if (itemsInRow.length === 0) {
      if (/gift/i.test(productClean)) continue;
      result.push({ date: dateStr, name: productClean, category: isShirtRow ? "Apparel" : "Merch", units: 1, revenue, gross: xolaGross, discount: xolaDiscount, store: rowStore, brand });
    } else {
      const itemNames = itemsInRow.map((c) => ({
        col: c,
        qty: parseFloat(row[c.idx]) || 0,
        name: isShirtRow ? productClean : normalizeName(c.name)
      }));
      const weightedTotal = itemNames.reduce((s, item) => {
        const price = getItemPrice(item.name) || 1;
        return s + price * item.qty;
      }, 0);
      for (const item of itemNames) {
        if (/gift/i.test(item.name)) continue;
        const price = getItemPrice(item.name) || 1;
        const weight = price * item.qty / weightedTotal;
        result.push({
          date: dateStr,
          name: item.name,
          category: isShirtRow ? "Apparel" : "Merch",
          units: item.qty,
          revenue: +(revenue * weight).toFixed(2),
          gross: +(xolaGross * weight).toFixed(2),
          discount: +(xolaDiscount * weight).toFixed(2),
          store: rowStore,
          brand
        });
      }
    }
  }
  return result;
}
function aggregate(revelRows, resovaRows, stores, dateFrom, dateTo) {
  var _a;
  const inRange = (d) => {
    if (!d) return true;
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  };
  const inStore = (s) => !stores.length || stores.includes(s);
  const rr = revelRows.filter((r) => inRange(r.date) && inStore(r.store));
  const sr = resovaRows.filter((r) => inRange(r.date) && inStore(r.store));
  const byMonth = {}, byProduct = {}, byStore = {};
  const toMonthKey = (d) => {
    if (!d) return null;
    const s = String(d).trim();
    if (/^\d{4}-\d{2}/.test(s)) return s.slice(0, 7);
    const dmy = s.match(/^(\d{1,2})-([A-Za-z]+)-(\d{4})/);
    if (dmy) {
      const mi = MONTHS.findIndex((m) => m.toLowerCase() === dmy[2].toLowerCase().slice(0, 3));
      return mi >= 0 ? `${dmy[3]}-${String(mi + 1).padStart(2, "0")}` : null;
    }
    const dt = new Date(d);
    if (!isNaN(dt)) return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    return null;
  };
  rr.forEach((r) => {
    const mk = toMonthKey(r.date) || "Unknown";
    const label = mk !== "Unknown" ? `${MONTHS[parseInt(mk.slice(5, 7)) - 1]} ${mk.slice(0, 4)}` : mk;
    if (!byMonth[mk]) byMonth[mk] = { month: label, key: mk, revenue: 0, units: 0, transactions: 0 };
    if (!byProduct[r.name]) byProduct[r.name] = { name: r.name, category: r.category || "", units: 0, revenue: 0, gross: 0, discount: 0 };
    if (!byStore[r.store]) byStore[r.store] = { store: r.store, revenue: 0, units: 0, gross: 0, discount: 0 };
    byMonth[mk].revenue += r.revenue;
    byMonth[mk].gross = (byMonth[mk].gross||0) + (r.gross||r.revenue||0);
    byMonth[mk].discount = (byMonth[mk].discount||0) + (r.discount||0);
    byMonth[mk].units += r.units;
    byMonth[mk].transactions++;
    byProduct[r.name].units += r.units;
    byProduct[r.name].revenue += r.revenue;
    byProduct[r.name].gross += (r.gross||r.revenue||0);
    byProduct[r.name].discount += (r.discount||0);
    byStore[r.store].revenue += r.revenue;
    byStore[r.store].gross = (byStore[r.store].gross||0) + (r.gross||r.revenue||0);
    byStore[r.store].discount = (byStore[r.store].discount||0) + (r.discount||0);
    byStore[r.store].units += r.units;
  });
  sr.forEach((r) => {
    const mk = toMonthKey(r.date) || "Unknown";
    const label = mk !== "Unknown" ? `${MONTHS[parseInt(mk.slice(5, 7)) - 1]} ${mk.slice(0, 4)}` : mk;
    const units = r.qty || 1;
    if (!byMonth[mk]) byMonth[mk] = { month: label, key: mk, revenue: 0, units: 0, transactions: 0 };
    if (!byProduct[r.item]) byProduct[r.item] = { name: r.item, category: "", units: 0, revenue: 0, gross: 0, discount: 0 };
    if (!byStore[r.store]) byStore[r.store] = { store: r.store, revenue: 0, units: 0, gross: 0, discount: 0 };
    byMonth[mk].revenue += r.revenue;
    byMonth[mk].gross = (byMonth[mk].gross||0) + (r.gross||r.revenue||0);
    byMonth[mk].discount = (byMonth[mk].discount||0) + (r.discount||0);
    byMonth[mk].units += units;
    byMonth[mk].transactions++;
    byProduct[r.item].units += units;
    byProduct[r.item].revenue += r.revenue;
    byProduct[r.item].gross += (r.gross||r.revenue||0);
    byProduct[r.item].discount += (r.discount||0);
    byStore[r.store].revenue += r.revenue;
    byStore[r.store].gross = (byStore[r.store].gross||0) + (r.gross||r.revenue||0);
    byStore[r.store].discount = (byStore[r.store].discount||0) + (r.discount||0);
    byStore[r.store].units += units;
  });
  const totalRevenue = +[...rr, ...sr].reduce((s, r) => s + r.revenue, 0).toFixed(2);
  const totalGross = +[...rr, ...sr].reduce((s, r) => s + (r.gross||r.revenue||0), 0).toFixed(2);
  const totalDiscount = +(totalGross - totalRevenue).toFixed(2);
  const totalUnits = Math.round(rr.reduce((s, r) => s + r.units, 0) + sr.reduce((s, r) => s + (r.qty || 1), 0));
  const topItems = Object.values(byProduct).map((p) => __spreadProps(__spreadValues({}, p), { revenue: +p.revenue.toFixed(2) })).sort((a, b) => b.revenue - a.revenue);
  return {
    totalRevenue,
    totalGross,
    totalDiscount,
    totalUnits,
    avgUnitPrice: totalUnits ? +(totalRevenue / totalUnits).toFixed(2) : 0,
    topItem: ((_a = topItems[0]) == null ? void 0 : _a.name) || null,
    monthlyRevenue: Object.values(byMonth).sort((a, b) => a.key.localeCompare(b.key)).map((m) => { const g = +(m.gross||m.revenue).toFixed(2); const r = +m.revenue.toFixed(2); return {...m, revenue: r, gross: g, discount: +(g - r).toFixed(2)}; }),
    topItems,
    byStore: Object.values(byStore).map((s) => __spreadProps(__spreadValues({}, s), { revenue: +s.revenue.toFixed(2) })).sort((a, b) => b.revenue - a.revenue)
  };
}
function mockData() {
  const tegStores = ["Nashville", "Atlanta", "Chicago", "Denver", "Austin"];
  const gbgsStores = ["GBGS New York", "GBGS Dallas"];
  const items = ["Escape Room T-Shirt", "Logo Hoodie", "Puzzle Book", "Keychain Set", "Tote Bag", "Mug", "Cap", "Sticker Pack"];
  const gbgsItems = ["Icons Tee", "Wheel Tee", "Game Show Hat"];
  const revelRows = [], resovaRows = [];
  [...tegStores, ...gbgsStores].forEach((store) => {
    const its = store.startsWith("GBGS") ? gbgsItems : items;
    MONTHS.forEach((_, mi) => {
      its.forEach((name) => {
        const units = Math.round(1 + Math.random() * 6);
        revelRows.push({ date: `2025-${String(mi + 1).padStart(2, "0")}-15`, name, category: "Merchandise", units, revenue: +(units * (10 + Math.random() * 20)).toFixed(2), store });
      });
      resovaRows.push({ date: `2025-${String(mi + 1).padStart(2, "0")}-15`, item: "Escape Room Classic", qty: Math.round(5 + Math.random() * 15), revenue: +(200 + Math.random() * 400).toFixed(2), store });
    });
  });
  return { revelRows, resovaRows, savedAt: null, isDemo: true };
}
const Tip = ({ active, payload, label }) => {
  if (!active || !(payload == null ? void 0 : payload.length)) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#1A1A2E", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", fontFamily: "'DM Mono',monospace", fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { color: "#666", marginBottom: 4 } }, label), payload.map((p, i) => {
    var _a;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { color: p.color || ACCENT } }, p.name, ": ", typeof p.value === "number" && ((_a = p.name) == null ? void 0 : _a.toLowerCase().match(/rev|total|price/)) ? `$${Number(p.value).toLocaleString()}` : Number(p.value).toLocaleString());
  }));
};
function KPI({ label, value, sub, color = ACCENT, icon }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 22px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 7 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontFamily: "'Bebas Neue',sans-serif", color: "#fff", letterSpacing: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, value), sub && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#444", marginTop: 3 } }, sub), icon && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 22, opacity: 0.08 } }, icon));
}
function StorePicker({ allStores, selected, onChange, accent = ACCENT }) {
  const [open, setOpen] = useState(false);
  const [storeSearch, setStoreSearch] = useState("");
  const [dragIdx, setDragIdx] = useState(null);
  const [customOrder, setCustomOrder] = useState([]);
  const ref = useRef();
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => {
    setCustomOrder((prev) => {
      const existing = prev.filter((s) => allStores.includes(s));
      const newOnes = allStores.filter((s) => !existing.includes(s)).sort();
      return [...existing, ...newOnes];
    });
  }, [allStores]);
  const label = selected.length === 0 ? "All Stores" : selected.length === 1 ? selected[0] : `${selected.length} Stores`;
  const toggle = (s) => onChange(selected.includes(s) ? selected.filter((x) => x !== s) : [...selected, s]);
  const sorted = [...selected, ...customOrder.filter((s) => !selected.includes(s))];
  const filtered = storeSearch ? sorted.filter((s) => s.toLowerCase().includes(storeSearch.toLowerCase())) : sorted;
  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const next = [...customOrder];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setCustomOrder(next);
    setDragIdx(i);
  };
  return /* @__PURE__ */ React.createElement("div", { ref, style: { position: "relative" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setOpen((o) => !o), style: { padding: "7px 13px", borderRadius: 7, background: selected.length ? `${accent}22` : "transparent", border: `1px solid ${selected.length ? accent : BORDER}`, color: selected.length ? accent : "#666", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 } }, "\u{1F3EA} ", label, " ", open ? "\u25B2" : "\u25BC"), open && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", right: 0, top: "calc(100% + 6px)", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 8, zIndex: 100, minWidth: 240, maxHeight: 380, display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 0 6px", borderBottom: `1px solid ${BORDER}`, marginBottom: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: storeSearch,
      onChange: (e) => setStoreSearch(e.target.value),
      placeholder: "Search stores\u2026",
      style: { width: "100%", background: DARK, border: `1px solid ${BORDER}`, borderRadius: 5, color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 10, padding: "6px 8px", outline: "none", marginBottom: 6 }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "0 2px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => onChange([]), style: { fontSize: 10, color: "#555", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace" } }, "Clear"), !storeSearch && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "#333", alignSelf: "center" } }, "\u283F drag to reorder"), /* @__PURE__ */ React.createElement("button", { onClick: () => onChange([...allStores]), style: { fontSize: 10, color: "#555", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace" } }, "Select All"))), /* @__PURE__ */ React.createElement("div", { style: { overflowY: "auto", flex: 1 } }, selected.length > 0 && !storeSearch && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: accent, padding: "4px 10px 2px", letterSpacing: 1, textTransform: "uppercase", opacity: 0.7 } }, "Selected"), filtered.map((store) => {
    const orderIdx = customOrder.indexOf(store);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: store,
        draggable: !storeSearch,
        onDragStart: () => onDragStart(orderIdx),
        onDragOver: (e) => onDragOver(e, orderIdx),
        onDragEnd: () => setDragIdx(null),
        onClick: () => toggle(store),
        style: { display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, cursor: "pointer", background: selected.includes(store) ? `${accent}15` : "transparent", opacity: dragIdx === orderIdx ? 0.4 : 1 }
      },
      !storeSearch && /* @__PURE__ */ React.createElement("span", { style: { color: "#2A2A3A", fontSize: 12, cursor: "grab", userSelect: "none" } }, "\u283F"),
      /* @__PURE__ */ React.createElement("div", { style: { width: 14, height: 14, borderRadius: 3, border: `1px solid ${selected.includes(store) ? accent : BORDER}`, background: selected.includes(store) ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", flexShrink: 0 } }, selected.includes(store) ? "\u2713" : ""),
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: selected.includes(store) ? "#fff" : "#888" } }, store)
    );
  }))));
}
function DateRange({ revelRows, resovaRows, dateFrom, dateTo, onChange }) {
  var _a, _b;
  const all = [...revelRows || [], ...resovaRows || []].map((r) => r.date).filter(Boolean).sort();
  const min = ((_a = all[0]) == null ? void 0 : _a.slice(0, 7)) || "";
  const max = ((_b = all[all.length - 1]) == null ? void 0 : _b.slice(0, 7)) || "";
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 7, padding: "6px 12px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#555" } }, "\u{1F4C5}"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "month",
      value: (dateFrom == null ? void 0 : dateFrom.slice(0, 7)) || "",
      min,
      max,
      onChange: (e) => onChange(e.target.value ? e.target.value + "-01" : "", dateTo),
      style: { background: "transparent", border: "none", color: dateFrom ? "#888" : "#444", fontFamily: "'DM Mono',monospace", fontSize: 11, padding: "2px 4px", outline: "none" }
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { color: "#333" } }, "\u2192"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "month",
      value: (dateTo == null ? void 0 : dateTo.slice(0, 7)) || "",
      min,
      max,
      onChange: (e) => onChange(dateFrom, e.target.value ? e.target.value + "-31" : ""),
      style: { background: "transparent", border: "none", color: dateTo ? "#888" : "#444", fontFamily: "'DM Mono',monospace", fontSize: 11, padding: "2px 4px", outline: "none" }
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => onChange("", ""), style: { fontSize: 10, color: "#555", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace" } }, "ALL"));
}
function BrandDashboard({ data, accent, allStores, label }) {
  const [selStores, setSelStores] = useState([]);
  const [sortStoreCol, setSortStoreCol] = useState("revenue");
  const [sortStoreDir, setSortStoreDir] = useState("desc");
  const [subtab, setSubtab] = useState("overview");
  const [selCats, setSelCats] = useState([]);
  const [expandedCats, setExpandedCats] = useState([]);
  const [cmpFrom, setCmpFrom] = useState("");
  const [cmpTo, setCmpTo] = useState("");
  const [chartMode, setChartMode] = useState("line");
  const [showGross, setShowGross] = useState(false);
  const [periodA, setPeriodA] = useState({from:"",to:""});
  const [catSelStores, setCatSelStores] = useState([]);
  const [periodB, setPeriodB] = useState({from:"",to:""});
  const [ovChartMode, setOvChartMode] = useState("bar");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const agg = useMemo(() => aggregate(data.revelRows || [], data.resovaRows || [], selStores, dateFrom, dateTo), [data, selStores, dateFrom, dateTo]);
  const SUBTABS = [{ id: "overview", label: "OVERVIEW" }, { id: "products", label: "PRODUCTS" }, { id: "categories", label: "CATEGORIES" }, { id: "search", label: "PRODUCT SEARCH" }, { id: "compare", label: "COMPARE" }, { id: "stores", label: "BY STORE" }, { id: "storedetail", label: "DETAILED BY STORE" }, { id: "trends", label: "TRENDS" }];
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeDetailSort, setStoreDetailSort] = useState({ col: "revenue", dir: "desc" });
  const [productsSort, setProductsSort] = useState({ col: "revenue", dir: "desc" });
  const [searchStoreSort, setSearchStoreSort] = useState({ col: "revenue", dir: "desc" });
  const [searchTerms, setSearchTerms] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchStores, setSearchStores] = useState([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [compareFrom, setCompareFrom] = useState("");
  const [compareTo, setCompareTo] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [cmpProducts, setCmpProducts] = useState([]);
  const [cmpInput, setCmpInput] = useState("");
  const [cmpStores, setCmpStores] = useState([]);
  const [cmpA, setCmpA] = useState({ from: "", to: "" });
  const [cmpB, setCmpB] = useState({ from: "", to: "" });
  const [cmpSelProducts, setCmpSelProducts] = useState([]);
  const noData = !agg.totalRevenue && !agg.totalUnits;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}` } }, SUBTABS.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => setSubtab(t.id), style: { padding: "7px 14px", background: "transparent", border: "none", borderBottom: `2px solid ${subtab === t.id ? accent : "transparent"}`, color: subtab === t.id ? accent : "#555", fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: 1, cursor: "pointer", marginBottom: -1 } }, t.label))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } }, allStores.length > 1 && /* @__PURE__ */ React.createElement(StorePicker, { allStores, selected: selStores, onChange: setSelStores, accent }), /* @__PURE__ */ React.createElement(DateRange, { revelRows: data.revelRows, resovaRows: data.resovaRows, dateFrom, dateTo, onChange: (f, t) => {
    setDateFrom(f);
    setDateTo(t);
  } }))), noData && /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 36, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Bebas Neue'", fontSize: 24, color: "#333", marginBottom: 10 } }, "NO ", label, " DATA"), /* @__PURE__ */ React.createElement("div", { style: { color: "#555", fontSize: 11 } }, "Upload CSV files to get started")), !noData && /* @__PURE__ */ React.createElement(React.Fragment, null, subtab === "overview" && React.createElement("div", { className: "fu" },

  /* KPI cards — 3 cols x 2 rows */
  React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 } },
    React.createElement(KPI, { label: "Gross Revenue", value: `$${((agg.totalGross||agg.totalRevenue) / 1e3).toFixed(1)}K`, sub: "before discounts", color: "#22C55E", icon: "\u{1F4B5}" }),
    React.createElement(KPI, { label: "Actual Revenue", value: `$${(agg.totalRevenue / 1e3).toFixed(1)}K`, sub: `${agg.totalUnits.toLocaleString()} units sold`, color: accent, icon: "\u{1F4B0}" }),
    React.createElement(KPI, { label: "Total Discounted", value: `$${((agg.totalDiscount||0) / 1e3).toFixed(1)}K`, sub: agg.totalGross ? `${((agg.totalDiscount||0)/agg.totalGross*100).toFixed(1)}% of gross` : "0% of gross", color: "#F59E0B", icon: "\u{1F3F7}" }),
    React.createElement(KPI, { label: "Units Sold", value: agg.totalUnits.toLocaleString(), sub: `$${agg.avgUnitPrice} avg`, color: GOLD, icon: "\u{1F4E6}" }),
    React.createElement(KPI, { label: "Avg Unit Price", value: `$${agg.avgUnitPrice}`, sub: "per item", color: TEAL, icon: "\u{1F3F7}" }),
    React.createElement(KPI, { label: "Stores", value: agg.byStore.length, sub: `${agg.byStore.length} locations`, color: PURPLE, icon: "\u{1F3EA}" }),
    React.createElement(KPI, { label: "Discount Rate", value: agg.totalGross ? `${((agg.totalDiscount||0)/agg.totalGross*100).toFixed(1)}%` : "0%", sub: "of gross revenue discounted", color: "#F59E0B", icon: "\u{1F3F7}" })
  ),

  /* Monthly chart — bar or line with Gross/Actual/Discount toggle */
  React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20, marginBottom: 14 } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } },
      React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase" } }, "Monthly Revenue"),
      React.createElement("div", { style: { display: "flex", gap: 6 } },
        React.createElement("button", { onClick: () => setOvChartMode("bar"), style: { padding: "3px 10px", borderRadius: 5, background: ovChartMode==="bar"?accent+"33":"transparent", border: `1px solid ${ovChartMode==="bar"?accent:"#1E1E2E"}`, color: ovChartMode==="bar"?accent:"#555", fontSize: 10, cursor: "pointer", fontFamily: "'DM Mono',monospace" } }, "BAR"),
        React.createElement("button", { onClick: () => setOvChartMode("line"), style: { padding: "3px 10px", borderRadius: 5, background: ovChartMode==="line"?accent+"33":"transparent", border: `1px solid ${ovChartMode==="line"?accent:"#1E1E2E"}`, color: ovChartMode==="line"?accent:"#555", fontSize: 10, cursor: "pointer", fontFamily: "'DM Mono',monospace" } }, "LINE")
      )
    ),
    React.createElement(ResponsiveContainer, { width: "100%", height: 240 },
      ovChartMode === "bar"
        ? React.createElement(BarChart, { data: agg.monthlyRevenue },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A" }),
            React.createElement(XAxis, { dataKey: "month", tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }),
            React.createElement(YAxis, { tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false, tickFormatter: v => `$${(v/1e3).toFixed(0)}K` }),
            React.createElement(Tooltip, { content: React.createElement(Tip, null) }),
            React.createElement(Legend, { formatter: v => React.createElement("span", { style: { color: "#888", fontSize: 10 } }, v) }),
            React.createElement(Bar, { dataKey: "gross", fill: "#22C55E", radius: [0,0,0,0], name: "Gross", opacity: 0.5 }),
            React.createElement(Bar, { dataKey: "revenue", fill: accent, radius: [0,0,0,0], name: "Actual" }),
            React.createElement(Bar, { dataKey: "discount", fill: "#F59E0B", radius: [3,3,0,0], name: "Discounted" })
          )
        : React.createElement(LineChart, { data: agg.monthlyRevenue },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A" }),
            React.createElement(XAxis, { dataKey: "month", tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }),
            React.createElement(YAxis, { tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false, tickFormatter: v => `$${(v/1e3).toFixed(0)}K` }),
            React.createElement(Tooltip, { content: React.createElement(Tip, null) }),
            React.createElement(Legend, { formatter: v => React.createElement("span", { style: { color: "#888", fontSize: 10 } }, v) }),
            React.createElement(Line, { type: "monotone", dataKey: "gross", stroke: "#22C55E", strokeWidth: 2, strokeDasharray: "5 3", dot: { r: 3 }, name: "Gross" }),
            React.createElement(Line, { type: "monotone", dataKey: "revenue", stroke: accent, strokeWidth: 2.5, dot: { r: 3 }, name: "Actual" }),
            React.createElement(Line, { type: "monotone", dataKey: "discount", stroke: "#F59E0B", strokeWidth: 2, dot: { r: 3 }, name: "Discounted" })
          )
    )
  ),

  /* Bottom charts grid — 4 panels */
  React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 } },
    /* Top by Revenue pie */
    React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } },
      React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" } }, "Top by Revenue"),
      React.createElement(ResponsiveContainer, { width: "100%", height: 230 },
        React.createElement(PieChart, null,
          React.createElement(Pie, { data: agg.topItems.slice(0,8), dataKey: "revenue", nameKey: "name", cx: "50%", cy: "45%", outerRadius: 78, paddingAngle: 3 },
            agg.topItems.slice(0,8).map((_,i) => React.createElement(Cell, { key: i, fill: COLORS[i%10] }))),
          React.createElement(Tooltip, { content: React.createElement(Tip, null) }),
          React.createElement(Legend, { formatter: v => React.createElement("span", { style: { color: "#666", fontSize: 9 } }, v.length > 20 ? v.slice(0,20)+"\u2026" : v) })))
    ),
    /* Top by Units pie */
    React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } },
      React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" } }, "Top by Units Sold"),
      React.createElement(ResponsiveContainer, { width: "100%", height: 230 },
        React.createElement(PieChart, null,
          React.createElement(Pie, { data: [...agg.topItems].sort((a,b)=>b.units-a.units).slice(0,8), dataKey: "units", nameKey: "name", cx: "50%", cy: "45%", outerRadius: 78, paddingAngle: 3 },
            [...agg.topItems].sort((a,b)=>b.units-a.units).slice(0,8).map((_,i) => React.createElement(Cell, { key: i, fill: COLORS[i%10] }))),
          React.createElement(Tooltip, { content: React.createElement(Tip, null) }),
          React.createElement(Legend, { formatter: v => React.createElement("span", { style: { color: "#666", fontSize: 9 } }, v.length > 20 ? v.slice(0,20)+"\u2026" : v) })))
    ),

    /* Top Stores by Revenue — bar chart */
    React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } },
      React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" } }, "Top Stores by Revenue"),
      React.createElement(ResponsiveContainer, { width: "100%", height: 230 },
        React.createElement(BarChart, { data: agg.byStore.slice(0,10), layout: "vertical", margin: { left: 10, right: 30 } },
          React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A", horizontal: false }),
          React.createElement(XAxis, { type: "number", tick: { fill: "#555", fontSize: 9 }, axisLine: false, tickLine: false, tickFormatter: v => `$${(v/1e3).toFixed(0)}K` }),
          React.createElement(YAxis, { type: "category", dataKey: "store", tick: { fill: "#888", fontSize: 9 }, axisLine: false, tickLine: false, width: 60 }),
          React.createElement(Tooltip, { content: React.createElement(Tip, null) }),
          React.createElement(Bar, { dataKey: "revenue", fill: accent, radius: [0,3,3,0], name: "Revenue" })))
    ),

    /* Most Discounted Products — bar chart */
    React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } },
      React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" } }, "Most Discounted Products"),
      React.createElement(ResponsiveContainer, { width: "100%", height: 230 },
        (() => {
          const discData = agg.topItems.filter(p=>(p.discount||0)>0).sort((a,b)=>(b.discount||0)-(a.discount||0)).slice(0,10);
          return React.createElement(BarChart, { data: discData, layout: "vertical", margin: { left: 10, right: 30 } },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A", horizontal: false }),
            React.createElement(XAxis, { type: "number", tick: { fill: "#555", fontSize: 9 }, axisLine: false, tickLine: false, tickFormatter: v => `$${(v/1e3).toFixed(1)}K` }),
            React.createElement(YAxis, { type: "category", dataKey: "name", tick: { fill: "#888", fontSize: 9 }, axisLine: false, tickLine: false, width: 80, tickFormatter: v => v.length>12?v.slice(0,12)+"\u2026":v }),
            React.createElement(Tooltip, { content: React.createElement(Tip, null) }),
            React.createElement(Bar, { dataKey: "discount", fill: "#F59E0B", radius: [0,3,3,0], name: "Discounted" }));
        })()
      )
    )
  )

), subtab === "products" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Top by Revenue"), /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: 280 }, /* @__PURE__ */ React.createElement(BarChart, { data: agg.topItems.slice(0, 10), layout: "vertical" }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A", horizontal: false }), /* @__PURE__ */ React.createElement(XAxis, { type: "number", tick: { fill: "#555", fontSize: 9 }, axisLine: false, tickLine: false, tickFormatter: (v) => `$${v}` }), /* @__PURE__ */ React.createElement(YAxis, { dataKey: "name", type: "category", width: 140, tick: { fill: "#888", fontSize: 9 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(Tip, null) }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "revenue", fill: GOLD, radius: [0, 3, 3, 0], name: "Revenue" })))), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Top by Units"), /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: 280 }, /* @__PURE__ */ React.createElement(BarChart, { data: agg.topItems.slice(0, 10), layout: "vertical" }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A", horizontal: false }), /* @__PURE__ */ React.createElement(XAxis, { type: "number", tick: { fill: "#555", fontSize: 9 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(YAxis, { dataKey: "name", type: "category", width: 140, tick: { fill: "#888", fontSize: 9 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(Tip, null) }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "units", fill: TEAL, radius: [0, 3, 3, 0], name: "Units" }))))), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" } }, "All Products (", agg.topItems.length, ")"), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { borderBottom: `1px solid ${BORDER}` } }, [
    { label: "#", col: null },
    { label: "Product", col: "name" },
    { label: "Category", col: "category" },
    { label: "Units", col: "units" },
    { label: "Gross", col: "gross" },
    { label: "Actual Rev", col: "revenue" },
    { label: "Discounted", col: "discount" },
    { label: "Disc %", col: "discPct" },
    { label: "Avg Price", col: "avg" },
    { label: "Share", col: "share" }
  ].map(({ label: label2, col }) => /* @__PURE__ */ React.createElement(
    "th",
    {
      key: label2,
      onClick: () => {
        if (!col) return;
        setProductsSort((s) => s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: col === "name" || col === "category" ? "asc" : "desc" });
      },
      style: { textAlign: "left", padding: "7px 10px", color: productsSort.col === col ? accent : "#444", fontWeight: 400, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: col ? "pointer" : "default", userSelect: "none", whiteSpace: "nowrap" }
    },
    label2,
    col && (productsSort.col === col ? productsSort.dir === "asc" ? " \u25B2" : " \u25BC" : " \u2195")
  )))), /* @__PURE__ */ React.createElement("tbody", null, [...agg.topItems].sort((a, b) => {
    const { col, dir } = productsSort;
    const mul = dir === "asc" ? 1 : -1;
    if (col === "name") return mul * a.name.localeCompare(b.name);
    if (col === "category") return mul * (a.category || "").localeCompare(b.category || "");
    if (col === "units") return mul * (a.units - b.units);
    if (col === "revenue") return mul * (a.revenue - b.revenue);
    if (col === "avg") return mul * ((a.units ? a.revenue / a.units : 0) - (b.units ? b.revenue / b.units : 0));
    if (col === "share") return mul * (a.revenue - b.revenue);
    return 0;
  }).map((item, i) => /* @__PURE__ */ React.createElement("tr", { key: item.name }, /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#333" } }, i + 1), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#ddd" } }, item.name), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#555", fontSize: 10 } }, item.category || "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: TEAL } }, item.units), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#22C55E" } }, "$", (item.gross||item.revenue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: accent } }, "$", item.revenue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#F59E0B" } }, (item.discount||0)>0?"$"+(item.discount||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):"\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: (item.gross&&item.discount)?"#F59E0B":"#444", fontSize:10 } }, item.gross&&item.gross>0?((item.discount||0)/item.gross*100).toFixed(1)+"%":"0%"), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: GOLD } }, "$", item.units ? (item.revenue / item.units).toFixed(2) : "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", minWidth: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 3, background: BORDER, borderRadius: 2 } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${Math.round(item.revenue / agg.totalRevenue * 100)}%`, height: "100%", background: COLORS[i % 10], borderRadius: 2 } })), /* @__PURE__ */ React.createElement("span", { style: { color: "#444", fontSize: 10, minWidth: 24 } }, Math.round(item.revenue / agg.totalRevenue * 100), "%")))))))))), subtab === "search" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 200, display: "flex", gap: 0, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: searchInput,
      onChange: (e) => setSearchInput(e.target.value),
      onKeyDown: (e) => {
        if ((e.key === "Enter" || e.key === ",") && searchInput.trim()) {
          e.preventDefault();
          const t = searchInput.trim().replace(/,$/, "");
          if (t && !searchTerms.includes(t)) {
            setSearchTerms((p) => [...p, t]);
            setSelectedProducts([]);
          }
          setSearchInput("");
        }
      },
      placeholder: searchTerms.length ? "Add another term\u2026 (Enter to add)" : "Type a product name and press Enter\u2026",
      style: { flex: 1, padding: "10px 14px", background: "transparent", border: "none", color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 12, outline: "none" }
    }
  ), searchInput.trim() && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        const t = searchInput.trim();
        if (t && !searchTerms.includes(t)) {
          setSearchTerms((p) => [...p, t]);
          setSelectedProducts([]);
        }
        setSearchInput("");
      },
      style: { padding: "10px 14px", background: accent, border: "none", color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 11, cursor: "pointer" }
    },
    "+ ADD"
  )), /* @__PURE__ */ React.createElement(StorePicker, { allStores: [...new Set([...(data.revelRows || []).map((r) => r.store), ...(data.resovaRows || []).map((r) => r.store)].filter(Boolean))].sort(), selected: searchStores, onChange: setSearchStores, accent }), /* @__PURE__ */ React.createElement(DateRange, { revelRows: data.revelRows, resovaRows: data.resovaRows, dateFrom: searchFrom, dateTo: searchTo, onChange: (f, t) => {
    setSearchFrom(f);
    setSearchTo(t);
  } })), searchTerms.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, searchTerms.map((t) => /* @__PURE__ */ React.createElement("div", { key: t, style: { display: "flex", alignItems: "center", gap: 6, background: `${accent}22`, border: `1px solid ${accent}55`, borderRadius: 20, padding: "4px 10px 4px 12px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: accent } }, t), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setSearchTerms((p) => p.filter((x) => x !== t));
    setSelectedProducts([]);
  }, style: { background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 13, lineHeight: 1, padding: 0 } }, "\xD7"))), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setSearchTerms([]);
    setSelectedProducts([]);
    setSearchInput("");
  }, style: { fontSize: 10, color: "#555", background: "none", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Mono',monospace" } }, "Clear all"))), (() => {
    if (!searchTerms.length) return /* @__PURE__ */ React.createElement("div", { style: { color: "#444", fontSize: 12, padding: 20, textAlign: "center" } }, "Type a product name above and press Enter to search");
    const inRange = (d) => {
      if (!d) return true;
      if (searchFrom && d < searchFrom) return false;
      if (searchTo && d > searchTo) return false;
      return true;
    };
    const inStore = (s) => !searchStores.length || searchStores.includes(s);
    const matchesAny = (name) => searchTerms.some((t) => name.toLowerCase().includes(t.toLowerCase()));
    const allMatchRevel = (data.revelRows || []).filter((r) => matchesAny(r.name) && inRange(r.date) && inStore(r.store));
    const allMatchResova = (data.resovaRows || []).filter((r) => matchesAny(r.item) && inRange(r.date) && inStore(r.store));
    const allProductNames = [.../* @__PURE__ */ new Set([...allMatchRevel.map((r) => r.name), ...allMatchResova.map((r) => r.item)])].sort();
    if (!allProductNames.length) return /* @__PURE__ */ React.createElement("div", { style: { color: "#444", fontSize: 12, padding: 20, textAlign: "center" } }, "No products found matching your search terms");
    const activeProd = selectedProducts.length > 0 ? selectedProducts : allProductNames;
    const matchRevel = allMatchRevel.filter((r) => activeProd.includes(r.name));
    const matchResova = allMatchResova.filter((r) => activeProd.includes(r.item));
    const byMonth = {};
    [...matchRevel, ...matchResova.map((r) => __spreadProps(__spreadValues({}, r), { name: r.item, units: r.qty || 1 }))].forEach((r) => {
      const mk = r.date ? parseDate(r.date) : "";
      const key = mk ? mk.slice(0, 7) : "Unknown";
      const label2 = key !== "Unknown" ? `${MONTHS[parseInt(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}` : key;
      if (!byMonth[key]) byMonth[key] = { month: label2, key, revenue: 0, units: 0 };
      byMonth[key].revenue += r.revenue;
      byMonth[key].units += r.units || 1;
    });
    const monthData = Object.values(byMonth).sort((a, b) => a.key.localeCompare(b.key)).map((m) => __spreadProps(__spreadValues({}, m), { revenue: +m.revenue.toFixed(2) }));
    const byStore = {};
    [...matchRevel, ...matchResova.map((r) => __spreadProps(__spreadValues({}, r), { name: r.item, units: r.qty || 1 }))].forEach((r) => {
      if (!byStore[r.store]) byStore[r.store] = { store: r.store, revenue: 0, units: 0 };
      byStore[r.store].revenue += r.revenue;
      byStore[r.store].units += r.units || 1;
    });
    const storeData = Object.values(byStore).sort((a, b) => b.revenue - a.revenue);
    const totalRev = +[...matchRevel, ...matchResova].reduce((s, r) => s + r.revenue, 0).toFixed(2);
          const totalGross = +[...matchRevel, ...matchResova].reduce((s, r) => s + (r.gross||r.revenue||0), 0).toFixed(2);
    const totalUnits = Math.round(matchRevel.reduce((s, r) => s + r.units, 0) + matchResova.reduce((s, r) => s + (r.qty || 1), 0));
    const inCompare = (d) => {
      if (!d || !compareFrom || !compareTo) return false;
      return d >= compareFrom && d <= compareTo;
    };
    const cmpRevel = allMatchRevel.filter((r) => activeProd.includes(r.name) && inCompare(r.date));
    const cmpResova = allMatchResova.filter((r) => activeProd.includes(r.item) && inCompare(r.date));
    const cmpRev = +[...cmpRevel, ...cmpResova].reduce((s, r) => s + r.revenue, 0).toFixed(2);
    const cmpUnits = Math.round(cmpRevel.reduce((s, r) => s + r.units, 0) + cmpResova.reduce((s, r) => s + (r.qty || 1), 0));
    const hasCompare = showCompare && compareFrom && compareTo && (cmpRev > 0 || cmpUnits > 0);
    const pct = (curr, prev) => {
      if (!prev) return null;
      const d = (curr - prev) / prev * 100;
      return { val: Math.abs(d).toFixed(1), up: d >= 0 };
    };
    const revPct = hasCompare ? pct(totalRev, cmpRev) : null;
    const unitPct = hasCompare ? pct(totalUnits, cmpUnits) : null;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowCompare((p) => !p),
        style: { padding: "6px 14px", borderRadius: 6, background: showCompare ? `${accent}22` : "transparent", border: `1px solid ${showCompare ? accent : BORDER}`, color: showCompare ? accent : "#555", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" }
      },
      showCompare ? "\u25BC HIDE COMPARE" : "\u21C4 COMPARE TO ANOTHER PERIOD"
    ), showCompare && /* @__PURE__ */ React.createElement(DateRange, { revelRows: data.revelRows, resovaRows: data.resovaRows, dateFrom: compareFrom, dateTo: compareTo, onChange: (f, t) => {
      setCompareFrom(f);
      setCompareTo(t);
    } }), hasCompare && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#555" } }, "vs ", compareFrom == null ? void 0 : compareFrom.slice(0, 7), " \u2192 ", compareTo == null ? void 0 : compareTo.slice(0, 7))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 22px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#22C55E" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 7 } }, "Gross Revenue"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontFamily: "'Bebas Neue'", color: "#fff", letterSpacing: 1 } }, "$", totalGross.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}))), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 22px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#F97316" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 7 } }, "Actual Revenue"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontFamily: "'Bebas Neue'", color: "#F97316", letterSpacing: 1 } }, "$", totalRev.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})), hasCompare && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: (revPct == null ? void 0 : revPct.up) ? "#34D399" : "#ef4444" } }, (revPct == null ? void 0 : revPct.up) ? "\u25B2" : "\u25BC", " ", revPct == null ? void 0 : revPct.val, "%"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#444" } }, "vs $", cmpRev.toLocaleString()))), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 22px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GOLD } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 7 } }, "Units Sold"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontFamily: "'Bebas Neue'", color: "#fff", letterSpacing: 1 } }, totalUnits.toLocaleString()), hasCompare && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: (unitPct == null ? void 0 : unitPct.up) ? "#34D399" : "#ef4444" } }, (unitPct == null ? void 0 : unitPct.up) ? "\u25B2" : "\u25BC", " ", unitPct == null ? void 0 : unitPct.val, "%"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#444" } }, "vs ", cmpUnits.toLocaleString()))), /* @__PURE__ */ React.createElement(KPI, { label: "Stores Selling", value: storeData.length, color: TEAL, icon: "\u{1F3EA}" }), /* @__PURE__ */ React.createElement(KPI, { label: "Avg / Unit", value: totalUnits ? `$${(totalRev / totalUnits).toFixed(2)}` : "\u2014", color: PURPLE, icon: "\u{1F3F7}" })), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase" } }, "Matching Products \u2014 ", activeProd.length, " of ", allProductNames.length, " selected"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setSelectedProducts([]), style: { fontSize: 10, color: "#555", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace" } }, "Select All"), /* @__PURE__ */ React.createElement("button", { onClick: () => setSelectedProducts(allProductNames.filter((n) => !selectedProducts.includes(n) || true).map(() => "__none__")), style: { fontSize: 10, color: "#555", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace" }, onClick: () => setSelectedProducts(["__none__"]) }, "Clear All"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, allProductNames.map((n) => {
      const active = selectedProducts.length === 0 || selectedProducts.includes(n);
      return /* @__PURE__ */ React.createElement("button", { key: n, onClick: () => {
        if (selectedProducts.length === 0) {
          setSelectedProducts(allProductNames.filter((x) => x !== n));
        } else if (selectedProducts.includes(n)) {
          const next = selectedProducts.filter((x) => x !== n);
          setSelectedProducts(next.length ? next : []);
        } else {
          setSelectedProducts([...selectedProducts, n]);
        }
      }, style: { fontSize: 11, color: active ? "#fff" : "#444", background: active ? `${accent}33` : DARK, border: `1px solid ${active ? accent : BORDER}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "'DM Mono',monospace", transition: "all .15s" } }, n);
    }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Sales Over Time"), /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: 210 }, /* @__PURE__ */ React.createElement(BarChart, { data: monthData }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A" }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "month", tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(YAxis, { tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false, tickFormatter: (v) => `$${v}` }), /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(Tip, null) }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "revenue", fill: accent, radius: [3, 3, 0, 0], name: "Revenue" })))), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Units Over Time"), /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: 210 }, /* @__PURE__ */ React.createElement(BarChart, { data: monthData }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A" }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "month", tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(YAxis, { tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(Tip, null) }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "units", fill: GOLD, radius: [3, 3, 0, 0], name: "Units" }))))), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" } }, "Sales by Store"), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { borderBottom: `1px solid ${BORDER}` } }, [{ label: "Store", col: "store" }, { label: "Units", col: "units" }, { label: "Revenue", col: "revenue" }, { label: "Avg/Unit", col: "avg" }].map(({ label: label2, col }) => /* @__PURE__ */ React.createElement(
      "th",
      {
        key: label2,
        onClick: () => setSearchStoreSort((s) => s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: col === "store" ? "asc" : "desc" }),
        style: { textAlign: "left", padding: "7px 10px", color: searchStoreSort.col === col ? accent : "#444", fontWeight: 400, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }
      },
      label2,
      searchStoreSort.col === col ? searchStoreSort.dir === "asc" ? " \u25B2" : " \u25BC" : " \u2195"
    )))), /* @__PURE__ */ React.createElement("tbody", null, [...storeData].sort((a, b) => {
      const { col, dir } = searchStoreSort;
      const mul = dir === "asc" ? 1 : -1;
      if (col === "store") return mul * a.store.localeCompare(b.store);
      if (col === "units") return mul * (a.units - b.units);
      if (col === "revenue") return mul * (a.revenue - b.revenue);
      if (col === "avg") return mul * ((a.units ? a.revenue / a.units : 0) - (b.units ? b.revenue / b.units : 0));
      return 0;
    }).map((s) => /* @__PURE__ */ React.createElement("tr", { key: s.store }, /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#ddd" } }, s.store), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: TEAL } }, s.units), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: accent } }, "$", s.revenue.toLocaleString()), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: GOLD } }, "$", s.units ? (s.revenue / s.units).toFixed(2) : "\u2014")))))));
  })()), subtab === "stores" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Revenue by Store"), /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: Math.max(200, agg.byStore.length * 34) }, /* @__PURE__ */ React.createElement(BarChart, { data: agg.byStore, layout: "vertical" }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A", horizontal: false }), /* @__PURE__ */ React.createElement(XAxis, { type: "number", tick: { fill: "#555", fontSize: 9 }, axisLine: false, tickLine: false, tickFormatter: (v) => `$${(v / 1e3).toFixed(1)}K` }), /* @__PURE__ */ React.createElement(YAxis, { dataKey: "store", type: "category", width: 120, tick: { fill: "#888", fontSize: 9 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(Tip, null) }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "revenue", name: "Revenue", radius: [0, 3, 3, 0] }, agg.byStore.map((_, i) => /* @__PURE__ */ React.createElement(Cell, { key: i, fill: COLORS[i % 10] })))))), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" } }, "All Stores (", agg.byStore.length, ")"), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { borderBottom: `1px solid ${BORDER}` } }, /* @__PURE__ */ React.createElement("th", { style: { padding: "7px 10px", color: "#444", fontSize: 9, textTransform: "uppercase" } }, "#"),
            ...[
              ["store","Store"],["units","Units"],["gross","Gross"],["revenue","Actual Rev"],["avg","Avg/Unit"],["share","Share"]
            ].map(([col,label]) => /* @__PURE__ */ React.createElement("th", {
              key: col,
              onClick: () => { if(sortStoreCol===col){setSortStoreDir(d=>d==="asc"?"desc":"asc");}else{setSortStoreCol(col);setSortStoreDir("desc");} },
              style: { textAlign: "left", padding: "7px 10px", color: sortStoreCol===col?"#fff":"#444", fontWeight: 400, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }
            }, label, sortStoreCol===col ? (sortStoreDir==="asc"?" ↑":" ↓") : " ↕")))),
            /* @__PURE__ */ React.createElement("tbody", null, [...agg.byStore].sort((a,b) => {
              const mul = sortStoreDir==="asc" ? 1 : -1;
              if(sortStoreCol==="store") return mul * a.store.localeCompare(b.store);
              if(sortStoreCol==="units") return mul * (a.units - b.units);
              if(sortStoreCol==="gross") return mul * ((a.gross||a.revenue) - (b.gross||b.revenue));
              if(sortStoreCol==="revenue") return mul * (a.revenue - b.revenue);
              if(sortStoreCol==="avg") return mul * ((a.units?a.revenue/a.units:0) - (b.units?b.revenue/b.units:0));
              if(sortStoreCol==="share") return mul * (a.revenue - b.revenue);
              return 0;
            }).map((s, i) => /* @__PURE__ */ React.createElement("tr", { key: s.store }, /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#333" } }, i + 1), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#ddd" } }, s.store), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: TEAL } }, s.units), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#22C55E" } }, "$", (s.gross||s.revenue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#F97316" } }, "$", s.revenue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: GOLD } }, "$", s.units ? (s.revenue / s.units).toFixed(2) : "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", minWidth: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 3, background: BORDER, borderRadius: 2 } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${Math.round(s.revenue / agg.totalRevenue * 100)}%`, height: "100%", background: COLORS[i % 10], borderRadius: 2 } })), /* @__PURE__ */ React.createElement("span", { style: { color: "#444", fontSize: 10 } }, Math.round(s.revenue / agg.totalRevenue * 100), "%"))))))))), subtab === "storedetail" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase" } }, "Select Stores ", selectedStore && selectedStore.length > 0 ? `\u2014 ${selectedStore.length} selected` : ""), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setSelectedStore(agg.byStore.map((s) => s.store)),
      style: { fontSize: 10, color: "#555", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace" }
    },
    "Select All"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setSelectedStore(null),
      style: { fontSize: 10, color: "#555", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono',monospace" }
    },
    "Clear"
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 4 } }, [...agg.byStore].sort((a, b) => a.store.localeCompare(b.store)).map((s) => {
    const isSelected = Array.isArray(selectedStore) && selectedStore.includes(s.store);
    const toggle = () => {
      if (!selectedStore || !Array.isArray(selectedStore)) {
        setSelectedStore([s.store]);
      } else if (isSelected) {
        const next = selectedStore.filter((x) => x !== s.store);
        setSelectedStore(next.length ? next : null);
      } else {
        setSelectedStore([...selectedStore, s.store]);
      }
    };
    return /* @__PURE__ */ React.createElement("button", { key: s.store, onClick: toggle, style: {
      padding: "9px 12px",
      borderRadius: 7,
      background: isSelected ? `${accent}22` : CARD,
      border: `1px solid ${isSelected ? accent : BORDER}`,
      color: isSelected ? accent : "#777",
      fontFamily: "'DM Mono',monospace",
      fontSize: 10,
      cursor: "pointer",
      textAlign: "left",
      transition: "all .15s",
      display: "flex",
      alignItems: "center",
      gap: 6
    } }, /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: isSelected ? accent : "#2A2A3A", flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, s.store));
  }))), (!selectedStore || !selectedStore.length) && /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 36, textAlign: "center", color: "#444", fontSize: 12 } }, "Select one or more stores above to see their product breakdown"), selectedStore && selectedStore.length > 0 && (() => {
    const inRange = (d) => {
      if (!d) return true;
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return true;
    };
    const storeRevel = (data.revelRows || []).filter((r) => selectedStore.includes(r.store) && inRange(r.date));
    const storeResova = (data.resovaRows || []).filter((r) => selectedStore.includes(r.store) && inRange(r.date));
    const byProduct = {};
    storeRevel.forEach((r) => {
      if (!byProduct[r.name]) byProduct[r.name] = { name: r.name, units: 0, revenue: 0 };
      byProduct[r.name].units += r.units;
      byProduct[r.name].revenue += r.revenue;
    });
    storeResova.forEach((r) => {
      if (!byProduct[r.item]) byProduct[r.item] = { name: r.item, units: 0, revenue: 0 };
      byProduct[r.item].units += r.qty || 1;
      byProduct[r.item].revenue += r.revenue;
    });
    const items = Object.values(byProduct).map((p) => __spreadProps(__spreadValues({}, p), { revenue: +p.revenue.toFixed(2) })).sort((a, b) => b.revenue - a.revenue);
    const totalRev = +items.reduce((s, i) => s + i.revenue, 0).toFixed(2);
    const totalGrossStore = +[...storeRevel,...storeResova].reduce((s,r)=>s+(r.gross||r.revenue||0),0).toFixed(2);
    const totalUnits = items.reduce((s, i) => s + i.units, 0);
    const byMonth = {};
    [...storeRevel, ...storeResova.map((r) => __spreadProps(__spreadValues({}, r), { name: r.item, units: r.qty || 1 }))].forEach((r) => {
      const mk = r.date ? parseDate(r.date) : "";
      const key = mk ? mk.slice(0, 7) : "Unknown";
      const label2 = key !== "Unknown" ? `${MONTHS[parseInt(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}` : key;
      if (!byMonth[key]) byMonth[key] = { month: label2, key, revenue: 0, units: 0 };
      byMonth[key].revenue += r.revenue;
      byMonth[key].units += r.units || 1;
    });
    const monthData = Object.values(byMonth).sort((a, b) => a.key.localeCompare(b.key)).map((m) => __spreadProps(__spreadValues({}, m), { revenue: +m.revenue.toFixed(2) }));
    const title = selectedStore.length === 1 ? selectedStore[0] : `${selectedStore.length} Stores Combined`;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${accent}33`, borderRadius: 10, padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Bebas Neue'", fontSize: 22, color: "#fff", letterSpacing: 2 } }, title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase" } }, "Gross"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, color: "#22C55E", fontFamily: "'Bebas Neue'" } }, "$", totalGrossStore.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase" } }, "Actual"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, color: "#F97316", fontFamily: "'Bebas Neue'" } }, "$", totalRev.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase" } }, "Units"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, color: GOLD, fontFamily: "'Bebas Neue'" } }, totalUnits.toLocaleString())), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase" } }, "Products"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, color: TEAL, fontFamily: "'Bebas Neue'" } }, items.length)))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Monthly Revenue"), monthData.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { color: "#333", fontSize: 11 } }, "No data in range") : (() => {
      const maxRev = Math.max(...monthData.map((m) => m.revenue), 1);
      return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 6, height: 160, paddingBottom: 20, position: "relative" } }, monthData.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: m.month, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: accent } }, "$", m.revenue >= 1e3 ? (m.revenue / 1e3).toFixed(1) + "K" : m.revenue), /* @__PURE__ */ React.createElement("div", { style: { width: "100%", background: accent, borderRadius: "3px 3px 0 0", height: `${Math.max(4, Math.round(m.revenue / maxRev * 120))}px`, opacity: 0.85 } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "#555", whiteSpace: "nowrap" } }, m.month))));
    })()), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Top Products"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } }, /* @__PURE__ */ React.createElement(PieChart, { width: 200, height: 200 }, /* @__PURE__ */ React.createElement(Pie, { data: items.slice(0, 7), dataKey: "revenue", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 90, paddingAngle: 2 }, items.slice(0, 7).map((_, i) => /* @__PURE__ */ React.createElement(Cell, { key: i, fill: COLORS[i % 10] }))), /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(Tip, null) })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 } }, items.slice(0, 7).map((item, i) => /* @__PURE__ */ React.createElement("div", { key: item.name, style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: COLORS[i % 10], flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 } }, item.name), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: COLORS[i % 10], flexShrink: 0 } }, "$", item.revenue.toLocaleString()))))))), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" } }, "All Products (", items.length, ")"), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { borderBottom: `1px solid ${BORDER}` } }, [
      { label: "#", col: null },
      { label: "Product", col: "name" },
      { label: "Units", col: "units" },
      { label: "Revenue", col: "revenue" },
      { label: "Avg/Unit", col: "avg" },
      { label: "Share", col: "share" }
    ].map(({ label: label2, col }) => /* @__PURE__ */ React.createElement("th", { key: label2, onClick: () => {
      if (!col) return;
      setStoreDetailSort((s) => s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: col === "name" ? "asc" : "desc" });
    }, style: { textAlign: "left", padding: "7px 10px", color: storeDetailSort.col === col ? accent : "#444", fontWeight: 400, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", cursor: col ? "pointer" : "default", userSelect: "none", whiteSpace: "nowrap" } }, label2, col && (storeDetailSort.col === col ? storeDetailSort.dir === "asc" ? " \u25B2" : " \u25BC" : " \u2195"))))), /* @__PURE__ */ React.createElement("tbody", null, [...items].sort((a, b) => {
      const { col, dir } = storeDetailSort;
      const mul = dir === "asc" ? 1 : -1;
      if (col === "name") return mul * a.name.localeCompare(b.name);
      if (col === "units") return mul * (a.units - b.units);
      if (col === "revenue") return mul * (a.revenue - b.revenue);
      if (col === "avg") return mul * ((a.units ? a.revenue / a.units : 0) - (b.units ? b.revenue / b.units : 0));
      if (col === "share") return mul * (a.revenue - b.revenue);
      return 0;
    }).map((item, i) => /* @__PURE__ */ React.createElement("tr", { key: item.name }, /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#333" } }, i + 1), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#ddd" } }, item.name), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: TEAL } }, item.units), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: accent } }, "$", item.revenue.toLocaleString()), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: GOLD } }, "$", item.units ? (item.revenue / item.units).toFixed(2) : "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", minWidth: 110 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 3, background: BORDER, borderRadius: 2 } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${totalRev ? Math.round(item.revenue / totalRev * 100) : 0}%`, height: "100%", background: COLORS[i % 10], borderRadius: 2 } })), /* @__PURE__ */ React.createElement("span", { style: { color: "#444", fontSize: 10 } }, totalRev ? Math.round(item.revenue / totalRev * 100) : 0, "%")))))))));
  })()), subtab === "compare" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: accent, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" } }, "\u2460 Products"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: cmpInput,
      onChange: (e) => setCmpInput(e.target.value),
      onKeyDown: (e) => {
        if ((e.key === "Enter" || e.key === ",") && cmpInput.trim()) {
          e.preventDefault();
          const t = cmpInput.trim();
          if (!cmpProducts.includes(t)) {
            setCmpProducts((p) => [...p, t]);
            setCmpSelProducts([]);
          }
          setCmpInput("");
        }
      },
      placeholder: "Search products\u2026 (Enter to add)",
      style: { flex: 1, padding: "7px 10px", borderRadius: 6, background: DARK, border: `1px solid ${BORDER}`, color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 11, outline: "none" }
    }
  ), cmpInput.trim() && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        const t = cmpInput.trim();
        if (!cmpProducts.includes(t)) {
          setCmpProducts((p) => [...p, t]);
          setCmpSelProducts([]);
        }
        setCmpInput("");
      },
      style: { padding: "7px 12px", borderRadius: 6, background: accent, border: "none", color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" }
    },
    "+"
  )), cmpProducts.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 } }, cmpProducts.map((t) => /* @__PURE__ */ React.createElement("div", { key: t, style: { display: "flex", alignItems: "center", gap: 4, background: `${accent}22`, border: `1px solid ${accent}44`, borderRadius: 20, padding: "3px 10px 3px 12px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: accent } }, t), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setCmpProducts((p) => p.filter((x) => x !== t));
    setCmpSelProducts([]);
  }, style: { background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 12, lineHeight: 1, padding: 0 } }, "\xD7")))), (() => {
    if (!cmpProducts.length) return null;
    const matchesAny = (name) => cmpProducts.some((t) => name.toLowerCase().includes(t.toLowerCase()));
    const inCmpStore = (s) => !cmpStores.length || cmpStores.includes(s);
    const allNames = [.../* @__PURE__ */ new Set([
      ...(data.revelRows || []).filter((r) => matchesAny(r.name) && inCmpStore(r.store)).map((r) => r.name),
      ...(data.resovaRows || []).filter((r) => matchesAny(r.item) && inCmpStore(r.store)).map((r) => r.item)
    ])].sort();
    if (!allNames.length) return /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#444" } }, "No matches found");
    const active = cmpSelProducts.length > 0 ? cmpSelProducts : allNames;
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } }, allNames.map((n) => {
      const sel = cmpSelProducts.length === 0 || cmpSelProducts.includes(n);
      return /* @__PURE__ */ React.createElement("button", { key: n, onClick: () => {
        if (cmpSelProducts.length === 0) setCmpSelProducts(allNames.filter((x) => x !== n));
        else if (cmpSelProducts.includes(n)) {
          const next = cmpSelProducts.filter((x) => x !== n);
          setCmpSelProducts(next.length ? next : []);
        } else setCmpSelProducts([...cmpSelProducts, n]);
      }, style: { fontSize: 10, color: sel ? "#fff" : "#444", background: sel ? `${accent}33` : DARK, border: `1px solid ${sel ? accent : BORDER}`, borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Mono',monospace" } }, n);
    }));
  })()), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: GOLD, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" } }, "\u2461 Stores"), /* @__PURE__ */ React.createElement(StorePicker, { allStores: [...new Set([...(data.revelRows || []).map((r) => r.store), ...(data.resovaRows || []).map((r) => r.store)].filter(Boolean))].sort(), selected: cmpStores, onChange: setCmpStores, accent }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#444", marginTop: 8 } }, cmpStores.length === 0 ? "All stores" : "Filtering to " + cmpStores.length + " store(s)")), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: TEAL, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" } }, "\u2462 Date Ranges"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: accent, marginBottom: 4 } }, "Period A"), /* @__PURE__ */ React.createElement(DateRange, { revelRows: data.revelRows, resovaRows: data.resovaRows, dateFrom: cmpA.from, dateTo: cmpA.to, onChange: (f, t) => setCmpA({ from: f, to: t }) })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#888", marginBottom: 4 } }, "Period B (compare against)"), /* @__PURE__ */ React.createElement(DateRange, { revelRows: data.revelRows, resovaRows: data.resovaRows, dateFrom: cmpB.from, dateTo: cmpB.to, onChange: (f, t) => setCmpB({ from: f, to: t }) })))), (() => {
    if (!cmpProducts.length) return /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 36, textAlign: "center", color: "#444", fontSize: 12 } }, "Add products above to start comparing");
    const matchesAny = (name) => cmpProducts.some((t) => name.toLowerCase().includes(t.toLowerCase()));
    const inStore = (s) => !cmpStores.length || cmpStores.includes(s);
    const allNames = [.../* @__PURE__ */ new Set([
      ...(data.revelRows || []).filter((r) => matchesAny(r.name) && inStore(r.store)).map((r) => r.name),
      ...(data.resovaRows || []).filter((r) => matchesAny(r.item) && inStore(r.store)).map((r) => r.item)
    ])].sort();
    const active = cmpSelProducts.length > 0 ? cmpSelProducts : allNames;
    const inPeriod = (d, from, to) => {
      if (!d) return true;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    };
    const calcPeriod = (from, to) => {
      const rr = (data.revelRows || []).filter((r) => active.includes(r.name) && inStore(r.store) && inPeriod(r.date, from || "0000", to || "9999"));
      const sr = (data.resovaRows || []).filter((r) => active.includes(r.item) && inStore(r.store) && inPeriod(r.date, from || "0000", to || "9999"));
      const rev = +[...rr, ...sr].reduce((s, r) => s + r.revenue, 0).toFixed(2);
      const units = Math.round(rr.reduce((s, r) => s + r.units, 0) + sr.reduce((s, r) => s + (r.qty || 1), 0));
      const byProd = {};
      rr.forEach((r) => {
        if (!byProd[r.name]) byProd[r.name] = { name: r.name, units: 0, revenue: 0 };
        byProd[r.name].units += r.units;
        byProd[r.name].revenue += r.revenue;
      });
      sr.forEach((r) => {
        if (!byProd[r.item]) byProd[r.item] = { name: r.item, units: 0, revenue: 0 };
        byProd[r.item].units += r.qty || 1;
        byProd[r.item].revenue += r.revenue;
      });
      const byMonth = {};
      [...rr, ...sr.map((r) => __spreadProps(__spreadValues({}, r), { name: r.item, units: r.qty || 1 }))].forEach((r) => {
        const mk = r.date ? parseDate(r.date) : "";
        const key = mk ? mk.slice(0, 7) : "Unknown";
        const label2 = key !== "Unknown" ? `${MONTHS[parseInt(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}` : key;
        if (!byMonth[key]) byMonth[key] = { month: label2, key, revenue: 0, units: 0 };
        byMonth[key].revenue += r.revenue;
        byMonth[key].units += r.units || 1;
      });
      const monthly = Object.values(byMonth).sort((a2, b2) => a2.key.localeCompare(b2.key)).map((m) => __spreadProps(__spreadValues({}, m), { revenue: +m.revenue.toFixed(2) }));
      return { rev, units, byProd, monthly };
    };
    const a = calcPeriod(cmpA.from || "", cmpA.to || "9999");
    const b = calcPeriod(cmpB.from || "", cmpB.to || "9999");
    const hasA = cmpA.from || cmpA.to;
    const hasB = cmpB.from || cmpB.to;
    const pct = (curr, prev) => {
      if (!prev) return null;
      const d = (curr - prev) / prev * 100;
      return { val: Math.abs(d).toFixed(1), up: d >= 0 };
    };
    const revPct = pct(a.rev, b.rev);
    const unitPct = pct(a.units, b.units);
    const allProds = [.../* @__PURE__ */ new Set([...Object.keys(a.byProd), ...Object.keys(b.byProd)])].sort((x, y) => {
      var _a, _b, _c, _d;
      return (((_a = a.byProd[y]) == null ? void 0 : _a.revenue) || 0) + (((_b = b.byProd[y]) == null ? void 0 : _b.revenue) || 0) - ((((_c = a.byProd[x]) == null ? void 0 : _c.revenue) || 0) + (((_d = b.byProd[x]) == null ? void 0 : _d.revenue) || 0));
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 } }, [["REVENUE", "rev", "\u{1F4B0}", accent], [" UNITS SOLD", "units", "\u{1F4E6}", GOLD]].map(([lbl, key, ico, col]) => {
      var _a, _b, _c;
      return /* @__PURE__ */ React.createElement("div", { key: lbl, style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 22px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: col } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 } }, lbl.trim()), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: accent, marginBottom: 3 } }, "Period A ", cmpA.from ? `(${cmpA.from.slice(0, 7)}\u2192${(cmpA.to || "").slice(0, 7) || "\u2026"})` : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontFamily: "'Bebas Neue'", color: "#fff" } }, key === "rev" ? `$${a[key].toLocaleString()}` : a[key].toLocaleString())), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#888", marginBottom: 3 } }, "Period B ", cmpB.from ? `(${cmpB.from.slice(0, 7)}\u2192${(cmpB.to || "").slice(0, 7) || "\u2026"})` : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontFamily: "'Bebas Neue'", color: "#888" } }, key === "rev" ? `$${b[key].toLocaleString()}` : b[key].toLocaleString()))), hasA && hasB && (key === "rev" ? revPct : unitPct) && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: ((_a = key === "rev" ? revPct : unitPct) == null ? void 0 : _a.up) ? "#34D399" : "#ef4444", fontFamily: "'Bebas Neue'" } }, ((_b = key === "rev" ? revPct : unitPct) == null ? void 0 : _b.up) ? "\u25B2" : "\u25BC", " ", (_c = key === "rev" ? revPct : unitPct) == null ? void 0 : _c.val, "%"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#444" } }, "vs Period B")));
    })), (a.monthly.length > 0 || b.monthly.length > 0) && (() => {
      const allKeys = [.../* @__PURE__ */ new Set([...a.monthly.map((m) => m.key), ...b.monthly.map((m) => m.key)])].sort();
      const chartData = allKeys.map((key) => {
        const ma = a.monthly.find((m) => m.key === key);
        const mb = b.monthly.find((m) => m.key === key);
        return { month: (ma == null ? void 0 : ma.month) || (mb == null ? void 0 : mb.month) || key, periodA: (ma == null ? void 0 : ma.revenue) || null, periodB: (mb == null ? void 0 : mb.revenue) || null };
      });
      return /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Revenue Over Time \u2014 Period A vs Period B"), /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: 220 }, /* @__PURE__ */ React.createElement(LineChart, { data: chartData }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A" }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "month", tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(YAxis, { tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false, tickFormatter: (v) => `$${(v / 1e3).toFixed(1)}K` }), /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(Tip, null) }), /* @__PURE__ */ React.createElement(Line, { type: "monotone", dataKey: "periodA", stroke: accent, strokeWidth: 2, dot: { fill: accent, r: 3 }, name: "Period A Revenue", connectNulls: false }), /* @__PURE__ */ React.createElement(Line, { type: "monotone", dataKey: "periodB", stroke: "#888", strokeWidth: 2, dot: { fill: "#888", r: 3 }, name: "Period B Revenue", strokeDasharray: "5 5", connectNulls: false }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginTop: 8, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 2, background: accent } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#666" } }, "Period A")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 2, background: "#888", borderTop: "2px dashed #888" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#666" } }, "Period B"))));
    })(), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Product Breakdown \u2014 Period A vs Period B"), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { borderBottom: `1px solid ${BORDER}` } }, ["Product", "A Units", "B Units", "Unit \u0394%", "A Revenue", "B Revenue", "Rev \u0394%"].map((h) => /* @__PURE__ */ React.createElement("th", { key: h, style: { textAlign: "left", padding: "7px 10px", color: "#444", fontWeight: 400, fontSize: 9, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" } }, h)))), /* @__PURE__ */ React.createElement("tbody", null, allProds.map((name) => {
      const pa = a.byProd[name] || { units: 0, revenue: 0 };
      const pb = b.byProd[name] || { units: 0, revenue: 0 };
      const up = pct(pa.units, pb.units);
      const rp = pct(pa.revenue, pb.revenue);
      return /* @__PURE__ */ React.createElement("tr", { key: name }, /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#ddd" } }, name), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: TEAL } }, pa.units), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#555" } }, pb.units), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: up ? up.up ? "#34D399" : "#ef4444" : "#444" } }, up ? (up.up ? "\u25B2" : "\u25BC") + " " + up.val + "%" : "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: accent } }, "$", pa.revenue.toLocaleString()), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "#555" } }, "$", pb.revenue.toLocaleString()), /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: rp ? rp.up ? "#34D399" : "#ef4444" : "#444" } }, rp ? (rp.up ? "\u25B2" : "\u25BC") + " " + rp.val + "%" : "\u2014"));
    })))));
  })()), subtab === "categories" && (() => {
  const CITY_NAMES_RE = /\b(nashville|atlanta|chicago|denver|austin|orlando|dallas|houston|phoenix|charlotte|pittsburgh|indianapolis|st\s*louis|san\s*antonio|franklin|gatlinburg|birmingham|huntsville|raleigh|richmond|washington|new\s*york|nyc|boston|philadelphia|seattle|portland|minneapolis|kansas\s*city|oklahoma\s*city|memphis|louisville|cincinnati|columbus|cleveland|detroit|miami|tampa|jacksonville|new\s*orleans|lynnfield|times\s*square|alexandria|tysons|berry\s*hill|lincoln\s*park|salt\s*lake|las\s*vegas|downtown|midtown|uptown|southcenter|san\s*fran|new\s*jersey|moa\s*loon|yeti|bagel|seal)\b/i;
  const SHIRT_NAMES_RE = /\b(shirt|shirts|tee|cosmo\s+ie|i\s+escaped|i\s+almost\s+escaped|stamp|escapee|cosmo\s+youth|cosmo\s+prison\s+break|cosmo\s+the\s+depths|cosmo\s+timeliner|cosmo\s+depths|cosmo\s+playground|post\s*card|postcard|legend\s+of\s+the\s+yeti|the\s+heist|the\s+depths|timeliner|special\s+ops|cosmic\s+crisis|playground|ruins|gold\s+rush|tie\s+dye|2\s*sided|san\s+fran\s+seal|moa\s+loon|new\s+jersey\s+bagel|prison\s+break|la\s+pop|la\s+popcorn)\b/i;

  function getCategory(name, brand) {
    const n = name || "";
    const isGBGS = (brand||"").toLowerCase() === "gbgs";

    // GBGS-specific categories
    if (isGBGS) {
      if (/\bmagnet(s)?\b/i.test(n)) return "Magnets";
      if (/key\s*chain(s)?|keychain(s)?/i.test(n)) return "Keychain";
      if (/\bmedium\b/i.test(n)) return "Medium Pencils";
      if (/\bbottle\b/i.test(n) && !/bottled\s+water/i.test(n)) return "Chip Bottle";
    }

    // Cosmo Plushie Keychain — before Plushie and Keychain checks
    if (/cosmo\s+plushie\s+keychain/i.test(n)) return "Cosmo Plushie Keychain";

    // Plushies
    if (/\bplush(ie|ies)?\b/i.test(n)) return "Plushies";

    // Pin Packs — before Pins
    if (/\bpin\s*packs?\b/i.test(n)) return "Pin Packs";

    // Pins — word "pin"/"pins" only, not replacement pin
    if (/\bpins?\b/i.test(n) && !/replacement\s+pin/i.test(n)) return "Pins";

    // Shirts
    if (SHIRT_NAMES_RE.test(n)) return "Shirts";
    if (CITY_NAMES_RE.test(n) && !/\bpin\b/i.test(n)) return "Shirts";
    if (/\bie\b/i.test(n) && !/\b(pie|tie|die|lie|bie|movie|beanies?)\b/i.test(n) && !/\bpin\b/i.test(n)) return "Shirts";
    if (/the cabin|cosmo spec ops/i.test(n)) return "Shirts";

    // Hats
    if (/\bhats?\b/i.test(n)) return "Hats";

    // Beanies
    if (/\bbeanies?\b/i.test(n)) return "Beanies";

    // Shoe Charms
    if (/shoe\s+charm/i.test(n)) return "Shoe Charms";

    // Cosmo Bottle (TEG/AM)
    if (/\bbottle\b/i.test(n) && !/bottled\s+water/i.test(n)) return "Cosmo Bottle";

    // Unlockeds
    if (/\bunlocked\b/i.test(n)) return "Unlockeds";

    // EFIGs
    if (/\befig\b|board\s+game|iron\s+gate/i.test(n)) return "EFIGs";

    // Misc — specific named items
    if (/cosmo\s+hoodie|black\s+hoodie|cosmo\s+keychain|circle\s+keychain|cosmo\s+mug|cosmug|established\s+long\s+sleeve|\bkeychains?\b|deck\s+of\s+cards|cosmo\s+keychains|myrtle\s+beach\s+magnet|crocker\s+park\s+magnet|logo\s+keychain|circle\s+keychains|cosmo\s+rainbow\s+fanny\s+pack|\blong\s+sleeve\b|pigeon\s+forge\s+magnet|\bkoozie\b|cosmo\s+thumbs\s+up\s+charm/i.test(n)) return "Misc";

    // Beverages — drinks and everything remaining
    if (/\bcoke\b|\bwater\b|\bdrink\b|\bbeverage\b|dasani|\bsoda\b|\bjuice\b|\bcoffee\b|\btea\b|\bkoozie\b/i.test(n)) return "Beverages";

    return "Misc";
  }


  const COLORS2 = ["#FF5C1A","#D4A017","#4ECDC4","#A78BFA","#F59E0B","#34D399","#F87171","#60A5FA","#FB923C","#A3E635","#E879F9","#67E8F9"];
  const CAT_ORDER = ["Shirts","Pins","Pin Packs","Hats","Plushies","Cosmo Plushie Keychain","Cosmo Bottle","Chip Bottle","Beanies","Shoe Charms","Unlockeds","EFIGs","Magnets","Keychain","Medium Pencils","Misc","Beverages"];

  function calcStats(rows, from, to) {
    const byCategory = {}, byMonth = {}, itemsByCategory = {};
    const inRange = d => { if (!d) return true; if (from && d < from) return false; if (to && d > to) return false; return true; };
    rows.forEach(r => {
      if (!inRange(r.date)) return;
      const cat = getCategory(r.name, r.brand);
      if (!byCategory[cat]) byCategory[cat] = {units:0,revenue:0,gross:0,discount:0};
      if (!itemsByCategory[cat]) itemsByCategory[cat] = {};
      byCategory[cat].units += (r.units||r.qty||1);
      byCategory[cat].revenue += (r.revenue||0);
      byCategory[cat].gross += (r.gross||r.revenue||0);
      byCategory[cat].discount += (r.discount||0);
      const itemKey = r.name;
      if (!itemsByCategory[cat][itemKey]) itemsByCategory[cat][itemKey] = {units:0,revenue:0};
      itemsByCategory[cat][itemKey].units += (r.units||r.qty||1);
      itemsByCategory[cat][itemKey].revenue += (r.revenue||0);
      const mk = r.date ? r.date.slice(0,7) : "Unknown";
      if (!byMonth[mk]) byMonth[mk] = {};
      if (!byMonth[mk][cat]) byMonth[mk][cat] = 0;
      byMonth[mk][cat] += (r.revenue||0);
    });
    return {byCategory, byMonth, itemsByCategory};
  }

  // All stores available for filter
  const catAllStores = [...new Set([...(data.revelRows||[]).map(r=>r.store),...(data.resovaRows||[]).map(r=>r.store)].filter(Boolean))].sort();
  const allRows = [...(data.revelRows||[]), ...(data.resovaRows||[]).map(r=>({...r,name:r.item}))].filter(r=>catSelStores.length===0||catSelStores.includes(r.store));
  const mainStats = calcStats(allRows, dateFrom||null, dateTo||null);
  const cmpStats = (cmpFrom||cmpTo) ? calcStats(allRows, cmpFrom||null, cmpTo||null) : null;

  const allCatNames = [...new Set([...Object.keys(mainStats.byCategory), ...Object.keys(cmpStats?.byCategory||{})])];
  const cats = [...CAT_ORDER.filter(c=>allCatNames.includes(c)), ...allCatNames.filter(c=>!CAT_ORDER.includes(c))].map(name=>({
    name,
    ...mainStats.byCategory[name]||{units:0,revenue:0},
    cmp: cmpStats?.byCategory[name]||null,
    items: mainStats.itemsByCategory[name]||{},
  })).filter(c=>c.units>0||c.revenue>0);

  const totalRev = cats.reduce((s,c)=>s+c.revenue,0);
  const months = Object.keys(mainStats.byMonth).filter(k=>k!=="Unknown").sort();
  const monthLabels = months.map(mk=>`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(mk.slice(5,7))-1]} ${mk.slice(0,4)}`);
  const activeCats = selCats.length > 0 ? selCats : cats.map(c=>c.name);
  const chartData = months.map((mk,i)=>{ const obj={month:monthLabels[i]}; activeCats.forEach(cat=>{obj[cat]=mainStats.byMonth[mk]?.[cat]?+mainStats.byMonth[mk][cat].toFixed(2):0;}); return obj; });
  const filteredCats = cats.filter(c=>activeCats.includes(c.name));
  const filteredRev = filteredCats.reduce((s,c)=>s+c.revenue,0);
  const filteredUnits = filteredCats.reduce((s,c)=>s+c.units,0);
  const cmpRevTotal = filteredCats.reduce((s,c)=>s+(c.cmp?.revenue||0),0);
  const cmpUnitsTotal = filteredCats.reduce((s,c)=>s+(c.cmp?.units||0),0);

  function pct(a,b) { if(!b) return null; const d=(a-b)/b*100; return {val:Math.abs(d).toFixed(1),up:d>=0}; }
  function PctBadge({a,b}) {
    const p = pct(a,b);
    if (!p) return null;
    return React.createElement("span",{style:{color:p.up?"#34D399":"#ef4444",fontSize:11,marginLeft:6}}, (p.up?"▲":"▼")+" "+p.val+"%");
  }

  return React.createElement("div", null,
    /* Store selector for categories */
    React.createElement("div",{style:{background:"#111118",border:"1px solid #1E1E2E",borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}},
      React.createElement("div",{style:{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase",whiteSpace:"nowrap"}},"Filter Stores"),
      React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,flex:1}},
        catAllStores.map(s=>{
          const active = catSelStores.length===0||catSelStores.includes(s);
          return React.createElement("button",{key:s,onClick:()=>setCatSelStores(prev=>{
            if(prev.length===0) return catAllStores.filter(x=>x!==s);
            return prev.includes(s)?prev.filter(x=>x!==s):[...prev,s];
          }),style:{padding:"3px 10px",borderRadius:5,background:active?accent+"22":"transparent",border:`1px solid ${active?accent:"#1E1E2E"}`,color:active?accent:"#555",fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}},s);
        })
      ),
      catSelStores.length>0&&React.createElement("button",{onClick:()=>setCatSelStores([]),style:{fontSize:10,color:"#555",background:"transparent",border:"1px solid #1E1E2E",borderRadius:4,padding:"4px 8px",cursor:"pointer"}},"All")
    ),
    /* KPI cards */
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:16}},
      [
        {label:"Revenue",val:"$"+filteredRev.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}),cmpVal:cmpRevTotal,cmpFmt:v=>"$"+v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}),color:accent},
        {label:"Units Sold",val:filteredUnits.toLocaleString(),cmpVal:cmpUnitsTotal,cmpFmt:v=>v.toLocaleString(),color:"#D4A017"},
        {label:"Avg / Unit",val:filteredUnits?"$"+(filteredRev/filteredUnits).toFixed(2):"—",cmpVal:cmpUnitsTotal?(cmpRevTotal/cmpUnitsTotal):0,cmpFmt:v=>"$"+v.toFixed(2),color:"#4ECDC4"},
      ].map(({label,val,cmpVal,cmpFmt,color})=>
        React.createElement("div",{key:label,style:{background:"#111118",border:"1px solid #1E1E2E",borderRadius:10,padding:"18px 22px",position:"relative",overflow:"hidden"}},
          React.createElement("div",{style:{position:"absolute",top:0,left:0,right:0,height:2,background:color}}),
          React.createElement("div",{style:{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:7}},label),
          React.createElement("div",{style:{fontSize:24,fontFamily:"'Bebas Neue',sans-serif",color:"#fff",display:"flex",alignItems:"baseline",flexWrap:"wrap",gap:4}},
            val,
            cmpStats && React.createElement(PctBadge,{a:label==="Avg / Unit"?(filteredUnits?filteredRev/filteredUnits:0):label==="Revenue"?filteredRev:filteredUnits,b:cmpVal})
          ),
          cmpStats && React.createElement("div",{style:{fontSize:10,color:"#444",marginTop:3}}, "vs "+cmpFmt(cmpVal))
        )
      )
    ),

    /* Compare date range */
    React.createElement("div",{style:{background:"#111118",border:"1px solid #1E1E2E",borderRadius:10,padding:16,marginBottom:16}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}},
        React.createElement("div",{style:{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase"}}, "Compare Period"),
        React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8}},
          React.createElement("span",{style:{fontSize:10,color:"#555"}},"From"),
          React.createElement("input",{type:"month",value:cmpFrom?cmpFrom.slice(0,7):"",onChange:e=>setCmpFrom(e.target.value?e.target.value+"-01":""),style:{background:"#0A0A0F",border:"1px solid #1E1E2E",color:"#fff",borderRadius:6,padding:"5px 10px",fontSize:11,fontFamily:"'DM Mono',monospace"}}),
          React.createElement("span",{style:{fontSize:10,color:"#555"}},"To"),
          React.createElement("input",{type:"month",value:cmpTo?cmpTo.slice(0,7):"",onChange:e=>setCmpTo(e.target.value?e.target.value+"-31":""),style:{background:"#0A0A0F",border:"1px solid #1E1E2E",color:"#fff",borderRadius:6,padding:"5px 10px",fontSize:11,fontFamily:"'DM Mono',monospace"}}),
          (cmpFrom||cmpTo) && React.createElement("button",{onClick:()=>{setCmpFrom("");setCmpTo("");},style:{fontSize:10,color:"#555",background:"transparent",border:"1px solid #1E1E2E",borderRadius:4,padding:"4px 8px",cursor:"pointer"}},"✕ Clear")
        )
      )
    ),

    /* Category selector */
    React.createElement("div",{style:{background:"#111118",border:"1px solid #1E1E2E",borderRadius:10,padding:16,marginBottom:16}},
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
        React.createElement("div",{style:{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase"}},"Filter Categories"),
        React.createElement("div",{style:{display:"flex",gap:8}},
          React.createElement("button",{onClick:()=>setSelCats([]),style:{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}},"All"),
          React.createElement("button",{onClick:()=>setSelCats(cats.map(c=>c.name)),style:{fontSize:10,color:"#555",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace"}},"None")
        )
      ),
      React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
        cats.map((cat,i)=>{ const active=selCats.length===0||selCats.includes(cat.name);
          return React.createElement("button",{key:cat.name,onClick:()=>setSelCats(prev=>{ if(prev.length===0)return cats.map(c=>c.name).filter(n=>n!==cat.name); return prev.includes(cat.name)?prev.filter(n=>n!==cat.name):[...prev,cat.name]; }),style:{padding:"5px 12px",borderRadius:6,background:active?COLORS2[i%12]+"33":"transparent",border:`1px solid ${active?COLORS2[i%12]:"#1E1E2E"}`,color:active?COLORS2[i%12]:"#555",fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",transition:"all .15s"}},cat.name);
        })
      )
    ),

    /* Line chart — gross vs actual, with compare period option */
    chartData.length>0 && (() => {
      // Build gross revenue by month/category
      const grossByMonth = {};
      const allRows2 = [...(data.revelRows||[]), ...(data.resovaRows||[]).map(r=>({...r,name:r.item}))];
      allRows2.forEach(r => {
        const inRange = d => { if(!d) return true; if(dateFrom&&d<dateFrom) return false; if(dateTo&&d>dateTo) return false; return true; };
        if(!inRange(r.date)) return;
        const cat = getCategory(r.name, r.brand);
        const mk = r.date ? r.date.slice(0,7) : "Unknown";
        if(mk==="Unknown") return;
        if(!grossByMonth[mk]) grossByMonth[mk] = {};
        if(!grossByMonth[mk][cat]) grossByMonth[mk][cat] = 0;
        grossByMonth[mk][cat] += (r.gross||r.revenue||0);
      });

      // Build compare revenue by month/category (mapped to SAME month labels as main)
      const cmpByMonth = {};
      if(cmpStats) {
        allRows2.forEach(r => {
          const inCmp = d => { if(!d) return true; if(cmpFrom&&d<cmpFrom) return false; if(cmpTo&&d>cmpTo) return false; return true; };
          if(!inCmp(r.date)) return;
          const cat = getCategory(r.name, r.brand);
          const mk = r.date ? r.date.slice(0,7) : "Unknown";
          if(mk==="Unknown") return;
          if(!cmpByMonth[mk]) cmpByMonth[mk] = {};
          if(!cmpByMonth[mk][cat]) cmpByMonth[mk][cat] = 0;
          cmpByMonth[mk][cat] += (r.revenue||0);
        });
      }

      // Single merged dataset — one entry per month, keys: cat, cat_gross, cat_cmp
      const mergedData = months.map((mk,i) => {
        const obj = {month: monthLabels[i], _key: mk};
        activeCats.forEach(cat => {
          obj[cat] = mainStats.byMonth[mk]?.[cat] ? +mainStats.byMonth[mk][cat].toFixed(2) : 0;
          obj[cat+"__gross"] = grossByMonth[mk]?.[cat] ? +grossByMonth[mk][cat].toFixed(2) : 0;
        });
        return obj;
      });

      // Compare data mapped onto same X axis months
      const cmpMonths = Object.keys(cmpByMonth).sort();
      const cmpLabels = cmpMonths.map(mk=>`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(mk.slice(5,7))-1]} ${mk.slice(0,4)}`);
      const cmpMergedData = cmpMonths.map((mk,i) => {
        const obj = {month: cmpLabels[i], _key: mk};
        activeCats.forEach(cat => { obj[cat] = cmpByMonth[mk]?.[cat] ? +cmpByMonth[mk][cat].toFixed(2) : 0; });
        return obj;
      });

      // % change per category
      const catChanges = cmpStats ? activeCats.map(cat => {
        const mainCat = filteredCats.find(c=>c.name===cat);
        const cmpCat = cmpStats.byCategory[cat];
        if(!cmpCat?.revenue||!mainCat?.revenue) return {cat,pct:null};
        const d = (mainCat.revenue - cmpCat.revenue)/cmpCat.revenue*100;
        return {cat, pct:Math.abs(d).toFixed(1), up: d>=0};
      }) : [];

      return React.createElement("div",{style:{background:"#111118",border:"1px solid #1E1E2E",borderRadius:10,padding:20,marginBottom:16}},
        /* Header */
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}},
          React.createElement("div",{style:{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase"}},"Revenue by Category Over Time"),
          React.createElement("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
            React.createElement("button",{onClick:()=>setShowGross(v=>!v),style:{padding:"4px 10px",borderRadius:5,background:showGross?"#22C55E33":"transparent",border:`1px solid ${showGross?"#22C55E":"#1E1E2E"}`,color:showGross?"#22C55E":"#555",fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}},"GROSS"),
            React.createElement("div",{style:{width:1,background:"#1E1E2E"}}),
            React.createElement("button",{onClick:()=>setChartMode("line"),style:{padding:"4px 10px",borderRadius:5,background:chartMode==="line"?accent+"33":"transparent",border:`1px solid ${chartMode==="line"?accent:"#1E1E2E"}`,color:chartMode==="line"?accent:"#555",fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}},"LINE"),
            React.createElement("button",{onClick:()=>setChartMode("bar"),style:{padding:"4px 10px",borderRadius:5,background:chartMode==="bar"?accent+"33":"transparent",border:`1px solid ${chartMode==="bar"?accent:"#1E1E2E"}`,color:chartMode==="bar"?accent:"#555",fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}},"STACKED")
          )
        ),

        /* % change badges */
        cmpStats && catChanges.some(c=>c.pct!==null) && React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}},
          catChanges.filter(c=>c.pct!==null).map(({cat,pct,up},i) =>
            React.createElement("div",{key:cat,style:{display:"flex",alignItems:"center",gap:4,background:"#0A0A0F",borderRadius:5,padding:"3px 8px",border:`1px solid ${up?"#22C55E33":"#ef444433"}`}},
              React.createElement("div",{style:{width:8,height:8,borderRadius:"50%",background:COLORS2[cats.findIndex(c=>c.name===cat)%12],flexShrink:0}}),
              React.createElement("span",{style:{fontSize:10,color:"#aaa",marginRight:2}}),cat,
              React.createElement("span",{style:{fontSize:11,color:up?"#22C55E":"#ef4444",marginLeft:4}}),(up?"▲":"▼")+pct+"%")
          )
        ),

        /* Main period chart */
        React.createElement("div",{style:{marginBottom:cmpStats?8:0}},
          cmpStats && React.createElement("div",{style:{fontSize:9,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:6}},"Main Period"),
          React.createElement(Recharts.ResponsiveContainer,{width:"100%",height:260},
            chartMode==="line"
              ? React.createElement(Recharts.LineChart,{data:mergedData},
                  React.createElement(Recharts.CartesianGrid,{strokeDasharray:"3 3",stroke:"#1A1A2A"}),
                  React.createElement(Recharts.XAxis,{dataKey:"month",tick:{fill:"#555",fontSize:10},axisLine:false,tickLine:false}),
                  React.createElement(Recharts.YAxis,{tick:{fill:"#555",fontSize:10},axisLine:false,tickLine:false,tickFormatter:v=>"$"+(v/1000).toFixed(1)+"K"}),
                  React.createElement(Recharts.Tooltip,{contentStyle:{background:"#1A1A2E",border:"1px solid #1E1E2E",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11},formatter:(v,n)=>["$"+Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}),n.replace("__gross"," (Gross)")]}),
                  React.createElement(Recharts.Legend,{formatter:v=>React.createElement("span",{style:{color:"#888",fontSize:10}},v.replace("__gross"," (Gross)"))}),
                  ...activeCats.map((cat,i)=>[
                    React.createElement(Recharts.Line,{key:"a-"+cat,type:"monotone",dataKey:cat,stroke:COLORS2[cats.findIndex(c=>c.name===cat)%12],strokeWidth:2.5,dot:{r:3},activeDot:{r:5},connectNulls:false,name:cat}),
                    ...(showGross?[React.createElement(Recharts.Line,{key:"g-"+cat,type:"monotone",dataKey:cat+"__gross",stroke:COLORS2[cats.findIndex(c=>c.name===cat)%12],strokeWidth:1.5,strokeDasharray:"6 3",dot:false,activeDot:{r:3},connectNulls:false,name:cat+"__gross"})]:[] )
                  ]).flat()
                )
              : React.createElement(Recharts.BarChart,{data:mergedData},
                  React.createElement(Recharts.CartesianGrid,{strokeDasharray:"3 3",stroke:"#1A1A2A"}),
                  React.createElement(Recharts.XAxis,{dataKey:"month",tick:{fill:"#555",fontSize:10},axisLine:false,tickLine:false}),
                  React.createElement(Recharts.YAxis,{tick:{fill:"#555",fontSize:10},axisLine:false,tickLine:false,tickFormatter:v=>"$"+(v/1000).toFixed(1)+"K"}),
                  React.createElement(Recharts.Tooltip,{contentStyle:{background:"#1A1A2E",border:"1px solid #1E1E2E",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11},formatter:(v,n)=>["$"+Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}),n]}),
                  React.createElement(Recharts.Legend,{formatter:v=>React.createElement("span",{style:{color:"#888",fontSize:10}},v)}),
                  ...activeCats.map((cat,i)=>React.createElement(Recharts.Bar,{key:cat,dataKey:cat,stackId:"a",fill:COLORS2[cats.findIndex(c=>c.name===cat)%12],radius:i===activeCats.length-1?[3,3,0,0]:[0,0,0,0]}))
                )
          )
        ),

        /* Compare period chart */
        cmpStats && cmpMergedData.length>0 && React.createElement("div",null,
          React.createElement("div",{style:{fontSize:9,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:6,marginTop:8}},
            "Compare Period"+(cmpFrom?" ("+cmpFrom.slice(0,7)+" → "+(cmpTo?cmpTo.slice(0,7):"now")+")":"")
          ),
          React.createElement(Recharts.ResponsiveContainer,{width:"100%",height:200},
            React.createElement(Recharts.LineChart,{data:cmpMergedData},
              React.createElement(Recharts.CartesianGrid,{strokeDasharray:"3 3",stroke:"#1A1A2A"}),
              React.createElement(Recharts.XAxis,{dataKey:"month",tick:{fill:"#555",fontSize:10},axisLine:false,tickLine:false}),
              React.createElement(Recharts.YAxis,{tick:{fill:"#555",fontSize:10},axisLine:false,tickLine:false,tickFormatter:v=>"$"+(v/1000).toFixed(1)+"K"}),
              React.createElement(Recharts.Tooltip,{contentStyle:{background:"#1A1A2E",border:"1px solid #1E1E2E",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11},formatter:(v,n)=>["$"+Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}),n]}),
              ...activeCats.map((cat,i)=>React.createElement(Recharts.Line,{key:"cmp-"+cat,type:"monotone",dataKey:cat,stroke:COLORS2[cats.findIndex(c=>c.name===cat)%12],strokeWidth:2,strokeDasharray:"4 2",dot:{r:2},connectNulls:false,name:cat}))
            )
          )
        ),

        /* Line style legend */
        chartMode==="line" && React.createElement("div",{style:{display:"flex",gap:20,marginTop:10,justifyContent:"center",flexWrap:"wrap"}},
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6}},
            React.createElement("div",{style:{width:24,height:2,background:"#888"}}),
            React.createElement("span",{style:{fontSize:10,color:"#555"}}),"Actual Revenue"
          ),
          showGross && React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6}},
            React.createElement("div",{style:{width:24,height:0,borderTop:"2px dashed #888"}}),
            React.createElement("span",{style:{fontSize:10,color:"#555"}}),"Gross Revenue"
          ),
          cmpStats && React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6}},
            React.createElement("div",{style:{width:24,height:0,borderTop:"2px dashed #888"}}),
            React.createElement("span",{style:{fontSize:10,color:"#555"}}),"Compare Period (below)"
          )
        )
      );
    })(),

/* Category breakdown table with expandable rows and A/B period comparison */
    React.createElement("div",{style:{background:"#111118",border:"1px solid #1E1E2E",borderRadius:10,padding:20}},

      /* Period A and B date pickers */
      React.createElement("div",{style:{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}},
        React.createElement("div",{style:{flex:1,minWidth:260,background:"#0A0A0F",borderRadius:8,padding:"12px 14px",border:"1px solid #1E1E2E"}},
          React.createElement("div",{style:{fontSize:9,color:accent,letterSpacing:2,textTransform:"uppercase",marginBottom:8}},"Period A"),
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}},
            React.createElement("span",{style:{fontSize:10,color:"#555"}},"From"),
            React.createElement("input",{type:"month",value:periodA.from?periodA.from.slice(0,7):"",onChange:e=>setPeriodA(p=>({...p,from:e.target.value?e.target.value+"-01":""})),style:{background:"#111118",border:"1px solid #1E1E2E",color:"#fff",borderRadius:6,padding:"5px 8px",fontSize:11,flex:1}}),
            React.createElement("span",{style:{fontSize:10,color:"#555"}},"To"),
            React.createElement("input",{type:"month",value:periodA.to?periodA.to.slice(0,7):"",onChange:e=>setPeriodA(p=>({...p,to:e.target.value?e.target.value+"-31":""})),style:{background:"#111118",border:"1px solid #1E1E2E",color:"#fff",borderRadius:6,padding:"5px 8px",fontSize:11,flex:1}}),
            periodA.from&&React.createElement("button",{onClick:()=>setPeriodA({from:"",to:""}),style:{fontSize:10,color:"#555",background:"transparent",border:"1px solid #1E1E2E",borderRadius:4,padding:"4px 7px",cursor:"pointer"}},"✕")
          )
        ),
        React.createElement("div",{style:{flex:1,minWidth:260,background:"#0A0A0F",borderRadius:8,padding:"12px 14px",border:"1px solid #1E1E2E"}},
          React.createElement("div",{style:{fontSize:9,color:"#D4A017",letterSpacing:2,textTransform:"uppercase",marginBottom:8}},"Period B"),
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}},
            React.createElement("span",{style:{fontSize:10,color:"#555"}},"From"),
            React.createElement("input",{type:"month",value:periodB.from?periodB.from.slice(0,7):"",onChange:e=>setPeriodB(p=>({...p,from:e.target.value?e.target.value+"-01":""})),style:{background:"#111118",border:"1px solid #1E1E2E",color:"#fff",borderRadius:6,padding:"5px 8px",fontSize:11,flex:1}}),
            React.createElement("span",{style:{fontSize:10,color:"#555"}},"To"),
            React.createElement("input",{type:"month",value:periodB.to?periodB.to.slice(0,7):"",onChange:e=>setPeriodB(p=>({...p,to:e.target.value?e.target.value+"-31":""})),style:{background:"#111118",border:"1px solid #1E1E2E",color:"#fff",borderRadius:6,padding:"5px 8px",fontSize:11,flex:1}}),
            periodB.from&&React.createElement("button",{onClick:()=>setPeriodB({from:"",to:""}),style:{fontSize:10,color:"#555",background:"transparent",border:"1px solid #1E1E2E",borderRadius:4,padding:"4px 7px",cursor:"pointer"}},"✕")
          )
        )
      ),

      (() => {
        const hasPeriods = !!(periodA.from||periodA.to) && !!(periodB.from||periodB.to);
        const allBaseRows = [...(data.revelRows||[]), ...(data.resovaRows||[]).map(r=>({...r,name:r.item}))];

        function pStats(from,to) {
          const ok = d=>{ if(!d) return true; if(from&&d<from) return false; if(to&&d>to) return false; return true; };
          const bc={};
          allBaseRows.forEach(r=>{
            if(!ok(r.date)) return;
            const cat=getCategory(r.name, r.brand);
            if(!bc[cat]) bc[cat]={units:0,revenue:0,gross:0};
            bc[cat].units+=(r.units||r.qty||1);
            bc[cat].revenue+=(r.revenue||0);
            bc[cat].gross+=(r.gross||r.revenue||0);
          });
          return bc;
        }

        const sA = hasPeriods ? pStats(periodA.from||null,periodA.to||null) : null;
        const sB = hasPeriods ? pStats(periodB.from||null,periodB.to||null) : null;
        const totalRevA = sA ? Object.values(sA).reduce((s,c)=>s+c.revenue,0) : 0;
        const totalRevB = sB ? Object.values(sB).reduce((s,c)=>s+c.revenue,0) : 0;

        function badge(a,b) {
          if(!b) return null;
          const d=(a-b)/b*100;
          return React.createElement("span",{style:{fontSize:10,color:d>=0?"#22C55E":"#ef4444",marginLeft:4,whiteSpace:"nowrap"}},(d>=0?"▲":"▼")+Math.abs(d).toFixed(1)+"%");
        }
        function fmtMoney(n){ return n>0?"$"+n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):"—"; }
        const thSt = (color)=>({textAlign:"right",padding:"6px 8px",color:color||"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase",whiteSpace:"nowrap",borderBottom:"1px solid #1E1E2E"});
        const tdSt = (color)=>({padding:"9px 8px",textAlign:"right",color:color||"#ddd",fontSize:11,verticalAlign:"middle"});

        const displayCats = hasPeriods
          ? [...new Set([...Object.keys(sA||{}),...Object.keys(sB||{})])].filter(c=>(sA?.[c]?.revenue||0)+(sB?.[c]?.revenue||0)>0)
          : filteredCats.map(c=>c.name);

        return React.createElement("div",null,
          React.createElement("div",{style:{fontSize:10,color:"#555",letterSpacing:2,marginBottom:12,textTransform:"uppercase"}},
            hasPeriods?"Category Breakdown — A vs B":"Category Breakdown"
          ),
          React.createElement("div",{style:{overflowX:"auto"}},
            React.createElement("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:11}},
              React.createElement("thead",null,
                React.createElement("tr",null,
                  React.createElement("th",{style:{padding:"6px 8px",borderBottom:"1px solid #1E1E2E",width:24}}),
                  React.createElement("th",{style:{textAlign:"left",padding:"6px 8px",color:"#444",fontWeight:400,fontSize:9,letterSpacing:1,textTransform:"uppercase",borderBottom:"1px solid #1E1E2E"}},"Category"),
                  hasPeriods ? React.createElement(React.Fragment,null,
                    React.createElement("th",{colSpan:4,style:{textAlign:"center",padding:"6px 8px",color:accent,fontWeight:500,fontSize:9,letterSpacing:1,textTransform:"uppercase",borderBottom:"1px solid #1E1E2E",borderLeft:"1px solid #1E1E2E33"}},
                      "A"+(periodA.from?" · "+periodA.from+(periodA.to?" → "+periodA.to:""):"")),
                    React.createElement("th",{colSpan:5,style:{textAlign:"center",padding:"6px 8px",color:"#D4A017",fontWeight:500,fontSize:9,letterSpacing:1,textTransform:"uppercase",borderBottom:"1px solid #1E1E2E",borderLeft:"1px solid #1E1E2E33"}},
                      "B"+(periodB.from?" · "+periodB.from+(periodB.to?" → "+periodB.to:""):"")+" vs A")
                  ) : React.createElement(React.Fragment,null,
                    React.createElement("th",{style:thSt("#4ECDC4")},"Units"),
                    React.createElement("th",{style:thSt("#22C55E")},"Gross"),
                    React.createElement("th",{style:thSt(accent)},"Actual Rev"),
                    React.createElement("th",{style:thSt("#D4A017")},"Avg/Unit"),
                    React.createElement("th",{style:thSt("#555")},"Share")
                  )
                ),
                hasPeriods && React.createElement("tr",null,
                  React.createElement("th",{style:{borderBottom:"1px solid #1E1E2E"}}),
                  React.createElement("th",{style:{borderBottom:"1px solid #1E1E2E"}}),
                  React.createElement("th",{style:{...thSt("#4ECDC4"),borderLeft:"1px solid #1E1E2E33"}},"Units"),
                  React.createElement("th",{style:thSt("#fff")},"Gross"),
                  React.createElement("th",{style:thSt("#F97316")},"Actual"),
                  React.createElement("th",{style:thSt("#D4A017")},"Avg/Unit"),
                  React.createElement("th",{style:{...thSt("#4ECDC4"),borderLeft:"1px solid #1E1E2E33"}},"Units"),
                  React.createElement("th",{style:thSt("#fff")},"Gross"),
                  React.createElement("th",{style:thSt("#F97316")},"Actual"),
                  React.createElement("th",{style:thSt("#D4A017")},"Avg/Unit"),
                  React.createElement("th",{style:thSt("#888")},"Δ Rev")
                )
              ),
              React.createElement("tbody",null,
                displayCats.map(catName => {
                  const ci = cats.findIndex(c=>c.name===catName);
                  const color = COLORS2[(ci<0?0:ci)%12];
                  const catObj = cats.find(c=>c.name===catName);
                  const isOpen = (expandedCats||[]).includes(catName);
                  const items = catObj ? Object.entries(catObj.items).sort((a,b)=>b[1].revenue-a[1].revenue) : [];
                  const colSpan = hasPeriods ? 11 : 7;

                  const a = sA?.[catName]||{units:0,revenue:0,gross:0};
                  const b = sB?.[catName]||{units:0,revenue:0,gross:0};
                  const aAvg = a.units?a.revenue/a.units:0;
                  const bAvg = b.units?b.revenue/b.units:0;
                  const base = catObj||{units:0,revenue:0,gross:0};

                  return [
                    React.createElement("tr",{key:catName,style:{borderBottom:isOpen?"none":"1px solid #1E1E2E22",cursor:"pointer"},
                      onClick:()=>setExpandedCats(prev=>(prev||[]).includes(catName)?(prev||[]).filter(n=>n!==catName):[...(prev||[]),catName])},
                      React.createElement("td",{style:{padding:"9px 8px",color}},isOpen?"▼":"▶"),
                      React.createElement("td",{style:{padding:"9px 8px",color:"#ddd",fontWeight:500}},catName),
                      hasPeriods ? React.createElement(React.Fragment,null,
                        /* Period A */
                        React.createElement("td",{style:{...tdSt("#4ECDC4"),borderLeft:"1px solid #1E1E2E22"}},a.units.toLocaleString()),
                        React.createElement("td",{style:tdSt("#fff")},fmtMoney(a.gross)),
                        React.createElement("td",{style:tdSt("#F97316")},fmtMoney(a.revenue)),
                        React.createElement("td",{style:tdSt("#D4A017")},aAvg?"$"+aAvg.toFixed(2):"—"),
                        /* Period B */
                        React.createElement("td",{style:{...tdSt("#4ECDC4"),borderLeft:"1px solid #1E1E2E22"}},
                          b.units.toLocaleString(), badge(b.units,a.units)),
                        React.createElement("td",{style:tdSt("#fff")},fmtMoney(b.gross), badge(b.gross,a.gross)),
                        React.createElement("td",{style:tdSt("#F97316")},fmtMoney(b.revenue), badge(b.revenue,a.revenue)),
                        React.createElement("td",{style:tdSt("#D4A017")},bAvg?"$"+bAvg.toFixed(2):"—", bAvg&&aAvg?badge(bAvg,aAvg):null),
                        React.createElement("td",{style:{...tdSt(),textAlign:"right"}},
                          a.revenue&&b.revenue ? (()=>{const d=(b.revenue-a.revenue)/a.revenue*100; return React.createElement("span",{style:{color:d>=0?"#22C55E":"#ef4444",fontWeight:600}},(d>=0?"▲":"▼")+Math.abs(d).toFixed(1)+"%");})() : React.createElement("span",{style:{color:"#333"}},"—")
                        )
                      ) : React.createElement(React.Fragment,null,
                        React.createElement("td",{style:tdSt("#4ECDC4")},base.units.toLocaleString()),
                        React.createElement("td",{style:tdSt("#fff")},fmtMoney(base.gross)),
                        React.createElement("td",{style:tdSt("#F97316")},fmtMoney(base.revenue)),
                        React.createElement("td",{style:tdSt("#D4A017")},base.units?"$"+(base.revenue/base.units).toFixed(2):"—"),
                        React.createElement("td",{style:{padding:"9px 8px",textAlign:"right",minWidth:100}},
                          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end"}},
                            React.createElement("div",{style:{width:60,height:3,background:"#1E1E2E",borderRadius:2}},
                              React.createElement("div",{style:{width:(totalRev?base.revenue/totalRev*100:0)+"%",height:"100%",background:color,borderRadius:2}})
                            ),
                            React.createElement("span",{style:{color:"#444",fontSize:10}},totalRev?(base.revenue/totalRev*100).toFixed(1)+"%":"0%")
                          )
                        )
                      )
                    ),
                    isOpen && React.createElement("tr",{key:catName+"-exp"},
                      React.createElement("td",{colSpan,style:{padding:"0 0 10px 28px"}},
                        React.createElement("div",{style:{background:"#0A0A0F",borderRadius:8,padding:"8px 12px",borderLeft:`2px solid ${color}`}},
                          React.createElement("div",{style:{fontSize:9,color:"#444",letterSpacing:2,textTransform:"uppercase",marginBottom:6}},"Items in "+catName),
                          items.map(([nm,d])=>
                            React.createElement("div",{key:nm,style:{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #1A1A2A"}},
                              React.createElement("span",{style:{color:"#888",fontSize:11}},nm),
                              React.createElement("span",{style:{color:"#555",fontSize:11}},d.units+" units · $"+d.revenue.toFixed(2))
                            )
                          )
                        )
                      )
                    )
                  ];
                })
              )
            )
          )
        );
      })()
    )
  );
})(), subtab === "trends" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Revenue & Units Over Time"), /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: 240 }, /* @__PURE__ */ React.createElement(LineChart, { data: agg.monthlyRevenue }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A" }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "month", tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(YAxis, { yAxisId: "l", tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false, tickFormatter: (v) => `$${(v / 1e3).toFixed(1)}K` }), /* @__PURE__ */ React.createElement(YAxis, { yAxisId: "r", orientation: "right", tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(Tip, null) }), /* @__PURE__ */ React.createElement(Line, { yAxisId: "l", type: "monotone", dataKey: "gross", stroke: "#22C55E", strokeWidth: 1.5, strokeDasharray: "5 3", dot: false, name: "Gross" }), /* @__PURE__ */ React.createElement(Line, { yAxisId: "l", type: "monotone", dataKey: "revenue", stroke: "#F97316", strokeWidth: 2, dot: { fill: "#F97316", r: 3 }, name: "Actual" }), /* @__PURE__ */ React.createElement(Line, { yAxisId: "r", type: "monotone", dataKey: "units", stroke: GOLD, strokeWidth: 2, dot: { fill: GOLD, r: 3 }, name: "Units" })))), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" } }, "Monthly Transactions"), /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: 170 }, /* @__PURE__ */ React.createElement(BarChart, { data: agg.monthlyRevenue }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1A1A2A" }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "month", tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(YAxis, { tick: { fill: "#555", fontSize: 10 }, axisLine: false, tickLine: false }), /* @__PURE__ */ React.createElement(Tooltip, { content: /* @__PURE__ */ React.createElement(Tip, null) }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "transactions", fill: TEAL, radius: [3, 3, 0, 0], name: "Transactions" })))))));
}
function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState(""), [err, setErr] = useState(false), [shake, setShake] = useState(false);
  const submit = () => {
    if (pw === PASSWORD) onUnlock();
    else {
      setErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono',monospace" } }, /* @__PURE__ */ React.createElement("style", null, `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap');*{box-sizing:border-box}@keyframes shake{0%,100%{transform:translateX(0)}25%,75%{transform:translateX(-8px)}50%{transform:translateX(8px)}}@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}.fu{animation:up .3s ease}`), /* @__PURE__ */ React.createElement("div", { style: { animation: shake ? "shake .4s" : "up .5s", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "48px 52px", textAlign: "center", maxWidth: 360, width: "90%" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, letterSpacing: 5, marginBottom: 6, textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#FE1D55" } }, "TEG"), /* @__PURE__ */ React.createElement("span", { style: { color: "#555" } }, " / "), /* @__PURE__ */ React.createElement("span", { style: { color: "#B39DDB" } }, "GBGS"), /* @__PURE__ */ React.createElement("span", { style: { color: "#555" } }, " / "), /* @__PURE__ */ React.createElement("span", { style: { color: "#F5E17A" } }, "AM")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Bebas Neue'", fontSize: 40, color: "#fff", letterSpacing: 2, marginBottom: 28 } }, "MERCH DASHBOARD"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      value: pw,
      onChange: (e) => {
        setPw(e.target.value);
        setErr(false);
      },
      onKeyDown: (e) => e.key === "Enter" && submit(),
      placeholder: "Enter password",
      autoFocus: true,
      style: { width: "100%", padding: "11px 14px", borderRadius: 8, background: DARK, border: `1px solid ${err ? "#ef4444" : BORDER}`, color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 14, outline: "none", marginBottom: 6 }
    }
  ), err && /* @__PURE__ */ React.createElement("div", { style: { color: "#ef4444", fontSize: 11, marginBottom: 8 } }, "Incorrect password"), /* @__PURE__ */ React.createElement("button", { onClick: submit, style: { width: "100%", padding: "11px", borderRadius: 8, background: ACCENT, border: "none", color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 13, cursor: "pointer", marginTop: 4 } }, "SIGN IN")));
}
function SetupModal({ onConnect, onSkip }) {
  const [url, setUrl] = useState(getUrl()), [status, setStatus] = useState(null), [msg, setMsg] = useState("");
  const test = async () => {
    if (!url) return;
    setStatus("testing");
    setMsg("");
    try {
      await ping(url);
      setStatus("ok");
      setMsg("\u2713 Connected!");
    } catch (e) {
      setStatus("err");
      setMsg("\u2717 " + e.message);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, fontFamily: "'DM Mono',monospace", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 36, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Bebas Neue'", fontSize: 26, color: "#fff", marginBottom: 20 } }, "CONNECT GOOGLE SHEETS"), /* @__PURE__ */ React.createElement("div", { style: { background: DARK, border: "1px solid #1A2A1A", borderRadius: 10, padding: 16, marginBottom: 18 } }, ["Open your Google Sheet \u2192 Extensions \u2192 Apps Script", "Paste the Code.gs file \u2192 Save", "Deploy \u2192 New Deployment \u2192 Web App", "Execute as: Me  |  Who has access: Anyone", "Copy the Web App URL \u2192 paste below"].map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 18, height: 18, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", flexShrink: 0, marginTop: 1 } }, i + 1), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#555", lineHeight: 1.5 } }, s)))), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: url,
      onChange: (e) => {
        setUrl(e.target.value);
        setStatus(null);
        setMsg("");
      },
      placeholder: "https://script.google.com/macros/s/XXXXXXXX/exec",
      style: { width: "100%", padding: "11px 13px", borderRadius: 8, background: DARK, border: `1px solid ${BORDER}`, color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 11, outline: "none", marginBottom: 8 }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 18, alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { onClick: test, disabled: !url || status === "testing", style: { padding: "7px 14px", borderRadius: 6, background: "transparent", border: `1px solid ${BORDER}`, color: "#666", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" } }, status === "testing" ? "TESTING\u2026" : "TEST CONNECTION"), msg && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: status === "ok" ? "#34D399" : "#ef4444", flex: 1 } }, msg)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("button", { onClick: onSkip, style: { flex: 1, padding: "10px", borderRadius: 8, background: "transparent", border: `1px solid ${BORDER}`, color: "#555", fontFamily: "'DM Mono',monospace", fontSize: 11, cursor: "pointer" } }, "SKIP \u2014 USE DEMO"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    saveUrl(url);
    onConnect(url);
  }, disabled: !url, style: { flex: 2, padding: "10px", borderRadius: 8, background: url ? ACCENT : "#1A0A00", border: "none", color: url ? "#fff" : "#5A3A00", fontFamily: "'DM Mono',monospace", fontSize: 11, cursor: url ? "pointer" : "default" } }, "SAVE & CONNECT \u2192"))));
}
function UploadModal({ sheetsUrl, existingData, onSave, onClose }) {
  var _a, _b;
  const [files, setFiles] = useState([]), [status, setStatus] = useState(null), [error, setError] = useState(null), [drag, setDrag] = useState(false);
  const ref = useRef();
  const readFiles = (fileList) => {
    setError(null);
    Array.from(fileList).forEach((file) => {
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const { city } = parseFilename(file.name);
          setFiles((prev) => [...prev.filter((f) => f.name !== file.name), { name: file.name, workbook, type: "xola", city, rows: [] }]);
        };
        reader.readAsArrayBuffer(file);
      } else if (file.name.endsWith(".csv")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const rows = parseCSV(e.target.result);
          const type = rows.length ? detectType(Object.keys(rows[0])) : "revel";
          const { city, dateFrom, dateTo } = parseFilename(file.name);
          setFiles((prev) => [...prev.filter((f) => f.name !== file.name), { name: file.name, rows, type, city, dateFrom, dateTo }]);
        };
        reader.readAsText(file);
      }
    });
  };
  const upload = async () => {
    try {
      setError(null);
      setStatus("processing");
      const ts = (/* @__PURE__ */ new Date()).toISOString();
      const base = existingData || { revelRows: [], resovaRows: [] };
      const newRevelRows = [], newResovaRows = [];
      files.forEach((f) => {
        const store = f.city || "";
        const fallbackDate = f.dateFrom || "";
        if (f.type === "revel") newRevelRows.push(...csvToRevelRows(f.rows, store, fallbackDate));
        if (f.type === "resova") {
          const filenameBrand = /gbgs/i.test(f.name) ? "gbgs" : /\bam\b|adventure.?mining/i.test(f.name) ? "am" : null;
          newResovaRows.push(...csvToResovaRows(f.rows, store, filenameBrand));
        }
        if (f.type === "xola") newRevelRows.push(...xlsxToXolaRows(f.workbook, store));
      });
      if (!newRevelRows.length && !newResovaRows.length) throw new Error("No data found in uploaded files");
      const revelRows = [...base.revelRows || [], ...newRevelRows];
      const resovaRows = [...base.resovaRows || [], ...newResovaRows];
      const newData = { revelRows, resovaRows, savedAt: ts, isDemo: false };
      setStatus("saving");
      if (sheetsUrl) {
        const newRR = slimify({ revelRows: newRevelRows, resovaRows: [], savedAt: ts }).rr;
        const newSR = slimify({ revelRows: [], resovaRows: newResovaRows, savedAt: ts }).sr;
        await appendToSheets(sheetsUrl, newRR, newSR, ts);
      } else {
        throw new Error("No Google Sheets connected. Please set up a Sheets connection first.");
      }
      onSave(newData);
    } catch (e) {
      setStatus(null);
      setError(e.message);
    }
  };
  const typeColor = (t) => t === "revel" ? ACCENT : t === "xola" ? "#34D399" : GOLD;
  const typeLabel = (t) => t === "revel" ? "Revel" : t === "xola" ? "Xola" : "Resova";
  const busy = !!status;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 36, maxWidth: 540, width: "100%", maxHeight: "90vh", overflowY: "auto", fontFamily: "'DM Mono',monospace" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Bebas Neue'", fontSize: 26, color: "#fff", marginBottom: 4 } }, "ADD DATA"), /* @__PURE__ */ React.createElement("div", { style: { color: "#555", fontSize: 11, marginBottom: 4 } }, "New uploads ", /* @__PURE__ */ React.createElement("span", { style: { color: "#34D399" } }, "add to"), " existing data \u2014 nothing is overwritten"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#333", marginBottom: 14 } }, "Supports Revel (CSV), Resova (CSV), Xola (XLSX) \xB7 ", (((_a = existingData == null ? void 0 : existingData.revelRows) == null ? void 0 : _a.length) || 0) + (((_b = existingData == null ? void 0 : existingData.resovaRows) == null ? void 0 : _b.length) || 0), " rows currently stored"), /* @__PURE__ */ React.createElement(
    "div",
    {
      onDragOver: (e) => {
        e.preventDefault();
        setDrag(true);
      },
      onDragLeave: () => setDrag(false),
      onDrop: (e) => {
        e.preventDefault();
        setDrag(false);
        readFiles(e.dataTransfer.files);
      },
      onClick: () => !busy && ref.current.click(),
      style: { border: `2px dashed ${drag ? ACCENT : BORDER}`, borderRadius: 10, padding: "24px 20px", cursor: "pointer", textAlign: "center", transition: "all .2s", background: drag ? `${ACCENT}08` : "transparent", marginBottom: 12 }
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, marginBottom: 6 } }, "\u{1F4C2}"),
    /* @__PURE__ */ React.createElement("div", { style: { color: "#888", fontSize: 12 } }, "Drop files here or click to browse"),
    /* @__PURE__ */ React.createElement("div", { style: { color: "#3A3A4A", fontSize: 11, marginTop: 3 } }, "Revel & Resova (CSV) \xB7 Xola (XLSX)")
  ), /* @__PURE__ */ React.createElement("input", { ref, type: "file", accept: ".csv,.xlsx,.xls", multiple: true, style: { display: "none" }, onChange: (e) => readFiles(e.target.files) }), files.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, files.map((f) => /* @__PURE__ */ React.createElement("div", { key: f.name, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: DARK, borderRadius: 8, marginBottom: 6, border: `1px solid ${typeColor(f.type)}33` } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, f.type === "xola" ? "\u{1F4CA}" : "\u{1F4C4}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { color: "#ccc", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, f.name), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 2, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: typeColor(f.type), letterSpacing: 1, textTransform: "uppercase" } }, typeLabel(f.type), f.type !== "xola" ? ` \xB7 ${f.rows.length} rows` : ""), f.city ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "#34D399" } }, "\u{1F4CD} ", f.city) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "#666" } }, "\u26A0 Store not detected \u2014 check filename"), f.dateFrom && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "#444" } }, f.dateFrom, " \u2192 ", f.dateTo || "?"))), f.type !== "xola" && /* @__PURE__ */ React.createElement("button", { onClick: () => setFiles((p) => p.map((x) => x.name === f.name ? __spreadProps(__spreadValues({}, x), { type: x.type === "revel" ? "resova" : "revel" }) : x)), style: { padding: "3px 8px", borderRadius: 5, background: "transparent", border: `1px solid ${BORDER}`, color: "#555", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" } }, "\u21C4"), /* @__PURE__ */ React.createElement("button", { onClick: () => setFiles((p) => p.filter((x) => x.name !== f.name)), style: { padding: "3px 8px", borderRadius: 5, background: "transparent", border: "1px solid #2A0A0A", color: "#ef4444", cursor: "pointer", fontSize: 10 } }, "\u2715")))), error && /* @__PURE__ */ React.createElement("div", { style: { color: "#ef4444", fontSize: 11, marginBottom: 12, padding: "9px 13px", background: "#140606", borderRadius: 6 } }, "\u26A0 ", error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, disabled: busy, style: { flex: 1, padding: "10px", borderRadius: 8, background: "transparent", border: `1px solid ${BORDER}`, color: "#555", fontFamily: "'DM Mono',monospace", fontSize: 11, cursor: "pointer" } }, "CANCEL"), /* @__PURE__ */ React.createElement("button", { onClick: upload, disabled: busy || !files.length, style: { flex: 2, padding: "10px", borderRadius: 8, background: busy || !files.length ? "#111" : ACCENT, border: "none", color: busy || !files.length ? "#333" : "#fff", fontFamily: "'DM Mono',monospace", fontSize: 11, cursor: busy ? "wait" : "pointer" } }, status === "loading" ? "FETCHING LATEST\u2026" : status === "processing" ? "PROCESSING\u2026" : status === "saving" ? "SAVING\u2026" : "ADD TO DASHBOARD \u2192"))));
}
function ManageModal({ sheetsUrl, data, onUpdate, onClose }) {
  var _a, _b, _c, _d;
  const [status, setStatus] = useState(null);
  const clearSource = async (src) => {
    if (!window.confirm(`Remove all ${src === "revel" ? "Revel" : "Resova"} data?`)) return;
    setStatus("saving");
    const nd = __spreadProps(__spreadValues({}, data), { [`${src}Rows`]: [], savedAt: (/* @__PURE__ */ new Date()).toISOString() });
    if (sheetsUrl) await saveToSheets(sheetsUrl, nd).catch(() => {
    });
    saveLocal(nd);
    onUpdate(nd);
    setStatus(null);
  };
  const clearAll = async () => {
    if (!window.confirm("Clear ALL data?")) return;
    setStatus("saving");
    const empty = { revelRows: [], resovaRows: [], savedAt: (/* @__PURE__ */ new Date()).toISOString(), isDemo: false };
    if (sheetsUrl) await saveToSheets(sheetsUrl, empty).catch(() => {
    });
    saveLocal(null);
    onUpdate(null);
    setStatus(null);
    onClose();
  };
  const rc = ((_a = data == null ? void 0 : data.revelRows) == null ? void 0 : _a.length) || 0, sc = ((_b = data == null ? void 0 : data.resovaRows) == null ? void 0 : _b.length) || 0;
  const rd = ((_c = data == null ? void 0 : data.revelRows) == null ? void 0 : _c.filter((r) => r.date).map((r) => r.date).sort()) || [];
  const sd = ((_d = data == null ? void 0 : data.resovaRows) == null ? void 0 : _d.filter((r) => r.date).map((r) => r.date).sort()) || [];
  return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16, fontFamily: "'DM Mono',monospace" } }, /* @__PURE__ */ React.createElement("div", { style: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 36, maxWidth: 460, width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Bebas Neue'", fontSize: 26, color: "#fff", marginBottom: 16 } }, "MANAGE DATA"), [["revel", "Revel Sales", rc, rd, ACCENT], [" resova", "Resova Sales", sc, sd, GOLD]].map(([src, lbl, count, dates, col]) => /* @__PURE__ */ React.createElement("div", { key: src, style: { background: DARK, border: `1px solid ${count ? col + "33" : BORDER}`, borderRadius: 10, padding: 14, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: count ? col : "#444", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 } }, count ? `\u2713 ${lbl}` : `\u25CB No ${lbl}`), count > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#444" } }, count, " rows \xB7 ", dates[0], " \u2192 ", dates[dates.length - 1])), count > 0 && /* @__PURE__ */ React.createElement("button", { onClick: () => clearSource(src.trim()), disabled: !!status, style: { padding: "5px 10px", borderRadius: 6, background: "transparent", border: "1px solid #2A0A0A", color: "#ef4444", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" } }, "CLEAR")))), /* @__PURE__ */ React.createElement("div", { style: { borderTop: `1px solid ${BORDER}`, paddingTop: 14, marginTop: 14, display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("button", { onClick: clearAll, disabled: !!status, style: { flex: 1, padding: "9px", borderRadius: 8, background: "transparent", border: "1px solid #2A0A0A", color: "#ef4444", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" } }, "CLEAR ALL"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    if (!window.confirm("Disconnect?")) return;
    saveUrl("");
    window.location.reload();
  }, style: { flex: 1, padding: "9px", borderRadius: 8, background: "transparent", border: `1px solid ${BORDER}`, color: "#555", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" } }, "DISCONNECT")), status && /* @__PURE__ */ React.createElement("div", { style: { color: "#888", fontSize: 11, marginTop: 10 } }, "Saving\u2026"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { width: "100%", padding: "10px", borderRadius: 8, background: "transparent", border: `1px solid ${BORDER}`, color: "#666", fontFamily: "'DM Mono',monospace", fontSize: 11, cursor: "pointer", marginTop: 12 } }, "CLOSE")));
}
function App() {
  var _a, _b;
  const [auth, setAuth] = useState(false);
  const sheetsUrl = SHEETS_URL;
  const [showSetup, setShowSetup] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState(null);
  const [brand, setBrand] = useState("teg");
  useEffect(() => {
    if (!auth) return;
    fetchData(SHEETS_URL);
  }, [auth]);
  const fetchData = async (url) => {
    setLoading(true);
    setLoadErr(null);
    try {
      const slim = await loadFromSheets(url);
      if (slim) {
        const d = expand(slim);
        setRawData(d);
      } else {
        setShowUpload(true);
      }
    } catch (e) {
      setLoadErr(e.message);
    }
    setLoading(false);
  };
  const tegData = useMemo(() => ({
    revelRows: ((rawData == null ? void 0 : rawData.revelRows) || []).filter((r) => (r.brand || getRowBrand(r.store, r.name)) === "teg"),
    resovaRows: ((rawData == null ? void 0 : rawData.resovaRows) || []).filter((r) => (r.brand || getRowBrand(r.store, r.item)) === "teg")
  }), [rawData]);
  const gbgsData = useMemo(() => ({
    revelRows: ((rawData == null ? void 0 : rawData.revelRows) || []).filter((r) => (r.brand || getRowBrand(r.store, r.name)) === "gbgs"),
    resovaRows: ((rawData == null ? void 0 : rawData.resovaRows) || []).filter((r) => (r.brand || getRowBrand(r.store, r.item)) === "gbgs")
  }), [rawData]);
  const amData = useMemo(() => ({
    revelRows: ((rawData == null ? void 0 : rawData.revelRows) || []).filter((r) => (r.brand || getRowBrand(r.store, r.name)) === "am"),
    resovaRows: ((rawData == null ? void 0 : rawData.resovaRows) || []).filter((r) => (r.brand || getRowBrand(r.store, r.item)) === "am")
  }), [rawData]);
  const tegStores = useMemo(() => [...new Set(tegData.revelRows.map((r) => r.store).filter(Boolean))], [tegData]);
  const gbgsStores = useMemo(() => [...new Set(gbgsData.revelRows.map((r) => r.store).filter(Boolean))], [gbgsData]);
  const amStores = useMemo(() => [...new Set(amData.revelRows.map((r) => r.store).filter(Boolean))], [amData]);
  const hasGBGS = gbgsData.revelRows.length > 0 || gbgsData.resovaRows.length > 0;
  const hasAM = amData.revelRows.length > 0 || amData.resovaRows.length > 0;
  if (!auth) return /* @__PURE__ */ React.createElement(PasswordGate, { onUnlock: () => setAuth(true) });
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: DARK, fontFamily: "'DM Mono',monospace", color: "#fff" } }, /* @__PURE__ */ React.createElement("style", null, `*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#222;border-radius:2px}tr:hover td{background:#13131F!important}input[type=month]{color-scheme:dark}`), showUpload && /* @__PURE__ */ React.createElement(UploadModal, { sheetsUrl, existingData: rawData, onSave: (d) => {
    setRawData(d);
    setShowUpload(false);
  }, onClose: () => setShowUpload(false) }), showManage && /* @__PURE__ */ React.createElement(ManageModal, { sheetsUrl, data: rawData, onUpdate: (d) => setRawData(d), onClose: () => setShowManage(false) }), /* @__PURE__ */ React.createElement("div", { style: { background: CARD, borderBottom: `1px solid ${BORDER}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, position: "sticky", top: 0, zIndex: 50 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 3, marginRight: 20 } }, /* @__PURE__ */ React.createElement("span", { style: { color: brand === "teg" ? ACCENT : "#555", cursor: "pointer" }, onClick: () => setBrand("teg") }, "TEG"), hasGBGS && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { color: "#333", margin: "0 8px" } }, "|"), /* @__PURE__ */ React.createElement("span", { style: { color: brand === "gbgs" ? GBGS_COL : "#555", cursor: "pointer" }, onClick: () => setBrand("gbgs") }, "GBGS")), hasAM && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { color: "#333", margin: "0 8px" } }, "|"), /* @__PURE__ */ React.createElement("span", { style: { color: brand === "am" ? AM_COL : "#555", cursor: "pointer" }, onClick: () => setBrand("am") }, "AM")), /* @__PURE__ */ React.createElement("span", { style: { color: "#333", marginLeft: 6, fontSize: 12, fontFamily: "'DM Mono',monospace", letterSpacing: 1 } }, " MERCH")), (rawData == null ? void 0 : rawData.isDemo) && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: GOLD, border: `1px solid ${GOLD}44`, padding: "2px 7px", borderRadius: 4 } }, "DEMO"), rawData && !rawData.isDemo && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "#34D399", border: "1px solid #34D39944", padding: "2px 7px", borderRadius: 4 } }, "\u25CF LIVE"), (rawData == null ? void 0 : rawData.savedAt) && !rawData.isDemo && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "#333", marginLeft: 8 } }, (((_a = rawData.revelRows) == null ? void 0 : _a.length) || 0) + (((_b = rawData.resovaRows) == null ? void 0 : _b.length) || 0), " rows")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, sheetsUrl && /* @__PURE__ */ React.createElement("button", { onClick: () => fetchData(sheetsUrl), disabled: loading, style: { padding: "5px 10px", borderRadius: 6, background: "transparent", border: `1px solid ${BORDER}`, color: "#555", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" } }, "\u21BB"), sheetsUrl && /* @__PURE__ */ React.createElement("button", { onClick: () => setShowManage(true), style: { padding: "5px 10px", borderRadius: 6, background: "transparent", border: `1px solid ${BORDER}`, color: "#555", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" } }, "\u2699"), /* @__PURE__ */ React.createElement("button", { onClick: () => sheetsUrl ? setShowUpload(true) : setShowSetup(true), style: { padding: "5px 14px", borderRadius: 6, background: brand === "gbgs" ? GBGS_COL : brand === "am" ? AM_COL : ACCENT, border: "none", color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 10, cursor: "pointer" } }, '"+ ADD DATA"'))), loading && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 58px)", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 30, height: 30, border: "3px solid #1A1A1A", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 1s linear infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#444" } }, "Loading\u2026")), !loading && loadErr && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 58px)", flexDirection: "column", gap: 14, padding: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#ef4444", textAlign: "center", maxWidth: 440, lineHeight: 1.6 } }, loadErr), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowSetup(true), style: { padding: "9px 18px", borderRadius: 8, background: "transparent", border: `1px solid ${BORDER}`, color: "#666", fontFamily: "'DM Mono',monospace", fontSize: 11, cursor: "pointer" } }, "RECONFIGURE"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setLoadErr(null);
    setRawData(mockData());
  }, style: { padding: "9px 18px", borderRadius: 8, background: ACCENT, border: "none", color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 11, cursor: "pointer" } }, "USE DEMO"))), !loading && !loadErr && !rawData && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 58px)", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Bebas Neue'", fontSize: 28, color: "#222" } }, "NO DATA YET"), /* @__PURE__ */ React.createElement("button", { onClick: () => sheetsUrl ? setShowUpload(true) : setShowSetup(true), style: { padding: "11px 26px", borderRadius: 8, background: ACCENT, border: "none", color: "#fff", fontFamily: "'DM Mono',monospace", fontSize: 12, cursor: "pointer" } }, sheetsUrl ? "ADD FIRST CSV" : "GET STARTED")), !loading && !loadErr && rawData && /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 24px" } }, brand === "teg" && /* @__PURE__ */ React.createElement(BrandDashboard, { data: tegData, accent: ACCENT, allStores: tegStores, label: "TEG" }), brand === "gbgs" && /* @__PURE__ */ React.createElement(BrandDashboard, { data: gbgsData, accent: GBGS_COL, allStores: gbgsStores, label: "GBGS" }), brand === "am" && /* @__PURE__ */ React.createElement(BrandDashboard, { data: amData, accent: AM_COL, allStores: amStores, label: "AM" })));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
