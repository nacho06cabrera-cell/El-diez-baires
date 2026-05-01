// Los productos se cargan desde la API — ver App en app-sections.jsx

window.SIZES = ["S", "M", "L", "XL"];
window.COUNTRIES = ["Argentina", "Italia", "España", "Inglaterra", "Brasil"];
window.TYPES = ["Selección", "Club"];
window.ERAS = ["Retro", "Actual"];
window.VERSIONS = ["Local", "Visitante", "Tercera"];

window.formatPrice = (n) =>
  "$" + n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
