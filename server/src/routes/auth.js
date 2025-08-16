import express from 'express';
import bcrypt from 'bcryptjs';
import { get } from '../db.js';
import { sign } from '../auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = sign(user);
  return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

export default router;
