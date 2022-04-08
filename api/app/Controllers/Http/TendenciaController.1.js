'use strict';

const Tendencia = use('App/Models/Tendencia');
const Limite = use('App/Models/Limite');
const Producto = use('App/Models/Producto');
const Historico = use('App/Models/Historico');
const Database = use('Database');
const moment = require('moment');
const mathjs = require('mathjs');
const Query = require('../../Utils/Query');

class TendenciaController {
  async index({ request, response }) {
    let query = Tendencia.query();
    const tendencias = await Query.builder(query, request);
    response.status(200).json(tendencias);
  }

  async store({ request, response }) {
    const data = request.only(['nombre', 'tipo', 'descripcion', 'tag']);
    const tendencia = await Tendencia.create(data);

    response.status(201).json(tendencia);
  }

  async show({ request, response, params: { id } }) {
    let { fechas, producto, tiempoReal } = request.get();
    let tendencia = await Tendencia.findOrFail(id);

    let data = {
      tendencia: tendencia
    };
    if (!tendencia) {
      response.status(404).json({
        message: 'Tendencia no encontrada.',
        id
      });
      return;
    }

    // Seteo valor por defecto de request sin no vienen
    fechas = fechas
      ? [
          moment(fechas[0])
            .add(3, 'hours')
            .format('YYYY-MM-DD HH:mm:ss'),
          moment(fechas[1])
            .add(3, 'hours')
            .format('YYYY-MM-DD HH:mm:ss')
        ]
      : [
          moment()
            .add(-7, 'days')
            .format('YYYY-MM-DD HH:mm:ss'),
          moment().format('YYYY-MM-DD HH:mm:ss')
        ];
    tiempoReal = tiempoReal === 'true' ? true : false;

    if (tiempoReal) {
      await Database.table('tendencias').update('tiempo_real', false);

      await Database.table('tendencias')
        .where('id', id)
        .update('tiempo_real', true);
    }

    let productosAgrupados = await Database.table('historicos')
      .select('codigo_producto')
      .where('tendencia_id', id)
      .whereBetween('fecha', fechas)
      .groupBy('codigo_producto')
      .orderBy('codigo_producto', 'DESC');

    productosAgrupados = productosAgrupados
      .map(producto => `${producto.codigo_producto}`)
      .filter(producto => producto);

    let listadoProductosAgrupados = await Producto.query()
      .whereIn('codigo', productosAgrupados)
      .fetch();
    listadoProductosAgrupados = listadoProductosAgrupados.toJSON();

    const productosAgrupadosFiltrados = productosAgrupados.map(item => {
      const productoBuscado = listadoProductosAgrupados.find(producto => {
        if (producto.codigo === item) {
          return true;
        }
      });

      if (productoBuscado) {
        return productoBuscado;
      } else {
        return {
          id: null,
          codigo: item !== 'null' ? item : null,
          descripcion: null
        };
      }
    });

    let productoActual = await tendencia.producto_actual().fetch();
    let productoUltimo = await Database.table('historicos')
      .where('tendencia_id', id)
      .whereNotNull('codigo_producto')
      .orderBy('fecha', 'DESC')
      .first();
    productoUltimo = productoUltimo ? productoUltimo.codigo_producto : '';
    producto = producto || productoUltimo;

    // Consulto tags de tendencia
    let historicos = await Historico.query()
      .where('tendencia_id', id)
      .where('codigo_producto', producto)
      .whereBetween('fecha', fechas)
      .fetch();
    historicos = historicos.toJSON();

    let limite = await tendencia
      .limite()
      .where('codigo_producto', producto)
      .fetch();
    limite = limite
      ? limite
      : {
          lh_1sigma: 0,
          ll_1sigma: 0,
          lh_2sigma: 0,
          ll_2sigma: 0,
          lh_3sigma: 0,
          ll_3sigma: 0,
          usl: 0,
          lsl: 0,
          usl_rango: 0,
          lsl_rango: 0,
          media: 0,
          media_rango: 0,
          tendencia_id: tendencia.id
        };
    // Separo historicos de PV y SP
    const historicosPV = historicos
      .map(historico => {
        return {
          fecha: historico.fecha,
          valor: historico.pv
        };
      })
      .filter(historico => historico);

    const historicosSP = historicos
      .map(historico => {
        return {
          fecha: historico.fecha,
          valor: historico.sp
        };
      })
      .filter(historico => historico);

    let productoAct = {
      codigo: '',
      descripcion: ''
    };

    let productoUlt = {
      codigo: '',
      descripcion: ''
    };

    let productoFil = {
      codigo: '',
      descripcion: ''
    };

    if (productoActual) {
      let productoActAux = {
        codigo: '',
        descripcion: ''
      };
      try {
        productoActAux = await Producto.query()
          .where('codigo', productoActual.codigo_producto)
          .first(); 
        
      } catch (error) {
        
      }
      
      if (productoActAux) {
        productoAct = productoActAux;
      } else {
        productoAct.codigo = productoActual.codigo_producto;
      }
    }

    if (productoUltimo) {

      try {      
        productoUlt = await Producto.query()
        .where('codigo', productoUltimo)
        .first();
      } catch (error) {
        
      }

      productoUlt = productoUlt
        ? productoUlt
        : {
            codigo: '',
            descripcion: ''
          };
    }
    if (producto) {

      try {
        productoFil = await Producto.query()
          .where('codigo', producto)
          .first();        
      } catch (error) {
        
      }


      productoFil = productoFil
        ? productoFil
        : {
            codigo: producto,
            descripcion: ''
          };
    }

    data.desde = fechas[0];
    data.hasta = fechas[1];
    data.historicosPV = historicosPV;
    data.historicosSP = historicosSP;
    data.historicosProductos = productosAgrupadosFiltrados;
    data.productoActual = productoAct;
    data.productoUltimo = productoUlt;
    data.productoFiltrado = productoFil;
    data.limite = limite;

    response.status(200).json(data);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['nombre', 'descripcion', 'tiempo_real']);
    const tendencia = await Tendencia.find(id);

