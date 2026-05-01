// app-sections.jsx — Historia, Testimonios, Footer y App principal

function Historia({ showStamp }) {
  return (
    <section id="historia" className="historia" style={{ backgroundColor: "rgb(62, 153, 173)" }}>
      <div className="hist-grid">
        <div className="hist-text reveal-stagger">
          <span className="section-eyebrow">— 03 · La historia</span>
          <h2 className="section-title">Empezó en una mesa de café <em>de Boedo, en 2025.</em></h2>
          <p>Dos amigos, fanáticos del fútbol desde pibes. Una caja con camisetas viejas, una pelota gastada, y la idea de que cada tela tiene una historia que merece otra cancha.</p>
          <p><b>El Diez Baires</b> nació de esa amistad — del potrero al asado, del asado al partido del domingo. Dos hinchas que decidieron que las camisetas que les cambiaron la vida también podían cambiársela a otros.</p>
          <p>Hoy traemos camisetas de todas las épocas, países y clubes. Sin atajos, sin marketing barato. <em>La camiseta no se mancha.</em></p>
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
          <div style={{ position: "relative", height: 0 }}>
              <AutographStamp rotate={12} size={150} label="ETERNO" />
            </div>
          }
        </div>
      </div>
    </section>);

}

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
    { quote: "Le mandé la del Napoli del 87 a mi viejo, italiano. No lo podía creer. Me llamó llorando. Una cosa de locos, amigo.", name: "Joaquín L.", city: "San Telmo, CABA" }];


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
          {[...items, ...items].map((t, i) =>
          <article key={i} className="test-card">
              <div className="test-stars">★★★★★</div>
              <p className="test-quote">"{t.quote}"</p>
              <div className="test-foot">
                <b>{t.name}</b>
                <small>{t.city}</small>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer id="contacto" className="site-footer">
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
            <a href="#catalogo">Selecciones</a>
            <a href="#catalogo">Clubes</a>
            <a href="#catalogo">Retro</a>
          </div>
          <div>
            <h5>Ayuda</h5>
            <a href="#">Talles y guía</a>
            <a href="#">Envíos</a>
            <a href="#">Devoluciones</a>
            <a href="#">Contacto</a>
          </div>
          <div>
            <h5>Seguinos</h5>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
            <a href="#">YouTube</a>
            <a href="#">Newsletter</a>
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 El Diez Baires · Todas las camisetas, todas las historias.</span>
        <span>Hecho con pelota al pie en Buenos Aires.</span>
      </div>
    </footer>);

}

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
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const onAdd = (product) => setPending(product);
  const onConfirm = (size) => {
    const p = pending;
    setItems((prev) => {
      const found = prev.find((it) => it.id === p.id && it.size === size);
      if (found) return prev.map((it) => it === found ? { ...it, qty: it.qty + 1 } : it);
      return [...prev, { ...p, size, qty: 1 }];
    });
    setPending(null);
    setCartOpen(true);
  };

  const cartCount = items.reduce((s, it) => s + it.qty, 0);
  const heroProps = { cartCount, onOpenCart: () => setCartOpen(true), showGiantTen: tweaks.showGiantTen, accent: tweaks.accentColor };

  return (
    <>
      {tweaks.heroVariant === "stadium" && <HeroStadium {...heroProps} />}
      {tweaks.heroVariant === "editorial" && <HeroEditorial {...heroProps} />}
      {tweaks.heroVariant === "minimal" && <HeroMinimal {...heroProps} />}

      <div className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 6 }).map((_, i) =>
          <span key={i}>★ La camiseta no se mancha · Envíos a todo el país · Eternamente el diez · Buenos Aires desde 2025 ·&nbsp;</span>
          )}
        </div>
      </div>

      <Catalog products={products} loading={loadingProducts} onAdd={onAdd} cardVariant={tweaks.cardVariant} showStamp={tweaks.showStamp} />
      <Historia showStamp={tweaks.showStamp} />
      <Testimonios />
      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={items} setItems={setItems} />
      <SizeModal product={pending} onClose={() => setPending(null)} onConfirm={onConfirm} />

      <TweaksPanel title="Tweaks · El Diez">
        <TweakSection label="Hero" />
        <TweakRadio label="Variante" value={tweaks.heroVariant} options={["stadium", "editorial", "minimal"]} onChange={(v) => setTweak("heroVariant", v)} />
        <TweakSection label="Tarjetas" />
        <TweakRadio label="Estilo" value={tweaks.cardVariant} options={["editorial", "collectible"]} onChange={(v) => setTweak("cardVariant", v)} />
        <TweakSection label="Detalles" />
        <TweakToggle label="Sello autógrafo" value={tweaks.showStamp} onChange={(v) => setTweak("showStamp", v)} />
        <TweakToggle label="'10' gigante" value={tweaks.showGiantTen} onChange={(v) => setTweak("showGiantTen", v)} />
        <TweakColor label="Acento" value={tweaks.accentColor} onChange={(v) => setTweak("accentColor", v)} />
      </TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);