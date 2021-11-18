    'use strict';

    const Tendencia = use('App/Models/Tendencia');
    const Historico = use('App/Models/Historico');
    const Limite = use('App/Models/Limite');
    const Tag = use('App/Models/Tag');
    const TomaDatos = require('../Services/TomaDatos');
    const FormateaDatos = require('../Utils/FormateaDatos');
    const FechaAdquisicion = require('../Utils/FechaAdquisicion');
    const ReglasDatos = require('../Utils/ReglasDatos');
    const _ = require('lodash');
    const moment = require('moment');
    const Database = use('Database');
    const Ws = use('Ws');

    module.exports = {
      async start() {
        try {
          console.time('WebSocket emit historicos...');
          let fechaActual = moment();//await Database.connection('wincc').raw('select  GETDATE() as fecha');
          //fechaActual = fechaActual[0].fecha;
          
          let datos = [];
          let tendencias = await Tendencia.query()
            //.with('producto_actual')
          // .with('limites')
            .orderBy('tv', 'DESC')
            .fetch();
          tendencias = tendencias.toJSON();

          const fechas = [
                moment(fechaActual)
                  .add(-10, 'seconds')
                  .format('YYYY-MM-DD HH:mm:ss'),
                moment(fechaActual)
                  .format('YYYY-MM-DD HH:mm:ss')
              ]
          const tagTendencias = tendencias.map(item => item.id);
          let historicos = await Historico.query().whereBetween('fecha', fechas).whereIn('tendencia_id', tagTendencias).orderBy('fecha', 'asc').fetch();
          historicos = historicos.toJSON();
           if ( tendencia.lenght > 0 ) {
             let limite = []
            if(producto){
              limite = await Limite.query().where('tendencia_id', tendencia.id).where('codigo_producto', producto).fetch()
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
            if(limite.length > 0 && producto){
              for await(const lim of limite){
                const inis = historicos.filter(el => el.fecha > lim.ini)
                const ends = lim.end == null? [historicos[historicos.length-1]] : historicos.filter(el => el.fecha < lim.end)
                if(inis.length > 0){
                  media.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.media},{x: moment(ends[ends.length -1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.media}])
                  usl.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.usl},{x: moment(ends[ends.length -1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.usl}])
                  lsl.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.lsl},{x: moment(ends[ends.length -1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.lsl}])
                  lh_1sigma.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_1sigma},{x: moment(ends[ends.length -1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_1sigma}])
                  ll_1sigma.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_1sigma},{x: moment(ends[ends.length -1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_1sigma}])
                  lh_2sigma.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_2sigma},{x: moment(ends[ends.length -1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_2sigma}])
                  ll_2sigma.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_2sigma},{x: moment(ends[ends.length -1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_2sigma}])
                  lh_3sigma.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_3sigma},{x: moment(ends[ends.length -1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.lh_3sigma}])
                  ll_3sigma.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_3sigma},{x: moment(ends[ends.length -1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.ll_3sigma}])
                }
                
              }
            }
            limite = limite.length > 0
              ? {
                  lh_1sigma: lh_1sigma,
                  ll_1sigma: ll_1sigma,
                  lh_2sigma: lh_2sigma,
                  ll_2sigma: ll_2sigma,
                  lh_3sigma: lh_3sigma,
                  ll_3sigma: ll_3sigma,
                  usl: usl,
                  lsl: lsl,
                  usl_rango: limite[0].usl_rango,
                  lsl_rango: limite[0].lsl_rango,
                  media: media,
                  media_rango: limite[0].media_rango,
                  tendencia_id: limite[0].tendencia_id
              }
              : {
                lh_1sigma: lh_1sigma,
                ll_1sigma: ll_1sigma,
                lh_2sigma: lh_2sigma,
                ll_2sigma: ll_2sigma,
                lh_3sigma: lh_3sigma,
                ll_3sigma: ll_3sigma,
                usl: usl,
                lsl: lsl,
                usl_rango: 0,
                lsl_rango: 0,
                media: media,
                media_rango: 0,
                tendencia_id: 0
            }
          }
          // Emito por socket a todos los usuarios
          try {
            console.log(datos);
            Ws.getChannel('socket')
              .topic('socket')
              .broadcastToAll('tendencias', datos);
          } catch (error) {
            console.log('No hay usuarios subcriptos al socket');
          }

          console.timeEnd('WebSocket emit historicos...');
          return Promise.resolve(fechaActual);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    };