    if (!tendencia) {
      response.status(404).json({
        message: 'Tendencia no encontrada.',
        id
      });
      return;
    }

    tendencia.nombre = data.nombre || tendencia.nombre;
    tendencia.descripcion = data.descripcion || tendencia.descripcion;
    tendencia.tiempo_real = data.tiempo_real ? true : false;

    await tendencia.save();

    response.status(200).json(tendencia);
  }

  async cambiarTV({ request, response, params: { id } }) {
    const data = request.only(['tv']);
    const transaction = await Database.transaction(async trx => {
      await Database.table('tendencias')
        .where('tv', data.tv)
        .update('tv', null);

      await Database.table('tendencias')
        .where('id', id)
        .update('tv', data.tv);

      return true;
    });

    response.status(200).json(transaction);
  }

  async cambiarNombre({ request, response, params: { id } }) {
    const data = request.only(['nombre']);
    const tendencia = await Tendencia.find(id);

    if (!tendencia) {
      response.status(404).json({
        message: 'Tendencia no encontrada.',
        id
      });
      return;
    }

    tendencia.nombre = data.nombre || tendencia.nombre;

    response.status(200).json(transaction);
  }

  async destroy({ request, response, params: { id } }) {
    const tendencia = await Tendencia.find(id);

    if (!tendencia) {
      response.status(404).json({
        message: 'Tendencia no encontrada.',
        id
      });
      return;
    }
    await tendencia.delete();

    response.status(200).json(tendencia);
  }

  async limiteHistoricos({ request, response, params: { id } }) {
    const data = request.only(['cantidadHistoricos', 'codigoProducto']);
    const cantidadHistoricos = data.cantidadHistoricos || 30;
    const codigoProducto = data.codigoProducto || null;
    const tendencia = await Tendencia.findOrFail(id);

    const fechas = [
      moment()
        .add(-7, 'days')
        .format('YYYY-MM-DD HH:mm:ss'),
      moment().format('YYYY-MM-DD HH:mm:ss')
    ];

    let std = 0;
    let media = 0;
    let query = '';
    let historicos = [];

    if (codigoProducto) {
      query = `SELECT AVG(A.pv) as media, STDEV(A.pv) as std FROM (SELECT TOP ${cantidadHistoricos} fecha, pv FROM historicos WHERE tendencia_id = '${
        tendencia.id
      }' AND codigo_producto = ${codigoProducto} ORDER BY fecha DESC) AS A`;
      historicos = await Database.raw(query);
    } else {
      historicos = [];
    }
    if (historicos.length === 1) {
      std = historicos[0].std;
      media = historicos[0].media;

      std = std ? std : 0;
      media = media ? media : 0;
    }

    // Calculo datos necesarios para limites
    const lh_1sigma = media + std * 1;
    const ll_1sigma = media - std * 1;
    const lh_2sigma = media + std * 2;
    const ll_2sigma = media - std * 2;
    const lh_3sigma = media + std * 3;
    const ll_3sigma = media - std * 3;

    let limite = {
      lh_1sigma: mathjs.round(lh_1sigma, 2),
      ll_1sigma: mathjs.round(ll_1sigma, 2),
      lh_2sigma: mathjs.round(lh_2sigma, 2),
      ll_2sigma: mathjs.round(ll_2sigma, 2),
      lh_3sigma: mathjs.round(lh_3sigma, 2),
      ll_3sigma: mathjs.round(ll_3sigma, 2),
      usl: null,
      lsl: null,
      usl_rango: null,
      lsl_rango: null,
      media: mathjs.round(media, 2),
      media_rango: null,
      codigo_producto: codigoProducto,
      tendencia_id: parseInt(id)
    };

    response.status(200).json(limite);
  }

  async indexTags({ request, response, params: { id } }) {
    const tendencia = await Tendencia.find(id);

    if (!tendencia) {
      response.status(404).json({
        message: 'Tendencia no encontrada.',
        id
      });
      return;
    }

    let query = tendencia.tags();
    const tendencias = await Query.builder(query, request);
    response.status(200).json(tendencias);
  }

  async indexLimites({ request, response, params: { id } }) {
    const tendencia = await Tendencia.find(id);

    if (!tendencia) {
      response.status(404).json({
        message: 'Tendencia no encontrada.',
        id
      });
      return;
    }

    let query = tendencia.limites();
    const limites = await Query.builder(query, request);
    response.status(200).json(limites);
  }
}

module.exports = TendenciaController;
