// seed-products.js — carga los productos iniciales en la DB
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, 'eldiezdb.sqlite'));

// Asegura que existan las tablas
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
`);

const ALL_SIZES = JSON.stringify(["S","M","L","XL","2XL","3XL","4XL"]);
const uid = () => crypto.randomBytes(6).toString('hex');

const products = [
  // ── ARGENTINA ───────────────────────────────────────────────────────────────
  {
    name: 'Selección Argentina',
    subtitle: 'Titular 2026 · Manga Corta',
    liga: 'Selecciones',
    equipo: 'Argentina',
    jersey_type: 'jugador',
    version: 'titular',
    year: 2026,
    price: 50000,
    palette: JSON.stringify(['#FFFFFF','#74ACDF']),
    badge: 'AFA',
    description: 'Camiseta titular de la Selección Argentina para el Mundial 2026. Diseño Adidas con rayas celestes y blancas, inspirado en los tres títulos mundialistas. Tecnología AEROREADY.',
  },
  {
    name: 'Selección Argentina',
    subtitle: 'Titular 2026 · Manga Larga',
    liga: 'Selecciones',
    equipo: 'Argentina',
    jersey_type: 'jugador',
    version: 'titular',
    year: 2026,
    price: 50000,
    palette: JSON.stringify(['#FFFFFF','#74ACDF']),
    badge: 'AFA',
    description: 'Camiseta titular manga larga de la Selección Argentina para el Mundial 2026. Misma tela y diseño que la manga corta, ideal para el frío.',
  },
  {
    name: 'Selección Argentina',
    subtitle: 'Alternativa 2026 · Manga Corta',
    liga: 'Selecciones',
    equipo: 'Argentina',
    jersey_type: 'jugador',
    version: 'suplente',
    year: 2026,
    price: 50000,
    palette: JSON.stringify(['#111111','#74ACDF']),
    badge: 'AFA',
    description: 'Camiseta alternativa de la Selección Argentina para el Mundial 2026. Diseño oscuro con motivos del fileteado porteño y detalles celeste. Vuelve el Trefoil de Adidas.',
  },
  {
    name: 'Selección Argentina',
    subtitle: 'Alternativa 2026 · Manga Larga',
    liga: 'Selecciones',
    equipo: 'Argentina',
    jersey_type: 'jugador',
    version: 'suplente',
    year: 2026,
    price: 50000,
    palette: JSON.stringify(['#111111','#74ACDF']),
    badge: 'AFA',
    description: 'Camiseta alternativa manga larga de la Selección Argentina para el Mundial 2026. Diseño oscuro con fileteado porteño, ideal para climas fríos.',
  },

  // ── BOCA JUNIORS ────────────────────────────────────────────────────────────
  {
    name: 'Boca Juniors',
    subtitle: 'Titular 2025/2026 · Manga Corta',
    liga: 'Equipos Argentinos',
    equipo: 'Boca Juniors',
    jersey_type: 'jugador',
    version: 'titular',
    year: 2025,
    price: 50000,
    palette: JSON.stringify(['#1A2744','#F6B40E']),
    badge: 'CABJ',
    description: 'Camiseta titular de Boca Juniors 2025/2026. Edición especial 120 años del club. Azul nocturno con franja dorada, escudo conmemorativo y la inscripción "1905" en la nuca.',
  },
  {
    name: 'Boca Juniors',
    subtitle: 'Titular 2025/2026 · Manga Larga',
    liga: 'Equipos Argentinos',
    equipo: 'Boca Juniors',
    jersey_type: 'jugador',
    version: 'titular',
    year: 2025,
    price: 50000,
    palette: JSON.stringify(['#1A2744','#F6B40E']),
    badge: 'CABJ',
    description: 'Camiseta titular manga larga de Boca Juniors 2025/2026. Edición 120 años, azul profundo con detalles dorados.',
  },
  {
    name: 'Boca Juniors',
    subtitle: 'Alternativa 2025/2026 · Manga Corta',
    liga: 'Equipos Argentinos',
    equipo: 'Boca Juniors',
    jersey_type: 'jugador',
    version: 'suplente',
    year: 2025,
    price: 50000,
    palette: JSON.stringify(['#F6B40E','#1A2744']),
    badge: 'CABJ',
    description: 'Camiseta alternativa de Boca Juniors 2025/2026. Color dorado como protagonista, con detalles y rayas de Adidas en azul. Edición 120 años del club.',
  },
  {
    name: 'Boca Juniors',
    subtitle: 'Alternativa 2025/2026 · Manga Larga',
    liga: 'Equipos Argentinos',
    equipo: 'Boca Juniors',
    jersey_type: 'jugador',
    version: 'suplente',
    year: 2025,
    price: 50000,
    palette: JSON.stringify(['#F6B40E','#1A2744']),
    badge: 'CABJ',
    description: 'Camiseta alternativa manga larga de Boca Juniors 2025/2026. Diseño dorado edición 120 años.',
  },

  // ── RIVER PLATE ─────────────────────────────────────────────────────────────
  {
    name: 'River Plate',
    subtitle: 'Titular 2025/2026 · Manga Corta',
    liga: 'Equipos Argentinos',
    equipo: 'River Plate',
    jersey_type: 'jugador',
    version: 'titular',
    year: 2025,
    price: 50000,
    palette: JSON.stringify(['#FFFFFF','#CC0000']),
    badge: 'CARP',
    description: 'Camiseta titular de River Plate 2025/2026. Icónica banda roja diagonal con rayas de Adidas horizontales en las mangas, homenaje al diseño de los años 90 y la Copa Libertadores 2015.',
  },
  {
    name: 'River Plate',
    subtitle: 'Titular 2025/2026 · Manga Larga',
    liga: 'Equipos Argentinos',
    equipo: 'River Plate',
    jersey_type: 'jugador',
    version: 'titular',
    year: 2025,
    price: 50000,
    palette: JSON.stringify(['#FFFFFF','#CC0000']),
    badge: 'CARP',
    description: 'Camiseta titular manga larga de River Plate 2025/2026. Banda roja y detalles retro en las mangas.',
  },
  {
    name: 'River Plate',
    subtitle: 'Alternativa 2025/2026 · Manga Corta',
    liga: 'Equipos Argentinos',
    equipo: 'River Plate',
    jersey_type: 'jugador',
    version: 'suplente',
    year: 2025,
    price: 50000,
    palette: JSON.stringify(['#CC0000','#1A1A1A']),
    badge: 'CARP',
    description: 'Camiseta alternativa de River Plate 2025/2026. Rayas verticales rojas y negras, inspiradas en el globo aerostático que acompañó las fiestas del Metropolitano 1975.',
  },
  {
    name: 'River Plate',
    subtitle: 'Alternativa 2025/2026 · Manga Larga',
    liga: 'Equipos Argentinos',
    equipo: 'River Plate',
    jersey_type: 'jugador',
    version: 'suplente',
    year: 2025,
    price: 50000,
    palette: JSON.stringify(['#CC0000','#1A1A1A']),
    badge: 'CARP',
    description: 'Camiseta alternativa manga larga de River Plate 2025/2026. Rayas rojas y negras, edición especial Metropolitano 75.',
  },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO products
    (id, name, subtitle, liga, equipo, jersey_type, version, year, price, sizes, customizable, palette, badge, description, image, active)
  VALUES
    (@id, @name, @subtitle, @liga, @equipo, @jersey_type, @version, @year, @price, @sizes, 1, @palette, @badge, @description, NULL, 1)
`);

let count = 0;
const insertAll = db.transaction(() => {
  for (const p of products) {
    insert.run({ ...p, id: uid(), sizes: ALL_SIZES });
    count++;
  }
});

insertAll();
console.log(`✓ ${count} productos insertados correctamente.`);
db.close();
