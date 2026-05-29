// app-components.jsx — Nav, Heroes, SearchBar, FilterBar, Cards, SizeModal, CartDrawer
const { useState, useMemo, useEffect, useCallback, useRef } = React;

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ cartCount, onOpenCart, dark }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <nav className={"nav " + (dark ? "nav-dark" : "")}>
      <a href="#top" className="nav-logo" style={{ textDecoration: "none" }}>
        {imgOk
          ? <img src="images/logo.png" className="nav-logo-img" alt="El Diez Baires"
              onError={() => setImgOk(false)} />
          : <span className="logo-mark">EL DIEZ <em>BAIRES</em></span>
        }
        {!imgOk && <span className="logo-sub">· Buenos Aires ·</span>}
      </a>
      <ul className="nav-links">
        <li><a href="#catalogo">Catálogo</a></li>
        <li><a href="#historia">Historia</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
      <button className="cart-btn" onClick={onOpenCart} aria-label="Carrito">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <span>Carrito</span>
        {cartCount > 0 && <i className="cart-count">{cartCount}</i>}
      </button>
    </nav>
  );
}

// ── Heroes ────────────────────────────────────────────────────────────────────
function HeroStadium({ accent, cartCount, onOpenCart, showGiantTen }) {
  return (
    <section className="hero hero-stadium" id="top">
      <div className="hero-bg">
        <div className="hero-img-placeholder">
          <img className="hero-photo" src="images/hero-tribuna.webp" alt="" />
          {showGiantTen && <GiantTen style={{ fontSize:"min(60vw,900px)", right:"-3vw", bottom:"-15vh" }} opacity={0.13} color={accent} />}
        </div>
        <div className="hero-vignette" />
      </div>
      <Nav cartCount={cartCount} onOpenCart={onOpenCart} />
      <div className="hero-content">
        <div className="hero-eyebrow"><span className="dot"></span><span>Camisetas · Buenos Aires · Desde 2025</span></div>
        <h1 className="hero-title">La camiseta<br /><em>no se mancha.</em></h1>
        <p className="hero-lead">Jugador, Fan o Retro — encontrá la tuya. Premier League, La Liga, equipos argentinos, selecciones de todo el mundo.</p>
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
          {showGiantTen && <GiantTen style={{ fontSize:"min(40vw,600px)", left:"-6vw", top:"-4vh" }} opacity={0.06} color="#0A2A5E" />}
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
        {showGiantTen && <GiantTen style={{ fontSize:"min(70vw,1100px)", left:"50%", top:"50%", transform:"translate(-50%,-42%)" }} opacity={0.05} color="#0A2A5E" />}
        <p className="hero-lead dark center">Llegaste a buscar tu camiseta. Llegaste al lugar correcto.</p>
        <div className="hero-actions center">
          <a href="#catalogo" className="btn btn-dark">Ver catálogo →</a>
          <a href="#historia" className="btn btn-ghost-dark">La historia</a>
        </div>
      </div>
    </section>
  );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────
function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <div className="search-inner">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          className="search-input"
          placeholder="Buscá por equipo, liga, jugador…"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {value && (
          <button className="search-clear" onClick={() => onChange('')} aria-label="Limpiar">✕</button>
        )}
      </div>
    </div>
  );
}

