'use strict';

const moment = require('moment');

var FechaAdquisicion = {
  async arrayIteraciones(desde, hasta) {
    // Saco 3 minutos para compensar hora con la del servidor

    desde = moment(desde);
    hasta = moment(hasta);

    let i = 0;
    let arrayIteraciones = [];
    const iteraciones = hasta.diff(desde, 'days');
    if (iteraciones >= 0) {
      if (iteraciones === 0) {
        arrayIteraciones.push({
          desde: desde.format('YYYY-MM-DD HH:mm:ss'),
          hasta: hasta.format('YYYY-MM-DD HH:mm:ss')
        });
      } else {
        let fechaInicial = moment(desde);

        for (i; i < iteraciones + 1; i++) {
          arrayIteraciones.push({
            desde: fechaInicial.format('YYYY-MM-DD HH:mm:ss'),
            hasta: fechaInicial.add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
          });
        }
        arrayIteraciones[arrayIteraciones.length - 1].hasta = hasta.format('YYYY-MM-DD HH:mm:ss');

        arrayIteraciones = arrayIteraciones.filter(item => {
          if (item.desde !== item.hasta) {
            return true;
          }
        });
      }
    }

    return arrayIteraciones;
  }
};

module.exports = FechaAdquisicion;
