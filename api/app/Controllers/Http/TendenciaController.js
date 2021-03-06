'use strict';

const Tendencia = use('App/Models/Tendencia');
const Limite = use('App/Models/Limite');
const Producto = use('App/Models/Producto');
const Historico = use('App/Models/Historico');
const Database = use('Database');
const moment = require('moment');
const mathjs = require('mathjs');
const Query = require('../../Utils/Query');
const Adquisicion = require('../../Jobs/Adquisicion');
const _ = require('lodash');
const { Promise } = require('mssql');

function sortFunction(a,b){  
  var dateA = new Date(a.fecha).getTime();
  var dateB = new Date(b.fecha).getTime();
  return dateA < dateB ? 1 : -1;  
}; 

class TendenciaController {
  async indexTV({ request, response }) {
    const{ tv }= request.only(['tv']);

    let query = Tendencia.query();
    if(tv){
      query.where('tv', '>=', 1)
      query.with('limites')

    }
    const tendencias = await Query.builder(query, request);
    return response.status(200).json(tendencias);
  }

  async index({ request, response }) {
    const{ tv, fechas }= request.only(['tv', 'fechas']);

    let query = Tendencia.query();
    /* if(tv){
      query.where('tv', '>=', 1)
      query.with('limites')

    } */
    console.log('FECHAS::', fechas)
    if(fechas && fechas.length > 0){
      let datos = await Historico.query().whereBetween('fecha',fechas).fetch()
      datos = datos.toJSON()
      let res = {
        tendencia:null
      }
      let data = await this.processDataTendencia(res.tendencia, null, res , datos, fechas)
      return response.status(200).json(data);
    }
    const tendencias = await Query.builder(query, request);
    return response.status(200).json(tendencias);
  }



  async store({ request, response }) {
    const data = request.only(['nombre', 'tipo', 'descripcion', 'tag']);
    const tendencia = await Tendencia.create(data);

    response.status(201).json(tendencia);
  }

  async show({ request, response, params: { id } }) {
    try {
      let { fechas, productos, tiempoReal} = request.get();
      let tendencia = await Tendencia.findOrFail(id);
      let res = {
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
      console.log(fechas)
      const datos = await Adquisicion.tendencias(id, productos , fechas[0], fechas[1])

      if (tiempoReal) {
        await Database.table('tendencias')
          .where('id' , id)
          .update('tiempo_real', false);

        await Database.table('tendencias')
          .where('id', id)
          .update('tiempo_real', true);
      }

      let data = await this.processDataTendencia(tendencia, productos, res , datos, fechas)

      response.status(200).json(data);    
    } catch (error) {
      return console.log('TENDENCIA_GET_ERROR:', error)
    }
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
        .update({ tv: null, tiempo_real: false })
    
      await Database.table('tendencias')
        .where('id', id)
        .update({ tv: data.tv, tiempo_real: true })

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
      query = `SELECT AVG(A.valor) as media, STDEV(A.valor) as std FROM (SELECT TOP ${cantidadHistoricos} fecha, valor FROM [WebStatisticalProcessControl].[dbo].[historicos] WHERE tag = '${
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
   if (codigoProducto) {
    query = `SELECT TOP ${cantidadHistoricos} * FROM [WebStaticalProcessControl].[dbo].[historicos] WHERE tendencia_id = '${
      tendencia.id
    }' AND codigo_producto = ${codigoProducto}`;
    historicos = await Database.raw(query);
  } else {
    historicos = [];
  }
  if (historicos.length >= 1) {
    let valores = [];
    historicos.sort(sortFunction);                                            //Ordena por fecha
    historicos.forEach(element => {                                           //Se obtienen los elementos VALOR de la consulta
      valores.push(element.pv);
    });                                                  //Se calcula la desviacion estandar
    std = mathjs.std(valores);                                                //Se calcula la desviacion estandar
    let sum = valores.reduce((previous, current) => current += previous);     //Se calcula el valor medio
    media = sum / valores.length;

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

    let query = await Limite.query().where('tendencia_id', id).where('end', null).fetch();
    query = query.toJSON()
   // var limites = await Query.builder(query, request);
    response.status(200).json(query);
  }

