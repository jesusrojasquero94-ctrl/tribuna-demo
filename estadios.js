/* Tribuna: un archivo por cliente. Cada estadio cambia nombre, ciudad, zonas, precios y color.
   Se abre con /?estadio=clave o con la ruta corta /clave (la resuelve 404.html).
   Precios por juego de ejemplo; los nombres de zona siguen la forma en que cada recinto suele venderlas.
   Las 11 zonas dibujadas son: sc centrales, pd/pi preferencial 1B/3B, ld/li lateral 1B/3B, vip palcos,
   cl club, td/ti tribuna alta 1B/3B, gd/gi gradas de jardín derecho/izquierdo. */
(function(){
  'use strict';
  var E = {
    'monumental': {
      nombre: 'Estadio Monumental Simón Bolívar', corto: 'Monumental de Caracas', ciudad: 'La Rinconada, Caracas', estado: 'Distrito Capital',
      capacidad: 40000, deporte: 'Béisbol', acento: '#FF8A1F',
      zonas: {sc:['Sillas centrales',30], vip:['VIP',45], cl:['Club 600',25], pd:['Zona 1 primera base',20], pi:['Zona 1 tercera base',20],
              ld:['Zona 2 primera base',13], li:['Zona 2 tercera base',13], td:['Zona 3 primera base',8], ti:['Zona 3 tercera base',8], gd:['Jardín derecho',6], gi:['Jardín izquierdo',6]}
    },
    'luis-aparicio': {
      nombre: 'Estadio Luis Aparicio "El Grande"', corto: 'Luis Aparicio', ciudad: 'Maracaibo', estado: 'Zulia',
      capacidad: 24000, deporte: 'Béisbol', acento: '#F2B632',
      zonas: {sc:['Sillas centrales',25], vip:['Palcos VIP',40], cl:['Club',22], pd:['Preferencial primera base',16], pi:['Preferencial tercera base',16],
              ld:['Lateral primera base',11], li:['Lateral tercera base',11], td:['Tribuna alta primera base',7], ti:['Tribuna alta tercera base',7], gd:['Gradas jardín derecho',5], gi:['Gradas jardín izquierdo',5]}
    },
    'antonio-herrera': {
      nombre: 'Estadio Antonio Herrera Gutiérrez', corto: 'Antonio Herrera Gutiérrez', ciudad: 'Barquisimeto', estado: 'Lara',
      capacidad: 20450, deporte: 'Béisbol', acento: '#FF5A4E',
      zonas: {sc:['Central',22], vip:['VIP Terreno',45], cl:['VIP Gold',35], pd:['VIP Premium primera base',18], pi:['VIP Premium tercera base',18],
              ld:['Lateral primera base',10], li:['Lateral tercera base',10], td:['Preferencial primera base',7], ti:['Preferencial tercera base',7], gd:['Gradas jardín derecho',5], gi:['Gradas jardín izquierdo',5]}
    },
    'jose-bernardo-perez': {
      nombre: 'Estadio José Bernardo Pérez', corto: 'José Bernardo Pérez', ciudad: 'Valencia', estado: 'Carabobo',
      capacidad: 16000, deporte: 'Béisbol', acento: '#3FA9F5',
      zonas: {sc:['Tribuna principal',30], vip:['Terraza',30], cl:['Tribuna central',24], pd:['Box A primera base',20], pi:['Box A tercera base',20],
              ld:['Lateral baja primera base',16], li:['Lateral baja tercera base',16], td:['Lateral alta primera base',12], ti:['Lateral alta tercera base',12], gd:['Box B jardín derecho',10], gi:['Box B jardín izquierdo',10]}
    },
    'chico-carrasquel': {
      nombre: 'Estadio Alfonso "Chico" Carrasquel', corto: 'Chico Carrasquel', ciudad: 'Puerto La Cruz', estado: 'Anzoátegui',
      capacidad: 18000, deporte: 'Béisbol', acento: '#FF8A1F',
      zonas: {sc:['Sillas centrales',25], vip:['Palcos VIP',38], cl:['Club',20], pd:['Preferencial primera base',15], pi:['Preferencial tercera base',15],
              ld:['Lateral primera base',10], li:['Lateral tercera base',10], td:['Tribuna alta primera base',7], ti:['Tribuna alta tercera base',7], gd:['Gradas jardín derecho',6], gi:['Gradas jardín izquierdo',6]}
    },
    'nueva-esparta': {
      nombre: 'Estadio Nueva Esparta', corto: 'Nueva Esparta', ciudad: 'Isla de Margarita', estado: 'Nueva Esparta',
      capacidad: 18000, deporte: 'Béisbol', acento: '#2EC4B6',
      zonas: {sc:['Sillas inferiores',14], vip:['Sillas VIP terreno',35], cl:['Sillas VIP',20], pd:['Palco primera base',20], pi:['Palco tercera base',20],
              ld:['Sillas laterales primera base',6], li:['Sillas laterales tercera base',6], td:['Sillas superiores primera base',5], ti:['Sillas superiores tercera base',5], gd:['Gradas jardín derecho',4], gi:['Gradas jardín izquierdo',4]}
    },
    'la-guaira': {
      nombre: 'Estadio Jorge Luis García Carneiro', corto: 'Estadio de La Guaira', ciudad: 'Macuto', estado: 'La Guaira',
      capacidad: 14300, deporte: 'Béisbol', acento: '#4CC3FF',
      zonas: {sc:['Sillas centrales',30], vip:['Palco terreno y central',60], cl:['Palco central',45], pd:['Terreno lateral primera base',20], pi:['Terreno lateral tercera base',20],
              ld:['Zona 1 primera base',14], li:['Zona 1 tercera base',14], td:['Zona 2 primera base',9], ti:['Zona 2 tercera base',9], gd:['Zona 3 jardín derecho',5], gi:['Zona 3 jardín izquierdo',5]}
    },
    'jose-perez-colmenares': {
      nombre: 'Estadio José Pérez Colmenares', corto: 'José Pérez Colmenares', ciudad: 'Maracay', estado: 'Aragua',
      capacidad: 12647, deporte: 'Béisbol', acento: '#FFB000',
      zonas: {sc:['Central con malla',10], vip:['Palco terreno',25], cl:['Palco central',18], pd:['Central sin malla primera base',8], pi:['Central sin malla tercera base',8],
              ld:['Lateral primera base',7], li:['Lateral tercera base',7], td:['Tribuna alta primera base',5], ti:['Tribuna alta tercera base',5], gd:['Gradas jardín derecho',4], gi:['Gradas jardín izquierdo',4]}
    }
  };
  window.TRIBUNA_ESTADIOS = E;
  // Estadio pedido en la dirección: ?estadio=clave
  var clave = null;
  try { clave = new URLSearchParams(location.search).get('estadio'); } catch (e) {}
  window.TRIBUNA_ESTADIO = clave && E[clave] ? Object.assign({clave: clave}, E[clave]) : null;
})();
