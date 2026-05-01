const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'eldiez-jwt-secret-cambia-esto-en-produccion';

// ── Directorios ────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
const dbDir = path.join(__dirname, 'db');
[uploadsDir, dbDir].forEach((d) => { if (!fs.existsSync(d)) fs.mkdirSync(d); });

// ── Base de datos ──────────────────────────────────────────────────────────
const db = new Database(path.join(dbDir, 'eldiezdb.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    subtitle    TEXT,
    country     TEXT NOT NULL,
    type        TEXT NOT NULL,
    era         TEXT NOT NULL,
    version     TEXT NOT NULL,
    year        INTEGER NOT NULL,
    price       INTEGER NOT NULL,
    palette     TEXT NOT NULL,
    badge       TEXT,
    description TEXT,
    image       TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );
`);

// Admin por defecto: admin / eldiez2025
const adminExists = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('eldiez2025', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('Usuario admin creado — usuario: admin | contraseña: eldiez2025');
}

// ── Multer ─────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Solo se aceptan imágenes'));
  },
});

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname)));

function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function makeId(country, year) {
  return `${country.substring(0, 3).toUpperCase()}-${year}-${Date.now()}`.replace(/[^A-Z0-9-]/g, '');
}

// ── Auth ───────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: 'Faltan credenciales' });

  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: user.username });
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'Faltan datos' });
  if (newPassword.length < 6)
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

  const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password_hash))
    return res.status(401).json({ error: 'Contraseña actual incorrecta' });

  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hash, req.user.id);
  res.json({ ok: true });
});

// ── Productos — público ────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(rows.map((p) => ({ ...p, palette: JSON.parse(p.palette) })));
});

app.get('/api/products/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ ...p, palette: JSON.parse(p.palette) });
});

// ── Productos — protegidos ─────────────────────────────────────────────────
app.post('/api/products', requireAuth, (req, res) => {
  const { name, subtitle, country, type, era, version, year, price, palette, badge, description, image } = req.body;
  if (!name || !country || !type || !era || !version || !year || !price || !palette)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  const id = makeId(country, year);
  db.prepare(`
    INSERT INTO products (id, name, subtitle, country, type, era, version, year, price, palette, badge, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, subtitle || '', country, type, era, version, Number(year), Number(price),
         JSON.stringify(palette), badge || null, description || '', image || null);

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.status(201).json({ ...product, palette: JSON.parse(product.palette) });
});

app.put('/api/products/:id', requireAuth, (req, res) => {
  const { name, subtitle, country, type, era, version, year, price, palette, badge, description, image } = req.body;
  if (!name || !country || !type || !era || !version || !year || !price || !palette)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  const result = db.prepare(`
    UPDATE products SET name=?, subtitle=?, country=?, type=?, era=?, version=?, year=?, price=?, palette=?, badge=?, description=?, image=? WHERE id=?
  `).run(name, subtitle || '', country, type, era, version, Number(year), Number(price),
         JSON.stringify(palette), badge || null, description || '', image || null, req.params.id);

  if (result.changes === 0) return res.status(404).json({ error: 'Producto no encontrado' });
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json({ ...product, palette: JSON.parse(product.palette) });
});

app.delete('/api/products/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ ok: true });
});

// ── Upload de imágenes ─────────────────────────────────────────────────────
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ── Panel de admin ─────────────────────────────────────────────────────────
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// ── Arranque ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  El Diez Baires corriendo en http://localhost:${PORT}`);
  console.log(`  Panel admin:            http://localhost:${PORT}/admin`);
  console.log(`  Usuario admin:          admin`);
  console.log(`  Contraseña por defecto: eldiez2025\n`);
});