  async processDataTendencia(tendencia, productos, data , datos, fechas){
      // Consulto tags de tendencia
      let query = Historico
        .query()
        .where('tendencia_id', tendencia ? tendencia.id : '')
        .whereBetween('fecha', fechas);

      let queryCodigoProducto = Historico
        .query()
        .where('tendencia_id', tendencia ? tendencia.id : '')
        .whereBetween('fecha', fechas);

      let queryUltimoCodigoProducto = Historico
        .query()
        .where('tendencia_id', tendencia ? tendencia.id : '')
        .whereBetween('fecha', fechas); 

      if (productos) {
        query.whereIn('codigo_producto', productos);
        queryUltimoCodigoProducto.whereIn('codigo_producto', productos);
      }
      
      let historicos = datos
      let codigoProductoAgrupado = await queryCodigoProducto.select('codigo_producto').groupBy('codigo_producto').fetch();
      codigoProductoAgrupado = codigoProductoAgrupado.toJSON();
      
      codigoProductoAgrupado = codigoProductoAgrupado.map(item => item.codigo_producto);
      let limite = []
      if(productos){
        limite = await Limite.query().where('tendencia_id', tendencia.id).whereIn('codigo_producto', productos).orderBy('id').fetch()
        limite = limite.toJSON()
      }

      var media = []
      var usl = []
      var lsl = []
      var lh_1sigma = []
      var ll_1sigma = []
      var lh_2sigma = []
      var ll_2sigma = []
      var lh_3sigma = []
      var ll_3sigma = []

      if(limite.length > 0 && productos.length > 0){
        for await(const lim of limite){
          const inis = historicos.filter(el => el.fecha > lim.ini)
          const ends = lim.end == null? [historicos[historicos.length-1]] : historicos.filter(el => el.fecha < lim.end)
          if( inis.length > 0){
            media.push([{x: moment(inis[0].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.media},{x: moment(ends[ends.length -1].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.media}])
            usl.push([{x: moment(inis[0].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.usl},{x: moment(ends[ends.length -1].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.usl}])
            lsl.push([{x: moment(inis[0].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.lsl},{x: moment(ends[ends.length -1].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.lsl}])
            lh_1sigma.push([{x: moment(inis[0].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_1sigma},{x: moment(ends[ends.length -1].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_1sigma}])
            ll_1sigma.push([{x: moment(inis[0].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_1sigma},{x: moment(ends[ends.length -1].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_1sigma}])
            lh_2sigma.push([{x: moment(inis[0].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_2sigma},{x: moment(ends[ends.length -1].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_2sigma}])
            ll_2sigma.push([{x: moment(inis[0].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_2sigma},{x: moment(ends[ends.length -1].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_2sigma}])
            lh_3sigma.push([{x: moment(inis[0].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_3sigma},{x: moment(ends[ends.length -1].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_3sigma}])
            ll_3sigma.push([{x: moment(inis[0].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_3sigma},{x: moment(ends[ends.length -1].fecha).format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_3sigma}])
          }       
        }
      }

      limite = limite.length > 0
        ? {
          id:limite[0].id,
          lh_1sigma: lh_1sigma.length > 0 ? lh_1sigma[lh_1sigma.length-1][0].y : null,
          ll_1sigma: ll_1sigma.length > 0 ? ll_1sigma[ll_1sigma.length-1][0].y : null,
          lh_2sigma: lh_2sigma.length > 0 ? lh_2sigma[lh_2sigma.length-1][0].y : null,
          ll_2sigma: ll_2sigma.length > 0 ? ll_2sigma[ll_2sigma.length-1][0].y : null,
          lh_3sigma: lh_3sigma.length > 0 ? lh_3sigma[lh_3sigma.length-1][0].y : null,
          ll_3sigma: ll_3sigma.length > 0 ? ll_3sigma[ll_3sigma.length-1][0].y : null,
          usl: usl.length > 0 ? usl[usl.length-1][0].y : null,
          lsl: lsl.length > 0 ? lsl[lsl.length-1][0].y : null,
          usl_rango: limite[0].usl_rango ? limite[0].usl_rango : 0,
          lsl_rango: limite[0].lsl_rango ? limite[0].lsl_rango : 0,
          media: media.length > 0 ? media[media.length-1][0].y : 0,
          media_rango: limite[0].media_rango ? limite[0].media_rango : 0 ,
          tendencia_id: limite[0].tendencia_id ? limite[0].tendencia_id : null
        }
        : {
          id:null,
          lh_1sigma: null,
          ll_1sigma: null,
          lh_2sigma: null,
          ll_2sigma: null,
          lh_3sigma: null,
          ll_3sigma: null,
          usl: null,
          lsl: null,
          usl_rango: 0,
          lsl_rango: 0,
          media: 0,
          media_rango: 0,
          tendencia_id: null
      }

      // Separo historicos de PV y SP
      let historicosPV = [];
      let historicosSP = [];
      let historicosCP = [];
      let historicosProductos = [];
      let historicosByLimits = [];
 
      historicosPV = historicos.map(item => {
        return {
          fecha: item.fecha,
          pv: item.pv,
          tendencia_id:item.tendencia_id,
          limite_id:item.limite_id,
          codigo_producto:item.codigo_producto
        }
      });

      historicosSP = historicos.map(item => {
        return {
          fecha: item.fecha,
          valor: item.sp,
          tendencia_id:item.tendencia_id,
          limite_id:item.limite_id,
          codigo_producto:item.codigo_producto
        }
      });

      historicosCP = historicos.map(item => {
        return {
          fecha: item.fecha,
          valor: item.codigo_producto,
          tendencia_id:item.tendencia_id,
          limite_id:item.limite_id,
          codigo_producto:item.codigo_producto
        }
      });
      //console.log('HISTORICOS+++++', fechas)
      let historicosFiltered = historicos.map(item => {
        !item.limite_id ? item.limite_id = '-1' : item
        return {...item}
      })

      historicosByLimits = _.groupBy(historicosFiltered, 'limite_id')
    
      let codigoProducto = await Producto.query().whereIn('codigo', codigoProductoAgrupado).fetch();
      codigoProducto = codigoProducto.toJSON();
      historicosProductos = codigoProductoAgrupado
        .map(item => {
          const producto = codigoProducto.find(producto => String(producto.codigo) === String(item))
          return {
            codigo: item,
            descripcion: producto ? producto.descripcion : ''
          }
        });
      // Consulto productos  
      let codigoProductoActual=null
      let productoActual=null
      if(tendencia){
        codigoProductoActual = await Producto.query().where('codigo', tendencia.codigo_producto_actual.trim()).first();
        productoActual = {
          codigo: tendencia.codigo_producto_actual.trim(),
          descripcion: codigoProductoActual ? codigoProductoActual.descripcion : ''
        };        
      }

      let ultimoHistorico = await queryUltimoCodigoProducto.orderBy('fecha', 'desc').first();
      let productoUltimo = {
        codigo: '',
        descripcion: ''
      };
      if (ultimoHistorico) {
        productoUltimo = await Producto.query().where('codigo', ultimoHistorico.codigo_producto).first();
      }
  
      
      let codigoProductoFiltrado = await Producto.query().whereIn('codigo', productos ? productos : [productoUltimo.codigo]).first();
      let productoFiltrado = {
        codigo: '',
        descripcion: ''
      };
      if (codigoProductoFiltrado) {
        productoFiltrado = codigoProductoFiltrado;
      }

      data.desde = fechas[0];
      data.hasta = fechas[1];
      data.historicosPV = historicosPV;
      data.historicosSP = historicosSP;
      data.historicosCP = historicosCP;
      data.historicosProductos = historicosProductos;
      data.productoActual = productoActual;
      data.productoUltimo = productoUltimo;
      data.productoFiltrado = productoFiltrado;
      data.historicosByLimits = historicosByLimits
      data.limite = limite;

      //console.log('HistoricoByLimits:', historicosByLimits)
      return data; 
  }
}

module.exports = TendenciaController;
