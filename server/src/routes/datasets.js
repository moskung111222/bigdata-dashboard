import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { all, get, run } from '../db.js';
import { authRequired } from '../auth.js';
import { readWorkbookMeta, readSheetRows } from '../utils/excel.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'src', '..', 'uploads');
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^\w\.-]+/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

router.get('/datasets', async (req, res) => {
  const admin = req.query.admin === '1';
  const rows = admin
    ? await all('SELECT * FROM datasets ORDER BY id DESC')
    : await all('SELECT * FROM datasets WHERE public = 1 ORDER BY id DESC');
  res.json(rows);
});

router.get('/datasets/:id/tables', async (req, res) => {
  const id = req.params.id;
  const ds = await get('SELECT * FROM datasets WHERE id = ?', [id]);
  if (!ds) return res.status(404).json({ error: 'Not found' });
  const tables = await all('SELECT * FROM dataset_tables WHERE dataset_id = ?', [id]);
  res.json({ dataset: ds, tables });
});

router.get('/datasets/:id/data', async (req, res) => {
  const id = req.params.id;
  const sheet = req.query.sheet;
  const limit = Math.max(1, Math.min(parseInt(req.query.limit || '200'), 1000));
  const offset = Math.max(0, parseInt(req.query.offset || '0'));
  const ds = await get('SELECT * FROM datasets WHERE id = ?', [id]);
  if (!ds) return res.status(404).json({ error: 'Not found' });
  const { rows, total } = readSheetRows(ds.file_path, sheet, limit, offset);
  res.json({ rows, total, limit, offset });
});

router.get('/datasets/:id/download', async (req, res) => {
  const id = req.params.id;
  const ds = await get('SELECT * FROM datasets WHERE id = ?', [id]);
  if (!ds || !fs.existsSync(ds.file_path)) return res.status(404).json({ error: 'File not found' });
  res.download(ds.file_path, path.basename(ds.file_path));
});

router.post('/datasets/upload', authRequired, upload.single('file'), async (req, res) => {
  const filePath = req.file.path.replace(/\\/g, '/');
  const name = req.body.name || req.file.originalname;
  const meta = readWorkbookMeta(filePath);
  const slug = name.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
  const result = await run(
    'INSERT INTO datasets (name, slug, source_type, file_path, public) VALUES (?,?,?,?,1)',
    [name, slug, 'excel', filePath]
  );
  const datasetId = result.lastID;
  for (const t of meta.tables) {
    await run('INSERT INTO dataset_tables (dataset_id, sheet_name, columns_json, row_count) VALUES (?,?,?,?)',
      [datasetId, t.sheet_name, JSON.stringify(t.columns), t.row_count]);
  }
  res.json({ id: datasetId, name, slug, tables: meta.tables });
});

router.post('/charts', authRequired, async (req, res) => {
  const { title, chart_type, dataset_id, sheet_name, config } = req.body;
  if (!title || !chart_type || !dataset_id || !sheet_name || !config) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const result = await run(
    'INSERT INTO charts (title, chart_type, dataset_id, sheet_name, config_json, public, sort_order) VALUES (?,?,?,?,?, ?, ?)',
    [title, chart_type, dataset_id, sheet_name, JSON.stringify(config), config.public ? 1 : 0, Number(config.sort_order || 0)]
  );
  res.json({ id: result.lastID });
});

router.get('/charts', authRequired, async (req, res) => {
  const rows = await all(`SELECT c.*, d.name as dataset_name
                          FROM charts c JOIN datasets d ON d.id = c.dataset_id
                          ORDER BY c.sort_order ASC, c.id DESC`);
  res.json(rows);
});

router.get('/charts/public', async (req, res) => {
  const rows = await all(`SELECT c.*, d.name as dataset_name, d.file_path
                          FROM charts c JOIN datasets d ON d.id = c.dataset_id
                          WHERE c.public = 1
                          ORDER BY c.sort_order ASC, c.id DESC`);
  res.json(rows);
});

router.put('/charts/:id', authRequired, async (req, res) => {
  const id = req.params.id;
  const { title, chart_type, config, public: isPublic, sort_order } = req.body;
  const row = await get('SELECT * FROM charts WHERE id = ?', [id]);
  if (!row) return res.status(404).json({ error: 'Not found' });
  await run('UPDATE charts SET title=?, chart_type=?, config_json=?, public=?, sort_order=? WHERE id=?',
    [title || row.title,
     chart_type || row.chart_type,
     JSON.stringify(config || JSON.parse(row.config_json)),
     typeof isPublic === 'number' ? isPublic : row.public,
     typeof sort_order === 'number' ? sort_order : row.sort_order,
     id]);
  res.json({ ok: true });
});

export default router;
