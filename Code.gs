// TEG/GBGS/AM Merch Dashboard — Google Apps Script Backend
// Deploy as Web App: Execute as Me, Who has access: Anyone

const SHEET_NAME_DATA    = "DashboardData";
const SHEET_NAME_REVEL   = "Revel Sales";
const SHEET_NAME_RESOVA  = "Resova Sales";

function doGet(e) {
  try {
    // Strip any double-encoded action params
    let action = e.parameter.action || "";
    if (action.includes("?")) action = action.split("?")[0];

    if (action === "ping")    return jsonResponse({ ok: true, message: "Connected!", ts: new Date().toISOString() });
    if (action === "load")    return handleLoad();
    if (action === "saveAll") return handleSaveAll(e.parameter.payload);
    if (action === "append")  return handleAppend(e.parameter.payload);
    if (action === "clear")   return handleClear(e.parameter.which || "all");

    return jsonResponse({ ok: false, error: "Unknown action: " + action });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// ─── Load ───────────────────────────────────────────────────────────────────
function handleLoad() {
  const sheet = getOrCreateSheet(SHEET_NAME_DATA);
  const cell = sheet.getRange("A1").getValue();
  if (!cell) return jsonResponse({ ok: true, data: null });
  try {
    const data = JSON.parse(cell);
    return jsonResponse({ ok: true, data });
  } catch(e) {
    return jsonResponse({ ok: false, error: "Could not parse saved data: " + e.toString() });
  }
}

// ─── Save All (replaces everything) ─────────────────────────────────────────
function handleSaveAll(payload) {
  if (!payload) return jsonResponse({ ok: false, error: "No payload" });
  const decoded = decodeURIComponent(payload);
  const parsed = JSON.parse(decoded);
  const rows = parsed.rows || [];
  const savedAt = new Date().toISOString();
  const data = { rows, savedAt };

  // Save compressed blob
  const sheet = getOrCreateSheet(SHEET_NAME_DATA);
  sheet.getRange("A1").setValue(JSON.stringify(data));

  // Write readable sheets
  writeReadableSheets(rows);

  return jsonResponse({ ok: true, savedAt });
}

// ─── Append (adds new rows to existing) ──────────────────────────────────────
function handleAppend(payload) {
  if (!payload) return jsonResponse({ ok: false, error: "No payload" });
  const decoded = decodeURIComponent(payload);
  const parsed = JSON.parse(decoded);
  const newRows = parsed.rows || [];

  // Load existing
  const sheet = getOrCreateSheet(SHEET_NAME_DATA);
  const cell = sheet.getRange("A1").getValue();
  let existing = [];
  if (cell) {
    try { existing = JSON.parse(cell).rows || []; } catch(e) {}
  }

  const allRows = [...existing, ...newRows];
  const savedAt = new Date().toISOString();
  const data = { rows: allRows, savedAt };

  sheet.getRange("A1").setValue(JSON.stringify(data));
  writeReadableSheets(allRows);

  return jsonResponse({ ok: true, savedAt, total: allRows.length });
}

// ─── Clear ───────────────────────────────────────────────────────────────────
function handleClear(which) {
  const sheet = getOrCreateSheet(SHEET_NAME_DATA);
  let cell = sheet.getRange("A1").getValue();
  let data = { rows: [], savedAt: new Date().toISOString() };

  if (cell && which !== "all") {
    try {
      const existing = JSON.parse(cell);
      let rows = existing.rows || [];
      if (which === "revel")  rows = rows.filter(r => r[0] !== "revel");
      if (which === "resova") rows = rows.filter(r => r[0] !== "resova");
      data = { rows, savedAt: new Date().toISOString() };
    } catch(e) {}
  }

  sheet.getRange("A1").setValue(JSON.stringify(data));
  writeReadableSheets(data.rows);
  return jsonResponse({ ok: true, cleared: which });
}

// ─── Write human-readable sheets ─────────────────────────────────────────────
function writeReadableSheets(slimRows) {
  // Expand slim format: [src, brand, name, category, qty, total, date, store, uploaded_at]
  const revelRows  = slimRows.filter(r => r[0] === "revel");
  const resovaRows = slimRows.filter(r => r[0] === "resova");

  // Revel Sales sheet
  const revelSheet = getOrCreateSheet(SHEET_NAME_REVEL);
  revelSheet.clearContents();
  const revelHeaders = [["Source","Brand","Product","Category","Quantity","Revenue","Date","Store","Uploaded At"]];
  revelSheet.getRange(1, 1, 1, 9).setValues(revelHeaders);
  if (revelRows.length > 0) {
    revelSheet.getRange(2, 1, revelRows.length, 9).setValues(revelRows);
  }

  // Resova Sales sheet
  const resovaSheet = getOrCreateSheet(SHEET_NAME_RESOVA);
  resovaSheet.clearContents();
  const resovaHeaders = [["Source","Brand","Item","Category","Quantity","Revenue","Date","Store","Uploaded At"]];
  resovaSheet.getRange(1, 1, 1, 9).setValues(resovaHeaders);
  if (resovaRows.length > 0) {
    resovaSheet.getRange(2, 1, resovaRows.length, 9).setValues(resovaRows);
  }
}

// ─── JSON response helper ────────────────────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
