'use strict';

const Alarma = use('App/Models/Alarma');
const Ws = use('Ws');
const Query = require('../../Utils/Query');

class AlarmaController {
  async index({ request, response }) {
    let query = Alarma.query();
    const alarmas = await Query.builder(query, request);
    response.status(200).json(alarmas);
  }

  async reconocer({ request, response, params: { id } }) {
    const data = request.only(['detalle']);
    const alarma = await Alarma.find(id);

    if (!alarma) {
      response.status(404).json({
        message: 'Alarma no encontrada.',
        id
      });
      return;
    }
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
}

module.exports = AlarmaController;
