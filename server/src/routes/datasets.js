import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Dataset, Chart } from '../models.js';
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



const DATA_DIR = path.join(__dirname, '../../../demo_data');
const STYLE_FILE = path.join(__dirname, '../../styles.json');

// List datasets (with optional search)
router.get('/datasets', async (req, res) => {
  const q = req.query.q || null;
  const admin = req.query.admin === '1';
  const filter = {};
  if (!admin) filter.public = true;
  if (q) filter.$or = [ { name: new RegExp(q, 'i') }, { slug: new RegExp(q, 'i') } ];
  const rows = await Dataset.find(filter).sort({ createdAt: -1 }).lean().exec();
  res.json(rows);
});

// List files
router.get('/files', (req, res) => {
  fs.readdir(DATA_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(files);
  });
});

// Get file content (as download or preview)
router.get('/files/:filename', (req, res) => {
  const filePath = path.join(DATA_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.sendFile(filePath);
});

// Upload file
router.post('/files', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const dest = path.join(DATA_DIR, req.file.originalname);
  fs.rename(req.file.path, dest, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, filename: req.file.originalname });
  });
});

// Delete file
router.delete('/files/:filename', (req, res) => {
  const filePath = path.join(DATA_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  fs.unlink(filePath, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Update file (replace)
router.put('/files/:filename', upload.single('file'), (req, res) => {
  const filePath = path.join(DATA_DIR, req.params.filename);
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  fs.rename(req.file.path, filePath, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Get style settings
router.get('/styles', (req, res) => {
  if (!fs.existsSync(STYLE_FILE)) return res.json({});
  res.json(JSON.parse(fs.readFileSync(STYLE_FILE, 'utf8')));
});

// Update style settings
router.post('/styles', (req, res) => {
  fs.writeFileSync(STYLE_FILE, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

router.get('/datasets/:id/tables', async (req, res) => {
  const id = req.params.id;
  const ds = await Dataset.findById(id).lean().exec();
  if (!ds) return res.status(404).json({ error: 'Not found' });
  res.json({ dataset: ds, tables: ds.tables || [] });
});

router.get('/datasets/:id/data', async (req, res) => {
  const id = req.params.id;
  const sheet = req.query.sheet;
  const limit = Math.max(1, Math.min(parseInt(req.query.limit || '200'), 1000));
  const offset = Math.max(0, parseInt(req.query.offset || '0'));
  const ds = await Dataset.findById(id).lean().exec();
  if (!ds) return res.status(404).json({ error: 'Not found' });
  const { rows, total } = readSheetRows(ds.file_path, sheet, limit, offset);
  res.json({ rows, total, limit, offset });
});

router.get('/datasets/:id/download', async (req, res) => {
  const id = req.params.id;
  const ds = await Dataset.findById(id).lean().exec();
  if (!ds || !fs.existsSync(ds.file_path)) return res.status(404).json({ error: 'File not found' });
  res.download(ds.file_path, path.basename(ds.file_path));
});

router.post('/datasets/upload', authRequired, upload.single('file'), async (req, res) => {
  const filePath = req.file.path.replace(/\\/g, '/');
  const name = req.body.name || req.file.originalname;
  const meta = readWorkbookMeta(filePath);
  const slug = name.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
  const doc = await Dataset.create({ name, slug, source_type: 'excel', file_path: filePath, public: true, tables: meta.tables.map(t => ({ sheet_name: t.sheet_name, columns_json: t.columns, row_count: t.row_count })) });
  res.json({ id: doc._id, name, slug, tables: meta.tables });
});

router.post('/charts', authRequired, async (req, res) => {
  const { title, chart_type, dataset_id, sheet_name, config } = req.body;
  if (!title || !chart_type || !dataset_id || !sheet_name || !config) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const doc = await Chart.create({ title, chart_type, dataset_id, sheet_name, config_json: config, public: !!config.public, sort_order: Number(config.sort_order || 0) });
  res.json({ id: doc._id });
});

router.get('/charts', authRequired, async (req, res) => {
  const rows = await Chart.find().sort({ sort_order: 1, createdAt: -1 }).populate('dataset_id', 'name').lean().exec();
  res.json(rows.map(r => ({ ...r, dataset_name: r.dataset_id ? r.dataset_id.name : null })));
});

router.get('/charts/public', async (req, res) => {
  const rows = await Chart.find({ public: true }).sort({ sort_order: 1, createdAt: -1 }).populate('dataset_id', 'name file_path').lean().exec();
  res.json(rows.map(r => ({ ...r, dataset_name: r.dataset_id ? r.dataset_id.name : null, file_path: r.dataset_id ? r.dataset_id.file_path : null })));
});

router.put('/charts/:id', authRequired, async (req, res) => {
  const id = req.params.id;
  const { title, chart_type, config, public: isPublic, sort_order } = req.body;
  const row = await Chart.findById(id).exec();
  if (!row) return res.status(404).json({ error: 'Not found' });
  row.title = title || row.title;
  row.chart_type = chart_type || row.chart_type;
  row.config_json = config || row.config_json;
  row.public = typeof isPublic === 'boolean' ? isPublic : row.public;
  row.sort_order = typeof sort_order === 'number' ? sort_order : row.sort_order;
  await row.save();
  res.json({ ok: true });
});

export default router;
