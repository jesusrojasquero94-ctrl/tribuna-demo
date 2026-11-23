// Genera estadios.html a partir de estadios.js (se vuelve a correr si cambia la lista)
const fs = require('fs'), path = require('path'), vm = require('vm');
const raiz = process.argv[2];
const ctx = {window: {}, location: {search: ''}, URLSearchParams};
vm.runInNewContext(fs.readFileSync(path.join(raiz, 'estadios.js'), 'utf8'), ctx);
const E = ctx.window.TRIBUNA_ESTADIOS;
const p404 = fs.readFileSync(path.join(raiz, '404.html'), 'utf8');
const simbolo = p404.match(/<svg width="0"[\s\S]*?<\/svg>/)[0];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const miles = n => n.toLocaleString('es-VE');
const tarjetas = Object.entries(E).map(([k, e]) => {
  const ps = Object.values(e.zonas).map(z => z[1]);
  return `    <li class="estadio" style="--acento:${e.acento}">
      <h2>${esc(e.nombre)}</h2>
      <p class="lugar">${esc(e.ciudad)}, ${esc(e.estado)}</p>
      <dl><div><dt>Capacidad</dt><dd>${miles(e.capacidad)}</dd></div><div><dt>Zonas</dt><dd>${ps.length}</dd></div><div><dt>Precios de ejemplo</dt><dd>$${Math.min(...ps)}–$${Math.max(...ps)}</dd></div></dl>
      <div class="acciones"><a class="boton" href="/?estadio=${k}">Ver la demo</a><a class="boton claro" href="/portal/?estadio=${k}">Portal del estadio</a></div>
      <p class="corta">Enlace corto: <a href="/${k}">tribuna.qiuagency.com/${k}</a></p>
    </li>`;
}).join('\n');
const n = Object.keys(E).length;
const html = `<!doctype html>
<html lang="es-VE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estadios | Tribuna, boletería inmersiva para Venezuela</title>
<meta name="description" content="La demo de Tribuna adaptada a ${n} estadios de la LVBP: Caracas, Maracaibo, Barquisimeto, Valencia, Puerto La Cruz, Margarita, La Guaira y Maracay.">
<meta name="theme-color" content="#070D1A">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="https://tribuna.qiuagency.com/estadios.html">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icono.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/legal.css">
<script src="/consentimiento.js" defer></script>
<style>
.texto{max-width:1180px}
.intro{max-width:64ch;color:#DCE4F2;margin:0 0 36px}
.estadios{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px}
.estadio{background:#0A1222;border:1px solid var(--borde);border-top:4px solid var(--acento);border-radius:18px;padding:20px 20px 16px;display:flex;flex-direction:column}
.estadio h2{font-family:var(--titulo);font-weight:800;font-size:30px;line-height:1;margin:0 0 6px}
.lugar{margin:0 0 16px;color:var(--suave)}
.estadio dl{display:grid;grid-template-columns:repeat(3,auto);gap:10px;margin:0 0 4px}
.estadio dt{font-size:13px;color:var(--suave)}
.estadio dd{margin:0;font-weight:700;font-size:19px;font-variant-numeric:tabular-nums}
.estadio .acciones{margin-top:16px}
.estadio .boton{font-size:15px;padding:11px 16px}
.estadio .boton:not(.claro){background:var(--acento)}
.corta{margin:14px 0 0;font-size:14px;color:var(--suave);margin-top:auto;padding-top:14px}
.otros{margin-top:56px;max-width:72ch}
</style>
</head>
<body>
<a class="salto" href="#contenido">Saltar al contenido</a>
${simbolo}
<header class="cabecera">
  <div class="ancho">
    <a class="chip marca" href="/" aria-label="Tribuna, inicio"><svg viewBox="0 0 709 447" aria-hidden="true"><use href="#simbolo"/></svg>Tribuna</a>
    <a class="chip ir" href="/portal/">Portal del cliente</a>
  </div>
</header>
<main id="contenido">
  <div class="ancho texto">
    <h1>Tribuna en cada estadio.</h1>
    <p class="intro">La misma taquilla, con el nombre, las zonas y los precios de cada recinto de la Liga Venezolana de Béisbol Profesional. Cada estadio tiene su enlace para enviarlo a la directiva y su portal para seguir ventas y cobros.</p>
    <ul class="estadios">
${tarjetas}
    </ul>
    <section class="otros">
      <h2>¿Fútbol, baloncesto o conciertos?</h2>
      <p>También se adapta al Olímpico de la UCV, al Pueblo Nuevo, al Cachamay, a los domos y a las arenas de conciertos. Cambian el plano y las vistas; la compra, los pagos y el portal funcionan igual. <a href="https://wa.me/584248831167" rel="noopener">Escríbenos por WhatsApp</a> y armamos la demo de tu recinto.</p>
      <p>Capacidades según fuentes públicas. Las imágenes del recorrido son una recreación genérica generada con inteligencia artificial; la versión final para cada estadio usa la recreación de ese recinto.</p>
    </section>
  </div>
</main>
<footer class="pie">
  <div class="ancho">
    <p><strong>Sitio desarrollado por Qiu Agency, de Qiu Capital Group C.A. RIF: J508801920.</strong></p>
    <p>Esta página es una demostración. No está afiliada a ningún equipo, liga ni estadio real. No se venden boletos y no se guarda ningún dato personal.</p>
    <nav aria-label="Legal">
      <a href="/privacidad.html">Política de privacidad</a>
      <a href="/terminos.html">Términos de uso</a>
      <button type="button" class="enlace" data-cookies>Preferencias de cookies</button>
      <a href="https://wa.me/584248831167" rel="noopener">Contacto</a>
    </nav>
  </div>
</footer>
</body>
</html>
`;
fs.writeFileSync(path.join(raiz, 'estadios.html'), html);
console.log('estadios.html', html.length);
