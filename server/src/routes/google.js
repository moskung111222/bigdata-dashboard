import express from 'express';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { authRequired } from '../auth.js';
import { run } from '../db.js';
import { readSheetWithServiceAccount } from '../utils/sheets.js';
import { GOOGLE_APPLICATION_CREDENTIALS } from '../config.js';

const router = express.Router();

router.post('/google/import', authRequired, async (req, res) => {
  try {
    const { name, sheetId, range } = req.body;
    if (!name || !sheetId) return res.status(400).json({ error: 'name and sheetId required' });

    const values = await readSheetWithServiceAccount(sheetId, range, GOOGLE_APPLICATION_CREDENTIALS);
    if (values.length === 0) return res.status(400).json({ error: 'No data returned from Sheet' });
    // Convert values -> worksheet
    const headers = values[0];
    const rows = values.slice(1).map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h || `col_${i+1}`] = r[i] ?? null);
      return obj;
    });
    const ws = xlsx.utils.json_to_sheet(rows, { header: headers });
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    const uploadDir = path.join(process.cwd(), 'src', '..', 'uploads');
    const safeName = Date.now() + '-' + name.replace(/[^\w\.-]+/g, '_') + '.xlsx';
    const filePath = path.join(uploadDir, safeName);
    xlsx.writeFile(wb, filePath);

    const slug = name.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
    const result = await run(
      'INSERT INTO datasets (name, slug, source_type, file_path, google_sheet_id, public) VALUES (?,?,?,?,?,1)',
      [name, slug, 'google', filePath, sheetId]
    );
    const datasetId = result.lastID;

    // Only one table (Sheet1) here
    await run('INSERT INTO dataset_tables (dataset_id, sheet_name, columns_json, row_count) VALUES (?,?,?,?)',
      [datasetId, 'Sheet1', JSON.stringify(headers), rows.length]);

    res.json({ id: datasetId, name, slug, sheetId, range: range || 'A1:Z10000', rowsImported: rows.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
