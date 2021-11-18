'use strict';

const _ = require('lodash');
const moment = require('moment');
const Limite = use('App/Models/Limite');
const Database = use('Database');

var FormateaDatos = {
  historicos(datos) {
    let historicos = [];
    let pv, sp, tk, codigo_producto;
    const datosAgrupadosPorBloqueId = _.groupBy(datos, 'tag_name');

    for (const keyA in datosAgrupadosPorBloqueId) {
      const datosAgrupadosPorFecha = _.groupBy(datosAgrupadosPorBloqueId[keyA], 'Timestamp');

      for (const keyB in datosAgrupadosPorFecha) {
        pv = datosAgrupadosPorFecha[keyB].find(item => {
          if (parseInt(item.Tipo) === 1) {
            return true;
          }
          return false;
        });

        sp = datosAgrupadosPorFecha[keyB].find(item => {
          if (parseInt(item.Tipo) === 2) {
            return true;
          }
          return false;
        });

        tk = datosAgrupadosPorFecha[keyB].find(item => {
          if (parseInt(item.Tipo) === 3) {
            return true;
          }
          return false;
        });

        codigo_producto = datosAgrupadosPorFecha[keyB].find(item => {
          if (parseInt(item.Tipo) === 1) {
            return true;
          }
          return false;
        });

        let fecha = new Date(keyB);
        fecha = moment(fecha).format('YYYY-MM-DD HH:mm:ss');
        historicos.push({
          fecha: fecha,
          pv: pv ? pv.RealValue : null,
          sp: sp ? sp.RealValue : null,
          tk: codigo_producto.tk,
          codigo_producto: codigo_producto ? codigo_producto.codigo_producto : null,
          tendencia_id: codigo_producto.tendecia_id,
          disparo_alarma: false
        });
      }
    }
    return historicos;
  },
  async sockets(historicos, tendencias, desde, hasta) {
    

    let item = {
      desde,
      hasta,
      tendencia: {
        id: tendencias.id,
        nombre: tendencias.nombre,
        tag: tendencias.tag
      },
      limites: tendencias.limites
    };
    
    // item.historicos = historico;
    item.historicosPV = historicos.map(item => {
      return {
        fecha: item.fecha,
        valor: item.pv
      };
    });
    item.historicosSP = historicos.map(item => {
      return {
        fecha: item.fecha,
        valor: item.sp
      };
    });

    let historicosProductos = await Database.table('historicos')
      .select('codigo_producto_actual')
      .where('tendencia_id', item.tendencia.id)
      .groupBy('codigo_producto_actual')
      .orderBy('codigo_producto_actual', 'DESC');
    item.historicosProductos = historicosProductos
      .map(producto => producto.codigo_producto)
      .filter(producto => producto);

    // Cuento cantidad de historicos que dispararon alarmas
    const cantidadAlarmasDisparadas = historicos.filter(historico => {
      if (historico.disparo_alarma) {
        return true;
      }
    });
    item.cantidad_alarmas = cantidadAlarmasDisparadas.length;

    // Agrego codigo de producto actual
    item.productoActual = tendencias.producto_actual ? tendencias.producto_actual : null;


  // Ordenos datos segun la cantidad de alarmas que generaron
  /* datos = datos.sort((a, b) => {
      if (a.cantidad_alarmas > b.cantidad_alarmas) {
        return 1;
      }

      if (a.cantidad_alarmas < b.cantidad_alarmas) {
        return -1;
      }

      return 0;
     });*/

    return item;
  },
  async filtraDatos(sinFiltrar, filtro){
    return new Promise(async function (resolve, reject) {
      try {
        var itemFiltrado = []
        //Orenamos el filtro por Timestamp
        var filtroOrdenado = _.orderBy(filtro, 'Timestamap', 'DESC')
        var sinFiltrarOrdenado = _.orderBy(sinFiltrar, 'Timestamap', 'DESC')
        for await(const item of filtroOrdenado){
          const aux = sinFiltrarOrdenado.filter(element => element.Timestamp <= item.Timestamp)
          itemFiltrado.push(aux[aux.length-1])
        }
        resolve(itemFiltrado)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    });
  },
  async FormateaDatos(datos){
    return new Promise(async function (resolve, reject) {
      try {
        var response = []
        var index = 0
        const sp = datos.sp.length > 0 ? true : false
        const cp = datos.cp.length > 0 ? true : false
        for await(const pv of datos.pv){
          response.push({
            fecha: moment(pv.Timestamp).format('YYYY-MM-DD HH:mm:ss'),
            pv: parseFloat((pv.ValueFloat).toFixed(2)),
            sp: sp ? parseFloat((datos.sp[index].ValueFloat).toFixed(2)) : null,
            tk: datos.tk,
            codigo_producto: cp ? datos.cp[index].ValueFloat : null,
            tendencia_id: datos.tendencia_id,
            disparo_alarma: false,
            limite_id: null
          })
          index++
        }
        resolve(response)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    });
  }
};

module.exports = FormateaDatos;
