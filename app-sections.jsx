// app-sections.jsx — Historia, Testimonios, FAQ, Contacto, Footer y App

// ── Historia ──────────────────────────────────────────────────────────────────
function Historia({ showStamp }) {
  return (
    <section id="historia" className="historia">
      <div className="hist-grid">
        <div className="hist-text reveal-stagger">
          <span className="section-eyebrow">— 03 · La historia</span>
          <h2 className="section-title">Empezó en una mesa de café <em>de Boedo, en 2025.</em></h2>
          <p>Dos amigos, fanáticos del fútbol desde pibes. Una caja con camisetas viejas, una pelota gastada, y la idea de que cada tela tiene una historia que merece otra cancha.</p>
          <p><b>El Diez Baires</b> nació de esa amistad — del potrero al asado, del asado al partido del domingo. Dos hinchas que decidieron que las camisetas que les cambiaron la vida también podían cambiársela a otros.</p>
          <p>Hoy traemos camisetas de todas las épocas, países y clubes. Jugador, Fan o Retro. Sin atajos, sin marketing barato. <em>La camiseta no se mancha.</em></p>
          <div className="hist-stats">
            <div><b>2.400+</b><small>camisetas vendidas</small></div>
            <div><b>40</b><small>países cubiertos</small></div>
            <div><b>4.9 ★</b><small>reseñas verificadas</small></div>
          </div>
        </div>
        <div className="hist-tickets reveal">
          <div className="hist-photo">
            <img src="images/retrato-albiceleste.webp" alt="Hincha con la albiceleste" />
            <div className="hist-photo-cap">
              <span>—</span>
              <small>"En la cancha · México · 1986"</small>
            </div>
          </div>
          <div className="hist-tickets-row">
            <VintageTicket section="POPULAR" row="F" seat="10" date="22 · JUN · 1986" />
            <VintageTicket section="PLATEA" row="A" seat="86" date="03 · JUL · 1990" />
          </div>
          {showStamp &&
            <div style={{ position:"relative", height:0 }}>
              <AutographStamp rotate={12} size={150} label="ETERNO" />
            </div>
          }
        </div>
      </div>
    </section>
  );
}

