'use strict';

const Destinatario = use('App/Models/Destinatario');
const Query = require('../../Utils/Query');

class DestinatarioController {
  async index({ request, response }) {
    let query = Destinatario.query();
    const destinatarios = await Query.builder(query, request);
    response.status(200).json(destinatarios);
  }

  async store({ request, response }) {
    const data = request.only(['email', 'nombre', 'apellido', 'envio']);
    const destinatario = await Destinatario.create(data);

    response.status(201).json(destinatario);
  }

  async show({ request, response, params: { id } }) {
    const destinatario = await Destinatario.findOrFail(id);

    if (!destinatario) {
      response.status(404).json({
        message: 'Destinatario no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(destinatario);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['email', 'nombre', 'apellido', 'envio']);
    const destinatario = await Destinatario.find(id);

    if (!destinatario) {
      response.status(404).json({
        message: 'Destinatario no encontrada.',
        id
      });
      return;
    }
    destinatario.email = data.email || destinatario.email;
    destinatario.nombre = data.nombre || destinatario.nombre;
    destinatario.apellido = data.apellido || destinatario.apellido;
    destinatario.envio = data.envio ? true : false;
    await destinatario.save();

    response.status(200).json(destinatario);
  }

  async destroy({ request, response, params: { id } }) {
    const destinatario = await Destinatario.find(id);

    if (!destinatario) {
      response.status(404).json({
        message: 'Destinatario no encontrada.',
        id
      });
      return;
    }
    await destinatario.delete();

    response.status(200).json(destinatario);
  }
}

module.exports = DestinatarioController;
