/* Tribuna: aviso de cookies y estadísticas que solo se cargan con permiso */
(function(){
  'use strict';
  // ID de medición de Google Analytics 4 (G-XXXXXXX). Vacío: no se carga nada.
  var GA_ID = '';
  var CLAVE = 'tribuna-cookies';
  function leer(){ try { return JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) { return null; } }
  function guardar(v){ try { localStorage.setItem(CLAVE, JSON.stringify({estadistica: v, fecha: new Date().toISOString().slice(0, 10)})); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});

  var cargado = false;
  function activarEstadistica(){
    gtag('consent', 'update', {analytics_storage: 'granted'});
    if (!GA_ID || cargado) return;
    cargado = true;
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag('js', new Date()); gtag('config', GA_ID, {anonymize_ip: true});
  }
  // Evento de conversión para el botón principal (solo llega si hay permiso)
  document.addEventListener('click', function(ev){
    var b = ev.target.closest && ev.target.closest('[data-acc="reservar"], .ir, a[href="#taquilla"]');
    if (b && cargado) gtag('event', b.getAttribute('data-acc') === 'reservar' ? 'reservar_asiento' : 'abrir_taquilla');
  });

  var css = '.galleta{position:fixed;left:16px;right:16px;bottom:16px;z-index:80;max-width:620px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;padding:16px 16px 16px 20px;background:rgba(8,15,31,.94);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.16);border-radius:18px;color:#F3F5F1;font:15px/1.45 "Hanken Grotesk",system-ui,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.45);transition:opacity .2s ease,transform .2s cubic-bezier(.23,1,.32,1)}' +
    '.galleta[hidden]{display:none}.galleta.sale{opacity:0;transform:translateY(12px)}' +
    '.galleta p{margin:0;flex:1 1 280px}.galleta a{color:#fff;text-underline-offset:3px}' +
    '.galleta .botones{display:flex;gap:8px}.galleta button{min-height:44px;border:0;border-radius:12px;padding:10px 18px;font:700 15px "Hanken Grotesk",system-ui,sans-serif;cursor:pointer;transition:transform .15s cubic-bezier(.23,1,.32,1),background-color .15s ease}' +
    '.galleta button:active{transform:scale(.97)}.galleta .si{background:#FF8A1F;color:#0E1F3D}.galleta .no{background:rgba(255,255,255,.14);color:#fff}' +
    '.galleta button:focus-visible,.galleta a:focus-visible{outline:3px solid #FF8A1F;outline-offset:2px}' +
    '@media (hover:hover){.galleta .si:hover{background:#FFA24D}.galleta .no:hover{background:rgba(255,255,255,.24)}}' +
    '@media (prefers-reduced-motion:reduce){.galleta{transition:none}}';

  var caja = null;
  function mostrar(){
    if (!caja) {
      var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
      caja = document.createElement('section');
      caja.className = 'galleta'; caja.setAttribute('aria-label', 'Preferencias de cookies');
      caja.innerHTML = '<p>Usamos cookies de estadística para saber cómo se usa esta demo, solo si las aceptas. Ninguna guarda datos personales. <a href="/privacidad.html#cookies">Más información</a></p>' +
        '<div class="botones"><button type="button" class="no" data-galleta="0">Rechazar</button><button type="button" class="si" data-galleta="1">Aceptar</button></div>';
      caja.addEventListener('click', function(ev){
        var b = ev.target.closest('[data-galleta]'); if (!b) return;
        var si = b.getAttribute('data-galleta') === '1';
        guardar(si); if (si) activarEstadistica(); else gtag('consent', 'update', {analytics_storage: 'denied'});
        caja.classList.add('sale'); setTimeout(function(){ caja.hidden = true; caja.classList.remove('sale'); }, 200);
      });
      document.body.appendChild(caja);
    }
    caja.hidden = false;
  }
  function iniciar(){
    var v = leer();
    if (v && v.estadistica) activarEstadistica();
    if (!v) mostrar();
    document.addEventListener('click', function(ev){ if (ev.target.closest && ev.target.closest('[data-cookies]')) { mostrar(); var b = caja.querySelector('.si'); if (b) b.focus(); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
