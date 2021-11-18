'use strict';

const Database = use('Database');
const Mixer = use('App/Models/Mixer');
const Query = require('../../Utils/Query');

class MixerController {
  async index({ request, response }) {
    let query = Mixer.query();
    const mixers = await Query.builder(query, request);
    response.status(200).json(mixers);
  }

  async store({ request, response }) {
    const data = request.only(['nombre', 'descripcion']);
    const mixer = await Mixer.create(data);

    response.status(201).json(mixer);
  }

  async show({ request, response, params: { id } }) {
    const mixer = await Mixer.findOrFail(id);

    if (!mixer) {
      response.status(404).json({
        message: 'Mixer no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(mixer);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['nombre', 'descripcion']);
    const mixer = await Mixer.find(id);

    if (!mixer) {
      response.status(404).json({
        message: 'Mixer no encontrada.',
        id
      });
      return;
    }
    mixer.nombre = data.nombre || mixer.nombre;
    mixer.descripcion = data.descripcion || mixer.descripcion;
    await mixer.save();

    response.status(200).json(mixer);
  }

  async destroy({ request, response, params: { id } }) {
    const mixer = await Mixer.find(id);

    if (!mixer) {
      response.status(404).json({
        message: 'Mixer no encontrada.',
        id
      });
      return;
    }
    await mixer.delete();

    response.status(200).json(mixer);
  }

  async relationsProductos({ request, response, params: { id } }) {
    const data = request.only(['productos']);

    const transaction = await Database.transaction(async trx => {
      await trx
        .table('mixer_producto')
        .where('mixer_id', id)
        .delete();

      const mixersProductos = data.productos.map(producto_id => {
        return {
          mixer_id: id,
          producto_id: producto_id
        };
      });
      await Database.from('mixer_producto').insert(mixersProductos);
      return mixersProductos;
    });

    response.status(200).json(transaction);
  }

  async indexProductos({ request, response, params: { id } }) {
    const mixer = await Mixer.findOrFail(id);

    if (!mixer) {
      response.status(404).json({
        message: 'Mixer no encontrada.',
        id
      });
      return;
    }

    let query = mixer.productos();
    const mixers = await Query.builder(query, request);
    response.status(200).json(mixers);
  }
}

module.exports = MixerController;