// ── FilterBar ─────────────────────────────────────────────────────────────────
function FilterBar({ filters, setFilters, count }) {
  const allLigas = Object.keys(window.LIGAS);
  const equiposForLiga = filters.liga !== "Todas" ? (window.LIGAS[filters.liga] || []) : [];

  const setType  = t  => setFilters(f => ({ ...f, type: t, liga: "Todas", equipo: "Todos" }));
  const setLiga  = l  => setFilters(f => ({ ...f, liga: l, equipo: "Todos" }));
  const setEquipo= eq => setFilters(f => ({ ...f, equipo: eq }));
  const reset    = () => setFilters({ type: "Todos", liga: "Todas", equipo: "Todos" });

  return (
    <div className="filters">
      {/* Fila tipo */}
      <div className="filter-row">
        <span className="filter-label">Tipo</span>
        <div className="filter-chips">
          {["Todos", "jugador", "fan", "retro"].map(t => (
            <button key={t}
              className={"chip " + (filters.type === t ? "chip-on" : "") + (t !== "Todos" ? " chip-type chip-"+t : "")}
              onClick={() => setType(t)}>
              {t === "Todos" ? "Todos" : window.JERSEY_TYPE_LABELS[t]}
              {t !== "Todos" && <span className="chip-price">{window.formatPrice(window.JERSEY_TYPE_PRICES[t])}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Fila liga */}
      <div className="filter-row">
        <span className="filter-label">Liga / País</span>
        <div className="filter-chips filter-chips-scroll">
          {["Todas", ...allLigas].map(liga => (
            <button key={liga}
              className={"chip " + (filters.liga === liga ? "chip-on" : "")}
              onClick={() => setLiga(liga)}>
              {liga}
            </button>
          ))}
        </div>
      </div>

      {/* Fila equipo — solo cuando hay liga seleccionada */}
      {filters.liga !== "Todas" && equiposForLiga.length > 0 && (
        <div className="filter-row filter-row-equipo">
          <span className="filter-label">Equipo</span>
          <div className="filter-chips filter-chips-scroll">
            {["Todos", ...equiposForLiga].map(eq => (
              <button key={eq}
                className={"chip " + (filters.equipo === eq ? "chip-on" : "")}
                onClick={() => setEquipo(eq)}>
                {eq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="filters-foot">
        <span className="filters-count">{count} {count === 1 ? "camiseta" : "camisetas"}</span>
        <button className="filter-reset" onClick={reset}>Limpiar filtros ↺</button>
      </div>
    </div>
  );
}

// ── ProductCard Editorial ─────────────────────────────────────────────────────
function ProductCardEditorial({ product, onAdd, showStamp }) {
  const typeLabel = window.JERSEY_TYPE_LABELS[product.jersey_type] || product.jersey_type;
  return (
    <article className="card card-editorial">
      <div className="card-img">
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width:"90%", maxHeight:260, objectFit:"contain" }} />
          : <JerseyPlaceholder palette={product.palette} badge={product.badge} style={{ width:"75%", maxHeight:280 }} />
        }
        {showStamp && product.jersey_type === "retro" && <AutographStamp rotate={-12} size={120} />}
        <span className="card-year">{product.year}</span>
        <span className={"card-type-tag card-type-"+product.jersey_type}>{typeLabel}</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{product.liga}</span><span>·</span><span>{product.equipo}</span>
          {product.version && product.version !== "Local" && <><span>·</span><span>{product.version}</span></>}
        </div>
        <h3 className="card-title">{product.name}</h3>
        {product.subtitle && <p className="card-sub">{product.subtitle}</p>}
        {product.description && <p className="card-desc">{product.description}</p>}
        <div className="card-foot">
          <span className="card-price">{window.formatPrice(product.price)}</span>
          <button className="btn-add" onClick={() => onAdd(product)}>Agregar +</button>
        </div>
      </div>
    </article>
  );
}

// ── ProductCard Collectible ───────────────────────────────────────────────────
function ProductCardCollectible({ product, onAdd }) {
  const typeLabel = window.JERSEY_TYPE_LABELS[product.jersey_type] || product.jersey_type;
  return (
    <article className="card card-collectible">
      <div className="card-collect-top">
        <span className="card-collect-country">{product.equipo.toUpperCase()}</span>
        <span className="card-collect-year">{product.year}</span>
      </div>
      <div className="card-collect-num">
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width:"100%", maxHeight:200, objectFit:"contain" }} />
          : <JerseyPlaceholder palette={product.palette} big style={{ width:"100%", maxHeight:220 }} />
        }
      </div>
      <div className="card-collect-info">
        <h3>{product.name}</h3>
        <div className="card-collect-meta">
          <span>{product.liga}</span><span>·</span><span>{typeLabel}</span>
          {product.version !== "Local" && <><span>·</span><span>{product.version}</span></>}
        </div>
        <div className="card-foot">
          <span className="card-price">{window.formatPrice(product.price)}</span>
          <button className="btn-add" onClick={() => onAdd(product)}>+</button>
        </div>
      </div>
    </article>
  );
}

// ── Catalog ───────────────────────────────────────────────────────────────────
function Catalog({ products = [], loading, onAdd, cardVariant, showStamp }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type: "Todos", liga: "Todas", equipo: "Todos" });

  const filtered = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.equipo.toLowerCase().includes(q) ||
        p.liga.toLowerCase().includes(q) ||
        (p.subtitle || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        String(p.year).includes(q)
      );
    }
    if (filters.type !== "Todos") list = list.filter(p => p.jersey_type === filters.type);
    if (filters.liga !== "Todas") list = list.filter(p => p.liga === filters.liga);
    if (filters.equipo !== "Todos") {
      if (filters.equipo === "Otros") {
        const main = (window.LIGAS[filters.liga] || []).filter(e => e !== "Otros");
        list = list.filter(p => !main.includes(p.equipo));
      } else {
        list = list.filter(p => p.equipo === filters.equipo);
      }
    }
    return list;
  }, [products, search, filters]);

  return (
    <section id="catalogo" className="catalog">
      <header className="section-head reveal">
        <div>
          <span className="section-eyebrow">— 02 · Catálogo</span>
          <h2 className="section-title">El museo, en tu placard.</h2>
        </div>
        <p className="section-lead">Jugador, Fan o Retro. Elegí por liga, equipo o usá el buscador.</p>
      </header>

      <SearchBar value={search} onChange={setSearch} />
      <FilterBar filters={filters} setFilters={setFilters} count={filtered.length} />

      <div className={"grid grid-" + cardVariant}>
        {loading && (
          <div className="empty">
            <span style={{ fontFamily:"var(--font-mono)", fontSize:13, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gris)" }}>
              Cargando…
            </span>
          </div>
        )}
        {!loading && products.length === 0 && (
          <div className="empty">
            <span>El catálogo está vacío por ahora.</span>
            <span>Pronto van a aparecer las camisetas.</span>
          </div>
        )}
        {!loading && products.length > 0 && filtered.length === 0 && (
          <div className="empty">
            <span>Ninguna camiseta con esos filtros.</span>
            <span>Probá otra combinación o limpiá los filtros.</span>
          </div>
        )}
        {!loading && filtered.map(p =>
          cardVariant === "collectible"
            ? <ProductCardCollectible key={p.id} product={p} onAdd={onAdd} />
            : <ProductCardEditorial key={p.id} product={p} onAdd={onAdd} showStamp={showStamp} />
        )}
      </div>
    </section>
  );
}

