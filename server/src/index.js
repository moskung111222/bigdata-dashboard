import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT, CLIENT_ORIGIN } from './config.js';
import { initSchema } from './models.js';
import { seedAdmin } from './auth.js';
import authRoutes from './routes/auth.js';
import datasetRoutes from './routes/datasets.js';
import googleRoutes from './routes/google.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// Static for file downloads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', datasetRoutes);
app.use('/api', googleRoutes);

app.get('/', (_, res) => res.json({ ok: true, service: 'bigdata-dashboard-server' }));

app.listen(PORT, async () => {
  await initSchema();
  await seedAdmin();
  console.log(`API running on http://localhost:${PORT}`);
});
