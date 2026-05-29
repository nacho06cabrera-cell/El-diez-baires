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
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY || '';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ── Directorios ──────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
const dbDir = path.join(__dirname, 'db');
[uploadsDir, dbDir].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// ── Base de datos ────────────────────────────────────────────────────────────
const db = new Database(path.join(dbDir, 'eldiezdb.sqlite'));
db.pragma('journal_mode = WAL');

function hasColumn(table, column) {
  try {
    return db.pragma(`table_info(${table})`).some(c => c.name === column);
  } catch { return false; }
}

function tableExists(name) {
  return !!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name);
}

// Migración: si la tabla products existe sin el campo 'liga', la recreamos
if (tableExists('products') && !hasColumn('products', 'liga')) {
  db.exec('DROP TABLE IF EXISTS products;');
}

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    subtitle     TEXT DEFAULT '',
    liga         TEXT NOT NULL DEFAULT '',
    equipo       TEXT NOT NULL DEFAULT '',
    jersey_type  TEXT NOT NULL DEFAULT 'fan',
    version      TEXT NOT NULL DEFAULT 'Local',
    year         INTEGER NOT NULL DEFAULT 2024,
    price        INTEGER NOT NULL,
    sizes        TEXT NOT NULL DEFAULT '["S","M","L","XL","2XL","3XL","4XL"]',
    customizable INTEGER DEFAULT 1,
    palette      TEXT NOT NULL DEFAULT '["#FFFFFF","#74ACDF"]',
    badge        TEXT,
    description  TEXT DEFAULT '',
    image        TEXT,
    active       INTEGER DEFAULT 1,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id               TEXT PRIMARY KEY,
    number           INTEGER,
    customer_name    TEXT NOT NULL,
    customer_email   TEXT NOT NULL,
    customer_phone   TEXT DEFAULT '',
    customer_address TEXT DEFAULT '',
    customer_city    TEXT DEFAULT '',
    items            TEXT NOT NULL,
    subtotal         INTEGER NOT NULL,
    shipping         INTEGER NOT NULL DEFAULT 0,
    total            INTEGER NOT NULL,
    payment_method   TEXT NOT NULL,
    payment_status   TEXT NOT NULL DEFAULT 'pending',
    mp_preference_id TEXT,
    mp_payment_id    TEXT,
    status           TEXT NOT NULL DEFAULT 'new',
    notes            TEXT DEFAULT '',
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    category   TEXT DEFAULT 'General',
    sort_order INTEGER DEFAULT 0,
    active     INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT DEFAULT '',
    subject    TEXT DEFAULT '',
    message    TEXT NOT NULL,
    read       INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  );
