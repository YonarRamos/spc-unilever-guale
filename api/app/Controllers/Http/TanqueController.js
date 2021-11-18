'use strict';

const Tanque = use('App/Models/Tanque');
const Query = require('../../Utils/Query');

class TanqueController {
  async index({ request, response }) {
    let query = Tag.query();
    const tanques = await Query.builder(query, request);
    response.status(200).json(tanques);
  }

  async store({ request, response }) {
    const data = request.only(['numero', 'nombre', 'descripcion']);
    const tanque = await Tanque.create(data);

    response.status(201).json(tanque);
  }

  async show({ request, response, params: { id } }) {
    const tanque = await Tanque.findOrFail(id);

    if (!tanque) {
      response.status(404).json({
        message: 'Tanque no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(tanque);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['numero', 'nombre', 'descripcion']);
    const tanque = await Tanque.find(id);

    if (!tanque) {
      response.status(404).json({
        message: 'Tanque no encontrada.',
        id
      });
      return;
    }
    tanque.numero = data.numero || tanque.numero;
    tanque.nombre = data.nombre || tanque.nombre;
    tanque.descripcion = data.descripcion || tanque.descripcion;
    await tanque.save();

    response.status(200).json(tanque);
  }

  async destroy({ request, response, params: { id } }) {
    const tanque = await Tanque.find(id);

    if (!tanque) {
      response.status(404).json({
        message: 'Tanque no encontrada.',
        id
      });
      return;
    }
    await tanque.delete();

    response.status(200).json(tanque);
  }
}

module.exports = TanqueController;
