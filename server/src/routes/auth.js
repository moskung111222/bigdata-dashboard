import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models.js';
import { sign } from '../auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = sign(user);
  return res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
});

export default router;
