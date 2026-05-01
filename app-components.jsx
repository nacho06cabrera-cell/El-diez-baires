// app-components.jsx — UI base (Nav, Heroes, Filters, Cards, Cart, Modal)
const { useState, useMemo } = React;

function Nav({ cartCount, onOpenCart, dark }) {
  return (
    <nav className={"nav " + (dark ? "nav-dark" : "")}>
      <div className="nav-logo">
        <span className="logo-mark">EL DIEZ <em>BAIRES</em></span>
        <span className="logo-sub">· Buenos Aires ·</span>
      </div>
      <ul className="nav-links">
        <li><a href="#catalogo">Catálogo</a></li>
        <li><a href="#historia">Historia</a></li>
        <li><a href="#testimonios">Hinchada</a></li>
      </ul>
      <button className="cart-btn" onClick={onOpenCart}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14c0 1 1 2 2 2h14c1 0 2-1 2-2V6l-3-4z"/><path d="M3 6h18M16 10c0 2-2 4-4 4s-4-2-4-4"/></svg>
        <span>Carrito</span>
        {cartCount > 0 && <i className="cart-count">{cartCount}</i>}
      </button>
    </nav>
  );
}

function HeroStadium({ accent, cartCount, onOpenCart, showGiantTen }) {
  return (
    <section className="hero hero-stadium" id="top">
      <div className="hero-bg">
        <div className="hero-img-placeholder">
          <img className="hero-photo" src="images/hero-tribuna.webp" alt="" />
          {showGiantTen && <GiantTen style={{ fontSize: "min(60vw, 900px)", right: "-3vw", bottom: "-15vh" }} opacity={0.13} color={accent} />}
        </div>
        <div className="hero-vignette" />
      </div>
      <Nav cartCount={cartCount} onOpenCart={onOpenCart} />
      <div className="hero-content">
        <div className="hero-eyebrow"><span className="dot"></span><span>Camisetas · Buenos Aires · Desde 2025</span></div>
        <h1 className="hero-title">La camiseta<br /><em>no se mancha.</em></h1>
        <p className="hero-lead">Llegaste a buscar tu camiseta. Llegaste al lugar correcto.<br />Selección, clubes, retro, actuales — todas las que tu corazón pide.</p>
        <div className="hero-actions">
          <a href="#catalogo" className="btn btn-primary">Ver catálogo →</a>
          <a href="#historia" className="btn btn-ghost">Conocé la historia</a>
        </div>
        <div className="hero-foot">
          <div><b>+12.000</b><span>camisetas vendidas</span></div>
          <div><b>40 países</b><span>de envío</span></div>
          <div><b>1986–2026</b><span>cuatro décadas</span></div>
        </div>
      </div>
    </section>
  );
}

function HeroEditorial({ cartCount, onOpenCart, showGiantTen }) {
  return (
    <section className="hero hero-editorial" id="top">
      <Nav cartCount={cartCount} onOpenCart={onOpenCart} dark />
      <div className="editorial-grid">
        <div className="editorial-text">
          <div className="hero-eyebrow dark"><span className="dot dark"></span><span>Volumen 10 · Edición Eterna</span></div>
          <h1 className="hero-title big">La camiseta<br/><em>no se</em><br/>mancha.</h1>
          <p className="hero-lead dark">Llegaste al lugar correcto. Cada hilo, una historia;<br/>cada número, un recuerdo.</p>
          <div className="hero-actions"><a href="#catalogo" className="btn btn-dark">Ver catálogo →</a></div>
        </div>
        <div className="editorial-jersey">
          <img className="editorial-photo" src="images/celebracion-10.webp" alt="" />
          {showGiantTen && <GiantTen style={{ fontSize: "min(40vw, 600px)", left: "-6vw", top: "-4vh" }} opacity={0.06} color="#0A2A5E" />}
        </div>
      </div>
    </section>
  );
}

