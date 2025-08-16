import xlsx from 'xlsx';

export function readWorkbookMeta(filePath) {
  const wb = xlsx.readFile(filePath, { cellDates: true });
  const sheetNames = wb.SheetNames;
  const tables = [];
  for (const name of sheetNames) {
    const ws = wb.Sheets[name];
    const json = xlsx.utils.sheet_to_json(ws, { defval: null });
    const first = json[0] || {};
    const columns = Object.keys(first);
    tables.push({
      sheet_name: name,
      columns,
      row_count: json.length,
    });
  }
  return { sheetNames, tables };
}

export function readSheetRows(filePath, sheetName, limit=200, offset=0) {
  const wb = xlsx.readFile(filePath, { cellDates: true });
  const ws = wb.Sheets[sheetName];
  if (!ws) return { rows: [], total: 0 };
  const json = xlsx.utils.sheet_to_json(ws, { defval: null });
  const total = json.length;
  const rows = json.slice(offset, offset + limit);
  return { rows, total };
}
