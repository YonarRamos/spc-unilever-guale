'use strict';

const Alarma = use('App/Models/Alarma');
const Ws = use('Ws');
const Query = require('../../Utils/Query');

class AlarmaController {

  async index({ request, response }) {
    try {
      let { page, perPage, sortBy, descending, tendencia_id, fechas, desde, hasta, mostrar } = request.all()
      page = parseInt(page) || 1
      perPage = parseInt(perPage) || 10
      sortBy = sortBy || 'fecha_creada'
      descending = descending ? 'DESC' : 'ASC'
      tendencia_id = tendencia_id || null
      fechas = fechas || []

      let query = Alarma.query();

      if(tendencia_id){
        query.where('tendencia_id', tendencia_id)
      }
      if(desde){
        query.where('fecha_creada', '>' , desde)
      }
      if(hasta){
        query.where('fecha_creada', '<' , hasta)
      }
      if(mostrar >= 0){
        query.where('reconocida', mostrar)
      }

      const res = await query.leftJoin('users', 'alarmas.usuario', 'users.id').with('tendencia').with('descripcion_alarma').orderBy(sortBy, descending).paginate(page, perPage)

      let alarmas = res.toJSON()
      /* alarmas.data = alarmas.data.map( item => {
        let id = item.id[0]
        delete item.id
        return {id, ...item}
      }) */
      console.log('alarmars:', alarmas)
      response.status(200).json(alarmas);      
    } catch (error) {
      console.log('ALARM_INDEX:', error)
    }
  }

  async reconocer({ request, response, params: { id } }) {
    const data = request.all();
    const alarma = await Alarma.find(id);

    if (!alarma) {
      return response.status(404).json({
        message: 'Alarma no encontrada.',
        id
      });
    }
    alarma.usuario = data.user_id || alarma.usuario;
    alarma.reconocida = true;
    alarma.detalle = data.detalle || alarma.detalle;

    try {
      Ws.getChannel('socket')
        .topic('socket')
        .broadcastToAll('cantidad_alarmas_sin_reconocer', cantidadAlarmSinReconocer - 1);
    } catch (error) {
      console.log('No hay usuarios subcriptos al socket');
    }

    await alarma.save();

    response.status(200).json(alarma);
  }
  async noReconocidasCount({ request, response }) {
    try {
      const count = await Alarma.query().where('reconocida', 0).getCount()
      console.log('count:', count)
      return response.status(200).json(count);      
    } catch (error) {
      console.log('ALARM_INDEX:', error)
    }
  }
}

module.exports = AlarmaController;
