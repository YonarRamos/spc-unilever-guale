'use strict';

const Tendencia = use('App/Models/Tendencia');
const Limite = use('App/Models/Limite');
const Historico = use('App/Models/Historico');
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
  async datos() {
    try {
      console.time('Adquiriendo datos de WINCC');
      const winCC = new WinCC();
      const fechaActual = moment().subtract(11, 'minutes')//await Database.connection('wincc').raw('SELECT GETDATE()');
      await Database.truncate('producto_actual');
      console.log(fechaActual)
      
      // Consulto codigo de productos actuales
      let archiveIdCodigosProductos = await Tag.query()
        .where('tipo', 6)
        .with('tendencias')
        .fetch();
      archiveIdCodigosProductos = archiveIdCodigosProductos.toJSON();
      let productosActuales = await winCC.getHistoricos(
        archiveIdCodigosProductos,
        moment(fechaActual)
          .add(-1, 'seconds')
          .format('YYYY-MM-DD HH:mm:ss'),
        moment(fechaActual).format('YYYY-MM-DD HH:mm:ss')
      );

      let tagTotales = await Tag.query().with('tendencias').fetch()
      tagTotales = tagTotales.toJSON();
     
      //Actualiza los codigos de productos en tendencias
      productosActuales = productosActuales.map(async function (producto) {
        await Database.table('tendencias').where('tag_codigo_producto', producto.Archive_ID).update('codigo_producto_actual', producto.RealValue);
      });

      // Consulto tendencias con sus relaciones necesarias
    
      let tendencias = await Tendencia.query() 
      
        .with('productos')
        .with('tags')
        //.with('codigo_producto_actual')
        .with('limites')
        .where('tipo', 'STAX')
        .orderBy('tv', 'DESC')
        .fetch();
      
      tendencias = tendencias.toJSON();
      tendencias = tendencias.map(tendencia => {
        if (tendencia.producto_actual) {
          tendencia.producto_actual =
            tendencia.producto_actual.length > 0 ? tendencia.producto_actual[0] : null;
        } else {
          tendencia.producto_actual = null
        }

        return tendencia;
      });
      const tendenciasAgrupadas = _.groupBy(tendencias, 'tag_codigo_producto');

      // Verifico cual fue la utlima actualizacion y actualizo hasta ahora
      const ultimaTendenciaActualizada = await Tendencia.query()
        .where('tipo', 'STAX')
        .orderBy('ultima_actualizacion', 'ASC')
        .first();
      const desde = moment(ultimaTendenciaActualizada.ultima_actualizacion).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      const hasta = moment(fechaActual).format('YYYY-MM-DD HH:mm:ss');

      // Armo un array con trozos de fechas, intervalor de 1 hora, para no saturar OS
      const arrayIteraciones = await FechaAdquisicion.arrayIteraciones(desde, hasta);

      // Recorro array y traigo historicos necesarios
      for (let fecha of arrayIteraciones) {
        console.time('Adquisicio datos');
        console.log(fecha.desde, fecha.hasta);

        let historicosFiltradoTotal = [];
        for (const key in tendenciasAgrupadas) {
          

          // Agrupo tag y extraigo varibles
          if (parseInt(key) >= 0) {
            let productosTramo = await winCC.getHistoricos(archiveIdCodigosProductos,fecha.desde, fecha.hasta);
            productosTramo = productosTramo.map(async function (producto) {
              await Database.table('tendencias').where('tag_codigo_producto', producto.Archive_ID).update('codigo_producto_actual', producto.RealValue);
            });

            // Consulto historicos de las variables de los tag agrupados
            const historicos = await winCC.getHistoricos(tagTotales, fecha.desde, fecha.hasta);

            // Agrupo historicos y divido por los que se encuentran filtrados en sistemas y los que no
            const historicosAgrupados = _.groupBy(historicos, 'Filtrado');
            let historicosFiltrado = historicosAgrupados[true] || [];
            let historicosSinFiltrar = historicosAgrupados[false] || [];

            // Si existen historicos sin filtrar, filtro con respecto a historicos tipo = 5
            if (historicosSinFiltrar.length > 0) {
              const filtroDeHistoricos = historicosFiltrado.filter(
                historico => historico.Tipo === 5
              );
              filtroDeHistoricos.forEach(historico => {
                const historicoFiltrado = historicosSinFiltrar.find(item => {
                  if (item.Timestamp === historico.Timestamp) {
                    return true;
                  }
                });
                if (historicoFiltrado) {
                  historicosFiltrado.push(historicoFiltrado);
                }
              });
            }

            // Una vez usado los historicos Tipo = 5 para filtrar los quitos
            historicosFiltrado = historicosFiltrado.filter(historico => historico.Tipo != 5 && historico.Tipo != 6);
            // Agrega a los historicos filtrados el codigo de producto
           /* const historicosCodigoProducto = await winCC.getHistoricos(
              key,
              fecha.desde,
              fecha.hasta
            );

            historicosFiltrado.forEach(historico => {
              if (historico.Tipo === 1) {
                let producto = historicosCodigoProducto.find(item => {
                  if (item.Timestamp === historico.Timestamp) {
                    return true;
                  }
                });
                if (producto) {
                  historicosFiltrado.push({
                    Timestamp: historico.Timestamp,
                    Archive_ID: historico.Archive_ID,
                    RealValue: producto.RealValue,
                    Bloque_ID: historico.Bloque_ID,
                    Tipo: 6,
                    Filtrado: true
                  });
                }
              }
            }); */
            historicosFiltradoTotal = historicosFiltradoTotal.concat(historicosFiltrado);
          }
        }
        // Formatea datos
        const historicosFormateado = FormateaDatos.historicos(historicosFiltradoTotal);
      
        // Verfico si los historicos cumplen con las reglas (TRATAR DE MEJOR A FUTURO - COMPLEJIDA N SEGUN LA CANTIDAD DE HISTORICOS)
        let i = 0;
        for (const historico of historicosFormateado) {
          const tendencia = tendencias.find(tendencia => tendencia.id === historico.tendencia_id);
          if (tendencia) {
            const limites = tendencia.limites;

            const limite = limites.find(
              limite => limite.codigo_producto === historico.codigo_producto
            );

            if (limite) {
              // Verifico regla para ver si pasa los limites
              const alarma = await ReglasDatos.sobrepasaLimite(historico, limite);

              // Si existe alarma indico que el historico disparo una alarma y envio un email notificando
              if (alarma) {
                historicosFormateado[i].disparo_alarma = true;
              }
            }
          }

          i = i + 1;
        }

        // Guardo historicos en DB

        await Database.from('historicos').insert(historicosFormateado);
        await Database.table('tendencias').update('ultima_actualizacion', fecha.hasta);

        // Formateo datos para emitir por socket
        let datos = await FormateaDatos.sockets(
          historicosFormateado,
          tendencias,
          fecha.desde,
          fecha.hasta
        );

        // Emito por socket a todos los usuarios
        try {
          // console.log(datos);
          Ws.getChannel('socket')
            .topic('socket')
            .broadcastToAll('tendencias', datos);
        } catch (error) {
          console.log('No hay usuarios subcriptos al socket');
        }

        console.timeEnd('Adquisicio datos');
      }

      console.timeEnd('Adquiriendo datos de WINCC');

      return Promise.resolve(hasta);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async tendencias(id, producto , desde, hasta) {
    try {
      if(producto){
        let historicos = await Historico.query().where({tendencia_id : id , codigo_producto : producto}).whereBetween('fecha',[desde, hasta]).fetch()
        historicos = historicos.toJSON()
        return Promise.resolve(historicos);
      }else{
        let historicos = await Historico.query().where({tendencia_id : id}).whereBetween('fecha',[desde, hasta]).fetch()
        historicos = historicos.toJSON()
        return Promise.resolve(historicos);
      }
     
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async tomaDatos(tipo){
    try {
      const fechaActual = await Database.connection('historian').raw('SELECT GETDATE() AS date');
      console.log(fechaActual)
      //Chequeo dentro de los limites si la tendencia asociada es de adquisicion
      var tendencias = await Tendencia.query().where('tiempo_real', tipo).with('mixer').with('sp').with('pv').with('codigo_producto').with('limites').with('filtro').fetch()
      tendencias = tendencias.toJSON()
      //Agrupo por ultima actualizacion
      const tendenciasAgrupadas = _.groupBy(tendencias, 'ultima_actualizacion')
      //Genero las iteraciones de tiempo para trabajar los datos
      for(const key in tendenciasAgrupadas){
        const iteraciones = await FechaAdquisicion.arrayIteraciones(key, moment(fechaActual[0].date).format('YYYY-MM-DD HH:mm:ss'))
        //Consulto al historian la info de las tendencias necesarias en el rango de fecha
        for await(const fecha of iteraciones){
          const valuesAgrupados = await TomaDatos.getData(tendenciasAgrupadas[key], fecha.desde, fecha.hasta)   
          //Proceso los datos revisando si hay que filtrar
          for await(const variable of tendenciasAgrupadas[key]){
          
            //Tomo los datos por cada tendencia
            const datosSP = variable.sp ? valuesAgrupados[`${variable.sp.tag_name}`] : undefined
            var datosPV = variable.pv ? valuesAgrupados[`${variable.pv.tag_name}`] : undefined
            var datosCP = variable.tag_codigo_producto ? valuesAgrupados[`${variable.codigo_producto.tag_name}`] : undefined
            var datosFT = variable.tag_filtro ? valuesAgrupados[`${variable.filtro.tag_name}`] : []
            //Chequeo que tenga algun PV, si la tendencia no tiene PV ni la muestro
            if(datosPV !== undefined){
              if(datosPV.length > 0){
                var datosFiltrados = {tendencia_id: variable.id, tk: variable.mixer_id, sp: [], pv: [], cp: [], filtro: []}
               
                var datosNoFiltrados = {sp: [], pv: [], cp: []}

                //Separo los filtrados y no filtrados, Si hay algun no filtrado lo trabajo
                if(variable.sp){variable.sp.filtrado == true ? datosFiltrados.sp = datosSP : datosNoFiltrados.sp = datosSP}
                if(variable.pv) {variable.pv.filtrado == true ? datosFiltrados.pv = datosPV : datosNoFiltrados.pv = datosPV}
                if(variable.codigo_producto){variable.codigo_producto.filtrado == true ? datosFiltrados.codigo_producto = datosCP : datosNoFiltrados.cp = datosCP}
  
                //Si hay algun datos sin filtrar lo filtro
                if(datosNoFiltrados.sp.length > 0){
                  var filtro = []
                  if(variable.filtro && datosFT !== undefined){
                    filtro = datosFT
                  }else{
                    if(datosFiltrados.pv.length > 0){
                      filtro = datosFiltrados.pv
                    }else if(datosFiltrados.cp.length > 0){
                      filtro = datosFiltrados.cp
                    }
                  }
                  if(filtro.length > 0){
                    datosFiltrados.sp = await FormateaDatos.filtraDatos(datosNoFiltrados.sp, filtro)
                  }
                }
                if(datosNoFiltrados.pv.length > 0){
                  var filtro = []
                  if(variable.filtro && datosFT !== undefined){
                    
                    filtro = datosFT
                  }else{
                    if(datosFiltrados.sp.length > 0){
                      filtro = datosFiltrados.sp
                    }else if(datosFiltrados.cp.length > 0){
                      filtro = datosFiltrados.cp
                    }
                  }
                  if(filtro.length > 0){
                    datosFiltrados.pv = await FormateaDatos.filtraDatos(datosNoFiltrados.pv, filtro)
                  }
                }
                  
                if(datosNoFiltrados.cp.length > 0){
                  var filtro = []
                  if(variable.filtro&& datosFT !== undefined){
                    filtro = datosFT
                  }else{
                    if(datosFiltrados.sp.length > 0){
                      filtro = datosFiltrados.sp
                    }else if(datosFiltrados.pv.length > 0){
                      filtro = datosFiltrados.pv
                    }
                  }
                  if(filtro.length > 0){
                    datosFiltrados.cp = await FormateaDatos.filtraDatos(datosNoFiltrados.cp, filtro)
                  }
                }
                const formateado = await FormateaDatos.FormateaDatos(datosFiltrados)
                //Si las tendencias con valores tienen limite asociado chequeo si le corresponde y lo agrego
                if(variable.limites.length > 0){
                  var arrLimites = formateado.map(async function (item) {
                    const filtrado = variable.limites.filter(element => element.codigo_producto.split(';').includes(item.codigo_producto))
                    const limiteDeTendencia = filtrado.length > 0 ? filtrado[0] : variable.limites[variable.limites.length -1]
                    item.limite_id = limiteDeTendencia.id
                    //Al tener alarma reviso el limite
                    const alarma = await ReglasDatos.sobrepasaLimite(item, limiteDeTendencia);
                    if(alarma){item.disparo_alarma = true}
                  })
                  await Promise.all(arrLimites)
                  
                }
                // Guardo historicos en DB
                await Historico.createMany(formateado);
                await Database.table('tendencias').update({'ultima_actualizacion': fecha.hasta , 'codigo_producto_actual': formateado[formateado.length -1].codigo_producto}).where('id', variable.id);
                if( tipo == true){
                    
                    // Formateo datos para emitir por socket
                  /*let datos = await FormateaDatos.sockets(
                    formateado,
                    variable,
                    fecha.desde,
                    fecha.hasta
                  );*/

                  const datos = {
                    "tendencia": variable.id,
                    "actualizacion": true,
                    "codigo_producto_actual": formateado[formateado.length -1].codigo_producto,
                    "tv": variable.tv
                  }

                  // Emito por socket a todos los usuarios
                  try {
                    // console.log(datos);
                    Ws.getChannel('socket')
                      .topic('socket')
                      .broadcastToAll('tendencias', datos);
                  } catch (error) {
                    //console.log('No hay usuarios subcriptos al socket');
                  }
                }
              }
            }else{
              await Database.table('tendencias').update('ultima_actualizacion', fecha.hasta).where('id', variable.id);
            }

          }
        }
      }

    } catch (error) {
      console.log(error)
    }
  }
};
