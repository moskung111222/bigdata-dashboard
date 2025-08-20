import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } from './config.js';
import { User } from './models.js';

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
  const existing = await User.findOne({ email: ADMIN_EMAIL }).exec();
  if (existing) return;
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({ email: ADMIN_EMAIL, password_hash: hash, role: 'admin' });
  console.log(`[seed] Created admin account: ${ADMIN_EMAIL}`);
}

export function sign(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}
