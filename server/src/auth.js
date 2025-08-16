import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } from './config.js';
import { get, run } from './db.js';

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function seedAdmin() {
  const existing = await get('SELECT * FROM users WHERE email = ?', [ADMIN_EMAIL]);
  if (existing) return;
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await run('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [ADMIN_EMAIL, hash, 'admin']);
  console.log(`[seed] Created admin account: ${ADMIN_EMAIL}`);
}

export function sign(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}
