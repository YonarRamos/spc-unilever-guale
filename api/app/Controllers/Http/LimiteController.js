'use strict';

const Limite = use('App/Models/Limite');
const Historico = use('App/Models/Historico');
const Database = use('Database');
const moment = require('moment');
const mathjs = require('mathjs');

class LimiteController {
  async index({ request, response }) {
    try{
    let { tendencia, productos, desde, hasta } = request.get();
    tendencia = tendencia || null;
    productos = productos || [];
    hasta = hasta || moment().format('YYYY-MM-DD HH:mm:ss');
    desde =
      desde ||
      moment(hasta)
        .add(-100, 'days')
        .format('YYYY-MM-DD HH:mm:ss');

    let limites = [];
    if (productos.length === 0) {
      limites = await Limite.query()
        .where('tendencia_id', tendencia)
        .whereBetween('ini', [desde, hasta])
        .orderBy('ini', 'ASC')
        .fetch();
    } else {
      limites = await Limite.query()
        .whereIn('codigo_producto', productos)
        .where('tendencia_id', tendencia)
        .whereBetween('ini', [desde, hasta])
        .orderBy('ini', 'ASC')
        .fetch();
    }
    response.status(200).json(limites);
  }catch(error){
    console.log(error)
  }
  }

  async store({ request, response }) {
    try{
    const data = request.only([
      'lh_1sigma',
      'll_1sigma',
      'lh_2sigma',
      'll_2sigma',
      'lh_3sigma',
      'll_3sigma',
      'usl',
      'lsl',
      'usl_rango',
      'lsl_rango',
      'media',
      'media_rango',
      'ultimo',
      'codigo_producto',
      'tendencia_id'
    ]);

    data.int1 = moment().format('YYYY-MM-DD HH:mm:ss')
    const limite = await Limite.create(data);
    response.status(201).json(limite);
  }catch(error){
    console.log(error)
  }
  }

  async show({ request, response, params: { id } }) {
    const limite = await Limite.findOrFail(id);
    
    if (!limite) {
      response.status(404).json({
        message: 'Limite no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(resp);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only([
      'lh_1sigma',
      'll_1sigma',
      'lh_2sigma',
      'll_2sigma',
      'lh_3sigma',
      'll_3sigma',
      'usl',
      'lsl',
      'usl_rango',
      'lsl_rango',
      'media',
      'media_rango',
      'codigo_producto',
      'tendencia_id'
    ]);
    const limite = await Limite.find(id);

    if (!limite) {
      response.status(404).json({
        message: 'Limite no encontrada.',
        id
      });
      return;
    }
    var newLimite = {}
    newLimite.lh_1sigma = data.lh_1sigma || limite.lh_1sigma;
    newLimite.ll_1sigma = data.ll_1sigma || limite.ll_1sigma;
    newLimite.lh_2sigma = data.lh_2sigma || limite.lh_2sigma;
    newLimite.ll_2sigma = data.ll_2sigma || limite.ll_2sigma;
    newLimite.lh_3sigma = data.lh_3sigma || limite.lh_3sigma;
    newLimite.ll_3sigma = data.ll_3sigma || limite.ll_3sigma;
    newLimite.usl = data.usl || limite.usl;
    newLimite.lsl = data.lsl || limite.lsl;
    newLimite.usl_rango = data.usl_rango || limite.usl_rango;
    newLimite.lsl_rango = data.lsl_rango || limite.lsl_rango;
    newLimite.media = data.media || limite.media;
    newLimite.media_rango = data.media_rango || limite.media_rango;
    newLimite.codigo_producto = data.codigo_producto || limite.codigo_producto;
    newLimite.tendencia_id = data.tendencia_id || limite.tendencia_id;
    newLimite.ini = moment().format('YYYY-MM-DD HH:mm:ss')
    limite.end = moment().format('YYYY-MM-DD HH:mm:ss')
    await limite.save();
    await Limite.create(newLimite);

    response.status(200).json(limite);
  }

  async destroy({ request, response, params: { id } }) {
    const limite = await Limite.find(id);

    if (!limite) {
      response.status(404).json({
        message: 'Limite no encontrada.',
        id
      });
      return;
    }

    const tendencia_id = limite.tendencia_id;
    const transaction = await Database.transaction(async trx => {
      await limite.delete();

      const limiteUpdate = await Limite.query()
        .orderBy('created_at', 'DESC')
        .where('tendencia_id', tendencia_id)
        .where('codigo_producto', limite.codigo_producto)
        .whereNot('id', id)
        .first();

      if (limiteUpdate) {
        await trx
          .table('limites')
          .where('id', limiteUpdate.id)
          .update({ ultimo: true });
      }

      return true;
    });

    response.status(201).json(transaction);
  }

  async limiteByHistoricos({ request, response }) {
    const data = request.only(['tendencia', 'codigo_producto']);
    const codigoProducto = data.codigo_producto || null;

    const historicos = await Database.table('historicos')
      .where('tendencia_id', data.tendencia)
      .orderBy('fecha', 'ASC')
      .offset(0)
      .limit(30);

    // Calculo datos necesarios para limites
    let pv = historicos.map(item => {
      return item.pv;
    });

    let rangos = pv
      .map((item, i) => {
        if (i < pv.length - 1) {
          return mathjs.round(Math.abs(pv[i + 1] - pv[i]), 2);
        }
      })
      .filter(item => {
        if (item) {
          return true;
        }
      });

    let limite = null;
    if (pv.length > 3) {
      let std = mathjs.std(pv);
      let std_rango = mathjs.std(rangos);
      let media_historica = mathjs.mean(pv);
      let media_rango_historica = mathjs.median(rangos);

      const lh_1sigma = media + std * 1;
      const ll_1sigma = media - std * 1;
      const lh_2sigma = media + std * 2;
      const ll_2sigma = media - std * 2;
      const lh_3sigma = media + std * 3;
      const ll_3sigma = media - std * 3;
      const usl = media + std * 4;
      const lsl = media - std * 4;
      const usl_rango = media_rango + std_rango * 1;
      const lsl_rango = media_rango - std_rango * 1;
      const media = media_historica;
      const media_rango = media_rango_historica;

      limite = {
        lh_1sigma: mathjs.round(lh_1sigma, 2),
        ll_1sigma: mathjs.round(ll_1sigma, 2),
        lh_2sigma: mathjs.round(lh_2sigma, 2),
        ll_2sigma: mathjs.round(ll_2sigma, 2),
        lh_3sigma: mathjs.round(lh_3sigma, 2),
        ll_3sigma: mathjs.round(ll_3sigma, 2),
        usl: mathjs.round(usl, 2),
        lsl: mathjs.round(lsl, 2),
        usl_rango: mathjs.round(usl_rango, 2),
        lsl_rango: mathjs.round(lsl_rango, 2),
        media: mathjs.round(media, 2),
        media_rango: mathjs.round(media_rango, 2),
        codigo_producto: codigoProducto,
        tendencia_id: data.tendencia
      };
    }

    response.status(200).json(limite);
  }
}

module.exports = LimiteController;
