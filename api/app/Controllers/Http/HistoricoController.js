'use strict';

const Historico = use('App/Models/Historico');
const Tendencia = use('App/Models/Tendencia');
const moment = require('moment');

class HistoricoController {
  async index({ request, response }) {
    let { tendencia, productos, desde, hasta } = request.get();
    tendencia = tendencia || 1;
    productos = productos || [];
    hasta = hasta || moment().format('YYYY-MM-DD HH:mm:ss');
    desde =
      desde ||
      moment(hasta)
        .add(-100, 'days')
        .format('YYYY-MM-DD HH:mm:ss');

    let tendenciaDB = await Tendencia.query()
      .with('limites')
      .where('id', tendencia)
      .first();
    tendenciaDB = tendenciaDB.toJSON();

    let historicos = [];
    if (productos.length === 0) {
      historicos = await Historico.query()
        .where('tendencia_id', tendencia)
        .whereBetween('fecha', [desde, hasta])
        .orderBy('fecha', 'ASC')
        .fetch();
    } else {
      historicos = await Historico.query()
        .whereIn('codigo_producto', productos)
        .where('tendencia_id', tendencia)
        .whereBetween('fecha', [desde, hasta])
        .orderBy('fecha', 'ASC')
        .fetch();
    }

    const data = {
      desde,
      hasta,
      tendencia: {
        id: tendenciaDB.id,
        nombre: tendenciaDB.nombre,
        tag: tendenciaDB.tag
      },
      limites: tendenciaDB.limites,
      historicos: historicos,
      producto: null
    };

    response.status(200).json(data);
  }
}

module.exports = HistoricoController;