// ── CartDrawer ────────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose, items, setItems }) {
  const removeItem = (id, size, ci) =>
    setItems(items.filter((_, i) => i !== ci));
  const updateQty = (ci, dq) =>
    setItems(items.map((it, i) => i === ci ? { ...it, qty: Math.max(1, it.qty + dq) } : it));

  const subtotal = items.reduce((s, it) => s + (it.line_price || it.price || 0) * it.qty, 0);
  const [settings, setSettings] = useState({ shipping_price: "5000", free_shipping_threshold: "100000" });

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => setSettings(s)).catch(() => {});
  }, []);

  const shippingPrice = Number(settings.shipping_price || 5000);
  const freeThreshold = Number(settings.free_shipping_threshold || 100000);
  const shipping = subtotal >= freeThreshold ? 0 : (subtotal > 0 ? shippingPrice : 0);
  const total = subtotal + shipping;

  const goToCheckout = () => {
    localStorage.setItem("eldiezCart", JSON.stringify(items));
    window.location.href = "/checkout.html";
  };

  const patchName = id => (window.PATCHES.find(p => p.id === id) || {}).label || id;

  return (
    <>
      <div className={"drawer-scrim " + (open ? "on" : "")} onClick={onClose} />
      <aside className={"drawer " + (open ? "on" : "")}>
        <header className="drawer-head">
          <div>
            <span className="drawer-eyebrow">Tu carrito</span>
            <h3>{items.length === 0 ? "Vacío por ahora" : `${items.reduce((s,i) => s+i.qty, 0)} prenda${items.reduce((s,i)=>s+i.qty,0)!==1?"s":""}`}</h3>
          </div>
          <button className="drawer-x" onClick={onClose}>✕</button>
        </header>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <div className="drawer-empty-num">10</div>
              <p>Todavía no metiste nada.</p>
              <span>Andá al catálogo, elegí tu camiseta.</span>
              <button className="btn btn-dark" onClick={onClose}>Ver catálogo</button>
            </div>
          ) : items.map((it, ci) => (
            <div className="drawer-item" key={ci}>
              <div className="drawer-item-img" style={{ background: (it.palette?.[0] || "#fff") + "22" }}>
                {it.image
                  ? <img src={it.image} alt={it.name} style={{ width:"100%", objectFit:"contain", maxHeight:64 }} />
                  : <JerseyPlaceholder palette={it.palette || ["#fff","#74ACDF"]} style={{ width:"100%" }} />
                }
              </div>
              <div className="drawer-item-body">
                <h4>{it.name}</h4>
                <p className="drawer-item-meta">{it.equipo} · {it.liga}</p>
                <p className="drawer-item-meta">Talle {it.size} · {window.JERSEY_TYPE_LABELS[it.jersey_type] || it.jersey_type}</p>
                {it.custom_name && (
                  <p className="drawer-custom">{it.custom_name} #{it.custom_number}</p>
                )}
                {it.patches?.length > 0 && (
                  <p className="drawer-custom">Parches: {it.patches.map(patchName).join(", ")}</p>
                )}
                <div className="drawer-item-row">
                  <div className="qty">
                    <button onClick={() => updateQty(ci, -1)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => updateQty(ci, +1)}>+</button>
                  </div>
                  <span className="drawer-item-price">{window.formatPrice((it.line_price || it.price || 0) * it.qty)}</span>
                </div>
                <button className="drawer-item-rm" onClick={() => removeItem(it.id, it.size, ci)}>quitar</button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <footer className="drawer-foot">
            <div className="drawer-totals">
              <div><span>Subtotal</span><b>{window.formatPrice(subtotal)}</b></div>
              <div>
                <span>Envío</span>
                <b>{shipping === 0 && subtotal > 0 ? "¡GRATIS!" : window.formatPrice(shipping)}</b>
              </div>
              {subtotal > 0 && subtotal < freeThreshold && (
                <div className="drawer-free-hint">
                  <span>Te faltan {window.formatPrice(freeThreshold - subtotal)} para envío gratis</span>
                </div>
              )}
              <div className="drawer-total"><span>Total</span><b>{window.formatPrice(total)}</b></div>
            </div>
            <button className="btn btn-primary btn-full" onClick={goToCheckout}>
              Finalizar compra →
            </button>
            <p className="drawer-fine">Tarjeta hasta 12 cuotas sin interés · Transferencia · Envío a todo el país</p>
          </footer>
        )}
      </aside>
    </>
  );
}

