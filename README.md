# Tribuna (demo)

Demo de concepto de boletería para estadios venezolanos: eliges una zona sobre la vista aérea del estadio, escoges tu asiento y ves el terreno desde ahí antes de pagar.

- Sitio: https://tribuna.qiuagency.com
- Es una demostración. Los equipos, el partido y los precios son inventados; no se venden boletos ni se procesan pagos.
- Las imágenes del estadio son recreaciones generadas con inteligencia artificial.
- Sitio estático: no necesita compilación para publicarse.

## Páginas

| Ruta | Qué es |
| --- | --- |
| `/` | La demo: recorrido guiado por el scroll y taquilla. |
| `/?estadio=clave` o `/clave` | La misma demo con el nombre, las zonas, los precios y el color de un estadio. |
| `/estadios.html` | Los 8 estadios de la LVBP con su enlace de demo y su portal. |
| `/portal/?estadio=clave` | Portal del estadio (demo): ventas, cobros por Pago Móvil, Zelle y USDT, conciliación, cortes y CSV. |

Claves: `monumental`, `luis-aparicio`, `antonio-herrera`, `jose-bernardo-perez`, `chico-carrasquel`, `nueva-esparta`, `la-guaira`, `jose-perez-colmenares`.

## Añadir o cambiar un estadio

1. Edita `estadios.js`: nombre, ciudad, capacidad, color y nombre y precio de cada una de las 11 zonas.
2. Si es nuevo, añade su clave a la lista de `404.html` (rutas cortas).
3. Vuelve a generar la página de estadios: `node herramientas/generar_estadios.js .`

## Cómo carga el recorrido

- `cuadros/b/` (640 px, WebP, ~3,7 MB en total) llega completo primero, empezando por las paradas.
- Con eso el recorrido ya se puede deslizar; luego se piden cuadros de detalle solo alrededor del punto donde va el scroll, y se sueltan al alejarse:
  `cuadros/hd/` (1920 px, AVIF, reescalados) en pantallas grandes o teléfonos de alta densidad, y `cuadros/` (960 px, WebP) en pantallas pequeñas o navegadores sin AVIF.
- Con ahorro de datos o 2G solo se usa la base; si la red medida es lenta, la ventana de detalle se achica.
- Entre dos cuadros vecinos se funden ambos, así el movimiento se ve continuo.
- Las fotos de la taquilla esperan a que la taquilla esté cerca de la pantalla; en pantallas grandes se usan las versiones `-hd.webp` (2048 px).
- `sw.js` guarda imágenes y cuadros en caché: la segunda visita abre sin volver a descargarlos. Si cambian las imágenes, sube `VERSION` en `sw.js`.

Para rehacer los cuadros: `herramientas/escalar.py` reescala cada cuadro x4 con Real-ESRGAN (ncnn, CPU) y `herramientas/preparar_cuadros.py` genera la base y el HD.

Sitio desarrollado por Qiu Agency, de Qiu Capital Group C.A. RIF: J508801920.
