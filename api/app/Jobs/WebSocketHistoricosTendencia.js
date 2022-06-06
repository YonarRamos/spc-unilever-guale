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
          let fechaActual = moment().add(-1,'hours');//await Database.connection('wincc').raw('select  GETDATE() as fecha');
          //fechaActual = fechaActual[0].fecha;
          let historicosPV = [];
          let historicosSP = [];
          let historicosCP = [];
          let historicosByLimits = [];
          let limite = [];
          let datos = {};

          let tendencias = await Tendencia.query()
            .with('producto_actual')
            .with('limites')
            .orderBy('tv', 'DESC')
            .fetch();
          tendencias = tendencias.toJSON();

          const fechas = [
                moment(fechaActual)
                  .add(-500000, 'seconds')
                  .format('YYYY-MM-DD HH:mm:ss'),
                moment(fechaActual)
                  .format('YYYY-MM-DD HH:mm:ss')
          ]
          const tagTendencias = tendencias.map(item => item.id);
          // console.log('Tendencias:', tendencias)
          console.log('tagTendencias:', fechas)
          let historicos = await Historico.query().whereBetween('fecha', fechas).whereIn('tendencia_id', tagTendencias).orderBy('fecha', 'asc').fetch();
          historicos = historicos.toJSON();
          console.log('historicos:', historicos.length)

          historicosPV = historicos.map(item => {
            return {
              fecha: item.fecha,
              pv: item.pv,
              tendencia_id: item.tendencia_id,
              limite_id: item.limite_id,
              codigo_producto:item.codigo_producto
            }
          });
          historicosPV.push(
            {
              fecha: '2022-06-30 11:24:48',
              pv: 800,
              sp: null,
              tk: 2,
              codigo_producto: 16,
              disparo_alarma: false,
              tendencia_id: 37,
              limite_id: 1 
            },{
            fecha: '2022-06-30 11:24:48',
            pv: 900,
            sp: null,
            tk: 2,
            codigo_producto: 16,
            disparo_alarma: false,
            tendencia_id: 26,
            limite_id: 5
          })
          historicosSP = historicos.map(item => {
            return {
              fecha: item.fecha,
              pv: item.pv,
              tendencia_id: item.tendencia_id,
              limite_id: item.limite_id,
              codigo_producto:item.codigo_producto
            }
          });
          
          historicosCP = historicos.map(item => {
            return {
              fecha: item.fecha,
              valor: item.codigo_producto,
              tendencia_id: item.tendencia_id
            }
          });

           if ( tendencias.length > 0 ) {
          
            limite = await Limite.query().whereIn('tendencia_id', tagTendencias).fetch()
            limite = limite.toJSON()
            
            //console.log('LIMITES:', limite)
            var media = []
            var usl = []
            var lsl = []
            var lh_1sigma = []
            var ll_1sigma = []
            var lh_2sigma = []
            var ll_2sigma = []
            var lh_3sigma = []
            var ll_3sigma = []

            if(limite.length > 0){
              for await(const lim of limite){
                const inis = historicos.filter(el => el.fecha > lim.ini)
                const ends = lim.end == null ? [historicos[historicos.length-1]] : historicos.filter(el => el.fecha < lim.end)
                if(inis.length > 0 && ends.length > 0){
                  media.push([{x: moment(inis[0].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.media},{x: moment(ends[ends.length-1].fecha).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),y: lim.media}])
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
          }
          limite.length > 0
          ? 
          datos.limite = {
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
          : datos.limite = {
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


        let historicosFiltered = historicos.map(item => {
          !item.limite_id ? item.limite_id = -1 : item
          return {...item}
        })
  
        historicosByLimits = _.groupBy(historicosFiltered, 'limite_id')

        datos.historicosSP = historicosSP
        datos.historicosCP = historicosCP
        datos.historicosPV = historicosPV
        datos.historicosByLimits = historicosByLimits
        datos.tendencia = null
      
        // Emito por socket a todos los usuarios
        try {
          //console.log('Datos:', datos);
          Ws.getChannel('socket')
            .topic('socket')
            .broadcastToAll('tendencias', datos);
        } catch (error) {
          console.log('No hay usuarios subcriptos al socket');
        }

        console.log('historicosByLimits:',historicosByLimits)
        return Promise.resolve(fechaActual);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