`);

// ── Defaults de configuración ────────────────────────────────────────────────
const defaultSettings = {
  bank_name: 'Banco Nación Argentina',
  bank_account: '',
  bank_cbu: '',
  bank_alias: '',
  bank_owner: 'El Diez Baires',
  store_phone: '',
  store_email: 'contacto@eldiezbaires.com',
  store_instagram: '@eldiezbaires',
  store_whatsapp: '',
  shipping_price: '5000',
  free_shipping_threshold: '100000',
  installments: '3,6,12',
  mp_public_key: MP_PUBLIC_KEY,
};
const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [key, value] of Object.entries(defaultSettings)) insertSetting.run(key, value);

// ── FAQs por defecto ─────────────────────────────────────────────────────────
const faqCount = db.prepare('SELECT COUNT(*) as n FROM faqs').get().n;
if (faqCount === 0) {
  const insertFaq = db.prepare('INSERT INTO faqs (question, answer, category, sort_order) VALUES (?, ?, ?, ?)');
  [
    ['¿Cuáles son los métodos de pago disponibles?', 'Aceptamos transferencia bancaria y tarjeta de crédito a través de Mercado Pago. Con tarjeta podés pagar en hasta 12 cuotas sin interés.', 'Pagos', 1],
    ['¿Hay cuotas sin interés?', 'Sí. Con tarjeta de crédito a través de Mercado Pago ofrecemos 3, 6 y 12 cuotas sin interés. Las cuotas se procesan directamente con tu banco.', 'Pagos', 2],
    ['¿Cuánto demora el envío?', 'A CABA y GBA: 2 a 4 días hábiles. Al interior del país: 5 a 10 días hábiles. Hacemos envíos a todo el territorio argentino.', 'Envíos', 3],
    ['¿Cuánto cuesta el envío?', 'El envío tiene un costo fijo de $5.000 a cualquier punto del país. Los pedidos superiores a $100.000 tienen envío gratis.', 'Envíos', 4],
    ['¿Cómo funciona la personalización?', 'Podés agregar nombre y número a cualquier camiseta por $5.000 adicionales. También ofrecemos parches opcionales (Champions, Copa América, etc.) a $2.000 cada uno. Todo se elige al agregar el producto al carrito.', 'Producto', 5],
    ['¿Qué talles manejan?', 'Contamos con talles S, M, L, XL, 2XL, 3XL y 4XL. No todos los productos tienen todos los talles disponibles, lo podés ver en cada producto.', 'Producto', 6],
    ['¿Las camisetas son originales?', 'Todas nuestras camisetas son réplicas premium de alta calidad. No vendemos productos con etiquetas falsas de marcas originales. La calidad de la tela y los detalles es excelente.', 'Producto', 7],
    ['¿Puedo devolver o cambiar una camiseta?', 'Sí. Tenés 30 días desde la recepción para devolver o cambiar si el producto está sin usar y con etiquetas. Las camisetas personalizadas no tienen cambio ni devolución.', 'Devoluciones', 8],
    ['¿Cómo sigo el estado de mi pedido?', 'Te enviamos un email con el número de seguimiento cuando el pedido sale de nuestro depósito. También podés escribirnos por Instagram o WhatsApp para consultar el estado.', 'Pedidos', 9],
    ['¿Tienen local físico?', 'Por ahora somos 100% online, desde Buenos Aires. Seguinos en Instagram @eldiezbaires para enterarte cuando abramos un showroom.', 'General', 10],
  ].forEach(f => insertFaq.run(...f));
}

// ── Admin por defecto ────────────────────────────────────────────────────────
if (!db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin')) {
  const hash = bcrypt.hashSync('eldiez2025', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('Admin creado — usuario: admin | contraseña: eldiez2025');
}

// ── Multer ───────────────────────────────────────────────────────────────────
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

// Multer para logo
const logoStorage = multer.diskStorage({
  destination: path.join(__dirname, 'images'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `logo${ext}`);
  },
});
const uploadLogo = multer({ storage: logoStorage, limits: { fileSize: 2 * 1024 * 1024 } });

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname)));

function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Token inválido o expirado' }); }
}

function tryParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

function parseProduct(p) {
  return {
    ...p,
    palette: tryParse(p.palette, ['#FFFFFF', '#74ACDF']),
    sizes: tryParse(p.sizes, ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']),
    customizable: Boolean(p.customizable),
    active: Boolean(p.active),
  };
}

function makeOrderId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${date}-${rand}`;
}

function makeProductId(equipo, year) {
  const clean = (equipo || 'PROD').substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X');
  return `${clean}-${year}-${Date.now()}`;
}

function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const s = {};
  rows.forEach(r => { s[r.key] = r.value; });
  return s;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Faltan credenciales' });
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: user.username });
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Faltan datos' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Mínimo 6 caracteres' });
  const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password_hash))
    return res.status(401).json({ error: 'Contraseña actual incorrecta' });
  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hash, req.user.id);
  res.json({ ok: true });
});

// ── Productos — público ──────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  const rows = db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC').all();
  res.json(rows.map(parseProduct));
});

app.get('/api/products/all', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(rows.map(parseProduct));
});

app.get('/api/products/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(parseProduct(p));
});

