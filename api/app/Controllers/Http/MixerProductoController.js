'use strict';

const MixerProducto = use('App/Models/MixerProducto');
const Query = require('../../Utils/Query');
const Database = use('Database');

class MixerProductoController {
  async index({ request, response }) {
    let query = MixerProducto.query();
    const mixerProductos = await Query.builder(query, request);
    response.status(200).json(mixerProductos);
  }

  async store({ request, response }) {
    const data = request.only(['mixer_id', 'producto_id', 'mixers_productos']);

    if (data.mixers_productos.length > 0) {
      await Database.from('mixer_producto').insert(data.mixers_productos);

      response.status(201).json({ status: 'OK', message: 'Registro exitoso!' });
    } else {
      const mixerProducto = await MixerProducto.create({
        mixer_id: data.mixer_id,
        producto_id: data.producto_id
      });

      response.status(201).json(mixerProducto);
    }
  }

  async show({ request, response, params: { id } }) {
    const mixerProducto = await MixerProducto.findOrFail(id);

    if (!mixerProducto) {
      response.status(404).json({
        message: 'Mixer Producto no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(mixerProducto);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['mixer_id', 'producto_id']);
    const mixerProducto = await MixerProducto.find(id);

    if (!mixerProducto) {
      response.status(404).json({
        message: 'Mixer Producto no encontrada.',
        id
      });
      return;
    }
    mixerProducto.mixer_id = data.mixer_id || mixerProducto.mixer_id;
    mixerProducto.producto_id = data.producto_id || mixerProducto.producto_id;
    await mixerProducto.save();

    response.status(200).json(mixerProducto);
  }

  async destroy({ request, response, params: { id } }) {
    const mixerProducto = await MixerProducto.find(id);

    if (!mixerProducto) {
      response.status(404).json({
        message: 'Mixer Producto no encontrada.',
        id
      });
      return;
    }
    await mixerProducto.delete();

    response.status(200).json(mixerProducto);
  }
}

module.exports = MixerProductoController;
