const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const { sendVerificationEmail } = require('../utils/email');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const password_hash = await bcrypt.hash(password, 10);
  const token = require('crypto').randomBytes(24).toString('hex');
  const is_student = email.endsWith('@uiowa.edu');

  const user = await prisma.user.create({ data: {
    email,
    username,
    password_hash,
    verification_token: token,
    is_student
  }});

  await sendVerificationEmail(email, token);
  res.json({ message: 'Registered. Check your email to verify.' });
});

router.post('/verify-email', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });
  const user = await prisma.user.findFirst({ where: { verification_token: token } });
  if (!user) return res.status(400).json({ error: 'Invalid token' });
  await prisma.user.update({ where: { id: user.id }, data: { is_verified: true, verification_token: null } });
  res.json({ message: 'Email verified. You can now post reviews.' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.is_verified) return res.status(403).json({ error: 'Email not verified' });

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;