function HeroMinimal({ cartCount, onOpenCart, showGiantTen }) {
  return (
    <section className="hero hero-minimal" id="top">
      <Nav cartCount={cartCount} onOpenCart={onOpenCart} dark />
      <div className="minimal-wrap">
        <div className="hero-eyebrow dark center"><span className="dot dark"></span><span>Buenos Aires · Camisetas de fútbol</span></div>
        <h1 className="hero-title huge">La camiseta<br/><em>no se mancha.</em></h1>
        {showGiantTen && <GiantTen style={{ fontSize: "min(70vw, 1100px)", left: "50%", top: "50%", transform: "translate(-50%, -42%)" }} opacity={0.05} color="#0A2A5E" />}
        <p className="hero-lead dark center">Llegaste a buscar tu camiseta. Llegaste al lugar correcto.</p>
        <div className="hero-actions center">
          <a href="#catalogo" className="btn btn-dark">Ver catálogo →</a>
          <a href="#historia" className="btn btn-ghost-dark">La historia</a>
        </div>
      </div>
    </section>
  );
}

function FilterBar({ filters, setFilters, count }) {
  const reset = () => setFilters({ country: "Todos", type: "Todos", era: "Todos", version: "Todos" });
  const Group = ({ label, options, value, k }) => (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <div className="filter-chips">
        {["Todos", ...options].map((o) => (
          <button key={o} className={"chip " + (value === o ? "chip-on" : "")} onClick={() => setFilters({ ...filters, [k]: o })}>{o}</button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="filters">
      <Group label="País" options={window.COUNTRIES} value={filters.country} k="country" />
      <Group label="Tipo" options={window.TYPES} value={filters.type} k="type" />
      <Group label="Época" options={window.ERAS} value={filters.era} k="era" />
      <Group label="Versión" options={window.VERSIONS} value={filters.version} k="version" />
      <div className="filters-foot">
        <span className="filters-count">{count} camisetas</span>
        <button className="filter-reset" onClick={reset}>Limpiar ↺</button>
      </div>
    </div>
  );
}

function ProductCardEditorial({ product, onAdd, showStamp }) {
  return (
    <article className="card card-editorial">
      <div className="card-img">
        <JerseyPlaceholder palette={product.palette} badge={product.badge} style={{ width: "75%", maxHeight: 280 }} />
        {showStamp && product.era === "Retro" && <AutographStamp rotate={-12} size={120} />}
        <span className="card-year">{product.year}</span>
      </div>
      <div className="card-body">
        <div className="card-meta"><span>{product.country}</span><span>·</span><span>{product.type}</span><span>·</span><span>{product.version}</span></div>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-sub">{product.subtitle}</p>
        <p className="card-desc">{product.description}</p>
        <div className="card-foot">
          <span className="card-price">{window.formatPrice(product.price)}</span>
          <button className="btn-add" onClick={() => onAdd(product)}>Agregar +</button>
        </div>
      </div>
    </article>
  );
}

function ProductCardCollectible({ product, onAdd }) {
  return (
    <article className="card card-collectible">
      <div className="card-collect-top"><span className="card-collect-country">{product.country.toUpperCase()}</span><span className="card-collect-year">{product.year}</span></div>
      <div className="card-collect-num"><JerseyPlaceholder palette={product.palette} big style={{ width: "100%", maxHeight: 220 }} /></div>
      <div className="card-collect-info">
        <h3>{product.name}</h3>
        <div className="card-collect-meta"><span>{product.type}</span><span>·</span><span>{product.version}</span><span>·</span><span>{product.era}</span></div>
        <div className="card-foot">
          <span className="card-price">{window.formatPrice(product.price)}</span>
          <button className="btn-add" onClick={() => onAdd(product)}>+</button>
        </div>
      </div>
    </article>
  );
}

function Catalog({ onAdd, cardVariant, showStamp }) {
  const [filters, setFilters] = useState({ country: "Todos", type: "Todos", era: "Todos", version: "Todos" });
  const filtered = useMemo(() => window.PRODUCTS.filter((p) => {
    if (filters.country !== "Todos" && p.country !== filters.country) return false;
    if (filters.type !== "Todos" && p.type !== filters.type) return false;
    if (filters.era !== "Todos" && p.era !== filters.era) return false;
    if (filters.version !== "Todos" && p.version !== filters.version) return false;
    return true;
  }), [filters]);
  return (
    <section id="catalogo" className="catalog">
      <header className="section-head reveal">
        <div>
          <span className="section-eyebrow">— 02 · Catálogo</span>
          <h2 className="section-title">El museo, en tu placard.</h2>
        </div>
        <p className="section-lead">Filtrá por país, época, club o selección. Cada camiseta, una historia que ya está esperando ser tuya.</p>
      </header>
      <FilterBar filters={filters} setFilters={setFilters} count={filtered.length} />
      <div className={"grid grid-" + cardVariant}>
        {filtered.length === 0 && <div className="empty"><span>Ninguna camiseta con esos filtros.</span><span>Probá con otra combinación.</span></div>}
        {filtered.map((p) => cardVariant === "collectible"
          ? <ProductCardCollectible key={p.id} product={p} onAdd={onAdd} />
          : <ProductCardEditorial key={p.id} product={p} onAdd={onAdd} showStamp={showStamp} />)}
      </div>
    </section>
  );
}

function CartDrawer({ open, onClose, items, setItems }) {
  const removeItem = (id, size) => setItems(items.filter(it => !(it.id === id && it.size === size)));
  const updateQty = (id, size, dq) => setItems(items.map(it => it.id === id && it.size === size ? { ...it, qty: Math.max(1, it.qty + dq) } : it));
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal > 0 ? 4500 : 0;
  const total = subtotal + shipping;
  return (
    <>
      <div className={"drawer-scrim " + (open ? "on" : "")} onClick={onClose} />
      <aside className={"drawer " + (open ? "on" : "")}>
        <header className="drawer-head">
          <div>
            <span className="drawer-eyebrow">Tu carrito</span>
            <h3>{items.length === 0 ? "Vacío por ahora" : `${items.reduce((s,i)=>s+i.qty,0)} prendas`}</h3>
          </div>
          <button className="drawer-x" onClick={onClose}>✕</button>
        </header>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <div className="drawer-empty-num">10</div>
              <p>Todavía no metiste nada.</p>
              <span>Andá al catálogo, elegí tu camiseta. Esa que esperabas.</span>
              <button className="btn btn-dark" onClick={onClose}>Volver al catálogo</button>
            </div>
          ) : items.map((it, i) => (
            <div className="drawer-item" key={`${it.id}-${it.size}-${i}`}>
              <div className="drawer-item-img" style={{background: it.palette[0] + "22"}}>
                <JerseyPlaceholder palette={it.palette} style={{ width: "100%" }} />
              </div>
              <div className="drawer-item-body">
                <h4>{it.name}</h4>
                <p>{it.subtitle} · Talle {it.size}</p>
                <div className="drawer-item-row">
                  <div className="qty">
                    <button onClick={() => updateQty(it.id, it.size, -1)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => updateQty(it.id, it.size, +1)}>+</button>
                  </div>
                  <span className="drawer-item-price">{window.formatPrice(it.price * it.qty)}</span>
                </div>
                <button className="drawer-item-rm" onClick={() => removeItem(it.id, it.size)}>quitar</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <footer className="drawer-foot">
            <div className="drawer-totals">
              <div><span>Subtotal</span><b>{window.formatPrice(subtotal)}</b></div>
              <div><span>Envío</span><b>{window.formatPrice(shipping)}</b></div>
              <div className="drawer-total"><span>Total</span><b>{window.formatPrice(total)}</b></div>
            </div>
            <button className="btn btn-primary btn-full">Finalizar compra →</button>
            <p className="drawer-fine">Envío a todo el país · Pago seguro · Devolución 30 días</p>
          </footer>
        )}
      </aside>
    </>
  );
}

function SizeModal({ product, onClose, onConfirm }) {
  const [size, setSize] = useState("M");
  if (!product) return null;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>✕</button>
        <div className="modal-jersey" style={{background: product.palette[0] + "22"}}>
          <JerseyPlaceholder palette={product.palette} big style={{ width: 180 }} />
        </div>
        <div className="modal-info">
          <span className="modal-eyebrow">{product.country.toUpperCase()} · {product.year}</span>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <span className="modal-lbl">ELEGÍ TU TALLE</span>
          <div className="size-grid">
            {window.SIZES.map(s => <button key={s} className={"size-btn " + (size === s ? "on" : "")} onClick={() => setSize(s)}>{s}</button>)}
          </div>
          <button className="btn btn-primary btn-full" onClick={() => onConfirm(size)}>Agregar al carrito · {window.formatPrice(product.price)}</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Nav, HeroStadium, HeroEditorial, HeroMinimal, Catalog, CartDrawer, SizeModal });