// ── Productos — admin ────────────────────────────────────────────────────────
app.post('/api/products', requireAuth, (req, res) => {
  const { name, subtitle, liga, equipo, jersey_type, version, year, price, sizes, customizable, palette, badge, description, image, active } = req.body;
  if (!name || !liga || !equipo || !jersey_type || !year || !price || !palette)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  const id = makeProductId(equipo, year);
  db.prepare(`
    INSERT INTO products (id,name,subtitle,liga,equipo,jersey_type,version,year,price,sizes,customizable,palette,badge,description,image,active)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(id, name, subtitle||'', liga, equipo, jersey_type, version||'Local', Number(year), Number(price),
         JSON.stringify(sizes||['S','M','L','XL','2XL','3XL','4XL']),
         customizable!==false?1:0, JSON.stringify(palette),
         badge||null, description||'', image||null, active!==false?1:0);

  res.status(201).json(parseProduct(db.prepare('SELECT * FROM products WHERE id=?').get(id)));
});

app.put('/api/products/:id', requireAuth, (req, res) => {
  const { name, subtitle, liga, equipo, jersey_type, version, year, price, sizes, customizable, palette, badge, description, image, active } = req.body;
  if (!name || !liga || !equipo || !jersey_type || !year || !price || !palette)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  const r = db.prepare(`
    UPDATE products SET name=?,subtitle=?,liga=?,equipo=?,jersey_type=?,version=?,year=?,price=?,sizes=?,customizable=?,palette=?,badge=?,description=?,image=?,active=? WHERE id=?
  `).run(name, subtitle||'', liga, equipo, jersey_type, version||'Local', Number(year), Number(price),
         JSON.stringify(sizes||['S','M','L','XL','2XL','3XL','4XL']),
         customizable!==false?1:0, JSON.stringify(palette),
         badge||null, description||'', image||null, active!==false?1:0, req.params.id);

  if (r.changes === 0) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(parseProduct(db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id)));
});

app.delete('/api/products/:id', requireAuth, (req, res) => {
  const r = db.prepare('DELETE FROM products WHERE id=?').run(req.params.id);
  if (r.changes === 0) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ ok: true });
});

// ── Upload ────────────────────────────────────────────────────────────────────
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.post('/api/upload/logo', requireAuth, uploadLogo.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });
  res.json({ url: `/images/${req.file.filename}` });
});

// ── FAQs ──────────────────────────────────────────────────────────────────────
app.get('/api/faqs', (req, res) => {
  res.json(db.prepare('SELECT * FROM faqs WHERE active=1 ORDER BY sort_order,id').all());
});

app.get('/api/faqs/all', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM faqs ORDER BY sort_order,id').all());
});

app.post('/api/faqs', requireAuth, (req, res) => {
  const { question, answer, category, sort_order, active } = req.body;
  if (!question || !answer) return res.status(400).json({ error: 'Pregunta y respuesta requeridas' });
  const r = db.prepare('INSERT INTO faqs (question,answer,category,sort_order,active) VALUES (?,?,?,?,?)')
    .run(question, answer, category||'General', Number(sort_order||0), active!==false?1:0);
  res.status(201).json(db.prepare('SELECT * FROM faqs WHERE id=?').get(r.lastInsertRowid));
});

app.put('/api/faqs/:id', requireAuth, (req, res) => {
  const { question, answer, category, sort_order, active } = req.body;
  if (!question || !answer) return res.status(400).json({ error: 'Pregunta y respuesta requeridas' });
  const r = db.prepare('UPDATE faqs SET question=?,answer=?,category=?,sort_order=?,active=? WHERE id=?')
    .run(question, answer, category||'General', Number(sort_order||0), active!==false?1:0, req.params.id);
  if (r.changes===0) return res.status(404).json({ error: 'FAQ no encontrado' });
  res.json(db.prepare('SELECT * FROM faqs WHERE id=?').get(req.params.id));
});

app.delete('/api/faqs/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM faqs WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── Contacto ──────────────────────────────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email inválido' });
  db.prepare('INSERT INTO contacts (name,email,phone,subject,message) VALUES (?,?,?,?,?)')
    .run(name.trim(), email.trim(), (phone||'').trim(), (subject||'').trim(), message.trim());
  res.json({ ok: true });
});

app.get('/api/contacts', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all());
});

app.put('/api/contacts/:id/read', requireAuth, (req, res) => {
  db.prepare('UPDATE contacts SET read=? WHERE id=?').run(req.body.read?1:0, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/contacts/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ── Configuración ─────────────────────────────────────────────────────────────
app.get('/api/settings', (req, res) => res.json(getSettings()));

app.put('/api/settings', requireAuth, (req, res) => {
  const upd = db.prepare('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)');
  const tx = db.transaction(obj => { for (const [k,v] of Object.entries(obj)) upd.run(k, String(v??'')); });
  tx(req.body);
  res.json({ ok: true });
});

// ── Pedidos ───────────────────────────────────────────────────────────────────
app.get('/api/orders', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(rows.map(o => ({ ...o, items: tryParse(o.items, []) })));
});

app.get('/api/orders/:id', (req, res) => {
  const o = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  if (!o) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json({ ...o, items: tryParse(o.items, []) });
});

app.put('/api/orders/:id', requireAuth, (req, res) => {
  const { status, payment_status, notes } = req.body;
  db.prepare('UPDATE orders SET status=?,payment_status=?,notes=? WHERE id=?')
    .run(status, payment_status, notes||'', req.params.id);
  res.json({ ok: true });
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, payment_method } = req.body;
    if (!customer?.name || !customer?.email || !items?.length || !payment_method)
      return res.status(400).json({ error: 'Faltan datos del pedido' });

    const settings = getSettings();
    const shippingPrice = Number(settings.shipping_price || 5000);
    const freeShipping = Number(settings.free_shipping_threshold || 100000);

    const subtotal = items.reduce((s, it) => s + (it.unit_price || 0) * (it.qty || 1), 0);
    const shipping = subtotal >= freeShipping ? 0 : shippingPrice;
    const total = subtotal + shipping;

    const id = makeOrderId();
    const orderNumber = (db.prepare('SELECT MAX(number) as mx FROM orders').get().mx || 0) + 1;

    db.prepare(`
      INSERT INTO orders (id,number,customer_name,customer_email,customer_phone,customer_address,customer_city,items,subtotal,shipping,total,payment_method,status,payment_status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'new','pending')
    `).run(id, orderNumber, customer.name, customer.email, customer.phone||'',
           customer.address||'', customer.city||'', JSON.stringify(items),
           subtotal, shipping, total, payment_method);

    let mpData = null;
    const accessToken = MP_ACCESS_TOKEN || settings.mp_access_token || '';

    if (payment_method === 'card' && accessToken) {
      try {
        const { MercadoPagoConfig, Preference } = require('mercadopago');
        const mpClient = new MercadoPagoConfig({ accessToken });
        const preference = new Preference(mpClient);
        const maxInstallments = Math.max(...(settings.installments||'3,6,12').split(',').map(Number).filter(Boolean));

        const mpItems = [
          ...items.map(it => ({
            title: it.name + (it.custom_name ? ` (${it.custom_name} #${it.custom_number})` : '') + ` · T.${it.size}`,
            quantity: it.qty || 1,
            unit_price: it.unit_price || 0,
            currency_id: 'ARS',
          })),
          ...(shipping > 0 ? [{
            title: 'Envío',
            quantity: 1,
            unit_price: shipping,
            currency_id: 'ARS',
          }] : []),
        ];

        const pref = await preference.create({ body: {
          items: mpItems,
          payer: { name: customer.name, email: customer.email },
          payment_methods: {
            excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }],
            installments: maxInstallments,
          },
          back_urls: {
            success: `${BASE_URL}/checkout.html?order=${id}&status=success`,
            failure: `${BASE_URL}/checkout.html?order=${id}&status=failure`,
            pending: `${BASE_URL}/checkout.html?order=${id}&status=pending`,
          },
          auto_return: 'approved',
          external_reference: id,
          metadata: { order_id: id },
        }});

        db.prepare('UPDATE orders SET mp_preference_id=? WHERE id=?').run(pref.id, id);
        mpData = { preference_id: pref.id, init_point: pref.init_point, sandbox_init_point: pref.sandbox_init_point };
      } catch (mpErr) {
        console.error('Mercado Pago error:', mpErr.message);
      }
    }

    res.status(201).json({
      id, number: orderNumber, subtotal, shipping, total, payment_method,
      mp: mpData,
      bank: payment_method === 'transfer' ? {
        bank: settings.bank_name,
        cbu: settings.bank_cbu,
        alias: settings.bank_alias,
        owner: settings.bank_owner,
        account: settings.bank_account,
      } : null,
    });
  } catch (err) {
    console.error('Error creando pedido:', err);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
});

