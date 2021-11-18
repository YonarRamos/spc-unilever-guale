'use strict';

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

const Ws = use('Ws');
const Alarma = use('App/Models/Alarma');
const Tendencia = use('App/Models/Tendencia');

try {
  Ws.channel('socket', async ({ socket, auth }) => {
    console.log('Se ha unido un usuario ID: %s', socket.id, 'Topic:', socket.topic);

    try {
      // Cuento cantidad de alarmas sin reconocer y emito
      const cantidadAlarmSinReconocer = await Alarma.query()
        .where('reconocida', false)
        .getCount();
      socket.broadcastToAll('cantidad_alarmas_sin_reconocer', cantidadAlarmSinReconocer)

      // // Emito ultimo valor del socket
      // let tendencias = await Redis.get('tendencias');
      // tendencias = JSON.parse(tendencias);
      // socket.broadcastToAll('tendencias', tendencias);
    } catch (error) {
      console.log(error);
    }
    try {
      // Cuento cantidad de alarmas sin reconocer y emito
      let TendeciaTV = await Tendencia.query()
        .where('tv' , 'is not', null).fetch()
        TendeciaTV = TendeciaTV.toJSON();
      let arrGroup = TendeciaTV.map(item =>{
      //  console.log(item)
        return {
          "tendencia": item.id,
          "actualizacion": true,
          "codigo_producto_actual": item.codigo_producto_actual,
          "tv": item.tv
        }
      })
      const resp = await Promise.all(arrGroup)
     //console.log(resp + 'respuesta')
      socket.broadcastToAll('tendencias', resp)

      // // Emito ultimo valor del socket
      // let tendencias = await Redis.get('tendencias');
      // tendencias = JSON.parse(tendencias);
      // socket.broadcastToAll('tendencias', tendencias);
    } catch (error) {
      console.log(error);
    }
  });
} catch (error) {
  Ws.close();
}





