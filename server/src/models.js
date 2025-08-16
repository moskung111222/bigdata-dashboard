import { run } from './db.js';

export async function initSchema() {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS datasets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    source_type TEXT CHECK(source_type IN ('excel','google')) NOT NULL,
    file_path TEXT,
    google_sheet_id TEXT,
    public INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  await run(`CREATE TABLE IF NOT EXISTS dataset_tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id INTEGER NOT NULL,
    sheet_name TEXT NOT NULL,
    columns_json TEXT,
    row_count INTEGER,
    FOREIGN KEY(dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
  )`);

  await run(`CREATE TABLE IF NOT EXISTS charts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    chart_type TEXT CHECK(chart_type IN ('bar','line','pie')) NOT NULL,
    dataset_id INTEGER NOT NULL,
    sheet_name TEXT NOT NULL,
    config_json TEXT NOT NULL,
    public INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
  )`);
}
