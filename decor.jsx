// Componentes auxiliares — placeholders, sello, ticket, etc.

// SVG placeholder de camiseta (silueta vectorial), recibe paleta
function JerseyPlaceholder({ palette = ["#FFFFFF", "#74ACDF"], badge, big = false, style }) {
  const [primary, secondary] = palette;
  const stripeOpacity = 0.85;
  return (
    <svg viewBox="0 0 200 220" style={style} role="img" aria-label="Camiseta">
      <defs>
        <pattern id={`stripes-${primary}-${secondary}`} patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill={primary} />
          <rect width="10" height="20" fill={secondary} opacity={stripeOpacity} />
        </pattern>
      </defs>
      {/* Cuerpo de camiseta */}
      <path
        d="M40 30 L75 15 Q100 30 125 15 L160 30 L185 55 L160 75 L155 85 L155 200 Q155 210 145 210 L55 210 Q45 210 45 200 L45 85 L40 75 L15 55 Z"
        fill={primary}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1"
      />
      {/* Detalle secundario: cuello */}
      <path d="M75 15 Q100 38 125 15 L120 22 Q100 32 80 22 Z" fill={secondary} opacity="0.9" />
      {/* Mangas */}
      <path d="M40 30 L15 55 L40 75 L55 60 Z" fill={secondary} opacity="0.6" />
      <path d="M160 30 L185 55 L160 75 L145 60 Z" fill={secondary} opacity="0.6" />
      {/* Número grande si big */}
      {big && (
        <text x="100" y="155" textAnchor="middle" fontFamily="'Playfair Display', serif"
              fontSize="80" fontWeight="900" fill={secondary} opacity="0.55">
          10
        </text>
      )}
      {badge && !big && (
        <text x="100" y="120" textAnchor="middle" fontFamily="'Playfair Display', serif"
              fontSize="22" fontWeight="700" fill={secondary} opacity="0.7">
          {badge}
        </text>
      )}
    </svg>
  );
}

// Sello tipo "autografiado" con tinta
function AutographStamp({ rotate = -8, size = 180, label = "AUTÉNTICO" }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        pointerEvents: "none",
      }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <filter id="rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
        </defs>
        <g filter="url(#rough)" stroke="#F6B40E" fill="none" strokeWidth="2.5" opacity="0.85">
          <circle cx="100" cy="100" r="88" />
          <circle cx="100" cy="100" r="78" strokeWidth="1.2" />
        </g>
        <text x="100" y="92" textAnchor="middle"
              fontFamily="'Playfair Display', serif" fontSize="28"
              fontWeight="900" fill="#F6B40E" letterSpacing="2">
          {label}
        </text>
        <text x="100" y="120" textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace" fontSize="9"
              fill="#F6B40E" letterSpacing="3" opacity="0.85">
          EL DIEZ BAIRES · BS AS
        </text>
        <text x="100" y="138" textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace" fontSize="8"
              fill="#F6B40E" letterSpacing="2" opacity="0.7">
          ★ ORIGINAL ★
        </text>
      </svg>
    </div>
  );
}

// Ticket vintage tipo entrada de cancha
function VintageTicket({ section = "POPULAR", row = "F", seat = "10", date = "22 · JUN · 1986" }) {
  return (
    <div className="ticket">
      <div className="ticket-stub">
        <div className="ticket-mini">EL DIEZ</div>
        <div className="ticket-num">10</div>
        <div className="ticket-mini">BAIRES</div>
      </div>
      <div className="ticket-perf"></div>
      <div className="ticket-main">
        <div className="ticket-hd">
          <span>★ ENTRADA ★</span>
          <span>N° 0086</span>
        </div>
        <div className="ticket-title">PARTIDO ETERNO</div>
        <div className="ticket-sub">{date}</div>
        <div className="ticket-grid">
          <div><label>SECTOR</label><b>{section}</b></div>
          <div><label>FILA</label><b>{row}</b></div>
          <div><label>ASIENTO</label><b>{seat}</b></div>
        </div>
      </div>
    </div>
  );
}

// "10" gigante decorativo de fondo
function GiantTen({ style, opacity = 0.08, color = "#F6B40E" }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900,
        fontStyle: "italic",
        color,
        opacity,
        lineHeight: 0.8,
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    >
      10
    </div>
  );
}

// Línea de cancha decorativa
function FieldLines({ style }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="none"
         style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }}>
      <g fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2">
        <rect x="40" y="40" width="720" height="520" />
        <line x1="400" y1="40" x2="400" y2="560" />
        <circle cx="400" cy="300" r="80" />
        <rect x="40" y="180" width="120" height="240" />
        <rect x="640" y="180" width="120" height="240" />
        <rect x="40" y="240" width="50" height="120" />
        <rect x="710" y="240" width="50" height="120" />
      </g>
    </svg>
  );
}

Object.assign(window, {
  JerseyPlaceholder, AutographStamp, VintageTicket, GiantTen, FieldLines,
});
