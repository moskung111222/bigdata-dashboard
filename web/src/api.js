// File CRUD
export async function listFiles() {
  const res = await fetch('/api/files');
  return res.json();
}

export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/files', { method: 'POST', body: form });
  return res.json();
}

export async function deleteFile(filename) {
  const res = await fetch(`/api/files/${encodeURIComponent(filename)}`, { method: 'DELETE' });
  return res.json();
}

export async function updateFile(filename, file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`/api/files/${encodeURIComponent(filename)}`, { method: 'PUT', body: form });
  return res.json();
}

export function getFileUrl(filename) {
  return `/api/files/${encodeURIComponent(filename)}`;
}

// Style settings
export async function getStyles() {
  const res = await fetch('/api/styles');
  return res.json();
}

export async function saveStyles(styles) {
  const res = await fetch('/api/styles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(styles)
  });
  return res.json();
}

// Datasets
export async function listDatasets(q = '', admin = false) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (admin) params.set('admin', '1');
  const res = await fetch('/api/datasets?' + params.toString());
  return res.json();
}

export async function getDataset(id) {
  const res = await fetch('/api/datasets/' + id);
  return res.json();
}

export async function downloadDataset(id) {
  return '/api/datasets/' + id + '/download';
}

// Charts
export async function listPublicCharts() {
  const res = await fetch('/api/charts/public');
  return res.json();
}
import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE + '/api',
})

export function authHeaders(token) {
  return { headers: { Authorization: `Bearer ${token}` } }
}