// ── SizeModal ─────────────────────────────────────────────────────────────────
function SizeModal({ product, onClose, onConfirm }) {
  const availSizes = product?.sizes || window.SIZES;
  const firstAvail = availSizes.find(s => (product?.sizes || window.SIZES).includes(s)) || "M";

  const [size, setSize] = useState(firstAvail);
  const [addName, setAddName] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [patches, setPatches] = useState([]);

  useEffect(() => {
    if (product) {
      setSize(firstAvail);
      setAddName(false);
      setCustomName("");
      setCustomNumber("");
      setPatches([]);
    }
  }, [product?.id]);

  if (!product) return null;

  const customizationPrice =
    (addName ? window.CUSTOMIZATION_PRICES.name_number : 0) +
    patches.length * window.CUSTOMIZATION_PRICES.patch;
  const linePrice = product.price + customizationPrice;

  const togglePatch = id =>
    setPatches(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const handleConfirm = () => {
    if (!availSizes.includes(size)) return;
    onConfirm({
      size,
      custom_name: addName && customName ? customName : "",
      custom_number: addName && customNumber ? customNumber : "",
      patches,
      customization_price: customizationPrice,
      line_price: linePrice,
    });
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal size-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>✕</button>

        <div className="modal-jersey" style={{ background: (product.palette?.[0] || "#fff") + "22" }}>
          {product.image
            ? <img src={product.image} alt={product.name} style={{ maxHeight:180, objectFit:"contain" }} />
            : <JerseyPlaceholder palette={product.palette} big style={{ width:170 }} />
          }
        </div>

        <div className="modal-info">
          <span className="modal-eyebrow">{product.liga} · {product.equipo} · {product.year}</span>
          <h3>{product.name}</h3>
          {product.subtitle && <p style={{ color:"var(--gris)", marginBottom:0 }}>{product.subtitle}</p>}

          {/* Talles */}
          <span className="modal-lbl">ELEGÍ TU TALLE</span>
          <div className="size-grid">
            {window.SIZES.map(s => {
              const avail = availSizes.includes(s);
              return (
                <button key={s}
                  className={"size-btn " + (size === s ? "on " : "") + (!avail ? "size-na" : "")}
                  onClick={() => avail && setSize(s)}
                  title={!avail ? "No disponible" : ""}>
                  {s}
                </button>
              );
            })}
          </div>

          {/* Personalización */}
          {product.customizable !== false && (
            <div className="custom-panel">
              <span className="modal-lbl">PERSONALIZACIÓN</span>

              <label className="custom-toggle">
                <input type="checkbox" checked={addName} onChange={e => setAddName(e.target.checked)} />
                <span>Nombre + Número</span>
                <em>+{window.formatPrice(window.CUSTOMIZATION_PRICES.name_number)}</em>
              </label>

              {addName && (
                <div className="custom-inputs">
                  <input type="text" placeholder="Nombre (ej: MARADONA)"
                    maxLength={14} value={customName}
                    onChange={e => setCustomName(e.target.value.toUpperCase())} />
                  <input type="number" placeholder="Nº" min={1} max={99}
                    value={customNumber}
                    onChange={e => setCustomNumber(e.target.value)} />
                </div>
              )}

              <div className="patches-row">
                <span className="patches-lbl">Parches <em>+{window.formatPrice(window.CUSTOMIZATION_PRICES.patch)} c/u</em></span>
                <div className="patches-grid">
                  {window.PATCHES.map(p => (
                    <button key={p.id}
                      className={"patch-btn " + (patches.includes(p.id) ? "on" : "")}
                      onClick={() => togglePatch(p.id)}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Precio total */}
          <div className="modal-price-summary">
            <div>
              <span>Base</span>
              <b>{window.formatPrice(product.price)}</b>
            </div>
            {customizationPrice > 0 && (
              <div>
                <span>Personalización</span>
                <b>+{window.formatPrice(customizationPrice)}</b>
              </div>
            )}
            <div className="modal-total-row">
              <span>Total</span>
              <b>{window.formatPrice(linePrice)}</b>
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={handleConfirm}>
            Agregar al carrito · {window.formatPrice(linePrice)}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Nav, HeroStadium, HeroEditorial, HeroMinimal,
  SearchBar, FilterBar, Catalog,
  ProductCardEditorial, ProductCardCollectible,
  CartDrawer, SizeModal,
});
