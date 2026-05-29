// Datos globales de la tienda — disponibles en window.*

window.SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

window.JERSEY_TYPES = ["jugador", "fan", "retro"];

window.JERSEY_TYPE_LABELS = {
  jugador: "Jugador",
  fan: "Fan",
  retro: "Retro",
};

window.JERSEY_TYPE_PRICES = {
  jugador: 50000,
  fan: 40000,
  retro: 45000,
};

window.CUSTOMIZATION_PRICES = {
  name_number: 5000,
  patch: 2000,
};

window.LIGAS = {
  "Premier League":       ["Arsenal", "Chelsea", "Liverpool", "Manchester City", "Manchester United", "Tottenham", "Otros"],
  "La Liga":              ["Atlético de Madrid", "Barcelona", "Real Madrid", "Sevilla", "Valencia", "Otros"],
  "Serie A":              ["AC Milan", "Inter", "Juventus", "Napoli", "Roma", "Otros"],
  "Bundesliga":           ["Bayer Leverkusen", "Bayern Munich", "Borussia Dortmund", "Otros"],
  "Ligue 1":              ["Lyon", "Marseille", "Mónaco", "PSG", "Otros"],
  "Equipos Argentinos":   ["Boca Juniors", "Estudiantes", "Independiente", "Racing", "River Plate", "San Lorenzo", "Otros"],
  "Brasileirao":          ["Corinthians", "Flamengo", "Palmeiras", "Santos", "Vasco", "Otros"],
  "Selecciones":          ["Alemania", "Argentina", "Brasil", "España", "Francia", "Inglaterra", "Italia", "Portugal", "Uruguay", "Otras"],
};

window.PATCHES = [
  { id: "ucl",   label: "Champions League" },
  { id: "uel",   label: "Europa League"    },
  { id: "pl",    label: "Premier League"   },
  { id: "laliga",label: "La Liga"          },
  { id: "sa",    label: "Serie A"          },
  { id: "cap",   label: "Capitán"          },
  { id: "wc",    label: "Mundial"          },
  { id: "ca",    label: "Copa América"     },
];

window.formatPrice = (n) =>
  "$ " + Number(n).toLocaleString("es-AR", { maximumFractionDigits: 0 });