// ── Testimonios ───────────────────────────────────────────────────────────────
function Testimonios() {
  const items = [
    { quote: "Pedí la del 86 para el cumple de mi viejo. Lloró. Lloré. Volví a pedir otra para mi hermano. Una locura, hermano.", name: "Martín G.", city: "Caballito, CABA" },
    { quote: "La tela es una manteca, papá. Calidad de coleccionista, atención de barrio. Estos pibes saben.", name: "Sofía R.", city: "Rosario, Santa Fe" },
    { quote: "Llegó en cuatro días con el sello bordado. Una joyita. La cuelgo en el living como cuadro, no me la pongo ni en pedo.", name: "Lucas P.", city: "Nueva Córdoba" },
    { quote: "Me mandé la retro del 90 y mi viejo se puso a llorar como nene. Veinte años buscándola y la encontré acá. Gracias capos.", name: "Diego M.", city: "Mar del Plata" },
    { quote: "Soy de River pero les compré la de Boca para regalarle a mi suegro. Aguante el fútbol, aguante El Diez. Un golazo.", name: "Camila V.", city: "Belgrano, CABA" },
    { quote: "La pedí un jueves, llegó el lunes a Mendoza. La tela, los detalles, el packaging — todo de diez. Nunca más compro en otro lado.", name: "Tomás A.", city: "Godoy Cruz, Mendoza" },
    { quote: "Me la puse para ir a la cancha y un viejito me paró en la calle a hablar del partido del 86. Lloramos los dos. Bárbaro.", name: "Nahuel B.", city: "La Plata" },
    { quote: "Tres camisetas pedí, tres camisetas perfectas. Estos pibes la tienen clarísima. Aguante Buenos Aires, aguante el fútbol.", name: "Florencia D.", city: "Palermo, CABA" },
    { quote: "Le mandé la del Napoli del 87 a mi viejo, italiano. No lo podía creer. Me llamó llorando. Una cosa de locos, amigo.", name: "Joaquín L.", city: "San Telmo, CABA" },
  ];
  return (
    <section id="testimonios" className="testimonios">
      <header className="section-head reveal">
        <div>
          <span className="section-eyebrow">— 04 · La hinchada habla</span>
          <h2 className="section-title">Lo que dicen<br /><em>los del 10.</em></h2>
        </div>
      </header>
      <div className="test-marquee">
        <div className="test-track">
          {[...items, ...items].map((t, i) => (
            <article key={i} className="test-card">
              <div className="test-stars">★★★★★</div>
              <p className="test-quote">"{t.quote}"</p>
              <div className="test-foot">
                <b>{t.name}</b>
                <small>{t.city}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const { useState: useS, useEffect: useE } = React;
  const [faqs, setFaqs] = useS([]);
  const [open, setOpen] = useS(null);

  useE(() => {
    fetch("/api/faqs").then(r => r.json()).then(setFaqs).catch(() => setFaqs([]));
  }, []);

  const categories = [...new Set(faqs.map(f => f.category))];

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="faq-section reveal">
      <div className="faq-inner">
        <header className="faq-head">
          <span className="section-eyebrow">— 05 · Preguntas frecuentes</span>
          <h2 className="section-title">Todo lo que<br /><em>querés saber.</em></h2>
        </header>
        <div className="faq-body">
          {categories.map(cat => (
            <div key={cat} className="faq-category">
              <h4 className="faq-cat-label">{cat}</h4>
              {faqs.filter(f => f.category === cat).map(faq => (
                <div key={faq.id}
                  className={"faq-item " + (open === faq.id ? "open" : "")}
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}>
                  <div className="faq-q">
                    <span>{faq.question}</span>
                    <svg className="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  {open === faq.id && (
                    <div className="faq-a">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contacto ──────────────────────────────────────────────────────────────────
function Contacto() {
  const { useState: useS } = React;
  const [form, setForm] = useS({ name:"", email:"", phone:"", subject:"", message:"" });
  const [status, setStatus] = useS("idle"); // idle | sending | success | error
  const [errMsg, setErrMsg] = useS("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Error al enviar");
      setStatus("success");
      setForm({ name:"", email:"", phone:"", subject:"", message:"" });
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <section id="contacto" className="contacto-section">
      <div className="contacto-inner">
        <div className="contacto-info reveal-stagger">
          <span className="section-eyebrow">— 06 · Contacto</span>
          <h2 className="section-title">Escribinos,<br /><em>respondemos rápido.</em></h2>
          <p className="contacto-lead">¿Dudas sobre un producto? ¿Querés hacer un pedido especial? ¿Necesitás más info sobre un talle? Escribinos y te respondemos a la brevedad.</p>
          <div className="contacto-links">
            <a href="https://instagram.com/eldiezbaires" target="_blank" rel="noopener" className="contacto-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              @eldiezbaires
            </a>
            <a href="https://wa.me/5491100000000" target="_blank" rel="noopener" className="contacto-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              WhatsApp
            </a>
          </div>
          <div className="contacto-maradona">
            <img src="uploads/278327-2048x2799-iphone-hd-diego-maradona-wallpaper-image.webp" alt="Diego Maradona" />
          </div>
        </div>

        <form className="contacto-form reveal" onSubmit={submit}>
          <h3 className="contacto-form-title">Mandanos un mensaje</h3>
          <div className="cf-row">
            <div className="cf-field">
              <label>Nombre <span className="req">*</span></label>
              <input type="text" placeholder="Tu nombre" required
                value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="cf-field">
              <label>Email <span className="req">*</span></label>
              <input type="email" placeholder="tu@email.com" required
                value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
          </div>
          <div className="cf-row">
            <div className="cf-field">
              <label>Teléfono / WhatsApp</label>
              <input type="tel" placeholder="+54 9 11..."
                value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
            <div className="cf-field">
              <label>Asunto</label>
              <select value={form.subject} onChange={e => set("subject", e.target.value)}>
                <option value="">— Seleccioná —</option>
                <option>Consulta sobre un producto</option>
                <option>Pedido especial</option>
                <option>Estado de mi pedido</option>
                <option>Devolución o cambio</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
          <div className="cf-field">
            <label>Mensaje <span className="req">*</span></label>
            <textarea required rows={5} placeholder="Escribí tu consulta acá…"
              value={form.message} onChange={e => set("message", e.target.value)} />
          </div>

          {status === "error" && (
            <div className="cf-error">{errMsg || "Error al enviar. Intentá de nuevo."}</div>
          )}
          {status === "success" && (
            <div className="cf-success">¡Mensaje enviado! Te respondemos a la brevedad.</div>
          )}

          <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
            {status === "sending" ? "Enviando…" : "Enviar mensaje →"}
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-top">
        <div className="foot-brand">
          <span className="logo-mark big">EL DIEZ <em>BAIRES</em></span>
          <span className="logo-sub">· Buenos Aires ·</span>
          <p>La camiseta no se mancha. Buenos Aires, desde 2025.</p>
        </div>
        <div className="foot-cols">
          <div>
            <h5>Tienda</h5>
            <a href="#catalogo">Catálogo completo</a>
            <a href="#catalogo">Camisetas Jugador</a>
            <a href="#catalogo">Camisetas Fan</a>
            <a href="#catalogo">Retro / Vintage</a>
          </div>
          <div>
            <h5>Ayuda</h5>
            <a href="#faq">Preguntas frecuentes</a>
            <a href="#faq">Talles y guía</a>
            <a href="#faq">Envíos</a>
            <a href="#faq">Devoluciones</a>
          </div>
          <div>
            <h5>Seguinos</h5>
            <a href="https://instagram.com/eldiezbaires" target="_blank" rel="noopener">Instagram</a>
            <a href="#contacto">Contacto</a>
            <a href="/admin">Admin</a>
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 El Diez Baires · Todas las camisetas, todas las historias.</span>
        <span>Hecho con pelota al pie en Buenos Aires.</span>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const { useEffect } = React;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Restaurar carrito guardado
  useEffect(() => {
    try {
      const saved = localStorage.getItem("eldiezCart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          localStorage.removeItem("eldiezCart");
        }
      }
    } catch {}
  }, []);

  const onAdd = product => setPending(product);
  const onConfirm = ({ size, custom_name, custom_number, patches, customization_price, line_price }) => {
    const p = pending;
    const newItem = {
      ...p,
      size, qty: 1,
      custom_name, custom_number, patches,
      customization_price, line_price,
    };
    setItems(prev => {
      const found = prev.find(it =>
        it.id === p.id && it.size === size &&
        it.custom_name === custom_name &&
        it.custom_number === custom_number &&
        JSON.stringify([...patches].sort()) === JSON.stringify([...(it.patches||[])].sort())
      );
      if (found) return prev.map(it => it === found ? { ...it, qty: it.qty + 1 } : it);
      return [...prev, newItem];
    });
    setPending(null);
    setCartOpen(true);
  };

  const cartCount = items.reduce((s, it) => s + it.qty, 0);
  const heroProps = { cartCount, onOpenCart: () => setCartOpen(true), showGiantTen: tweaks.showGiantTen, accent: tweaks.accentColor };

  return (
    <>
      {tweaks.heroVariant === "stadium"   && <HeroStadium   {...heroProps} />}
      {tweaks.heroVariant === "editorial" && <HeroEditorial {...heroProps} />}
      {tweaks.heroVariant === "minimal"   && <HeroMinimal   {...heroProps} />}

      <div className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 6 }).map((_, i) =>
            <span key={i}>★ La camiseta no se mancha · Jugador · Fan · Retro · Cuotas sin interés · Envíos a todo el país · El Diez Baires · Buenos Aires ·&nbsp;</span>
          )}
        </div>
      </div>

      <Catalog products={products} loading={loadingProducts} onAdd={onAdd} cardVariant={tweaks.cardVariant} showStamp={tweaks.showStamp} />
      <Historia showStamp={tweaks.showStamp} />
      <Testimonios />
      <FAQ />
      <Contacto />
      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={items} setItems={setItems} />
      <SizeModal product={pending} onClose={() => setPending(null)} onConfirm={onConfirm} />

      <TweaksPanel title="Tweaks · El Diez">
        <TweakSection label="Hero" />
        <TweakRadio label="Variante" value={tweaks.heroVariant} options={["stadium","editorial","minimal"]} onChange={v => setTweak("heroVariant", v)} />
        <TweakSection label="Tarjetas" />
        <TweakRadio label="Estilo" value={tweaks.cardVariant} options={["editorial","collectible"]} onChange={v => setTweak("cardVariant", v)} />
        <TweakSection label="Detalles" />
        <TweakToggle label="Sello autógrafo" value={tweaks.showStamp} onChange={v => setTweak("showStamp", v)} />
        <TweakToggle label="'10' gigante" value={tweaks.showGiantTen} onChange={v => setTweak("showGiantTen", v)} />
        <TweakColor label="Acento" value={tweaks.accentColor} onChange={v => setTweak("accentColor", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