// ── Webhook de Mercado Pago ───────────────────────────────────────────────────
app.post('/api/mp/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const { type, data } = req.body;
    if (type === 'payment' && data?.id) {
      const accessToken = MP_ACCESS_TOKEN || getSettings().mp_access_token || '';
      if (!accessToken) return;
      const { MercadoPagoConfig, Payment } = require('mercadopago');
      const mpClient = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: data.id });
      if (paymentData?.external_reference) {
        const pStatus = paymentData.status === 'approved' ? 'paid' : paymentData.status;
        const oStatus = paymentData.status === 'approved' ? 'confirmed' : 'new';
        db.prepare('UPDATE orders SET payment_status=?,mp_payment_id=?,status=? WHERE id=?')
          .run(pStatus, String(data.id), oStatus, paymentData.external_reference);
      }
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
  }
});

// ── Admin ─────────────────────────────────────────────────────────────────────
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'index.html')));

// ── Estadísticas ──────────────────────────────────────────────────────────────
app.get('/api/stats', requireAuth, (req, res) => {
  const products = db.prepare('SELECT COUNT(*) as n FROM products WHERE active=1').get().n;
  const orders = db.prepare('SELECT COUNT(*) as n FROM orders').get().n;
  const revenue = db.prepare("SELECT COALESCE(SUM(total),0) as n FROM orders WHERE payment_status='paid'").get().n;
  const contacts = db.prepare('SELECT COUNT(*) as n FROM contacts WHERE read=0').get().n;
  res.json({ products, orders, revenue, unread_contacts: contacts });
});

// ── Arranque ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  El Diez Baires → http://localhost:${PORT}`);
  console.log(`  Admin          → http://localhost:${PORT}/admin`);
  console.log(`  MP Access Token: ${MP_ACCESS_TOKEN ? '✓ configurado' : '✗ no configurado (mode demo)'}`);
  if (!MP_ACCESS_TOKEN) console.log('  → Configurá MP_ACCESS_TOKEN en variables de entorno para habilitar pagos reales.\n');
});
